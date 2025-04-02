# Задача 5.6: Создание хуков `useLevels` и `useLevel`

## Описание
Создать пользовательские хуки `useLevels` и `useLevel` для получения данных об уровнях и отдельном уровне с использованием React Query.

## Ссылки на документацию
docs/bizlevel-project-context.md
docs/status.md

## Конкретные шаги для Cursor
1. Создать файл `src/hooks/useLevels.ts`
2. Реализовать хук `useLevels` для получения списка всех уровней
3. Реализовать хук `useLevel` для получения данных об отдельном уровне
4. Реализовать хук `useLevelsWithStatus` для получения уровней с их статусом

## Промт для Cursor
```
Помоги мне создать хуки `useLevels` и `useLevel` для проекта BizLevel.

Нам нужно создать файл `src/hooks/useLevels.ts`, который будет содержать хуки для работы с данными об уровнях, используя React Query.

На основе функций из `level-service.ts` и хуков `useAuth` и `useProgress`, нам нужно реализовать следующие хуки:

1. `useLevels() => { data: Level[], isLoading, error, ... }`:
   - Использует `useQuery` с ключом ['levels'] для вызова `getLevels` из level-service.ts
   - Возвращает результат запроса (данные, состояние загрузки, ошибки)

2. `useLevel(levelId: string) => { data: Level | null, isLoading, error, ... }`:
   - Использует `useQuery` с ключом ['level', levelId] для вызова `getLevelById` из level-service.ts
   - Включает опцию enabled: !!levelId для запуска запроса только при наличии levelId
   - Возвращает результат запроса (данные, состояние загрузки, ошибки)

3. `useLevelsWithStatus() => { data: LevelWithStatus[], isLoading, error, ... }`:
   - Комбинирует результаты `useLevels` и `useProgress`
   - Использует `useQuery` с ключом ['levelsWithStatus', userId] для вызова `getLevelsWithStatus`
   - Передает userProgress из хука `useProgress` в функцию `getLevelsWithStatus`
   - Включает опцию enabled: !!userProgress для запуска запроса только при наличии данных о прогрессе
   - Возвращает уровни с добавленным статусом для каждого

4. `useNextLevel(currentLevelId: string) => { data: Level | null, isLoading, error, ... }`:
   - Использует `useQuery` с ключом ['nextLevel', currentLevelId]
   - Сначала вызывает `getNextLevelId` для получения ID следующего уровня
   - Затем вызывает `getLevelById` с полученным ID
   - Включает опцию enabled: !!currentLevelId
   - Возвращает данные о следующем уровне

Все хуки должны корректно обрабатывать состояние загрузки и ошибки, а также учитывать зависимости между данными.

Пожалуйста, создай файл `src/hooks/useLevels.ts` с указанной функциональностью.

После выполнения задачи обнови status.md, указав, что задача 5.6 выполнена.
```

## Ожидаемый результат
- Созданный файл `src/hooks/useLevels.ts`
- Реализованный хук `useLevels` для получения списка всех уровней
- Реализованный хук `useLevel` для получения данных об отдельном уровне
- Реализованный хук `useLevelsWithStatus` для получения уровней с их статусом
- Реализованный хук `useNextLevel` для получения данных о следующем уровне
- Обновленный файл status.md с отметкой о выполнении задачи 5.6

## Связь с другими задачами
- Эта задача следует за задачей 5.5: Создание хука `useProgress`
- После выполнения этой задачи следует перейти к задаче 5.7: Создание страницы Карты Уровней (`/map`)

## Обновление progress-tracking
После выполнения задачи обновите файл development-plan.md, заменив `[ ]` на `[x]` для этой задачи:
```
* [x] **task-5.6-create-uselevels-hook.md**: Создание хуков `useLevels` и `useLevel` (`src/hooks/useLevels.ts`) для получения данных об уровнях
```
