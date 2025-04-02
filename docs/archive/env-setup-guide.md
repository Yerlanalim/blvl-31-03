# Руководство по настройке файла .env.local

Этот документ поможет вам правильно настроить файл `.env.local` для проекта BizLevel, используя конфигурационные ключи Firebase.

## Шаги по настройке

1. Убедитесь, что вы завершили задачу 1.4 (настройка проекта Firebase) и у вас есть доступ к конфигурационным ключам.
2. Откройте файл `.env.local` в корне проекта.
3. Заполните значения переменных окружения вашими конфигурационными ключами Firebase.

## Инструкция по заполнению

В Firebase Console вам был предоставлен объект конфигурации примерно такого вида:

```javascript
const firebaseConfig = {
  apiKey: "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
  authDomain: "bizlevel.firebaseapp.com",
  projectId: "bizlevel",
  storageBucket: "bizlevel.appspot.com",
  messagingSenderId: "xxxxxxxxxxxx",
  appId: "1:xxxxxxxxxxxx:web:xxxxxxxxxxxxxxxxxxxxxxxx",
  measurementId: "G-XXXXXXXXXX"
};
```

Перенесите эти значения в файл `.env.local` следующим образом:

1. `NEXT_PUBLIC_FIREBASE_API_KEY` = значение `apiKey`
2. `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` = значение `authDomain`
3. `NEXT_PUBLIC_FIREBASE_PROJECT_ID` = значение `projectId`
4. `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` = значение `storageBucket`
5. `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` = значение `messagingSenderId`
6. `NEXT_PUBLIC_FIREBASE_APP_ID` = значение `appId`
7. `NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID` = значение `measurementId` (если доступно)

## Примечания

- Убедитесь, что все значения заключены в двойные кавычки.
- Не оставляйте пробелов до и после знака равенства.
- Префикс `NEXT_PUBLIC_` для Firebase переменных необходим, чтобы сделать их доступными в клиентском коде.
- Не добавляйте лишние пробелы или комментарии в строках с переменными.

## Пример заполненного файла

```
NEXT_PUBLIC_FIREBASE_API_KEY="AIzaSyD1kcKlM_1a2b3c4D5e6F7g8H9i0J1k2L3"
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN="bizlevel-12345.firebaseapp.com"
NEXT_PUBLIC_FIREBASE_PROJECT_ID="bizlevel-12345"
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET="bizlevel-12345.appspot.com"
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID="1234567890"
NEXT_PUBLIC_FIREBASE_APP_ID="1:1234567890:web:abcdef1234567890"
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID="G-ABC123DEF45"
```

## Что дальше?

После настройки файла `.env.local`:
1. Не добавляйте этот файл в систему контроля версий (будет выполнено в задаче 1.6)
2. Храните копию вашей конфигурации в безопасном месте на случай потери доступа к файлу

Переменная `OPENAI_API_KEY` будет настроена позже, когда мы будем реализовывать функционал чата с AI в рамках соответствующих задач. 