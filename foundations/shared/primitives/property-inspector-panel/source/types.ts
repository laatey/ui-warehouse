import React from 'react';

export type PropertyTab = 'content' | 'style' | 'events';

export interface PropertyFieldConfig {
  id: string;
  label: string;
  tooltip?: string;
  isJsExpression?: boolean;
  onToggleJs?: () => void;
  children: React.ReactNode;
}

export interface PropertySectionConfig {
  id: string;
  title: string;
  defaultOpen?: boolean;
  fields: PropertyFieldConfig[];
}

export interface PropertyInspectorPanelProps {
  title: string;
  entityType?: string;
  onTitleChange?: (newTitle: string) => void;
  activeTab?: PropertyTab;
  onTabChange?: (tab: PropertyTab) => void;
  availableTabs?: PropertyTab[];
  sections?: PropertySectionConfig[];
  onDelete?: () => void;
  onDuplicate?: () => void;
  onClose?: () => void;
  headerActions?: React.ReactNode;
  searchPlaceholder?: string;
  className?: string;
}
