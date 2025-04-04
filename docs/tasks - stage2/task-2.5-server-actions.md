# Задача 2.5: Оптимизация производительности через Server Actions

## Описание

Next.js Server Actions позволяют выполнять интенсивные операции на стороне сервера, а не клиента, что может значительно улучшить производительность приложения. Эта технология позволяет уменьшить объем JavaScript, который нужно загружать и выполнять в браузере, и оптимизировать обработку данных. Задача заключается в реализации Server Actions для критических операций приложения, особенно тех, которые связаны с обработкой данных Firebase.

## Шаги выполнения

1. **Анализ текущей кодовой базы:**
   - Выявить функции и операции, которые активно используются в клиентском коде, но могут быть перенесены на сервер
   - Определить критичные операции, требующие доступа к Firebase и обработки данных
   - Приоритизировать функции, перенос которых даст наибольший выигрыш в производительности

2. **Настройка инфраструктуры для Server Actions:**
   - Обновить конфигурацию Next.js для поддержки Server Actions
   - Настроить среду выполнения серверных функций
   - Подготовить механизмы авторизации и аутентификации для серверных действий

3. **Реализация Server Actions для работы с данными:**
   - Создать серверные действия для операций чтения и записи в Firebase
   - Разработать механизмы валидации данных на стороне сервера
   - Реализовать обработку ошибок и возврат данных клиенту

4. **Оптимизация компонентов для использования Server Actions:**
   - Адаптировать формы и интерактивные элементы для использования серверных действий
   - Внедрить прогрессивное улучшение для обеспечения работы при отключенном JavaScript
   - Оптимизировать UX при взаимодействии с Server Actions

5. **Тестирование и оценка производительности:**
   - Провести нагрузочное тестирование Server Actions
   - Измерить влияние на метрики производительности приложения
   - Выявить узкие места и оптимизировать их

## Пример конфигурации Next.js для Server Actions

```typescript
// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: true,
  },
  // Другие настройки...
};

module.exports = nextConfig;
```

## Пример Server Action для получения данных пользователя

```typescript
// src/app/actions/user.ts
'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { getFirebaseAdmin } from '@/lib/api/firebase/admin';
import { revalidatePath } from 'next/cache';

/**
 * Получение данных текущего пользователя
 */
export async function getCurrentUser() {
  const cookieStore = cookies();
  const sessionCookie = cookieStore.get('session')?.value;
  
  if (!sessionCookie) {
    return null;
  }
  
  try {
    const firebaseAdmin = getFirebaseAdmin();
    const decodedClaims = await firebaseAdmin.auth().verifySessionCookie(sessionCookie);
    
    // Получение дополнительных данных пользователя из Firestore
    const userDoc = await firebaseAdmin
      .firestore()
      .collection('users')
      .doc(decodedClaims.uid)
      .get();
    
    if (!userDoc.exists) {
      return null;
    }
    
    return {
      uid: decodedClaims.uid,
      email: decodedClaims.email,
      ...userDoc.data(),
    };
  } catch (error) {
    // Удаляем недействительную cookie
    cookies().delete('session');
    return null;
  }
}

/**
 * Server Action для выхода пользователя
 */
export async function logoutAction() {
  cookies().delete('session');
  revalidatePath('/');
  redirect('/login');
}
```

## Пример Server Action для обновления прогресса пользователя

```typescript
// src/app/actions/progress.ts
'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { getFirebaseAdmin } from '@/lib/api/firebase/admin';
import { getCurrentUser } from './user';

// Схема валидации для обновления прогресса
const progressUpdateSchema = z.object({
  levelId: z.string(),
  completed: z.boolean(),
  score: z.number().min(0),
  timeSpent: z.number().min(0),
});

/**
 * Обновление прогресса пользователя по конкретному уровню
 */
export async function updateLevelProgress(formData: FormData) {
  const user = await getCurrentUser();
  
  if (!user) {
    throw new Error('Unauthorized');
  }
  
  // Валидация данных
  const validatedData = progressUpdateSchema.parse({
    levelId: formData.get('levelId'),
    completed: formData.get('completed') === 'true',
    score: Number(formData.get('score')),
    timeSpent: Number(formData.get('timeSpent')),
  });
  
  const { levelId, completed, score, timeSpent } = validatedData;
  
  try {
    const admin = getFirebaseAdmin();
    
    // Получаем текущий прогресс
    const progressRef = admin
      .firestore()
      .collection('users')
      .doc(user.uid)
      .collection('progress')
      .doc(levelId);
    
    const progressDoc = await progressRef.get();
    
    // Определяем, улучшились ли показатели
    let dataToUpdate = {
      completed,
      lastAttemptAt: admin.firestore.FieldValue.serverTimestamp(),
    };
    
    // Обновляем рекорд только если результат лучше предыдущего
    if (!progressDoc.exists || score > (progressDoc.data()?.bestScore || 0)) {
      dataToUpdate = {
        ...dataToUpdate,
        bestScore: score,
      };
    }
    
    // Обновляем время только если прохождение завершено и время лучше
    if (
      completed && 
      (!progressDoc.exists || 
       !progressDoc.data()?.bestTimeSpent || 
       timeSpent < progressDoc.data()?.bestTimeSpent)
    ) {
      dataToUpdate = {
        ...dataToUpdate,
        bestTimeSpent: timeSpent,
      };
    }
    
    // Записываем обновленные данные
    await progressRef.set(dataToUpdate, { merge: true });
    
    // Обновляем общую статистику пользователя
    await updateUserStatistics(user.uid, { levelId, completed, score });
    
    // Инвалидируем кэш для обновления данных на страницах
    revalidatePath(`/levels/${levelId}`);
    revalidatePath('/profile');
    revalidatePath('/dashboard');
    
    return { success: true };
  } catch (error) {
    console.error('Error updating progress:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

/**
 * Вспомогательная функция для обновления общей статистики пользователя
 */
async function updateUserStatistics(
  userId: string, 
  { levelId, completed, score }: { levelId: string; completed: boolean; score: number }
) {
  const admin = getFirebaseAdmin();
  const userRef = admin.firestore().collection('users').doc(userId);
  
  // Получаем данные уровня для определения его категории
  const levelDoc = await admin.firestore().collection('levels').doc(levelId).get();
  const levelData = levelDoc.data();
  
  if (!levelData) return;
  
  const { category } = levelData;
  
  // Обновляем статистику атомарно с использованием транзакций
  return admin.firestore().runTransaction(async (transaction) => {
    const userDoc = await transaction.get(userRef);
    
    if (!userDoc.exists) {
      throw new Error('User document does not exist');
    }
    
    const userData = userDoc.data() || {};
    const stats = userData.statistics || {
      totalScore: 0,
      levelsCompleted: 0,
      categoryProgress: {},
    };
    
    // Обновляем общий счет
    const oldScore = userData.completedLevels?.[levelId]?.score || 0;
    const scoreDiff = Math.max(0, score - oldScore);
    
    // Обновляем только если уровень завершен и это новое завершение или счет улучшился
    if (completed && (!userData.completedLevels?.[levelId]?.completed || scoreDiff > 0)) {
      // Увеличиваем счетчик завершенных уровней, если это первое завершение
      const levelCompletedIncrement = !userData.completedLevels?.[levelId]?.completed ? 1 : 0;
      
      // Обновляем статистику по категориям
      const categoryStats = stats.categoryProgress[category] || {
        levelsCompleted: 0,
        totalScore: 0,
      };
      
      transaction.update(userRef, {
        [`completedLevels.${levelId}`]: { completed, score, updatedAt: admin.firestore.FieldValue.serverTimestamp() },
        'statistics.totalScore': stats.totalScore + scoreDiff,
        'statistics.levelsCompleted': stats.levelsCompleted + levelCompletedIncrement,
        [`statistics.categoryProgress.${category}.levelsCompleted`]: categoryStats.levelsCompleted + levelCompletedIncrement,
        [`statistics.categoryProgress.${category}.totalScore`]: categoryStats.totalScore + scoreDiff,
      });
    }
  });
}
```

## Пример использования Server Action в компоненте

```typescript
// src/components/features/LevelCompletion/LevelCompletionForm.tsx
'use client';

import { useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { updateLevelProgress } from '@/app/actions/progress';
import { useToast } from '@/components/ui/use-toast';

interface LevelCompletionFormProps {
  levelId: string;
  score: number;
  timeSpent: number;
}

export function LevelCompletionForm({ levelId, score, timeSpent }: LevelCompletionFormProps) {
  const formRef = useRef<HTMLFormElement>(null);
  const { toast } = useToast();
  const router = useRouter();
  
  // Обработка ошибок и состояния формы с использованием useFormState
  const handleAction = async (formData: FormData) => {
    try {
      const result = await updateLevelProgress(formData);
      
      if (result.success) {
        toast({
          title: 'Прогресс сохранен',
          description: 'Ваш результат был успешно сохранен!',
          variant: 'default',
        });
        
        // Перенаправляем на страницу с результатами
        router.push(`/levels/${levelId}/results`);
      } else {
        toast({
          title: 'Ошибка',
          description: result.error || 'Не удалось сохранить прогресс',
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: error instanceof Error ? error.message : 'Произошла непредвиденная ошибка',
        variant: 'destructive',
      });
    }
  };

  return (
    <form ref={formRef} action={handleAction} className="space-y-4">
      {/* Скрытые поля для передачи данных */}
      <input type="hidden" name="levelId" value={levelId} />
      <input type="hidden" name="completed" value="true" />
      <input type="hidden" name="score" value={score} />
      <input type="hidden" name="timeSpent" value={timeSpent} />
      
      {/* Визуальное отображение результатов */}
      <div className="bg-muted p-4 rounded-lg space-y-2">
        <p className="text-sm font-medium">Результаты уровня:</p>
        <div className="flex justify-between">
          <span>Счет:</span>
          <span className="font-bold">{score}</span>
        </div>
        <div className="flex justify-between">
          <span>Затраченное время:</span>
          <span className="font-bold">{formatTime(timeSpent)}</span>
        </div>
      </div>
      
      <Button type="submit" className="w-full">
        Сохранить результаты
      </Button>
    </form>
  );
}

// Вспомогательная функция для форматирования времени
function formatTime(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
}
```

## Пример Server Action для получения данных для страницы

```typescript
// src/app/dashboard/page.tsx
import { Suspense } from 'react';
import { getCurrentUser } from '@/app/actions/user';
import { getLevelsWithProgress } from '@/app/actions/levels';
import { DashboardSkeleton } from '@/components/skeletons/DashboardSkeleton';
import { DashboardContent } from '@/components/features/Dashboard/DashboardContent';
import { redirect } from 'next/navigation';

export default async function DashboardPage() {
  const user = await getCurrentUser();
  
  // Перенаправляем неавторизованных пользователей
  if (!user) {
    redirect('/login');
  }
  
  return (
    <main className="container py-6">
      <h1 className="text-3xl font-bold mb-6">Личный кабинет</h1>
      
      <Suspense fallback={<DashboardSkeleton />}>
        <DashboardContent
          user={user}
          levelsPromise={getLevelsWithProgress(user.uid)}
        />
      </Suspense>
    </main>
  );
}
```

```typescript
// src/app/actions/levels.ts
'use server';

import { getFirebaseAdmin } from '@/lib/api/firebase/admin';

/**
 * Получение уровней с прогрессом пользователя
 */
export async function getLevelsWithProgress(userId: string) {
  const admin = getFirebaseAdmin();
  
  // Получаем все уровни
  const levelsSnapshot = await admin
    .firestore()
    .collection('levels')
    .orderBy('order', 'asc')
    .get();
    
  // Получаем прогресс пользователя
  const progressSnapshot = await admin
    .firestore()
    .collection('users')
    .doc(userId)
    .collection('progress')
    .get();
    
  // Создаем мапу с прогрессом
  const progressMap: Record<string, any> = {};
  progressSnapshot.forEach(doc => {
    progressMap[doc.id] = doc.data();
  });
  
  // Комбинируем данные
  const levels = levelsSnapshot.docs.map(doc => {
    const levelData = doc.data();
    return {
      id: doc.id,
      ...levelData,
      progress: progressMap[doc.id] || null,
    };
  });
  
  return levels;
}
```

## Рекомендации

1. **Приоритизируйте операции с данными** - сначала перенесите наиболее интенсивные операции
2. **Разделите клиентские и серверные компоненты** - используйте правильную структуру и 'use client/use server' директивы
3. **Оптимизируйте валидацию данных** - используйте библиотеки вроде Zod на сервере
4. **Внедрите прогрессивное улучшение** - обеспечьте работу без JavaScript
5. **Обеспечьте обратную совместимость** - учитывайте пользователей, которые могут иметь проблемы с серверными функциями
6. **Разработайте стратегию кэширования** - используйте инструменты Next.js для эффективного кэширования и ревалидации

## Ожидаемый результат

- Снижение объема JavaScript, загружаемого на клиенте
- Улучшение времени взаимодействия (TTI) и других метрик производительности
- Уменьшение нагрузки на Firebase с клиентской стороны
- Оптимизированные формы и компоненты для работы с данными
- Повышение безопасности за счет выполнения критических операций на сервере
- Возможность работы с базовой функциональностью даже без JavaScript

## Ресурсы

- [Документация по Server Actions в Next.js](https://nextjs.org/docs/app/api-reference/functions/server-actions)
- [Оптимизация форм с Server Actions](https://nextjs.org/docs/app/building-your-application/data-fetching/forms-and-mutations)
- [Интеграция Firebase Admin SDK](https://firebase.google.com/docs/admin/setup)
- [Использование Zod для валидации данных](https://zod.dev/)

---

**Важно:** При выполнении задачи следуйте общему плану проекта, который находится в файле `/docs/tasks - stage2/dev-plan-stage2.md`. После выполнения задачи обновите статус в файле `/docs/tasks - stage2/status-stage2.md`. 