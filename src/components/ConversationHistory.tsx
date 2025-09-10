import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MessageCircle, Trash2 } from 'lucide-react';

interface Message {
  id: string;
  text: string;
  sender: 'sign' | 'speech';
  timestamp: Date;
}

interface ConversationHistoryProps {
  messages: Message[];
  onClearHistory: () => void;
  textSize: number;
}

const ConversationHistory: React.FC<ConversationHistoryProps> = ({ 
  messages, 
  onClearHistory, 
  textSize 
}) => {
  return (
    <Card className="h-96">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="flex items-center gap-2">
          <MessageCircle className="h-5 w-5" />
          Conversation History
        </CardTitle>
        {messages.length > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearHistory}
            className="text-red-600 hover:text-red-700"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        )}
      </CardHeader>
      <CardContent className="p-0">
        <div className="max-h-80 overflow-y-auto p-4 space-y-3">
          {messages.length === 0 ? (
            <p className="text-center text-gray-500">No conversations yet</p>
          ) : (
            messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.sender === 'speech' ? 'justify-end' : 'justify-start'
                }`}
              >
                <div
                  className={`max-w-[80%] p-3 rounded-lg ${
                    message.sender === 'speech'
                      ? 'bg-purple-600 text-white rounded-br-sm'
                      : 'bg-gray-100 text-gray-900 rounded-bl-sm'
                  }`}
                >
                  <p 
                    className="leading-relaxed"
                    style={{ fontSize: `${textSize}px` }}
                  >
                    {message.text}
                  </p>
                  <p className={`text-xs mt-1 ${
                    message.sender === 'speech' ? 'text-purple-200' : 'text-gray-500'
                  }`}>
                    {message.timestamp.toLocaleTimeString()}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ConversationHistory;