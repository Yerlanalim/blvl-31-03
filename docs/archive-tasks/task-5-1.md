# Задача 5.1: Определение основных TypeScript типов

## Описание
Определить основные TypeScript типы и интерфейсы для работы с уровнями, прогрессом пользователя, навыками и другими ключевыми сущностями приложения BizLevel.

## Ссылки на документацию
docs/bizlevel-project-context.md
docs/status.md

## Конкретные шаги для Cursor
1. Создать директорию `src/types/` (если она еще не создана)
2. Создать файл `src/types/index.ts` для экспорта всех типов
3. Определить основные типы и интерфейсы:
   - `Level` - структура уровня
   - `UserProgress` - прогресс пользователя
   - `SkillType` - типы навыков
   - `Badge` - структура значка
   - `Question` - структура вопроса теста
   - Другие необходимые типы

## Промт для Cursor
```
Помоги мне определить основные TypeScript типы для проекта BizLevel.

Нам нужно создать файл `src/types/index.ts`, который будет содержать определения всех основных типов и интерфейсов проекта.

На основе раздела 4.3 "Модели Данных Firestore" из документации проекта, нам нужно определить следующие типы:

1. Перечисления:
   - `SkillType` - типы навыков (Marketing, Finance, Management, Leadership, Communication, Sales и т.д.)
   - `LevelStatus` - статус уровня (Locked, Available, Completed)

2. Интерфейсы:
   - `User` - структура пользователя:
     - id: string
     - email: string
     - displayName: string | null
     - photoURL: string | null
     - createdAt: Date
     - settings: UserSettings

   - `UserSettings` - настройки пользователя:
     - theme: 'light' | 'dark' | 'system'
     - notificationsEnabled: boolean

   - `UserProgress` - прогресс пользователя:
     - userId: string
     - currentLevelId: string
     - completedLevelIds: string[]
     - watchedVideoIds: string[]
     - completedTestIds: string[]
     - downloadedArtifactIds: string[]
     - skillProgress: Record<SkillType, number>
     - badges: Badge[]
     - lastUpdated: Date

   - `Badge` - структура значка:
     - id: string
     - title: string
     - description: string
     - imageUrl: string
     - earnedAt: Date

   - `Level` - структура уровня:
     - id: string
     - title: string
     - description: string
     - order: number
     - videoContent: VideoContent[]
     - tests: Test[]
     - relatedArtifactIds: string[]
     - completionCriteria: CompletionCriteria
     - skillFocus: SkillType[]

   - `VideoContent` - структура видео-контента:
     - id: string
     - title: string
     - url: string
     - duration: number
     - watched?: boolean (client-side property)

   - `Test` - структура теста:
     - id: string
     - title: string
     - questions: Question[]
     - completed?: boolean (client-side property)

   - `Question` - структура вопроса:
     - id: string
     - text: string
     - type: 'multiple-choice' | 'single-choice' | 'text'
     - options?: string[]
     - correctAnswer: string | string[]

   - `CompletionCriteria` - критерии завершения уровня:
     - videosRequired: number
     - testsRequired: number

   - `Artifact` - структура артефакта:
     - id: string
     - title: string
     - description: string
     - fileURL: string
     - fileName: string
     - fileType: string
     - levelId: string
     - downloadCount: number
     - uploadedAt: Date
     - downloaded?: boolean (client-side property)

3. Вспомогательные типы:
   - `LevelWithStatus` - уровень с добавленным статусом (для клиентской стороны):
     - Объединение типа Level и { status: LevelStatus }

Пожалуйста, создай файл `src/types/index.ts` с определениями всех этих типов и интерфейсов.

После выполнения задачи обнови status.md, указав, что задача 5.1 выполнена.
```

## Ожидаемый результат
- Созданный файл `src/types/index.ts`
- Определенные основные типы и интерфейсы:
  - `SkillType`
  - `LevelStatus`
  - `User`
  - `UserSettings`
  - `UserProgress`
  - `Badge`
  - `Level`
  - `VideoContent`
  - `Test`
  - `Question`
  - `CompletionCriteria`
  - `Artifact`
  - `LevelWithStatus`
- Обновленный файл status.md с отметкой о выполнении задачи 5.1

## Связь с другими задачами
- Эта задача следует за задачей 4.7 и начинает Этап 5
- После выполнения этой задачи следует перейти к задаче 5.2: Создание `firestore.ts` с базовыми хелперами Firestore

## Обновление progress-tracking
После выполнения задачи обновите файл development-plan.md, заменив `[ ]` на `[x]` для этой задачи:
```
* [x] **task-5.1-define-core-types.md**: Определение основных TypeScript типов
```
