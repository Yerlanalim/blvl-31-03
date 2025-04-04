# Задача 5.12: Реализация действий на странице уровня

## Описание
Реализовать функциональность действий на странице уровня: просмотр видео, прохождение тестов, скачивание артефактов с вызовом соответствующих мутаций из хука `useProgress`.

## Ссылки на документацию
docs/bizlevel-project-context.md
docs/status.md

## Конкретные шаги для Cursor
1. Обновить компонент `VideoSection.tsx` для реализации функциональности просмотра видео
2. Обновить компонент `TestSection.tsx` для реализации функциональности прохождения тестов
3. Обновить компонент `ArtifactSection.tsx` для реализации функциональности скачивания артефактов
4. Интегрировать мутации из хука `useProgress` для отслеживания прогресса

## Промт для Cursor
```
Помоги мне реализовать функциональность действий на странице уровня для проекта BizLevel.

Нам нужно обновить компоненты, созданные в предыдущей задаче, чтобы они не только отображали контент, но и позволяли пользователю выполнять действия (просмотр видео, прохождение тестов, скачивание артефактов) с вызовом соответствующих мутаций из хука `useProgress`.

1. Обнови компонент `src/components/features/Level/VideoSection.tsx`:
   - Добавь простой видеоплеер (можно использовать HTML-элемент video или iframe для YouTube/Vimeo)
   - Добавь событие onEnded для видео, которое будет автоматически отмечать видео как просмотренное
   - Добавь кнопку "Отметить как просмотренное" для ручной отметки
   - Используй функцию onVideoWatch для вызова мутации markVideoWatched из useProgress

2. Обнови компонент `src/components/features/Level/TestSection.tsx`:
   - Добавь заглушку для прохождения теста (просто кнопку "Пройти тест", которая открывает диалоговое окно)
   - В диалоговом окне (используй Dialog из shadcn/ui) показывай упрощенную версию теста (просто несколько вопросов с вариантами ответов)
   - Добавь кнопку "Завершить тест", которая будет отмечать тест как пройденный
   - Используй функцию onTestComplete для вызова мутации markTestCompleted из useProgress

3. Обнови компонент `src/components/features/Level/ArtifactSection.tsx`:
   - Добавь компонент для отображения информации об артефакте (название, описание, тип файла)
   - Добавь кнопку "Скачать", которая будет имитировать скачивание артефакта (пока без реального скачивания)
   - После "скачивания" вызывай функцию onArtifactDownload для отметки артефакта как скачанного
   - Используй функцию onArtifactDownload для вызова мутации markArtifactDownloaded из useProgress

4. Обнови страницу `src/app/(routes)/level/[levelId]/page.tsx`:
   - Реализуй функции-обработчики для передачи в компоненты:
     - handleVideoWatch(videoId: string) - для отметки видео как просмотренного
     - handleTestComplete(testId: string) - для отметки теста как пройденного
     - handleArtifactDownload(artifactId: string) - для отметки артефакта как скачанного
   - Используй мутации из хука useProgress для вызова соответствующих функций из progress-service.ts
   - Добавь обработку состояний загрузки и ошибок при выполнении мутаций
   - Добавь toast-уведомления для обратной связи пользователю

Все действия должны корректно обновлять состояние прогресса пользователя и отображать актуальную информацию о статусе (просмотрено, пройден, скачан).

Пожалуйста, обнови указанные компоненты и страницу деталей уровня.

После выполнения задачи обнови status.md, указав, что задача 5.12 выполнена.
```

## Ожидаемый результат
- Обновленные компоненты:
  - `VideoSection.tsx` с функциональностью просмотра видео
  - `TestSection.tsx` с функциональностью прохождения тестов
  - `ArtifactSection.tsx` с функциональностью скачивания артефактов
- Интеграция мутаций из хука `useProgress` для отслеживания прогресса
- Обработка состояний загрузки и ошибок
- Toast-уведомления для обратной связи
- Обновленный файл status.md с отметкой о выполнении задачи 5.12

## Связь с другими задачами
- Эта задача следует за задачей 5.11: Реализация отображения контента уровня
- После выполнения этой задачи следует перейти к задаче 5.13: Реализация логики завершения уровня

## Обновление progress-tracking
После выполнения задачи обновите файл development-plan.md, заменив `[ ]` на `[x]` для этой задачи:
```
* [x] **task-5.12-implement-level-actions.md**: Реализация действий на странице уровня (просмотр видео, прохождение теста) с вызовом мутаций из `useProgress`
```
