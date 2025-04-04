# Задача 2.9: Реализация логики защиты роутов

## Описание
Создать механизм защиты роутов основного приложения, чтобы только аутентифицированные пользователи могли получить доступ к функциональности BizLevel.

## Ссылки на документацию
docs/bizlevel-project-context.md


## Конкретные шаги для Cursor
1. Создать директорию `src/app/(routes)` (если она еще не создана)
2. Создать файл `src/app/(routes)/layout.tsx`
3. Реализовать логику проверки аутентификации
4. Добавить редирект на страницу входа для неаутентифицированных пользователей
5. Настроить обработку состояния загрузки

## Промт для Cursor
```
Помоги мне реализовать логику защиты роутов для проекта BizLevel.

Нам нужно создать файл `src/app/(routes)/layout.tsx`, который будет:

1. Импортировать хук `useAuth` из `@/hooks/useAuth`
2. Проверять, аутентифицирован ли пользователь
3. Если пользователь не аутентифицирован (и не в процессе загрузки), перенаправлять на `/login`
4. Если пользователь аутентифицирован или в процессе загрузки, отображать содержимое
5. Использовать какой-то компонент загрузки, пока проверяется состояние аутентификации

Дополнительно, этот layout должен:
1. Иметь заготовку для применения общего макета приложения (MainLayout), который мы реализуем в следующем этапе
2. Передавать все метаданные (`metadata`) от дочерних страниц

Пожалуйста, создай файл `src/app/(routes)/layout.tsx` с указанной функциональностью.

После выполнения задачи обнови status.md, указав, что задача 2.9 выполнена.
```

## Ожидаемый результат
- Созданный файл `src/app/(routes)/layout.tsx`
- Реализованная логика проверки аутентификации
- Настроенный редирект на страницу входа для неаутентифицированных пользователей
- Настроенная обработка состояния загрузки
- Подготовленная структура для интеграции общего макета приложения
- Обновленный файл status.md с отметкой о выполнении задачи 2.9

## Связь с другими задачами
- Эта задача следует за задачей 2.8: Реализация компонентов форм
- После выполнения этой задачи следует перейти к задаче 2.10: Реализация редиректов для аутентифицированных/неаутентифицированных пользователей

## Обновление progress-tracking
После выполнения задачи обновите файл development-plan.md, заменив `[ ]` на `[x]` для этой задачи:
```
* [x] **task-2.9-implement-protected-route-logic.md**: Реализация логики защиты роутов в `src/app/(routes)/layout.tsx`
```
