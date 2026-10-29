import React from 'react';

export type ProjectViewMode = 'list' | 'kanban' | 'calendar' | 'gantt' | 'table';

export interface ProjectWorkspaceShellProps {
  sidebarSlot?: React.ReactNode;
  sidebarWidth?: number;
  headerSlot?: React.ReactNode;
  viewMode?: ProjectViewMode;
  onViewModeChange?: (mode: ProjectViewMode) => void;
  availableViews?: ProjectViewMode[];
  filterBarSlot?: React.ReactNode;
  peekPanelSlot?: React.ReactNode;
  peekPanelWidth?: number;
  showPeekPanel?: boolean;
  onTogglePeekPanel?: () => void;
  children?: React.ReactNode;
  className?: string;
}
