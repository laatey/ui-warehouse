import React from 'react'
import { ToolPalette } from './ToolPalette'
import { CanvasWorkspaceShellProps } from './types'

export function CanvasWorkspaceShell({
  header,
  tools,
  activeToolId,
  onSelectTool,
  zoomControls,
  inspectorPanel,
  children,
  className = ''
}: CanvasWorkspaceShellProps): React.JSX.Element {
  return (
    <div className={`relative flex flex-col h-screen w-full bg-background text-foreground overflow-hidden ${className}`}>
      {/* Top Header */}
      {header && (
        <div className="relative z-20 shrink-0">
          {header}
        </div>
      )}

      {/* Main Canvas Viewport Area */}
      <div className="relative flex-1 min-h-0 w-full overflow-hidden">
        {/* Canvas Surface (Empty by default for future agent to populate) */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          {children}
        </div>

        {/* Floating Tool Palette (Centered at bottom) */}
        {tools && tools.length > 0 && (
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30">
            <ToolPalette
              tools={tools}
              activeToolId={activeToolId}
              onSelectTool={onSelectTool}
            />
          </div>
        )}

        {/* Floating Zoom Controls (Bottom Right) */}
        {zoomControls && (
          <div className="absolute bottom-6 right-6 z-30">
            {zoomControls}
          </div>
        )}

        {/* Floating Inspector Panel (Top Right) */}
        {inspectorPanel && (
          <div className="absolute top-4 right-4 z-30 max-w-sm">
            {inspectorPanel}
          </div>
        )}
      </div>
    </div>
  )
}
