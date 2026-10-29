import React from 'react';
import { StatusBarProps } from './types';

export function StatusBar({
  coordinates,
  units,
  zoomLevel,
  toggles = [],
  statusMessage,
  leftSlot,
  rightSlot,
  className = '',
}: StatusBarProps): React.JSX.Element {
  return (
    <div
      role="status"
      aria-label="Application status bar"
      className={`h-6 w-full px-3 flex items-center justify-between text-[11px] font-mono text-muted-foreground border-t border-border bg-muted/60 select-none ${className}`}
    >
      {/* Left-hand section */}
      <div className="flex items-center gap-3 min-w-0">
        {leftSlot}

        {coordinates && (
          <span className="truncate text-foreground/80 font-medium">
            {coordinates}
          </span>
        )}

        {statusMessage && (
          <span className="truncate text-muted-foreground">
            {statusMessage}
          </span>
        )}
      </div>

      {/* Right-hand controls & toggles */}
      <div className="flex items-center gap-1.5 shrink-0 ml-auto">
        {toggles.map((toggle) => (
          <button
            key={toggle.id}
            type="button"
            onClick={toggle.onToggle}
            title={toggle.shortcut ? `${toggle.label} (${toggle.shortcut})` : toggle.label}
            aria-pressed={toggle.active}
            className={`flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-semibold transition-colors cursor-pointer ${
              toggle.active
                ? 'bg-primary/15 text-primary'
                : 'text-muted-foreground/70 hover:text-foreground hover:bg-muted'
            }`}
          >
            {toggle.icon}
            <span>{toggle.label}</span>
          </button>
        ))}

        {units && (
          <span className="px-1.5 py-0.5 text-[10px] text-muted-foreground border-l border-border/80">
            {units}
          </span>
        )}

        {zoomLevel !== undefined && (
          <span className="px-1.5 py-0.5 text-[10px] text-muted-foreground border-l border-border/80">
            {typeof zoomLevel === 'number' ? `${Math.round(zoomLevel * 100)}%` : zoomLevel}
          </span>
        )}

        {rightSlot}
      </div>
    </div>
  );
}
