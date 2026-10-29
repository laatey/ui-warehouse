import React from 'react'

export interface CanvasTool {
  id: string
  label: string
  icon: React.ReactNode
  shortcut?: string
  active?: boolean
}

export interface CanvasWorkspaceShellProps {
  /** Top navigation / status header */
  header?: React.ReactNode

  /** Floating tool palette items */
  tools?: CanvasTool[]
  activeToolId?: string
  onSelectTool?: (toolId: string) => void

  /** Floating zoom & view controls (bottom-right or bottom-left) */
  zoomControls?: React.ReactNode

  /** Floating contextual inspector / layers panel */
  inspectorPanel?: React.ReactNode

  /** Canvas viewport container (empty surface for user nodes, SVG, or WebGL) */
  children: React.ReactNode

  className?: string
}
