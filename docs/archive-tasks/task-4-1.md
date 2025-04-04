# Задача 4.1: Создание `settings-service.ts`

## Описание
Создать сервисный слой для чтения и записи настроек пользователя в коллекцию `users/{userId}` в Firestore.

## Ссылки на документацию
docs/bizlevel-project-context.md
docs/status.md

## Конкретные шаги для Cursor
1. Создать директорию `src/lib/services/` (если она еще не создана)
2. Создать файл `src/lib/services/settings-service.ts`
3. Реализовать функции для чтения и обновления настроек пользователя
4. Определить типы для настроек пользователя

## Промт для Cursor
```
Помоги мне создать сервисный слой для работы с настройками пользователя в проекте BizLevel.

Нам нужно создать файл `src/lib/services/settings-service.ts`, который будет содержать функции для чтения и записи настроек пользователя в коллекцию `users/{userId}` в Firestore.

1. Сначала определим типы для настроек пользователя:
   - `UserSettings`: должен содержать настройки темы (`theme`: 'light' | 'dark' | 'system'), настройки уведомлений (`notificationsEnabled`: boolean) и другие возможные настройки
   - `UserProfile`: расширенная информация о пользователе, включая `displayName`, `photoURL`, `email`, `createdAt`, и `settings`

2. Затем реализуем следующие функции:
   - `getUserSettings(userId: string)`: получает документ пользователя из Firestore и возвращает настройки пользователя
   - `updateUserSettings(userId: string, settings: Partial<UserSettings>)`: обновляет настройки пользователя в Firestore
   - `getUserProfile(userId: string)`: получает полный профиль пользователя из Firestore
   - `updateUserProfile(userId: string, profileData: Partial<UserProfile>)`: обновляет профиль пользователя в Firestore

3. Функции должны:
   - Использовать уже созданные утилиты Firestore из `src/lib/firebase/firestore.ts`
   - Правильно обрабатывать ошибки
   - Возвращать типизированные данные
   - Использовать транзакции или пакетные операции, если необходимо

Пожалуйста, создай файл `src/lib/services/settings-service.ts` с указанной функциональностью.

После выполнения задачи обнови status.md, указав, что задача 4.1 выполнена.
```

## Ожидаемый результат
- Созданный файл `src/lib/services/settings-service.ts`
- Определенные типы для настроек пользователя
- Реализованные функции для чтения и обновления настроек
- Обновленный файл status.md с отметкой о выполнении задачи 4.1

## Связь с другими задачами
- Эта задача следует за задачей 3.5 и начинает Этап 4
- После выполнения этой задачи следует перейти к задаче 4.2: Создание хука `useSettings`

## Обновление progress-tracking
После выполнения задачи обновите файл development-plan.md, заменив `[ ]` на `[x]` для этой задачи:
```
* [x] **task-4.1-create-settings-service.md**: Создание `settings-service.ts` для чтения/записи настроек пользователя (`users/{userId}`)
```
