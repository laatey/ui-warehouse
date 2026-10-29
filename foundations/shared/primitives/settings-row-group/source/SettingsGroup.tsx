import React from 'react'
import { SettingsGroupProps } from './types'

export function SettingsGroup({
  title,
  description,
  actions,
  children,
  className = ''
}: SettingsGroupProps): React.JSX.Element {
  return (
    <section className={`space-y-3 ${className}`}>
      {(title || description || actions) && (
        <header className="flex items-end justify-between gap-4">
          <div className="space-y-0.5 min-w-0">
            {title && <h3 className="text-sm font-semibold text-foreground">{title}</h3>}
            {description && <p className="text-xs text-muted-foreground">{description}</p>}
          </div>
          {actions && <div className="shrink-0">{actions}</div>}
        </header>
      )}
      {/* Empty by default: drop SettingsRow children in here */}
      <div className="rounded-lg border border-border bg-background divide-y divide-border">{children}</div>
    </section>
  )
}
