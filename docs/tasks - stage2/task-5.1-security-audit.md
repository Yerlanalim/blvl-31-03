# Задача 5.1: Аудит безопасности и внедрение улучшений

## Описание

Данная задача включает проведение комплексного аудита безопасности приложения, выявление потенциальных уязвимостей и реализацию необходимых улучшений для защиты данных пользователей и обеспечения безопасности системы в целом.

## Шаги выполнения

1. **Проведение аудита текущей системы безопасности:**
   - Анализ текущих механизмов аутентификации и авторизации
   - Проверка настроек Firebase Security Rules
   - Анализ обработки пользовательских данных и конфиденциальной информации
   - Выявление потенциальных уязвимостей в коде и архитектуре

2. **Улучшение механизмов аутентификации:**
   - Внедрение двухфакторной аутентификации для критичных операций
   - Улучшение политики паролей и механизмов восстановления доступа
   - Внедрение механизма защиты от подбора паролей
   - Безопасное хранение токенов и сессий

3. **Оптимизация правил безопасности Firebase:**
   - Пересмотр и улучшение правил доступа к Firestore
   - Настройка детальных правил для Storage
   - Реализация валидации данных на уровне Firebase Security Rules
   - Создание тестов для проверки правил безопасности

4. **Защита от распространенных веб-уязвимостей:**
   - Реализация защиты от XSS-атак
   - Внедрение защиты от CSRF
   - Настройка защиты от инъекций
   - Обеспечение безопасности API-маршрутов Next.js

5. **Улучшение политики конфиденциальности и доступа к данным:**
   - Аудит и оптимизация хранения чувствительных данных
   - Реализация механизмов шифрования конфиденциальной информации
   - Внедрение строгой политики управления доступом
   - Разработка процедур регулярного обновления ключей и токенов

## Пример улучшения Firebase Security Rules

```javascript
// Пример обновленных правил безопасности для Firestore
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Вспомогательные функции
    function isSignedIn() {
      return request.auth != null;
    }
    
    function isOwner(userId) {
      return isSignedIn() && request.auth.uid == userId;
    }
    
    function isAdmin() {
      return isSignedIn() && 
        exists(/databases/$(database)/documents/users/$(request.auth.uid)) &&
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
    
    function isValidUser(userData) {
      return userData.size() < 20 && 
        userData.keys().hasOnly(['name', 'email', 'photoURL', 'role', 'createdAt', 'lastLoginAt', 'settings']) &&
        (userData.role == 'user' || userData.role == 'premium');
    }
    
    // Доступ к документам пользователей
    match /users/{userId} {
      allow read: if isSignedIn();
      allow create: if isOwner(userId) && isValidUser(request.resource.data);
      allow update: if (isOwner(userId) || isAdmin()) && 
                    isValidUser(request.resource.data) &&
                    (request.resource.data.role == resource.data.role || isAdmin());
      allow delete: if isAdmin();
      
      // Вложенные коллекции пользователя
      match /progress/{levelId} {
        allow read: if isOwner(userId) || isAdmin();
        allow write: if isOwner(userId);
      }
      
      match /settings/{settingId} {
        allow read: if isOwner(userId);
        allow write: if isOwner(userId);
      }
    }
    
    // Правила для коллекции уровней
    match /levels/{levelId} {
      // Все аутентифицированные пользователи могут читать
      allow read: if isSignedIn();
      // Только администраторы могут изменять уровни
      allow write: if isAdmin();
      
      // Вложенные коллекции для уровней
      match /resources/{resourceId} {
        allow read: if isSignedIn();
        allow write: if isAdmin();
      }
    }
    
    // Правила для глобальных настроек
    match /settings/{settingId} {
      allow read: if isSignedIn();
      allow write: if isAdmin();
    }
  }
}
```

## Пример реализации защиты от XSS

```typescript
// src/middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Заголовки безопасности
const securityHeaders = [
  {
    key: 'X-XSS-Protection',
    value: '1; mode=block',
  },
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff',
  },
  {
    key: 'X-Frame-Options',
    value: 'SAMEORIGIN',
  },
  {
    key: 'Referrer-Policy',
    value: 'strict-origin-when-cross-origin',
  },
  {
    key: 'Content-Security-Policy',
    value: "default-src 'self'; script-src 'self' 'unsafe-inline' https://apis.google.com https://*.firebase.com; style-src 'self' 'unsafe-inline'; img-src 'self' data: https://*.googleapis.com https://*.gstatic.com; font-src 'self' data:; connect-src 'self' https://*.firebase.com https://*.firebaseio.com; frame-src 'self' https://*.firebaseapp.com;",
  },
];

export function middleware(request: NextRequest) {
  // Клонируем заголовки, чтобы не модифицировать оригинальный запрос
  const response = NextResponse.next();
  
  // Добавляем заголовки безопасности
  securityHeaders.forEach(({ key, value }) => {
    response.headers.set(key, value);
  });
  
  return response;
}

export const config = {
  matcher: [
    /*
     * Сопоставление всех путей, кроме:
     * 1. Все пути API (/api/*)
     * 2. Все статические файлы (/_next/static/*, /favicon.ico, и т.д.)
     */
    '/((?!api|_next/static|favicon.ico).*)',
  ],
};
```

## Пример улучшения аутентификации

```typescript
// src/lib/api/auth-service.ts
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, doc, setDoc, updateDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { getApp } from '@/lib/api/firebase';

// Максимальное количество неудачных попыток входа
const MAX_LOGIN_ATTEMPTS = 5;
// Время блокировки в миллисекундах (15 минут)
const LOCKOUT_DURATION = 15 * 60 * 1000;

export class AuthService {
  /**
   * Аутентификация пользователя с проверкой на блокировку по количеству попыток
   */
  static async signIn(email: string, password: string) {
    try {
      // Получаем инстанс Firebase
      const auth = getAuth(getApp());
      const db = getFirestore(getApp());
      
      // Нормализуем email для поиска
      const normalizedEmail = email.toLowerCase();
      
      // Проверяем, не заблокирован ли аккаунт
      const authAttemptsRef = doc(db, 'authAttempts', normalizedEmail);
      const attemptsDoc = await getDoc(authAttemptsRef);
      
      if (attemptsDoc.exists()) {
        const data = attemptsDoc.data();
        
        // Проверяем блокировку
        if (data.failedAttempts >= MAX_LOGIN_ATTEMPTS && 
            data.lastAttemptTime && 
            Date.now() - data.lastAttemptTime < LOCKOUT_DURATION) {
          throw new Error('Account temporarily locked. Try again later.');
        }
        
        // Если прошло достаточно времени с момента блокировки, сбрасываем счетчик
        if (data.failedAttempts >= MAX_LOGIN_ATTEMPTS && 
            data.lastAttemptTime && 
            Date.now() - data.lastAttemptTime >= LOCKOUT_DURATION) {
          await updateDoc(authAttemptsRef, {
            failedAttempts: 0,
            lastAttemptTime: serverTimestamp(),
          });
        }
      }
      
      // Пытаемся выполнить вход
      try {
        const userCredential = await signInWithEmailAndPassword(auth, normalizedEmail, password);
        
        // Сбрасываем счетчик неудачных попыток при успешном входе
        await setDoc(authAttemptsRef, {
          failedAttempts: 0,
          lastAttemptTime: serverTimestamp(),
          lastSuccessTime: serverTimestamp(),
        }, { merge: true });
        
        // Обновляем данные о последнем входе пользователя
        const userDocRef = doc(db, 'users', userCredential.user.uid);
        await updateDoc(userDocRef, {
          lastLoginAt: serverTimestamp(),
        });
        
        return userCredential.user;
      } catch (error) {
        // Увеличиваем счетчик неудачных попыток
        await setDoc(authAttemptsRef, {
          failedAttempts: (attemptsDoc.exists() ? attemptsDoc.data().failedAttempts || 0 : 0) + 1,
          lastAttemptTime: serverTimestamp(),
        }, { merge: true });
        
        throw error;
      }
    } catch (error) {
      console.error('Authentication error:', error);
      throw error;
    }
  }
  
  /**
   * Регистрация нового пользователя с валидацией пароля
   */
  static async signUp(email: string, password: string, name: string) {
    // Валидация пароля на силу
    if (!this.isStrongPassword(password)) {
      throw new Error('Password does not meet security requirements');
    }
    
    try {
      const auth = getAuth(getApp());
      const db = getFirestore(getApp());
      
      // Нормализуем email
      const normalizedEmail = email.toLowerCase();
      
      // Создаем пользователя
      const userCredential = await createUserWithEmailAndPassword(auth, normalizedEmail, password);
      
      // Создаем запись в БД с данными пользователя
      await setDoc(doc(db, 'users', userCredential.user.uid), {
        name,
        email: normalizedEmail,
        createdAt: serverTimestamp(),
        lastLoginAt: serverTimestamp(),
        role: 'user',
      });
      
      return userCredential.user;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  }
  
  /**
   * Проверка силы пароля
   */
  static isStrongPassword(password: string): boolean {
    // Минимальная длина 8 символов
    if (password.length < 8) return false;
    
    // Должен содержать минимум одну букву в нижнем регистре
    if (!/[a-z]/.test(password)) return false;
    
    // Должен содержать минимум одну букву в верхнем регистре
    if (!/[A-Z]/.test(password)) return false;
    
    // Должен содержать минимум одну цифру
    if (!/[0-9]/.test(password)) return false;
    
    // Должен содержать минимум один специальный символ
    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) return false;
    
    return true;
  }
}
```

## Рекомендации

1. **Применяйте принцип "Defense in Depth"** - используйте многоуровневую систему защиты
2. **Следуйте принципу минимальных привилегий** - предоставляйте доступ только к необходимым ресурсам
3. **Не доверяйте клиентским данным** - всегда проверяйте данные на сервере
4. **Регулярно обновляйте зависимости** - для устранения известных уязвимостей
5. **Используйте HTTPS повсеместно** - для защиты передаваемых данных
6. **Применяйте защитные заголовки HTTP** - для предотвращения распространенных атак
7. **Ведите аудит доступа** - для возможности расследования инцидентов

## Ожидаемый результат

- Улучшенный механизм аутентификации с защитой от подбора паролей
- Оптимизированные правила безопасности Firebase
- Внедренная защита от распространенных веб-уязвимостей
- Безопасное хранение и передача чувствительных данных
- Документированная политика безопасности
- Повышение общего уровня защищенности приложения

## Ресурсы

- [Firebase Security Rules](https://firebase.google.com/docs/rules)
- [OWASP Top Ten](https://owasp.org/www-project-top-ten/)
- [Content Security Policy](https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP)
- [Web Security Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Web_Security_Testing_Cheat_Sheet.html)

---

**Важно:** При выполнении задачи следуйте общему плану проекта, который находится в файле `/docs/tasks - stage2/dev-plan-stage2.md`. После выполнения задачи обновите статус в файле `/docs/tasks - stage2/status-stage2.md`. 