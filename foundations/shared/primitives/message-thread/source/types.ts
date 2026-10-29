import React from 'react';

export type MessageDirection = 'inbound' | 'outbound' | 'system';
export type MessageDeliveryStatus = 'sending' | 'sent' | 'delivered' | 'read' | 'failed';

export interface ChatMessage {
  id: string | number;
  content: string;
  senderName?: string;
  senderAvatar?: string;
  direction: MessageDirection;
  timestamp: string;
  status?: MessageDeliveryStatus;
  attachments?: Array<{
    name: string;
    url: string;
    type?: 'image' | 'file';
    size?: string;
  }>;
}

export interface MessageThreadProps {
  messages: ChatMessage[];
  typingUsers?: string[];
  onMessageClick?: (message: ChatMessage) => void;
  headerSlot?: React.ReactNode;
  emptyStateSlot?: React.ReactNode;
  autoScrollToBottom?: boolean;
  className?: string;
}
