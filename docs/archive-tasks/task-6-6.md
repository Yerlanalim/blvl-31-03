# Задача 6.6: Интеграция `markArtifactDownloaded` из `useProgress`

## Описание
Реализовать функциональность скачивания артефактов с отслеживанием загрузок в Firebase, обновлением счетчика скачиваний и интеграцией с прогрессом пользователя.

## Конкретные шаги для Cursor
1. Обновить компонент `ArtifactCard.tsx` для реализации полной функциональности скачивания
2. Интегрировать хук `useDownloadArtifact` из `useArtifacts.ts`
3. Интегрировать функцию `markArtifactDownloaded` из хука `useProgress`
4. Реализовать обновление счетчика скачиваний в Firebase

## Промт для Cursor
```
Помоги мне реализовать функциональность скачивания артефактов с отслеживанием в проекте BizLevel.

Нам нужно обновить компоненты для артефактов и интегрировать хуки, чтобы реализовать полную функциональность скачивания артефактов с отслеживанием в Firebase:

1. Обнови компонент `src/components/features/Artifacts/ArtifactCard.tsx`:
   - Добавь функциональность для скачивания файла по URL
   - Реализуй отображение состояния загрузки во время скачивания
   - Добавь анимацию или индикатор успешного скачивания
   - Обнови визуальное состояние карточки, если артефакт уже скачан (из props isDownloaded)

2. Создай компонент-обертку `src/components/features/Artifacts/DownloadableArtifactCard.tsx`:
   - Компонент должен использовать хук useDownloadArtifact из useArtifacts.ts
   - Должен проверять, скачан ли артефакт, используя данные из useProgress
   - При скачивании должен вызывать следующие функции:
     - incrementArtifactDownloadCount для увеличения счетчика скачиваний
     - markArtifactDownloaded из useProgress для отметки в прогрессе пользователя
   - Должен обрабатывать ошибки и показывать соответствующие уведомления

3. Обнови компонент `src/components/features/Artifacts/ArtifactsList.tsx`:
   - Используй DownloadableArtifactCard вместо прямого использования ArtifactCard
   - Передавай все необходимые данные в компонент-обертку

4. Обнови страницу `/artifacts` (`src/app/(routes)/artifacts/page.tsx`):
   - Используй хук useProgress для получения данных о прогрессе пользователя
   - Передавай необходимые функции и данные в ArtifactsList

5. Добавь в хук `useDownloadArtifact` в `src/hooks/useArtifacts.ts` (если еще не добавлено):
   - Логику для фактического скачивания файла (создание временной ссылки и инициирование скачивания)
   - Интеграцию с функциями markArtifactDownloaded и incrementArtifactDownloadCount
   - Обработку ошибок и состояний загрузки

Обрати внимание на следующие моменты:
- Скачивание файла должно происходить в браузере пользователя
- После скачивания должны обновляться счетчики и прогресс
- Пользователь должен получать визуальную обратную связь о процессе и результате скачивания
- Данные об артефактах и прогрессе должны быть актуализированы после скачивания

Пожалуйста, обнови указанные компоненты и создай новые, если необходимо.

После выполнения задачи обнови status.md, указав, что задача 6.6 выполнена.
```

## Ожидаемый результат
- Обновленный компонент `ArtifactCard.tsx` с полной функциональностью скачивания
- Созданный компонент `DownloadableArtifactCard.tsx` для интеграции с хуками
- Обновленный компонент `ArtifactsList.tsx` с использованием `DownloadableArtifactCard`
- Обновленная страница артефактов с интеграцией хука `useProgress`
- Реализованное скачивание файлов с отслеживанием в Firebase
- Обновление счетчика скачиваний и прогресса пользователя
- Визуальная обратная связь о процессе и результате скачивания
- Обновленный файл status.md с отметкой о выполнении задачи 6.6

## Связь с другими задачами
- Эта задача следует за задачей 6.5: Реализация списка артефактов
- После выполнения этой задачи следует перейти к задаче 6.7: Загрузка тестовых артефактов

## Обновление progress-tracking
После выполнения задачи обновите файл development-plan.md, заменив `[ ]` на `[x]` для этой задачи:
```
* [x] **task-6.6-implement-artifact-download-tracking.md**: Интеграция `markArtifactDownloaded` из `useProgress` при скачивании
```
