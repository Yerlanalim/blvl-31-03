# BizLevel - План Разработки (Development Plan)

Этот документ отслеживает прогресс разработки проекта BizLevel на основе предоставленных документов. Отмечайте задачи как выполненные, ставя галочку в чекбоксе.

**Важно:** Для каждой задачи в Cursor используйте соответствующий файл `task-X.Y-*.md` для получения инструкций и промта. После выполнения каждой задачи обновляйте этот файл (`development-plan.md`) и `status.md`.

**Ссылка на текущий статус:** `status.md`

---

## Этап 1: Инициализация и Базовая Настройка [x]

* [x] **task-1.1-initialize-nextjs.md**: Инициализация проекта Next.js
* [x] **task-1.2-install-dependencies.md**: Установка основных зависимостей (Firebase, React Query, RHF, Zod, sonner)
* [x] **task-1.3-setup-shadcn-ui.md**: Инициализация и настройка shadcn/ui
* [x] **task-1.4-setup-firebase-console.md**: Настройка проекта Firebase в консоли (Auth, Firestore, Storage)
* [x] **task-1.5-create-env-local.md**: Создание и настройка файла `.env.local`
* [x] **task-1.6-add-env-to-gitignore.md**: Добавление `.env.local` в `.gitignore`
* [x] **task-1.7-create-firebase-config.md**: Реализация файлов конфигурации Firebase (`src/lib/firebase/config.ts`, `index.ts`)
* [x] **task-1.8-setup-firestore-storage-rules.md**: Настройка базовых правил безопасности Firestore и Storage
* [x] **task-1.9-create-project-structure.md**: Создание базовой структуры директорий проекта
* [x] **task-1.10-setup-providers.md**: Настройка файла `src/app/providers.tsx` (QueryClientProvider, ThemeProvider, Toaster)
* [x] **task-1.11-integrate-providers.md**: Интеграция `Providers` в корневой `src/app/layout.tsx`

## Этап 2: Аутентификация [ ]

* [x] **task-2.1-setup-auth-context.md**: Создание `AuthContext` и `AuthProvider` (`src/context/AuthContext.tsx`)
* [x] **task-2.2-implement-auth-state-listener.md**: Реализация слушателя `onAuthStateChanged` в `AuthProvider`
* [x] **task-2.3-implement-auth-functions.md**: Реализация функций `login`, `register`, `logout`, `resetPassword` в `AuthProvider`
* [x] **task-2.4-integrate-authprovider.md**: Интеграция `AuthProvider` в `src/app/providers.tsx`
* [x] **task-2.5-create-useauth-hook.md**: Создание хука `useAuth` (`src/hooks/useAuth.ts`)
* [x] **task-2.6-create-auth-layout.md**: Создание макета для страниц аутентификации (`src/app/(auth)/layout.tsx`)
* [x] **task-2.7-create-auth-pages.md**: Создание страниц Login, Register, Reset Password
* [x] **task-2.8-implement-auth-forms.md**: Реализация компонентов форм (`LoginForm`, `RegisterForm`, `ResetPasswordForm`) с React Hook Form, Zod и shadcn/ui
* [x] **task-2.9-implement-protected-route-logic.md**: Реализация логики защиты роутов
* [x] **task-2.10-implement-auth-redirection.md**: Реализация редиректов для аутентифицированных/неаутентифицированных пользователей
* [x] **task-2.11-setup-firestore-user-creation.md**: Настройка создания записи пользователя в Firestore при регистрации

## Этап 3: Базовый Макет и Навигация [x]

* [x] **task-3.1-create-main-layout.md**: Создание компонента `MainLayout`
* [x] **task-3.2-create-layout-components.md**: Создание компонентов `Sidebar`, `Header` и `UserNav`
* [x] **task-3.3-integrate-main-layout.md**: Интеграция `MainLayout` в `src/app/(routes)/layout.tsx`
* [x] **task-3.4-implement-sidebar-navigation.md**: Реализация навигации в `Sidebar`
* [x] **task-3.5-setup-root-redirect.md**: Настройка редиректа с `/` на `/map` в `src/app/page.tsx`

## Этап 4: Профиль Пользователя и Настройки [x]

* [x] **task-4.1-create-settings-service.md**: Создание `settings-service.ts` для чтения/записи настроек пользователя
* [x] **task-4.2-create-usesettings-hook.md**: Создание хука `useSettings` с `useQuery` и `useMutation`
* [x] **task-4.3-create-profile-page.md**: Создание страницы `/profile`
* [x] **task-4.4-display-user-info-profile.md**: Отображение информации о пользователе на странице профиля
* [x] **task-4.5-create-settings-page.md**: Создание страницы `/settings`
* [x] **task-4.6-implement-settings-form.md**: Реализация формы для изменения `displayName`, `photoURL` и настроек
* [x] **task-4.7-integrate-usesettings.md**: Интеграция хука `useSettings` для загрузки и сохранения настроек

## Этап 5: Прогресс Пользователя и Уровни (Карта Уровней) [x]

* [x] **task-5.1-define-core-types.md**: Определение основных TypeScript типов
* [x] **task-5.2-create-firestore-service.md**: Создание `firestore.ts` с базовыми хелперами Firestore
* [x] **task-5.3-create-progress-service.md**: Создание `progress-service.ts` с функциями для работы с `userProgress/{userId}`
* [x] **task-5.4-create-level-service.md**: Создание `level-service.ts` для получения данных об уровнях
* [x] **task-5.5-create-useprogress-hook.md**: Создание хука `useProgress`
* [x] **task-5.6-create-uselevels-hook.md**: Создание хуков `useLevels` и `useLevel`
* [x] **task-5.7-create-levelmap-page.md**: Создание страницы Карты Уровней (`/map`)
* [x] **task-5.8-implement-levelmap-component.md**: Реализация компонента `LevelMap`
* [x] **task-5.9-integrate-levelmap-data.md**: Интеграция `useLevels` и `useProgress` в `LevelMap`
* [x] **task-5.10-create-level-detail-page.md**: Создание страницы Деталей Уровня (`/level/[levelId]`)
* [x] **task-5.11-implement-level-detail-component.md**: Реализация компонента `LevelDetail`
* [x] **task-5.12-integrate-level-actions.md**: Интеграция действий на странице уровня (прохождение теста, получение артефакта)
* [x] **task-5.13-implement-level-completion.md**: Реализация логики завершения уровня
* [x] **task-5.14-populate-firestore-levels.md**: Заполнение Firestore данными для тестовых уровней

## Этап 6: Управление Файлами и Артефактами

* [x] **task-6.1-create-storage-service.md**: Создание `storage.ts` для работы с Firebase Storage
* [x] **task-6.2-create-artifact-service.md**: Создание `artifact-service.ts` для управления артефактами
* [x] **task-6.3-create-useartifacts-hook.md**: Создание хука `useArtifacts`
* [x] **task-6.4-create-artifacts-page.md**: Создание страницы Артефактов (`/artifacts`)
* [x] **task-6.5-implement-artifacts-list.md**: Реализация списка артефактов
* [x] **task-6.6-implement-artifact-download-tracking.md**: Интеграция `markArtifactDownloaded` из `useProgress` при скачивании
* [x] **task-6.7-upload-sample-artifacts.md**: Загрузка тестовых артефактов в Firebase Storage и создание записей в Firestore

## Этап 7: Чат с AI [ ]

* [x] **task-7.1-create-chat-api-route.md**: Создание API Route для взаимодействия с OpenAI
* [x] **task-7.2-setup-openai-key.md**: Безопасная настройка ключа API OpenAI в `.env.local`
* [x] **task-7.3-create-chat-service.md**: Создание `chat-service.ts` для сохранения/загрузки истории чата
* [x] **task-7.4-create-usechat-hook.md**: Создание хука `useChat`
* [x] **task-7.5-create-chat-page.md**: Создание страницы Чата (`/chat`)
* [x] **task-7.6-implement-chat-components.md**: Реализация компонентов чата
* [x] **task-7.7-integrate-usechat.md**: Интеграция `useChat` для управления состоянием и взаимодействием чата

## Этап 8: FAQ [ ]

* [x] **task-8.1-create-faq-service.md**: Создание `faq-service.ts` для получения данных FAQ
* [x] **task-8.2-create-usefaqs-hook.md**: Создание хука `useFaqs`
* [x] **task-8.3-create-faq-page.md**: Создание страницы FAQ (`/faq`)
* [x] **task-8.4-implement-faq-list.md**: Реализация отображения списка вопросов и ответов
* [x] **task-8.5-populate-firestore-faq.md**: Заполнение Firestore тестовыми данными для FAQ

## Этап 9: Создание админ-панели для управления данными

* [x] **Задача 9.1:** Создать защищенный роут для админ-панели
* [x] **Задача 9.2:** Создание макета админ-панели
* [x] **Задача 9.3:** Реализация навигации в админ-панели
* [x] **Задача 9.4:** Создание страницы управления пользователями
* [x] **Задача 9.5:** Создание страницы управления уровнями
* [x] **Задача 9.6:** Создание страницы управления артефактами
* [x] **Задача 9.7:** Расширение модели пользователя для админ-ролей
* [x] **Задача 9.8:** Реализация CRUD-операций для уровней
* [x] **Задача 9.9:** Реализация CRUD-операций для артефактов
* [x] **Задача 9.10:** Настройка прямого взаимодействия с Firebase из админ-панели

## Этап 10: Тестирование и Оптимизация [ ]

* [ ] **task-10.1-setup-testing-environment.md**: Настройка среды тестирования (Vitest/Jest + RTL)
* [ ] **task-10.2-write-component-tests.md**: Написание юнит-тестов для ключевых компонентов
* [ ] **task-10.3-implement-ui-feedback.md**: Реализация обратной связи с пользователем (состояния загрузки, ошибки, тосты)
* [ ] **task-10.4-optimize-performance.md**: Оптимизация производительности (React Query caching, code splitting)
* [ ] **task-10.5-finalize-documentation.md**: Финализация `README.md` и другой документации
* [ ] **task-10.6-final-firebase-rules-review.md**: Финальный обзор и тестирование правил безопасности Firebase

---

**Примечание:** По мере выполнения задач обновляйте статус в данном документе и `status.md`. Используйте `[x]` для отметки выполненных задач.