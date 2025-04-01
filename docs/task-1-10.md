# Задача 1.10: Настройка файла `src/app/providers.tsx`

## Описание
Создать и настроить файл `src/app/providers.tsx`, который будет содержать все провайдеры для приложения, включая QueryClientProvider, ThemeProvider и Toaster.

## Ссылки на документацию
- [Этап 1, Шаг 5](../BizLevel-%20План%20Реализации%20Проекта.%2031.03.rtf): Настройка Провайдеров
- [Структура проекта](../BizLevel-%20План%20Реализации%20Проекта.%2031.03.rtf): Упоминание файла `src/app/providers.tsx`

## Конкретные шаги для Cursor
1. Создать файл `src/app/providers.tsx` (если он еще не создан в задаче 1.9)
2. Настроить QueryClientProvider из @tanstack/react-query
3. Настроить ThemeProvider из shadcn/ui (или из next-themes)
4. Настроить Toaster из sonner
5. Подготовить структуру для будущих провайдеров (AuthProvider)

## Промт для Cursor
```
Помоги мне создать и настроить файл `src/app/providers.tsx` для проекта BizLevel.

Нам нужно создать компонент Providers, который будет содержать все необходимые провайдеры для приложения:

1. QueryClientProvider из @tanstack/react-query:
   - Создать экземпляр QueryClient с базовыми настройками (например, refetchOnWindowFocus: false)
   - Обернуть children в QueryClientProvider

2. ThemeProvider:
   - Если мы используем next-themes с shadcn/ui, то настроить ThemeProvider
   - Указать атрибут для темы (attribute="class")
   - Указать светлую и темную темы по умолчанию (defaultTheme="system")
   - Включить возможность переключения темы (enableSystem)

3. Toaster из библиотеки sonner:
   - Добавить компонент Toaster с базовыми настройками
   - Настроить позицию тостов (например, position="bottom-right")

4. Подготовить структуру для будущих провайдеров:
   - Добавить комментарий или placeholder для AuthProvider, который мы добавим позже

Пожалуйста, создай файл `src/app/providers.tsx` с описанными настройками. Учти, что этот компонент будет использоваться в корневом layout.tsx.

После создания файла обнови status.md, указав, что задача 1.10 выполнена.
```

## Ожидаемый результат
- Созданный файл `src/app/providers.tsx` с настроенными провайдерами
- Настроенный QueryClientProvider из @tanstack/react-query
- Настроенный ThemeProvider из shadcn/ui (или из next-themes)
- Настроенный Toaster из sonner
- Подготовленная структура для будущих провайдеров
- Обновленный файл status.md с отметкой о выполнении задачи 1.10

## Связь с другими задачами
- Эта задача следует за задачей 1.9: Создание базовой структуры директорий проекта
- После выполнения этой задачи следует перейти к задаче 1.11: Интеграция `Providers` в корневой `src/app/layout.tsx`

## Обновление progress-tracking
После выполнения задачи обновите файл development-plan.md, заменив `[ ]` на `[x]` для этой задачи:
```
* [x] **task-1.10-setup-providers.md**: Настройка файла `src/app/providers.tsx` (QueryClientProvider, ThemeProvider, Toaster)
```
