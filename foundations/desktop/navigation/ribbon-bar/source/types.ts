import React, { ReactNode } from 'react';

export interface RibbonToolItem {
  id: string;
  label: string;
  icon?: ReactNode;
  shortcut?: string;
  active?: boolean;
  disabled?: boolean;
  size?: 'large' | 'small';
  onClick?: () => void;
}

export interface RibbonGroup {
  id: string;
  title: string;
  items: RibbonToolItem[];
}

export interface RibbonTab {
  id: string;
  label: string;
  groups: RibbonGroup[];
}

export interface RibbonBarProps {
  tabs: RibbonTab[];
  activeTabId?: string;
  onTabChange?: (tabId: string) => void;
  activeToolId?: string;
  collapsed?: boolean;
  onToggleCollapse?: () => void;
  className?: string;
}
