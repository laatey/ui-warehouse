import React from 'react';

export interface DatabaseWorkspaceShellProps {
  primaryNavSlot?: React.ReactNode;
  primaryNavWidth?: number;
  schemaSidebarSlot?: React.ReactNode;
  schemaSidebarWidth?: number;
  showSchemaSidebar?: boolean;
  onToggleSchemaSidebar?: () => void;
  headerSlot?: React.ReactNode;
  actionToolbarSlot?: React.ReactNode;
  inspectorPanelSlot?: React.ReactNode;
  inspectorPanelWidth?: number;
  showInspectorPanel?: boolean;
  onToggleInspectorPanel?: () => void;
  children?: React.ReactNode;
  className?: string;
}
