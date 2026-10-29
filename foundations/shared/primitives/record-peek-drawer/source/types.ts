import type { ReactNode } from 'react';

export interface RecordTabItem {
  id: string;
  label: string;
  badge?: string | number;
  icon?: ReactNode;
}

export interface RecordPropertyField {
  id: string;
  label: string;
  value?: ReactNode;
  icon?: ReactNode;
  isEditable?: boolean;
}

export interface RecordPeekDrawerProps {
  /** Whether the drawer is currently visible / open */
  isOpen: boolean;
  /** Callback fired when user closes the drawer */
  onClose: () => void;
  /** Title of the inspected record (e.g., company name, deal title) */
  title?: string;
  /** Subtitle or type badge (e.g., "Company", "Lead", "Deal") */
  recordType?: string;
  /** Optional avatar or icon slot for the record */
  recordIcon?: ReactNode;
  /** Optional actions in the header bar (e.g., edit, bookmark, open full-page) */
  headerActions?: ReactNode;
  /** Tab list for record sub-views */
  tabs?: RecordTabItem[];
  /** Currently active tab ID */
  activeTabId?: string;
  /** Callback when tab selection changes */
  onTabChange?: (tabId: string) => void;
  /** Optional key metadata / fields displayed in the header overview */
  fields?: RecordPropertyField[];
  /** Callback when an editable field is modified */
  onFieldChange?: (fieldId: string, newValue: unknown) => void;
  /** Width of the drawer in pixels or CSS width string (defaults to 460px) */
  width?: number | string;
  /** Primary content slot (empty by default for callers to supply activity feed, timeline, etc.) */
  children?: ReactNode;
  /** Optional footer action bar slot */
  footerSlot?: ReactNode;
  /** Custom CSS classes */
  className?: string;
}
