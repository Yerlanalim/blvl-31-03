# Задача 2.2: Внедрение ленивой загрузки для неприоритетных компонентов

## Описание

Текущая реализация приложения загружает все компоненты сразу, что увеличивает время начальной загрузки и негативно влияет на метрики производительности. Необходимо внедрить ленивую загрузку (lazy loading) для компонентов, которые не требуются на начальном этапе взаимодействия пользователя с приложением, что позволит уменьшить размер начального бандла и ускорить время до интерактивности (TTI).

## Шаги выполнения

1. **Анализ компонентов для ленивой загрузки:**
   - Провести аудит всех компонентов приложения
   - Определить неприоритетные компоненты и страницы
   - Составить план внедрения ленивой загрузки

2. **Настройка code splitting для маршрутов:**
   - Реализовать динамический импорт для страниц в `/app` директории
   - Настроить загрузочные состояния для страниц с отложенной загрузкой
   - Внедрить предзагрузку для маршрутов, переход на которые вероятен

3. **Создание компонента для ленивой загрузки:**
   - Реализовать обертку для динамического импорта компонентов
   - Добавить обработку ошибок загрузки
   - Реализовать индикаторы загрузки и заглушки

4. **Внедрение ленивой загрузки для модальных окон и сложных компонентов:**
   - Модифицировать компоненты модальных окон для динамической загрузки
   - Реализовать динамический импорт для тяжелых компонентов визуализации
   - Внедрить предзагрузку при наведении курсора или скроллинге

5. **Тестирование и оптимизация:**
   - Провести тестирование производительности до и после внедрения
   - Измерить влияние на метрики Web Vitals
   - Оптимизировать стратегию загрузки на основе результатов

## Пример реализации компонента для ленивой загрузки

```typescript
// src/components/common/LazyComponent.tsx
import { Suspense, lazy, ComponentType, useState, useEffect } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

interface LazyComponentProps<T> {
  importFn: () => Promise<{ default: ComponentType<T> }>;
  props: T;
  fallback?: React.ReactNode;
  onLoad?: () => void;
  onError?: (error: Error) => void;
}

export function LazyComponent<T>({
  importFn,
  props,
  fallback = <Skeleton className="w-full h-48" />,
  onLoad,
  onError,
}: LazyComponentProps<T>) {
  const [Component, setComponent] = useState<ComponentType<T> | null>(null);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let isMounted = true;

    const loadComponent = async () => {
      try {
        const module = await importFn();
        if (isMounted) {
          setComponent(() => module.default);
          onLoad?.();
        }
      } catch (err) {
        if (isMounted) {
          const error = err instanceof Error ? err : new Error(String(err));
          setError(error);
          onError?.(error);
        }
      }
    };

    loadComponent();

    return () => {
      isMounted = false;
    };
  }, [importFn, onLoad, onError]);

  if (error) {
    return (
      <div className="p-4 bg-red-50 text-red-600 rounded border border-red-200">
        Ошибка загрузки компонента: {error.message}
      </div>
    );
  }

  if (!Component) {
    return <>{fallback}</>;
  }

  return <Component {...props} />;
}
```

## Пример динамического импорта страниц

```typescript
// src/app/(routes)/artifacts/page.tsx
import { Suspense } from 'react';
import { ArtifactsPageSkeleton } from '@/components/ui/skeletons/ArtifactsPageSkeleton';

export default function ArtifactsPage() {
  return (
    <Suspense fallback={<ArtifactsPageSkeleton />}>
      {/* Используем динамический импорт для содержимого страницы */}
      <ArtifactsPageContent />
    </Suspense>
  );
}

// Выносим содержимое страницы в отдельный компонент для динамической загрузки
function ArtifactsPageContent() {
  const ArtifactsList = dynamic(() => import('@/components/features/Artifacts/ArtifactsList'), {
    loading: () => <ArtifactsListSkeleton />,
    ssr: false, // Отключаем SSR для этого компонента, так как он не нужен для SEO
  });

  return (
    <div className="container py-6">
      <h1 className="text-2xl font-bold mb-6">Артефакты</h1>
      <ArtifactsList />
    </div>
  );
}
```

## Пример ленивой загрузки модального окна

```typescript
// src/components/features/LevelDetail/VideoPlayer.tsx
import { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Play } from 'lucide-react';
import dynamic from 'next/dynamic';

// Динамически импортируем тяжелый компонент видеоплеера
const VideoPlayerModal = dynamic(
  () => import('@/components/features/LevelDetail/VideoPlayerModal'),
  {
    loading: () => <div className="w-full h-full animate-pulse bg-muted rounded-md" />,
    ssr: false,
  }
);

interface VideoPlayerProps {
  videoUrl: string;
  thumbnailUrl: string;
  title: string;
  onComplete: () => void;
}

export function VideoPlayer({ videoUrl, thumbnailUrl, title, onComplete }: VideoPlayerProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPreloaded, setIsPreloaded] = useState(false);

  // Предзагрузка при наведении
  const handleMouseEnter = useCallback(() => {
    // Начинаем предзагрузку компонента при наведении
    if (!isPreloaded) {
      const preload = import('@/components/features/LevelDetail/VideoPlayerModal');
      preload.then(() => setIsPreloaded(true));
    }
  }, [isPreloaded]);

  return (
    <>
      <div 
        className="relative aspect-video rounded-lg overflow-hidden cursor-pointer hover:opacity-90 transition-opacity" 
        onClick={() => setIsModalOpen(true)}
        onMouseEnter={handleMouseEnter}
      >
        <img 
          src={thumbnailUrl} 
          alt={title} 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 flex items-center justify-center bg-black/30">
          <Button variant="default" size="lg" className="rounded-full p-3">
            <Play className="h-6 w-6" />
          </Button>
        </div>
      </div>

      {/* Модальное окно загружается только при открытии */}
      {isModalOpen && (
        <VideoPlayerModal
          videoUrl={videoUrl}
          title={title}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onComplete={onComplete}
        />
      )}
    </>
  );
}
```

## Пример предзагрузки маршрутов

```typescript
// src/components/features/LevelMap/LevelCard.tsx
import { useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { ContentCard } from '@/components/common/Card';
import { Button } from '@/components/ui/button';
import { Level } from '@/types/level';
import { Badge } from '@/components/ui/badge';
import { preloadRoute } from '@/lib/utils/routing';

interface LevelCardProps {
  level: Level;
  isActive: boolean;
  isCompleted: boolean;
  isLocked: boolean;
}

export function LevelCard({ level, isActive, isCompleted, isLocked }: LevelCardProps) {
  const router = useRouter();
  
  // Предзагрузка страницы при наведении
  const handleMouseEnter = useCallback(() => {
    if (!isLocked) {
      preloadRoute(`/level/${level.id}`);
    }
  }, [level.id, isLocked]);
  
  const handleClick = () => {
    if (!isLocked) {
      router.push(`/level/${level.id}`);
    }
  };
  
  // Определяем статус уровня для отображения
  const status = isCompleted 
    ? "completed" 
    : isActive 
      ? "active" 
      : "locked";
  
  // Разные варианты отображения бейджа
  const badges = {
    completed: <Badge variant="success">Завершен</Badge>,
    active: <Badge variant="default">Доступен</Badge>,
    locked: <Badge variant="outline">Заблокирован</Badge>
  };
  
  return (
    <ContentCard
      title={level.title}
      description={`Уровень ${level.order}`}
      headerAction={badges[status]}
      footer={
        <Button 
          variant={isLocked ? "outline" : "default"}
          disabled={isLocked}
          onClick={handleClick}
          className="w-full"
          onMouseEnter={handleMouseEnter}
        >
          {isCompleted ? "Повторить" : isActive ? "Начать" : "Заблокирован"}
        </Button>
      }
      className="card transition-all hover:shadow-md"
      data-testid={`level-card-${level.id}`}
      data-status={status}
    >
      <p className="text-sm text-muted-foreground">{level.description}</p>
    </ContentCard>
  );
}
```

## Вспомогательные функции для предзагрузки

```typescript
// src/lib/utils/routing.ts
import { prefetch } from 'next/navigation';

// Кэш для предотвращения повторной предзагрузки одних и тех же маршрутов
const preloadedRoutes = new Set<string>();

/**
 * Предзагрузка маршрута, если он еще не был предзагружен
 */
export function preloadRoute(route: string): void {
  if (preloadedRoutes.has(route)) {
    return;
  }
  
  try {
    prefetch(route);
    preloadedRoutes.add(route);
  } catch (error) {
    console.error(`Failed to preload route: ${route}`, error);
  }
}

/**
 * Предзагрузка нескольких маршрутов
 */
export function preloadRoutes(routes: string[]): void {
  routes.forEach(preloadRoute);
}
```

## Рекомендации

1. Не применяйте ленивую загрузку к критическим компонентам, которые видны при первом отображении
2. Используйте предзагрузку для улучшения UX и предотвращения задержек при взаимодействии
3. Обеспечьте качественные заглушки (skeletons) для компонентов с отложенной загрузкой
4. Комбинируйте ленивую загрузку с приоритизированной предзагрузкой
5. Измеряйте влияние ленивой загрузки на производительность, чтобы найти оптимальный баланс

## Ожидаемый результат

- Уменьшенный размер начального бандла JavaScript
- Улучшенные метрики Web Vitals (особенно TTI и FID)
- Ускоренная загрузка первой страницы
- Улучшенный пользовательский опыт с минимальными задержками при навигации
- Компоненты и страницы, оптимизированные для динамической загрузки

## Ресурсы

- [Документация Next.js по динамическому импорту](https://nextjs.org/docs/advanced-features/dynamic-import)
- [React.lazy и Suspense](https://react.dev/reference/react/lazy)
- [Web Vitals и ленивая загрузка](https://web.dev/articles/optimize-lcp#lazy_load_non-critical_resources)
- [Стратегии предзагрузки](https://web.dev/articles/preload-critical-assets)

---

**Важно:** При выполнении задачи следуйте общему плану проекта, который находится в файле `/docs/tasks - stage2/dev-plan-stage2.md`. После выполнения задачи обновите статус в файле `/docs/tasks - stage2/status-stage2.md`. 