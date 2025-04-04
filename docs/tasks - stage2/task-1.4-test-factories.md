# Задача 1.4: Создание типизированных фабрик для тестов

## Описание

В текущих тестах приложения наблюдается дублирование кода при создании тестовых данных и моков сервисов. Это приводит к сложностям в поддержке и повышает риск ошибок при изменении моделей данных. Необходимо создать типизированные фабрики для генерации тестовых данных и моков, что повысит качество тестов и упростит их поддержку.

## Шаги выполнения

1. **Анализ текущих тестов и выявление повторяющихся моков:**
   - Проанализировать существующие тесты для компонентов, хуков и сервисов
   - Выявить повторяющиеся паттерны создания тестовых данных
   - Определить типовые моки для Firebase и других сервисов

2. **Создание структуры для фабрик тестовых данных:**
   - Создать директорию `src/lib/factories/tests`
   - Определить базовые интерфейсы для фабрик

3. **Реализация фабрик для моделей данных:**
   - Создать фабрики для каждой основной модели данных (User, Level, Progress, Artifact и т.д.)
   - Обеспечить типизацию и возможность частичного переопределения полей
   - Реализовать методы для создания списков объектов

4. **Реализация фабрик для моков сервисов:**
   - Создать фабрики для моков Firebase и других внешних сервисов
   - Обеспечить типизацию и удобное API для настройки поведения моков
   - Реализовать предустановленные сценарии для типичных тестовых случаев

5. **Обновление существующих тестов:**
   - Заменить повторяющиеся моки на использование новых фабрик
   - Обеспечить обратную совместимость для снижения риска внесения ошибок
   - Документировать новый подход к написанию тестов

## Пример фабрики для модели пользователя

```typescript
// src/lib/factories/tests/user-factory.ts
import { User } from '@/types/user';
import { faker } from '@faker-js/faker';

export class UserFactory {
  static create(overrides: Partial<User> = {}): User {
    return {
      id: overrides.id || faker.string.uuid(),
      email: overrides.email || faker.internet.email(),
      displayName: overrides.displayName || faker.person.fullName(),
      photoURL: overrides.photoURL || faker.image.avatar(),
      createdAt: overrides.createdAt || faker.date.past(),
      settings: overrides.settings || {
        theme: 'light',
        notifications: true,
        language: 'ru'
      }
    };
  }

  static createMany(count: number, overrides: Partial<User> = {}): User[] {
    return Array.from({ length: count }, () => this.create(overrides));
  }

  static createForAuth(overrides: Partial<User> = {}): User {
    // Специализированный метод для тестирования аутентификации
    return this.create({
      ...overrides,
      email: overrides.email || 'test@example.com',
      id: overrides.id || 'test-user-1'
    });
  }
}
```

## Пример фабрики для мока Firebase Auth

```typescript
// src/lib/factories/tests/firebase-auth-mock-factory.ts
import { vi } from 'vitest';
import { User } from '@/types/user';
import { UserFactory } from './user-factory';

export interface FirebaseAuthMockOptions {
  initialUser?: User | null;
  shouldFailLogin?: boolean;
  shouldFailRegister?: boolean;
  shouldFailPasswordReset?: boolean;
  loginErrorMessage?: string;
  registerErrorMessage?: string;
  passwordResetErrorMessage?: string;
}

export class FirebaseAuthMockFactory {
  static create(options: FirebaseAuthMockOptions = {}) {
    const {
      initialUser = null,
      shouldFailLogin = false,
      shouldFailRegister = false,
      shouldFailPasswordReset = false,
      loginErrorMessage = 'Mock login error',
      registerErrorMessage = 'Mock register error',
      passwordResetErrorMessage = 'Mock password reset error'
    } = options;

    let currentUser = initialUser;
    const authStateListeners: ((user: User | null) => void)[] = [];

    const updateAuthState = (user: User | null) => {
      currentUser = user;
      authStateListeners.forEach(listener => listener(user));
    };

    return {
      currentUser: { ...currentUser },
      
      signInWithEmailAndPassword: vi.fn(async (auth: any, email: string, password: string) => {
        if (shouldFailLogin) {
          throw new Error(loginErrorMessage);
        }
        
        const user = UserFactory.create({ email });
        updateAuthState(user);
        
        return { user };
      }),
      
      createUserWithEmailAndPassword: vi.fn(async (auth: any, email: string, password: string) => {
        if (shouldFailRegister) {
          throw new Error(registerErrorMessage);
        }
        
        const user = UserFactory.create({ email });
        updateAuthState(user);
        
        return { user };
      }),
      
      signOut: vi.fn(async () => {
        updateAuthState(null);
      }),
      
      sendPasswordResetEmail: vi.fn(async (auth: any, email: string) => {
        if (shouldFailPasswordReset) {
          throw new Error(passwordResetErrorMessage);
        }
      }),
      
      onAuthStateChanged: vi.fn((auth: any, callback: (user: User | null) => void) => {
        authStateListeners.push(callback);
        callback(currentUser);
        
        return () => {
          const index = authStateListeners.indexOf(callback);
          if (index > -1) {
            authStateListeners.splice(index, 1);
          }
        };
      })
    };
  }
}
```

## Пример использования фабрик в тестах

```typescript
// src/hooks/__tests__/useAuth.test.tsx
import { renderHook, act } from '@testing-library/react';
import { useAuth } from '../useAuth';
import { UserFactory } from '@/lib/factories/tests/user-factory';
import { FirebaseAuthMockFactory } from '@/lib/factories/tests/firebase-auth-mock-factory';

vi.mock('firebase/auth', () => {
  return FirebaseAuthMockFactory.create({
    shouldFailLogin: false,
    initialUser: null
  });
});

describe('useAuth', () => {
  test('should login user', async () => {
    const { result } = renderHook(() => useAuth());
    
    await act(async () => {
      await result.current.login('test@example.com', 'password');
    });
    
    expect(result.current.user).not.toBeNull();
    expect(result.current.user?.email).toBe('test@example.com');
  });
  
  // Другие тесты...
});
```

## Рекомендации

1. Используйте библиотеку Faker.js для генерации реалистичных данных
2. Создавайте фабрики с гибким API, позволяющим настраивать поведение
3. Документируйте особенности и предназначение каждой фабрики
4. Не забывайте о типизации для обеспечения безопасности типов
5. Придерживайтесь единого подхода к созданию моков во всех тестах

## Ожидаемый результат

- Набор фабрик для всех основных моделей данных
- Набор фабрик для моков Firebase и других внешних сервисов
- Обновленные тесты, использующие новые фабрики
- Документация по использованию фабрик в тестах
- Снижение дублирования кода в тестах

## Ресурсы

- [Faker.js](https://fakerjs.dev/)
- [Паттерн Factory](https://refactoring.guru/design-patterns/factory-method)
- [Vitest API для моков](https://vitest.dev/api/vi.html)

---

**Важно:** При выполнении задачи следуйте общему плану проекта, который находится в файле `/docs/tasks - stage2/dev-plan-stage2.md`. После выполнения задачи обновите статус в файле `/docs/tasks - stage2/status-stage2.md`. 