import React from 'react'
import { PanelLeft, PanelRight, ChevronLeft, ChevronRight } from 'lucide-react'
import { WorkspaceMode, ModeOption } from './types'

export interface HeaderProps {
  mode?: WorkspaceMode
  onModeChange?: (mode: WorkspaceMode) => void
  modeOptions?: ModeOption[]
  
  sidebarOpen: boolean
  onToggleSidebar: () => void
  sidebarTitle?: string

  inspectorOpen?: boolean
  onToggleInspector?: () => void
  hasInspector?: boolean

  canGoBack?: boolean
  canGoForward?: boolean
  onGoBack?: () => void
  onGoForward?: () => void

  actions?: React.ReactNode
  className?: string
}

export function Header({
  mode,
  onModeChange,
  modeOptions,
  sidebarOpen,
  onToggleSidebar,
  sidebarTitle = 'Toggle Sidebar',
  inspectorOpen,
  onToggleInspector,
  hasInspector,
  canGoBack = false,
  canGoForward = false,
  onGoBack,
  onGoForward,
  actions,
  className = ''
}: HeaderProps): React.JSX.Element {
  return (
    <header
      className={`h-11 border-b border-border bg-background px-3 flex items-center justify-between gap-2 select-none shrink-0 ${className}`}
    >
      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={onToggleSidebar}
          title={sidebarTitle}
          aria-label={sidebarTitle}
          aria-pressed={sidebarOpen}
          className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-accent transition-colors cursor-pointer"
        >
          <PanelLeft className="w-4 h-4" />
        </button>

        {(onGoBack || onGoForward) && (
          <div className="hidden sm:flex items-center gap-0.5">
            <button
              type="button"
              onClick={onGoBack}
              disabled={!canGoBack}
              title="Go back"
              aria-label="Go back"
              className={`p-1.5 rounded-md text-muted-foreground transition-colors ${
                canGoBack ? 'hover:text-foreground hover:bg-accent cursor-pointer' : 'opacity-40 cursor-not-allowed'
              }`}
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={onGoForward}
              disabled={!canGoForward}
              title="Go forward"
              aria-label="Go forward"
              className={`p-1.5 rounded-md text-muted-foreground transition-colors ${
                canGoForward ? 'hover:text-foreground hover:bg-accent cursor-pointer' : 'opacity-40 cursor-not-allowed'
              }`}
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {modeOptions && modeOptions.length > 0 && onModeChange && (
          <div className="ml-2 inline-flex items-center rounded-lg bg-muted p-0.5 text-xs">
            {modeOptions.map((opt) => {
              const active = opt.value === mode
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => onModeChange(opt.value)}
                  title={opt.title}
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
                    active ? 'bg-background text-foreground shadow-xs font-medium' : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {opt.icon}
                  {opt.label && <span>{opt.label}</span>}
                </button>
              )
            })}
          </div>
        )}
      </div>

      <div className="flex items-center gap-1.5 ml-auto">
        {actions}

        {hasInspector && onToggleInspector && (
          <button
            type="button"
            onClick={onToggleInspector}
            title={inspectorOpen ? 'Hide inspector' : 'Show inspector'}
            aria-label={inspectorOpen ? 'Hide inspector' : 'Show inspector'}
            aria-pressed={inspectorOpen}
            className={`p-1.5 rounded-md transition-colors cursor-pointer ${
              inspectorOpen ? 'bg-accent text-foreground' : 'text-muted-foreground hover:text-foreground hover:bg-accent'
            }`}
          >
            <PanelRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </header>
  )
}
