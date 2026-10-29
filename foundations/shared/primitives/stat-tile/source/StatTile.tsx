import React from 'react'
import { StatTileProps, StatDeltaDirection, StatDeltaSentiment } from './types'

const DEFAULT_SENTIMENT: Record<StatDeltaSentiment, string> = {
  positive: 'text-emerald-600 dark:text-emerald-500',
  negative: 'text-destructive',
  neutral: 'text-muted-foreground'
}

const ARROW: Record<StatDeltaDirection, string> = { up: '▲', down: '▼', flat: '–' }

export function StatTile({
  label,
  value,
  icon,
  delta,
  caption,
  loading = false,
  onClick,
  sentimentClassNames,
  children,
  className = ''
}: StatTileProps): React.JSX.Element {
  const interactive = typeof onClick === 'function'
  const colors = { ...DEFAULT_SENTIMENT, ...sentimentClassNames }
  const direction = delta?.direction ?? 'flat'
  const sentiment = delta?.sentiment ?? 'neutral'

  const body = (
    <>
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs font-medium text-muted-foreground truncate">{label}</span>
        {icon && <span className="shrink-0 text-muted-foreground">{icon}</span>}
      </div>

      {loading ? (
        <div className="mt-2 h-7 w-24 animate-pulse rounded bg-muted" role="status" aria-label="Loading" />
      ) : (
        <div className="mt-1.5 text-2xl font-semibold tracking-tight text-foreground tabular-nums">
          {value ?? '—'}
        </div>
      )}

      {(delta || caption) && !loading && (
        <div className="mt-1 flex items-center gap-1.5 text-xs">
          {delta && (
            <span className={`inline-flex items-center gap-1 font-medium ${colors[sentiment]}`}>
              <span aria-hidden="true" className="text-[8px]">
                {ARROW[direction]}
              </span>
              <span>
                <span className="sr-only">{direction === 'up' ? 'Up ' : direction === 'down' ? 'Down ' : 'No change '}</span>
                {delta.value}
              </span>
            </span>
          )}
          {delta?.label && <span className="text-muted-foreground">{delta.label}</span>}
          {caption && <span className="text-muted-foreground">{caption}</span>}
        </div>
      )}

      {children && <div className="mt-3">{children}</div>}
    </>
  )

  const base = `block w-full text-left rounded-lg border border-border bg-background p-4 ${className}`
  return interactive ? (
    <button type="button" onClick={onClick} className={`${base} cursor-pointer transition-colors hover:bg-accent/40`}>
      {body}
    </button>
  ) : (
    <div className={base}>{body}</div>
  )
}
