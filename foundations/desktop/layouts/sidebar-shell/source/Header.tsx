import React from 'react'
import { Menu } from 'lucide-react'

export interface HeaderProps {
  breadcrumbs?: React.ReactNode
  title?: React.ReactNode
  actions?: React.ReactNode
  onMobileMenuToggle?: () => void
  className?: string
}

export function Header({
  breadcrumbs,
  title,
  actions,
  onMobileMenuToggle,
  className = ''
}: HeaderProps): React.JSX.Element {
  return (
    <header
      className={`h-14 border-b border-border bg-background px-4 flex items-center justify-between gap-4 select-none shrink-0 ${className}`}
    >
      <div className="flex items-center gap-3 min-w-0">
        {onMobileMenuToggle && (
          <button
            type="button"
            onClick={onMobileMenuToggle}
            aria-label="Open mobile navigation"
            className="md:hidden p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-accent transition-colors cursor-pointer"
          >
            <Menu className="w-5 h-5" />
          </button>
        )}

        {breadcrumbs ? (
          <div className="flex items-center gap-2 text-xs text-muted-foreground truncate">
            {breadcrumbs}
          </div>
        ) : title ? (
          <h1 className="text-sm font-medium text-foreground truncate">
            {title}
          </h1>
        ) : null}
      </div>

      <div className="flex items-center gap-2 ml-auto shrink-0">
        {actions}
      </div>
    </header>
  )
}
