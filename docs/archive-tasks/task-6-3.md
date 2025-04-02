# Задача 6.3: Создание хука `useArtifacts`

## Описание
Создать пользовательский хук `useArtifacts` для получения и управления артефактами с использованием React Query и функций из `artifact-service.ts`.


## Конкретные шаги для Cursor
1. Создать файл `src/hooks/useArtifacts.ts`
2. Реализовать хук `useArtifacts` с использованием `useQuery` для получения списка артефактов
3. Реализовать хук `useArtifact` для получения информации об отдельном артефакте
4. Добавить мутации для создания, обновления и удаления артефактов

## Промт для Cursor
```
Помоги мне создать хук `useArtifacts` для проекта BizLevel.

Нам нужно создать файл `src/hooks/useArtifacts.ts`, который будет содержать хуки для работы с артефактами, используя React Query.

На основе функций из `artifact-service.ts`, реализуй следующие хуки:

1. `useArtifacts(filters?: { levelId?: string })` - хук для получения списка артефактов:
   - Использует `useQuery` с ключом ['artifacts', filters]
   - Вызывает функцию `getArtifacts` из artifact-service.ts
   - Возвращает результат запроса (данные, состояние загрузки, ошибки)

2. `useArtifact(artifactId: string)` - хук для получения информации об отдельном артефакте:
   - Использует `useQuery` с ключом ['artifact', artifactId]
   - Вызывает функцию `getArtifactById` из artifact-service.ts
   - Включает опцию enabled: !!artifactId
   - Возвращает результат запроса (данные, состояние загрузки, ошибки)

3. `useLevelArtifacts(levelId: string)` - хук для получения артефактов уровня:
   - Использует `useQuery` с ключом ['levelArtifacts', levelId]
   - Вызывает функцию `getLevelArtifacts` из artifact-service.ts
   - Включает опцию enabled: !!levelId
   - Возвращает результат запроса (данные, состояние загрузки, ошибки)

4. `useCreateArtifact()` - хук для создания нового артефакта:
   - Использует `useMutation` для вызова функции `createArtifact`
   - В onSuccess инвалидирует запросы ['artifacts']
   - Показывает toast-уведомление при успехе/ошибке
   - Возвращает мутацию и состояние

5. `useUpdateArtifact()` - хук для обновления существующего артефакта:
   - Использует `useMutation` для вызова функции `updateArtifact`
   - В onSuccess инвалидирует запросы ['artifacts'] и ['artifact', artifactId]
   - Показывает toast-уведомление при успехе/ошибке
   - Возвращает мутацию и состояние

6. `useDeleteArtifact()` - хук для удаления артефакта:
   - Использует `useMutation` для вызова функции `deleteArtifact`
   - В onSuccess инвалидирует запросы ['artifacts']
   - Показывает toast-уведомление при успехе/ошибке
   - Возвращает мутацию и состояние

7. `useDownloadArtifact(artifactId: string)` - хук для скачивания артефакта:
   - Комбинирует вызов `getArtifactById` для получения URL файла
   - Использует `useMutation` для вызова функции `incrementArtifactDownloadCount`
   - Интегрирует вызов `markArtifactDownloaded` из useProgress (если переданы необходимые параметры)
   - Реализует функцию для скачивания файла по URL
   - Показывает toast-уведомление при успехе/ошибке
   - Возвращает функцию для скачивания и состояние

Все хуки должны корректно обрабатывать состояния загрузки и ошибки, а также использовать toast-уведомления для обратной связи.

Пожалуйста, создай файл `src/hooks/useArtifacts.ts` с указанной функциональностью.

После выполнения задачи обнови status.md, указав, что задача 6.3 выполнена.
```

## Ожидаемый результат
- Созданный файл `src/hooks/useArtifacts.ts`
- Реализованные хуки для работы с артефактами:
  - `useArtifacts`
  - `useArtifact`
  - `useLevelArtifacts`
  - `useCreateArtifact`
  - `useUpdateArtifact`
  - `useDeleteArtifact`
  - `useDownloadArtifact`
- Интеграция с React Query
- Обработка состояний загрузки и ошибок
- Toast-уведомления для обратной связи
- Обновленный файл status.md с отметкой о выполнении задачи 6.3

## Связь с другими задачами
- Эта задача следует за задачей 6.2: Создание `artifact-service.ts`
- После выполнения этой задачи следует перейти к задаче 6.4: Создание страницы Артефактов (`/artifacts`)

## Обновление progress-tracking
После выполнения задачи обновите файл development-plan.md, заменив `[ ]` на `[x]` для этой задачи:
```
* [x] **task-6.3-create-useartifacts-hook.md**: Создание хука `useArtifacts` (`src/hooks/useArtifacts.ts`)
```
