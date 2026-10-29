import React from 'react'
import { ChevronLeft } from 'lucide-react'
import { MobileBlankScreenProps } from './types'

export function MobileBlankScreen({
  title,
  onBack,
  actions,
  children,
  footer,
  className = ''
}: MobileBlankScreenProps): React.JSX.Element {
  return (
    <div className={`flex flex-col min-h-screen w-full bg-background text-foreground ${className}`}>
      {/* Sticky Top Header */}
      {(title || onBack || actions) && (
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
            {actions}
          </div>
        </header>
      )}

      {/* Main Empty Content Container */}
      <main role="main" className="flex-1 w-full p-4 overflow-y-auto">
        {children}
      </main>

      {/* Optional Sticky/Fixed Footer Action Container */}
      {footer && (
        <div className="sticky bottom-0 z-20 w-full p-4 bg-background/95 backdrop-blur-md border-t border-border pb-[calc(1rem+env(safe-area-inset-bottom))]">
          {footer}
        </div>
      )}
    </div>
  )
}
