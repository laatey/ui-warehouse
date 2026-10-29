import React from 'react';
import {
  List,
  Kanban,
  Calendar,
  Clock,
  Table,
} from 'lucide-react';
import type { ViewSwitcherBarProps, ViewLayoutOption } from './types';

const DEFAULT_VIEWS: ViewLayoutOption[] = [
  { id: 'list', label: 'List', icon: <List className="w-3.5 h-3.5" /> },
  { id: 'kanban', label: 'Board', icon: <Kanban className="w-3.5 h-3.5" /> },
  { id: 'calendar', label: 'Calendar', icon: <Calendar className="w-3.5 h-3.5" /> },
  { id: 'gantt', label: 'Gantt', icon: <Clock className="w-3.5 h-3.5" /> },
  { id: 'spreadsheet', label: 'Spreadsheet', icon: <Table className="w-3.5 h-3.5" /> },
];

export const ViewSwitcherBar: React.FC<ViewSwitcherBarProps> = ({
  activeView,
  onViewChange,
  views = DEFAULT_VIEWS,
  title,
  countBadge,
  filterSlot,
  groupBySlot,
  actionsSlot,
  children,
  className = '',
}) => {
  return (
    <div
      className={`flex items-center justify-between gap-3 px-4 py-2 border-b border-border bg-background/95 backdrop-blur shrink-0 ${className}`}
    >
      {/* Left side: View title, count badge & Segmented Switcher */}
      <div className="flex items-center gap-3">
        {title && (
          <div className="flex items-center gap-2 mr-2">
            <h1 className="text-sm font-semibold text-foreground tracking-tight">{title}</h1>
            {countBadge !== undefined && (
              <span className="text-[11px] font-medium px-1.5 py-0.5 rounded-full bg-muted text-muted-foreground">
                {countBadge}
              </span>
            )}
          </div>
        )}

        {/* Segmented layout switcher pill group */}
        <div
          role="radiogroup"
          aria-label="View layout switch"
          className="flex items-center gap-0.5 p-0.5 rounded-md bg-muted/50 border border-border/60"
        >
          {views.map((view) => {
            const isActive = activeView === view.id;
            return (
              <button
                key={view.id}
                type="button"
                role="radio"
                aria-checked={isActive}
                disabled={view.disabled}
                onClick={() => onViewChange(view.id)}
                title={view.label}
                aria-label={view.label}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-background text-foreground shadow-xs'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/60'
                } ${view.disabled ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}`}
              >
                {view.icon && <span className="shrink-0">{view.icon}</span>}
                <span className="hidden sm:inline">{view.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Center / Extension slot */}
      {children && <div className="flex items-center gap-2">{children}</div>}

      {/* Right side: Filter triggers, Grouping, Actions */}
      <div className="flex items-center gap-2 shrink-0">
        {filterSlot}
        {groupBySlot}
        {actionsSlot}
      </div>
    </div>
  );
};
