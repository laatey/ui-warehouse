import React, { useState } from 'react';
import { Search, Mail, MessageSquare, AlertCircle } from 'lucide-react';
import { InboxConversationListProps, ConversationItemData, ConversationStatus } from './types';

export const InboxConversationList: React.FC<InboxConversationListProps> = ({
  conversations,
  activeConversationId,
  onSelectConversation,
  statusFilter: controlledStatusFilter,
  onStatusFilterChange,
  searchPlaceholder = 'Search conversations...',
  onSearchChange,
  headerSlot,
  emptyStateSlot,
  className = '',
}) => {
  const [internalStatus, setInternalStatus] = useState<ConversationStatus>('open');
  const [searchQuery, setSearchQuery] = useState('');

  const currentStatus = controlledStatusFilter !== undefined ? controlledStatusFilter : internalStatus;

  const handleStatusClick = (st: ConversationStatus) => {
    if (controlledStatusFilter === undefined) setInternalStatus(st);
    if (onStatusFilterChange) onStatusFilterChange(st);
  };

  const handleSearchInput = (val: string) => {
    setSearchQuery(val);
    if (onSearchChange) onSearchChange(val);
  };

  const filteredConversations = conversations.filter((c) => {
    const matchesStatus = currentStatus === 'all' || (c.status ? c.status === currentStatus : currentStatus === 'open');
    const matchesSearch =
      searchQuery.trim() === '' ||
      c.contactName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.lastMessage.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const getPriorityColor = (priority?: string) => {
    switch (priority) {
      case 'urgent':
      case 'high':
        return 'text-rose-500 bg-rose-500/10';
      case 'medium':
        return 'text-amber-500 bg-amber-500/10';
      default:
        return 'text-muted-foreground bg-muted';
    }
  };

  return (
    <div className={`flex flex-col h-full w-full bg-card text-foreground select-none overflow-hidden ${className}`}>
      {/* 1. Header & Search Filter */}
      <div className="p-3 border-b border-border bg-muted/20 shrink-0 space-y-2">
        {headerSlot}

        {/* Search Input */}
        <div className="relative flex items-center">
          <Search className="w-3.5 h-3.5 absolute left-2.5 text-muted-foreground pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => handleSearchInput(e.target.value)}
            placeholder={searchPlaceholder}
            className="w-full pl-8 pr-3 py-1.5 text-xs rounded-md border border-border bg-background focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>

        {/* Status Filter Tabs (Open, Pending, Resolved) */}
        <div className="flex items-center gap-1 bg-muted p-0.5 rounded-lg border border-border/60">
          {(['open', 'pending', 'resolved', 'all'] as ConversationStatus[]).map((st) => (
            <button
              key={st}
              type="button"
              onClick={() => handleStatusClick(st)}
              className={`flex-1 py-1 rounded-md text-[11px] font-medium capitalize transition-colors text-center ${
                currentStatus === st
                  ? 'bg-background text-foreground shadow-xs font-semibold'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* 2. Scrollable Conversation Feed */}
      <div className="flex-1 overflow-auto divide-y divide-border/40">
        {filteredConversations.length > 0 ? (
          filteredConversations.map((chat) => {
            const isActive = activeConversationId === chat.id;
            return (
              <div
                key={chat.id}
                onClick={() => onSelectConversation && onSelectConversation(chat)}
                className={`p-3.5 flex gap-3 cursor-pointer transition-colors relative ${
                  isActive
                    ? 'bg-muted/80 border-l-2 border-primary'
                    : 'hover:bg-muted/40'
                }`}
              >
                {/* Avatar / Initials */}
                <div className="relative shrink-0">
                  {chat.avatarUrl ? (
                    <img
                      src={chat.avatarUrl}
                      alt={chat.contactName}
                      className="w-9 h-9 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-9 h-9 rounded-full bg-secondary text-secondary-foreground font-semibold flex items-center justify-center text-xs">
                      {chat.contactName.slice(0, 2).toUpperCase()}
                    </div>
                  )}
                  {chat.channel === 'email' && (
                    <span className="absolute -bottom-1 -right-1 p-0.5 bg-background rounded-full border border-border text-[9px] text-muted-foreground">
                      <Mail className="w-2.5 h-2.5" />
                    </span>
                  )}
                </div>

                {/* Content details */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-0.5">
                    <span className={`text-xs truncate ${chat.unreadCount ? 'font-bold text-foreground' : 'font-semibold text-foreground/90'}`}>
                      {chat.contactName}
                    </span>
                    <span className="text-[10px] text-muted-foreground shrink-0 ml-1">
                      {chat.timeAgo}
                    </span>
                  </div>

                  <p className={`text-xs truncate mb-1.5 ${chat.unreadCount ? 'text-foreground font-medium' : 'text-muted-foreground'}`}>
                    {chat.lastMessage}
                  </p>

                  <div className="flex items-center justify-between gap-1">
                    <div className="flex items-center gap-1.5 truncate">
                      {chat.priority && chat.priority !== 'low' && (
                        <span className={`px-1.5 py-0.2 rounded text-[10px] font-medium uppercase ${getPriorityColor(chat.priority)}`}>
                          {chat.priority}
                        </span>
                      )}
                      {chat.labels?.map((label, idx) => (
                        <span
                          key={idx}
                          className="px-1.5 py-0.2 rounded text-[10px] bg-muted text-muted-foreground border border-border truncate max-w-[80px]"
                        >
                          {label}
                        </span>
                      ))}
                    </div>

                    {chat.unreadCount !== undefined && chat.unreadCount > 0 && (
                      <span className="shrink-0 px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-primary text-primary-foreground">
                        {chat.unreadCount}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="h-full flex flex-col items-center justify-center p-6 text-center text-muted-foreground">
            {emptyStateSlot || (
              <>
                <MessageSquare className="w-8 h-8 stroke-1 mb-2 opacity-50" />
                <p className="text-xs">No conversations found</p>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
