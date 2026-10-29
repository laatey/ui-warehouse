import React from 'react'

export interface MobileNavItem {
  id: string
  label: string
  icon: React.ReactNode
  badge?: string | number
  active?: boolean
  onClick?: () => void
}

export interface MobileBottomNavShellProps {
  /** Top app bar title or logo */
  title?: React.ReactNode

  /** Back button handler (shows back arrow if provided) */
  onBack?: () => void

  /** Header right-side actions */
  headerActions?: React.ReactNode

  /** Bottom navigation bar items */
  navItems: MobileNavItem[]

  /** Blank screen content container */
  children: React.ReactNode

  className?: string
}
