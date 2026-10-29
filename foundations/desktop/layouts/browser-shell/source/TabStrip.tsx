import React from 'react'
import { Plus, X, Globe, Pin } from 'lucide-react'
import { TabItemData } from './types'

export interface TabStripProps {
  tabs: TabItemData[]
  activeTabId: string
  onSelectTab: (id: string) => void
  onCloseTab?: (id: string) => void
  onNewTab?: () => void
  onTogglePinTab?: (id: string) => void
  className?: string
}

export function TabStrip({
  tabs,
  activeTabId,
  onSelectTab,
  onCloseTab,
  onNewTab,
  className = ''
}: TabStripProps): React.JSX.Element {
  return (
    <div
      role="tablist"
      aria-label="Browser tabs"
      className={`h-9 bg-muted/60 border-b border-border flex items-center px-2 gap-1 overflow-x-auto no-scrollbar select-none shrink-0 ${className}`}
    >
      {tabs.map((tab) => {
        const active = tab.id === activeTabId
        return (
          <div
            key={tab.id}
            role="tab"
            aria-selected={active}
            onClick={() => onSelectTab(tab.id)}
            className={`group relative flex items-center h-7 rounded-md px-2.5 text-xs transition-colors cursor-pointer ${
              tab.isPinned ? 'w-8 shrink-0 justify-center px-0' : 'min-w-[100px] max-w-[180px] flex-1'
            } ${
              active
                ? 'bg-background text-foreground shadow-xs font-medium'
                : 'text-muted-foreground hover:bg-background/50 hover:text-foreground'
            }`}
          >
            {tab.isLoading ? (
              <span className="w-3.5 h-3.5 shrink-0 rounded-full border border-muted-foreground/30 border-t-foreground animate-spin mr-1.5" />
            ) : tab.favicon ? (
              <img src={tab.favicon} alt="" className="w-3.5 h-3.5 shrink-0 rounded-xs mr-1.5" />
            ) : (
              <Globe className="w-3.5 h-3.5 shrink-0 text-muted-foreground mr-1.5" />
            )}

            {!tab.isPinned && (
              <span className="truncate flex-1 text-left">
                {tab.title || 'New Tab'}
              </span>
            )}

            {!tab.isPinned && onCloseTab && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  onCloseTab(tab.id)
                }}
                title="Close tab"
                aria-label={`Close tab ${tab.title}`}
                className="opacity-0 group-hover:opacity-100 hover:bg-muted p-0.5 rounded-xs transition-opacity ml-1"
              >
                <X className="w-3 h-3 text-muted-foreground hover:text-foreground" />
              </button>
            )}
          </div>
        )
      })}

      {onNewTab && (
        <button
          type="button"
          onClick={onNewTab}
          title="New tab"
          aria-label="Open new tab"
          className="p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-background/60 transition-colors shrink-0 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
        </button>
      )}
    </div>
  )
}
