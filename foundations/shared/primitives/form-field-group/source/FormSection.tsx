import React from 'react'
import { FormSectionProps } from './types'

const GRID: Record<1 | 2 | 3, string> = {
  1: 'grid-cols-1',
  2: 'grid-cols-1 md:grid-cols-2',
  3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
}

export function FormSection({
  title,
  description,
  columns = 1,
  actions,
  children,
  className = ''
}: FormSectionProps): React.JSX.Element {
  return (
    <section className={`space-y-4 ${className}`}>
      {(title || description || actions) && (
        <header className="flex items-start justify-between gap-4 pb-3 border-b border-border">
          <div className="space-y-0.5 min-w-0">
            {title && <h3 className="text-sm font-semibold text-foreground">{title}</h3>}
            {description && <p className="text-xs text-muted-foreground">{description}</p>}
          </div>
          {actions && <div className="shrink-0">{actions}</div>}
        </header>
      )}
      {/* Empty by default: drop FormField children in here */}
      <div className={`grid gap-4 ${GRID[columns]}`}>{children}</div>
    </section>
  )
}
