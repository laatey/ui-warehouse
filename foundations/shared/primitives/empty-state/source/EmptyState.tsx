import React from 'react'
import { EmptyStateProps } from './types'

const SIZES = {
  sm: { pad: 'py-6 px-4', title: 'text-sm', desc: 'text-xs', icon: 'h-8 w-8', gap: 'gap-1.5' },
  md: { pad: 'py-12 px-6', title: 'text-base', desc: 'text-sm', icon: 'h-10 w-10', gap: 'gap-2' },
  lg: { pad: 'py-20 px-8', title: 'text-lg', desc: 'text-sm', icon: 'h-12 w-12', gap: 'gap-3' }
} as const

export function EmptyState({
  icon,
  title,
  description,
  primaryAction,
  secondaryAction,
  size = 'md',
  bordered = false,
  children,
  className = ''
}: EmptyStateProps): React.JSX.Element {
  const s = SIZES[size]
  return (
    <div
      className={`flex flex-col items-center justify-center text-center w-full ${s.pad} ${s.gap} ${
        bordered ? 'rounded-lg border border-dashed border-border' : ''
      } ${className}`}
    >
      {icon && (
        <div className={`flex items-center justify-center rounded-full bg-muted text-muted-foreground ${s.icon}`}>
          {icon}
        </div>
      )}
      <h3 className={`font-medium text-foreground ${s.title}`}>{title}</h3>
      {description && <p className={`max-w-sm text-muted-foreground ${s.desc}`}>{description}</p>}
      {children}
      {(primaryAction || secondaryAction) && (
        <div className="mt-2 flex flex-wrap items-center justify-center gap-2">
          {primaryAction}
          {secondaryAction}
        </div>
      )}
    </div>
  )
}
