# Задача 3.6: Измерение и оптимизация Web Vitals

## Описание задачи

Настроить систему мониторинга метрик Web Vitals, выявить проблемные области и внедрить оптимизации для улучшения ключевых показателей производительности в приложении BizLevel. Web Vitals играют ключевую роль в оценке пользовательского опыта и влияют на SEO-оптимизацию сайта.

## Цели

1. Внедрить систему измерения и отслеживания метрик Web Vitals 
2. Выявить и устранить проблемные места, влияющие на ключевые метрики
3. Улучшить показатели LCP, FID, CLS, TTFB до рекомендуемых значений
4. Создать систему автоматизированного мониторинга метрик в разных условиях
5. Разработать стратегию долгосрочного поддержания хороших показателей

## Технические требования

1. Интеграция библиотеки web-vitals для измерения ключевых метрик
2. Настройка отправки метрик в аналитические системы (Firebase Analytics, Vercel Analytics)
3. Разработка дашборда для визуализации и анализа метрик
4. Реализация автоматизированного тестирования Web Vitals
5. Использование инструментов Lighthouse и PageSpeed Insights для аудита
6. Создание стратегии оптимизации для каждой метрики

## Ключевые метрики для оптимизации

### 1. Largest Contentful Paint (LCP)
- Оптимизация загрузки основного контента (изображения, видео, блоки текста)
- Внедрение предварительной загрузки критических ресурсов
- Оптимизация серверного времени ответа
- Эффективное кэширование ресурсов

### 2. First Input Delay (FID) и Total Blocking Time (TBT)
- Оптимизация JavaScript-кода для минимизации блокировки основного потока
- Разделение длительных задач на более мелкие
- Отложенная загрузка неприоритетного JavaScript
- Использование веб-воркеров для тяжелых вычислений

### 3. Cumulative Layout Shift (CLS)
- Резервирование пространства для динамически загружаемых элементов
- Указание размеров для медиа-элементов (изображения, видео)
- Предотвращение вставки контента поверх существующего
- Стабилизация макета при загрузке шрифтов

### 4. Time to First Byte (TTFB)
- Оптимизация серверного времени ответа
- Улучшение маршрутизации запросов
- Кэширование данных на серверной стороне
- Оптимизация доступа к базе данных

## Технический подход

1. **Настройка измерения и отслеживания**:
   - Интеграция библиотеки web-vitals
   - Разработка механизма отправки метрик в аналитические системы
   - Создание дашборда для визуализации метрик
   - Настройка алертов при ухудшении показателей

2. **Оптимизация LCP**:
   - Аудит и оптимизация загрузки основного контента
   - Приоритизация загрузки критических ресурсов
   - Оптимизация изображений и настройка предзагрузки
   - Использование сервер-сайд рендеринга для улучшения показателей

3. **Оптимизация FID и производительности JavaScript**:
   - Профилирование и оптимизация JavaScript-кода
   - Внедрение механизмов для разделения длительных задач
   - Оптимизация обработчиков событий и реакции на ввод
   - Анализ и устранение ненужных вычислений

4. **Оптимизация CLS**:
   - Аудит причин смещения макета
   - Внедрение правильных практик для работы с изображениями и динамическим контентом
   - Стабилизация макета при загрузке внешних ресурсов
   - Тестирование на различных устройствах и разрешениях экрана

## Пример интеграции с web-vitals

```typescript
// src/lib/analytics/web-vitals.ts
import { getCLS, getFID, getLCP, getTTFB, getFCP } from 'web-vitals';
import { logEvent } from 'firebase/analytics';
import { getAnalytics } from '@/lib/api/firebase';

type WebVitalsMetric = {
  id: string;
  name: string;
  value: number;
  delta: number;
};

async function sendToAnalytics(metric: WebVitalsMetric) {
  // Получаем инстанс Firebase Analytics
  const analytics = await getAnalytics();
  if (!analytics) return;

  // Отправляем данные в Firebase Analytics
  logEvent(analytics, 'web_vitals', {
    metric_id: metric.id,
    metric_name: metric.name,
    metric_value: Math.round(metric.value * 10) / 10,
    metric_delta: Math.round(metric.delta * 10) / 10,
    metric_rating: getMetricRating(metric),
    page_path: window.location.pathname,
  });

  // Вывод в консоль для отладки (можно удалить в продакшене)
  if (process.env.NODE_ENV === 'development') {
    console.log(`Web Vital: ${metric.name}`, metric);
  }
}

function getMetricRating(metric: WebVitalsMetric): 'good' | 'needs-improvement' | 'poor' {
  const { name, value } = metric;
  
  // Пороговые значения согласно Google Web Vitals
  switch (name) {
    case 'LCP':
      return value <= 2500 ? 'good' : value <= 4000 ? 'needs-improvement' : 'poor';
    case 'FID':
      return value <= 100 ? 'good' : value <= 300 ? 'needs-improvement' : 'poor';
    case 'CLS':
      return value <= 0.1 ? 'good' : value <= 0.25 ? 'needs-improvement' : 'poor';
    case 'TTFB':
      return value <= 800 ? 'good' : value <= 1800 ? 'needs-improvement' : 'poor';
    case 'FCP':
      return value <= 1800 ? 'good' : value <= 3000 ? 'needs-improvement' : 'poor';
    default:
      return 'needs-improvement';
  }
}

export function initWebVitals() {
  // Измеряем и отправляем все метрики
  getCLS(sendToAnalytics);
  getFID(sendToAnalytics);
  getLCP(sendToAnalytics);
  getFCP(sendToAnalytics);
  getTTFB(sendToAnalytics);
}
```

## Пример оптимизации LCP

```typescript
// src/components/features/HeroSection/HeroImage.tsx
'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { Skeleton } from '@/components/ui/skeleton';

export function HeroImage({ 
  src, 
  alt 
}: { 
  src: string; 
  alt: string;
}) {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Предварительно загружаем изображение
    const img = new Image();
    img.src = src;
    
    // Если изображение уже в кэше, сразу отмечаем как загруженное
    if (img.complete) {
      setIsLoaded(true);
    } else {
      img.onload = () => setIsLoaded(true);
    }
  }, [src]);

  return (
    <div 
      className="relative w-full h-[50vh] min-h-[400px]"
      // Резервируем место для изображения, чтобы избежать CLS
      style={{ 
        minHeight: '400px',
        backgroundColor: 'rgba(0,0,0,0.05)' 
      }}
    >
      {!isLoaded && (
        <Skeleton className="absolute inset-0" />
      )}
      
      <Image
        src={src}
        alt={alt}
        fill
        priority={true} // Высокий приоритет для LCP изображения
        sizes="100vw"
        className={`
          object-cover transition-opacity duration-700
          ${isLoaded ? 'opacity-100' : 'opacity-0'}
        `}
        onLoad={() => setIsLoaded(true)}
      />
    </div>
  );
}
```

## Пример оптимизации FID (разделение длительных задач)

```typescript
// src/lib/utils/task-scheduler.ts

/**
 * Планировщик для выполнения задач с возможностью приоритизации и разделения
 * длительных операций для улучшения отзывчивости UI
 */
export class TaskScheduler {
  private highPriorityQueue: Array<() => void> = [];
  private lowPriorityQueue: Array<() => void> = [];
  private isProcessing = false;

  /**
   * Добавляет задачу высокого приоритета
   */
  addHighPriority(task: () => void): void {
    this.highPriorityQueue.push(task);
    this.processQueues();
  }

  /**
   * Добавляет задачу низкого приоритета
   */
  addLowPriority(task: () => void): void {
    this.lowPriorityQueue.push(task);
    this.processQueues();
  }

  /**
   * Разбивает длительную задачу на части
   */
  processChunked<T>(
    items: T[],
    processor: (item: T) => void,
    chunkSize: number = 5
  ): Promise<void> {
    return new Promise((resolve) => {
      let index = 0;

      const processChunk = () => {
        const chunk = items.slice(index, index + chunkSize);
        
        if (chunk.length === 0) {
          resolve();
          return;
        }

        // Используем requestIdleCallback для выполнения
        // работы в периоды простоя браузера
        if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
          (window as any).requestIdleCallback((deadline: IdleDeadline) => {
            let i = 0;
            while (i < chunk.length && (deadline.timeRemaining() > 0 || deadline.didTimeout)) {
              processor(chunk[i]);
              i++;
            }

            index += i;

            if (index < items.length) {
              setTimeout(processChunk, 0);
            } else {
              resolve();
            }
          });
        } else {
          // Fallback для браузеров без поддержки requestIdleCallback
          chunk.forEach(processor);
          index += chunk.length;
          
          if (index < items.length) {
            setTimeout(processChunk, 0);
          } else {
            resolve();
          }
        }
      };

      processChunk();
    });
  }

  private processQueues(): void {
    if (this.isProcessing) return;
    this.isProcessing = true;

    // Используем requestAnimationFrame для синхронизации с отрисовкой
    requestAnimationFrame(() => {
      // Сначала обрабатываем высокоприоритетные задачи
      while (this.highPriorityQueue.length > 0) {
        const task = this.highPriorityQueue.shift();
        task?.();
      }

      // Затем планируем низкоприоритетные задачи на момент простоя
      if (this.lowPriorityQueue.length > 0) {
        const processLowPriority = () => {
          const startTime = performance.now();
          
          // Выполняем задачи, пока есть время (бюджет 10мс)
          while (
            this.lowPriorityQueue.length > 0 && 
            performance.now() - startTime < 10
          ) {
            const task = this.lowPriorityQueue.shift();
            task?.();
          }
          
          // Если остались задачи, планируем следующую порцию
          if (this.lowPriorityQueue.length > 0) {
            setTimeout(processLowPriority, 0);
          } else {
            this.isProcessing = false;
          }
        };
        
        setTimeout(processLowPriority, 0);
      } else {
        this.isProcessing = false;
      }
    });
  }
}

// Экспортируем глобальный экземпляр планировщика
export const taskScheduler = new TaskScheduler();
```

## Рекомендации по реализации

1. Начать с настройки системы мониторинга Web Vitals на всех ключевых страницах
2. Провести базовый аудит текущего состояния метрик с помощью Lighthouse
3. Определить наиболее проблемные страницы и компоненты для первоочередной оптимизации
4. Внедрить оптимизации постепенно, начиная с наиболее критичных страниц
5. Проводить регулярное тестирование на различных устройствах и типах соединения
6. Интегрировать автоматические тесты производительности в CI/CD пайплайн

## План реализации

1. Настройка мониторинга Web Vitals с использованием библиотеки web-vitals
2. Проведение аудита текущих значений метрик на ключевых страницах
3. Разработка плана оптимизации на основе выявленных проблем
4. Внедрение оптимизаций LCP (изображения, предзагрузка, критические ресурсы)
5. Оптимизация FID и общей производительности JavaScript
6. Устранение проблем с CLS (размеры изображений, резервирование места)
7. Оптимизация TTFB (серверное время ответа, кэширование)
8. Создание системы автоматизированного тестирования метрик
9. Формирование долгосрочной стратегии поддержания хороших показателей

## Критерии завершенности

- Настроена система мониторинга Web Vitals на всех ключевых страницах
- Значения метрик достигли рекомендуемых уровней:
  - LCP: < 2.5 секунд
  - FID: < 100 мс
  - CLS: < 0.1
  - TTFB: < 800 мс
- Разработан дашборд для отображения метрик и их динамики
- Настроены алерты при ухудшении показателей
- Внедрены оптимизации для улучшения метрик
- Создана документация по лучшим практикам поддержания хороших показателей
- Настроено автоматизированное тестирование Web Vitals в CI/CD

## Связь с другими задачами

- **Зависит от:** Задача 2.4 (Внедрение React Server Components), Задача 2.6 (Оптимизация изображений и статических ресурсов)
- **Влияет на:** Задача 3.4 (Настройка алертов и дашбордов для мониторинга), Задача 4.4 (Улучшение пользовательского пути и навигации)

## Примечание

При выполнении задачи важно следовать общему плану проекта, описанному в `dev-plan-stage2.md`. Для отслеживания прогресса не забудьте делать записи о проделанной работе в `status-stage2.md`.

Учитывайте, что некоторые оптимизации Web Vitals могут требовать изменений в других частях приложения, поэтому важно координировать работу с другими задачами, особенно связанными с оптимизацией статических ресурсов и внедрением React Server Components. 