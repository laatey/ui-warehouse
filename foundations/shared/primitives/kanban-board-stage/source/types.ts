import type { ReactNode } from 'react';

export interface KanbanColumnDefinition {
  id: string;
  title: string;
  icon?: ReactNode;
  color?: string;
  count?: number;
  isCollapsed?: boolean;
}

export interface KanbanCardItem {
  id: string;
  columnId: string;
  [key: string]: unknown;
}

export interface KanbanBoardStageProps {
  /** Array of column lane definitions */
  columns: KanbanColumnDefinition[];
  /** Optional array of card items assigned to columns */
  items?: KanbanCardItem[];
  /** Custom renderer for card contents within columns */
  renderCard?: (item: KanbanCardItem) => ReactNode;
  /** Callback fired when a card is moved between columns */
  onCardMove?: (cardId: string, sourceColId: string, targetColId: string) => void;
  /** Callback fired when user clicks "+ Add Item" on a column header */
  onAddItemToColumn?: (columnId: string) => void;
  /** Callback fired when column collapse is toggled */
  onToggleColumnCollapse?: (columnId: string) => void;
  /** Optional "+ New Column" button slot */
  newColumnSlot?: ReactNode;
  /** Blank children container for custom board canvases or empty state */
  children?: ReactNode;
  /** Custom CSS classes */
  className?: string;
}
