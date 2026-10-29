import React from 'react'
import { TabStrip } from './TabStrip'
import { OmniboxToolbar } from './OmniboxToolbar'
import { BrowserShellProps } from './types'

export function BrowserShell({
  tabs,
  activeTabId,
  onSelectTab,
  onCloseTab,
  onNewTab,
  onTogglePinTab,
  toolbarState,
  onNavigate,
  onBack,
  onForward,
  onReload,
  onStop,
  toolbarActions,
  children,
  className = ''
}: BrowserShellProps): React.JSX.Element {
  return (
    <div className={`flex flex-col h-screen w-full bg-background text-foreground overflow-hidden ${className}`}>
      {/* Top Tab Strip */}
      <TabStrip
        tabs={tabs}
        activeTabId={activeTabId}
        onSelectTab={onSelectTab}
        onCloseTab={onCloseTab}
        onNewTab={onNewTab}
        onTogglePinTab={onTogglePinTab}
      />

      {/* Navigation Toolbar & Omnibox */}
      <OmniboxToolbar
        state={toolbarState}
        onNavigate={onNavigate}
        onBack={onBack}
        onForward={onForward}
        onReload={onReload}
        onStop={onStop}
        actions={toolbarActions}
      />

      {/* Empty Web View / Content Container */}
      <main
        role="main"
        className="flex-1 min-w-0 h-full overflow-hidden relative bg-background"
      >
        {children}
      </main>
    </div>
  )
}
