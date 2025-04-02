'use client';

import { FC, useState, FormEvent, KeyboardEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2 } from 'lucide-react';

interface MessageInputProps {
  onSendMessage: (message: string) => void;
  isSending: boolean;
}

export const MessageInput: FC<MessageInputProps> = ({ onSendMessage, isSending }) => {
  const [message, setMessage] = useState('');
  
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    
    if (!message.trim()) {
      return;
    }
    
    onSendMessage(message);
    setMessage('');
  };
  
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    // Send message on Enter key press (but not with Shift+Enter)
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="flex w-full space-x-2">
      <Input
        type="text"
        placeholder="Напишите сообщение..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={handleKeyDown}
        disabled={isSending}
        className="flex-grow"
        data-testid="chat-input"
      />
      <Button 
        type="submit" 
        disabled={isSending || !message.trim()}
        className="min-w-[90px]"
        data-testid="send-button"
      >
        {isSending ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            <span>Отправка</span>
          </>
        ) : (
          <span>Отправить</span>
        )}
      </Button>
    </form>
  );
}; 