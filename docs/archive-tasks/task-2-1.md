# Задача 2.1: Создание `AuthContext` и `AuthProvider`

## Описание
Создать контекст аутентификации `AuthContext` и провайдер `AuthProvider` для управления состоянием аутентификации пользователя в приложении BizLevel.

## Ссылки на документацию
docs/bizlevel-project-context.md


## Конкретные шаги для Cursor
1. Создать файл `src/context/AuthContext.tsx`
2. Определить тип `AuthContextType` с необходимыми свойствами и функциями
3. Создать контекст с помощью `createContext`
4. Создать компонент `AuthProvider`, который будет обертывать приложение
5. Подготовить основную структуру состояния аутентификации (user, loading)

## Промт для Cursor
```
Помоги мне создать контекст аутентификации `AuthContext` и провайдер `AuthProvider` для проекта BizLevel.

Нам нужно создать файл `src/context/AuthContext.tsx` со следующей функциональностью:

1. Определить тип `AuthContextType`, который будет содержать:
   - `user`: объект пользователя (из Firebase или null, если пользователь не аутентифицирован)
   - `loading`: boolean, указывающий, загружается ли состояние аутентификации
   - Функции для аутентификации: `login`, `register`, `logout`, `resetPassword` (пока можно оставить как заглушки, реализуем их в следующей задаче)

2. Создать контекст с помощью `createContext`:
   - Инициализировать с начальным значением по умолчанию (null или заглушка)
   - Добавить утилиту useAuthContext для безопасного использования контекста

3. Создать компонент `AuthProvider`:
   - Принимает children в props
   - Использует useState для хранения состояния user и loading
   - Возвращает AuthContext.Provider с value, содержащим user, loading и функции аутентификации
   - Пока что функции аутентификации могут быть заглушками (просто console.log)

4. Экспортировать AuthContext и AuthProvider

Пожалуйста, создай файл `src/context/AuthContext.tsx` с указанной функциональностью.

После создания файла обнови status.md, указав, что задача 2.1 выполнена.
```

## Ожидаемый результат
- Созданный файл `src/context/AuthContext.tsx`
- Определенный тип `AuthContextType` с необходимыми свойствами и функциями
- Созданный контекст `AuthContext`
- Созданный провайдер `AuthProvider`
- Обновленный файл status.md с отметкой о выполнении задачи 2.1

## Связь с другими задачами
- Эта задача следует за задачей 1.11: Интеграция `Providers` в корневой `src/app/layout.tsx` и начинает Этап 2
- После выполнения этой задачи следует перейти к задаче 2.2: Реализация слушателя `onAuthStateChanged` в `AuthProvider`

## Обновление progress-tracking
После выполнения задачи обновите файл development-plan.md, заменив `[ ]` на `[x]` для этой задачи:
```
* [x] **task-2.1-setup-auth-context.md**: Создание `AuthContext` и `AuthProvider` (`src/context/AuthContext.tsx`)
```
