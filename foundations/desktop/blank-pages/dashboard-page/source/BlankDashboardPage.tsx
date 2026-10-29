import React from 'react'
import { BlankDashboardPageProps } from './types'

export function BlankDashboardPage({
  title,
  description,
  actions,
  filterSlot,
  children,
  footer,
  className = ''
}: BlankDashboardPageProps): React.JSX.Element {
  return (
    <div className={`flex flex-col min-h-full w-full p-6 md:p-8 space-y-6 ${className}`}>
      {/* Page Header */}
      {(title || description || actions) && (
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-border/40">
          <div>
            {title && (
              <h1 className="text-xl md:text-2xl font-semibold tracking-tight text-foreground">
                {title}
              </h1>
            )}
            {description && (
              <p className="text-sm text-muted-foreground mt-1">
                {description}
              </p>
            )}
          </div>
          {actions && (
            <div className="flex items-center gap-2.5 shrink-0">
              {actions}
            </div>
          )}
        </div>
      )}

      {/* Filter / Search Bar Slot */}
      {filterSlot && (
        <div className="w-full">
          {filterSlot}
        </div>
      )}

      {/* Main Content Area (Empty by default) */}
      <div className="flex-1 min-h-[300px] w-full flex flex-col">
        {children}
      </div>

      {/* Footer / Pagination Slot */}
      {footer && (
        <div className="pt-4 border-t border-border/40 w-full">
          {footer}
        </div>
      )}
    </div>
  )
}
