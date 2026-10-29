import React from 'react'
import { MobileNavItem } from './types'

export interface BottomNavProps {
  items: MobileNavItem[]
  className?: string
}

export function BottomNav({ items, className = '' }: BottomNavProps): React.JSX.Element {
  return (
    <nav
      aria-label="Bottom Navigation"
      className={`fixed bottom-0 inset-x-0 z-40 bg-background/95 backdrop-blur-md border-t border-border pb-[env(safe-area-inset-bottom)] select-none ${className}`}
    >
      <div className="flex items-center justify-around h-14 max-w-lg mx-auto px-2">
        {items.map((item) => {
          return (
            <button
              key={item.id}
              type="button"
              onClick={item.onClick}
              aria-label={item.label}
              aria-pressed={item.active}
              className={`relative flex flex-col items-center justify-center flex-1 py-1 transition-colors cursor-pointer ${
                item.active ? 'text-primary font-medium' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <div className="relative">
                {item.icon}
                {item.badge !== undefined && (
                  <span className="absolute -top-1 -right-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[9px] font-bold text-primary-foreground">
                    {item.badge}
                  </span>
                )}
              </div>
              <span className="text-[10px] mt-0.5 tracking-tight truncate max-w-[70px]">
                {item.label}
              </span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}
