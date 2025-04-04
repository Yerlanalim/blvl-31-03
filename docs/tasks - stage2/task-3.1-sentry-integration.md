# Задача 3.1: Настройка Sentry для отслеживания ошибок

## Описание

Для повышения надежности приложения и быстрого обнаружения проблем необходимо внедрить систему мониторинга ошибок. Sentry позволяет в реальном времени отслеживать ошибки, получать подробную информацию о контексте их возникновения и оперативно реагировать на проблемы. Эта задача включает настройку Sentry для фронтенд и бэкенд части приложения, а также настройку фильтрации и группировки ошибок для эффективного анализа.

## Шаги выполнения

1. **Подготовка и настройка проекта Sentry:**
   - Зарегистрировать аккаунт и создать проект в Sentry
   - Настроить окружения (development, staging, production)
   - Создать токены доступа для различных компонентов приложения
   - Настроить интеграцию с системой контроля версий

2. **Интеграция Sentry в Next.js приложение:**
   - Установить необходимые пакеты для интеграции с Next.js
   - Настроить middleware для перехвата ошибок серверной части
   - Интегрировать Sentry в клиентскую часть приложения
   - Настроить отслеживание производительности и профилирование

3. **Настройка пользовательского контекста и дополнительной информации:**
   - Добавить информацию о пользователе в сообщения об ошибках
   - Настроить передачу информации о состоянии приложения
   - Создать пользовательские теги для фильтрации ошибок
   - Настроить передачу breadcrumbs (хлебных крошек) для отслеживания последовательности действий

4. **Настройка фильтрации и группировки ошибок:**
   - Настроить игнорирование определенных типов ошибок
   - Создать правила для группировки похожих ошибок
   - Настроить приоритезацию ошибок и оповещения
   - Создать механизм для отображения дополнительной отладочной информации

5. **Интеграция с процессом разработки:**
   - Настроить интеграцию Sentry с системой трекинга задач (GitHub/Linear)
   - Создать автоматические комментарии в PR при связанных ошибках
   - Разработать процесс обработки и назначения ответственных за ошибки
   - Настроить периодическую отчетность по ошибкам

## Пример настройки Sentry в Next.js 14

```typescript
// sentry.config.ts
import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  
  // Настройки среды
  environment: process.env.NODE_ENV,
  
  // Включение трассировки производительности
  tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.2 : 1.0,
  
  // Включение профилирования
  profilesSampleRate: 0.1,
  
  // Настройка режима отладки
  debug: process.env.NODE_ENV === 'development',
  
  // Обработка ошибок, чтобы игнорировать некоторые (например, ошибки CORS)
  beforeSend(event, hint) {
    // Игнорируем ошибки CORS в production
    if (process.env.NODE_ENV === 'production' && event.exception) {
      const errorValue = hint?.originalException?.toString() || '';
      if (errorValue.includes('CORS') || errorValue.includes('AbortError')) {
        return null;
      }
    }
    return event;
  },
  
  // Настройка интеграций
  integrations: [
    new Sentry.Integrations.Breadcrumbs({
      console: true,
      dom: true,
      fetch: true,
      history: true,
      xhr: true,
    }),
  ],
  
  // Настройка области действия (для связывания событий)
  autoSessionTracking: true,
});
```

## Пример файла `sentry.client.config.ts`

```typescript
// sentry.client.config.ts
import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  
  // Настройки, которые применяются только на клиенте
  integrations: [
    new Sentry.Replay({
      // Настройки записи сессии
      maskAllText: true,
      blockAllMedia: true,
      // Сэмплирование: записываем 10% обычных сессий и 100% сессий с ошибками
      sessionSampleRate: 0.1,
      errorSampleRate: 1.0,
    }),
  ],
  
  // Добавляем контекст маршрутизации
  replaysOnErrorSampleRate: 1.0,
});
```

## Пример файла `sentry.server.config.ts`

```typescript
// sentry.server.config.ts
import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  
  // Настройки, которые применяются только на сервере
  // Обычно мы хотим более высокую частоту сэмплирования на сервере
  tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.5 : 1.0,
});
```

## Создание клиентского монитора ошибок

```typescript
// src/lib/monitoring/error-monitor.ts
import * as Sentry from '@sentry/nextjs';

type ErrorLevel = 'info' | 'warning' | 'error' | 'fatal';

interface ErrorDetails {
  message: string;
  source?: string;
  tags?: Record<string, string>;
  extra?: Record<string, any>;
  user?: {
    id?: string;
    email?: string;
    role?: string;
  };
  level?: ErrorLevel;
}

/**
 * Сервис для мониторинга ошибок и отправки их в Sentry
 */
export class ErrorMonitor {
  /**
   * Фиксирует ошибку в системе мониторинга
   */
  static captureError(error: Error | string, details?: Omit<ErrorDetails, 'message'>) {
    const errorMessage = typeof error === 'string' ? error : error.message;
    
    // Подготавливаем данные для отправки в Sentry
    const scope = new Sentry.Scope();
    
    // Добавляем теги для фильтрации
    if (details?.tags) {
      Object.entries(details.tags).forEach(([key, value]) => {
        scope.setTag(key, value);
      });
    }
    
    // Добавляем дополнительный контекст
    if (details?.extra) {
      Object.entries(details.extra).forEach(([key, value]) => {
        scope.setExtra(key, value);
      });
    }
    
    // Устанавливаем источник ошибки
    if (details?.source) {
      scope.setTag('source', details.source);
    }
    
    // Устанавливаем пользователя
    if (details?.user) {
      scope.setUser(details.user);
    }
    
    // Устанавливаем уровень ошибки
    if (details?.level) {
      scope.setLevel(details.level as Sentry.SeverityLevel);
    }
    
    // Отправляем ошибку в Sentry
    if (typeof error === 'string') {
      Sentry.captureMessage(error, scope);
    } else {
      Sentry.captureException(error, scope);
    }
    
    // Логируем ошибку в консоль в режиме разработки
    if (process.env.NODE_ENV === 'development') {
      console.error('[ErrorMonitor]', errorMessage, details);
    }
  }
  
  /**
   * Добавляет хлебную крошку для отслеживания последовательности действий
   */
  static addBreadcrumb(message: string, category: string, data?: Record<string, any>) {
    Sentry.addBreadcrumb({
      message,
      category,
      data,
      level: 'info',
    });
  }
  
  /**
   * Устанавливает текущего пользователя для контекста ошибок
   */
  static setUser(user: { id?: string; email?: string; role?: string }) {
    Sentry.setUser(user);
  }
  
  /**
   * Очищает информацию о пользователе (например, при выходе)
   */
  static clearUser() {
    Sentry.setUser(null);
  }
}
```

## Интеграция с контекстом аутентификации

```typescript
// src/context/auth-provider.tsx
import { createContext, useContext, useEffect } from 'react';
import { ErrorMonitor } from '@/lib/monitoring/error-monitor';
import { useAuth } from '@/hooks/useAuth';

// Определение контекста аутентификации
const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const auth = useAuth();
  
  // Устанавливаем пользователя в контекст Sentry
  useEffect(() => {
    if (auth.user) {
      ErrorMonitor.setUser({
        id: auth.user.uid,
        email: auth.user.email,
        role: auth.user.role || 'user',
      });
      
      // Добавляем хлебную крошку о входе
      ErrorMonitor.addBreadcrumb(
        'User logged in',
        'auth',
        { userId: auth.user.uid }
      );
    } else {
      ErrorMonitor.clearUser();
    }
  }, [auth.user]);
  
  // Логируем ошибки аутентификации
  useEffect(() => {
    if (auth.error) {
      ErrorMonitor.captureError(auth.error, {
        source: 'authentication',
        tags: {
          authMethod: auth.lastAuthMethod || 'unknown',
        },
        level: 'warning',
      });
    }
  }, [auth.error, auth.lastAuthMethod]);
  
  return (
    <AuthContext.Provider value={auth}>
      {children}
    </AuthContext.Provider>
  );
}
```

## Пример глобальной обработки ошибок в компонентах

```typescript
// src/components/common/ErrorBoundary.tsx
import { Component, ReactNode } from 'react';
import { ErrorMonitor } from '@/lib/monitoring/error-monitor';
import { Button } from '@/components/ui/button';

interface ErrorBoundaryProps {
  fallback?: ReactNode;
  children: ReactNode;
  name?: string;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: any) {
    // Отправляем ошибку в Sentry с дополнительной информацией
    ErrorMonitor.captureError(error, {
      source: `component:${this.props.name || 'unknown'}`,
      extra: {
        componentStack: errorInfo.componentStack,
      },
      level: 'error',
    });
  }
  
  handleRetry = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }
      
      // Стандартный fallback компонент при ошибке
      return (
        <div className="p-4 border rounded-md bg-red-50 text-red-700">
          <h3 className="text-lg font-semibold mb-2">
            Что-то пошло не так
          </h3>
          <p className="mb-4 text-sm">
            Произошла ошибка при отображении этого компонента. Мы уже работаем над её устранением.
          </p>
          <Button onClick={this.handleRetry} variant="outline" size="sm">
            Попробовать снова
          </Button>
        </div>
      );
    }

    return this.props.children;
  }
}
```

## Рекомендации

1. **Фильтруйте ошибки умно** - не все ошибки стоит отправлять, некоторые являются неизбежными или нерелевантными
2. **Добавляйте контекст** - обогащайте ошибки информацией о пользователе, состоянии приложения и последовательности действий
3. **Настройте оповещения** - настройте правила оповещения для критических ошибок
4. **Внедрите breadcrumbs** - они помогают понять, какие действия привели к ошибке
5. **Используйте уровни ошибок** - различайте информационные сообщения, предупреждения и критические ошибки
6. **Защищайте персональные данные** - не передавайте чувствительную информацию пользователей в сообщениях об ошибках
7. **Связывайте ошибки с релизами** - это поможет выявить, в какой версии появилась проблема

## Ожидаемый результат

- Полная интеграция Sentry в приложение (клиент и сервер)
- Настроенная система группировки и фильтрации ошибок
- Настроенные правила оповещения для критических ошибок
- Интеграция с процессом разработки и системой трекинга задач
- Улучшенная обработка ошибок в приложении с информативными сообщениями для пользователей
- Регулярная отчетность по обнаруженным ошибкам и их статусу

## Ресурсы

- [Официальная документация Sentry для Next.js](https://docs.sentry.io/platforms/javascript/guides/nextjs/)
- [Мониторинг производительности в Sentry](https://docs.sentry.io/product/performance/)
- [Лучшие практики для использования Sentry](https://docs.sentry.io/product/sentry-basics/best-practices/)
- [Источники полезной отладочной информации](https://docs.sentry.io/platforms/javascript/enriching-events/context/)

---

**Важно:** При выполнении задачи следуйте общему плану проекта, который находится в файле `/docs/tasks - stage2/dev-plan-stage2.md`. После выполнения задачи обновите статус в файле `/docs/tasks - stage2/status-stage2.md`. 