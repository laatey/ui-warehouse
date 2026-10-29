import React, { useState } from 'react';
import { PanelLeft, PanelRight, ChevronDown, ChevronUp, Eye, Edit3 } from 'lucide-react';
import { InternalToolBuilderShellProps, BuilderMode } from './types';

export const InternalToolBuilderShell: React.FC<InternalToolBuilderShellProps> = ({
  titleSlot,
  mode = 'edit',
  onModeChange,
  headerActionsSlot,
  leftSidebarSlot,
  leftSidebarWidth = 260,
  showLeftSidebar: controlledLeftSidebar,
  onToggleLeftSidebar,
  rightInspectorSlot,
  rightInspectorWidth = 320,
  showRightInspector: controlledRightInspector,
  onToggleRightInspector,
  bottomDrawerSlot,
  showBottomDrawer: controlledBottomDrawer,
  onToggleBottomDrawer,
  bottomDrawerHeight = 220,
  children,
  showGridLines = true,
  className = '',
}) => {
  const [internalLeft, setInternalLeft] = useState(true);
  const [internalRight, setInternalRight] = useState(true);
  const [internalBottom, setInternalBottom] = useState(false);

  const isLeftOpen = controlledLeftSidebar !== undefined ? controlledLeftSidebar : internalLeft;
  const isRightOpen = controlledRightInspector !== undefined ? controlledRightInspector : internalRight;
  const isBottomOpen = controlledBottomDrawer !== undefined ? controlledBottomDrawer : internalBottom;

  const toggleLeft = () => {
    if (onToggleLeftSidebar) onToggleLeftSidebar();
    else setInternalLeft(!internalLeft);
  };

  const toggleRight = () => {
    if (onToggleRightInspector) onToggleRightInspector();
    else setInternalRight(!internalRight);
  };

  const toggleBottom = () => {
    if (onToggleBottomDrawer) onToggleBottomDrawer();
    else setInternalBottom(!internalBottom);
  };

  const isEdit = mode === 'edit';

  return (
    <div className={`flex flex-col h-screen w-screen overflow-hidden bg-background text-foreground ${className}`}>
      {/* Top Application Bar (3 sections: Left brand/title, Center Edit/Preview toggle, Right actions) */}
      <header className="h-12 border-b border-border bg-card px-4 flex items-center justify-between shrink-0 select-none z-30">
        <div className="flex items-center gap-3">
          {leftSidebarSlot && isEdit && (
            <button
              type="button"
              onClick={toggleLeft}
              className={`p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors ${
                isLeftOpen ? 'bg-muted text-foreground' : ''
              }`}
              title="Toggle Explorer Sidebar"
              aria-label="Toggle Explorer Sidebar"
            >
              <PanelLeft className="w-4 h-4" />
            </button>
          )}

          {titleSlot || <span className="font-semibold text-sm">App Builder</span>}
        </div>

        {/* Center Mode Switcher */}
        <div className="flex items-center bg-muted p-0.5 rounded-lg border border-border">
          <button
            type="button"
            onClick={() => onModeChange && onModeChange('edit')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-medium transition-colors ${
              mode === 'edit'
                ? 'bg-background text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>Edit</span>
          </button>
          <button
            type="button"
            onClick={() => onModeChange && onModeChange('preview')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-medium transition-colors ${
              mode === 'preview'
                ? 'bg-background text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Preview</span>
          </button>
        </div>

        {/* Right Header Actions */}
        <div className="flex items-center gap-2">
          {headerActionsSlot}

          {rightInspectorSlot && isEdit && (
            <button
              type="button"
              onClick={toggleRight}
              className={`p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors ${
                isRightOpen ? 'bg-muted text-foreground' : ''
              }`}
              title="Toggle Property Inspector"
              aria-label="Toggle Property Inspector"
            >
              <PanelRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </header>

      {/* Main Workspace Body */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Left Entity Explorer Sidebar */}
        {leftSidebarSlot && isEdit && (
          <aside
            style={{ width: isLeftOpen ? `${leftSidebarWidth}px` : 0 }}
            className="shrink-0 border-r border-border bg-card overflow-hidden transition-all duration-200 flex flex-col z-20"
            aria-label="Explorer Sidebar"
          >
            <div style={{ width: `${leftSidebarWidth}px` }} className="h-full flex flex-col">
              {leftSidebarSlot}
            </div>
          </aside>
        )}

        {/* Center Stage & Canvas */}
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
          <main
            className={`flex-1 overflow-auto relative p-6 ${
              showGridLines && isEdit
                ? 'bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] dark:bg-[radial-gradient(#27272a_1px,transparent_1px)] [background-size:16px_16px]'
                : 'bg-muted/10'
            }`}
          >
            {children}
          </main>

          {/* Bottom Drawer (Queries/Console) */}
          {bottomDrawerSlot && isEdit && (
            <div
              style={{ height: isBottomOpen ? `${bottomDrawerHeight}px` : '32px' }}
              className="border-t border-border bg-card transition-all duration-200 flex flex-col shrink-0 z-20"
            >
              <div
                onClick={toggleBottom}
                className="h-8 border-b border-border/50 px-3 flex items-center justify-between cursor-pointer text-xs font-medium text-muted-foreground hover:text-foreground select-none"
              >
                <span>Console / Queries</span>
                {isBottomOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
              </div>
              {isBottomOpen && (
                <div className="flex-1 overflow-auto p-3">
                  {bottomDrawerSlot}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right Property Inspector */}
        {rightInspectorSlot && isEdit && (
          <aside
            style={{ width: isRightOpen ? `${rightInspectorWidth}px` : 0 }}
            className="shrink-0 border-l border-border bg-card overflow-hidden transition-all duration-200 flex flex-col z-20"
            aria-label="Property Inspector"
          >
            <div style={{ width: `${rightInspectorWidth}px` }} className="h-full flex flex-col">
              {rightInspectorSlot}
            </div>
          </aside>
        )}
      </div>
    </div>
  );
};
