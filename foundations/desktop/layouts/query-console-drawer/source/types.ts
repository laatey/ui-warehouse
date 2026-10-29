import React from 'react';

export interface ConsoleTabItem {
  id: string;
  label: string;
  badgeCount?: number;
  badgeVariant?: 'default' | 'error' | 'warning' | 'info';
}

export interface QueryConsoleDrawerProps {
  tabs?: ConsoleTabItem[];
  activeTab?: string;
  onTabChange?: (tabId: string) => void;
  isOpen?: boolean;
  onToggleOpen?: () => void;
  height?: number;
  onHeightChange?: (height: number) => void;
  minHeight?: number;
  maxHeight?: number;
  actionsSlot?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
}
