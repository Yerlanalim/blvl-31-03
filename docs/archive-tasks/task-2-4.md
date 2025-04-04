# Задача 2.4: Интеграция `AuthProvider` в `src/app/providers.tsx`

## Описание
Интегрировать компонент `AuthProvider` в файл `src/app/providers.tsx`, чтобы сделать функциональность аутентификации доступной во всем приложении.

## Ссылки на документацию
docs/bizlevel-project-context.md


## Конкретные шаги для Cursor
1. Обновить файл `src/app/providers.tsx`
2. Импортировать `AuthProvider` из `@/context/AuthContext`
3. Добавить `AuthProvider` в цепочку провайдеров
4. Убедиться в правильном порядке вложенности провайдеров

## Промт для Cursor
```
Помоги мне интегрировать компонент `AuthProvider` в файл `src/app/providers.tsx` для проекта BizLevel.

Нам нужно:

1. Обновить файл `src/app/providers.tsx`:
   - Импортировать `AuthProvider` из `@/context/AuthContext`
   - Добавить `AuthProvider` в цепочку провайдеров
   - Убедиться в правильном порядке вложенности (AuthProvider должен быть внутри QueryClientProvider, но снаружи других провайдеров, которые могут зависеть от аутентификации)

Провайдеры должны быть вложены в следующем порядке:
1. QueryClientProvider (самый внешний)
2. AuthProvider
3. ThemeProvider
4. Toaster (не провайдер, а компонент, который должен быть на том же уровне, что и children)

Пожалуйста, обнови файл `src/app/providers.tsx` с указанной структурой.

После выполнения задачи обнови status.md, указав, что задача 2.4 выполнена.
```

## Ожидаемый результат
- Обновленный файл `src/app/providers.tsx` с добавленным `AuthProvider`
- Правильная вложенность провайдеров
- Обновленный файл status.md с отметкой о выполнении задачи 2.4

## Связь с другими задачами
- Эта задача следует за задачей 2.3: Реализация функций `login`, `register`, `logout`, `resetPassword` в `AuthProvider`
- После выполнения этой задачи следует перейти к задаче 2.5: Создание хука `useAuth`

## Обновление progress-tracking
После выполнения задачи обновите файл development-plan.md, заменив `[ ]` на `[x]` для этой задачи:
```
* [x] **task-2.4-integrate-authprovider.md**: Интеграция `AuthProvider` в `src/app/providers.tsx`
```
