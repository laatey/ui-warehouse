import React from 'react'
import { ChevronLeft } from 'lucide-react'
import { BottomNav } from './BottomNav'
import { MobileBottomNavShellProps } from './types'

export function MobileBottomNavShell({
  title,
  onBack,
  headerActions,
  navItems = [],
  children,
  className = ''
}: MobileBottomNavShellProps): React.JSX.Element {
  return (
    <div className={`flex flex-col min-h-screen w-full bg-background text-foreground pb-16 ${className}`}>
      {/* Sticky Mobile Top App Bar */}
      {(title || onBack || headerActions) && (
        <header className="sticky top-0 z-30 flex items-center justify-between h-13 px-4 bg-background/95 backdrop-blur-md border-b border-border pt-[env(safe-area-inset-top)] select-none">
          <div className="flex items-center gap-2 min-w-0">
            {onBack && (
              <button
                type="button"
                onClick={onBack}
                aria-label="Back"
                className="p-1 -ml-1 rounded-full text-muted-foreground hover:text-foreground hover:bg-accent transition-colors cursor-pointer"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
            )}
            {title && (
              <h1 className="text-sm font-semibold tracking-tight text-foreground truncate">
                {title}
              </h1>
            )}
          </div>

          <div className="flex items-center gap-2 ml-auto shrink-0">
            {headerActions}
          </div>
        </header>
      )}

      {/* Main Content Area (Empty by default) */}
      <main role="main" className="flex-1 w-full overflow-y-auto">
        {children}
      </main>

      {/* Fixed Bottom Navigation Bar */}
      <BottomNav items={navItems} />
    </div>
  )
}
