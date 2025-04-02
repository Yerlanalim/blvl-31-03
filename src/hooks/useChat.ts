'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useAuth } from './useAuth';
import { useEffect, useState, useMemo } from 'react';
import {
  getChatMessages,
  sendMessage as sendChatMessage,
  clearChatHistory,
  Message,
  ChatHistory
} from '@/lib/services/chat-service';

/**
 * Хук для работы с чатом
 * @param userId - ID пользователя (опционально, если не передан, использует текущего пользователя)
 * @returns Объект с историей сообщений, функциями для отправки сообщений и очистки истории
 */
export const useChat = (userId?: string) => {
  const { user, loading } = useAuth();
  const effectiveUserId = userId || user?.uid;
  const queryClient = useQueryClient();
  const [optimisticMessages, setOptimisticMessages] = useState<Message[]>([]);
  const [retryCount, setRetryCount] = useState(0);
  
  // Автоматическая загрузка истории чата при входе пользователя
  useEffect(() => {
    if (user && !loading) {
      queryClient.invalidateQueries({ queryKey: ['chatMessages', user.uid] });
    }
  }, [user, loading, queryClient]);
  
  // Запрос для получения истории сообщений
  const {
    data: serverMessages = [],
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['chatMessages', effectiveUserId],
    queryFn: () => {
      if (!effectiveUserId) {
        throw new Error('Пользователь не аутентифицирован');
      }
      return getChatMessages(effectiveUserId);
    },
    enabled: !!effectiveUserId && !loading,
    staleTime: 1000 * 30, // 30 секунд кеширования
    retry: 3, // Повторять запрос при ошибке до 3 раз
    retryDelay: attempt => Math.min(1000 * 2 ** attempt, 10000), // Экспоненциальная задержка
    onSuccess: () => {
      // Очистить оптимистические сообщения при успешном получении с сервера
      setOptimisticMessages([]);
      setRetryCount(0);
    },
    onError: (error) => {
      console.error('Error fetching chat messages:', error);
      // Увеличиваем счетчик повторных попыток
      setRetryCount(prev => prev + 1);
      
      // После 3-х неудачных попыток показываем ошибку пользователю
      if (retryCount >= 3) {
        toast.error(`Ошибка загрузки истории чата: ${(error as Error).message}`);
      }
    }
  });
  
  // Объединяем сообщения с сервера и оптимистические обновления
  // Добавляем дедупликацию для предотвращения дублирования сообщений
  const messages = useMemo(() => {
    const combinedMessages = [...serverMessages, ...optimisticMessages];
    
    // Создаем Map для хранения уникальных сообщений, где ключом будет роль + содержимое + временная метка
    const uniqueMessages = new Map();
    
    // Проходим по сообщениям в обратном порядке (от новых к старым)
    // чтобы при дубликатах сохранялись самые свежие версии
    for (let i = combinedMessages.length - 1; i >= 0; i--) {
      const msg = combinedMessages[i];
      // Создаем уникальный ключ из роли и содержимого
      const key = `${msg.role}-${msg.content}`;
      
      // Добавляем сообщение в Map, если его еще нет
      if (!uniqueMessages.has(key)) {
        uniqueMessages.set(key, msg);
      }
    }
    
    // Возвращаем массив уникальных сообщений в правильном порядке (от старых к новым)
    // Добавляем проверку наличия идентификатора и timestamp для более надежной сортировки
    return Array.from(uniqueMessages.values()).sort((a, b) => {
      // Если у сообщений есть идентификаторы из базы данных, используем их для сортировки
      if ('id' in a && 'id' in b) {
        return String(a.id).localeCompare(String(b.id));
      }
      
      // Если есть временные метки, используем их
      const timeA = a.timestamp instanceof Date ? a.timestamp.getTime() : 
                   typeof a.timestamp === 'number' ? a.timestamp : 0;
      const timeB = b.timestamp instanceof Date ? b.timestamp.getTime() : 
                   typeof b.timestamp === 'number' ? b.timestamp : 0;
      
      if (timeA !== 0 && timeB !== 0) {
        return timeA - timeB;
      }
      
      // Если ничего нет, сохраняем исходный порядок
      return 0;
    });
  }, [serverMessages, optimisticMessages]);

  useEffect(() => {
    // При изменении serverMessages, проверяем, нужно ли очистить оптимистические сообщения
    if (serverMessages.length > 0 && optimisticMessages.length > 0) {
      // Если в serverMessages есть последнее оптимистическое сообщение ассистента,
      // значит, оно уже сохранено в базе данных и нам нужно очистить optimisticMessages
      const lastOptimisticAssistantMsg = optimisticMessages.find(msg => msg.role === 'assistant');
      if (lastOptimisticAssistantMsg) {
        const isAlreadySaved = serverMessages.some(msg => 
          msg.role === 'assistant' && 
          msg.content === lastOptimisticAssistantMsg.content
        );
        
        if (isAlreadySaved) {
          setOptimisticMessages([]);
        }
      }
    }
  }, [serverMessages, optimisticMessages]);
  
  // Мутация для отправки сообщения
  const {
    mutate: send,
    isPending: isSending,
    error: sendError,
    reset: resetSendStatus
  } = useMutation({
    mutationFn: async (messageText: string) => {
      if (!effectiveUserId) {
        throw new Error('Пользователь не аутентифицирован');
      }
      
      // Оптимистическое обновление - добавляем сообщение пользователя сразу
      const userMessage: Message = {
        role: 'user',
        content: messageText,
        timestamp: new Date()
      };
      
      // Добавляем временную заглушку для ответа ассистента
      const tempAssistantMessage: Message = {
        role: 'assistant',
        content: '...',
        timestamp: new Date()
      };
      
      // Обновляем UI оптимистически
      setOptimisticMessages([userMessage, tempAssistantMessage]);
      
      // Попытки отправки сообщения с повторами при таймауте
      let attempts = 0;
      const maxAttempts = 3;
      
      while (attempts < maxAttempts) {
        try {
          // Отправляем сообщение и получаем ответ ассистента
          const response = await sendChatMessage(effectiveUserId, messageText, serverMessages);
          
          // Заменяем временную заглушку на реальный ответ
          setOptimisticMessages([userMessage, response]);
          
          return response;
        } catch (error) {
          attempts++;
          
          // Если это последняя попытка или ошибка не связана с таймаутом, выбрасываем исключение
          if (attempts >= maxAttempts || !(error instanceof Error) || 
              (!error.message.includes('408') && !error.message.includes('timeout') && !error.message.includes('aborted'))) {
            throw error;
          }
          
          // Обновляем состояние ожидания для пользователя
          setOptimisticMessages([
            userMessage, 
            { 
              role: 'assistant', 
              content: `Пробую подключиться к серверу... Попытка ${attempts} из ${maxAttempts}`, 
              timestamp: new Date() 
            }
          ]);
          
          // Ждем перед повторной попыткой (экспоненциальная задержка)
          await new Promise(resolve => setTimeout(resolve, 1000 * (2 ** attempts)));
        }
      }
      
      // Если все попытки не удались, выбрасываем исключение
      throw new Error('Не удалось отправить сообщение после нескольких попыток');
    },
    onSuccess: () => {
      // После небольшой задержки инвалидируем запрос истории для подгрузки реальных данных с сервера
      setTimeout(() => {
        queryClient.invalidateQueries({ queryKey: ['chatMessages', effectiveUserId] });
      }, 1000);
    },
    onError: (error) => {
      // Обновляем сообщение об ошибке, сохраняя сообщение пользователя
      const userMessage: Message = {
        role: 'user',
        content: messageText,
        timestamp: new Date()
      };
      
      // Показываем сообщение пользователя, но с уведомлением об ошибке
      setOptimisticMessages([userMessage]);
      
      // Определяем тип ошибки для более информативного сообщения
      let errorMessage = `Ошибка отправки сообщения: ${(error as Error).message}`;
      
      if ((error as Error).message.includes('408') || 
          (error as Error).message.includes('timeout') || 
          (error as Error).message.includes('aborted')) {
        errorMessage = 'Превышено время ожидания ответа от сервера. Пожалуйста, попробуйте еще раз.';
      }
      
      toast.error(errorMessage);
      toast.info('Попробуйте отправить сообщение еще раз или обновите страницу');
    }
  });

  // Мутация для очистки истории чата
  const {
    mutate: clear,
    isPending: isClearing,
    error: clearError,
    reset: resetClearStatus
  } = useMutation({
    mutationFn: async () => {
      if (!effectiveUserId) {
        throw new Error('Пользователь не аутентифицирован');
      }
      
      // Очищаем историю чата
      return clearChatHistory(effectiveUserId);
    },
    onSuccess: () => {
      // Очищаем оптимистические сообщения
      setOptimisticMessages([]);
      
      // Инвалидируем запрос истории сообщений для обновления
      queryClient.invalidateQueries({ queryKey: ['chatMessages', effectiveUserId] });
      toast.success('История чата очищена');
    },
    onError: (error) => {
      toast.error(`Ошибка очистки истории: ${(error as Error).message}`);
    }
  });

  // Функция-обертка для отправки сообщения
  const sendMessage = async (messageText: string): Promise<void> => {
    if (!messageText.trim()) {
      return; // Не отправляем пустые сообщения
    }
    
    try {
      send(messageText);
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  // Функция-обертка для очистки истории
  const clearHistory = async (): Promise<void> => {
    try {
      // Очищаем оптимистические сообщения перед отправкой запроса
      setOptimisticMessages([]);
      clear();
    } catch (error) {
      console.error('Error clearing chat history:', error);
    }
  };

  // Функция для ручного обновления истории чата
  const refreshChat = () => {
    queryClient.invalidateQueries({ queryKey: ['chatMessages', effectiveUserId] });
    refetch();
  };

  return {
    messages, // Комбинированные сообщения (серверные + оптимистические)
    isLoading: isLoading || loading,
    error,
    sendMessage,
    clearHistory,
    isSending,
    sendError,
    isClearing,
    clearError,
    refreshChat // Новая функция для ручного обновления
  };
}; 