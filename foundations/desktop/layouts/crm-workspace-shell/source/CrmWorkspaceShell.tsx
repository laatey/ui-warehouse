import React, { useState } from 'react';
import { PanelLeft, X } from 'lucide-react';
import { CrmWorkspaceShellProps } from './types';

export const CrmWorkspaceShell: React.FC<CrmWorkspaceShellProps> = ({
  sidebarSlot,
  sidebarWidth = 240,
  topBarSlot,
  filterBarSlot,
  sidePanelSlot,
  sidePanelWidth = 440,
  showSidePanel: controlledShowSidePanel,
  onToggleSidePanel,
  children,
  className = '',
}) => {
  const [internalShowSidebar, setInternalShowSidebar] = useState(true);
  const [internalShowSidePanel, setInternalShowSidePanel] = useState(false);

  const showSidePanel = controlledShowSidePanel !== undefined ? controlledShowSidePanel : internalShowSidePanel;

  const toggleSidePanel = () => {
    if (onToggleSidePanel) onToggleSidePanel();
    else setInternalShowSidePanel(!internalShowSidePanel);
  };

  return (
    <div className={`flex h-screen w-screen overflow-hidden bg-background text-foreground ${className}`}>
      {/* 1. Left CRM Module Sidebar */}
      {sidebarSlot && (
        <aside
          style={{ width: internalShowSidebar ? `${sidebarWidth}px` : 0 }}
          className="shrink-0 border-r border-border bg-card overflow-hidden transition-all duration-200 flex flex-col z-20"
          aria-label="CRM Navigation"
        >
          <div style={{ width: `${sidebarWidth}px` }} className="h-full flex flex-col">
            {sidebarSlot}
          </div>
        </aside>
      )}

      {/* 2. Main Workspace Body */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        {/* Top Header / Identifier Bar */}
        <header className="h-14 border-b border-border bg-card px-4 flex items-center justify-between shrink-0 select-none z-10">
          <div className="flex items-center gap-3">
            {sidebarSlot && (
              <button
                type="button"
                onClick={() => setInternalShowSidebar(!internalShowSidebar)}
                className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                title="Toggle Sidebar"
                aria-label="Toggle Sidebar"
              >
                <PanelLeft className="w-4 h-4" />
              </button>
            )}

            {topBarSlot || <span className="font-semibold text-sm">CRM Workspace</span>}
          </div>
        </header>

        {/* Filter & View Switcher Bar */}
        {filterBarSlot && (
          <div className="h-11 border-b border-border bg-muted/30 px-4 flex items-center justify-between shrink-0 z-10">
            {filterBarSlot}
          </div>
        )}

        {/* Main Content & Slide-out Side Panel Area */}
        <div className="flex-1 flex overflow-hidden relative">
          {/* Main Content Area (Blank Container) */}
          <main className="flex-1 overflow-auto p-6 relative">
            {children}
          </main>

          {/* Slide-out Record Inspector Side Panel (Derived from Twenty's SidePanelForDesktop) */}
          {sidePanelSlot && (
            <aside
              style={{ width: showSidePanel ? `${sidePanelWidth}px` : 0 }}
              className="shrink-0 border-l border-border bg-card overflow-hidden transition-all duration-250 ease-out flex flex-col z-20 shadow-xl"
              aria-label="Record Details"
            >
              <div style={{ width: `${sidePanelWidth}px` }} className="h-full flex flex-col">
                <div className="h-12 border-b border-border px-4 flex items-center justify-between shrink-0">
                  <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Record Details
                  </span>
                  <button
                    type="button"
                    onClick={toggleSidePanel}
                    className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                    aria-label="Close Record Details"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <div className="flex-1 overflow-auto p-4">
                  {sidePanelSlot}
                </div>
              </div>
            </aside>
          )}
        </div>
      </div>
    </div>
  );
};
