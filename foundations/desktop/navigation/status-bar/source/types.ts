import React, { ReactNode } from 'react';

export interface StatusBarToggleItem {
  id: string;
  label: string;
  active: boolean;
  icon?: ReactNode;
  onToggle: () => void;
  shortcut?: string;
}

export interface StatusBarProps {
  coordinates?: string;
  units?: string;
  zoomLevel?: string | number;
  toggles?: StatusBarToggleItem[];
  statusMessage?: string;
  leftSlot?: ReactNode;
  rightSlot?: ReactNode;
  className?: string;
}
