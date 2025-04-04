# Задача 2.1: Оптимизация стратегии кэширования React Query

## Описание

Текущая реализация кэширования данных с использованием React Query недостаточно оптимальна. Отсутствует стратегия для эффективной инвалидации кэша, предзагрузки данных и управления временем жизни кэша. Необходимо разработать и внедрить оптимизированную стратегию кэширования для улучшения производительности приложения и снижения количества запросов к Firebase.

## Шаги выполнения

1. **Анализ текущего использования React Query:**
   - Проанализировать существующие хуки, использующие React Query (`useProgress`, `useLevels`, `useArtifacts` и др.)
   - Выявить проблемные места (избыточные загрузки, отсутствие оптимизации кэша)
   - Составить карту зависимостей данных для определения стратегии инвалидации

2. **Определение стратегии кэширования для ключевых данных:**
   - Разработать структуру ключей для организации кэша
   - Определить время жизни кэша для разных типов данных
   - Создать стратегию предзагрузки для часто используемых данных

3. **Внедрение QueryClient с оптимизированными настройками:**
   - Обновить конфигурацию QueryClient с улучшенными параметрами
   - Настроить политики повторных попыток и обработки ошибок
   - Реализовать глобальную стратегию инвалидации кэша

4. **Оптимизация хуков для запросов:**
   - Модифицировать существующие хуки с использованием оптимизированной стратегии кэширования
   - Внедрить механизмы предзагрузки и паралельной загрузки данных
   - Создать хуки для оптимизированной инвалидации кэша

5. **Реализация мониторинга производительности запросов:**
   - Добавить логирование времени выполнения запросов
   - Настроить отслеживание состояния кэша
   - Создать утилиты для анализа эффективности стратегии кэширования

## Пример оптимизированной конфигурации QueryClient

```typescript
// src/lib/query/queryClient.ts
import { QueryClient } from '@tanstack/react-query';
import { logQueryPerformance } from '@/lib/monitoring/performance';

// Определяем стандартные настройки для разных типов данных
export const cacheConfigs = {
  // Данные, которые редко меняются
  static: {
    staleTime: 1000 * 60 * 60, // 1 час
    cacheTime: 1000 * 60 * 60 * 24, // 24 часа
    retry: 1,
  },
  // Данные, которые меняются периодически
  regular: {
    staleTime: 1000 * 60 * 5, // 5 минут
    cacheTime: 1000 * 60 * 30, // 30 минут
    retry: 2,
  },
  // Данные, которые часто обновляются
  dynamic: {
    staleTime: 1000 * 30, // 30 секунд
    cacheTime: 1000 * 60 * 5, // 5 минут
    retry: 3,
  },
  // Данные пользовательского прогресса
  userProgress: {
    staleTime: 1000 * 60, // 1 минута
    cacheTime: 1000 * 60 * 10, // 10 минут
    retry: 2,
  }
};

// Создаем QueryClient с улучшенными настройками
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Настройки по умолчанию
      staleTime: cacheConfigs.regular.staleTime,
      cacheTime: cacheConfigs.regular.cacheTime,
      retry: cacheConfigs.regular.retry,
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      refetchOnWindowFocus: false,
      refetchOnMount: true,
      onError: (error) => {
        console.error('Query error:', error);
      },
      onSuccess: (data, variables, context, query) => {
        // Логируем производительность запросов
        logQueryPerformance(query.queryKey, query.state.dataUpdatedAt - query.state.fetchStatus);
      },
    },
    mutations: {
      retry: 1,
      retryDelay: 1000,
      onError: (error) => {
        console.error('Mutation error:', error);
      },
    },
  },
});
```

## Пример оптимизированного хука для работы с уровнями

```typescript
// src/hooks/query/useLevels.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { levelService } from '@/lib/services/level-service';
import { Level } from '@/types/level';
import { cacheConfigs } from '@/lib/query/queryClient';

// Определение структуры ключей кэша
export const levelKeys = {
  all: ['levels'] as const,
  lists: () => [...levelKeys.all, 'list'] as const,
  list: (filters: any) => [...levelKeys.lists(), { filters }] as const,
  details: () => [...levelKeys.all, 'detail'] as const,
  detail: (id: string) => [...levelKeys.details(), id] as const,
};

// Оптимизированный хук для получения списка уровней
export function useLevels() {
  const queryClient = useQueryClient();
  
  // Основной запрос для получения уровней
  const query = useQuery({
    queryKey: levelKeys.lists(),
    queryFn: () => levelService.getLevels(),
    staleTime: cacheConfigs.regular.staleTime,
  });
  
  // Функция для предзагрузки деталей уровня
  const prefetchLevelDetails = async (levelId: string) => {
    await queryClient.prefetchQuery({
      queryKey: levelKeys.detail(levelId),
      queryFn: () => levelService.getLevelById(levelId),
      staleTime: cacheConfigs.regular.staleTime,
    });
  };
  
  // Предзагружаем следующий уровень, если известен текущий
  const prefetchNextLevel = async (currentLevelId: string) => {
    try {
      const nextLevelId = await levelService.getNextLevelId(currentLevelId);
      if (nextLevelId) {
        await prefetchLevelDetails(nextLevelId);
      }
    } catch (error) {
      console.error('Failed to prefetch next level:', error);
    }
  };
  
  return {
    ...query,
    prefetchLevelDetails,
    prefetchNextLevel,
  };
}

// Хук для получения деталей конкретного уровня
export function useLevel(levelId: string) {
  return useQuery({
    queryKey: levelKeys.detail(levelId),
    queryFn: () => levelService.getLevelById(levelId),
    staleTime: cacheConfigs.regular.staleTime,
    enabled: !!levelId,
  });
}

// Хук для инвалидации кэша после завершения уровня
export function useCompleteLevel() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ userId, levelId }: { userId: string; levelId: string }) => {
      return levelService.completeLevel(userId, levelId);
    },
    onSuccess: (data, variables) => {
      // Инвалидируем кэш прогресса пользователя
      queryClient.invalidateQueries({ queryKey: ['progress', variables.userId] });
      
      // Инвалидируем кэш текущего уровня, так как его статус изменился
      queryClient.invalidateQueries({ queryKey: levelKeys.detail(variables.levelId) });
      
      // Инвалидируем список уровней, так как статусы могли измениться
      queryClient.invalidateQueries({ queryKey: levelKeys.lists() });
    },
  });
}
```

## Пример оптимизации кэширования прогресса пользователя

```typescript
// src/hooks/query/useProgress.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { progressService } from '@/lib/services/progress-service';
import { UserProgress } from '@/types/progress';
import { cacheConfigs } from '@/lib/query/queryClient';
import { useAuth } from '@/hooks/useAuth';

// Определение структуры ключей кэша
export const progressKeys = {
  all: ['progress'] as const,
  user: (userId: string) => [...progressKeys.all, userId] as const,
  status: (userId: string, type: 'level' | 'video' | 'test' | 'artifact', id: string) => 
    [...progressKeys.user(userId), type, id] as const,
};

// Оптимизированный хук для получения прогресса пользователя
export function useProgress() {
  const { user } = useAuth();
  const userId = user?.id;
  const queryClient = useQueryClient();
  
  // Основной запрос для получения прогресса
  const query = useQuery({
    queryKey: progressKeys.user(userId!),
    queryFn: () => progressService.getUserProgress(userId!),
    staleTime: cacheConfigs.userProgress.staleTime,
    enabled: !!userId,
  });
  
  // Мутация для отметки видео как просмотренного
  const markVideoWatched = useMutation({
    mutationFn: (videoId: string) => 
      progressService.markVideoWatched(userId!, videoId),
    onSuccess: () => {
      // Инвалидируем только прогресс пользователя
      queryClient.invalidateQueries({ queryKey: progressKeys.user(userId!) });
    },
  });
  
  // Мутация для отметки теста как выполненного
  const markTestCompleted = useMutation({
    mutationFn: (testId: string) => 
      progressService.markTestCompleted(userId!, testId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: progressKeys.user(userId!) });
    },
  });
  
  // Мутация для отметки артефакта как скачанного
  const markArtifactDownloaded = useMutation({
    mutationFn: (artifactId: string) => 
      progressService.markArtifactDownloaded(userId!, artifactId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: progressKeys.user(userId!) });
    },
  });
  
  return {
    ...query,
    markVideoWatched,
    markTestCompleted,
    markArtifactDownloaded,
  };
}
```

## Рекомендации

1. Создавайте четкую структуру ключей для кэша React Query
2. Используйте разные настройки staleTime и cacheTime для разных типов данных
3. Внедряйте механизмы предзагрузки для улучшения UX
4. Оптимизируйте инвалидацию кэша, чтобы избежать ненужных перезагрузок
5. Следите за производительностью запросов, логируя их выполнение

## Ожидаемый результат

- Оптимизированная конфигурация QueryClient
- Структурированная система ключей для организации кэша
- Улучшенные хуки с предзагрузкой и оптимизированной инвалидацией кэша
- Снижение количества запросов к Firebase
- Улучшение производительности приложения

## Ресурсы

- [Документация React Query](https://tanstack.com/query/latest/docs/react/overview)
- [Стратегии кэширования в React Query](https://tkdodo.eu/blog/caching-with-react-query)
- [Продвинутое использование React Query](https://tanstack.com/query/latest/docs/react/guides/advanced-queries)

---

**Важно:** При выполнении задачи следуйте общему плану проекта, который находится в файле `/docs/tasks - stage2/dev-plan-stage2.md`. После выполнения задачи обновите статус в файле `/docs/tasks - stage2/status-stage2.md`. 