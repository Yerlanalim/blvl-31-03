'use client';

import { FC } from 'react';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import { Message } from '@/lib/services/chat-service';
import { Avatar } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import ReactMarkdown from 'react-markdown';

interface MessageItemProps {
  message: Message & { id?: string };
}

export const MessageItem: FC<MessageItemProps> = ({ message }) => {
  const isAssistant = message.role === 'assistant';
  const timestamp = message.timestamp instanceof Date 
    ? message.timestamp 
    : message.timestamp?.toDate?.();
  
  return (
    <div
      className={cn(
        'flex w-full items-start gap-3 max-w-[85%] animate-fadeIn',
        isAssistant ? 'self-start' : 'self-end ml-auto flex-row-reverse'
      )}
    >
      <Avatar
        className={cn(
          'h-8 w-8 rounded-full',
          isAssistant ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
        )}
      >
        <span className="text-xs">{isAssistant ? 'AI' : 'Вы'}</span>
      </Avatar>
      
      <div
        className={cn(
          'flex flex-col gap-1 rounded-lg p-3 text-sm',
          isAssistant ? 'bg-muted' : 'bg-primary text-primary-foreground'
        )}
      >
        {isAssistant ? (
          <div className="prose prose-sm max-w-none dark:prose-invert">
            <ReactMarkdown>{message.content}</ReactMarkdown>
          </div>
        ) : (
          <p className="whitespace-pre-wrap">{message.content}</p>
        )}
        
        {timestamp && (
          <time dateTime={timestamp.toISOString()} className={cn(
            'text-xs self-end mt-1',
            isAssistant ? 'text-muted-foreground' : 'text-primary-foreground/70'
          )}>
            {format(timestamp, 'HH:mm, d MMM', { locale: ru })}
          </time>
        )}
      </div>
    </div>
  );
}; 