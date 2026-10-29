import React from 'react'
import { SegmentedSwitchProps } from './types'

export function SegmentedSwitch<T extends string = string>({
  options,
  value,
  onChange,
  itemWidth = 36,
  height = 30,
  className = ''
}: SegmentedSwitchProps<T>): React.JSX.Element {
  const activeIndex = options.findIndex((opt) => opt.value === value)
  const totalWidth = options.length * itemWidth

  return (
    <div
      role="radiogroup"
      aria-label="Mode selection"
      className={`relative inline-flex items-center rounded-lg bg-muted p-0.5 overflow-hidden select-none shrink-0 ${className}`}
      style={{ width: `${totalWidth}px`, height: `${height}px` }}
    >
      {/* Sliding Active Pill Thumb */}
      <div
        className="absolute inset-y-0.5 left-0 rounded-md bg-background shadow-xs transition-transform duration-200 ease-out pointer-events-none"
        style={{
          width: `${itemWidth}px`,
          transform: `translateX(${Math.max(0, activeIndex) * itemWidth}px)`
        }}
      />

      {options.map((option) => {
        const isActive = option.value === value
        return (
          <button
            key={option.value}
            type="button"
            role="radio"
            aria-checked={isActive}
            onClick={() => onChange(option.value)}
            title={option.title || (typeof option.label === 'string' ? option.label : undefined)}
            style={{ width: `${itemWidth}px` }}
            className="group relative z-10 h-full flex items-center justify-center bg-transparent cursor-pointer select-none focus:outline-none"
          >
            {option.icon ? (
              <span
                className={`flex items-center justify-center transition-colors duration-150 ${
                  isActive ? 'text-foreground' : 'text-muted-foreground group-hover:text-foreground'
                }`}
              >
                {option.icon}
              </span>
            ) : null}
            {option.label ? (
              <span
                className={`text-xs transition-colors duration-150 ${
                  isActive ? 'text-foreground font-medium' : 'text-muted-foreground group-hover:text-foreground'
                }`}
              >
                {option.label}
              </span>
            ) : null}
          </button>
        )
      })}
    </div>
  )
}
