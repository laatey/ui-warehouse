import React, { useEffect, useState } from 'react'
import { Sidebar } from './Sidebar'
import { Header } from './Header'
import { SidebarShellProps } from './types'

export function AppShell({
  brandSlot,
  navGroups = [],
  sidebarFooter,
  title,
  breadcrumbs,
  headerActions,
  children,
  defaultCollapsed = false,
  className = ''
}: SidebarShellProps): React.JSX.Element {
  const [collapsed, setCollapsed] = useState(defaultCollapsed)
  const [mobileOpen, setMobileOpen] = useState(false)

  // Keyboard shortcut Ctrl+B / Cmd+B to toggle sidebar
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'b') {
        e.preventDefault()
        setCollapsed((prev) => !prev)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  return (
    <div className={`flex h-screen w-full bg-background text-foreground overflow-hidden ${className}`}>
      {/* Desktop Sidebar */}
      <div className="hidden md:flex h-full shrink-0">
        <Sidebar
          brandSlot={brandSlot}
          groups={navGroups}
          footer={sidebarFooter}
          collapsed={collapsed}
          onToggle={() => setCollapsed((prev) => !prev)}
        />
      </div>

      {/* Mobile Drawer Backdrop & Sidebar */}
      {mobileOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex md:hidden"
        >
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
            onClick={() => setMobileOpen(false)}
          />
          <div className="relative z-10 w-64 h-full bg-background shadow-xl">
            <Sidebar
              brandSlot={brandSlot}
              groups={navGroups}
              footer={sidebarFooter}
              collapsed={false}
              onToggle={() => setMobileOpen(false)}
            />
          </div>
        </div>
      )}

      {/* Main Layout Area */}
      <div className="flex flex-col flex-1 min-w-0 h-full overflow-hidden">
        <Header
          breadcrumbs={breadcrumbs}
          title={title}
          actions={headerActions}
          onMobileMenuToggle={() => setMobileOpen(true)}
        />

        {/* Empty Main Content Container (Structural only, no forced styling) */}
        <main
          role="main"
          className="flex-1 min-w-0 overflow-y-auto"
        >
          {children}
        </main>
      </div>
    </div>
  )
}
