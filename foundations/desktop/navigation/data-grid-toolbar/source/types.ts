import type { ReactNode } from 'react';

export interface DataGridToolbarProps {
  /** Active table name displayed in breadcrumb */
  tableName?: string;
  /** Active schema prefix (e.g., 'public', 'auth') */
  schemaName?: string;
  /** Total row count or query matches */
  rowCount?: number | string;
  /** Number of active filters applied */
  filterCount?: number;
  /** Callback to toggle/open filter builder */
  onOpenFilter?: () => void;
  /** Number of active sort rules applied */
  sortCount?: number;
  /** Callback to toggle/open sort builder */
  onOpenSort?: () => void;
  /** Active impersonated role or permission view (e.g., 'anon', 'authenticated') */
  activeRole?: string;
  /** Callback when user changes role view */
  onRoleChange?: (role: string) => void;
  /** Primary callback to insert a new row */
  onInsertRow?: () => void;
  /** Callback to refresh current data grid */
  onRefresh?: () => void;
  /** Whether the grid is actively refetching */
  isRefreshing?: boolean;
  /** Callback when user requests export */
  onExport?: (format: 'csv' | 'json' | 'sql') => void;
  /** Optional extra action buttons slot */
  extraActionsSlot?: ReactNode;
  /** Blank children container for custom extensions per AGENTS.md */
  children?: ReactNode;
  /** Custom CSS classes */
  className?: string;
}
