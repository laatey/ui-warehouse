import React from 'react'

export interface TabItemData {
  id: string
  title: string
  url?: string
  favicon?: string
  isLoading?: boolean
  isPinned?: boolean
  isMuted?: boolean
}

export interface ToolbarState {
  canGoBack?: boolean
  canGoForward?: boolean
  isLoading?: boolean
  currentUrl?: string
}

export interface BrowserShellProps {
  tabs: TabItemData[]
  activeTabId: string
  onSelectTab: (id: string) => void
  onCloseTab?: (id: string) => void
  onNewTab?: () => void
  onTogglePinTab?: (id: string) => void

  toolbarState?: ToolbarState
  onNavigate?: (url: string) => void
  onBack?: () => void
  onForward?: () => void
  onReload?: () => void
  onStop?: () => void

  toolbarActions?: React.ReactNode
  
  /** Empty main viewport slot (webview, iframe, or custom canvas) */
  children: React.ReactNode

  className?: string
}
