# Задача 2.2: Реализация слушателя `onAuthStateChanged` в `AuthProvider`

## Описание
Реализовать слушатель `onAuthStateChanged` из Firebase Auth в компоненте `AuthProvider` для отслеживания состояния аутентификации пользователя.

## Ссылки на документацию
docs/bizlevel-project-context.md


## Конкретные шаги для Cursor
1. Создать файл `src/lib/firebase/auth.ts` для базовых функций аутентификации
2. Обновить файл `src/context/AuthContext.tsx`, добавив слушатель `onAuthStateChanged`
3. Использовать `useEffect` для подписки на изменения состояния аутентификации
4. Обновлять состояния `user` и `loading` при изменении аутентификации

## Промт для Cursor
```
Помоги мне реализовать слушатель `onAuthStateChanged` в компоненте `AuthProvider` для проекта BizLevel.

Нам нужно выполнить два основных шага:

1. Сначала создать файл `src/lib/firebase/auth.ts` с базовыми функциями аутентификации:
   - Импортировать необходимые функции из Firebase Auth
   - Экспортировать функцию getAuth() для получения инстанса Auth
   - Экспортировать базовую функцию getCurrentUser() для удобства

2. Затем обновить файл `src/context/AuthContext.tsx`:
   - Импортировать функции из `src/lib/firebase/auth.ts`
   - Добавить useEffect внутри AuthProvider для подписки на изменения состояния аутентификации с помощью onAuthStateChanged
   - Обновлять состояния user и loading при изменениях
   - Очищать подписку при размонтировании компонента

Пожалуйста, сначала создай файл `src/lib/firebase/auth.ts`, а затем обнови `src/context/AuthContext.tsx`.

После выполнения задачи обнови status.md, указав, что задача 2.2 выполнена.
```

## Ожидаемый результат
- Созданный файл `src/lib/firebase/auth.ts` с базовыми функциями аутентификации
- Обновленный файл `src/context/AuthContext.tsx` с реализованным слушателем `onAuthStateChanged`
- Правильная обработка состояний `user` и `loading` при изменении аутентификации
- Обновленный файл status.md с отметкой о выполнении задачи 2.2

## Связь с другими задачами
- Эта задача следует за задачей 2.1: Создание `AuthContext` и `AuthProvider`
- После выполнения этой задачи следует перейти к задаче 2.3: Реализация функций `login`, `register`, `logout`, `resetPassword` в `AuthProvider`

## Обновление progress-tracking
После выполнения задачи обновите файл development-plan.md, заменив `[ ]` на `[x]` для этой задачи:
```
* [x] **task-2.2-implement-auth-state-listener.md**: Реализация слушателя `onAuthStateChanged` в `AuthProvider`
```
