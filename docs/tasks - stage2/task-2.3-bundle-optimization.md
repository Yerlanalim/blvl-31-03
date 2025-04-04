# Задача 2.3: Оптимизация размеров бандла и улучшение загрузки

## Описание

Текущий размер JavaScript-бандла приложения негативно влияет на скорость загрузки и производительность, особенно на мобильных устройствах и медленных соединениях. Необходимо провести анализ бандла, выявить крупные зависимости и внедрить оптимизации для уменьшения размера итоговых JS-файлов, а также улучшить стратегию загрузки статических ресурсов.

## Шаги выполнения

1. **Анализ текущего состояния бандла:**
   - Настроить инструменты для анализа бандла (next/bundle-analyzer)
   - Выявить наиболее крупные зависимости и компоненты
   - Определить неиспользуемый код и потенциальные дубликаты

2. **Оптимизация импортов внешних библиотек:**
   - Внедрить точечные импорты вместо импорта всей библиотеки
   - Заменить тяжелые библиотеки на более легкие альтернативы
   - Применить tree-shaking для удаления неиспользуемого кода

3. **Оптимизация статических ресурсов:**
   - Внедрить сжатие и оптимизацию изображений
   - Настроить кэширование статических ресурсов
   - Реализовать стратегию предварительной загрузки (preloading) критических ресурсов

4. **Улучшение стратегии загрузки JavaScript:**
   - Внедрить разделение кода на критический и некритический
   - Настроить асинхронную загрузку некритических скриптов
   - Оптимизировать парсинг и выполнение JavaScript

5. **Измерение и тестирование:**
   - Провести сравнение размеров бандла до и после оптимизации
   - Измерить влияние оптимизаций на метрики Web Vitals
   - Протестировать производительность на различных устройствах и соединениях

## Пример настройки bundle-analyzer

```javascript
// next.config.js
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  // Другие настройки...
};

module.exports = withBundleAnalyzer(nextConfig);
```

```json
// package.json (добавить скрипт для анализа)
{
  "scripts": {
    "analyze": "ANALYZE=true next build",
    "analyze:prod": "ANALYZE=true npm run build"
  }
}
```

## Пример оптимизации импортов

```typescript
// Было: Импорт всей библиотеки
import * as LucideIcons from 'lucide-react';

// Стало: Точечный импорт только нужных иконок
import { User, Settings, Home, LogOut } from 'lucide-react';
```

```typescript
// Было: Импорт всей библиотеки Lodash
import _ from 'lodash';

// Стало: Точечный импорт только нужных функций
import debounce from 'lodash/debounce';
import throttle from 'lodash/throttle';
```

## Пример оптимизации изображений

```typescript
// src/components/features/Artifacts/ArtifactCard.tsx
import Image from 'next/image';
import { ContentCard } from '@/components/common/Card';
import { Artifact } from '@/types/artifact';

interface ArtifactCardProps {
  artifact: Artifact;
  onDownload: (artifactId: string) => void;
}

export function ArtifactCard({ artifact, onDownload }: ArtifactCardProps) {
  return (
    <ContentCard
      title={artifact.title}
      footer={
        <Button 
          variant="outline" 
          onClick={() => onDownload(artifact.id)}
          className="w-full"
        >
          Скачать
        </Button>
      }
    >
      <div className="aspect-[3/2] relative mb-4 overflow-hidden rounded-md">
        {/* Оптимизированная загрузка изображений с Next.js Image */}
        <Image
          src={artifact.thumbnailURL || '/images/default-artifact.jpg'}
          alt={artifact.title}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover transition-all hover:scale-105"
          loading="lazy"
          placeholder="blur"
          blurDataURL="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIj48cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgZmlsbD0iI2YyZjJmMiIvPjwvc3ZnPg=="
        />
      </div>
      <p className="text-sm text-muted-foreground">{artifact.description}</p>
    </ContentCard>
  );
}
```

## Пример оптимизации загрузки шрифтов

```typescript
// src/app/layout.tsx
import { Inter, Roboto_Mono } from 'next/font/google';

// Оптимизированная загрузка шрифтов с поддержкой подмножества символов
const inter = Inter({
  subsets: ['latin', 'cyrillic'],
  display: 'swap',
  variable: '--font-inter',
  preload: true,
});

const robotoMono = Roboto_Mono({
  subsets: ['latin', 'cyrillic'],
  display: 'swap',
  variable: '--font-roboto-mono',
  preload: false, // Не загружаем предварительно, так как это не основной шрифт
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru" className={`${inter.variable} ${robotoMono.variable}`}>
      <head>
        {/* Предзагрузка критических ресурсов */}
        <link 
          rel="preload" 
          href="/images/logo.svg" 
          as="image" 
          type="image/svg+xml"
        />
        <link 
          rel="preload" 
          href="/api/settings" 
          as="fetch" 
          crossOrigin="anonymous"
        />
      </head>
      <body className="min-h-screen bg-background font-sans antialiased">
        {children}
      </body>
    </html>
  );
}
```

## Пример настройки загрузки третьесторонних скриптов

```typescript
// src/components/features/Analytics/AnalyticsScripts.tsx
import Script from 'next/script';

export function AnalyticsScripts() {
  return (
    <>
      {/* Загрузка Google Analytics с стратегией 'afterInteractive' */}
      <Script
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`}
      />
      <Script
        id="google-analytics"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}');
          `,
        }}
      />
      
      {/* Загрузка других скриптов с низким приоритетом */}
      <Script
        strategy="lazyOnload"
        src="https://some-third-party-script.js"
      />
    </>
  );
}
```

## Пример оптимизации модулей Firebase

```typescript
// src/lib/api/firebase/index.ts
// Импортируем только необходимые модули Firebase
import { initializeApp } from 'firebase/app';
import { getAnalytics, isSupported } from 'firebase/analytics';

// Динамический импорт для модулей, которые не нужны сразу
export const getFirebaseAuth = async () => {
  const { getAuth } = await import('firebase/auth');
  return getAuth(app);
};

export const getFirebaseFirestore = async () => {
  const { getFirestore } = await import('firebase/firestore');
  return getFirestore(app);
};

export const getFirebaseStorage = async () => {
  const { getStorage } = await import('firebase/storage');
  return getStorage(app);
};

// Инициализируем Firebase с минимальными модулями
const app = initializeApp(firebaseConfig);

// Инициализируем аналитику только если она поддерживается
const initAnalytics = async () => {
  if (await isSupported()) {
    return getAnalytics(app);
  }
  return null;
};

export { app, initAnalytics };
```

## Рекомендации

1. Используйте инструменты анализа бандла для выявления крупных зависимостей
2. Применяйте точечные импорты вместо импорта целых библиотек
3. Оптимизируйте изображения и другие статические ресурсы
4. Используйте стратегии отложенной и приоритизированной загрузки
5. Измеряйте производительность до и после оптимизаций для оценки эффекта

## Ожидаемый результат

- Уменьшение размера JS-бандла минимум на 30%
- Сокращение времени загрузки первой страницы
- Улучшение метрик Web Vitals (особенно LCP и TTI)
- Оптимизированная загрузка статических ресурсов
- Улучшенная производительность на мобильных устройствах и медленных соединениях

## Ресурсы

- [Next.js Bundle Analyzer](https://www.npmjs.com/package/@next/bundle-analyzer)
- [Оптимизация JavaScript в Next.js](https://nextjs.org/docs/advanced-features/optimizing-javascript)
- [Web Vitals и оптимизация производительности](https://web.dev/articles/optimize-ttfb)
- [Оптимизация изображений в Next.js](https://nextjs.org/docs/basic-features/image-optimization)

---

**Важно:** При выполнении задачи следуйте общему плану проекта, который находится в файле `/docs/tasks - stage2/dev-plan-stage2.md`. После выполнения задачи обновите статус в файле `/docs/tasks - stage2/status-stage2.md`. 