# Задача 4.1: Внедрение юнит-тестирования для критичных компонентов

## Описание

Для повышения надежности и качества кода необходимо внедрить систематическое юнит-тестирование критически важных компонентов приложения. Это позволит выявлять проблемы на ранних этапах разработки, обеспечивать корректную работу компонентов при рефакторинге и улучшать документирование ожидаемого поведения функций и компонентов.

## Шаги выполнения

1. **Настройка инфраструктуры для тестирования:**
   - Установить и настроить Jest и React Testing Library
   - Настроить конфигурацию для тестирования компонентов Next.js
   - Создать вспомогательные утилиты для тестирования
   - Интегрировать тестирование в процесс сборки

2. **Определение критичных компонентов для тестирования:**
   - Проанализировать кодовую базу и выявить ключевые компоненты
   - Приоритизировать компоненты по критичности и сложности
   - Составить план тестирования компонентов
   - Определить целевой процент покрытия кода тестами

3. **Разработка тестов для сервисов и утилит:**
   - Написать тесты для сервисов аутентификации
   - Разработать тесты для сервисов работы с данными
   - Протестировать утилиты и хелперы
   - Создать моки для внешних зависимостей

4. **Разработка тестов для компонентов UI:**
   - Создать тесты для форм и компонентов ввода
   - Разработать тесты для компонентов навигации
   - Протестировать интерактивные компоненты
   - Проверить корректное отображение компонентов в различных состояниях

5. **Интеграция тестирования в процесс разработки:**
   - Настроить автоматическое выполнение тестов при коммитах
   - Интегрировать отчеты о покрытии кода тестами
   - Разработать стандарты и лучшие практики для написания тестов
   - Провести обучение команды по написанию эффективных тестов

## Пример настройки Jest для Next.js проекта

```javascript
// jest.config.js
const nextJest = require('next/jest');

const createJestConfig = nextJest({
  // Путь к приложению Next.js
  dir: './',
});

// Пользовательская конфигурация Jest
const customJestConfig = {
  // Директории с тестами
  testDir: '<rootDir>/__tests__',
  
  // Добавляем пути для разрешения модулей
  moduleDirectories: ['node_modules', '<rootDir>/'],
  
  // Настройка Jest DOM environment для тестирования компонентов
  testEnvironment: 'jest-environment-jsdom',
  
  // Настраиваем пути для импортов
  moduleNameMapper: {
    '^@/components/(.*)$': '<rootDir>/src/components/$1',
    '^@/pages/(.*)$': '<rootDir>/src/pages/$1',
    '^@/hooks/(.*)$': '<rootDir>/src/hooks/$1',
    '^@/lib/(.*)$': '<rootDir>/src/lib/$1',
    '^@/utils/(.*)$': '<rootDir>/src/utils/$1',
    '^@/context/(.*)$': '<rootDir>/src/context/$1',
  },
  
  // Настраиваем покрытие кода
  collectCoverage: true,
  collectCoverageFrom: [
    'src/**/*.{js,jsx,ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/*.stories.{js,jsx,ts,tsx}',
    '!src/pages/_app.tsx',
    '!src/pages/_document.tsx',
  ],
  
  // Порог покрытия кода
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70,
    },
  },
  
  // Настройки для тестов
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
};

// Экспортируем конфигурацию
module.exports = createJestConfig(customJestConfig);
```

## Пример файла настройки Jest

```javascript
// jest.setup.js
import '@testing-library/jest-dom';
import { TextEncoder, TextDecoder } from 'util';

// Добавляем глобальные моки
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

// Мокаем fetch API
global.fetch = jest.fn();

// Мокаем Firebase
jest.mock('firebase/app', () => {
  return {
    initializeApp: jest.fn(),
    getApp: jest.fn(),
  };
});

jest.mock('firebase/auth', () => {
  return {
    getAuth: jest.fn(),
    signInWithEmailAndPassword: jest.fn(),
    createUserWithEmailAndPassword: jest.fn(),
    signOut: jest.fn(),
    onAuthStateChanged: jest.fn(),
  };
});

jest.mock('firebase/firestore', () => {
  return {
    getFirestore: jest.fn(),
    collection: jest.fn(),
    doc: jest.fn(),
    getDoc: jest.fn(),
    getDocs: jest.fn(),
    setDoc: jest.fn(),
    updateDoc: jest.fn(),
    deleteDoc: jest.fn(),
    query: jest.fn(),
    where: jest.fn(),
    orderBy: jest.fn(),
    limit: jest.fn(),
  };
});

// Мокаем next/router
jest.mock('next/router', () => ({
  useRouter: jest.fn().mockReturnValue({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
    query: {},
    pathname: '/',
    asPath: '/',
  }),
}));

// Подавляем предупреждения React в консоли для тестов
jest.spyOn(console, 'error').mockImplementation((...args) => {
  if (
    args[0]?.includes?.('Warning: ReactDOM.render is no longer supported') ||
    args[0]?.includes?.('Warning: React.createFactory()')
  ) {
    return;
  }
  console.error(...args);
});
```

## Пример утилиты для тестирования с контекстами

```typescript
// src/utils/test-utils.tsx
import React, { ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { AuthProvider } from '@/context/auth-provider';
import { ThemeProvider } from '@/context/theme-provider';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Создаем новый QueryClient для каждого теста
const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        cacheTime: 0,
        staleTime: 0,
        refetchOnWindowFocus: false,
      },
    },
  });

// Обертка со всеми провайдерами для тестов
function AllProviders({ children }: { children: React.ReactNode }) {
  const queryClient = createTestQueryClient();
  
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="light">
        <AuthProvider>{children}</AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

// Кастомная функция рендера с провайдерами
const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => render(ui, { wrapper: AllProviders, ...options });

// Экспортируем все из testing-library
export * from '@testing-library/react';

// Переопределяем функцию render
export { customRender as render };
```

## Пример юнит-теста для компонента

```typescript
// __tests__/components/common/Button.test.tsx
import { render, screen, fireEvent } from '@/utils/test-utils';
import { Button } from '@/components/ui/button';

describe('Button Component', () => {
  it('renders correctly with default props', () => {
    render(<Button>Click me</Button>);
    
    const button = screen.getByRole('button', { name: /click me/i });
    expect(button).toBeInTheDocument();
    expect(button).toHaveClass('bg-primary');
    expect(button).not.toBeDisabled();
  });
  
  it('applies variant classes correctly', () => {
    render(<Button variant="outline">Outline Button</Button>);
    
    const button = screen.getByRole('button', { name: /outline button/i });
    expect(button).toHaveClass('border-input');
    expect(button).not.toHaveClass('bg-primary');
  });
  
  it('applies size classes correctly', () => {
    render(<Button size="sm">Small Button</Button>);
    
    const button = screen.getByRole('button', { name: /small button/i });
    expect(button).toHaveClass('h-8');
    expect(button).toHaveClass('px-3');
  });
  
  it('can be disabled', () => {
    render(<Button disabled>Disabled Button</Button>);
    
    const button = screen.getByRole('button', { name: /disabled button/i });
    expect(button).toBeDisabled();
    expect(button).toHaveClass('opacity-50');
  });
  
  it('calls onClick handler when clicked', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    
    const button = screen.getByRole('button', { name: /click me/i });
    fireEvent.click(button);
    
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
  
  it('does not call onClick when disabled', () => {
    const handleClick = jest.fn();
    render(<Button disabled onClick={handleClick}>Click me</Button>);
    
    const button = screen.getByRole('button', { name: /click me/i });
    fireEvent.click(button);
    
    expect(handleClick).not.toHaveBeenCalled();
  });
  
  it('renders with children', () => {
    render(
      <Button>
        <span data-testid="custom-child">Custom Child</span>
      </Button>
    );
    
    expect(screen.getByTestId('custom-child')).toBeInTheDocument();
  });
  
  it('forwards additional props to the button element', () => {
    render(<Button data-testid="custom-button" aria-label="Custom Button">Button</Button>);
    
    const button = screen.getByTestId('custom-button');
    expect(button).toHaveAttribute('aria-label', 'Custom Button');
  });
});
```

## Пример юнит-теста для хука

```typescript
// __tests__/hooks/useAuth.test.tsx
import { renderHook, act } from '@testing-library/react';
import { useAuth } from '@/hooks/useAuth';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from 'firebase/auth';

// Мокаем модули firebase
jest.mock('firebase/auth', () => ({
  getAuth: jest.fn(),
  signInWithEmailAndPassword: jest.fn(),
  createUserWithEmailAndPassword: jest.fn(),
  signOut: jest.fn(),
  onAuthStateChanged: jest.fn((auth, callback) => {
    // Инициализируем состояние как "не аутентифицирован"
    callback(null);
    // Возвращаем функцию отписки
    return jest.fn();
  }),
}));

// Мокируем getAuth
jest.mock('@/lib/api/firebase', () => ({
  getAuth: jest.fn().mockReturnValue({}),
}));

describe('useAuth Hook', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  
  it('should initialize with unauthenticated state', () => {
    const { result } = renderHook(() => useAuth());
    
    expect(result.current.user).toBeNull();
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
  });
  
  it('should sign in user with email and password', async () => {
    // Мокируем успешный вход
    (signInWithEmailAndPassword as jest.Mock).mockResolvedValueOnce({
      user: { uid: '123', email: 'test@example.com' },
    });
    
    const { result } = renderHook(() => useAuth());
    
    await act(async () => {
      await result.current.signIn('test@example.com', 'password');
    });
    
    expect(signInWithEmailAndPassword).toHaveBeenCalledWith(
      expect.anything(),
      'test@example.com',
      'password'
    );
    expect(result.current.error).toBeNull();
  });
  
  it('should handle sign in error', async () => {
    const errorMessage = 'Invalid email or password';
    (signInWithEmailAndPassword as jest.Mock).mockRejectedValueOnce(new Error(errorMessage));
    
    const { result } = renderHook(() => useAuth());
    
    await act(async () => {
      await result.current.signIn('test@example.com', 'wrong-password');
    });
    
    expect(result.current.error).toEqual(expect.objectContaining({
      message: errorMessage,
    }));
    expect(result.current.user).toBeNull();
  });
  
  it('should sign up user with email and password', async () => {
    (createUserWithEmailAndPassword as jest.Mock).mockResolvedValueOnce({
      user: { uid: '123', email: 'new@example.com' },
    });
    
    const { result } = renderHook(() => useAuth());
    
    await act(async () => {
      await result.current.signUp('new@example.com', 'password');
    });
    
    expect(createUserWithEmailAndPassword).toHaveBeenCalledWith(
      expect.anything(),
      'new@example.com',
      'password'
    );
    expect(result.current.error).toBeNull();
  });
  
  it('should sign out user', async () => {
    (signOut as jest.Mock).mockResolvedValueOnce(undefined);
    
    const { result } = renderHook(() => useAuth());
    
    await act(async () => {
      await result.current.signOut();
    });
    
    expect(signOut).toHaveBeenCalled();
    expect(result.current.user).toBeNull();
    expect(result.current.error).toBeNull();
  });
});
```

## Пример юнит-теста для утилиты

```typescript
// __tests__/utils/formatters.test.ts
import { formatDate, formatCurrency, formatFileSize } from '@/utils/formatters';

describe('Date Formatter', () => {
  it('should format date correctly with default format', () => {
    const date = new Date(2023, 0, 15); // Jan 15, 2023
    expect(formatDate(date)).toBe('15.01.2023');
  });
  
  it('should format date with custom format', () => {
    const date = new Date(2023, 0, 15);
    expect(formatDate(date, 'DD MMMM YYYY')).toBe('15 января 2023');
  });
  
  it('should handle invalid date', () => {
    expect(formatDate(null)).toBe('');
    expect(formatDate(undefined)).toBe('');
    expect(formatDate('invalid-date' as any)).toBe('');
  });
});

describe('Currency Formatter', () => {
  it('should format number as RUB currency', () => {
    expect(formatCurrency(1234.56)).toBe('1 234,56 ₽');
  });
  
  it('should format number with custom currency', () => {
    expect(formatCurrency(1234.56, 'USD')).toBe('$1,234.56');
  });
  
  it('should handle zero and negative values', () => {
    expect(formatCurrency(0)).toBe('0,00 ₽');
    expect(formatCurrency(-1234.56)).toBe('-1 234,56 ₽');
  });
});

describe('File Size Formatter', () => {
  it('should format bytes to human readable format', () => {
    expect(formatFileSize(1024)).toBe('1.0 KB');
    expect(formatFileSize(1024 * 1024)).toBe('1.0 MB');
    expect(formatFileSize(1024 * 1024 * 1024)).toBe('1.0 GB');
  });
  
  it('should handle small values', () => {
    expect(formatFileSize(100)).toBe('100 B');
  });
  
  it('should handle zero and negative values', () => {
    expect(formatFileSize(0)).toBe('0 B');
    expect(formatFileSize(-1024)).toBe('0 B'); // Отрицательные значения обрабатываются как 0
  });
});
```

## Рекомендации

1. **Тестируйте поведение, а не реализацию** - фокусируйтесь на том, что компонент должен делать, а не как он это делает
2. **Используйте моки с умом** - мокайте внешние зависимости, но не переусердствуйте с моками внутренних компонентов
3. **Выбирайте правильный уровень абстракции** - не тестируйте внутренние детали реализации
4. **Придерживайтесь трех "A"** - Arrange (подготовка), Act (действие), Assert (проверка)
5. **Делайте тесты независимыми** - каждый тест должен быть изолирован от других
6. **Тестируйте краевые случаи** - пустые массивы, null, undefined, ошибки
7. **Используйте хорошие имена тестов** - они должны описывать что тестируется и какой результат ожидается

## Ожидаемый результат

- Настроенная инфраструктура для юнит-тестирования
- Разработанные тесты для критичных компонентов и сервисов
- Автоматизированное выполнение тестов при сборке проекта
- Отчеты о покрытии кода тестами
- Стандарты и лучшие практики для написания тестов
- Повышение качества и надежности кода

## Ресурсы

- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [Testing Next.js Applications](https://nextjs.org/docs/testing)
- [React Hooks Testing](https://react-hooks-testing-library.com/)
- [Testing Library Queries](https://testing-library.com/docs/queries/about/)

---

**Важно:** При выполнении задачи следуйте общему плану проекта, который находится в файле `/docs/tasks - stage2/dev-plan-stage2.md`. После выполнения задачи обновите статус в файле `/docs/tasks - stage2/status-stage2.md`. 