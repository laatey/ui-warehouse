import React from 'react'

export interface DrawerMenuItem {
  id: string
  label: string
  icon?: React.ReactNode
  badge?: string | number
  onClick?: () => void
}

export interface MobileDrawerNavProps {
  open: boolean
  onClose: () => void
  title?: React.ReactNode
  items: DrawerMenuItem[]
  footer?: React.ReactNode
  className?: string
}
