# Скрипт для назначения роли администратора

Этот скрипт позволяет установить роль администратора для существующего пользователя в системе BizLevel.

## Подготовка к запуску

1. Убедитесь, что у вас есть файл `service-account.json` в корне проекта с учетными данными сервисного аккаунта Firebase.
   
   Если у вас еще нет этого файла:
   - Перейдите в [Firebase Console](https://console.firebase.google.com)
   - Выберите ваш проект
   - Перейдите в настройки -> Учетные записи служб
   - Нажмите "Создать новый закрытый ключ"
   - Загрузите JSON-файл и переименуйте его в `service-account.json`
   - Поместите файл в корень проекта BizLevel

2. Пользователь, которому вы хотите назначить роль администратора, должен быть уже зарегистрирован в системе.

## Запуск скрипта

```bash
node src/scripts/set-admin-role.js user@example.com
```

Где `user@example.com` - это email пользователя, которому нужно назначить роль администратора.

## Что делает скрипт

1. Находит пользователя по указанному email в коллекции `users` в Firestore
2. Устанавливает для этого пользователя поле `role` со значением `admin`
3. Выводит сообщение об успешном завершении операции

## Примечание

После выполнения скрипта пользователь получит доступ к административной панели по адресу `/admin`.