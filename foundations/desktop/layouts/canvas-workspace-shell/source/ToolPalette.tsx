import React from 'react'
import { CanvasTool } from './types'

export interface ToolPaletteProps {
  tools: CanvasTool[]
  activeToolId?: string
  onSelectTool?: (toolId: string) => void
  orientation?: 'horizontal' | 'vertical'
  className?: string
}

export function ToolPalette({
  tools,
  activeToolId,
  onSelectTool,
  orientation = 'horizontal',
  className = ''
}: ToolPaletteProps): React.JSX.Element {
  return (
    <div
      role="toolbar"
      aria-label="Canvas editing tools"
      className={`bg-background/90 backdrop-blur-md border border-border shadow-lg rounded-xl p-1 flex ${
        orientation === 'vertical' ? 'flex-col gap-1' : 'flex-row gap-1'
      } select-none ${className}`}
    >
      {tools.map((tool) => {
        const active = tool.id === activeToolId || tool.active
        return (
          <button
            key={tool.id}
            type="button"
            onClick={() => onSelectTool?.(tool.id)}
            title={tool.shortcut ? `${tool.label} (${tool.shortcut})` : tool.label}
            aria-label={tool.label}
            aria-pressed={active}
            className={`p-2 rounded-lg text-xs transition-colors cursor-pointer flex items-center justify-center ${
              active
                ? 'bg-primary text-primary-foreground shadow-xs'
                : 'text-muted-foreground hover:text-foreground hover:bg-accent'
            }`}
          >
            {tool.icon}
          </button>
        )
      })}
    </div>
  )
}
