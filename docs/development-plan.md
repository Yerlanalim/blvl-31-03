# BizLevel - План Разработки (Development Plan)

Этот документ отслеживает прогресс разработки проекта BizLevel на основе предоставленных документов. Отмечайте задачи как выполненные, ставя галочку в чекбоксе.

**Важно:** Для каждой задачи в Cursor используйте соответствующий файл `task-X.Y-*.md` для получения инструкций и промта. После выполнения каждой задачи обновляйте этот файл (`development-plan.md`) и `status.md`.

**Ссылка на текущий статус:** `status.md`

---

## Этап 1: Инициализация и Базовая Настройка [ ]

* [x] **task-1.1-initialize-nextjs.md**: Инициализация проекта Next.js
* [ ] **task-1.2-install-dependencies.md**: Установка основных зависимостей (Firebase, React Query, RHF, Zod, sonner)
* [ ] **task-1.3-setup-shadcn-ui.md**: Инициализация и настройка shadcn/ui
* [ ] **task-1.4-setup-firebase-console.md**: Настройка проекта Firebase в консоли (Auth, Firestore, Storage)
* [ ] **task-1.5-create-env-local.md**: Создание и настройка файла `.env.local`
* [ ] **task-1.6-add-env-to-gitignore.md**: Добавление `.env.local` в `.gitignore`
* [ ] **task-1.7-create-firebase-config.md**: Реализация файлов конфигурации Firebase (`src/lib/firebase/config.ts`, `index.ts`)
* [ ] **task-1.8-setup-firestore-storage-rules.md**: Настройка базовых правил безопасности Firestore и Storage
* [ ] **task-1.9-create-project-structure.md**: Создание базовой структуры директорий проекта
* [ ] **task-1.10-setup-providers.md**: Настройка файла `src/app/providers.tsx` (QueryClientProvider, ThemeProvider, Toaster)
* [ ] **task-1.11-integrate-providers.md**: Интеграция `Providers` в корневой `src/app/layout.tsx`

## Этап 2: Аутентификация [ ]

* [ ] **task-2.1-setup-auth-context.md**: Создание `AuthContext` и `AuthProvider` (`src/context/AuthContext.tsx`)
* [ ] **task-2.2-implement-auth-state-listener.md**: Реализация слушателя `onAuthStateChanged` в `AuthProvider`
* [ ] **task-2.3-implement-auth-functions.md**: Реализация функций `login`, `register`, `logout`, `resetPassword` в `AuthProvider`
* [ ] **task-2.4-integrate-authprovider.md**: Интеграция `AuthProvider` в `src/app/providers.tsx`
* [ ] **task-2.5-create-useauth-hook.md**: Создание хука `useAuth` (`src/hooks/useAuth.ts`)
* [ ] **task-2.6-create-auth-layout.md**: Создание макета для страниц аутентификации (`src/app/(auth)/layout.tsx`)
* [ ] **task-2.7-create-auth-pages.md**: Создание страниц Login, Register, Reset Password
* [ ] **task-2.8-implement-auth-forms.md**: Реализация компонентов форм (`LoginForm`, `RegisterForm`)
* [ ] **task-2.9-implement-protected-route-logic.md**: Реализация логики защиты роутов
* [ ] **task-2.10-implement-auth-redirection.md**: Реализация редиректов для аутентифицированных/неаутентифицированных пользователей
* [ ] **task-2.11-setup-firestore-user-creation.md**: Настройка создания записи пользователя в Firestore при регистрации

## Этап 3: Базовый Макет и Навигация [ ]

* [ ] **task-3.1-create-main-layout-component.md**: Создание компонента `MainLayout`
* [ ] **task-3.2-create-layout-components.md**: Создание компонентов `Sidebar`, `Header`, `UserNav`
* [ ] **task-3.3-integrate-main-layout.md**: Интеграция `MainLayout` в `src/app/(routes)/layout.tsx`
* [ ] **task-3.4-implement-sidebar-navigation.md**: Реализация навигации в `Sidebar`
* [ ] **task-3.5-setup-root-redirect.md**: Настройка редиректа с `/` на `/map` в `src/app/page.tsx`

## Этап 4: Профиль Пользователя и Настройки [ ]

* [ ] **task-4.1-create-settings-service.md**: Создание `settings-service.ts` для чтения/записи настроек пользователя
* [ ] **task-4.2-create-usesettings-hook.md**: Создание хука `useSettings` с `useQuery` и `useMutation`
* [ ] **task-4.3-create-profile-page.md**: Создание страницы `/profile`
* [ ] **task-4.4-display-user-info-profile.md**: Отображение информации о пользователе на странице профиля
* [ ] **task-4.5-create-settings-page.md**: Создание страницы `/settings`
* [ ] **task-4.6-implement-settings-form.md**: Реализация формы для изменения `displayName`, `photoURL` и настроек
* [ ] **task-4.7-integrate-usesettings.md**: Интеграция хука `useSettings` для загрузки и сохранения настроек

## Этап 5: Прогресс Пользователя и Уровни (Карта Уровней) [ ]

* [ ] **task-5.1-define-core-types.md**: Определение основных TypeScript типов
* [ ] **task-5.2-create-firestore-service.md**: Создание `firestore.ts` с базовыми хелперами Firestore
* [ ] **task-5.3-create-progress-service.md**: Создание `progress-service.ts` с функциями для работы с `userProgress/{userId}`
* [ ] **task-5.4-create-level-service.md**: Создание `level-service.ts` для получения данных об уровнях
* [ ] **task-5.5-create-useprogress-hook.md**: Создание хука `useProgress`
* [ ] **task-5.6-create-uselevels-hook.md**: Создание хуков `useLevels` и `useLevel`
* [ ] **task-5.7-create-levelmap-page.md**: Создание страницы Карты Уровней (`/map`)
* [ ] **task-5.8-implement-levelmap-component.md**: Реализация компонента `LevelMap`
* [ ] **task-5.9-integrate-levelmap-data.md**: Интеграция `useLevels` и `useProgress` в `LevelMap`
* [ ] **task-5.10-create-level-detail-page.md**: Создание страницы Деталей Уровня (`/level/[levelId]`)
* [ ] **task-5.11-implement-level-detail-view.md**: Реализация отображения контента уровня
* [ ] **task-5.12-implement-level-actions.md**: Реализация действий на странице уровня
* [ ] **task-5.13-implement-level-completion.md**: Реализация логики завершения уровня
* [ ] **task-5.14-populate-firestore-levels.md**: Заполнение Firestore данными для тестовых уровней

## Этап 6: Артефакты [ ]

* [ ] **task-6.1-create-storage-service.md**: Создание `storage.ts` для работы с Firebase Storage
* [ ] **task-6.2-create-artifact-service.md**: Создание `artifact-service.ts` для получения данных об артефактах
* [ ] **task-6.3-create-useartifacts-hook.md**: Создание хука `useArtifacts`
* [ ] **task-6.4-create-artifacts-page.md**: Создание страницы Артефактов (`/artifacts`)
* [ ] **task-6.5-implement-artifacts-list.md**: Реализация списка артефактов с возможностью скачивания
* [ ] **task-6.6-implement-artifact-download-tracking.md**: Интеграция `markArtifactDownloaded` из `useProgress` при скачивании
* [ ] **task-6.7-upload-sample-artifacts.md**: Загрузка тестовых артефактов в Firebase Storage и создание записей в Firestore

## Этап 7: Чат с AI [ ]

* [ ] **task-7.1-create-chat-api-route.md**: Создание API Route для взаимодействия с OpenAI
* [ ] **task-7.2-setup-openai-key.md**: Безопасная настройка ключа API OpenAI в `.env.local`
* [ ] **task-7.3-create-chat-service.md**: Создание `chat-service.ts` для сохранения/загрузки истории чата
* [ ] **task-7.4-create-usechat-hook.md**: Создание хука `useChat`
* [ ] **task-7.5-create-chat-page.md**: Создание страницы Чата (`/chat`)
* [ ] **task-7.6-implement-chat-components.md**: Реализация компонентов чата
* [ ] **task-7.7-integrate-usechat.md**: Интеграция `useChat` для управления состоянием и взаимодействием чата

## Этап 8: FAQ [ ]

* [ ] **task-8.1-create-faq-service.md**: Создание `faq-service.ts` для получения данных FAQ
* [ ] **task-8.2-create-usefaqs-hook.md**: Создание хука `useFaqs`
* [ ] **task-8.3-create-faq-page.md**: Создание страницы FAQ (`/faq`)
* [ ] **task-8.4-implement-faq-list.md**: Реализация отображения списка вопросов и ответов
* [ ] **task-8.5-populate-firestore-faq.md**: Заполнение Firestore тестовыми данными для FAQ

## Этап 9: Админ-панель [ ]

* [ ] **task-9.1-setup-admin-route.md**: Создание защищенного роута для админ-панели (`/admin`)
* [ ] **task-9.2-create-admin-layout.md**: Создание макета админ-панели
* [ ] **task-9.3-implement-admin-navigation.md**: Реализация навигации в админ-панели
* [ ] **task-9.4-create-user-management.md**: Создание страницы управления пользователями
* [ ] **task-9.5-create-level-management.md**: Создание страницы управления уровнями
* [ ] **task-9.6-create-artifact-management.md**: Создание страницы управления артефактами
* [ ] **task-9.7-implement-user-crud.md**: Реализация CRUD-операций для пользователей
* [ ] **task-9.8-implement-level-crud.md**: Реализация CRUD-операций для уровней
* [ ] **task-9.9-implement-artifact-crud.md**: Реализация CRUD-операций для артефактов
* [ ] **task-9.10-implement-firebase-direct-integration.md**: Настройка прямого взаимодействия с Firebase из админ-панели

## Этап 10: Тестирование и Оптимизация [ ]

* [ ] **task-10.1-setup-testing-environment.md**: Настройка среды тестирования (Vitest/Jest + RTL)
* [ ] **task-10.2-write-component-tests.md**: Написание юнит-тестов для ключевых компонентов
* [ ] **task-10.3-implement-ui-feedback.md**: Реализация обратной связи с пользователем (состояния загрузки, ошибки, тосты)
* [ ] **task-10.4-optimize-performance.md**: Оптимизация производительности (React Query caching, code splitting)
* [ ] **task-10.5-finalize-documentation.md**: Финализация `README.md` и другой документации
* [ ] **task-10.6-final-firebase-rules-review.md**: Финальный обзор и тестирование правил безопасности Firebase

---

**Примечание:** По мере выполнения задач обновляйте статус в данном документе и `status.md`. Используйте `[x]` для отметки выполненных задач.
