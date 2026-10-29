import React from 'react'

export interface SettingsGroupProps {
  title?: React.ReactNode
  description?: React.ReactNode
  actions?: React.ReactNode
  children?: React.ReactNode
  className?: string
}

export interface SettingsRowProps {
  label: React.ReactNode
  description?: React.ReactNode
  /** The control: switch, select, button, input... */
  control?: React.ReactNode
  /** Associates the label with a control by id. */
  htmlFor?: string
  disabled?: boolean
  /** Destructive styling for rows like "Delete workspace". */
  danger?: boolean
  /** Stack the control under the label (for wide inputs). */
  stacked?: boolean
  className?: string
}
