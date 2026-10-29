import React from 'react'

export interface OmniboxToolbarProps {
  url?: string
  canGoBack?: boolean
  canGoForward?: boolean
  isLoading?: boolean
  onNavigate?: (url: string) => void
  onBack?: () => void
  onForward?: () => void
  onReload?: () => void
  onStop?: () => void
  actions?: React.ReactNode
  className?: string
}
