# Задача 7.3: Создание `chat-service.ts`

## Описание
Создать сервисный слой для работы с чатом, который будет обеспечивать сохранение и загрузку истории сообщений из Firestore, а также отправку сообщений через API Route.


## Конкретные шаги для Cursor
1. Создать файл `src/lib/services/chat-service.ts`
2. Реализовать функции для работы с историей чата в Firestore
3. Реализовать функцию для отправки сообщений через API Route
4. Добавить типизацию для всех функций

## Промт для Cursor
```
Помоги мне создать сервисный слой для работы с чатом в проекте BizLevel.

Нам нужно создать файл `src/lib/services/chat-service.ts`, который будет обеспечивать сохранение и загрузку истории сообщений из Firestore, а также отправку сообщений через API Route.

На основе типов из `src/types/index.ts` и хелперов из `src/lib/firebase/firestore.ts`, реализуй следующие функции:

1. `getChatMessages(userId: string, limit: number = 50): Promise<Message[]>` - получение истории сообщений пользователя из Firestore
   - Получает документы из подколлекции `chats/{userId}/messages`, отсортированные по timestamp
   - Ограничивает количество сообщений параметром limit
   - Возвращает массив сообщений в формате `{ role: 'user' | 'assistant', content: string, timestamp: Date }`

2. `saveMessage(userId: string, message: { role: 'user' | 'assistant', content: string }): Promise<string>` - сохранение сообщения в Firestore
   - Добавляет новый документ в подколлекцию `chats/{userId}/messages`
   - Устанавливает timestamp с текущим временем
   - Возвращает ID созданного документа

3. `sendMessage(userId: string, message: string, history: Message[]): Promise<Message>` - отправка сообщения через API Route
   - Добавляет сообщение пользователя в историю
   - Вызывает API Route `/api/chat` с историей сообщений
   - Получает ответ от ассистента
   - Сохраняет сообщение пользователя и ответ ассистента в Firestore
   - Возвращает ответ ассистента

4. `clearChatHistory(userId: string): Promise<void>` - очистка истории чата
   - Удаляет все документы из подколлекции `chats/{userId}/messages`

Также реализуй следующие типы:
- `Message` - тип для сообщения чата (`{ role: 'user' | 'assistant', content: string, timestamp?: Date | FirebaseFirestore.Timestamp }`)
- `ChatHistory` - тип для истории чата (`Message[]`)

Все функции должны:
- Использовать хелперы из `firestore.ts` для работы с Firestore
- Быть типизированы с использованием TypeScript
- Обрабатывать потенциальные ошибки и возвращать понятные сообщения

Для отправки запросов к API Route используй fetch API.

Пожалуйста, создай файл `src/lib/services/chat-service.ts` с указанной функциональностью.

После выполнения задачи обнови status.md, указав, что задача 7.3 выполнена.
```

## Ожидаемый результат
- Созданный файл `src/lib/services/chat-service.ts`
- Реализованные функции для работы с историей чата:
  - `getChatMessages`
  - `saveMessage`
  - `sendMessage`
  - `clearChatHistory`
- Определенные типы для сообщений и истории чата
- Интеграция с Firestore для сохранения и загрузки истории
- Интеграция с API Route для отправки сообщений
- Обработка ошибок и возврат понятных сообщений
- Обновленный файл status.md с отметкой о выполнении задачи 7.3

## Связь с другими задачами
- Эта задача следует за задачей 7.2: Безопасная настройка ключа API OpenAI в `.env.local`
- После выполнения этой задачи следует перейти к задаче 7.4: Создание хука `useChat`

## Обновление progress-tracking
После выполнения задачи обновите файл development-plan.md, заменив `[ ]` на `[x]` для этой задачи:
```
* [x] **task-7.3-create-chat-service.md**: Создание `chat-service.ts` (`src/lib/services/`) для сохранения/загрузки истории чата
```
