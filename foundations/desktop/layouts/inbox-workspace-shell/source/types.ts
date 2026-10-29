import React from 'react';

export interface InboxWorkspaceShellProps {
  navRailSlot?: React.ReactNode;
  navRailWidth?: number;
  conversationListSlot?: React.ReactNode;
  conversationListWidth?: number;
  showConversationList?: boolean;
  onToggleConversationList?: () => void;
  contactSidebarSlot?: React.ReactNode;
  contactSidebarWidth?: number;
  showContactSidebar?: boolean;
  onToggleContactSidebar?: () => void;
  conversationHeaderSlot?: React.ReactNode;
  composerSlot?: React.ReactNode;
  children?: React.ReactNode;
  activeConversationId?: string | number | null;
  className?: string;
}
