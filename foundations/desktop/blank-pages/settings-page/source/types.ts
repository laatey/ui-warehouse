import React from 'react'

export interface SettingsSection {
  id: string
  label: string
  icon?: React.ReactNode
  description?: string
  content?: React.ReactNode
}

export interface BlankSettingsPageProps {
  title?: React.ReactNode
  description?: React.ReactNode
  sections: SettingsSection[]
  activeSectionId?: string
  onSectionChange?: (id: string) => void
  children?: React.ReactNode
  className?: string
}
