import React from 'react'
import { Minus, Square, Copy, X } from 'lucide-react'
import { isMac } from './platform'
import { WindowControlsProps } from './types'

export function WindowControls({
  onMinimize,
  onMaximize,
  onClose,
  isMaximized = false,
  className = ''
}: WindowControlsProps): React.JSX.Element | null {
  // macOS provides native traffic lights on the left
  if (isMac) return null

  return (
    <div
      aria-label="Window management controls"
      className={`app-no-drag inline-flex items-center h-full select-none shrink-0 ${className}`}
    >
      {onMinimize && (
        <button
          type="button"
          onClick={onMinimize}
          title="Minimize"
          aria-label="Minimize window"
          className="h-full px-3 inline-flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted/70 transition-colors cursor-pointer"
        >
          <Minus className="w-3.5 h-3.5" />
        </button>
      )}

      {onMaximize && (
        <button
          type="button"
          onClick={onMaximize}
          title={isMaximized ? 'Restore Down' : 'Maximize'}
          aria-label={isMaximized ? 'Restore Down' : 'Maximize'}
          className="h-full px-3 inline-flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted/70 transition-colors cursor-pointer"
        >
          {isMaximized ? (
            <Copy className="w-3.5 h-3.5 rotate-180" />
          ) : (
            <Square className="w-3.5 h-3.5" />
          )}
        </button>
      )}

      {onClose && (
        <button
          type="button"
          onClick={onClose}
          title="Close"
          aria-label="Close window"
          className="h-full px-3 inline-flex items-center justify-center text-muted-foreground hover:text-white hover:bg-red-600 transition-colors cursor-pointer"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  )
}
