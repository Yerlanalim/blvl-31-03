# Безопасность Firebase в BizLevel

Этот документ описывает принципы безопасности Firebase, используемые в проекте BizLevel, правила доступа к данным и их обоснование. Документ охватывает как Firestore Security Rules, так и Storage Security Rules.

## Содержание

1. [Общие принципы безопасности](#1-общие-принципы-безопасности)
   - [Принцип минимальных привилегий](#11-принцип-минимальных-привилегий)
   - [Модель идентификации и аутентификации](#12-модель-идентификации-и-аутентификации)
   - [Ролевая модель доступа](#13-ролевая-модель-доступа)

2. [Firestore Security Rules](#2-firestore-security-rules)
   - [Структура правил](#21-структура-правил)
   - [Вспомогательные функции](#22-вспомогательные-функции)
   - [Правила для коллекций](#23-правила-для-коллекций)
   - [Валидация данных](#24-валидация-данных)

3. [Storage Security Rules](#3-storage-security-rules)
   - [Структура правил](#31-структура-правил)
   - [Вспомогательные функции](#32-вспомогательные-функции)
   - [Правила для директорий](#33-правила-для-директорий)
   - [Валидация файлов](#34-валидация-файлов)

4. [Матрица доступа](#4-матрица-доступа)
   - [Доступ к данным в Firestore](#41-доступ-к-данным-в-firestore)
   - [Доступ к файлам в Storage](#42-доступ-к-файлам-в-storage)

5. [Тестирование правил безопасности](#5-тестирование-правил-безопасности)
   - [Тестирование правил Firestore](#51-тестирование-правил-firestore)
   - [Тестирование правил Storage](#52-тестирование-правил-storage)

6. [Лучшие практики](#6-лучшие-практики)
   - [Обновление правил](#61-обновление-правил)
   - [Мониторинг безопасности](#62-мониторинг-безопасности)

## 1. Общие принципы безопасности

### 1.1 Принцип минимальных привилегий

В проекте BizLevel реализован принцип минимальных привилегий, согласно которому:

1. **Каждый пользователь имеет доступ только к необходимым ему ресурсам**
2. **Доступ предоставляется только на минимально необходимом уровне** (чтение или запись)
3. **Неаутентифицированные пользователи имеют минимальный доступ**
4. **Особые права предоставляются только администраторам** 

### 1.2 Модель идентификации и аутентификации

В проекте используется Firebase Authentication для идентификации и аутентификации пользователей:

1. **Методы аутентификации**:
   - Email/Password — основной метод
   - (опционально) OAuth с Google

2. **Flow аутентификации**:
   - Пользователь проходит аутентификацию через Firebase Authentication
   - Firebase предоставляет JWT токен
   - Токен автоматически используется при запросах к Firestore и Storage
   - В правилах безопасности доступны данные аутентифицированного пользователя через `request.auth`

### 1.3 Ролевая модель доступа

BizLevel использует простую ролевую модель с двумя основными ролями:

1. **user** — обычный пользователь, который может:
   - Просматривать общедоступные данные (уровни, артефакты, FAQ)
   - Управлять собственным профилем и прогрессом
   - Загружать и обновлять собственные файлы
   - Скачивать артефакты

2. **admin** — администратор, который может:
   - Делать всё, что может обычный пользователь
   - Создавать, обновлять и удалять уровни и артефакты
   - Просматривать и управлять данными любого пользователя
   - Назначать роли другим пользователям

## 2. Firestore Security Rules

### 2.1 Структура правил

Правила безопасности Firestore в BizLevel структурированы по коллекциям, с использованием вспомогательных функций для общей логики:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Helper functions
    
    // Default rule (deny all)
    match /{document=**} {
      allow read, write: if false;
    }
    
    // Collection-specific rules
    match /users/{userId} { ... }
    match /userProgress/{userId} { ... }
    match /levels/{levelId} { ... }
    match /artifacts/{artifactId} { ... }
    match /faq/{faqId} { ... }
    match /chats/{userId}/messages/{messageId} { ... }
  }
}
```

### 2.2 Вспомогательные функции

Для упрощения правил и повышения их читаемости используются вспомогательные функции:

#### isSignedIn()
```javascript
function isSignedIn() {
  return request.auth != null;
}
```

#### isAdmin()
```javascript
function isAdmin() {
  return isSignedIn() && 
    get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
}
```

#### isOwner(userId)
```javascript
function isOwner(userId) {
  return isSignedIn() && request.auth.uid == userId;
}
```

#### isValidUser()
```javascript
function isValidUser() {
  let requiredFields = ['email', 'displayName', 'photoURL', 'createdAt', 'settings', 'role'];
  let allFieldsPresent = requiredFields.hasAll(request.resource.data.keys());
  
  let isValidRole = request.resource.data.role == 'user' || 
                    (request.resource.data.role == 'admin' && isAdmin());
                    
  let isValidSettings = request.resource.data.settings.theme in ['light', 'dark', 'system'];
  
  return allFieldsPresent && isValidRole && isValidSettings;
}
```

### 2.3 Правила для коллекций

#### Users Collection
```javascript
match /users/{userId} {
  allow read: if isSignedIn() && (isOwner(userId) || isAdmin());
  allow create: if isSignedIn() && isOwner(userId) && isValidUser();
  allow update: if isSignedIn() && (
    // User can update their own profile but can't change their role
    (isOwner(userId) && !request.resource.data.diff(resource.data).affectedKeys().hasAny(['role'])) ||
    // Admin can update any profile including role
    isAdmin()
  );
  allow delete: if isAdmin();
}
```

#### UserProgress Collection
```javascript
match /userProgress/{userId} {
  allow read: if isSignedIn() && (isOwner(userId) || isAdmin());
  allow create: if isSignedIn() && isOwner(userId);
  allow update: if isSignedIn() && (isOwner(userId) || isAdmin());
  allow delete: if isAdmin();
}
```

#### Levels Collection
```javascript
match /levels/{levelId} {
  allow read: if isSignedIn();
  allow create, update, delete: if isAdmin();
}
```

#### Artifacts Collection
```javascript
match /artifacts/{artifactId} {
  allow read: if isSignedIn();
  
  // Prevent direct updating of downloadCount by regular users
  allow create, update: if isAdmin();
  allow delete: if isAdmin();
  
  // Allow incrementing downloadCount only
  allow update: if isSignedIn() && 
                  !isAdmin() &&
                  request.resource.data.diff(resource.data).affectedKeys().hasOnly(['downloadCount']) &&
                  request.resource.data.downloadCount == resource.data.downloadCount + 1;
}
```

#### FAQ Collection
```javascript
match /faq/{faqId} {
  allow read: if true; // Public read access
  allow create, update, delete: if isAdmin();
}
```

#### Chats Collection
```javascript
match /chats/{userId} {
  allow read: if isSignedIn() && (isOwner(userId) || isAdmin());
  allow create, update, delete: if isSignedIn() && (isOwner(userId) || isAdmin());
  
  match /messages/{messageId} {
    allow read: if isSignedIn() && (isOwner(userId) || isAdmin());
    
    // Validate message format
    allow create: if isSignedIn() && 
                    (isOwner(userId) || isAdmin()) &&
                    request.resource.data.keys().hasAll(['role', 'content', 'timestamp']) &&
                    request.resource.data.role in ['user', 'assistant', 'system'];
                    
    allow update, delete: if isSignedIn() && isAdmin();
  }
}
```

### 2.4 Валидация данных

В правилах используются следующие механизмы валидации данных:

1. **Проверка обязательных полей** с помощью `hasAll()`
2. **Проверка допустимых значений** с помощью операторов `in` и сравнения
3. **Предотвращение изменения особых полей** с помощью `diff().affectedKeys()`
4. **Проверка разрешенных операций** с помощью `hasOnly()`
5. **Проверка инкремента счетчиков** с помощью математического сравнения

## 3. Storage Security Rules

### 3.1 Структура правил

Правила безопасности Firebase Storage структурированы по директориям файлов:

```
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // Helper functions
    
    // Default rule (deny all)
    match /{allPaths=**} {
      allow read, write: if false;
    }
    
    // Directory-specific rules
    match /avatars/{userId}/{fileName} { ... }
    match /artifacts/{artifactId}/{fileName} { ... }
    match /user-content/{userId}/{fileName} { ... }
  }
}
```

### 3.2 Вспомогательные функции

#### isSignedIn()
```javascript
function isSignedIn() {
  return request.auth != null;
}
```

#### isAdmin()
```javascript
function isAdmin() {
  return isSignedIn() && 
    firestore.get(/databases/(default)/documents/users/$(request.auth.uid)).data.role == 'admin';
}
```

#### isOwner(userId)
```javascript
function isOwner(userId) {
  return isSignedIn() && request.auth.uid == userId;
}
```

#### isValidImageType()
```javascript
function isValidImageType() {
  return request.resource.contentType.matches('image/.*');
}
```

#### isFileSizeValid()
```javascript
function isFileSizeValid() {
  // Limit file size to 50MB
  return request.resource.size <= 50 * 1024 * 1024;
}
```

#### isValidArtifactType()
```javascript
function isValidArtifactType() {
  // Allow common file types for artifacts
  return request.resource.contentType.matches('application/pdf') ||
         request.resource.contentType.matches('application/msword') ||
         request.resource.contentType.matches('application/vnd.openxmlformats-officedocument.wordprocessingml.document') ||
         request.resource.contentType.matches('application/vnd.ms-excel') ||
         request.resource.contentType.matches('application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') ||
         request.resource.contentType.matches('image/.*') ||
         request.resource.contentType.matches('text/.*') ||
         request.resource.contentType.matches('application/json') ||
         request.resource.contentType.matches('application/zip');
}
```

### 3.3 Правила для директорий

#### Avatars Directory
```javascript
match /avatars/{userId}/{fileName} {
  allow read: if isSignedIn();
  allow write: if isSignedIn() && 
               isOwner(userId) && 
               isValidImageType() && 
               isFileSizeValid() &&
               request.resource.size <= 5 * 1024 * 1024; // Max 5MB for avatars
  allow delete: if isSignedIn() && (isOwner(userId) || isAdmin());
}
```

#### Artifacts Directory
```javascript
match /artifacts/{artifactId}/{fileName} {
  allow read: if isSignedIn();
  allow write: if isSignedIn() && 
               isAdmin() && 
               isValidArtifactType() && 
               isFileSizeValid();
  allow delete: if isSignedIn() && isAdmin();
}
```

#### User-Content Directory
```javascript
match /user-content/{userId}/{fileName} {
  allow read: if isSignedIn() && (isOwner(userId) || isAdmin());
  allow write: if isSignedIn() && 
               isOwner(userId) && 
               isFileSizeValid();
  allow delete: if isSignedIn() && (isOwner(userId) || isAdmin());
}
```

### 3.4 Валидация файлов

В правилах Storage используются следующие механизмы валидации файлов:

1. **Проверка типа файла** с помощью `matches()` регулярных выражений для MIME-типов
2. **Ограничение размера файла** с помощью сравнения `request.resource.size`
3. **Проверка авторства** с помощью `isOwner()` и `isAdmin()`
4. **Ограничение директорий** с помощью структуры правил по путям

## 4. Матрица доступа

### 4.1 Доступ к данным в Firestore

| Коллекция | Операция | Неаутентифицированный | Обычный пользователь | Администратор |
|-----------|----------|:---------------------:|:--------------------:|:-------------:|
| **users** | Чтение   | ❌ | ✅ (только свой) | ✅ (любой) |
|           | Создание | ❌ | ✅ (для себя) | ✅ |
|           | Обновление | ❌ | ✅ (свой, кроме role) | ✅ (любой) |
|           | Удаление | ❌ | ❌ | ✅ |
| **userProgress** | Чтение | ❌ | ✅ (только свой) | ✅ (любой) |
|                  | Создание | ❌ | ✅ (для себя) | ✅ |
|                  | Обновление | ❌ | ✅ (только свой) | ✅ (любой) |
|                  | Удаление | ❌ | ❌ | ✅ |
| **levels** | Чтение | ❌ | ✅ | ✅ |
|            | Создание/Обновление/Удаление | ❌ | ❌ | ✅ |
| **artifacts** | Чтение | ❌ | ✅ | ✅ |
|               | Создание/Обновление/Удаление | ❌ | ❌ | ✅ |
|               | Обновление downloadCount | ❌ | ✅ (только инкремент) | ✅ |
| **faq** | Чтение | ✅ | ✅ | ✅ |
|         | Создание/Обновление/Удаление | ❌ | ❌ | ✅ |
| **chats/messages** | Чтение | ❌ | ✅ (только свои) | ✅ (любые) |
|                    | Создание | ❌ | ✅ (только свои) | ✅ |
|                    | Обновление/Удаление | ❌ | ❌ | ✅ |

### 4.2 Доступ к файлам в Storage

| Директория | Операция | Неаутентифицированный | Обычный пользователь | Администратор |
|------------|----------|:---------------------:|:--------------------:|:-------------:|
| **avatars/{userId}** | Чтение | ❌ | ✅ | ✅ |
|                      | Запись | ❌ | ✅ (только свой) | ✅ (любой) |
|                      | Удаление | ❌ | ✅ (только свой) | ✅ (любой) |
| **artifacts/{artifactId}** | Чтение | ❌ | ✅ | ✅ |
|                            | Запись | ❌ | ❌ | ✅ |
|                            | Удаление | ❌ | ❌ | ✅ |
| **user-content/{userId}** | Чтение | ❌ | ✅ (только свой) | ✅ (любой) |
|                           | Запись | ❌ | ✅ (только свой) | ✅ (любой) |
|                           | Удаление | ❌ | ✅ (только свой) | ✅ (любой) |

## 5. Тестирование правил безопасности

### 5.1 Тестирование правил Firestore

Тесты для правил безопасности Firestore расположены в файле `tests/firebase/firestore-rules.test.js` и проверяют следующие сценарии:

1. **Доступ неаутентифицированного пользователя**
2. **Доступ обычного пользователя к своим данным**
3. **Доступ обычного пользователя к чужим данным**
4. **Доступ администратора ко всем данным**
5. **Валидация данных при создании/обновлении**
6. **Специальные случаи** (инкремент downloadCount и др.)

### 5.2 Тестирование правил Storage

Тесты для правил безопасности Storage расположены в файле `tests/firebase/storage-rules.test.js` и проверяют следующие сценарии:

1. **Доступ неаутентифицированного пользователя**
2. **Доступ обычного пользователя к своим файлам**
3. **Доступ обычного пользователя к файлам артефактов**
4. **Доступ обычного пользователя к чужим файлам**
5. **Доступ администратора ко всем файлам**
6. **Валидация типов и размеров файлов**

## 6. Лучшие практики

### 6.1 Обновление правил

При внесении изменений в правила безопасности следует придерживаться следующего процесса:

1. **Обновить правила локально** и тщательно протестировать
2. **Написать тесты** для новых правил
3. **Развернуть правила** в среде разработки/тестирования
4. **Проверить работу приложения** с новыми правилами
5. **Развернуть правила** в продакшен
6. **Обновить документацию** по безопасности

### 6.2 Мониторинг безопасности

Для обеспечения безопасности на протяжении жизненного цикла приложения:

1. **Регулярно проверяйте** Firebase Security Rules
2. **Включите логирование** критических операций
3. **Настройте оповещения** о подозрительной активности
4. **Используйте Firebase App Check** для дополнительной защиты
5. **Проводите периодический аудит** безопасности проекта

---

Эта документация описывает текущие правила безопасности Firebase в проекте BizLevel. При обновлении правил необходимо также обновлять эту документацию, чтобы она всегда соответствовала актуальному состоянию безопасности. 