# Задача 5.4: Создание `level-service.ts`

## Описание
Создать сервисный слой для работы с уровнями, включая функции для получения списка уровней и детальной информации об отдельном уровне.

## Ссылки на документацию
docs/bizlevel-project-context.md
docs/status.md

## Конкретные шаги для Cursor
1. Создать файл `src/lib/services/level-service.ts`
2. Реализовать функции для работы с уровнями:
   - получение списка всех уровней
   - получение информации об отдельном уровне
   - получение списка уровней с их статусом (на основе прогресса пользователя)

## Промт для Cursor
```
Помоги мне создать сервисный слой для работы с уровнями в проекте BizLevel.

Нам нужно создать файл `src/lib/services/level-service.ts`, который будет содержать функции для работы с уровнями в Firestore.

На основе типов из `src/types/index.ts` и хелперов из `src/lib/firebase/firestore.ts`, нам нужно реализовать следующие функции:

1. `getLevels(): Promise<Level[]>` - получение списка всех уровней:
   - Возвращает все документы из коллекции `levels`
   - Сортирует их по полю `order`

2. `getLevelById(levelId: string): Promise<Level | null>` - получение информации о конкретном уровне:
   - Возвращает документ из коллекции `levels` с указанным ID
   - Если документ не найден, возвращает null

3. `getLevelsWithStatus(userProgress: UserProgress): Promise<LevelWithStatus[]>` - получение уровней с их статусом:
   - Получает все уровни через getLevels()
   - Для каждого уровня определяет его статус на основе userProgress:
     - Если уровень в completedLevelIds, статус = 'Completed'
     - Если уровень = currentLevelId, статус = 'Available'
     - Если порядковый номер уровня меньше текущего (или уровень уже завершен), статус = 'Available'
     - Иначе статус = 'Locked'
   - Возвращает массив уровней с добавленным полем status

4. `getNextLevelId(currentLevelId: string): Promise<string | null>` - получение ID следующего уровня:
   - Получает все уровни через getLevels()
   - Находит текущий уровень по ID
   - Возвращает ID уровня с order = currentLevel.order + 1
   - Если следующего уровня нет, возвращает null

5. `isLevelCompleted(userProgress: UserProgress, levelId: string): boolean` - проверка, завершен ли уровень:
   - Вспомогательная функция
   - Возвращает true, если levelId есть в completedLevelIds

Все функции должны использовать хелперы из `firestore.ts` и быть типизированы с использованием типов из `src/types/index.ts`.

Пожалуйста, создай файл `src/lib/services/level-service.ts` с указанной функциональностью.

После выполнения задачи обнови status.md, указав, что задача 5.4 выполнена.
```

## Ожидаемый результат
- Созданный файл `src/lib/services/level-service.ts`
- Реализованные функции для работы с уровнями:
  - `getLevels`
  - `getLevelById`
  - `getLevelsWithStatus`
  - `getNextLevelId`
  - `isLevelCompleted`
- Обновленный файл status.md с отметкой о выполнении задачи 5.4

## Связь с другими задачами
- Эта задача следует за задачей 5.3: Создание `progress-service.ts`
- После выполнения этой задачи следует перейти к задаче 5.5: Создание хука `useProgress`

## Обновление progress-tracking
После выполнения задачи обновите файл development-plan.md, заменив `[ ]` на `[x]` для этой задачи:
```
* [x] **task-5.4-create-level-service.md**: Создание `level-service.ts` (`src/lib/services/`) для получения данных об уровнях (`levels`)
```
