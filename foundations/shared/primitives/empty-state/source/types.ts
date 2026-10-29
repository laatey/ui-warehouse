import React from 'react'

export interface EmptyStateProps {
  icon?: React.ReactNode
  title: React.ReactNode
  description?: React.ReactNode
  primaryAction?: React.ReactNode
  secondaryAction?: React.ReactNode
  size?: 'sm' | 'md' | 'lg'
  /** Dashed outline, for drop-zone / "nothing here yet" panels. */
  bordered?: boolean
  children?: React.ReactNode
  className?: string
}
