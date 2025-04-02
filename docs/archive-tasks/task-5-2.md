# Задача 5.2: Создание `firestore.ts` с базовыми хелперами Firestore

## Описание
Расширить файл `src/lib/firebase/firestore.ts` с базовыми утилитами для работы с Firestore, которые будут использоваться во всех сервисах для работы с данными.

## Ссылки на документацию
docs/bizlevel-project-context.md
docs/status.md

## Конкретные шаги для Cursor
1. Обновить/дополнить файл `src/lib/firebase/firestore.ts` (он мог быть частично создан в задаче 2.11)
2. Реализовать базовые функции для работы с документами и коллекциями
3. Добавить типизацию для функций на основе типов из задачи 5.1
4. Реализовать утилиты для часто используемых операций

## Промт для Cursor
```
Помоги мне расширить файл `src/lib/firebase/firestore.ts` с базовыми хелперами для работы с Firestore в проекте BizLevel.

В задаче 2.11 мы уже могли создать базовую версию этого файла, но теперь нам нужно расширить его функциональность и добавить типизацию на основе типов, определенных в задаче 5.1.

Файл должен содержать следующие функции и утилиты:

1. Базовые функции для работы с документами:
   - `getDocumentById<T>(collection: string, documentId: string): Promise<T | null>` - получение документа по ID
   - `getDocuments<T>(collection: string, queryConstraints?: QueryConstraint[]): Promise<T[]>` - получение списка документов с возможностью фильтрации
   - `createDocument<T>(collection: string, data: T, documentId?: string): Promise<string>` - создание документа
   - `updateDocument<T>(collection: string, documentId: string, data: Partial<T>): Promise<void>` - обновление документа
   - `deleteDocument(collection: string, documentId: string): Promise<void>` - удаление документа

2. Функции для работы с коллекциями и подколлекциями:
   - `getCollectionSnapshot<T>(collection: string, queryConstraints?: QueryConstraint[]): Promise<QuerySnapshot>` - получение снимка коллекции
   - `getSubcollectionDocuments<T>(collection: string, documentId: string, subcollection: string): Promise<T[]>` - получение документов из подколлекции

3. Специальные утилиты для работы с Firestore:
   - `arrayUnionItem<T>(collection: string, documentId: string, field: string, item: any): Promise<void>` - добавление элемента в массив
   - `arrayRemoveItem<T>(collection: string, documentId: string, field: string, item: any): Promise<void>` - удаление элемента из массива
   - `incrementCounter(collection: string, documentId: string, field: string, value: number = 1): Promise<void>` - инкрементирование счетчика
   - `batchWrite(operations: Array<{type: 'create' | 'update' | 'delete', collection: string, documentId: string, data?: any}>): Promise<void>` - выполнение пакетной операции

4. Константы для имен коллекций:
   - `USERS_COLLECTION = 'users'`
   - `USER_PROGRESS_COLLECTION = 'userProgress'`
   - `LEVELS_COLLECTION = 'levels'`
   - `ARTIFACTS_COLLECTION = 'artifacts'`
   - `FAQ_COLLECTION = 'faq'`
   - `CHATS_COLLECTION = 'chats'`
   - `MESSAGES_SUBCOLLECTION = 'messages'`

5. Утилиты для конвертации данных:
   - `convertTimestampToDate<T>(data: any): T` - преобразование Firestore Timestamp в JavaScript Date
   - `convertDateToTimestamp<T>(data: any): T` - преобразование JavaScript Date в Firestore Timestamp

Все функции должны быть правильно типизированы с использованием TypeScript generics и должны обрабатывать ошибки.

Пожалуйста, создай или обнови файл `src/lib/firebase/firestore.ts` с указанной функциональностью.

После выполнения задачи обнови status.md, указав, что задача 5.2 выполнена.
```

## Ожидаемый результат
- Обновленный файл `src/lib/firebase/firestore.ts`
- Реализованные базовые функции для работы с документами и коллекциями
- Добавленная типизация для всех функций
- Реализованные утилиты для часто используемых операций
- Константы для имен коллекций
- Утилиты для конвертации данных
- Обновленный файл status.md с отметкой о выполнении задачи 5.2

## Связь с другими задачами
- Эта задача следует за задачей 5.1: Определение основных TypeScript типов
- После выполнения этой задачи следует перейти к задаче 5.3: Создание `progress-service.ts`

## Обновление progress-tracking
После выполнения задачи обновите файл development-plan.md, заменив `[ ]` на `[x]` для этой задачи:
```
* [x] **task-5.2-create-firestore-service.md**: Создание `firestore.ts` в `src/lib/firebase/` с базовыми хелперами Firestore
```
