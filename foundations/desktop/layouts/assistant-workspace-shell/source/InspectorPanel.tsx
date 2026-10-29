import React from 'react'
import { X } from 'lucide-react'
import { InspectorTab } from './types'

export interface InspectorPanelProps {
  tabs: InspectorTab[]
  activeTabId?: string
  onTabChange?: (id: string) => void
  onClose?: () => void
  className?: string
}

export function InspectorPanel({
  tabs,
  activeTabId,
  onTabChange,
  onClose,
  className = ''
}: InspectorPanelProps): React.JSX.Element {
  const currentTab = tabs.find((t) => t.id === activeTabId) || tabs[0]

  return (
    <aside className={`flex flex-col h-full bg-background border-l border-border select-none ${className}`}>
      <div className="flex items-center justify-between border-b border-border px-2 h-9 shrink-0">
        <div className="flex items-center gap-1 overflow-x-auto no-scrollbar">
          {tabs.map((tab) => {
            const active = tab.id === (currentTab?.id ?? '')
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => onTabChange?.(tab.id)}
                className={`flex items-center gap-1.5 px-2.5 py-1 text-xs rounded-md transition-colors cursor-pointer ${
                  active
                    ? 'bg-accent text-foreground font-medium'
                    : 'text-muted-foreground hover:text-foreground hover:bg-accent/50'
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            )
          })}
        </div>

        {onClose && (
          <button
            type="button"
            onClick={onClose}
            aria-label="Close inspector"
            className="p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-accent transition-colors cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      <div className="flex-1 overflow-auto min-h-0">
        {currentTab?.content}
      </div>
    </aside>
  )
}
