import type { ReactNode } from 'react';

export interface DatabaseSchemaInfo {
  name: string;
  isDefault?: boolean;
  entityCount?: number;
}

export type DatabaseEntityType = 'table' | 'view' | 'materialized_view' | 'foreign_table';

export interface DatabaseEntityItem {
  id: string;
  name: string;
  schema: string;
  type: DatabaseEntityType;
  rowCount?: number | string;
  hasRls?: boolean;
}

export interface SchemaTableSidebarProps {
  /** List of schemas (e.g., 'public', 'auth', 'storage') */
  schemas: DatabaseSchemaInfo[];
  /** Currently active schema name */
  selectedSchema: string;
  /** Callback fired when user changes schema */
  onSchemaChange: (schemaName: string) => void;
  /** List of tables and views within the selected schema */
  entities: DatabaseEntityItem[];
  /** Currently selected table/entity ID */
  selectedEntityId?: string;
  /** Callback fired when user selects a table */
  onSelectEntity: (entityId: string) => void;
  /** Callback fired when user clicks "+ New Table" */
  onCreateTable?: () => void;
  /** Table filter search text */
  searchQuery?: string;
  /** Search text change handler */
  onSearchChange?: (query: string) => void;
  /** Blank children container for custom tree items or tree extensions per AGENTS.md */
  children?: ReactNode;
  /** Custom CSS classes */
  className?: string;
}
