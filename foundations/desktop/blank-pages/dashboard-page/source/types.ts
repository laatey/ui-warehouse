import React from 'react'

export interface BlankDashboardPageProps {
  /** Page title or header element */
  title?: React.ReactNode
  
  /** Secondary subtitle or description */
  description?: React.ReactNode

  /** Header actions slot (e.g. 'Create Project', 'Export', date range picker) */
  actions?: React.ReactNode

  /** Filter or search bar slot */
  filterSlot?: React.ReactNode

  /** Main content area (empty by default for user widgets/tables) */
  children?: React.ReactNode

  /** Optional footer or pagination slot */
  footer?: React.ReactNode

  className?: string
}
