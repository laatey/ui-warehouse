import React, { useState, useEffect } from 'react';
import { PanelLeft, PanelRight, X } from 'lucide-react';
import { DatabaseWorkspaceShellProps } from './types';

export const DatabaseWorkspaceShell: React.FC<DatabaseWorkspaceShellProps> = ({
  primaryNavSlot,
  primaryNavWidth = 56,
  schemaSidebarSlot,
  schemaSidebarWidth = 260,
  showSchemaSidebar: controlledShowSchemaSidebar,
  onToggleSchemaSidebar,
  headerSlot,
  actionToolbarSlot,
  inspectorPanelSlot,
  inspectorPanelWidth = 380,
  showInspectorPanel: controlledShowInspectorPanel,
  onToggleInspectorPanel,
  children,
  className = '',
}) => {
  const [internalShowSchema, setInternalShowSchema] = useState(true);
  const [internalShowInspector, setInternalShowInspector] = useState(false);

  const showSchema = controlledShowSchemaSidebar !== undefined ? controlledShowSchemaSidebar : internalShowSchema;
  const showInspector = controlledShowInspectorPanel !== undefined ? controlledShowInspectorPanel : internalShowInspector;

  const toggleSchema = () => {
    if (onToggleSchemaSidebar) onToggleSchemaSidebar();
    else setInternalShowSchema(!internalShowSchema);
  };

  const toggleInspector = () => {
    if (onToggleInspectorPanel) onToggleInspectorPanel();
    else setInternalShowInspector(!internalShowInspector);
  };

  // Keyboard shortcut Ctrl+B / Cmd+B to toggle secondary schema sidebar
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'b') {
        e.preventDefault();
        toggleSchema();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showSchema, onToggleSchemaSidebar]);

  return (
    <div className={`flex h-screen w-screen overflow-hidden bg-background text-foreground ${className}`}>
      {/* 1. Primary Service Navigation Rail (Icon Rail) */}
      {primaryNavSlot && (
        <aside
          style={{ width: `${primaryNavWidth}px` }}
          className="shrink-0 border-r border-border bg-card flex flex-col items-center py-3 z-30 select-none"
          aria-label="Service Rail"
        >
          {primaryNavSlot}
        </aside>
      )}

      {/* 2. Secondary Schema & Entity Explorer Sidebar */}
      {schemaSidebarSlot && (
        <aside
          style={{ width: showSchema ? `${schemaSidebarWidth}px` : 0 }}
          className="shrink-0 border-r border-border bg-card/60 backdrop-blur-sm overflow-hidden transition-all duration-200 flex flex-col z-20"
          aria-label="Schema and Table Explorer"
        >
          <div style={{ width: `${schemaSidebarWidth}px` }} className="h-full flex flex-col">
            {schemaSidebarSlot}
          </div>
        </aside>
      )}

      {/* 3. Main Workspace Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        {/* Top Header / Breadcrumb Bar */}
        <header className="h-12 border-b border-border bg-card px-4 flex items-center justify-between shrink-0 select-none z-10">
          <div className="flex items-center gap-3">
            {schemaSidebarSlot && (
              <button
                type="button"
                onClick={toggleSchema}
                className={`p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors ${
                  showSchema ? 'bg-muted text-foreground' : ''
                }`}
                title="Toggle Schema Sidebar (Ctrl+B)"
                aria-label="Toggle Schema Sidebar"
              >
                <PanelLeft className="w-4 h-4" />
              </button>
            )}

            {headerSlot || <span className="font-semibold text-sm">Database Workspace</span>}
          </div>

          {inspectorPanelSlot && (
            <button
              type="button"
              onClick={toggleInspector}
              className={`p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors ${
                showInspector ? 'bg-muted text-foreground' : ''
              }`}
              title="Toggle Inspector"
              aria-label="Toggle Inspector"
            >
              <PanelRight className="w-4 h-4" />
            </button>
          )}
        </header>

        {/* Secondary Action / Filter Toolbar */}
        {actionToolbarSlot && (
          <div className="h-11 border-b border-border bg-muted/25 px-4 flex items-center justify-between gap-4 shrink-0 z-10 overflow-x-auto">
            {actionToolbarSlot}
          </div>
        )}

        {/* Main Stage & Right Inspector */}
        <div className="flex-1 flex overflow-hidden relative">
          {/* Main Data Stage (Blank Container) */}
          <main className="flex-1 overflow-auto relative bg-background">
            {children}
          </main>

          {/* Right Inspector Panel (Derived from Supabase LayoutSidebar) */}
          {inspectorPanelSlot && (
            <aside
              style={{ width: showInspector ? `${inspectorPanelWidth}px` : 0 }}
              className="shrink-0 border-l border-border bg-card overflow-hidden transition-all duration-200 ease-out flex flex-col z-20 shadow-xl"
              aria-label="Database Inspector"
            >
              <div style={{ width: `${inspectorPanelWidth}px` }} className="h-full flex flex-col">
                <div className="h-12 border-b border-border px-4 flex items-center justify-between shrink-0">
                  <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Inspector
                  </span>
                  <button
                    type="button"
                    onClick={toggleInspector}
                    className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                    aria-label="Close Inspector"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <div className="flex-1 overflow-auto p-4">
                  {inspectorPanelSlot}
                </div>
              </div>
            </aside>
          )}
        </div>
      </div>
    </div>
  );
};
