'use client';

import { useEffect } from 'react';
import { toast } from 'sonner';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useChat } from '@/hooks/useChat';
import { ChatWindow } from '@/components/features/Chat';

export default function ChatPage() {
  const {
    messages,
    isLoading,
    error,
    sendMessage,
    clearHistory,
    isSending,
    isClearing,
  } = useChat();

  // Show error toast if there's an error loading chat history
  useEffect(() => {
    if (error) {
      toast.error(`Ошибка загрузки истории чата: ${(error as Error).message}`);
    }
  }, [error]);

  // Handler for sending messages
  const handleSendMessage = (messageText: string) => {
    if (!messageText.trim()) return;
    
    sendMessage(messageText);
  };

  // Handler for clearing chat history
  const handleClearHistory = () => {
    // Confirm before clearing
    if (messages.length > 0 && window.confirm('Вы уверены, что хотите очистить историю чата?')) {
      clearHistory();
    }
  };

  return (
    <div className="container mx-auto px-4 py-6 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">Чат с ассистентом</h1>
      
      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Ошибка</AlertTitle>
          <AlertDescription>
            Не удалось загрузить историю чата. Пожалуйста, обновите страницу или попробуйте позже.
          </AlertDescription>
        </Alert>
      )}
      
      <ChatWindow
        messages={messages}
        isLoading={isLoading}
        onSendMessage={handleSendMessage}
        onClearHistory={handleClearHistory}
        isSending={isSending}
        isClearing={isClearing}
      />
      
      <div className="mt-4 text-sm text-muted-foreground">
        <p>
          Здесь вы можете задать вопросы AI-ассистенту BizLevel и получить помощь по любым темам, связанным с бизнесом и предпринимательством.
        </p>
      </div>
    </div>
  );
} 