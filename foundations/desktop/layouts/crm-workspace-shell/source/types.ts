import React from 'react';

export interface CrmWorkspaceShellProps {
  sidebarSlot?: React.ReactNode;
  sidebarWidth?: number;
  topBarSlot?: React.ReactNode;
  filterBarSlot?: React.ReactNode;
  sidePanelSlot?: React.ReactNode;
  sidePanelWidth?: number;
  showSidePanel?: boolean;
  onToggleSidePanel?: () => void;
  children?: React.ReactNode;
  className?: string;
}
