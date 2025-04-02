# Архитектура проекта BizLevel

Этот документ описывает архитектуру проекта BizLevel, включая структуру приложения, взаимодействие компонентов, организацию данных и ключевые принципы проектирования.

## Содержание

1. [Общая архитектура](#1-общая-архитектура)
   - [Архитектурные принципы](#11-архитектурные-принципы)
   - [Многоуровневая структура](#12-многоуровневая-структура)
   - [Взаимодействие компонентов](#13-взаимодействие-компонентов)

2. [Серверная часть (Backend)](#2-серверная-часть-backend)
   - [Firebase Services](#21-firebase-services)
   - [API Routes](#22-api-routes)
   - [Сервисные функции](#23-сервисные-функции)

3. [Клиентская часть (Frontend)](#3-клиентская-часть-frontend)
   - [App Router](#31-app-router)
   - [Компоненты](#32-компоненты)
   - [Контексты и хуки](#33-контексты-и-хуки)
   - [State Management](#34-state-management)

4. [Модели данных](#4-модели-данных)
   - [Структура Firestore](#41-структура-firestore)
   - [Структура Storage](#42-структура-storage)
   - [TypeScript интерфейсы](#43-typescript-интерфейсы)

5. [Взаимодействие с внешними API](#5-взаимодействие-с-внешними-api)
   - [OpenAI Integration](#51-openai-integration)

6. [Аутентификация и авторизация](#6-аутентификация-и-авторизация)
   - [Модель авторизации](#61-модель-авторизации)
   - [Защита маршрутов](#62-защита-маршрутов)
   - [Правила безопасности Firebase](#63-правила-безопасности-firebase)

7. [Организация кода](#7-организация-кода)
   - [Структура директорий](#71-структура-директорий)
   - [Именование файлов](#72-именование-файлов)
   - [Принципы проектирования](#73-принципы-проектирования)

## 1. Общая архитектура

BizLevel построен как полностью клиентское приложение (SPA), с использованием Next.js App Router и Firebase в качестве бэкенда. Проект использует сервисно-ориентированную архитектуру, где компоненты взаимодействуют с данными через абстрактные сервисные слои.

### 1.1 Архитектурные принципы

Проект BizLevel следует следующим архитектурным принципам:

1. **Разделение ответственности** - каждый модуль отвечает за конкретную функциональность
2. **Абстрагирование инфраструктуры** - сервисные слои скрывают детали реализации
3. **Централизованное управление состоянием** - с использованием React Query и контекстов
4. **Типобезопасность** - строгая типизация через TypeScript во всем проекте
5. **Компонентная архитектура** - модульный подход к построению UI
6. **React Hooks** - использование хуков для логики и состояния

### 1.2 Многоуровневая структура

Проект разделен на следующие архитектурные уровни:

1. **Уровень представления** (UI Layer)
   - Компоненты React
   - Страницы и макеты
   - UI-библиотека shadcn/ui

2. **Уровень бизнес-логики** (Business Logic Layer)
   - React Hooks
   - Сервисные функции
   - Валидация данных (Zod)

3. **Уровень доступа к данным** (Data Access Layer)
   - Firebase интеграция
   - React Query кеширование
   - Сервисы для работы с Firestore/Storage

4. **Уровень инфраструктуры** (Infrastructure Layer)
   - Firebase конфигурация
   - API Routes
   - Утилиты

### 1.3 Взаимодействие компонентов

![Архитектура взаимодействия компонентов](../public/architecture-diagram.png)

*(Примечание: диаграмма не включена в репозиторий, это заполнитель для будущей диаграммы)*

Взаимодействие компонентов происходит по следующей схеме:

1. UI компоненты инициируют действия через React hooks
2. Hooks вызывают соответствующие сервисные функции
3. Сервисные функции взаимодействуют с Firestore/Storage
4. React Query кеширует результаты и управляет состоянием загрузки/ошибок
5. Контексты (например, AuthContext) обеспечивают глобальный доступ к данным

## 2. Серверная часть (Backend)

BizLevel использует Firebase как основной бэкенд для хранения данных, аутентификации и файлового хранилища, дополненный API Routes Next.js для специфичных серверных функций.

### 2.1 Firebase Services

Firebase предоставляет следующие сервисы для проекта:

#### Firebase Authentication
- Управление пользователями
- Email/Password аутентификация
- Опциональный вход через Google

#### Firestore Database
- NoSQL база данных для хранения всех данных приложения
- Структурированные коллекции для уровней, прогресса, артефактов и FAQ
- Правила безопасности для контроля доступа к данным

#### Firebase Storage
- Хранение файлов артефактов и аватаров пользователей
- Управление доступом через правила безопасности
- Организованная структура по папкам (avatars/, artifacts/)

### 2.2 API Routes

Next.js API Routes используются для:

#### /api/chat
- Обрабатывает запросы к OpenAI API
- Принимает историю сообщений и возвращает ответ модели
- Включает контекст BizLevel через system prompt
- Обеспечивает безопасное хранение API ключей (серверная сторона)

### 2.3 Сервисные функции

Проект использует сервисные функции для абстрагирования операций с Firebase:

#### Сервисы аутентификации
- `src/lib/firebase/auth.ts` - работа с Firebase Authentication
- `src/context/AuthContext.tsx` - контекст для аутентификации

#### Сервисы данных
- `src/lib/services/level-service.ts` - управление уровнями
- `src/lib/services/progress-service.ts` - управление прогрессом пользователя
- `src/lib/services/artifact-service.ts` - управление артефактами
- `src/lib/services/chat-service.ts` - взаимодействие с чатом
- `src/lib/services/faq-service.ts` - управление FAQ
- `src/lib/services/settings-service.ts` - управление настройками пользователя
- `src/lib/services/admin-service.ts` - админ-функционал

#### Вспомогательные сервисы
- `src/lib/firebase/firestore.ts` - утилиты для работы с Firestore
- `src/lib/firebase/storage.ts` - утилиты для работы с Storage
- `src/lib/services/analytics-service.ts` - аналитика и метрики

## 3. Клиентская часть (Frontend)

Клиентская часть построена на Next.js с использованием App Router, React и TypeScript.

### 3.1 App Router

Next.js App Router определяет структуру маршрутизации:

#### Группы маршрутов
- `(auth)` - страницы аутентификации
- `(routes)` - основные страницы приложения
- `admin` - админ-панель для управления контентом
- `api` - API маршруты

#### Параметризованные маршруты
- `/level/[levelId]` - страница конкретного уровня
- `/admin/users/[userId]` - страница конкретного пользователя в админке

### 3.2 Компоненты

Компоненты организованы по функциональному признаку:

#### UI компоненты
- `/components/ui` - базовые компоненты интерфейса (shadcn/ui)
- `Button`, `Card`, `Dialog`, `Form`, и т.д.

#### Компоненты аутентификации
- `/components/auth` - формы входа, регистрации и восстановления пароля
- `LoginForm`, `RegisterForm`, `ResetPasswordForm`

#### Функциональные компоненты
- `/components/features/LevelMap` - карта уровней и связанные компоненты
- `/components/features/Artifacts` - компоненты для работы с артефактами
- `/components/features/Chat` - компоненты чата с AI
- `/components/features/Faq` - компоненты для работы с FAQ

#### Компоненты макета
- `/components/layout` - компоненты макета приложения
- `Header`, `Sidebar`, `Footer`, `UserNav`

#### Админ-компоненты
- `/components/admin` - компоненты админ-панели
- `AdminLayout`, `UsersList`, `LevelEditor` и т.д.

### 3.3 Контексты и хуки

Для управления состоянием и логикой используются React контексты и кастомные хуки:

#### Контексты
- `AuthContext` - управление аутентификацией
- `ErrorContext` - централизованная обработка ошибок
- `SettingsContext` - настройки пользователя

#### Кастомные хуки
- `useAuth` - работа с аутентификацией
- `useLevels` - получение и управление уровнями
- `useProgress` - работа с прогрессом пользователя
- `useArtifacts` - работа с артефактами
- `useChat` - взаимодействие с чатом
- `useFaqs` - работа с FAQ
- `useErrorHandler` - обработка ошибок
- `useDebounce` - хук для задержки выполнения

### 3.4 State Management

Для управления состоянием используется комбинация:

#### React Query
- Кеширование данных
- Управление состоянием загрузки/ошибок
- Инвалидация кеша при мутациях
- Параллельные запросы

#### React Context
- Глобальное состояние приложения
- Аутентификация пользователя
- Настройки и предпочтения

#### Локальное состояние
- `useState` для компонент-специфичного состояния
- `useReducer` для более сложной локальной логики

## 4. Модели данных

### 4.1 Структура Firestore

Firestore использует следующую структуру коллекций:

#### Коллекция `users`
- Документ: `{userId}` (совпадает с Firebase Auth UID)
- Поля: `email`, `displayName`, `photoURL`, `createdAt`, `role`, `disabled`, `settings`

#### Коллекция `userProgress`
- Документ: `{userId}`
- Поля: `currentLevelId`, `completedLevelIds[]`, `watchedVideoIds[]`, `completedTestIds[]`, `downloadedArtifactIds[]`

#### Коллекция `levels`
- Документ: `{levelId}`
- Поля: 
  - `title` - название уровня
  - `description` - описание уровня
  - `order` - порядковый номер для сортировки
  - `skillFocus` - навыки, на которые направлен уровень
  - `videoContent[]` - массив видео с полями:
    - `id`, `title`, `description`, `url`, `duration`
  - `tests[]` - массив тестов с полями:
    - `id`, `title`, `questions[]{id, text, options[], correctAnswers[], multipleChoice}`
  - `relatedArtifactIds[]` - массив ID связанных артефактов
  - `completionCriteria` - критерии завершения уровня

#### Коллекция `artifacts`
- Документ: `{artifactId}`
- Поля: `title`, `description`, `fileURL`, `fileName`, `fileType`, `fileSize`, `levelId`, `downloadCount`, `createdAt`, `tags[]`

#### Коллекция `faq`
- Документ: `{faqId}`
- Поля: `question`, `answer`, `category`, `order`

#### Коллекция `chats`
- Документ: `{userId}`
- Подколлекция `messages`:
  - Документ: `{messageId}`
  - Поля: `role`, `content`, `timestamp`

### 4.2 Структура Storage

Firebase Storage организован следующим образом:

#### /avatars/{userId}/{fileName}
- Хранение аватаров пользователей
- Доступны для чтения всем, запись только владельцу и админу

#### /artifacts/{artifactId}/{fileName}
- Хранение файлов артефактов
- Чтение доступно авторизованным пользователям
- Запись доступна только админам

### 4.3 TypeScript интерфейсы

Основные интерфейсы определены в директории `src/types`:

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

#### Level
```typescript
interface Level {
  id: string;
  title: string;
  description: string;
  order: number;
  skillFocus: string[];
  videoContent: Video[];
  tests: Test[];
  relatedArtifactIds: string[];
  completionCriteria: {
    watchAllVideos: boolean;
    completeAllTests: boolean;
    downloadAllArtifacts: boolean;
  };
}
```

#### Artifact
```typescript
interface Artifact {
  id: string;
  title: string;
  description: string;
  fileURL: string;
  fileName: string;
  fileType: string;
  fileSize: number;
  levelId: string;
  downloadCount: number;
  createdAt: Timestamp;
  tags: string[];
}
```

#### Message
```typescript
interface Message {
  id?: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Timestamp;
}
```

#### FAQ
```typescript
interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
  order: number;
}
```

## 5. Взаимодействие с внешними API

### 5.1 OpenAI Integration

BizLevel использует OpenAI API для функционала чата с ассистентом:

#### Архитектура интеграции
1. Клиент отправляет сообщение на API Route `/api/chat`
2. API Route формирует запрос к OpenAI API с:
   - Историей сообщений пользователя
   - System prompt с контекстом BizLevel
   - Параметрами модели (температура, max_tokens)
3. Ответ от OpenAI возвращается клиенту и сохраняется в Firestore
4. Клиент отображает ответ в интерфейсе чата

#### Компоненты интеграции
- `src/app/api/chat/route.ts` - API Route для взаимодействия с OpenAI
- `src/lib/services/chat-service.ts` - сервисные функции для работы с чатом
- `src/hooks/useChat.ts` - React хук для использования чата в компонентах
- `src/components/features/Chat/` - компоненты UI для чата

## 6. Аутентификация и авторизация

### 6.1 Модель авторизации

BizLevel использует Firebase Authentication для аутентификации пользователей:

#### Методы аутентификации
- Email/Password - основной метод
- Google (опционально)

#### Роли пользователей
- `user` - обычный пользователь
- `admin` - администратор с расширенными правами

#### Процесс аутентификации
1. Пользователь вводит учетные данные
2. Firebase Authentication проверяет данные
3. При успешном входе создается сессия
4. Данные пользователя загружаются из Firestore
5. Роль пользователя определяет доступные функции

### 6.2 Защита маршрутов

#### Приватные маршруты
- `AuthGuard` - компонент для защиты маршрутов, требующих аутентификации
- Редиректы неавторизованных пользователей на страницу входа

#### Админ-маршруты
- `AdminProtectedRoute` - компонент для защиты админ-маршрутов
- Проверка роли пользователя и его статуса

#### Редиректы
- Автоматический редирект авторизованных пользователей с публичных страниц
- Сохранение URL для возврата после аутентификации

### 6.3 Правила безопасности Firebase

Firestore и Storage используют правила безопасности:

#### Основные принципы
- Доступ к публичным данным (уровни, артефакты) - только для чтения
- Доступ к личным данным (прогресс, настройки) - только для владельца и админа
- Админ-операции - только для пользователей с ролью `admin`

#### Валидация данных
- Проверка форматов и размеров входящих данных
- Проверка авторства в запросах на изменение

## 7. Организация кода

### 7.1 Структура директорий

Проект организован по следующей структуре:

```
/src
  /app                  # Next.js App Router
    /(auth)             # Страницы аутентификации
    /(routes)           # Основные страницы
    /admin              # Админ-панель
    /api                # API Routes
  /components           # React компоненты
    /auth               # Компоненты аутентификации
    /features           # Функциональные компоненты
    /layout             # Компоненты макета
    /ui                 # UI компоненты
  /context              # React контексты
  /hooks                # Пользовательские хуки
  /lib                  # Утилиты и сервисы
    /firebase           # Конфигурация Firebase
    /services           # Сервисный слой
    /utils              # Общие утилиты
  /types                # TypeScript типы и интерфейсы
  /test                 # Тестирование
  /scripts              # Скрипты для работы с данными
/public                 # Статические файлы
/docs                   # Документация
```

### 7.2 Именование файлов

Проект следует конвенциям именования:

- Компоненты: PascalCase (Button.tsx, UserCard.tsx)
- Хуки: camelCase с префиксом "use" (useAuth.ts, useLevels.ts)
- Утилиты и сервисы: kebab-case (firebase-config.ts, level-service.ts)
- Страницы: page.tsx (в соответствующих директориях)
- Макеты: layout.tsx (в соответствующих директориях)

### 7.3 Принципы проектирования

Проект следует следующим принципам проектирования:

#### SOLID
- Single Responsibility - каждый модуль имеет одну ответственность
- Open/Closed - открыт для расширения, закрыт для изменения
- Liskov Substitution - наследники класса должны быть взаимозаменяемы
- Interface Segregation - интерфейсы разделены на более мелкие
- Dependency Inversion - зависимость от абстракций, а не от конкретных реализаций

#### React Patterns
- Composition - композиция компонентов вместо наследования
- Controlled Components - управляемые компоненты для форм
- Custom Hooks - выделение повторно используемой логики
- Render Props / Higher-Order Components - где это уместно

---

Эта архитектурная документация предназначена для разработчиков, работающих с проектом BizLevel, и обеспечивает понимание структуры, принципов организации и взаимодействия компонентов системы. 