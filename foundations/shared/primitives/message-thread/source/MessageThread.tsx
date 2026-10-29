import React, { useRef, useEffect } from 'react';
import { Check, CheckCheck, AlertCircle, FileText } from 'lucide-react';
import { MessageThreadProps, ChatMessage } from './types';

export const MessageThread: React.FC<MessageThreadProps> = ({
  messages,
  typingUsers = [],
  onMessageClick,
  headerSlot,
  emptyStateSlot,
  autoScrollToBottom = true,
  className = '',
}) => {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (autoScrollToBottom) {
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, typingUsers, autoScrollToBottom]);

  const renderStatus = (status?: string) => {
    switch (status) {
      case 'read':
        return <CheckCheck className="w-3.5 h-3.5 text-primary stroke-[2.5]" />;
      case 'delivered':
        return <CheckCheck className="w-3.5 h-3.5 text-muted-foreground stroke-[2]" />;
      case 'sent':
        return <Check className="w-3 h-3 text-muted-foreground" />;
      case 'failed':
        return <AlertCircle className="w-3.5 h-3.5 text-destructive" />;
      default:
        return null;
    }
  };

  return (
    <div className={`flex flex-col h-full w-full bg-background text-foreground overflow-hidden ${className}`}>
      {headerSlot}

      {/* Message Feed Container */}
      <div className="flex-1 overflow-auto p-4 space-y-4">
        {messages.length > 0 ? (
          messages.map((msg) => {
            if (msg.direction === 'system') {
              return (
                <div key={msg.id} className="flex justify-center my-3">
                  <span className="px-3 py-1 rounded-full text-xs text-muted-foreground bg-muted border border-border/60 shadow-2xs">
                    {msg.content}
                  </span>
                </div>
              );
            }

            const isOutbound = msg.direction === 'outbound';

            return (
              <div
                key={msg.id}
                onClick={() => onMessageClick && onMessageClick(msg)}
                className={`flex gap-2.5 items-end max-w-[85%] md:max-w-[70%] ${
                  isOutbound ? 'ml-auto flex-row-reverse' : 'mr-auto'
                }`}
              >
                {/* Avatar */}
                {msg.senderAvatar ? (
                  <img
                    src={msg.senderAvatar}
                    alt={msg.senderName || 'Avatar'}
                    className="w-7 h-7 rounded-full object-cover shrink-0 select-none mb-1"
                  />
                ) : (
                  <div className="w-7 h-7 rounded-full bg-secondary text-secondary-foreground flex items-center justify-center text-[11px] font-bold shrink-0 mb-1 select-none">
                    {(msg.senderName || (isOutbound ? 'Me' : 'U')).slice(0, 1).toUpperCase()}
                  </div>
                )}

                {/* Bubble Container */}
                <div className={`flex flex-col ${isOutbound ? 'items-end' : 'items-start'}`}>
                  {msg.senderName && !isOutbound && (
                    <span className="text-[11px] font-medium text-muted-foreground mb-1 px-1">
                      {msg.senderName}
                    </span>
                  )}

                  <div
                    className={`rounded-2xl px-4 py-2.5 text-sm shadow-2xs relative break-words ${
                      isOutbound
                        ? 'bg-primary text-primary-foreground rounded-br-xs'
                        : 'bg-card text-card-foreground border border-border rounded-bl-xs'
                    }`}
                  >
                    <p className="leading-relaxed whitespace-pre-wrap">{msg.content}</p>

                    {/* Attachments */}
                    {msg.attachments && msg.attachments.length > 0 && (
                      <div className="mt-2 space-y-1.5 pt-1 border-t border-current/15">
                        {msg.attachments.map((att, idx) => (
                          <div
                            key={idx}
                            className="flex items-center gap-2 p-1.5 rounded-md bg-background/20 text-xs"
                          >
                            <FileText className="w-4 h-4 shrink-0" />
                            <span className="truncate max-w-[180px]">{att.name}</span>
                            {att.size && <span className="opacity-70 text-[10px]">({att.size})</span>}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Metadata Row: Timestamp & Status */}
                  <div className="flex items-center gap-1.5 mt-1 px-1 text-[10px] text-muted-foreground select-none">
                    <span>{msg.timestamp}</span>
                    {isOutbound && renderStatus(msg.status)}
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="h-full flex items-center justify-center text-muted-foreground text-xs">
            {emptyStateSlot || 'No messages in this conversation'}
          </div>
        )}

        {/* Typing indicator */}
        {typingUsers.length > 0 && (
          <div className="flex items-center gap-2 text-xs text-muted-foreground pt-1">
            <div className="flex gap-1 items-center bg-muted px-3 py-1.5 rounded-full border border-border">
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce [animation-delay:-0.3s]" />
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce [animation-delay:-0.15s]" />
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce" />
            </div>
            <span>{typingUsers.join(', ')} {typingUsers.length > 1 ? 'are' : 'is'} typing...</span>
          </div>
        )}

        <div ref={bottomRef} />
      </div>
    </div>
  );
};
