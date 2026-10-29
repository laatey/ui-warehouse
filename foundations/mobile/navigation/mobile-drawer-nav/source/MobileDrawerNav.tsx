import React from 'react'
import { X } from 'lucide-react'
import { MobileDrawerNavProps } from './types'

export function MobileDrawerNav({
  open,
  onClose,
  title,
  items = [],
  footer,
  className = ''
}: MobileDrawerNavProps): React.JSX.Element | null {
  if (!open) return null

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Navigation drawer"
      className="fixed inset-0 z-50 flex"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer Surface */}
      <div
        className={`relative z-10 w-4/5 max-w-xs h-full bg-background border-r border-border shadow-2xl flex flex-col pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)] animate-in slide-in-from-left duration-200 select-none ${className}`}
      >
        <div className="flex items-center justify-between h-14 px-4 border-b border-border shrink-0">
          <span className="text-sm font-semibold text-foreground truncate">
            {title || 'Menu'}
          </span>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close drawer"
            className="p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-accent transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto p-2 space-y-1">
          {items.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => {
                item.onClick?.()
                onClose()
              }}
              className="w-full flex items-center gap-3 px-3 py-2.5 text-xs font-medium rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent transition-colors cursor-pointer text-left"
            >
              {item.icon && <span className="shrink-0">{item.icon}</span>}
              <span className="truncate flex-1">{item.label}</span>
              {item.badge !== undefined && (
                <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-primary/10 px-1.5 text-[10px] font-semibold text-primary">
                  {item.badge}
                </span>
              )}
            </button>
          ))}
        </nav>

        {footer && (
          <div className="p-4 border-t border-border shrink-0">
            {footer}
          </div>
        )}
      </div>
    </div>
  )
}
