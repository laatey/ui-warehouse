import React from 'react'

export interface TabItem {
  id: string
  title: string
  icon?: React.ReactNode
  isPinned?: boolean
  isLoading?: boolean
  isCloseable?: boolean
}

export interface TabStripProps {
  tabs: TabItem[]
  activeTabId: string
  onSelectTab: (id: string) => void
  onCloseTab?: (id: string) => void
  onNewTab?: () => void
  className?: string
}
