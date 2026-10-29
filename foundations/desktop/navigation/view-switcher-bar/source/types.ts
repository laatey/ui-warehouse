import type { ReactNode } from 'react';

export type ViewLayoutMode = 'list' | 'kanban' | 'calendar' | 'gantt' | 'spreadsheet' | string;

export interface ViewLayoutOption {
  id: ViewLayoutMode;
  label: string;
  icon?: ReactNode;
  disabled?: boolean;
}

export interface ViewSwitcherBarProps {
  /** Currently selected layout ID */
  activeView: ViewLayoutMode;
  /** Callback fired when user selects a layout mode */
  onViewChange: (viewId: ViewLayoutMode) => void;
  /** Available layout options (defaults to list, kanban, calendar, gantt, spreadsheet) */
  views?: ViewLayoutOption[];
  /** Optional view title or breadcrumb header (e.g., "All Issues", "Sprint 12") */
  title?: string;
  /** Optional badge or counter text next to title */
  countBadge?: string | number;
  /** Slot for filter trigger or filter chip bar */
  filterSlot?: ReactNode;
  /** Slot for grouping, sorting, or display customization dropdowns */
  groupBySlot?: ReactNode;
  /** Primary action slot (e.g., "+ New Issue" button) */
  actionsSlot?: ReactNode;
  /** Blank custom container for extension tools */
  children?: ReactNode;
  /** Custom CSS classes */
  className?: string;
}
