# Задача 1.1: Создание абстрактного слоя для Firebase

## Описание

Необходимо создать абстрактный слой для работы с Firebase, который позволит:
1. Отделить бизнес-логику от конкретной реализации Firebase
2. Упростить тестирование, позволяя легко мокировать внешние зависимости
3. Обеспечить возможность будущей миграции на другие сервисы без серьезных изменений в коде

## Шаги выполнения

1. **Создать интерфейсы для основных сервисов:**
   - Создать директорию `src/lib/api/interfaces`
   - Определить интерфейсы для аутентификации, хранилища данных и файлового хранилища

2. **Реализовать адаптеры для Firebase:**
   - Создать директорию `src/lib/api/firebase`
   - Разработать адаптеры, реализующие созданные интерфейсы

3. **Разработать фабрику для создания экземпляров сервисов:**
   - Создать `src/lib/api/factory.ts`
   - Реализовать методы получения сервисов через единую точку доступа

4. **Обновить конфигурацию Firebase:**
   - Интегрировать новый слой абстракции в существующую конфигурацию
   - Минимизировать прямые зависимости от Firebase SDK

5. **Разработать провайдер для внедрения сервисов:**
   - Создать контекст для доступа к сервисам из любого места приложения
   - Реализовать хуки для удобного доступа к сервисам

## Пример интерфейса для аутентификации

```typescript
// src/lib/api/interfaces/auth.ts
export interface User {
  id: string;
  email?: string | null;
  displayName?: string | null;
  photoURL?: string | null;
}

export interface AuthService {
  getCurrentUser(): User | null;
  onAuthStateChanged(callback: (user: User | null) => void): () => void;
  login(email: string, password: string): Promise<User>;
  register(email: string, password: string): Promise<User>;
  logout(): Promise<void>;
  resetPassword(email: string): Promise<void>;
}
```

## Пример адаптера для Firebase Auth

```typescript
// src/lib/api/firebase/auth-adapter.ts
import { User as FirebaseUser } from 'firebase/auth';
import { auth } from '@/lib/firebase/config';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  onAuthStateChanged as firebaseOnAuthStateChanged
} from 'firebase/auth';
import { AuthService, User } from '../interfaces/auth';

const transformUser = (firebaseUser: FirebaseUser | null): User | null => {
  if (!firebaseUser) return null;
  return {
    id: firebaseUser.uid,
    email: firebaseUser.email,
    displayName: firebaseUser.displayName,
    photoURL: firebaseUser.photoURL
  };
};

export class FirebaseAuthAdapter implements AuthService {
  getCurrentUser(): User | null {
    return transformUser(auth.currentUser);
  }

  onAuthStateChanged(callback: (user: User | null) => void): () => void {
    return firebaseOnAuthStateChanged(auth, (user) => {
      callback(transformUser(user));
    });
  }

  async login(email: string, password: string): Promise<User> {
    const result = await signInWithEmailAndPassword(auth, email, password);
    return transformUser(result.user)!;
  }

  async register(email: string, password: string): Promise<User> {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    return transformUser(result.user)!;
  }

  async logout(): Promise<void> {
    await signOut(auth);
  }

  async resetPassword(email: string): Promise<void> {
    await sendPasswordResetEmail(auth, email);
  }
}
```

## Рекомендации

1. Следуйте принципу SOLID, особенно принципу инверсии зависимостей
2. Создавайте небольшие, узкоспециализированные интерфейсы
3. Помните о типобезопасности при реализации адаптеров
4. Документируйте публичные интерфейсы
5. Не забывайте писать тесты для новых компонентов

## Ожидаемый результат

- Полный набор интерфейсов для работы с внешними сервисами
- Реализация Firebase-адаптеров для этих интерфейсов
- Фабрика для создания экземпляров сервисов
- Обновленный контекст аутентификации, использующий новый слой абстракции
- Тесты для подтверждения работоспособности нового слоя

## Ресурсы

- [Документация Firebase](https://firebase.google.com/docs)
- [Паттерн Адаптер](https://refactoring.guru/design-patterns/adapter)
- [Принцип инверсии зависимостей](https://en.wikipedia.org/wiki/Dependency_inversion_principle)

---

**Важно:** При выполнении задачи следуйте общему плану проекта, который находится в файле `/docs/tasks - stage2/dev-plan-stage2.md`. После выполнения задачи обновите статус в файле `/docs/tasks - stage2/status-stage2.md`. 