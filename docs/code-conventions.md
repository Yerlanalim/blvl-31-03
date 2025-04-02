# Соглашения по коду BizLevel

Этот документ описывает соглашения по коду, принятые в проекте BizLevel. Соблюдение этих соглашений обеспечивает единообразие кодовой базы, улучшает удобство сопровождения и упрощает совместную работу над проектом.

## Содержание

1. [Именование](#1-именование)
   - [Файлы и директории](#11-файлы-и-директории)
   - [Компоненты и функции](#12-компоненты-и-функции)
   - [Переменные и константы](#13-переменные-и-константы)
   - [Типы и интерфейсы](#14-типы-и-интерфейсы)

2. [Структурирование компонентов](#2-структурирование-компонентов)
   - [Структура компонента](#21-структура-компонента)
   - [Организация импортов](#22-организация-импортов)
   - [Порядок методов](#23-порядок-методов)
   - [Пропсы и состояние](#24-пропсы-и-состояние)

3. [Практики TypeScript](#3-практики-typescript)
   - [Типизация параметров и возвращаемых значений](#31-типизация-параметров-и-возвращаемых-значений)
   - [Использование generic типов](#32-использование-generic-типов)
   - [Работа с типами Firestore](#33-работа-с-типами-firestore)
   - [Индексные сигнатуры и типы](#34-индексные-сигнатуры-и-типы)

4. [Обработка ошибок и логирование](#4-обработка-ошибок-и-логирование)
   - [Обработка ошибок в компонентах](#41-обработка-ошибок-в-компонентах)
   - [Обработка ошибок в сервисах](#42-обработка-ошибок-в-сервисах)
   - [Стандартные сообщения об ошибках](#43-стандартные-сообщения-об-ошибках)
   - [Логирование](#44-логирование)

5. [Тестирование](#5-тестирование)
   - [Соглашения по названиям тестов](#51-соглашения-по-названиям-тестов)
   - [Структура тестов](#52-структура-тестов)
   - [Моки и стабы](#53-моки-и-стабы)
   - [Тестовые данные](#54-тестовые-данные)

6. [Стилизация](#6-стилизация)
   - [Tailwind CSS](#61-tailwind-css)
   - [Организация стилей](#62-организация-стилей)
   - [Темная и светлая темы](#63-темная-и-светлая-темы)

7. [Документирование](#7-документирование)
   - [JSDoc комментарии](#71-jsdoc-комментарии)
   - [Комментарии к компонентам](#72-комментарии-к-компонентам)
   - [Документирование API](#73-документирование-api)

## 1. Именование

### 1.1 Файлы и директории

- **Компоненты React**: PascalCase, .tsx расширение
  ```
  Button.tsx
  UserProfile.tsx
  ```

- **Хуки**: camelCase с префиксом "use", .ts расширение
  ```
  useAuth.ts
  useLevels.ts
  ```

- **Сервисы**: kebab-case с суффиксом "-service", .ts расширение
  ```
  level-service.ts
  progress-service.ts
  ```

- **Утилиты**: kebab-case, .ts расширение
  ```
  format-date.ts
  validation-utils.ts
  ```

- **Константы**: kebab-case, .ts расширение
  ```
  api-endpoints.ts
  error-messages.ts
  ```

- **Страницы Next.js**: page.tsx (в соответствующей директории)
  ```
  /app/(routes)/map/page.tsx
  /app/(auth)/login/page.tsx
  ```

- **Директории для группировки компонентов**: PascalCase
  ```
  /components/features/LevelMap/
  /components/features/Artifacts/
  ```

### 1.2 Компоненты и функции

- **Компоненты React**: PascalCase
  ```typescript
  const Button = () => { ... }
  function UserProfile() { ... }
  ```

- **Обработчики событий**: camelCase с префиксом "handle"
  ```typescript
  const handleClick = () => { ... }
  function handleSubmit(event) { ... }
  ```

- **Асинхронные функции**: camelCase с представлением действия
  ```typescript
  const fetchUserData = async () => { ... }
  async function updateProfile() { ... }
  ```

- **Функции рендеринга**: camelCase с префиксом "render"
  ```typescript
  const renderListItem = (item) => { ... }
  function renderSidebar() { ... }
  ```

### 1.3 Переменные и константы

- **Переменные**: camelCase
  ```typescript
  const userName = 'John'
  let itemCount = 0
  ```

- **Константы**: UPPER_SNAKE_CASE для глобальных, camelCase для локальных
  ```typescript
  // Глобальные константы
  const API_URL = 'https://api.example.com'
  
  // Локальные константы
  const itemsPerPage = 10
  ```

- **Булевы переменные**: camelCase с префиксом "is", "has", "should" и т.д.
  ```typescript
  const isLoading = true
  const hasPermission = false
  const shouldRedirect = user !== null
  ```

### 1.4 Типы и интерфейсы

- **Интерфейсы и типы**: PascalCase
  ```typescript
  interface User { ... }
  type UserRole = 'admin' | 'user'
  ```

- **Енамы**: PascalCase
  ```typescript
  enum Status { ... }
  ```

- **Пропсы компонентов**: PascalCase с суффиксом "Props"
  ```typescript
  interface ButtonProps { ... }
  ```

## 2. Структурирование компонентов

### 2.1 Структура компонента

Следуйте следующей структуре для компонентов:

```typescript
// Imports
import { useState, useEffect } from 'react'
import { useAuth } from '@/hooks/useAuth'

// Types
interface UserProfileProps {
  userId: string
  showActions?: boolean
}

// Component
const UserProfile: React.FC<UserProfileProps> = ({ userId, showActions = false }) => {
  // Hooks
  const { user } = useAuth()
  const [isLoading, setIsLoading] = useState(true)
  
  // Effects
  useEffect(() => {
    // Effect logic
  }, [userId])
  
  // Handlers
  const handleAction = () => {
    // Handler logic
  }
  
  // Render helpers
  const renderActions = () => {
    if (!showActions) return null
    return (
      <div>Actions</div>
    )
  }
  
  // Conditionals (loading, error states)
  if (isLoading) return <Loading />
  
  // Main render
  return (
    <div>
      <h1>User Profile</h1>
      {renderActions()}
    </div>
  )
}

export default UserProfile
```

### 2.2 Организация импортов

Организуйте импорты в следующем порядке:

1. React и библиотеки React
2. Сторонние библиотеки
3. Компоненты
4. Хуки
5. Утилиты и сервисы
6. Типы и интерфейсы
7. Ассеты (изображения, стили)

```typescript
// React и библиотеки React
import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'

// Сторонние библиотеки
import { useQuery } from '@tanstack/react-query'
import { toast } from 'sonner'

// Компоненты
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

// Хуки
import { useAuth } from '@/hooks/useAuth'
import { useLevels } from '@/hooks/useLevels'

// Утилиты и сервисы
import { formatDate } from '@/lib/utils'
import { getLevelById } from '@/lib/services/level-service'

// Типы
import type { Level, UserProgress } from '@/types'
```

### 2.3 Порядок методов

Придерживайтесь следующего порядка методов в компонентах:

1. Хуки (useState, useEffect, useQuery и т.д.)
2. Мемоизированные значения (useMemo, useCallback)
3. Функции-обработчики событий
4. Вспомогательные функции для рендеринга
5. Условные рендеры (для состояний загрузки, ошибок)
6. Основной метод рендеринга (return)

### 2.4 Пропсы и состояние

- Всегда типизируйте пропсы компонентов
- Устанавливайте значения по умолчанию для необязательных пропсов
- Используйте деструктуризацию для пропсов и состояния
- Не используйте `any` для типов пропсов и состояния

```typescript
interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  disabled?: boolean
  onClick?: () => void
  children: React.ReactNode
}

const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  disabled = false,
  onClick,
  children
}) => {
  // Component logic
}
```

## 3. Практики TypeScript

### 3.1 Типизация параметров и возвращаемых значений

- Всегда указывайте типы для параметров функций
- Указывайте возвращаемый тип для функций, если он не очевиден
- Используйте union типы вместо `any`, где это возможно

```typescript
// Хорошо
function formatCurrency(amount: number, currency: string = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency
  }).format(amount)
}

// Плохо
function formatCurrency(amount, currency = 'USD') {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency
  }).format(amount)
}
```

### 3.2 Использование generic типов

- Используйте generic типы для создания гибких и типобезопасных функций
- Именуйте generic типы информативно (T, K, V для общих случаев, более конкретные имена для специфичных случаев)

```typescript
// Хорошо
async function getDoc<T>(collection: string, id: string): Promise<T> {
  // implementation
}

const user = await getDoc<User>('users', userId)

// Более информативное именование
async function withRetry<TData, TError = Error>(
  fn: () => Promise<TData>,
  retries: number = 3
): Promise<TData> {
  // implementation
}
```

### 3.3 Работа с типами Firestore

- Создавайте типы для соответствия структуре Firestore документов
- Используйте типы Firebase для работы с конкретными типами данных (Timestamp, DocumentReference)

```typescript
import { Timestamp, DocumentReference } from 'firebase/firestore'

interface User {
  id: string
  email: string
  displayName: string | null
  photoURL: string | null
  createdAt: Timestamp
  updatedAt: Timestamp
  role: 'admin' | 'user'
  settings: UserSettings
}

interface UserSettings {
  theme: 'light' | 'dark' | 'system'
  notifications: boolean
}
```

### 3.4 Индексные сигнатуры и типы

- Используйте индексные сигнатуры для объектов с динамическими ключами
- Предпочитайте `Record<K, V>` для типизации объектов с известными типами ключей и значений

```typescript
// Объект с динамическими ключами
interface Cache {
  [key: string]: any
}

// Лучше использовать Record с конкретными типами
interface StringCache extends Record<string, string> {}

// Или просто
const cache: Record<string, User> = {}
```

## 4. Обработка ошибок и логирование

### 4.1 Обработка ошибок в компонентах

- Используйте компонент `ErrorBoundary` для перехвата ошибок рендеринга
- Используйте хук `useErrorHandler` для централизованной обработки ошибок
- Отображайте понятные сообщения об ошибках пользователю

```typescript
import { useErrorHandler } from '@/hooks/useErrorHandler'

const MyComponent = () => {
  const { handleError } = useErrorHandler()
  
  const handleClick = async () => {
    try {
      await saveData()
    } catch (error) {
      handleError(error, 'Failed to save data')
    }
  }
  
  return <Button onClick={handleClick}>Save</Button>
}
```

### 4.2 Обработка ошибок в сервисах

- Перехватывайте и логируйте ошибки в сервисных функциях
- Трансформируйте сложные ошибки Firebase в понятные сообщения
- Используйте предопределенные коды ошибок для унификации

```typescript
import { FIREBASE_ERROR_MESSAGES } from '@/lib/constants'

export async function signIn(email: string, password: string) {
  try {
    const result = await firebase.auth().signInWithEmailAndPassword(email, password)
    return result
  } catch (error) {
    const errorCode = error.code
    const errorMessage = FIREBASE_ERROR_MESSAGES[errorCode] || 'An unknown error occurred'
    console.error(`Authentication error: ${errorCode}`, error)
    throw new Error(errorMessage)
  }
}
```

### 4.3 Стандартные сообщения об ошибках

- Определите стандартные сообщения об ошибках в константах
- Используйте эти константы во всем приложении для унификации
- Группируйте сообщения по категориям

```typescript
// src/lib/constants/error-messages.ts
export const AUTH_ERRORS = {
  INVALID_EMAIL: 'The email address is invalid',
  WRONG_PASSWORD: 'The password is incorrect',
  USER_NOT_FOUND: 'No user found with this email address',
  EMAIL_IN_USE: 'This email is already in use'
}

export const FIRESTORE_ERRORS = {
  DOCUMENT_NOT_FOUND: 'The requested document does not exist',
  PERMISSION_DENIED: 'You do not have permission to access this resource',
  NETWORK_ERROR: 'Unable to connect to the database. Please check your internet connection'
}
```

### 4.4 Логирование

- Используйте разные уровни логирования (error, warn, info, debug)
- Не логируйте конфиденциальную информацию
- В продакшене логируйте только важные ошибки

```typescript
// src/lib/utils/logger.ts
export const logger = {
  error: (message: string, error?: any) => {
    console.error(`[ERROR] ${message}`, error)
    // Можно также отправлять ошибки в сервис мониторинга
  },
  
  warn: (message: string, data?: any) => {
    console.warn(`[WARN] ${message}`, data)
  },
  
  info: (message: string, data?: any) => {
    if (process.env.NODE_ENV !== 'production') {
      console.info(`[INFO] ${message}`, data)
    }
  },
  
  debug: (message: string, data?: any) => {
    if (process.env.NODE_ENV === 'development') {
      console.debug(`[DEBUG] ${message}`, data)
    }
  }
}
```

## 5. Тестирование

### 5.1 Соглашения по названиям тестов

- Файлы тестов должны иметь суффикс `.test.ts` или `.test.tsx`
- Размещайте тесты в директории `__tests__` рядом с тестируемым кодом
- Используйте функцию `describe` для группировки тестов
- Используйте функцию `it` или `test` для отдельных тестовых случаев
- Названия тестов должны быть информативными и описывать ожидаемое поведение

```typescript
// src/components/ui/__tests__/Button.test.tsx
import { render, screen } from '@testing-library/react'
import { Button } from '../Button'

describe('Button component', () => {
  it('renders correctly with default props', () => {
    render(<Button>Click me</Button>)
    expect(screen.getByText('Click me')).toBeInTheDocument()
  })
  
  it('applies the correct class for primary variant', () => {
    render(<Button variant="primary">Primary</Button>)
    const button = screen.getByText('Primary')
    expect(button).toHaveClass('bg-primary')
  })
  
  it('is disabled when disabled prop is true', () => {
    render(<Button disabled>Disabled</Button>)
    expect(screen.getByText('Disabled')).toBeDisabled()
  })
})
```

### 5.2 Структура тестов

Каждый тест должен следовать паттерну AAA (Arrange-Act-Assert):

1. **Arrange**: Подготовка данных и компонентов для теста
2. **Act**: Выполнение действия, которое тестируется
3. **Assert**: Проверка ожидаемого результата

```typescript
it('marks a video as watched when clicked', async () => {
  // Arrange
  const mockMarkAsWatched = vi.fn()
  render(<VideoItem video={mockVideo} onMarkWatched={mockMarkAsWatched} />)
  
  // Act
  await userEvent.click(screen.getByText('Mark as watched'))
  
  // Assert
  expect(mockMarkAsWatched).toHaveBeenCalledWith(mockVideo.id)
})
```

### 5.3 Моки и стабы

- Используйте `vi.mock()` для моков модулей
- Используйте `vi.fn()` для моков функций
- Размещайте общие моки в файлах `__mocks__`
- Создавайте моки Firebase в отдельном модуле

```typescript
// src/test/mocks/firebase.ts
export const mockAuth = {
  currentUser: {
    uid: 'test-user-id',
    email: 'test@example.com',
    displayName: 'Test User'
  },
  signInWithEmailAndPassword: vi.fn(),
  signOut: vi.fn(),
  onAuthStateChanged: vi.fn()
}

export const mockFirestore = {
  collection: vi.fn(),
  doc: vi.fn(),
  getDoc: vi.fn(),
  getDocs: vi.fn(),
  setDoc: vi.fn(),
  updateDoc: vi.fn(),
  deleteDoc: vi.fn()
}

vi.mock('firebase/auth', () => ({
  getAuth: () => mockAuth,
  signInWithEmailAndPassword: (...args) => mockAuth.signInWithEmailAndPassword(...args),
  signOut: () => mockAuth.signOut(),
  onAuthStateChanged: (...args) => mockAuth.onAuthStateChanged(...args)
}))
```

### 5.4 Тестовые данные

- Создавайте фабрики для тестовых данных
- Размещайте тестовые данные в модуле `test/fixtures`
- Используйте случайные значения, где это уместно

```typescript
// src/test/fixtures/users.ts
import { faker } from '@faker-js/faker'
import { Timestamp } from 'firebase/firestore'

export function createMockUser(overrides = {}) {
  return {
    id: faker.string.uuid(),
    email: faker.internet.email(),
    displayName: faker.person.fullName(),
    photoURL: faker.image.avatar(),
    createdAt: Timestamp.fromDate(faker.date.past()),
    role: 'user',
    ...overrides
  }
}

export const mockUsers = Array.from({ length: 5 }, createMockUser)
```

## 6. Стилизация

### 6.1 Tailwind CSS

- Используйте утилиты Tailwind для стилизации компонентов
- Следуйте принципу "utility-first"
- Соблюдайте порядок классов: layout → typography → visual

```tsx
<button
  // Layout
  className="flex items-center justify-center py-2 px-4 w-full md:w-auto
             // Typography
             font-medium text-sm leading-5
             // Visual
             bg-primary text-white rounded-md hover:bg-primary-dark
             focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50
             transition-colors"
>
  Submit
</button>
```

### 6.2 Организация стилей

- Используйте shadcn/ui компоненты как основу
- Для сложных компонентов создавайте отдельные Tailwind классы
- Группируйте стили с помощью классов `cn`

```tsx
import { cn } from '@/lib/utils'

interface CardProps {
  variant?: 'default' | 'outline' | 'ghost'
  className?: string
  children: React.ReactNode
}

export const Card: React.FC<CardProps> = ({
  variant = 'default',
  className,
  children
}) => {
  return (
    <div
      className={cn(
        "rounded-lg p-4 shadow",
        variant === 'default' && "bg-white dark:bg-gray-800",
        variant === 'outline' && "border border-gray-200 dark:border-gray-700",
        variant === 'ghost' && "bg-transparent",
        className
      )}
    >
      {children}
    </div>
  )
}
```

### 6.3 Темная и светлая темы

- Используйте системные цвета Tailwind (`bg-background`, `text-foreground`)
- Применяйте атрибуты `dark:` для стилей темной темы
- Используйте CSS-переменные для кастомных цветов темы

```tsx
// globals.css
:root {
  --background: 0 0% 100%;
  --foreground: 222.2 47.4% 11.2%;
  --primary: 221.2 83.2% 53.3%;
  --primary-foreground: 210 40% 98%;
  /* ... */
}

.dark {
  --background: 224 71% 4%;
  --foreground: 213 31% 91%;
  --primary: 217.2 91.2% 59.8%;
  --primary-foreground: 210 40% 98%;
  /* ... */
}

// Component
<div className="bg-background text-foreground">
  <p className="text-primary hover:text-primary/80">
    Primary text with hover effect
  </p>
</div>
```

## 7. Документирование

### 7.1 JSDoc комментарии

- Добавляйте JSDoc комментарии для сервисных функций и утилит
- Документируйте параметры, возвращаемые значения и примеры использования
- Указывайте исключения, которые может генерировать функция

```typescript
/**
 * Отмечает видео как просмотренное для пользователя
 * 
 * @param userId - ID пользователя
 * @param videoId - ID видео
 * @returns Promise, который разрешается при успешном обновлении
 * @throws Если пользователь не найден или нет прав доступа
 * 
 * @example
 * ```ts
 * // Отметить видео как просмотренное
 * await markVideoWatched('user123', 'video456')
 * ```
 */
export async function markVideoWatched(userId: string, videoId: string): Promise<void> {
  // Implementation
}
```

### 7.2 Комментарии к компонентам

- Добавляйте JSDoc комментарии для компонентов и их пропсов
- Описывайте назначение компонента и варианты использования
- Указывайте ссылки на связанные компоненты

```typescript
/**
 * Компонент для отображения карточки уровня на карте обучения
 * 
 * @remarks
 * Этот компонент используется в LevelMap для отображения каждого уровня
 * с учетом его статуса (заблокирован/доступен/пройден)
 */
interface LevelCardProps {
  /** Данные уровня с информацией о статусе */
  level: LevelWithStatus
  /** Вызывается при клике на карточку уровня */
  onClick?: (levelId: string) => void
  /** Класс для дополнительной стилизации */
  className?: string
}

export const LevelCard: React.FC<LevelCardProps> = ({ level, onClick, className }) => {
  // Implementation
}
```

### 7.3 Документирование API

- Создавайте отдельные файлы документации для API и сервисов
- Документируйте структуры данных и схемы
- Включайте примеры запросов и ответов

```markdown
# API чата

Эндпоинт `/api/chat` используется для взаимодействия с OpenAI API.

## Запрос

```json
{
  "messages": [
    {
      "role": "user",
      "content": "Текст запроса пользователя"
    }
  ]
}
```

## Ответ

```json
{
  "message": {
    "role": "assistant",
    "content": "Текст ответа ассистента"
  }
}
```

## Коды ошибок

- 400: Неверный формат запроса
- 401: Отсутствует API ключ
- 500: Ошибка сервера OpenAI
```

---

Эти соглашения по коду должны соблюдаться всеми разработчиками проекта BizLevel. Они помогают поддерживать высокое качество кода и упрощают совместную работу над проектом. 