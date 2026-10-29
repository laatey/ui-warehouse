import React from 'react'

export interface NavItem {
  id: string
  label: string
  href?: string
  icon?: React.ReactNode
  badge?: React.ReactNode
  active?: boolean
  onClick?: () => void
}

export interface NavGroup {
  id: string
  title?: string
  items: NavItem[]
}

export interface SidebarShellProps {
  /** Logo or workspace brand mark slot */
  brandSlot?: React.ReactNode
  
  /** Navigation groups or custom sidebar node */
  navGroups?: NavGroup[]
  sidebarFooter?: React.ReactNode

  /** Top header elements */
  title?: React.ReactNode
  breadcrumbs?: React.ReactNode
  headerActions?: React.ReactNode

  /** Main content container (empty by default) */
  children: React.ReactNode

  /** Sidebar collapse controls */
  defaultCollapsed?: boolean
  className?: string
}
