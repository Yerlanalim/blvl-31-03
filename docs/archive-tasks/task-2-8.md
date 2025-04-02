# Задача 2.8: Реализация компонентов форм аутентификации

## Описание
Разработать компоненты форм для аутентификации (`LoginForm`, `RegisterForm`, `ResetPasswordForm`) с использованием React Hook Form, Zod и компонентов shadcn/ui.

## Ссылки на документацию
docs/bizlevel-project-context.md


## Конкретные шаги для Cursor
1. Создать директорию `src/components/auth/` (если она еще не создана)
2. Создать компоненты форм:
   - `src/components/auth/LoginForm.tsx`
   - `src/components/auth/RegisterForm.tsx`
   - `src/components/auth/ResetPasswordForm.tsx`
3. Реализовать валидацию с использованием Zod
4. Интегрировать формы с хуком `useAuth` для выполнения соответствующих действий
5. Обновить страницы аутентификации, добавив компоненты форм

## Промт для Cursor
```
Помоги мне реализовать компоненты форм для аутентификации в проекте BizLevel.

Нам нужно создать три компонента форм с использованием React Hook Form, Zod и shadcn/ui:

1. `src/components/auth/LoginForm.tsx`:
   - Поля: email, password
   - Валидация: email (формат email), password (минимум 6 символов)
   - При отправке формы должен вызываться метод login из useAuth
   - Обработка состояний загрузки и ошибок

2. `src/components/auth/RegisterForm.tsx`:
   - Поля: email, password, passwordConfirm
   - Валидация: email (формат email), password (минимум 6 символов), passwordConfirm (должен совпадать с password)
   - При отправке формы должен вызываться метод register из useAuth
   - Обработка состояний загрузки и ошибок

3. `src/components/auth/ResetPasswordForm.tsx`:
   - Поля: email
   - Валидация: email (формат email)
   - При отправке формы должен вызываться метод resetPassword из useAuth
   - Обработка состояний загрузки и ошибок
   - Сообщение об успешной отправке письма для сброса пароля

Также нужно создать файл `src/lib/zod-schemas.ts` с схемами Zod для валидации форм.

После создания компонентов форм, необходимо обновить страницы аутентификации, заменив placeholders на соответствующие компоненты форм.

Пожалуйста, начни с создания файла zod-schemas.ts, затем реализуй компоненты форм, и наконец обнови страницы аутентификации.

После выполнения задачи обнови status.md, указав, что задача 2.8 выполнена.
```

## Ожидаемый результат
- Созданный файл `src/lib/zod-schemas.ts` с схемами валидации
- Созданные компоненты форм:
  - `src/components/auth/LoginForm.tsx`
  - `src/components/auth/RegisterForm.tsx`
  - `src/components/auth/ResetPasswordForm.tsx`
- Реализованная валидация форм с использованием Zod
- Интеграция форм с хуком `useAuth`
- Обновленные страницы аутентификации с добавленными компонентами форм
- Обновленный файл status.md с отметкой о выполнении задачи 2.8

## Связь с другими задачами
- Эта задача следует за задачей 2.7: Создание страниц Login, Register, Reset Password
- После выполнения этой задачи следует перейти к задаче 2.9: Реализация логики защиты роутов

## Обновление progress-tracking
После выполнения задачи обновите файл development-plan.md, заменив `[ ]` на `[x]` для этой задачи:
```
* [x] **task-2.8-implement-auth-forms.md**: Реализация компонентов форм (`LoginForm`, `RegisterForm`) с React Hook Form, Zod и shadcn/ui
```
