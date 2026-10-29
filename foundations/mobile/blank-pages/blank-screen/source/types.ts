import React from 'react'

export interface MobileBlankScreenProps {
  title?: React.ReactNode
  onBack?: () => void
  actions?: React.ReactNode
  children?: React.ReactNode
  footer?: React.ReactNode
  className?: string
}
