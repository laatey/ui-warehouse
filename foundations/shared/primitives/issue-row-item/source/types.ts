import type { ReactNode } from 'react';

export type IssuePriorityLevel = 'urgent' | 'high' | 'medium' | 'low' | 'none';

export interface IssueStateInfo {
  id: string;
  name: string;
  color?: string;
  icon?: ReactNode;
}

export interface IssueAssigneeInfo {
  id: string;
  name: string;
  avatarUrl?: string;
}

export interface IssueLabelInfo {
  id: string;
  name: string;
  color?: string;
}

export interface IssueRowItemProps {
  /** Unique issue identifier (e.g., "PLN-101", "APP-42") */
  identifier: string;
  /** Primary issue title */
  title: string;
  /** Issue state/status representation */
  state?: IssueStateInfo;
  /** Priority level indicator */
  priority?: IssuePriorityLevel;
  /** Primary assignee information */
  assignee?: IssueAssigneeInfo;
  /** Target due date string (e.g., "Oct 31") */
  dueDate?: string;
  /** Associated tag / category labels */
  labels?: IssueLabelInfo[];
  /** Whether the row is currently selected */
  isSelected?: boolean;
  /** Selection toggle callback */
  onSelectChange?: (selected: boolean) => void;
  /** Primary row click handler (e.g., opens peek drawer) */
  onClick?: () => void;
  /** Right-aligned menu or action buttons */
  actionsSlot?: ReactNode;
  /** Blank children container for custom badges, branch indicators, etc. */
  children?: ReactNode;
  /** Custom CSS classes */
  className?: string;
}
