'use client';

import { FC } from 'react';
import { Message } from '@/lib/services/chat-service';
import { MessageList } from './MessageList';
import { MessageInput } from './MessageInput';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

interface ChatWindowProps {
  messages: (Message & { id?: string })[];
  isLoading: boolean;
  onSendMessage: (message: string) => void;
  onClearHistory: () => void;
  isSending: boolean;
  isClearing?: boolean;
}

export const ChatWindow: FC<ChatWindowProps> = ({
  messages,
  isLoading,
  onSendMessage,
  onClearHistory,
  isSending,
  isClearing = false
}) => {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>История сообщений</span>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onClearHistory}
            disabled={isLoading || isSending || isClearing || messages.length === 0}
            className="min-w-[140px]"
          >
            {isClearing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                <span>Очистка...</span>
              </>
            ) : (
              <span>Очистить историю</span>
            )}
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col space-y-4 min-h-[400px] max-h-[60vh] overflow-y-auto p-4 bg-muted/50 rounded-md">
          <MessageList messages={messages} isLoading={isLoading} />
        </div>
      </CardContent>
      <CardFooter>
        <MessageInput onSendMessage={onSendMessage} isSending={isSending} />
      </CardFooter>
    </Card>
  );
}; 