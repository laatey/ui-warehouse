import React from 'react'
import { SettingsRowProps } from './types'

export function SettingsRow({
  label,
  description,
  control,
  htmlFor,
  disabled = false,
  danger = false,
  stacked = false,
  className = ''
}: SettingsRowProps): React.JSX.Element {
  const LabelTag = htmlFor ? 'label' : 'span'
  return (
    <div
      aria-disabled={disabled || undefined}
      className={`flex gap-4 px-4 py-3 ${
        stacked ? 'flex-col' : 'flex-col sm:flex-row sm:items-center sm:justify-between'
      } ${disabled ? 'opacity-50' : ''} ${className}`}
    >
      <div className="space-y-0.5 min-w-0">
        <LabelTag
          {...(htmlFor ? { htmlFor } : {})}
          className={`block text-sm font-medium ${danger ? 'text-destructive' : 'text-foreground'}`}
        >
          {label}
        </LabelTag>
        {description && <p className="text-xs text-muted-foreground">{description}</p>}
      </div>
      {control && <div className={`shrink-0 ${disabled ? 'pointer-events-none' : ''}`}>{control}</div>}
    </div>
  )
}
