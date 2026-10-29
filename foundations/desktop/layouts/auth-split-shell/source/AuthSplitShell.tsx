import React from 'react'
import { AuthSplitShellProps } from './types'

export function AuthSplitShell({
  header,
  children,
  aside,
  footer,
  className = ''
}: AuthSplitShellProps): React.JSX.Element {
  return (
    <div className={`grid min-h-screen w-full bg-background lg:grid-cols-2 ${className}`}>
      {/* Primary Column (Form Container) */}
      <div className="flex flex-col justify-between px-6 py-8 sm:px-12 lg:px-16 min-h-screen">
        <div className="w-full">
          {header}
        </div>

        <div className="mx-auto flex w-full max-w-sm flex-1 flex-col justify-center py-10">
          {children}
        </div>

        {footer && (
          <div className="w-full text-xs text-muted-foreground pt-4">
            {footer}
          </div>
        )}
      </div>

      {/* Secondary Column (Aside Slot for Visuals, Testimonials, Preview) */}
      <div className="relative hidden overflow-hidden border-l border-border bg-muted/30 lg:flex items-center justify-center p-12">
        {aside}
      </div>
    </div>
  )
}
