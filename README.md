# BizLevel

BizLevel — это веб-приложение, которое помогает предпринимателям и руководителям повышать бизнес-навыки через короткие видео, тесты и практические артефакты.

## Технологический стек

- **Фреймворк**: Next.js 14+ (с App Router)
- **Язык**: TypeScript
- **Стилизация**: Tailwind CSS
- **UI Компоненты**: shadcn/ui
- **Аутентификация**: Firebase Authentication
- **База данных**: Firebase Firestore
- **Хранилище файлов**: Firebase Storage
- **Управление состоянием**: React Query (@tanstack/react-query)
- **Управление формами**: React Hook Form + Zod
- **Обратная связь**: Toast-уведомления (sonner)
- **AI Ассистент**: OpenAI API

## Начало работы

### Установка

1. Клонировать репозиторий:
```bash
git clone <repository-url>
cd bizlevel
```

2. Установить зависимости:
```bash
npm install
```

3. Настройка переменных окружения:
   - Создайте файл `.env.local` в корне проекта (или скопируйте `.env.example` если он доступен)
   - Добавьте необходимые переменные окружения:

```
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_firebase_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_firebase_app_id

# OpenAI Configuration (для функционала чата с AI)
OPENAI_API_KEY=your_openai_api_key
```

> **Важно**: Ключ API OpenAI требуется для работы функционала чата с AI. Получите ключ в [панели управления OpenAI](https://platform.openai.com/account/api-keys) и добавьте его в `.env.local`.

4. Запустить сервер для разработки:
```bash
npm run dev
```

Откройте [http://localhost:3000](http://localhost:3000) в браузере для просмотра проекта.

## Архитектура

BizLevel построен вокруг концепции последовательного прохождения уровней, где каждый уровень включает в себя:
- Короткие видеоуроки
- Интерактивные тесты
- Скачиваемые материалы (артефакты)

Основные разделы приложения:
- **Карта уровней**: визуализация прогресса пользователя
- **Страница уровня**: видео, тесты и материалы для конкретного уровня
- **Артефакты**: доступ ко всем скачиваемым материалам
- **Чат с AI**: интерактивный помощник на основе OpenAI
- **Профиль и настройки**: управление аккаунтом пользователя

## Лицензия

[MIT](LICENSE)
