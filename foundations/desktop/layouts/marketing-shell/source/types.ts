import React from 'react';

export interface MarketingNavItem {
  label: string;
  href: string;
  active?: boolean;
  onClick?: () => void;
}

export interface MarketingShellProps {
  brandSlot?: React.ReactNode;
  navItems?: MarketingNavItem[];
  actionsSlot?: React.ReactNode;
  announcementSlot?: React.ReactNode;
  footerSlot?: React.ReactNode;
  children?: React.ReactNode;
  stickyHeader?: boolean;
  borderedHeader?: boolean;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '7xl' | 'full';
  className?: string;
}
