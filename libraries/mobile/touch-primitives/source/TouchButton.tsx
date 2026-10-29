import React from 'react'
import { TouchButtonProps } from './types'

export function TouchButton({
  variant = 'default',
  size = 'md',
  children,
  className = '',
  disabled,
  ...props
}: TouchButtonProps): React.JSX.Element {
  const baseClasses =
    'inline-flex items-center justify-center font-medium transition-all select-none cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring active:scale-[0.97] touch-manipulation'

  const sizeClasses = {
    sm: 'h-9 px-3 text-xs rounded-lg min-h-[36px]',
    md: 'h-11 px-4 text-sm rounded-xl min-h-[44px]',
    lg: 'h-13 px-6 text-base rounded-2xl min-h-[52px]'
  }[size]

  const variantClasses = {
    default: 'bg-primary text-primary-foreground hover:bg-primary/90 shadow-xs',
    secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
    outline: 'border border-border bg-background hover:bg-accent text-foreground',
    ghost: 'hover:bg-accent text-foreground'
  }[variant]

  const disabledClasses = disabled ? 'opacity-50 pointer-events-none' : ''

  return (
    <button
      disabled={disabled}
      className={`${baseClasses} ${sizeClasses} ${variantClasses} ${disabledClasses} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}
