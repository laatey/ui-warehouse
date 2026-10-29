import React from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { NavGroup } from './types'

export interface SidebarProps {
  brandSlot?: React.ReactNode
  groups?: NavGroup[]
  footer?: React.ReactNode
  collapsed: boolean
  onToggle: () => void
  className?: string
}

export function Sidebar({
  brandSlot,
  groups = [],
  footer,
  collapsed,
  onToggle,
  className = ''
}: SidebarProps): React.JSX.Element {
  return (
    <aside
      aria-label="Application navigation"
      className={`relative flex flex-col h-full bg-background border-r border-border transition-all duration-200 select-none ${
        collapsed ? 'w-16' : 'w-60'
      } ${className}`}
    >
      {/* Brand / Workspace Switcher Header */}
      <div className="flex items-center justify-between h-14 px-3 border-b border-border shrink-0">
        <div className="flex items-center gap-2 overflow-hidden">
          {brandSlot}
        </div>
        <button
          type="button"
          onClick={onToggle}
          title={collapsed ? 'Expand sidebar (Ctrl+B)' : 'Collapse sidebar (Ctrl+B)'}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          className="p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-accent transition-colors cursor-pointer"
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Navigation Groups */}
      <nav className="flex-1 overflow-y-auto px-2 py-3 space-y-4">
        {groups.map((group) => (
          <div key={group.id} className="space-y-1">
            {group.title && !collapsed && (
              <h3 className="px-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/70">
                {group.title}
              </h3>
            )}
            <ul className="space-y-0.5">
              {group.items.map((item) => {
                return (
                  <li key={item.id}>
                    <button
                      type="button"
                      onClick={item.onClick}
                      title={collapsed ? item.label : undefined}
                      className={`w-full flex items-center gap-2.5 px-2.5 py-1.5 text-xs rounded-md transition-colors cursor-pointer ${
                        item.active
                          ? 'bg-accent text-foreground font-medium'
                          : 'text-muted-foreground hover:text-foreground hover:bg-accent/50'
                      } ${collapsed ? 'justify-center px-0' : ''}`}
                    >
                      {item.icon && <span className="shrink-0">{item.icon}</span>}
                      {!collapsed && <span className="truncate flex-1 text-left">{item.label}</span>}
                      {!collapsed && item.badge && <span>{item.badge}</span>}
                    </button>
                  </li>
                )
              })}
            </ul>
          </div>
        ))}
      </nav>

      {/* Footer */}
      {footer && (
        <div className="border-t border-border p-2 shrink-0">
          {footer}
        </div>
      )}
    </aside>
  )
}
