import React from 'react';

export type BuilderMode = 'edit' | 'preview';

export interface InternalToolBuilderShellProps {
  titleSlot?: React.ReactNode;
  mode?: BuilderMode;
  onModeChange?: (mode: BuilderMode) => void;
  headerActionsSlot?: React.ReactNode;
  leftSidebarSlot?: React.ReactNode;
  leftSidebarWidth?: number;
  showLeftSidebar?: boolean;
  onToggleLeftSidebar?: () => void;
  rightInspectorSlot?: React.ReactNode;
  rightInspectorWidth?: number;
  showRightInspector?: boolean;
  onToggleRightInspector?: () => void;
  bottomDrawerSlot?: React.ReactNode;
  showBottomDrawer?: boolean;
  onToggleBottomDrawer?: () => void;
  bottomDrawerHeight?: number;
  children?: React.ReactNode;
  showGridLines?: boolean;
  className?: string;
}
