# BizLevel - Образовательная Платформа для Предпринимателей

## Обзор проекта

BizLevel — это веб-приложение, которое помогает предпринимателям и руководителям повышать бизнес-навыки через короткие видео, тесты и практические артефакты (шаблоны, чек-листы и т.п.).

Проект реализован как полноценное веб-приложение с 10 уровнями обучения и геймифицированным подходом к освоению бизнес-навыков. BizLevel использует современный веб-стек на основе Next.js, TypeScript и Firebase.

## Ключевые особенности

- 🗺️ **Геймифицированная "карта уровней"** в стиле Duolingo с постепенной разблокировкой
- 🎬 **Короткие видео** (2-4 минуты) для эффективного обучения
- ✅ **Тесты и задания** для закрепления знаний
- 📝 **Скачиваемые артефакты** (шаблоны, таблицы, чек-листы)
- 💬 **Чат с AI-ассистентом** для поддержки пользователей на основе OpenAI
- 🏆 **Прогресс и бейджи** для мотивации
- 👤 **Профиль пользователя** с отслеживанием прогресса и настройками
- 📊 **Админ-панель** для управления контентом (пользователи, уровни, артефакты, FAQ)
- 🔍 **FAQ с поиском** для быстрого доступа к справочной информации
- 📱 **Адаптивный дизайн** для комфортного использования на любых устройствах
- 🌓 **Темная/светлая тема** для комфортного использования

## Технологический стек

- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Authentication**: Firebase Authentication (Email/Password)
- **Database**: Firebase Firestore
- **Storage**: Firebase Storage
- **State Management**: React Query (@tanstack/react-query)
- **Form Management**: React Hook Form + Zod валидация
- **Notifications**: Toast уведомления (sonner)
- **AI Integration**: OpenAI API (gpt-4-turbo)
- **Testing**: Vitest, Testing Library, Happy DOM

## Начало работы

### Предварительные требования

- Node.js 18+ и npm
- Учетная запись Firebase
- API ключ OpenAI (для функционала чата)

### Установка и запуск

1. Клонировать репозиторий:
```bash
git clone https://github.com/yourusername/bizlevel.git
cd bizlevel
```

2. Установить зависимости:
```bash
npm install
```

3. Создать файл `.env.local` в корне проекта и добавить переменные окружения:
```
NEXT_PUBLIC_FIREBASE_API_KEY=ваш_ключ_api
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=ваш_домен.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=ваш_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=ваш_bucket.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=ваш_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=ваш_app_id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=ваш_measurement_id
OPENAI_API_KEY=ваш_openai_api_key
```

4. Запустить проект в режиме разработки:
```bash
npm run dev
```

5. Открыть [http://localhost:3000](http://localhost:3000) в браузере.

### Загрузка тестовых данных

В директории `src/scripts/` находятся скрипты для загрузки тестовых данных в Firestore:
- `populate-levels.js` - создание тестовых уровней
- `upload-artifacts.js` - загрузка тестовых артефактов
- `populate-faq.js` - загрузка часто задаваемых вопросов
- `set-admin-role.js` - назначение роли администратора

Подробные инструкции по запуску скриптов находятся в соответствующих README файлах в директории `src/scripts/`.

## Структура проекта

Проект организован по следующей структуре:

```
/src
  /app                   # Маршруты Next.js (App Router)
    /(auth)              # Страницы авторизации
    /(routes)            # Основные страницы
    /admin               # Админ-панель
    /api                 # API Routes
  /components            # React компоненты
    /auth                # Компоненты аутентификации
    /features            # Функциональные компоненты
    /layout              # Компоненты макета
    /ui                  # UI компоненты
  /context               # React контексты
  /hooks                 # Пользовательские хуки
  /lib                   # Утилиты и сервисы
    /firebase            # Конфигурация Firebase
    /services            # Сервисный слой
  /types                 # TypeScript типы
  /test                  # Тестирование
  /scripts               # Скрипты для работы с данными
```

## Разработка

### Команды

- `npm run dev` - запуск в режиме разработки
- `npm run build` - сборка проекта
- `npm run start` - запуск собранного проекта
- `npm run lint` - проверка кода с ESLint
- `npm run test` - запуск тестов
- `npm run test:watch` - запуск тестов в режиме наблюдения
- `npm run test:coverage` - генерация отчета о покрытии тестами

### Рекомендации по разработке

- Все компоненты следует создавать с TypeScript типизацией
- Для управления состоянием используйте React Query
- Для работы с формами используйте React Hook Form и Zod
- Следуйте соглашениям по именованию и структуре компонентов

## Тестирование

Проект использует Vitest в сочетании с Testing Library для тестирования компонентов и хуков. Тесты находятся рядом с исходным кодом в директориях `__tests__`.

Для запуска тестов:
```bash 
npm run test          # Запуск всех тестов
npm run test:watch    # Запуск в режиме наблюдения
npm run test:coverage # Анализ покрытия тестами
```

## Развертывание

Для развертывания проекта вы можете использовать Vercel, Netlify или любую другую платформу, поддерживающую Next.js. Подробные инструкции доступны в файле [docs/deployment-guide.md](docs/deployment-guide.md).

## Документация

- [Архитектура проекта](docs/architecture.md)
- [API и сервисы](docs/api-docs.md)
- [Соглашения по коду](docs/code-conventions.md)
- [Руководство по развертыванию](docs/deployment-guide.md)

## Вклад в проект

Мы приветствуем вклад в развитие проекта! Если вы хотите внести свой вклад:

1. Форкните репозиторий
2. Создайте ветку с функционалом (`git checkout -b feature/amazing-feature`)
3. Закоммитьте изменения (`git commit -m 'Add some amazing feature'`)
4. Отправьте ветку (`git push origin feature/amazing-feature`)
5. Откройте Pull Request

## Лицензия

Этот проект является образовательным и предназначен для демонстрации возможностей современного веб-стека. Распространяется под лицензией MIT.

## Авторы

BizLevel Team - команда разработчиков образовательной платформы для предпринимателей.
