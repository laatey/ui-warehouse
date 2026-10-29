import React from 'react'

export interface FormFieldA11yProps {
  id: string
  'aria-describedby'?: string
  'aria-invalid'?: true
  'aria-required'?: true
}

export interface FormFieldProps {
  label: React.ReactNode
  /** Override the generated control id (use when the control already has one). */
  htmlFor?: string
  description?: React.ReactNode
  hint?: React.ReactNode
  error?: React.ReactNode
  required?: boolean
  orientation?: 'vertical' | 'horizontal'
  /** Either a ready control, or a render function that receives the id/aria props to spread onto it. */
  children: React.ReactNode | ((a11y: FormFieldA11yProps) => React.ReactNode)
  className?: string
}

export interface FormSectionProps {
  title?: React.ReactNode
  description?: React.ReactNode
  columns?: 1 | 2 | 3
  actions?: React.ReactNode
  children?: React.ReactNode
  className?: string
}
