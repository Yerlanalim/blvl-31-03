# Задача 7.4: Создание хука `useChat`

## Описание
Создать пользовательский хук `useChat` для работы с чатом, который будет использовать React Query для получения истории сообщений и мутации для отправки новых сообщений.


## Конкретные шаги для Cursor
1. Создать файл `src/hooks/useChat.ts`
2. Реализовать хук `useChat` с использованием `useQuery` для получения истории сообщений
3. Добавить мутации для отправки сообщений и очистки истории
4. Интегрировать функции из `chat-service.ts`

## Промт для Cursor
```
Помоги мне создать хук `useChat` для проекта BizLevel.

Нам нужно создать файл `src/hooks/useChat.ts`, который будет содержать хук для работы с чатом, используя React Query.

На основе функций из `chat-service.ts`, реализуй следующий хук:

1. `useChat(userId?: string)` - хук для работы с чатом:
   - Принимает необязательный параметр userId (если не передан, использует значение из useAuth)
   - Использует `useQuery` с ключом ['chatMessages', userId] для вызова `getChatMessages` из chat-service.ts
   - Возвращает объект с следующими свойствами:
     - `messages: Message[]` - история сообщений
     - `isLoading: boolean` - флаг загрузки истории
     - `error: Error | null` - ошибка загрузки (если есть)
     - `sendMessage: (message: string) => Promise<void>` - функция для отправки сообщения
     - `clearHistory: () => Promise<void>` - функция для очистки истории
     - `isSending: boolean` - флаг отправки сообщения
     - `sendError: Error | null` - ошибка отправки (если есть)

2. Для отправки сообщений используй `useMutation` с функцией `sendMessage` из chat-service.ts:
   - В onSuccess инвалидируй запрос ['chatMessages', userId]
   - Обрабатывай ошибки и показывай toast-уведомления
   - Для улучшения UX можно добавить оптимистическое обновление: сначала добавить сообщение пользователя в локальный state, затем отправить запрос, и при успехе добавить ответ ассистента

3. Для очистки истории используй `useMutation` с функцией `clearChatHistory` из chat-service.ts:
   - В onSuccess инвалидируй запрос ['chatMessages', userId]
   - Обрабатывай ошибки и показывай toast-уведомления

4. Используй хук `useAuth` для получения userId, если он не передан явно:
   ```typescript
   const { user } = useAuth();
   const userId = props.userId || user?.uid;
   ```

5. Добавь проверку на наличие userId и отключай запросы, если его нет:
   ```typescript
   const { data, isLoading, error } = useQuery(['chatMessages', userId], () => getChatMessages(userId!), {
     enabled: !!userId,
     staleTime: 1000 * 60, // 1 минута
   });
   ```

Все функции должны быть типизированы с использованием TypeScript и обрабатывать потенциальные ошибки.

Пожалуйста, создай файл `src/hooks/useChat.ts` с указанной функциональностью.

После выполнения задачи обнови status.md, указав, что задача 7.4 выполнена.
```

## Ожидаемый результат
- Созданный файл `src/hooks/useChat.ts`
- Реализованный хук `useChat` с использованием `useQuery` для получения истории сообщений
- Добавленные мутации для отправки сообщений и очистки истории
- Интеграция с функциями из `chat-service.ts`
- Использование хука `useAuth` для получения userId
- Обработка состояний загрузки и ошибок
- Обновленный файл status.md с отметкой о выполнении задачи 7.4

## Связь с другими задачами
- Эта задача следует за задачей 7.3: Создание `chat-service.ts`
- После выполнения этой задачи следует перейти к задаче 7.5: Создание страницы Чата (`/chat`)

## Обновление progress-tracking
После выполнения задачи обновите файл development-plan.md, заменив `[ ]` на `[x]` для этой задачи:
```
* [x] **task-7.4-create-usechat-hook.md**: Создание хука `useChat` (`src/hooks/useChat.ts`)
```
