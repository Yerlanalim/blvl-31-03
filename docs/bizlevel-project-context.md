# BizLevel - Общий Контекст Проекта

## 1. Общая концепция проекта

**BizLevel** — это веб-приложение, которое помогает предпринимателям и руководителям повышать бизнес-навыки через короткие видео, тесты и практические артефакты (шаблоны, чек-листы и т.п.).

### Ключевые особенности
- **Геймифицированная "карта уровней"** в стиле Duolingo с постепенной разблокировкой
- **Короткие видео** (2-4 минуты) для эффективного обучения
- **Тесты и задания** для закрепления знаний
- **Скачиваемые артефакты** (шаблоны, таблицы, чек-листы)
- **Чат с AI-ассистентом** для поддержки пользователей
- **Прогресс и бейджи** для мотивации

### MVP предполагает 10 уровней
В каждом уровне:
- 3-4 коротких видео
- Интерактивные тесты
- Минимум 1 "артефакт" для скачивания
- Система разблокировки следующего уровня

## 2. Технологический стек

- **Фреймворк**: Next.js 14+ (с App Router)
- **Язык**: TypeScript
- **Стилизация**: Tailwind CSS
- **UI Компоненты**: shadcn/ui
- **Аутентификация**: Firebase Authentication (Email/Password)
- **База данных**: Firebase Firestore
- **Хранилище файлов**: Firebase Storage
- **Управление состоянием**: React Query (@tanstack/react-query)
- **Управление формами**: React Hook Form + Zod
- **Обратная связь**: Toast-уведомления (sonner)

## 3. Архитектура проекта

### Структура директорий

```
/src
  /app                # Маршруты Next.js (App Router)
    /(auth)           # Группа маршрутов аутентификации
      /login
      /register
      /reset-password
      layout.tsx      # Макет для страниц аутентификации
      page.tsx        # Страницы авторизации
    /(routes)         # Основная группа маршрутов приложения
      /map
      /profile
      /artifacts
      /chat
      /settings
      /faq
      /level
        /[levelId]
      layout.tsx      # Основной макет приложения
      page.tsx        # Страницы приложения
    /api              # API Routes
    page.tsx          # Корневая страница (редирект на /map)
    layout.tsx        # Корневой макет
    providers.tsx     # Все провайдеры
    globals.css       # Глобальные стили
  /components         # Переиспользуемые компоненты
    /auth             # Компоненты для страниц аутентификации
    /features         # Компоненты для функционала
    /layout           # Компоненты макета
    /ui               # Базовые UI компоненты
  /context            # React Контексты
  /hooks              # Кастомные React хуки
  /lib                # Библиотеки, утилиты, сервисы
    /firebase         # Конфигурация Firebase
    /services         # Сервисный слой
    /utils            # Общие утилиты
    constants.ts      # Константы приложения
    zod-schemas.ts    # Схемы валидации
  /types              # TypeScript типы и интерфейсы
/public               # Статические файлы
```

### Модели данных Firestore

1. **Коллекция `users`**
   - Документ: `{userId}` (совпадает с Firebase Auth UID)
   - Ключевые поля: `email`, `displayName`, `photoURL`, `createdAt`, `settings`

2. **Коллекция `userProgress`**
   - Документ: `{userId}`
   - Ключевые поля: `currentLevelId`, `completedLevelIds`, `watchedVideoIds`, `completedTestIds`, `downloadedArtifactIds`, `skillProgress`, `badges`

3. **Коллекция `levels`**
   - Документ: `{levelId}` (например, `level-1`)
   - Ключевые поля: `title`, `description`, `order`, `videoContent`, `tests`, `relatedArtifactIds`, `completionCriteria`, `skillFocus`

4. **Коллекция `artifacts`**
   - Документ: `{artifactId}`
   - Ключевые поля: `title`, `description`, `fileURL`, `fileName`, `fileType`, `levelId`, `downloadCount`

5. **Коллекция `chats`**
   - Документ: `{userId}`
   - Подколлекция `messages`: `{messageId}` с полями `role`, `content`, `timestamp`

6. **Коллекция `faq`**
   - Документ: `{faqId}`
   - Ключевые поля: `question`, `answer`, `category`, `order`

## 4. Основные функциональные страницы и компоненты

### Авторизация
- Страницы входа/регистрации/сброса пароля
- Защищенные маршруты

### Карта уровней
- Визуализация 10 уровней в геймифицированном стиле
- Индикаторы статуса (заблокирован/доступен/пройден)
- Отображение прогресса пользователя

### Страница уровня
- Список коротких видео с плеером
- Интерактивные тесты
- Блок "Скачать артефакт"
- Кнопка "Завершить уровень"

### Профиль пользователя
- Информация о пользователе
- Прогресс прохождения
- Заработанные бейджи
- Статистика навыков

### Артефакты
- Список доступных артефактов
- Скачивание с отслеживанием

### Чат с AI
- Интерфейс чата для взаимодействия с AI-ассистентом
- История сообщений

### FAQ/Справка
- Типовые вопросы и ответы
- Инструкции для пользователей

## 5. Пользовательский путь (User Flow)

1. Регистрация/вход в аккаунт
2. Просмотр карты уровней (изначально доступен только Уровень 1)
3. Прохождение уровня:
   - Просмотр видео
   - Выполнение тестов
   - Скачивание артефактов
   - Завершение уровня
4. Разблокировка следующего уровня
5. Прохождение всех 10 уровней
6. Получение бейджей и наград

## 6. Основные приоритеты MVP

1. Функциональная карта уровней с механизмом разблокировки
2. Система просмотра видео и выполнения тестов
3. Скачивание и отслеживание артефактов
4. Простая система прогресса и бейджей
5. Чат с AI-ассистентом
6. Базовый FAQ для поддержки пользователей

Этот документ служит общим контекстом для разработки проекта BizLevel и может использоваться как справочный материал в ходе выполнения отдельных задач.
