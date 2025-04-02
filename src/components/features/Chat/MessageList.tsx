'use client';

import { FC, useEffect, useRef } from 'react';
import { MessageItem } from './MessageItem';
import { Message } from '@/lib/services/chat-service';
import { Skeleton } from '@/components/ui/skeleton';

interface MessageListProps {
  messages: (Message & { id?: string })[];
  isLoading: boolean;
}

export const MessageList: FC<MessageListProps> = ({ messages, isLoading }) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  if (isLoading) {
    return (
      <div className="flex flex-col space-y-4 min-h-[400px]">
        <Skeleton className="h-16 w-3/4" />
        <Skeleton className="h-16 w-3/4 ml-auto" />
        <Skeleton className="h-16 w-3/4" />
      </div>
    );
  }
  
  if (messages.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[400px] text-muted-foreground">
        <p>История чата пуста. Отправьте сообщение, чтобы начать общение с ассистентом.</p>
      </div>
    );
  }
  
  return (
    <div className="flex flex-col space-y-4 min-h-[400px]">
      {messages.map((message) => (
        <MessageItem key={message.id || `${message.role}-${message.timestamp?.toString()}`} message={message} />
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
}; 