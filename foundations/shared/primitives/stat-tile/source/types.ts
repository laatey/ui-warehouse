import React from 'react'

export type StatDeltaDirection = 'up' | 'down' | 'flat'
export type StatDeltaSentiment = 'positive' | 'negative' | 'neutral'

export interface StatDelta {
  value: string
  direction?: StatDeltaDirection
  /** Whether this change is good or bad. Independent of direction (e.g. churn going down is positive). */
  sentiment?: StatDeltaSentiment
  label?: string
}

export interface StatTileProps {
  label: React.ReactNode
  value?: React.ReactNode
  icon?: React.ReactNode
  delta?: StatDelta
  caption?: React.ReactNode
  loading?: boolean
  onClick?: () => void
  /** Override delta colors with your own token classes. */
  sentimentClassNames?: Partial<Record<StatDeltaSentiment, string>>
  /** Optional sparkline / mini-chart slot. */
  children?: React.ReactNode
  className?: string
}
