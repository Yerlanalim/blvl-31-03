# Задача 1.3: Оптимизация структуры Firebase и индексов

## Описание

Текущая структура данных Firestore требует оптимизации для повышения производительности запросов и снижения количества операций чтения/записи. Необходимо проанализировать существующую структуру данных, определить узкие места производительности и реализовать оптимизированную структуру, включая правильные индексы и денормализацию данных для часто используемых запросов.

## Шаги выполнения

1. **Анализ текущих моделей данных и запросов:**
   - Проанализировать существующие модели данных (`users`, `userProgress`, `levels`, `artifacts`, `chats`, `faq`)
   - Выявить часто запрашиваемые поля и связанные данные
   - Определить запросы, которые могут приводить к высокой нагрузке

2. **Оптимизация модели `userProgress`:**
   - Проанализировать текущую структуру документа `userProgress/{userId}`
   - Рассмотреть возможность денормализации часто используемых данных из других коллекций
   - Разработать структуру с оптимальным балансом между дублированием и частыми запросами

3. **Создание составных индексов:**
   - Определить запросы, требующие составных индексов
   - Создать необходимые индексы в консоли Firebase
   - Документировать созданные индексы

4. **Оптимизация запросов с пагинацией:**
   - Внедрить эффективную пагинацию с использованием cursor-based подхода
   - Оптимизировать запросы больших коллекций

5. **Обновление сервисов для работы с оптимизированной структурой:**
   - Модифицировать сервисы в соответствии с новой структурой данных
   - Обеспечить обратную совместимость для плавного перехода
   - Добавить миграционные скрипты при необходимости

## Пример оптимизированной структуры `userProgress`

```typescript
// Текущая структура
interface UserProgress {
  currentLevelId: string;
  completedLevelIds: string[];
  watchedVideoIds: string[];
  completedTestIds: string[];
  downloadedArtifactIds: string[];
  skillProgress: Record<string, number>;
  badges: string[];
}

// Оптимизированная структура с денормализацией
interface OptimizedUserProgress {
  currentLevelId: string;
  completedLevelIds: string[];
  
  // Денормализация для снижения количества запросов
  levels: {
    [levelId: string]: {
      status: 'locked' | 'available' | 'completed';
      progress: number; // процент завершения уровня
      completedOn?: Timestamp;
      
      // Вложенная структура для видео и тестов этого уровня
      videos: {
        [videoId: string]: {
          watched: boolean;
          watchedOn?: Timestamp;
        }
      };
      
      tests: {
        [testId: string]: {
          completed: boolean;
          score?: number;
          completedOn?: Timestamp;
        }
      };
    }
  };
  
  // Денормализованные данные об артефактах
  artifacts: {
    [artifactId: string]: {
      downloaded: boolean;
      downloadedOn?: Timestamp;
    }
  };
  
  skillProgress: Record<string, number>;
  badges: string[];
  
  // Метаданные для оптимизации
  lastUpdated: Timestamp;
  statsSnapshot: {
    totalCompletedLevels: number;
    totalWatchedVideos: number;
    totalCompletedTests: number;
    totalDownloadedArtifacts: number;
  };
}
```

## Пример оптимизации индексов для запросов FAQ

```typescript
// В файле faq-service.ts

// Вместо текущего подхода с множественными orderBy
const queryConstraints: QueryConstraint[] = [
  orderBy('category', 'asc'),
  orderBy('order', 'asc')
];
if (filters?.category) {
  queryConstraints.unshift(where('category', '==', filters.category));
}

// Оптимизированный подход с составным полем
const queryConstraints: QueryConstraint[] = [];
if (filters?.category) {
  queryConstraints.push(where('category', '==', filters.category));
  queryConstraints.push(orderBy('order', 'asc'));
} else {
  // Используем составное поле category_order для упрощения индексирования
  queryConstraints.push(orderBy('category_order', 'asc'));
}
```

## Рекомендации

1. Денормализуйте данные с осторожностью, учитывая компромисс между производительностью и сложностью поддержки
2. Используйте batch-операции и транзакции для обеспечения согласованности данных
3. Создавайте индексы только для реально используемых запросов, избыточные индексы могут замедлить запись
4. Документируйте все созданные индексы и их назначение
5. Используйте механизм подписок на изменения для кэширования часто запрашиваемых данных на клиенте

## Ожидаемый результат

- Оптимизированная структура данных в Firestore
- Набор необходимых составных индексов
- Обновленные сервисы для работы с новой структурой
- Документация по новой модели данных и созданным индексам
- Улучшенная производительность приложения за счет оптимизированных запросов

## Ресурсы

- [Лучшие практики структурирования данных в Firestore](https://firebase.google.com/docs/firestore/manage-data/structure-data)
- [Денормализация данных в NoSQL базах](https://www.mongodb.com/blog/post/6-rules-of-thumb-for-mongodb-schema-design-part-3)
- [Управление индексами в Firestore](https://firebase.google.com/docs/firestore/query-data/indexing)

---

**Важно:** При выполнении задачи следуйте общему плану проекта, который находится в файле `/docs/tasks - stage2/dev-plan-stage2.md`. После выполнения задачи обновите статус в файле `/docs/tasks - stage2/status-stage2.md`. 