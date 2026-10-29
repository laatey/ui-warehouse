import React from 'react'

export interface WizardStep {
  id: string
  label: string
  description?: string
  optional?: boolean
}

export interface FormWizardShellProps {
  steps: WizardStep[]
  /** Controlled active step. Omit for uncontrolled. */
  activeStepId?: string
  defaultStepId?: string
  onStepChange?: (stepId: string) => void
  /** Called from the last step's primary button. */
  onSubmit?: () => void | Promise<void>
  /** Gate the Next/Submit button. Boolean, or a function of the active step id. */
  canProceed?: boolean | ((stepId: string) => boolean)
  submitting?: boolean
  /** Let people click back to steps they have already passed. Default true. */
  allowJumpBack?: boolean
  backLabel?: string
  nextLabel?: string
  submitLabel?: string
  title?: React.ReactNode
  /** Empty step content slot: node, or a render function of the active step. */
  children?: React.ReactNode | ((step: WizardStep, index: number) => React.ReactNode)
  footerExtra?: React.ReactNode
  className?: string
}
