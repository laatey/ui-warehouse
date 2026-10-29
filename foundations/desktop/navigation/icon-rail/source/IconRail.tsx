import React from 'react'
import { IconRailProps } from './types'

export function IconRail({
  topSlot,
  items = [],
  bottomSlot,
  className = ''
}: IconRailProps): React.JSX.Element {
  return (
    <nav
      aria-label="Navigation rail"
      className={`w-12 h-full flex flex-col items-center justify-between py-3 border-r border-border bg-background select-none shrink-0 ${className}`}
    >
      <div className="flex flex-col items-center gap-4 w-full">
        {topSlot && (
          <div className="h-8 w-8 grid place-items-center mb-1">
            {topSlot}
          </div>
        )}

        <div className="flex flex-col items-center gap-1.5 w-full">
          {items.map((item) => {
            return (
              <div key={item.id} className="relative group w-full flex justify-center">
                <button
                  type="button"
                  onClick={item.onClick}
                  title={item.label}
                  aria-label={item.label}
                  aria-pressed={item.active}
                  className={`relative grid h-9 w-9 place-items-center rounded-lg transition-colors cursor-pointer ${
                    item.active
                      ? 'bg-accent text-foreground'
                      : 'text-muted-foreground hover:bg-accent/60 hover:text-foreground'
                  }`}
                >
                  {/* Left edge active indicator pill */}
                  {item.active && (
                    <span className="absolute -left-1.5 h-4 w-1 rounded-r-full bg-primary" />
                  )}

                  {item.icon}

                  {item.badge !== undefined && (
                    <span className="absolute -top-1 -right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold text-primary-foreground">
                      {item.badge}
                    </span>
                  )}
                </button>

                {/* Accessible hover tooltip fallback */}
                <div className="absolute left-full ml-2 hidden group-hover:block z-50 whitespace-nowrap rounded-md bg-popover px-2 py-1 text-xs text-popover-foreground shadow-md border border-border pointer-events-none">
                  {item.label}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {bottomSlot && (
        <div className="flex flex-col items-center gap-2 w-full pt-2">
          {bottomSlot}
        </div>
      )}
    </nav>
  )
}
