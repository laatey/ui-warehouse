import React, { useState } from 'react'
import { Header } from './Header'
import { InspectorPanel } from './InspectorPanel'
import { AssistantWorkspaceShellProps } from './types'

export function AppShell({
  mode,
  onModeChange,
  modeOptions,
  sidebar,
  sidebarTitle,
  defaultSidebarOpen = true,
  children,
  inspectorTabs,
  activeInspectorTabId,
  onInspectorTabChange,
  inspectorOpen: controlledInspectorOpen,
  onInspectorOpenChange,
  headerActions,
  canGoBack,
  canGoForward,
  onGoBack,
  onGoForward,
  className = ''
}: AssistantWorkspaceShellProps): React.JSX.Element {
  const [uncontrolledSidebarOpen, setUncontrolledSidebarOpen] = useState(defaultSidebarOpen)
  const [uncontrolledInspectorOpen, setUncontrolledInspectorOpen] = useState(false)

  const isInspectorControlled = controlledInspectorOpen !== undefined
  const inspectorOpen = isInspectorControlled ? controlledInspectorOpen : uncontrolledInspectorOpen
  const setInspectorOpen = (open: boolean) => {
    if (!isInspectorControlled) setUncontrolledInspectorOpen(open)
    onInspectorOpenChange?.(open)
  }

  const hasInspector = Boolean(inspectorTabs && inspectorTabs.length > 0)

  return (
    <div className={`flex flex-col h-screen w-full bg-background text-foreground overflow-hidden ${className}`}>
      <Header
        mode={mode}
        onModeChange={onModeChange}
        modeOptions={modeOptions}
        sidebarOpen={uncontrolledSidebarOpen}
        onToggleSidebar={() => setUncontrolledSidebarOpen((prev) => !prev)}
        sidebarTitle={sidebarTitle}
        inspectorOpen={inspectorOpen}
        onToggleInspector={() => setInspectorOpen(!inspectorOpen)}
        hasInspector={hasInspector}
        canGoBack={canGoBack}
        canGoForward={canGoForward}
        onGoBack={onGoBack}
        onGoForward={onGoForward}
        actions={headerActions}
      />

      <div className="flex flex-1 min-h-0 relative overflow-hidden">
        {/* Left Sidebar */}
        {sidebar && (
          <aside
            aria-label="Navigation sidebar"
            className={`transition-[width] duration-200 ease-out border-r border-border bg-background shrink-0 overflow-hidden ${
              uncontrolledSidebarOpen ? 'w-64' : 'w-0 border-r-0'
            }`}
          >
            <div className="w-64 h-full overflow-y-auto">
              {sidebar}
            </div>
          </aside>
        )}

        {/* Center Main Content (Blank by default for future applications) */}
        <main
          role="main"
          className="flex-1 min-w-0 h-full overflow-y-auto flex flex-col relative"
        >
          {children}
        </main>

        {/* Right Inspector Panel */}
        {hasInspector && inspectorTabs && (
          <div
            className={`transition-[width] duration-200 ease-out shrink-0 overflow-hidden ${
              inspectorOpen ? 'w-80' : 'w-0'
            }`}
          >
            <div className="w-80 h-full">
              <InspectorPanel
                tabs={inspectorTabs}
                activeTabId={activeInspectorTabId}
                onTabChange={onInspectorTabChange}
                onClose={() => setInspectorOpen(false)}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
