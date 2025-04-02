# Руководство по развертыванию BizLevel

Это руководство содержит подробные инструкции по настройке и развертыванию проекта BizLevel в продакшн-окружении. Документ включает настройку Firebase, деплой на хостинг-платформы и рекомендации по оптимизации.

## Содержание

1. [Настройка Firebase](#1-настройка-firebase)
   - [Создание проекта Firebase](#11-создание-проекта-firebase)
   - [Настройка Authentication](#12-настройка-authentication)
   - [Настройка Firestore](#13-настройка-firestore)
   - [Настройка Storage](#14-настройка-storage)
   - [Настройка правил безопасности](#15-настройка-правил-безопасности)
   - [Получение конфигурационных ключей](#16-получение-конфигурационных-ключей)

2. [Настройка OpenAI API](#2-настройка-openai-api)
   - [Получение API ключа](#21-получение-api-ключа)
   - [Управление лимитами и расходами](#22-управление-лимитами-и-расходами)

3. [Деплой на Vercel](#3-деплой-на-vercel)
   - [Настройка проекта на Vercel](#31-настройка-проекта-на-vercel)
   - [Конфигурация переменных окружения](#32-конфигурация-переменных-окружения)
   - [Настройка CI/CD](#33-настройка-cicd)
   - [Домен и SSL](#34-домен-и-ssl)

4. [Деплой на Netlify](#4-деплой-на-netlify)
   - [Настройка проекта на Netlify](#41-настройка-проекта-на-netlify)
   - [Конфигурация переменных окружения](#42-конфигурация-переменных-окружения)
   - [Настройка CI/CD](#43-настройка-cicd)
   - [Домен и SSL](#44-домен-и-ssl)

5. [Загрузка начальных данных](#5-загрузка-начальных-данных)
   - [Настройка сервисного аккаунта Firebase](#51-настройка-сервисного-аккаунта-firebase)
   - [Запуск скриптов импорта данных](#52-запуск-скриптов-импорта-данных)

6. [Оптимизация для продакшена](#6-оптимизация-для-продакшена)
   - [Оптимизация производительности](#61-оптимизация-производительности)
   - [Масштабирование](#62-масштабирование)
   - [Мониторинг](#63-мониторинг)

7. [Устранение неполадок](#7-устранение-неполадок)
   - [Типичные проблемы и решения](#71-типичные-проблемы-и-решения)

## 1. Настройка Firebase

### 1.1 Создание проекта Firebase

1. Перейдите в [Firebase Console](https://console.firebase.google.com/)
2. Нажмите "Создать проект" или "Add project"
3. Введите название проекта (например, "BizLevel")
4. Определитесь с настройками Google Analytics (рекомендуем включить)
5. Нажмите "Создать проект"
6. После завершения настройки, перейдите в созданный проект

### 1.2 Настройка Authentication

1. В меню слева выберите "Authentication"
2. Перейдите на вкладку "Sign-in method"
3. Включите метод "Email/Password"
4. Опционально включите вход через Google, для этого:
   - Активируйте метод "Google"
   - Укажите email для поддержки
   - Создайте и настройте OAuth клиент
5. Сохраните изменения

### 1.3 Настройка Firestore

1. В меню слева выберите "Firestore Database"
2. Нажмите "Создать базу данных"
3. Выберите режим запуска (для продакшена рекомендуется "Режим production")
4. Выберите ближайший регион для размещения базы данных
5. Нажмите "Включить"
6. После создания базы данных, перейдите на вкладку "Правила" и настройте правила безопасности (см. раздел 1.5)

### 1.4 Настройка Storage

1. В меню слева выберите "Storage"
2. Нажмите "Начать"
3. Выберите режим запуска (для продакшена рекомендуется "Режим production")
4. Выберите ближайший регион для размещения хранилища
5. Нажмите "Готово"
6. После создания хранилища, перейдите на вкладку "Правила" и настройте правила безопасности (см. раздел 1.5)

### 1.5 Настройка правил безопасности

Для Firestore, скопируйте следующие правила безопасности:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Публичные правила: пользователь может читать уровни, артефакты и FAQ
    match /levels/{levelId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
    
    match /artifacts/{artifactId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
    
    match /faq/{faqId} {
      allow read: if true;
      allow write: if request.auth != null && get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
    
    // Пользовательские данные
    match /users/{userId} {
      allow read: if request.auth != null && (request.auth.uid == userId || get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin');
      allow write: if request.auth != null && (request.auth.uid == userId || get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin');
    }
    
    match /userProgress/{userId} {
      allow read: if request.auth != null && (request.auth.uid == userId || get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin');
      allow write: if request.auth != null && (request.auth.uid == userId || get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin');
    }
    
    // Чаты
    match /chats/{userId} {
      allow read: if request.auth != null && (request.auth.uid == userId || get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin');
      allow write: if request.auth != null && (request.auth.uid == userId || get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin');
      
      match /messages/{messageId} {
        allow read: if request.auth != null && (request.auth.uid == userId || get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin');
        allow write: if request.auth != null && (request.auth.uid == userId || get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin');
      }
    }
  }
}
```

Для Storage, используйте следующие правила:

```
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // Доступ к аватарам пользователей
    match /avatars/{userId}/{fileName} {
      allow read: if true;
      allow write: if request.auth != null && (request.auth.uid == userId || get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin');
    }
    
    // Доступ к артефактам
    match /artifacts/{artifactId}/{fileName} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
  }
}
```

### 1.6 Получение конфигурационных ключей

1. В Firebase Console перейдите в "Настройки проекта" (иконка шестеренки)
2. Перейдите на вкладку "Общие"
3. Прокрутите вниз до раздела "Ваши приложения" и нажмите на иконку веб-приложения
4. Если у вас нет зарегистрированного приложения, нажмите на иконку веб-приложения (</>)
5. Введите название приложения (например, "BizLevel Web")
6. Нажмите "Зарегистрировать приложение"
7. Скопируйте конфигурационный объект `firebaseConfig`, содержащий:
   - apiKey
   - authDomain
   - projectId
   - storageBucket
   - messagingSenderId
   - appId
   - measurementId
8. Сохраните эти значения для использования в переменных окружения при деплое

## 2. Настройка OpenAI API

### 2.1 Получение API ключа

1. Зарегистрируйтесь или войдите на [платформе OpenAI](https://platform.openai.com/)
2. Перейдите в раздел API Keys по ссылке: https://platform.openai.com/api-keys
3. Нажмите "Create new secret key" и введите описание (например, "BizLevel Chat Assistant")
4. Скопируйте сгенерированный ключ (он отображается только один раз!)
5. Сохраните ключ для использования в переменных окружения при деплое

### 2.2 Управление лимитами и расходами

1. Перейдите в раздел "Usage limits" на платформе OpenAI
2. Установите лимиты расходов для контроля затрат на использование API
3. Рекомендуется настроить уведомления о приближении к лимиту
4. Для продакшена рассмотрите возможность оплаты тарифа с большей квотой

## 3. Деплой на Vercel

### 3.1 Настройка проекта на Vercel

1. Зарегистрируйтесь или войдите на [Vercel](https://vercel.com/)
2. Нажмите "New Project"
3. Импортируйте репозиторий с проектом BizLevel из GitHub, GitLab или Bitbucket
4. Выберите импортированный репозиторий

### 3.2 Конфигурация переменных окружения

1. В настройках проекта перейдите на вкладку "Environment Variables"
2. Добавьте следующие переменные:
   - `NEXT_PUBLIC_FIREBASE_API_KEY` - из конфигурации Firebase
   - `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` - из конфигурации Firebase
   - `NEXT_PUBLIC_FIREBASE_PROJECT_ID` - из конфигурации Firebase
   - `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` - из конфигурации Firebase
   - `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` - из конфигурации Firebase
   - `NEXT_PUBLIC_FIREBASE_APP_ID` - из конфигурации Firebase
   - `NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID` - из конфигурации Firebase
   - `OPENAI_API_KEY` - ключ API OpenAI
3. Выберите для каких окружений (Production, Preview, Development) активны переменные
4. Сохраните изменения

### 3.3 Настройка CI/CD

1. Настройки CI/CD в Vercel активируются автоматически
2. По умолчанию при каждом пуше в ветку main происходит деплой в продакшн
3. Для настройки дополнительных параметров перейдите в "Git" в настройках проекта
4. Настройте production branch (обычно main или master)
5. Настройте preview branches для создания preview deployment

### 3.4 Домен и SSL

1. В настройках проекта перейдите на вкладку "Domains"
2. По умолчанию, Vercel предоставляет домен вида `your-project.vercel.app`
3. Для подключения собственного домена:
   - Нажмите "Add" в разделе Custom Domains
   - Введите имя домена
   - Следуйте инструкциям по настройке DNS
4. SSL-сертификат для Custom Domain выпускается автоматически
5. Включите опцию "Redirect to WWW" или "Redirect to Apex Domain" при необходимости

## 4. Деплой на Netlify

### 4.1 Настройка проекта на Netlify

1. Зарегистрируйтесь или войдите на [Netlify](https://www.netlify.com/)
2. Нажмите "New site from Git"
3. Выберите провайдера Git (GitHub, GitLab, Bitbucket)
4. Авторизуйтесь и выберите репозиторий с проектом BizLevel
5. Настройте параметры сборки:
   - Build command: `npm run build`
   - Publish directory: `.next`

### 4.2 Конфигурация переменных окружения

1. В настройках сайта перейдите в раздел "Site settings" -> "Environment variables"
2. Добавьте те же переменные окружения, что и для Vercel (см. раздел 3.2)
3. Сохраните изменения

### 4.3 Настройка CI/CD

1. CI/CD в Netlify активируется автоматически
2. Для дополнительной настройки перейдите в "Build & deploy" в настройках сайта
3. Настройте ветку для production deploy
4. Установите настройки деплоя для preview branches и pull requests

### 4.4 Домен и SSL

1. В настройках сайта перейдите в раздел "Domain management"
2. По умолчанию, Netlify предоставляет домен вида `your-site.netlify.app`
3. Для настройки собственного домена:
   - Нажмите "Add custom domain"
   - Введите имя домена
   - Следуйте инструкциям по настройке DNS
4. SSL-сертификат предоставляется автоматически через Let's Encrypt
5. Настройте перенаправления (redirect) при необходимости

## 5. Загрузка начальных данных

### 5.1 Настройка сервисного аккаунта Firebase

1. В Firebase Console перейдите в "Настройки проекта" -> "Сервисные аккаунты"
2. Нажмите "Создать сервисный аккаунт"
3. Выберите "Node.js" в качестве среды разработки
4. Нажмите "Сгенерировать новый ключ"
5. Сохраните скачанный JSON-файл в безопасном месте
6. Переименуйте файл в `service-account.json`

### 5.2 Запуск скриптов импорта данных

1. Клонируйте репозиторий проекта локально
2. Скопируйте файл `service-account.json` в директорию `src/scripts/`
3. Установите зависимости: `npm install`
4. Запустите скрипты в следующем порядке:

   ```bash
   # Создание тестовых уровней
   node src/scripts/populate-levels.js
   
   # Загрузка тестовых артефактов
   node src/scripts/upload-artifacts.js
   
   # Загрузка часто задаваемых вопросов
   node src/scripts/populate-faq.js
   
   # Назначение роли администратора (укажите email вашего аккаунта)
   node src/scripts/set-admin-role.js your-email@example.com
   ```

5. Проверьте в Firebase Console, что данные успешно загружены

## 6. Оптимизация для продакшена

### 6.1 Оптимизация производительности

1. **Настройка кеширования:**
   - Проверьте и обновите настройки staleTime в React Query для оптимизации запросов
   - Включите persistent кеширование для Firebase Firestore
   - Настройте мемоизацию компонентов с помощью React.memo()

2. **Оптимизация загрузки изображений:**
   - Используйте компонент OptimizedImage с поддержкой форматов WebP и AVIF
   - Настройте lazy loading для всех изображений

3. **Code-splitting:**
   - Используйте dynamic imports для админ-панели и других крупных компонентов
   - Настройте prefetching для часто используемых маршрутов

### 6.2 Масштабирование

1. **Масштабирование Firestore:**
   - Настройте индексы для часто используемых запросов
   - Используйте составные индексы для сложных запросов
   - Документы не должны превышать 1 МБ в размере

2. **Масштабирование Storage:**
   - Установите квоты на размер загружаемых файлов
   - Реализуйте ограничение на типы файлов
   - Настройте автоматическую очистку неиспользуемых файлов

3. **Масштабирование OpenAI API:**
   - Реализуйте кеширование частых запросов
   - Настройте ограничение частоты запросов
   - Рассмотрите возможность использования более экономичных моделей для снижения затрат

### 6.3 Мониторинг

1. **Firebase Performance Monitoring:**
   - Включите Firebase Performance Monitoring для отслеживания производительности
   - Настройте пороговые значения для алертов

2. **Firebase Crashlytics:**
   - Настройте Crashlytics для отслеживания ошибок на стороне клиента
   - Настройте уведомления о критических ошибках

3. **Vercel/Netlify Analytics:**
   - Включите аналитику на платформе хостинга
   - Отслеживайте посещаемость и производительность

4. **Web Vitals:**
   - Используйте встроенный модуль web-vitals для отслеживания метрик Core Web Vitals
   - Отправляйте метрики в Google Analytics или собственную аналитику

## 7. Устранение неполадок

### 7.1 Типичные проблемы и решения

1. **Проблемы аутентификации:**
   - Убедитесь, что метод Email/Password включен в Firebase Authentication
   - Проверьте правильность переменных окружения для Firebase
   - Проверьте правила безопасности Firebase

2. **Проблемы с загрузкой файлов:**
   - Убедитесь, что правила Storage настроены правильно
   - Проверьте, что максимальный размер файла не превышает ограничения
   - Проверьте CORS-настройки для Storage

3. **Ошибки API OpenAI:**
   - Проверьте, что ключ API действителен и имеет достаточно средств
   - Убедитесь, что запросы не превышают лимиты API
   - Проверьте правильность формата запросов

4. **Проблемы с отображением контента:**
   - Проверьте консоль браузера на наличие ошибок JavaScript
   - Проверьте сетевые запросы на ошибки
   - Убедитесь, что данные правильно загружаются из Firestore

5. **Ошибки сборки:**
   - Проверьте логи сборки на платформе хостинга
   - Убедитесь, что все зависимости установлены
   - Проверьте соответствие версий Node.js на локальной машине и сервере

---

Это руководство охватывает основные шаги по развертыванию проекта BizLevel в продакшн-окружении. Для конкретных вопросов или проблем, обратитесь к документации используемых технологий или создайте issue в репозитории проекта. 