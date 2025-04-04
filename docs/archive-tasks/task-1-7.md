# Задача 1.7: Реализация файлов конфигурации Firebase

## Описание
Создать файлы конфигурации Firebase для проекта BizLevel, которые будут использовать переменные окружения из `.env.local`.

## Ссылки на документацию
docs/bizlevel-project-context.md


## Конкретные шаги для Cursor
1. Создать директорию `src/lib/firebase/`
2. Создать файл `src/lib/firebase/config.ts` для инициализации Firebase App с использованием ключей из `.env.local`
3. Создать файл `src/lib/firebase/index.ts` для центрального экспорта всех утилит Firebase

## Промт для Cursor
```
Помоги мне создать файлы конфигурации Firebase для проекта BizLevel.

Мне нужно создать следующие файлы:

1. `src/lib/firebase/config.ts` - для инициализации Firebase App с использованием переменных окружения из `.env.local`:
   - Импортировать необходимые функции из firebase/app
   - Инициализировать Firebase с помощью переменных окружения
   - Экспортировать инстанс Firebase App

2. `src/lib/firebase/index.ts` - для центрального экспорта всех утилит Firebase:
   - Экспортировать все из `config.ts`
   - Подготовить структуру для экспорта функций из будущих файлов auth.ts, firestore.ts и storage.ts (которые мы создадим позже)

Пожалуйста, создай эти файлы с соответствующим кодом, учитывая, что мы будем использовать следующие сервисы Firebase:
- Authentication
- Firestore
- Storage

Обрати внимание, что сами файлы auth.ts, firestore.ts и storage.ts мы создадим в последующих задачах, поэтому сейчас нужно только подготовить структуру в index.ts.

После создания файлов обнови status.md, указав, что задача 1.7 выполнена.
```

## Ожидаемый результат
- Созданная директория `src/lib/firebase/`
- Созданный файл `src/lib/firebase/config.ts` с инициализацией Firebase App
- Созданный файл `src/lib/firebase/index.ts` с центральным экспортом утилит Firebase
- Обновленный файл status.md с отметкой о выполнении задачи 1.7

## Связь с другими задачами
- Эта задача следует за задачей 1.6: Добавление `.env.local` в `.gitignore`
- После выполнения этой задачи следует перейти к задаче 1.8: Настройка базовых правил безопасности Firestore и Storage

## Обновление progress-tracking
После выполнения задачи обновите файл development-plan.md, заменив `[ ]` на `[x]` для этой задачи:
```
* [x] **task-1.7-create-firebase-config.md**: Реализация файлов конфигурации Firebase (`src/lib/firebase/config.ts`, `index.ts`)
```
