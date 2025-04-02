# Задача 6.2: Создание `artifact-service.ts`

## Описание
Создать сервис для работы с артефактами, который будет предоставлять функции для получения списка артефактов, информации об отдельном артефакте, загрузки новых артефактов и управления существующими.


## Конкретные шаги для Cursor
1. Создать файл `src/lib/services/artifact-service.ts`
2. Реализовать функции для работы с артефактами в Firestore
3. Интегрировать функции из `storage.ts` для работы с файлами артефактов
4. Добавить типизацию для всех функций

## Промт для Cursor
```
Помоги мне создать сервис для работы с артефактами в проекте BizLevel.

Нам нужно создать файл `src/lib/services/artifact-service.ts`, который будет предоставлять функции для работы с артефактами в Firestore и Firebase Storage.

На основе типов из `src/types/index.ts`, хелперов из `src/lib/firebase/firestore.ts` и функций из `src/lib/firebase/storage.ts`, реализуй следующие функции:

1. `getArtifacts(filters?: { levelId?: string }): Promise<Artifact[]>` - получение списка артефактов с возможностью фильтрации по уровню
2. `getArtifactById(artifactId: string): Promise<Artifact | null>` - получение информации об отдельном артефакте
3. `createArtifact(artifactData: Omit<Artifact, 'id' | 'downloadCount' | 'uploadedAt'>, file: File): Promise<string>` - создание нового артефакта
4. `updateArtifact(artifactId: string, artifactData: Partial<Artifact>, file?: File): Promise<void>` - обновление существующего артефакта
5. `deleteArtifact(artifactId: string): Promise<void>` - удаление артефакта
6. `getArtifactsByIds(artifactIds: string[]): Promise<Artifact[]>` - получение списка артефактов по массиву ID
7. `getLevelArtifacts(levelId: string): Promise<Artifact[]>` - получение всех артефактов для указанного уровня
8. `incrementArtifactDownloadCount(artifactId: string): Promise<void>` - увеличение счетчика скачиваний артефакта

Все функции должны:
- Использовать хелперы из `firestore.ts` для работы с Firestore
- Интегрировать функции из `storage.ts` для работы с файлами в Firebase Storage
- Быть типизированы с использованием TypeScript
- Обрабатывать потенциальные ошибки и возвращать понятные сообщения

Пожалуйста, создай файл `src/lib/services/artifact-service.ts` с указанной функциональностью.

После выполнения задачи обнови status.md, указав, что задача 6.2 выполнена.
```

## Ожидаемый результат
- Созданный файл `src/lib/services/artifact-service.ts`
- Реализованные функции для работы с артефактами:
  - `getArtifacts`
  - `getArtifactById`
  - `createArtifact`
  - `updateArtifact`
  - `deleteArtifact`
  - `getArtifactsByIds`
  - `getLevelArtifacts`
  - `incrementArtifactDownloadCount`
- Интеграция с функциями из `storage.ts` для работы с файлами
- Типизация для всех функций
- Обновленный файл status.md с отметкой о выполнении задачи 6.2

## Связь с другими задачами
- Эта задача следует за задачей 6.1: Создание `storage.ts` для работы с Firebase Storage
- После выполнения этой задачи следует перейти к задаче 6.3: Создание хука `useArtifacts`

## Обновление progress-tracking
После выполнения задачи обновите файл development-plan.md, заменив `[ ]` на `[x]` для этой задачи:
```
* [x] **task-6.2-create-artifact-service.md**: Создание `artifact-service.ts` (`src/lib/services/`) для получения данных об артефактах (`artifacts`)
```
