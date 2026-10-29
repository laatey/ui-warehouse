import React, { useState } from 'react';
import { PanelLeft, PanelRight, List, Columns3, Calendar, Table, BarChart2, X } from 'lucide-react';
import { ProjectWorkspaceShellProps, ProjectViewMode } from './types';

export const ProjectWorkspaceShell: React.FC<ProjectWorkspaceShellProps> = ({
  sidebarSlot,
  sidebarWidth = 250,
  headerSlot,
  viewMode = 'list',
  onViewModeChange,
  availableViews = ['list', 'kanban', 'calendar', 'gantt', 'table'],
  filterBarSlot,
  peekPanelSlot,
  peekPanelWidth = 460,
  showPeekPanel: controlledShowPeekPanel,
  onTogglePeekPanel,
  children,
  className = '',
}) => {
  const [internalShowSidebar, setInternalShowSidebar] = useState(true);
  const [internalShowPeek, setInternalShowPeek] = useState(false);

  const showPeek = controlledShowPeekPanel !== undefined ? controlledShowPeekPanel : internalShowPeek;

  const togglePeek = () => {
    if (onTogglePeekPanel) onTogglePeekPanel();
    else setInternalShowPeek(!internalShowPeek);
  };

  const viewIcons: Record<ProjectViewMode, { icon: React.FC<{ className?: string }>; label: string }> = {
    list: { icon: List, label: 'List' },
    kanban: { icon: Columns3, label: 'Board' },
    calendar: { icon: Calendar, label: 'Calendar' },
    gantt: { icon: BarChart2, label: 'Gantt' },
    table: { icon: Table, label: 'Table' },
  };

  return (
    <div className={`flex h-screen w-screen overflow-hidden bg-background text-foreground ${className}`}>
      {/* 1. Project / Workspace Navigation Sidebar */}
      {sidebarSlot && (
        <aside
          style={{ width: internalShowSidebar ? `${sidebarWidth}px` : 0 }}
          className="shrink-0 border-r border-border bg-card overflow-hidden transition-all duration-200 flex flex-col z-20"
          aria-label="Project Workspace Navigation"
        >
          <div style={{ width: `${sidebarWidth}px` }} className="h-full flex flex-col">
            {sidebarSlot}
          </div>
        </aside>
      )}

      {/* 2. Main Workspace Body */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        {/* Top Header Bar */}
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

            {headerSlot || <span className="font-semibold text-sm">Project Workspace</span>}
          </div>

          {peekPanelSlot && (
            <button
              type="button"
              onClick={togglePeek}
              className={`p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors ${
                showPeek ? 'bg-muted text-foreground' : ''
              }`}
              title="Toggle Detail Panel"
              aria-label="Toggle Detail Panel"
            >
              <PanelRight className="w-4 h-4" />
            </button>
          )}
        </header>

        {/* View Switcher & Filter Toolbar */}
        <div className="h-12 border-b border-border bg-muted/20 px-4 flex items-center justify-between gap-4 shrink-0 z-10 overflow-x-auto">
          {/* Segmented Layout Switcher (Derived from Plane's LayoutSwitcher) */}
          {onViewModeChange && availableViews.length > 0 && (
            <div className="flex items-center gap-1 bg-muted/60 p-1 rounded-lg border border-border shrink-0">
              {availableViews.map((mode) => {
                const config = viewIcons[mode];
                const IconComponent = config.icon;
                const isActive = viewMode === mode;
                return (
                  <button
                    key={mode}
                    type="button"
                    onClick={() => onViewModeChange(mode)}
                    className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
                      isActive
                        ? 'bg-background text-foreground shadow-sm'
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                    title={config.label}
                    aria-label={config.label}
                  >
                    <IconComponent className="w-3.5 h-3.5" />
                    <span>{config.label}</span>
                  </button>
                );
              })}
            </div>
          )}

          {/* Filter Bar Slot */}
          {filterBarSlot && (
            <div className="flex items-center gap-2 flex-1 justify-end">
              {filterBarSlot}
            </div>
          )}
        </div>

        {/* Main Workspace Stage & Split Peek Panel */}
        <div className="flex-1 flex overflow-hidden relative">
          {/* Primary Viewport (Blank Container) */}
          <main className="flex-1 overflow-auto p-6 relative">
            {children}
          </main>

          {/* Collapsible Issue Detail Peek Panel */}
          {peekPanelSlot && (
            <aside
              style={{ width: showPeek ? `${peekPanelWidth}px` : 0 }}
              className="shrink-0 border-l border-border bg-card overflow-hidden transition-all duration-250 ease-out flex flex-col z-20 shadow-xl"
              aria-label="Issue Detail Panel"
            >
              <div style={{ width: `${peekPanelWidth}px` }} className="h-full flex flex-col">
                <div className="h-12 border-b border-border px-4 flex items-center justify-between shrink-0">
                  <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Issue Details
                  </span>
                  <button
                    type="button"
                    onClick={togglePeek}
                    className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                    aria-label="Close Issue Details"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <div className="flex-1 overflow-auto p-4">
                  {peekPanelSlot}
                </div>
              </div>
            </aside>
          )}
        </div>
      </div>
    </div>
  );
};
