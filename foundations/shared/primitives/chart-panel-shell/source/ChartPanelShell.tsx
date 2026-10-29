import React from 'react'
import { ChartPanelShellProps } from './types'

export function ChartPanelShell({
  title,
  description,
  actions,
  ranges,
  range,
  onRangeChange,
  status = 'ready',
  emptyMessage = 'No data to display',
  errorMessage = 'Something went wrong loading this chart',
  onRetry,
  height = 280,
  legend,
  footer,
  children,
  className = ''
}: ChartPanelShellProps): React.JSX.Element {
  return (
    <section className={`flex flex-col rounded-lg border border-border bg-background ${className}`}>
      <header className="flex flex-wrap items-start justify-between gap-3 px-4 pt-4">
        <div className="space-y-0.5 min-w-0">
          <h3 className="text-sm font-semibold text-foreground truncate">{title}</h3>
          {description && <p className="text-xs text-muted-foreground">{description}</p>}
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {ranges && ranges.length > 0 && (
            <div role="radiogroup" aria-label="Range" className="inline-flex rounded-md bg-muted p-0.5">
              {ranges.map((r) => {
                const active = r.value === range
                return (
                  <button
                    key={r.value}
                    type="button"
                    role="radio"
                    aria-checked={active}
                    onClick={() => onRangeChange?.(r.value)}
                    className={`px-2 py-1 text-xs rounded-sm transition-colors cursor-pointer ${
                      active ? 'bg-background text-foreground shadow-xs font-medium' : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    {r.label}
                  </button>
                )
              })}
            </div>
          )}
          {actions}
        </div>
      </header>

      <div className="px-4 py-4">
        <div
          style={{ height: typeof height === 'number' ? `${height}px` : height }}
          className="relative w-full"
          aria-busy={status === 'loading' || undefined}
        >
          {status === 'ready' && <div className="absolute inset-0">{children}</div>}

          {status === 'loading' && (
            <div className="absolute inset-0 animate-pulse rounded-md bg-muted/60" role="status" aria-label="Loading" />
          )}

          {status === 'empty' && (
            <div className="absolute inset-0 flex items-center justify-center text-sm text-muted-foreground">
              {emptyMessage}
            </div>
          )}

          {status === 'error' && (
            <div role="alert" className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-sm">
              <span className="text-destructive">{errorMessage}</span>
              {onRetry && (
                <button
                  type="button"
                  onClick={onRetry}
                  className="px-2.5 py-1 text-xs rounded-md border border-border text-foreground hover:bg-accent cursor-pointer"
                >
                  Retry
                </button>
              )}
            </div>
          )}
        </div>
        {legend && status === 'ready' && <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs">{legend}</div>}
      </div>

      {footer && <footer className="border-t border-border px-4 py-3 text-xs text-muted-foreground">{footer}</footer>}
    </section>
  )
}
