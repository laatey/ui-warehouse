import React from 'react'

export interface ModalOverlayProps {
  tone?: 'light' | 'blurred'
  onClick?: () => void
  className?: string
}

const TONES = {
  light: 'fixed inset-0 z-50 bg-black/50 transition-opacity',
  blurred: 'fixed inset-0 z-50 bg-black/60 backdrop-blur-xs transition-opacity'
}

export function ModalOverlay({
  tone = 'light',
  onClick,
  className = ''
}: ModalOverlayProps): React.JSX.Element {
  return (
    <div
      aria-hidden="true"
      onClick={onClick}
      className={`${TONES[tone]} ${className}`}
    />
  )
}
