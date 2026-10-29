import type { ReactNode } from 'react';

export type TableSortDirection = 'asc' | 'desc' | null;

export interface CrmTableColumn {
  id: string;
  label: string;
  icon?: ReactNode;
  width?: number | string;
  minWidth?: number;
  sortable?: boolean;
  align?: 'left' | 'center' | 'right';
}

export interface CrmTableRowData {
  id: string;
  [key: string]: unknown;
}

export interface CrmDataTableProps {
  /** Column definitions */
  columns: CrmTableColumn[];
  /** Optional array of row objects (if using standard tabular rendering) */
  rows?: CrmTableRowData[];
  /** Currently selected row IDs */
  selectedRowIds?: string[];
  /** Callback when an individual row checkbox is toggled */
  onSelectRow?: (rowId: string, selected: boolean) => void;
  /** Callback when select-all header checkbox is toggled */
  onSelectAll?: (selected: boolean) => void;
  /** Current column ID actively being sorted */
  sortColumnId?: string;
  /** Sort order direction ('asc', 'desc', or null) */
  sortDirection?: TableSortDirection;
  /** Callback when a column header sort indicator is clicked */
  onSortChange?: (columnId: string, direction: TableSortDirection) => void;
  /** Custom renderer for cell contents */
  renderCell?: (row: CrmTableRowData, column: CrmTableColumn) => ReactNode;
  /** Callback when user clicks a row */
  onRowClick?: (row: CrmTableRowData) => void;
  /** Optional column header actions slot (e.g. "+ Add Column" button) */
  headerActionsSlot?: ReactNode;
  /** Empty state slot displayed when no rows are present */
  emptyStateSlot?: ReactNode;
  /** Blank children container (for virtualized lists or custom row stages per AGENTS.md) */
  children?: ReactNode;
  /** Optional footer / pagination summary bar slot */
  footerSlot?: ReactNode;
  /** Custom CSS classes */
  className?: string;
}
