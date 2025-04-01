# Задача 6.1: Создание `storage.ts` для работы с Firebase Storage

## Описание
Создать файл `storage.ts` в директории `src/lib/firebase/` для работы с Firebase Storage, который будет предоставлять функции для загрузки, скачивания и управления файлами.

## Ссылки на документацию
- [Этап 6, Шаг 1](../BizLevel-%20План%20Реализации%20Проекта.%2031.03.rtf): Создание `storage.ts` для работы с Firebase Storage
- [Раздел 4.2: Конфигурация Firebase в Коде](../BizLevel-%20План%20Реализации%20Проекта.%2031.03.rtf): Экспорт инстанса `getStorage()`, хелперы для загрузки/получения файлов

## Конкретные шаги для Cursor
1. Создать файл `src/lib/firebase/storage.ts` (если он еще не создан)
2. Реализовать базовые функции для работы с Firebase Storage
3. Добавить типизацию для всех функций
4. Обновить файл `src/lib/firebase/index.ts` для экспорта функций из `storage.ts`

## Промт для Cursor
```
Помоги мне создать файл `storage.ts` для работы с Firebase Storage в проекте BizLevel.

Нам нужно создать файл `src/lib/firebase/storage.ts`, который будет содержать функции для работы с Firebase Storage: загрузка, скачивание и управление файлами.

Файл должен содержать следующие функции:

1. `getStorage()` - получение инстанса Firebase Storage
2. `uploadFile(file: File, path: string, metadata?: any): Promise<string>` - загрузка файла в Storage и возврат URL для скачивания
3. `getFileURL(path: string): Promise<string>` - получение URL для скачивания файла
4. `deleteFile(path: string): Promise<void>` - удаление файла из Storage
5. `uploadUserAvatar(userId: string, file: File): Promise<string>` - специальная функция для загрузки аватара пользователя
6. `uploadArtifactFile(artifactId: string, file: File): Promise<string>` - специальная функция для загрузки файла артефакта

Каждая функция должна:
- Быть типизирована с использованием TypeScript
- Обрабатывать потенциальные ошибки и возвращать понятные сообщения
- Правильно управлять путями файлов в Storage
- Использовать подходящие функции из Firebase Storage API

Также добавь константы для базовых путей в Storage:
- `AVATARS_PATH = 'avatars'` - путь для хранения аватаров пользователей
- `ARTIFACTS_PATH = 'artifacts'` - путь для хранения файлов артефактов

После создания файла `storage.ts`, обнови файл `src/lib/firebase/index.ts` для экспорта функций из `storage.ts`.

Пожалуйста, создай файл `src/lib/firebase/storage.ts` с указанной функциональностью и обнови `index.ts`.

После выполнения задачи обнови status.md, указав, что задача 6.1 выполнена.
```

## Ожидаемый результат
- Созданный файл `src/lib/firebase/storage.ts`
- Реализованные функции для работы с Firebase Storage:
  - `getStorage()`
  - `uploadFile(file: File, path: string, metadata?: any): Promise<string>`
  - `getFileURL(path: string): Promise<string>`
  - `deleteFile(path: string): Promise<void>`
  - `uploadUserAvatar(userId: string, file: File): Promise<string>`
  - `uploadArtifactFile(artifactId: string, file: File): Promise<string>`
- Добавленные константы для базовых путей
- Обновленный файл `src/lib/firebase/index.ts`
- Обновленный файл status.md с отметкой о выполнении задачи 6.1

## Связь с другими задачами
- Эта задача следует за задачей 5.14 и начинает Этап 6
- После выполнения этой задачи следует перейти к задаче 6.2: Создание `artifact-service.ts`

## Обновление progress-tracking
После выполнения задачи обновите файл development-plan.md, заменив `[ ]` на `[x]` для этой задачи:
```
* [x] **task-6.1-create-storage-service.md**: Создание `storage.ts` в `src/lib/firebase/` для работы с Firebase Storage
```
