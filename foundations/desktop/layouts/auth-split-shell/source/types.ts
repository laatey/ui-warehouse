import React from 'react'

export interface AuthSplitShellProps {
  /** Optional top header slot (e.g. brand mark or return link) */
  header?: React.ReactNode
  
  /** Main authentication content container (login/signup form) */
  children: React.ReactNode

  /** Right-hand visual/aside slot (testimonial, illustration, product preview) */
  aside?: React.ReactNode

  /** Optional footer slot (copyright, legal links) */
  footer?: React.ReactNode

  className?: string
}
