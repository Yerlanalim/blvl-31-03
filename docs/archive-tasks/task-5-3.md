# Задача 5.3: Создание `progress-service.ts`

## Описание
Создать сервисный слой для работы с прогрессом пользователя, включая функции для инициализации, получения, обновления и отслеживания прогресса пользователя по уровням.

## Ссылки на документацию
docs/bizlevel-project-context.md
docs/status.md

## Конкретные шаги для Cursor
1. Создать файл `src/lib/services/progress-service.ts`
2. Реализовать функции для работы с прогрессом пользователя:
   - инициализация прогресса
   - получение прогресса
   - отметка просмотра видео
   - отметка прохождения теста
   - отметка скачивания артефакта
   - завершение уровня
3. Добавить функцию для проверки и выдачи значков (пока заглушку)

## Промт для Cursor
```
Помоги мне создать сервисный слой для работы с прогрессом пользователя в проекте BizLevel.

Нам нужно создать файл `src/lib/services/progress-service.ts`, который будет содержать функции для работы с прогрессом пользователя в Firestore.

На основе типов из `src/types/index.ts` и хелперов из `src/lib/firebase/firestore.ts`, нам нужно реализовать следующие функции:

1. `initializeUserProgress(userId: string): Promise<void>` - создание начального прогресса для нового пользователя:
   - Создает документ в коллекции `userProgress` с ID, равным userId
   - Устанавливает начальные значения: currentLevelId = 'level-1', пустые массивы для completedLevelIds, watchedVideoIds, completedTestIds, downloadedArtifactIds, skillProgress = {}, badges = []

2. `getUserProgress(userId: string): Promise<UserProgress | null>` - получение прогресса пользователя:
   - Возвращает документ из коллекции `userProgress` с ID, равным userId
   - Если документ не найден, возвращает null

3. `markVideoWatched(userId: string, videoId: string): Promise<void>` - отметка просмотра видео:
   - Добавляет videoId в массив watchedVideoIds
   - Использует arrayUnion для добавления без дубликатов
   - Обновляет lastUpdated

4. `markTestCompleted(userId: string, testId: string): Promise<void>` - отметка прохождения теста:
   - Добавляет testId в массив completedTestIds
   - Использует arrayUnion для добавления без дубликатов
   - Обновляет lastUpdated

5. `markArtifactDownloaded(userId: string, artifactId: string): Promise<void>` - отметка скачивания артефакта:
   - Добавляет artifactId в массив downloadedArtifactIds
   - Использует arrayUnion для добавления без дубликатов
   - Обновляет lastUpdated
   - Также увеличивает downloadCount в документе artifact (используя incrementCounter)

6. `completeLevel(userId: string, levelId: string, nextLevelId: string): Promise<void>` - завершение уровня:
   - Добавляет levelId в массив completedLevelIds
   - Устанавливает currentLevelId = nextLevelId
   - Обновляет lastUpdated
   - Вызывает функцию checkAndAwardBadges

7. `checkAndAwardBadges(userId: string, userProgress: UserProgress): Promise<void>` - проверка и выдача значков:
   - Пока что это может быть заглушка, которая будет реализована позже
   - Можно добавить простую логику: если completedLevelIds.length >= 1, выдать значок "Первый уровень пройден"

8. `isLevelAvailable(userProgress: UserProgress, levelId: string): boolean` - проверка, доступен ли уровень:
   - Вспомогательная функция для определения статуса уровня
   - Уровень доступен, если это текущий уровень или он есть в completedLevelIds

Все функции должны использовать хелперы из `firestore.ts` и быть типизированы с использованием типов из `src/types/index.ts`.

Пожалуйста, создай файл `src/lib/services/progress-service.ts` с указанной функциональностью.

После выполнения задачи обнови status.md, указав, что задача 5.3 выполнена.
```

## Ожидаемый результат
- Созданный файл `src/lib/services/progress-service.ts`
- Реализованные функции для работы с прогрессом пользователя:
  - `initializeUserProgress`
  - `getUserProgress`
  - `markVideoWatched`
  - `markTestCompleted`
  - `markArtifactDownloaded`
  - `completeLevel`
  - `checkAndAwardBadges` (заглушка)
  - `isLevelAvailable`
- Обновленный файл status.md с отметкой о выполнении задачи 5.3

## Связь с другими задачами
- Эта задача следует за задачей 5.2: Создание `firestore.ts` с базовыми хелперами Firestore
- После выполнения этой задачи следует перейти к задаче 5.4: Создание `level-service.ts`

## Обновление progress-tracking
После выполнения задачи обновите файл development-plan.md, заменив `[ ]` на `[x]` для этой задачи:
```
* [x] **task-5.3-create-progress-service.md**: Создание `progress-service.ts` (`src/lib/services/`) с функциями для работы с `userProgress/{userId}` (CRUD, обновления)
```
