import React, { ReactNode } from 'react';

export interface CadRibbonShellProps {
  /** Top menu bar or brand header slot */
  topBar?: ReactNode;

  /** Ribbon toolbar component slot */
  ribbon?: ReactNode;

  /** Contextual options bar under the ribbon */
  toolOptionsBar?: ReactNode;

  /** Multi-document file tab strip */
  fileTabs?: ReactNode;

  /** Center main viewport / canvas area (empty by default for user's 2D/3D renderer) */
  children: ReactNode;

  /** Floating 3D viewport navigation gizmo or viewcube overlay */
  viewportGizmo?: ReactNode;

  /** Right-side inspector / properties panel slot */
  rightPanel?: ReactNode;
  rightPanelOpen?: boolean;

  /** Command line prompt bar at the bottom */
  commandLine?: ReactNode;

  /** Application status bar at the very bottom */
  statusBar?: ReactNode;

  className?: string;
}
