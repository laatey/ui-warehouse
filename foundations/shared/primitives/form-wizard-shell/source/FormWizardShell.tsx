import React, { useState } from 'react'
import { FormWizardShellProps } from './types'

function CheckIcon(): React.JSX.Element {
  return (
    <svg viewBox="0 0 16 16" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="M3.5 8.5l3 3 6-7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export function FormWizardShell({
  steps,
  activeStepId,
  defaultStepId,
  onStepChange,
  onSubmit,
  canProceed = true,
  submitting = false,
  allowJumpBack = true,
  backLabel = 'Back',
  nextLabel = 'Next',
  submitLabel = 'Submit',
  title,
  children,
  footerExtra,
  className = ''
}: FormWizardShellProps): React.JSX.Element {
  const [internalId, setInternalId] = useState(defaultStepId ?? steps[0]?.id)
  const currentId = activeStepId ?? internalId
  const index = Math.max(0, steps.findIndex((s) => s.id === currentId))
  const step = steps[index]
  const isFirst = index === 0
  const isLast = index === steps.length - 1
  const proceedOk = typeof canProceed === 'function' ? canProceed(step?.id ?? '') : canProceed

  const goTo = (i: number) => {
    const target = steps[i]
    if (!target) return
    setInternalId(target.id)
    onStepChange?.(target.id)
  }

  const handlePrimary = () => {
    if (!proceedOk || submitting) return
    if (isLast) void onSubmit?.()
    else goTo(index + 1)
  }

  return (
    <div className={`flex flex-col w-full min-h-0 ${className}`}>
      {title && <h2 className="text-lg font-semibold text-foreground mb-4">{title}</h2>}

      <nav aria-label="Progress">
        <ol className="flex items-center gap-2 overflow-x-auto pb-1">
          {steps.map((s, i) => {
            const done = i < index
            const active = i === index
            const clickable = allowJumpBack && done
            return (
              <li key={s.id} className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  disabled={!clickable}
                  onClick={() => clickable && goTo(i)}
                  aria-current={active ? 'step' : undefined}
                  className={`flex items-center gap-2 rounded-md px-2 py-1 text-xs transition-colors ${
                    clickable ? 'cursor-pointer hover:bg-accent/50' : 'cursor-default'
                  }`}
                >
                  <span
                    className={`flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-medium border ${
                      active
                        ? 'bg-primary text-primary-foreground border-primary'
                        : done
                          ? 'bg-muted text-foreground border-border'
                          : 'bg-background text-muted-foreground border-border'
                    }`}
                  >
                    {done ? <CheckIcon /> : i + 1}
                  </span>
                  <span className={active ? 'font-medium text-foreground' : 'text-muted-foreground'}>
                    {s.label}
                    {s.optional && <span className="ml-1 text-muted-foreground/70">(optional)</span>}
                  </span>
                </button>
                {i < steps.length - 1 && <span aria-hidden="true" className="h-px w-6 bg-border" />}
              </li>
            )
          })}
        </ol>
      </nav>

      {step?.description && <p className="mt-3 text-xs text-muted-foreground">{step.description}</p>}

      {/* Empty step content slot */}
      <div className="flex-1 min-h-0 py-6" role="group" aria-label={step?.label}>
        {typeof children === 'function' ? children(step, index) : children}
      </div>

      <div className="flex items-center justify-between gap-3 border-t border-border pt-4">
        <div className="text-xs text-muted-foreground">{footerExtra}</div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => goTo(index - 1)}
            disabled={isFirst || submitting}
            className="px-3 py-1.5 text-sm rounded-md border border-border text-foreground hover:bg-accent disabled:opacity-40 disabled:pointer-events-none cursor-pointer"
          >
            {backLabel}
          </button>
          <button
            type="button"
            onClick={handlePrimary}
            disabled={!proceedOk || submitting}
            aria-busy={submitting || undefined}
            className="px-3 py-1.5 text-sm rounded-md bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-40 disabled:pointer-events-none cursor-pointer"
          >
            {isLast ? submitLabel : nextLabel}
          </button>
        </div>
      </div>
    </div>
  )
}
