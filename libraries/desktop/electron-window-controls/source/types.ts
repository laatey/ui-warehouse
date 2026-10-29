export type PlatformOS = 'darwin' | 'win32' | 'linux' | 'browser'

export interface WindowControlActions {
  minimize?: () => void
  maximize?: () => void
  close?: () => void
}

export interface WindowControlsProps {
  onMinimize?: () => void
  onMaximize?: () => void
  onClose?: () => void
  isMaximized?: boolean
  className?: string
}
