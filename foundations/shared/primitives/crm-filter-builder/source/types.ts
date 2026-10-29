import type { ReactNode } from 'react';

export type FilterOperatorType =
  | 'equals'
  | 'not_equals'
  | 'contains'
  | 'not_contains'
  | 'is_empty'
  | 'is_not_empty'
  | 'greater_than'
  | 'less_than';

export interface FilterFieldDefinition {
  id: string;
  label: string;
  type?: 'text' | 'number' | 'select' | 'date' | 'boolean';
  icon?: ReactNode;
  options?: Array<{ label: string; value: string }>;
}

export interface ActiveFilterItem {
  id: string;
  fieldId: string;
  operator: FilterOperatorType;
  value?: string | number | boolean | string[];
}

export interface CrmFilterBuilderProps {
  /** List of currently active filter items */
  filters: ActiveFilterItem[];
  /** Definitions of all fields available to filter against */
  availableFields: FilterFieldDefinition[];
  /** Callback when user creates a new filter on a field */
  onAddFilter: (fieldId: string) => void;
  /** Callback when a filter operator or value is updated */
  onUpdateFilter: (filterId: string, updates: Partial<ActiveFilterItem>) => void;
  /** Callback when a specific filter is removed */
  onRemoveFilter: (filterId: string) => void;
  /** Optional callback to clear all active filters */
  onClearAll?: () => void;
  /** Optional custom trigger or extra slot (e.g., sort, search input) */
  extraSlot?: ReactNode;
  /** Blank custom container for extension dropdowns or rule builders */
  children?: ReactNode;
  /** Custom CSS classes */
  className?: string;
}
