import React from 'react'

export type WorkspaceMode = 'chat' | 'code' | string

export interface ModeOption<T extends string = string> {
  value: T
  label?: React.ReactNode
  icon?: React.ReactNode
  title?: string
}

export interface InspectorTab {
  id: string
  label: string
  icon?: React.ReactNode
  content?: React.ReactNode
}

export interface AssistantWorkspaceShellProps {
  /** Mode options for header switch (e.g., chat vs code) */
  mode?: WorkspaceMode
  onModeChange?: (mode: WorkspaceMode) => void
  modeOptions?: ModeOption[]
  
  /** Left sidebar slot (e.g. session list, file tree, history) */
  sidebar?: React.ReactNode
  sidebarTitle?: string
  defaultSidebarOpen?: boolean

  /** Center main content (empty by default for user's application) */
  children: React.ReactNode

  /** Right inspector panel tabs and active tab */
  inspectorTabs?: InspectorTab[]
  activeInspectorTabId?: string
  onInspectorTabChange?: (tabId: string) => void
  inspectorOpen?: boolean
  onInspectorOpenChange?: (open: boolean) => void

  /** Header custom action buttons */
  headerActions?: React.ReactNode
  
  /** Navigation history triggers */
  canGoBack?: boolean
  canGoForward?: boolean
  onGoBack?: () => void
  onGoForward?: () => void

  className?: string
}
