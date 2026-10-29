import type { ReactNode } from 'react';

export interface SqlExecutionMetrics {
  executionTimeMs?: number;
  rowCount?: number;
  error?: string;
}

export interface SqlQueryEditorStageProps {
  /** Title or filename of the active SQL snippet (e.g., "Monthly Active Users") */
  queryName?: string;
  /** Callback when query title is renamed */
  onQueryNameChange?: (newName: string) => void;
  /** Active SQL string */
  querySql: string;
  /** Callback when SQL text changes */
  onQuerySqlChange: (newSql: string) => void;
  /** Primary callback to execute the SQL query (also triggered via Ctrl/Cmd+Enter) */
  onRunQuery: () => void;
  /** Whether query is currently executing on database */
  isRunning?: boolean;
  /** Callback to format or prettify the SQL code */
  onFormatQuery?: () => void;
  /** Execution statistics and metrics from the most recent run */
  metrics?: SqlExecutionMetrics;
  /** Active utility panel tab (e.g., 'results' or 'messages') */
  activeUtilityTab?: 'results' | 'messages' | string;
  /** Callback when utility panel tab changes */
  onUtilityTabChange?: (tab: string) => void;
  /** Optional custom editor slot (e.g. Monaco or CodeMirror instance) */
  editorSlot?: ReactNode;
  /** Blank children container for the query results table or data grid per AGENTS.md */
  children?: ReactNode;
  /** Custom CSS classes */
  className?: string;
}
