import { NextResponse } from 'next/server';
import openai from '@/lib/openai';
import { OPENAI_MODEL, SYSTEM_PROMPT, TEMPERATURE, MAX_TOKENS } from '@/lib/constants';

// Define types for messages, request and response
export interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export interface ChatRequest {
  messages: Message[];
}

export interface ChatResponse {
  message: Message;
  error?: string;
}

/**
 * Retry function with exponential backoff
 * @param fn Function to retry
 * @param maxRetries Maximum number of retries
 * @returns Result of the function
 */
async function withRetry<T>(fn: () => Promise<T>, maxRetries: number = 3): Promise<T> {
  let lastError: Error | null = null;
  
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      console.warn(`Attempt ${i + 1} failed:`, error);
      lastError = error instanceof Error ? error : new Error(String(error));
      
      // Don't retry for certain error types
      if (lastError.message.includes('invalid_api_key') || 
          lastError.message.includes('insufficient_quota')) {
        throw lastError;
      }
      
      // Wait before next retry with exponential backoff
      if (i < maxRetries - 1) {
        await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, i)));
      }
    }
  }
  
  throw lastError || new Error('Function failed after retries');
}

// Export POST function to handle chat requests
export async function POST(request: Request) {
  try {
    // Parse the request body
    const { messages } = await request.json() as ChatRequest;
    
    // Check if OpenAI API key is available
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: 'OpenAI API key is not configured' },
        { status: 500 }
      );
    }
    
    // Enforce message limit to reduce API costs and improve response time
    const limitedMessages = messages.slice(-15); // Only use the last 15 messages
    
    // Prepare messages with system prompt
    const systemMessage = {
      role: 'system' as const,
      content: SYSTEM_PROMPT,
    };
    
    // Create an AbortController to handle timeouts
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 50000); // 50-second timeout
    
    try {
      // Make request to OpenAI API with retry logic
      const response = await withRetry(async () => {
        return await openai.chat.completions.create({
          model: OPENAI_MODEL,
          messages: [systemMessage, ...limitedMessages.map(m => ({
            role: m.role,
            content: m.content
          }))],
          temperature: TEMPERATURE,
          max_tokens: MAX_TOKENS,
        });
      }, 3);
      
      // Clear the timeout
      clearTimeout(timeoutId);
      
      // Extract the assistant's response
      const assistantResponse = response.choices[0]?.message?.content || '';
      
      // Return the response
      return NextResponse.json({
        message: {
          role: 'assistant',
          content: assistantResponse,
        },
      });
    } catch (error) {
      // Clear the timeout
      clearTimeout(timeoutId);
      throw error;
    }
    
  } catch (error) {
    console.error('Error in chat API route:', error);
    
    let errorMessage = 'Unknown error';
    let statusCode = 500;
    
    if (error instanceof Error) {
      errorMessage = error.message;
      
      // Handle specific OpenAI API errors
      if (errorMessage.includes('timeout') || errorMessage.includes('aborted')) {
        errorMessage = 'Запрос к AI-сервису занял слишком много времени. Пожалуйста, попробуйте еще раз.';
        statusCode = 408; // Request Timeout
      } else if (errorMessage.includes('rate limit')) {
        errorMessage = 'Превышен лимит запросов к AI-сервису. Пожалуйста, подождите немного и попробуйте снова.';
        statusCode = 429; // Too Many Requests
      } else if (errorMessage.includes('invalid_api_key')) {
        errorMessage = 'Ошибка аутентификации с сервисом AI. Пожалуйста, обратитесь к администратору.';
        statusCode = 401; // Unauthorized
      } else if (errorMessage.includes('insufficient_quota')) {
        errorMessage = 'Исчерпан лимит запросов к сервису AI. Пожалуйста, обратитесь к администратору.';
        statusCode = 402; // Payment Required
      }
    }
    
    // Return appropriate error response
    return NextResponse.json(
      {
        message: {
          role: 'assistant',
          content: 'Извините, произошла ошибка при обработке вашего запроса. Пожалуйста, попробуйте еще раз позже.',
        },
        error: errorMessage,
      },
      { status: statusCode }
    );
  }
} 