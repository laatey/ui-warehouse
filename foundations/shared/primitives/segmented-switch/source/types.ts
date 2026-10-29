import React from 'react'

export interface SegmentedSwitchOption<T extends string = string> {
  value: T
  icon?: React.ReactNode
  label?: React.ReactNode
  title?: string
}

export interface SegmentedSwitchProps<T extends string = string> {
  options: SegmentedSwitchOption<T>[]
  value: T
  onChange: (value: T) => void
  itemWidth?: number
  height?: number
  className?: string
}
