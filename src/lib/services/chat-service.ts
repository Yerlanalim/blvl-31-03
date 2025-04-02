import { 
  getSubcollectionDocuments, 
  createDocument, 
  deleteDocument,
  CHATS_COLLECTION,
  MESSAGES_SUBCOLLECTION,
} from '@/lib/firebase/firestore';
import { collection, getDocs, orderBy, query, limit, Timestamp, serverTimestamp } from 'firebase/firestore';
import { getFirestore } from 'firebase/firestore';
import { app } from '@/lib/firebase/config';

// Get Firestore instance
const firestore = getFirestore(app);

/**
 * Types for messages and chat history
 */
export interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp?: Date | Timestamp;
}

export interface ChatHistory extends Array<Message> {}

/**
 * Get chat messages for a user
 * @param userId - User ID
 * @param messageLimit - Maximum number of messages to retrieve (default: 50)
 * @returns Promise with array of messages
 */
export const getChatMessages = async (
  userId: string, 
  messageLimit: number = 50
): Promise<Message[]> => {
  try {
    // Create reference to messages subcollection
    const messagesRef = collection(
      firestore, 
      CHATS_COLLECTION, 
      userId, 
      MESSAGES_SUBCOLLECTION
    );
    
    // Create query with ordering and limit
    const messagesQuery = query(
      messagesRef,
      orderBy('timestamp', 'asc'),
      limit(messageLimit)
    );
    
    // Get documents
    const querySnapshot = await getDocs(messagesQuery);
    
    // Map documents to Message objects
    const messages = querySnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        role: data.role,
        content: data.content,
        timestamp: data.timestamp && typeof data.timestamp.toDate === 'function' 
          ? data.timestamp.toDate() 
          : data.timestamp // Return as is if not a Firestore timestamp
      };
    });
    
    // Дедупликация сообщений (удаление дубликатов)
    const uniqueMessages = new Map();
    
    // Проходим по сообщениям в обратном порядке (от новых к старым)
    // чтобы при дубликатах сохранялись самые свежие версии
    for (let i = messages.length - 1; i >= 0; i--) {
      const msg = messages[i];
      // Создаем уникальный ключ из роли и содержимого
      const key = `${msg.role}-${msg.content}`;
      
      // Добавляем сообщение в Map, если его еще нет
      if (!uniqueMessages.has(key)) {
        uniqueMessages.set(key, msg);
      }
    }
    
    // Возвращаем массив уникальных сообщений в правильном порядке (от старых к новым)
    return Array.from(uniqueMessages.values()).sort((a, b) => {
      // Если у сообщений есть идентификаторы из базы данных, используем их для сортировки
      if ('id' in a && 'id' in b) {
        return String(a.id).localeCompare(String(b.id));
      }
      
      // Сортировка по временным меткам, с проверкой типов
      const timeA = a.timestamp instanceof Date ? a.timestamp.getTime() : 
                   a.timestamp && typeof a.timestamp.toDate === 'function' ? a.timestamp.toDate().getTime() :
                   typeof a.timestamp === 'number' ? a.timestamp : 0;
                   
      const timeB = b.timestamp instanceof Date ? b.timestamp.getTime() : 
                   b.timestamp && typeof b.timestamp.toDate === 'function' ? b.timestamp.toDate().getTime() :
                   typeof b.timestamp === 'number' ? b.timestamp : 0;
      
      if (timeA !== 0 && timeB !== 0) {
        return timeA - timeB;
      }
      
      // Если ничего нет, сохраняем исходный порядок
      return 0;
    });
    
  } catch (error) {
    console.error('Error getting chat messages:', error);
    throw new Error(`Failed to retrieve chat messages: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

/**
 * Save a message to Firestore
 * @param userId - User ID
 * @param message - Message to save
 * @returns Promise with message ID
 */
export const saveMessage = async (
  userId: string, 
  message: { role: 'user' | 'assistant'; content: string }
): Promise<string> => {
  try {
    // Create path for the message
    const collectionPath = `${CHATS_COLLECTION}/${userId}/${MESSAGES_SUBCOLLECTION}`;
    
    // Create message object with timestamp
    const messageData = {
      ...message,
      timestamp: serverTimestamp()
    };
    
    // Save document and return ID
    const messageId = await createDocument(collectionPath, messageData);
    return messageId;
  } catch (error) {
    console.error('Error saving chat message:', error);
    throw new Error(`Failed to save chat message: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

/**
 * Send a message to the AI assistant and save both user message and assistant response
 * @param userId - User ID
 * @param message - User message text
 * @param history - Chat history
 * @returns Promise with assistant's response message
 */
export const sendMessage = async (
  userId: string, 
  message: string, 
  history: Message[]
): Promise<Message> => {
  try {
    // Проверка на дублирование: если последнее сообщение пользователя такое же - не отправляем снова
    const lastUserMessage = [...history].reverse().find(msg => msg.role === 'user');
    if (lastUserMessage && lastUserMessage.content === message) {
      console.log('Duplicate message detected, skipping send');
      
      // Если есть ответ ассистента после этого сообщения, возвращаем его
      const lastAssistantMessage = [...history].reverse().find(msg => msg.role === 'assistant');
      if (lastAssistantMessage) {
        return lastAssistantMessage;
      }
    }
    
    // Create user message with current timestamp for immediate display
    const userMessage: Message = {
      role: 'user',
      content: message,
      timestamp: new Date() // Use client-side timestamp for immediate UI update
    };
    
    // Save user message to Firestore (don't await to avoid blocking)
    const saveUserMessagePromise = saveMessage(userId, userMessage);
    
    // Prepare message history for API request
    // Only include the last 20 messages to keep context manageable and reduce payload size
    const recentHistory = [...history].slice(-20);
    const messages = [...recentHistory, userMessage].map(({ role, content }) => ({
      role,
      content
    }));
    
    // Set timeout for API request to prevent hanging requests
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 60000); // Increased to 60-second timeout
    
    try {
      // Send request to API with abort signal
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ messages }),
        signal: controller.signal
      });
      
      clearTimeout(timeoutId); // Clear timeout if request completed
      
      if (!response.ok) {
        const errorText = await response.text().catch(() => '');
        throw new Error(`API request failed with status ${response.status}${errorText ? ': ' + errorText : ''}`);
      }
      
      const data = await response.json().catch(() => {
        throw new Error('Failed to parse API response');
      });
      
      // Wait for user message to complete saving before proceeding
      await saveUserMessagePromise;
      
      // Extract assistant message
      const assistantMessage: Message = {
        ...data.message,
        timestamp: new Date() // Add client timestamp
      };
      
      // Проверка на дублирование: если последнее сообщение ассистента такое же - не сохраняем снова
      const lastAssistantInHistory = [...history].reverse().find(msg => msg.role === 'assistant');
      if (lastAssistantInHistory && lastAssistantInHistory.content === assistantMessage.content) {
        console.log('Duplicate assistant response detected, skipping save');
        return assistantMessage;
      }
      
      // Save assistant message to Firestore
      await saveMessage(userId, assistantMessage);
      
      return assistantMessage;
    } catch (error) {
      // Make sure user message is saved even if API call fails
      await saveUserMessagePromise;
      throw error;
    }
  } catch (error) {
    console.error('Error sending message to assistant:', error);
    throw new Error(`Failed to send message: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

/**
 * Clear chat history for a user
 * @param userId - User ID
 * @returns Promise that resolves when all messages are deleted
 */
export const clearChatHistory = async (userId: string): Promise<void> => {
  try {
    // Get all messages
    const messages = await getChatMessages(userId, 1000); // Use a large limit to get all messages
    
    // Delete each message
    const deletionPromises = messages.map(message => {
      if ('id' in message) {
        const messagePath = `${CHATS_COLLECTION}/${userId}/${MESSAGES_SUBCOLLECTION}`;
        return deleteDocument(messagePath, message.id as string);
      }
      return Promise.resolve();
    });
    
    // Wait for all deletions to complete
    await Promise.all(deletionPromises);
  } catch (error) {
    console.error('Error clearing chat history:', error);
    throw new Error(`Failed to clear chat history: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}; 