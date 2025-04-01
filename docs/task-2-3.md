# Задача 2.3: Реализация функций `login`, `register`, `logout`, `resetPassword` в `AuthProvider`

## Описание
Реализовать основные функции аутентификации (`login`, `register`, `logout`, `resetPassword`) в `AuthProvider` для обеспечения полного функционала аутентификации пользователей.

## Ссылки на документацию
- [Этап 2, Шаг 1](../BizLevel-%20План%20Реализации%20Проекта.%2031.03.rtf): Контекст Аутентификации (`AuthProvider`)
- [Раздел 4.2: Конфигурация Firebase в Коде](../BizLevel-%20План%20Реализации%20Проекта.%2031.03.rtf): Функции для регистрации, входа, выхода, сброса пароля

## Конкретные шаги для Cursor
1. Обновить файл `src/lib/firebase/auth.ts`, добавив функции для аутентификации
2. Реализовать функции `login`, `register`, `logout`, `resetPassword` с использованием Firebase Auth
3. Обновить файл `src/context/AuthContext.tsx`, добавив реализации функций в провайдер
4. Добавить обработку ошибок для всех функций аутентификации

## Промт для Cursor
```
Помоги мне реализовать основные функции аутентификации для проекта BizLevel.

Нам нужно:

1. Обновить файл `src/lib/firebase/auth.ts`, добавив следующие функции:
   - `loginWithEmailAndPassword(email: string, password: string)` - для входа пользователя
   - `registerWithEmailAndPassword(email: string, password: string)` - для регистрации нового пользователя
   - `logout()` - для выхода пользователя
   - `resetPassword(email: string)` - для сброса пароля
   - `updateUserProfile(displayName?: string, photoURL?: string)` - для обновления профиля пользователя

2. Обновить файл `src/context/AuthContext.tsx`:
   - Импортировать новые функции из `src/lib/firebase/auth.ts`
   - Добавить реализации функций `login`, `register`, `logout`, `resetPassword` в провайдер
   - Добавить функцию `updateProfile` для обновления данных пользователя
   - Добавить обработку ошибок для всех функций с типизацией ошибок Firebase
   - Обновить тип `AuthContextType` для отражения новых функций и их параметров

Все функции должны возвращать Promise и правильно обрабатывать ошибки.

Пожалуйста, сначала обнови файл `src/lib/firebase/auth.ts`, а затем обнови `src/context/AuthContext.tsx`.

После выполнения задачи обнови status.md, указав, что задача 2.3 выполнена.
```

## Ожидаемый результат
- Обновленный файл `src/lib/firebase/auth.ts` с реализованными функциями аутентификации
- Обновленный файл `src/context/AuthContext.tsx` с добавленными функциями в провайдер
- Реализованная обработка ошибок для всех функций аутентификации
- Обновленный файл status.md с отметкой о выполнении задачи 2.3

## Связь с другими задачами
- Эта задача следует за задачей 2.2: Реализация слушателя `onAuthStateChanged` в `AuthProvider`
- После выполнения этой задачи следует перейти к задаче 2.4: Интеграция `AuthProvider` в `src/app/providers.tsx`

## Обновление progress-tracking
После выполнения задачи обновите файл development-plan.md, заменив `[ ]` на `[x]` для этой задачи:
```
* [x] **task-2.3-implement-auth-functions.md**: Реализация функций `login`, `register`, `logout`, `resetPassword` в `AuthProvider`
```
