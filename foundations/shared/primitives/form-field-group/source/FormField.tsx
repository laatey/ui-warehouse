import React, { useId } from 'react'
import { FormFieldProps, FormFieldA11yProps } from './types'

export function FormField({
  label,
  htmlFor,
  description,
  hint,
  error,
  required = false,
  orientation = 'vertical',
  children,
  className = ''
}: FormFieldProps): React.JSX.Element {
  const generatedId = useId()
  const id = htmlFor ?? generatedId
  const descId = description ? `${id}-description` : undefined
  const hintId = hint && !error ? `${id}-hint` : undefined
  const errorId = error ? `${id}-error` : undefined
  const describedBy = [descId, hintId, errorId].filter(Boolean).join(' ') || undefined

  const a11y: FormFieldA11yProps = {
    id,
    'aria-describedby': describedBy,
    ...(error ? { 'aria-invalid': true as const } : {}),
    ...(required ? { 'aria-required': true as const } : {})
  }

  const control = typeof children === 'function' ? children(a11y) : children
  const horizontal = orientation === 'horizontal'

  return (
    <div
      className={`flex gap-1.5 ${horizontal ? 'flex-col sm:flex-row sm:items-start sm:gap-6' : 'flex-col'} ${className}`}
    >
      <div className={horizontal ? 'sm:w-56 sm:shrink-0 sm:pt-2 space-y-0.5' : 'space-y-0.5'}>
        <label htmlFor={id} className="text-sm font-medium text-foreground leading-none">
          {label}
          {required && (
            <span aria-hidden="true" className="ml-0.5 text-destructive">
              *
            </span>
          )}
        </label>
        {description && (
          <p id={descId} className="text-xs text-muted-foreground">
            {description}
          </p>
        )}
      </div>

      <div className={horizontal ? 'flex-1 min-w-0 space-y-1.5' : 'space-y-1.5'}>
        {control}
        {error ? (
          <p id={errorId} role="alert" className="text-xs text-destructive">
            {error}
          </p>
        ) : hint ? (
          <p id={hintId} className="text-xs text-muted-foreground">
            {hint}
          </p>
        ) : null}
      </div>
    </div>
  )
}
