import React from 'react'

export interface ChartRangeOption {
  value: string
  label: string
}

export type ChartPanelStatus = 'ready' | 'loading' | 'empty' | 'error'

export interface ChartPanelShellProps {
  title: React.ReactNode
  description?: React.ReactNode
  actions?: React.ReactNode
  /** Time-range (or any) selector shown in the header. */
  ranges?: ChartRangeOption[]
  range?: string
  onRangeChange?: (value: string) => void
  status?: ChartPanelStatus
  emptyMessage?: React.ReactNode
  errorMessage?: React.ReactNode
  onRetry?: () => void
  /** Fixed plot-area height so loading/empty/error do not cause layout shift. */
  height?: number | string
  /** Legend slot rendered under the plot area. */
  legend?: React.ReactNode
  footer?: React.ReactNode
  /** Chart slot: bring any chart library. */
  children?: React.ReactNode
  className?: string
}
