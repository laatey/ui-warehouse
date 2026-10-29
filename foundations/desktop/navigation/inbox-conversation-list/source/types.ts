import React from 'react';

export type ConversationStatus = 'open' | 'pending' | 'resolved' | 'all';
export type PriorityLevel = 'low' | 'medium' | 'high' | 'urgent';

export interface ConversationItemData {
  id: string | number;
  contactName: string;
  avatarUrl?: string;
  lastMessage: string;
  timeAgo: string;
  unreadCount?: number;
  status?: ConversationStatus;
  priority?: PriorityLevel;
  channel?: 'email' | 'chat' | 'whatsapp' | 'sms' | string;
  assigneeName?: string;
  assigneeAvatar?: string;
  labels?: string[];
}

export interface InboxConversationListProps {
  conversations: ConversationItemData[];
  activeConversationId?: string | number | null;
  onSelectConversation?: (conversation: ConversationItemData) => void;
  statusFilter?: ConversationStatus;
  onStatusFilterChange?: (status: ConversationStatus) => void;
  searchPlaceholder?: string;
  onSearchChange?: (query: string) => void;
  headerSlot?: React.ReactNode;
  emptyStateSlot?: React.ReactNode;
  className?: string;
}
