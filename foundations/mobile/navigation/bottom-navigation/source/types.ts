import React from 'react'

export interface BottomNavigationItem {
  id: string
  label: string
  icon: React.ReactNode
  badge?: string | number
  active?: boolean
  onClick?: () => void
}

export interface BottomNavigationProps {
  items: BottomNavigationItem[]
  activeId?: string
  onChange?: (id: string) => void
  className?: string
}
