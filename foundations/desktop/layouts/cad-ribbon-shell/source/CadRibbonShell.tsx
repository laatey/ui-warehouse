import React from 'react';
import { CadRibbonShellProps } from './types';

export function CadRibbonShell({
  topBar,
  ribbon,
  toolOptionsBar,
  fileTabs,
  children,
  viewportGizmo,
  rightPanel,
  rightPanelOpen = true,
  commandLine,
  statusBar,
  className = '',
}: CadRibbonShellProps): React.JSX.Element {
  return (
    <div className={`flex flex-col h-screen w-full bg-background text-foreground overflow-hidden select-none ${className}`}>
      {/* Top Application Bar */}
      {topBar && (
        <div className="shrink-0 border-b border-border bg-background">
          {topBar}
        </div>
      )}

      {/* Ribbon Toolbar */}
      {ribbon && (
        <div className="shrink-0 border-b border-border bg-muted/40">
          {ribbon}
        </div>
      )}

      {/* Contextual Tool Options Bar */}
      {toolOptionsBar && (
        <div className="shrink-0 border-b border-border bg-background px-3 py-1 text-xs">
          {toolOptionsBar}
        </div>
      )}

      {/* Document / File Tab Strip */}
      {fileTabs && (
        <div className="shrink-0 border-b border-border bg-muted/20">
          {fileTabs}
        </div>
      )}

      {/* Middle Workspace: Viewport + Right Inspector Panel */}
      <div className="flex flex-1 min-h-0 relative overflow-hidden">
        {/* Main 2D / 3D Canvas Viewport (Empty by default for agent's application) */}
        <main role="main" className="flex-1 min-w-0 h-full relative overflow-hidden bg-background">
          {children}

          {/* Floating Viewport Navigation Gizmo / ViewCube */}
          {viewportGizmo && (
            <div className="absolute top-4 right-4 z-20 pointer-events-auto">
              {viewportGizmo}
            </div>
          )}

          {/* Floating Command Line Prompt (Bottom of Viewport) */}
          {commandLine && (
            <div className="absolute bottom-3 left-4 right-4 z-20 max-w-2xl mx-auto pointer-events-auto">
              {commandLine}
            </div>
          )}
        </main>

        {/* Right Inspector / Properties Panel */}
        {rightPanel && rightPanelOpen && (
          <aside className="w-72 shrink-0 border-l border-border bg-background flex flex-col h-full overflow-hidden">
            {rightPanel}
          </aside>
        )}
      </div>

      {/* Bottom Application Status Bar */}
      {statusBar && (
        <footer className="shrink-0 border-t border-border bg-muted/60 h-6 px-3 flex items-center justify-between text-[11px] text-muted-foreground select-none">
          {statusBar}
        </footer>
      )}
    </div>
  );
}
