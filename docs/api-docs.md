# API и сервисы BizLevel

Этот документ содержит документацию по API и сервисам, которые используются в проекте BizLevel. Документация включает описание сервисного слоя, хуков, API маршрутов и моделей данных.

## Содержание

1. [Обзор архитектуры](#1-обзор-архитектуры)
   - [Принципы организации сервисов](#11-принципы-организации-сервисов)
   - [Структура сервисного слоя](#12-структура-сервисного-слоя)

2. [Сервисы Firebase](#2-сервисы-firebase)
   - [Аутентификация (auth.ts)](#21-аутентификация-authtts)
   - [Firestore (firestore.ts)](#22-firestore-firestoretts)
   - [Storage (storage.ts)](#23-storage-storagetts)

3. [Сервисы для работы с данными](#3-сервисы-для-работы-с-данными)
   - [Сервис уровней (level-service.ts)](#31-сервис-уровней-level-servicets)
   - [Сервис прогресса (progress-service.ts)](#32-сервис-прогресса-progress-servicets)
   - [Сервис артефактов (artifact-service.ts)](#33-сервис-артефактов-artifact-servicets)
   - [Сервис чата (chat-service.ts)](#34-сервис-чата-chat-servicets)
   - [Сервис FAQ (faq-service.ts)](#35-сервис-faq-faq-servicets)
   - [Сервис настроек (settings-service.ts)](#36-сервис-настроек-settings-servicets)
   - [Админ-сервис (admin-service.ts)](#37-админ-сервис-admin-servicets)
   - [Аналитика (analytics-service.ts)](#38-аналитика-analytics-servicets)

4. [React Hooks](#4-react-hooks)
   - [Хуки аутентификации](#41-хуки-аутентификации)
   - [Хуки для работы с данными](#42-хуки-для-работы-с-данными)
   - [Вспомогательные хуки](#43-вспомогательные-хуки)

5. [API Routes](#5-api-routes)
   - [API чата (/api/chat)](#51-api-чата-apichat)

6. [Схемы данных](#6-схемы-данных)
   - [Модели Firestore](#61-модели-firestore)
   - [Модели API-запросов](#62-модели-api-запросов)

## 1. Обзор архитектуры

Проект BizLevel использует многоуровневую архитектуру с разделением ответственности. Сервисный слой абстрагирует взаимодействие с Firebase и внешними API, а React hooks предоставляют удобный интерфейс для компонентов.

### 1.1 Принципы организации сервисов

Сервисный слой BizLevel построен по следующим принципам:

1. **Изоляция инфраструктуры** - сервисы абстрагируют детали работы с Firebase и другими внешними API.
2. **Единая ответственность** - каждый сервис отвечает за работу с конкретной областью данных.
3. **Типизация** - все входные и выходные данные типизированы с помощью TypeScript.
4. **Обработка ошибок** - сервисы включают централизованную обработку ошибок и логирование.
5. **Асинхронность** - все операции с внешними ресурсами асинхронные, с использованием Promise.

### 1.2 Структура сервисного слоя

Сервисный слой BizLevel организован в виде набора модулей в директориях:

- `/src/lib/firebase/` - базовые утилиты для работы с Firebase
- `/src/lib/services/` - сервисы для работы с данными

Каждый сервис экспортирует набор функций, которые используются в React hooks и компонентах. Хуки предоставляют интеграцию с React Query для кеширования, управления состоянием загрузки и обработки ошибок.

## 2. Сервисы Firebase

### 2.1 Аутентификация (auth.ts)

Файл `src/lib/firebase/auth.ts` предоставляет функции для работы с Firebase Authentication.

#### Инициализация

```typescript
import { getAuth } from 'firebase/auth';
import { app } from './config';

// Получение инстанса Auth
export const auth = getAuth(app);
```

#### Основные функции

| Функция | Описание | Параметры | Возвращаемое значение |
|---------|----------|-----------|----------------------|
| `signIn` | Вход пользователя по email/password | `email: string, password: string` | `Promise<UserCredential>` |
| `signUp` | Регистрация нового пользователя | `email: string, password: string` | `Promise<UserCredential>` |
| `signOut` | Выход пользователя | - | `Promise<void>` |
| `resetPassword` | Отправка письма для сброса пароля | `email: string` | `Promise<void>` |
| `updateUserProfile` | Обновление профиля пользователя | `user: User, data: { displayName?: string, photoURL?: string }` | `Promise<void>` |
| `getCurrentUser` | Получение текущего пользователя | - | `User \| null` |

#### Пример использования

```typescript
import { signIn, signOut } from '@/lib/firebase/auth';

// Вход пользователя
async function handleLogin(email: string, password: string) {
  try {
    const result = await signIn(email, password);
    // Обработка успешного входа
    return result.user;
  } catch (error) {
    // Обработка ошибки
    console.error('Login error:', error);
    throw error;
  }
}

// Выход пользователя
async function handleLogout() {
  try {
    await signOut();
    // Обработка успешного выхода
  } catch (error) {
    // Обработка ошибки
    console.error('Logout error:', error);
    throw error;
  }
}
```

### 2.2 Firestore (firestore.ts)

Файл `src/lib/firebase/firestore.ts` предоставляет базовые утилиты для работы с Firestore Database.

#### Инициализация

```typescript
import { getFirestore } from 'firebase/firestore';
import { app } from './config';

// Получение инстанса Firestore
export const db = getFirestore(app);
```

#### Основные функции

| Функция | Описание | Параметры | Возвращаемое значение |
|---------|----------|-----------|----------------------|
| `getDoc` | Получение документа | `collection: string, id: string` | `Promise<T>` |
| `getDocs` | Получение коллекции документов | `collection: string, options?: QueryOptions` | `Promise<T[]>` |
| `addDoc` | Добавление документа с автогенерацией ID | `collection: string, data: T` | `Promise<string>` (ID) |
| `setDoc` | Создание или полная замена документа | `collection: string, id: string, data: T` | `Promise<void>` |
| `updateDoc` | Обновление полей документа | `collection: string, id: string, data: Partial<T>` | `Promise<void>` |
| `deleteDoc` | Удаление документа | `collection: string, id: string` | `Promise<void>` |
| `queryDocs` | Запрос документов с фильтрацией | `collection: string, queries: Query[]` | `Promise<T[]>` |

#### Пример использования

```typescript
import { getDoc, addDoc, updateDoc } from '@/lib/firebase/firestore';

// Получение пользователя
async function getUser(userId: string) {
  try {
    const user = await getDoc<User>('users', userId);
    return user;
  } catch (error) {
    console.error('Error fetching user:', error);
    throw error;
  }
}

// Создание документа
async function createPost(data: Post) {
  try {
    const postId = await addDoc<Post>('posts', data);
    return postId;
  } catch (error) {
    console.error('Error creating post:', error);
    throw error;
  }
}

// Обновление документа
async function updateUserSettings(userId: string, settings: UserSettings) {
  try {
    await updateDoc<User>('users', userId, { settings });
  } catch (error) {
    console.error('Error updating settings:', error);
    throw error;
  }
}
```

### 2.3 Storage (storage.ts)

Файл `src/lib/firebase/storage.ts` предоставляет функции для работы с Firebase Storage.

#### Инициализация

```typescript
import { getStorage } from 'firebase/storage';
import { app } from './config';

// Получение инстанса Storage
export const storage = getStorage(app);

// Базовые пути
export const AVATARS_PATH = 'avatars';
export const ARTIFACTS_PATH = 'artifacts';
```

#### Основные функции

| Функция | Описание | Параметры | Возвращаемое значение |
|---------|----------|-----------|----------------------|
| `uploadFile` | Загрузка файла в Storage | `path: string, file: File, metadata?: any` | `Promise<string>` (URL) |
| `getFileURL` | Получение URL файла | `path: string` | `Promise<string>` |
| `deleteFile` | Удаление файла | `path: string` | `Promise<void>` |
| `uploadUserAvatar` | Загрузка аватара пользователя | `userId: string, file: File` | `Promise<string>` (URL) |
| `uploadArtifactFile` | Загрузка файла артефакта | `artifactId: string, file: File` | `Promise<string>` (URL) |

#### Пример использования

```typescript
import { uploadUserAvatar, deleteFile } from '@/lib/firebase/storage';

// Загрузка аватара
async function handleAvatarUpload(userId: string, file: File) {
  try {
    const avatarURL = await uploadUserAvatar(userId, file);
    // Сохранение URL в профиле пользователя
    return avatarURL;
  } catch (error) {
    console.error('Avatar upload error:', error);
    throw error;
  }
}

// Удаление файла
async function handleFileDelete(filePath: string) {
  try {
    await deleteFile(filePath);
    // Обработка успешного удаления
  } catch (error) {
    console.error('File deletion error:', error);
    throw error;
  }
}
```

## 3. Сервисы для работы с данными

### 3.1 Сервис уровней (level-service.ts)

Файл `src/lib/services/level-service.ts` предоставляет функции для работы с уровнями обучения.

#### Основные функции

| Функция | Описание | Параметры | Возвращаемое значение |
|---------|----------|-----------|----------------------|
| `getLevels` | Получение всех уровней | - | `Promise<Level[]>` |
| `getLevelById` | Получение уровня по ID | `levelId: string` | `Promise<Level>` |
| `getLevelsWithStatus` | Получение уровней со статусом | `userProgress: UserProgress` | `Promise<LevelWithStatus[]>` |
| `getNextLevelId` | Получение ID следующего уровня | `currentLevelId: string` | `Promise<string \| null>` |
| `isLevelCompleted` | Проверка завершенности уровня | `userProgress: UserProgress, levelId: string` | `boolean` |

#### Пример использования

```typescript
import { getLevels, getLevelById } from '@/lib/services/level-service';

// Получение всех уровней
async function fetchLevels() {
  try {
    const levels = await getLevels();
    return levels;
  } catch (error) {
    console.error('Error fetching levels:', error);
    throw error;
  }
}

// Получение конкретного уровня
async function fetchLevelDetails(levelId: string) {
  try {
    const level = await getLevelById(levelId);
    return level;
  } catch (error) {
    console.error(`Error fetching level ${levelId}:`, error);
    throw error;
  }
}
```

### 3.2 Сервис прогресса (progress-service.ts)

Файл `src/lib/services/progress-service.ts` предоставляет функции для работы с прогрессом пользователя.

#### Основные функции

| Функция | Описание | Параметры | Возвращаемое значение |
|---------|----------|-----------|----------------------|
| `getUserProgress` | Получение прогресса пользователя | `userId: string` | `Promise<UserProgress>` |
| `initUserProgress` | Инициализация прогресса нового пользователя | `userId: string` | `Promise<UserProgress>` |
| `markVideoWatched` | Отметка видео как просмотренного | `userId: string, videoId: string` | `Promise<void>` |
| `markTestCompleted` | Отметка теста как пройденного | `userId: string, testId: string` | `Promise<void>` |
| `markArtifactDownloaded` | Отметка артефакта как скачанного | `userId: string, artifactId: string` | `Promise<void>` |
| `completeLevel` | Завершение уровня | `userId: string, levelId: string, nextLevelId: string` | `Promise<void>` |
| `isVideoWatched` | Проверка, просмотрено ли видео | `userProgress: UserProgress, videoId: string` | `boolean` |
| `isTestCompleted` | Проверка, пройден ли тест | `userProgress: UserProgress, testId: string` | `boolean` |
| `isArtifactDownloaded` | Проверка, скачан ли артефакт | `userProgress: UserProgress, artifactId: string` | `boolean` |
| `canCompleteLevel` | Проверка возможности завершения уровня | `userProgress: UserProgress, level: Level` | `{ canComplete: boolean, reasons: string[] }` |

#### Пример использования

```typescript
import { 
  getUserProgress, 
  markVideoWatched, 
  completeLevel 
} from '@/lib/services/progress-service';

// Получение прогресса пользователя
async function fetchUserProgress(userId: string) {
  try {
    const progress = await getUserProgress(userId);
    return progress;
  } catch (error) {
    console.error('Error fetching progress:', error);
    throw error;
  }
}

// Отметка видео как просмотренного
async function handleVideoWatched(userId: string, videoId: string) {
  try {
    await markVideoWatched(userId, videoId);
    // Обработка успешного обновления
  } catch (error) {
    console.error('Error marking video watched:', error);
    throw error;
  }
}

// Завершение уровня
async function handleLevelCompletion(userId: string, levelId: string, nextLevelId: string) {
  try {
    await completeLevel(userId, levelId, nextLevelId);
    // Обработка успешного обновления
  } catch (error) {
    console.error('Error completing level:', error);
    throw error;
  }
}
```

### 3.3 Сервис артефактов (artifact-service.ts)

Файл `src/lib/services/artifact-service.ts` предоставляет функции для работы с артефактами.

#### Основные функции

| Функция | Описание | Параметры | Возвращаемое значение |
|---------|----------|-----------|----------------------|
| `getArtifacts` | Получение списка артефактов | `filter?: { levelId?: string }` | `Promise<Artifact[]>` |
| `getArtifactById` | Получение артефакта по ID | `artifactId: string` | `Promise<Artifact>` |
| `createArtifact` | Создание нового артефакта | `data: ArtifactInput, file: File` | `Promise<string>` (ID) |
| `updateArtifact` | Обновление артефакта | `artifactId: string, data: Partial<ArtifactInput>, file?: File` | `Promise<void>` |
| `deleteArtifact` | Удаление артефакта | `artifactId: string` | `Promise<void>` |
| `getArtifactsByIds` | Получение артефактов по списку ID | `artifactIds: string[]` | `Promise<Artifact[]>` |
| `getLevelArtifacts` | Получение артефактов уровня | `levelId: string` | `Promise<Artifact[]>` |
| `incrementArtifactDownloadCount` | Увеличение счетчика скачиваний | `artifactId: string` | `Promise<void>` |

#### Пример использования

```typescript
import { 
  getArtifacts, 
  getArtifactById, 
  createArtifact 
} from '@/lib/services/artifact-service';

// Получение списка артефактов
async function fetchArtifacts(levelId?: string) {
  try {
    const artifacts = await getArtifacts(levelId ? { levelId } : undefined);
    return artifacts;
  } catch (error) {
    console.error('Error fetching artifacts:', error);
    throw error;
  }
}

// Получение конкретного артефакта
async function fetchArtifactDetails(artifactId: string) {
  try {
    const artifact = await getArtifactById(artifactId);
    return artifact;
  } catch (error) {
    console.error(`Error fetching artifact ${artifactId}:`, error);
    throw error;
  }
}

// Создание нового артефакта
async function handleArtifactCreation(data: ArtifactInput, file: File) {
  try {
    const artifactId = await createArtifact(data, file);
    return artifactId;
  } catch (error) {
    console.error('Error creating artifact:', error);
    throw error;
  }
}
```

### 3.4 Сервис чата (chat-service.ts)

Файл `src/lib/services/chat-service.ts` предоставляет функции для работы с чатом и интеграции с OpenAI.

#### Основные функции

| Функция | Описание | Параметры | Возвращаемое значение |
|---------|----------|-----------|----------------------|
| `getChatMessages` | Получение истории сообщений | `userId: string, limit?: number` | `Promise<Message[]>` |
| `saveMessage` | Сохранение сообщения в историю | `userId: string, message: Omit<Message, 'id'>` | `Promise<string>` (ID) |
| `sendMessage` | Отправка сообщения и получение ответа | `userId: string, message: string, history: Message[]` | `Promise<Message>` |
| `clearChatHistory` | Очистка истории чата | `userId: string` | `Promise<void>` |

### 3.5 Сервис FAQ (faq-service.ts)

Файл `src/lib/services/faq-service.ts` предоставляет функции для работы с часто задаваемыми вопросами.

#### Основные функции

| Функция | Описание | Параметры | Возвращаемое значение |
|---------|----------|-----------|----------------------|
| `getFaqs` | Получение списка FAQ | `filters?: { category?: string }` | `Promise<FAQ[]>` |
| `getFaqCategories` | Получение категорий FAQ | - | `Promise<string[]>` |
| `searchFaqs` | Поиск по FAQ | `query: string` | `Promise<FAQ[]>` |

### 3.6 Сервис настроек (settings-service.ts)

Файл `src/lib/services/settings-service.ts` предоставляет функции для работы с настройками пользователя.

#### Основные функции

| Функция | Описание | Параметры | Возвращаемое значение |
|---------|----------|-----------|----------------------|
| `getUserSettings` | Получение настроек пользователя | `userId: string` | `Promise<UserSettings>` |
| `updateUserSettings` | Обновление настроек пользователя | `userId: string, settings: Partial<UserSettings>` | `Promise<void>` |
| `getDefaultSettings` | Получение настроек по умолчанию | - | `UserSettings` |

### 3.7 Админ-сервис (admin-service.ts)

Файл `src/lib/services/admin-service.ts` предоставляет функции для административного управления.

#### Основные функции

Для пользователей:
- `getUsers`
- `getUserById`
- `updateUserRole`
- `deleteUser`
- `getUserStats`

Для уровней:
- `getLevelsAdmin`
- `createLevel`
- `updateLevel`
- `deleteLevel`
- `reorderLevels`

Для артефактов:
- `getArtifactsAdmin`
- `createArtifact`
- `updateArtifact`
- `deleteArtifact`
- `resetDownloadCount`

### 3.8 Аналитика (analytics-service.ts)

Файл `src/lib/services/analytics-service.ts` предоставляет функции для работы с аналитикой и метриками.

#### Основные функции

| Функция | Описание | Параметры | Возвращаемое значение |
|---------|----------|-----------|----------------------|
| `reportWebVitals` | Отправка Core Web Vitals | `metric: Metric` | `void` |
| `trackEvent` | Отслеживание событий пользователя | `name: string, properties?: Record<string, any>` | `void` |

## 4. React Hooks

React hooks предоставляют интеграцию сервисов с React и React Query для управления состоянием, кеширования и обработки ошибок.

### 4.1 Хуки аутентификации

#### useAuth

```typescript
const {
  user,                // Текущий пользователь или null
  isLoading,           // Флаг загрузки
  error,               // Ошибка
  login,               // Функция входа
  register,            // Функция регистрации
  logout,              // Функция выхода
  resetPassword,       // Функция сброса пароля
  isAuthenticated,     // Флаг аутентификации
  isAdmin              // Флаг админа
} = useAuth();
```

### 4.2 Хуки для работы с данными

#### useLevels

```typescript
// Получение всех уровней
const { data: levels, isLoading, error } = useLevels();

// Получение конкретного уровня
const { data: level, isLoading, error } = useLevel(levelId);

// Получение уровней со статусом
const { data: levelsWithStatus, isLoading, error } = useLevelsWithStatus();

// Получение следующего уровня
const { data: nextLevel, isLoading, error } = useNextLevel(currentLevelId);
```

#### useProgress

```typescript
// Получение прогресса пользователя
const { data: progress, isLoading, error } = useProgress();

// Мутации
const { mutate: markAsWatched, isLoading: isMarkingWatched } = useMarkVideoWatched();
const { mutate: markAsCompleted, isLoading: isMarkingCompleted } = useMarkTestCompleted();
const { mutate: markAsDownloaded, isLoading: isMarkingDownloaded } = useMarkArtifactDownloaded();
const { mutate: completeLevel, isLoading: isCompletingLevel } = useCompleteLevel();
```

#### useArtifacts, useChat, useFaqs, и другие

Все эти хуки следуют аналогичной структуре, предоставляя данные, состояния загрузки, ошибки и мутации для взаимодействия с соответствующими сервисами.

### 4.3 Вспомогательные хуки

#### useErrorHandler

```typescript
const { handleError, clearErrors, withErrorHandling } = useErrorHandler();
```

#### useDebounce

```typescript
const debouncedValue = useDebounce(value, delay);
```

## 5. API Routes

### 5.1 API чата (/api/chat)

#### Описание

API Route `/api/chat` используется для взаимодействия с OpenAI API и получения ответов ассистента.

#### Формат запроса

```typescript
interface ChatRequest {
  messages: {
    role: 'user' | 'assistant' | 'system';
    content: string;
  }[];
}
```

#### Формат ответа

```typescript
interface ChatResponse {
  message?: {
    role: 'assistant';
    content: string;
  };
  error?: string;
}
```

#### Пример использования

```typescript
// Отправка запроса
const response = await fetch('/api/chat', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    messages: [
      { role: 'user', content: 'Привет, расскажи о BizLevel.' }
    ],
  }),
});

// Обработка ответа
if (response.ok) {
  const data = await response.json();
  console.log(data.message.content);
} else {
  console.error('Error:', await response.text());
}
```

## 6. Схемы данных

### 6.1 Модели Firestore

Основные модели данных, используемые в проекте:

#### User
```typescript
interface User {
  id: string;
  email: string;
  displayName: string | null;
  photoURL: string | null;
  createdAt: Timestamp;
  role: 'user' | 'admin';
  disabled?: boolean;
  settings?: UserSettings;
}
```

#### UserProgress
```typescript
interface UserProgress {
  userId: string;
  currentLevelId: string;
  completedLevelIds: string[];
  watchedVideoIds: string[];
  completedTestIds: string[];
  downloadedArtifactIds: string[];
}
```

#### Level, Artifact, Message, FAQ

Полные схемы данных этих моделей описаны в разделе [TypeScript интерфейсы](#43-typescript-интерфейсы) документации по архитектуре.

### 6.2 Модели API-запросов

API-запросы в проекте в основном используются для взаимодействия с OpenAI API через API Route `/api/chat`.

Подробное описание формата запросов и ответов представлено в разделе [API чата (/api/chat)](#51-api-чата-apichat).

---

Эта документация предоставляет обзор API и сервисов, используемых в проекте BizLevel. Для более подробной информации о конкретных функциях и их параметрах, обратитесь к исходному коду и комментариям JSDoc. 