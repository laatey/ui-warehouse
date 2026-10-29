import React from 'react'

export interface IconRailItem {
  id: string
  label: string
  icon: React.ReactNode
  badge?: string | number
  active?: boolean
  onClick?: () => void
}

export interface IconRailProps {
  topSlot?: React.ReactNode
  items: IconRailItem[]
  bottomSlot?: React.ReactNode
  className?: string
}
