import React, { useState } from 'react';
import { Plus, ChevronRight, ChevronDown, MoreHorizontal } from 'lucide-react';
import type { KanbanBoardStageProps, KanbanColumnDefinition, KanbanCardItem } from './types';

export const KanbanBoardStage: React.FC<KanbanBoardStageProps> = ({
  columns,
  items = [],
  renderCard,
  onCardMove,
  onAddItemToColumn,
  onToggleColumnCollapse,
  newColumnSlot,
  children,
  className = '',
}) => {
  const [internalCollapsed, setInternalCollapsed] = useState<Record<string, boolean>>({});

  const isCollapsed = (col: KanbanColumnDefinition) => {
    return col.isCollapsed ?? internalCollapsed[col.id] ?? false;
  };

  const handleToggle = (colId: string) => {
    if (onToggleColumnCollapse) {
      onToggleColumnCollapse(colId);
    } else {
      setInternalCollapsed((prev) => ({ ...prev, [colId]: !prev[colId] }));
    }
  };

  // Group items by columnId
  const itemsByColumn: Record<string, KanbanCardItem[]> = {};
  columns.forEach((col) => {
    itemsByColumn[col.id] = items.filter((item) => item.columnId === col.id);
  });

  return (
    <div
      role="region"
      aria-label="Kanban board stage"
      className={`flex h-full w-full gap-3 overflow-x-auto p-4 bg-background ${className}`}
    >
      {columns.map((column) => {
        const columnItems = itemsByColumn[column.id] || [];
        const collapsed = isCollapsed(column);
        const count = column.count ?? columnItems.length;

        if (collapsed) {
          return (
            <div
              key={column.id}
              onClick={() => handleToggle(column.id)}
              className="flex flex-col items-center py-3 px-2 w-10 shrink-0 bg-muted/30 border border-border/80 rounded-lg cursor-pointer hover:bg-muted/60 transition-colors"
              title={`Expand ${column.title}`}
            >
              <ChevronRight className="w-4 h-4 text-muted-foreground mb-4" />
              <div className="flex items-center gap-2 [writing-mode:vertical-rl] rotate-180 text-xs font-semibold text-foreground tracking-wide">
                <span>{column.title}</span>
                <span className="text-[10px] text-muted-foreground">({count})</span>
              </div>
            </div>
          );
        }

        return (
          <div
            key={column.id}
            className="flex flex-col w-80 shrink-0 max-h-full bg-muted/20 border border-border/80 rounded-lg overflow-hidden"
          >
            {/* Column Header */}
            <div className="flex items-center justify-between px-3 py-2.5 bg-muted/40 border-b border-border/60 shrink-0">
              <div
                className="flex items-center gap-2 min-w-0 cursor-pointer"
                onClick={() => handleToggle(column.id)}
              >
                {column.color ? (
                  <span
                    className="w-2.5 h-2.5 rounded-full shrink-0"
                    style={{ backgroundColor: column.color }}
                  />
                ) : (
                  column.icon && <span className="w-3.5 h-3.5 text-muted-foreground shrink-0">{column.icon}</span>
                )}
                <h3 className="text-xs font-semibold text-foreground truncate">{column.title}</h3>
                <span className="px-1.5 py-0.5 rounded-full text-[10px] font-medium bg-muted text-muted-foreground">
                  {count}
                </span>
              </div>

              <div className="flex items-center gap-0.5">
                {onAddItemToColumn && (
                  <button
                    type="button"
                    onClick={() => onAddItemToColumn(column.id)}
                    aria-label={`Add item to ${column.title}`}
                    className="p-1 rounded text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>

            {/* Column Card Body */}
            <div className="flex-1 overflow-y-auto p-2.5 space-y-2">
              {columnItems.map((item) => (
                <div key={item.id}>
                  {renderCard ? (
                    renderCard(item)
                  ) : (
                    <div className="p-3 rounded-md bg-background border border-border shadow-xs hover:border-foreground/30 transition-colors">
                      <p className="text-xs font-medium text-foreground">{item.title as string ?? item.id}</p>
                    </div>
                  )}
                </div>
              ))}

              {/* Blank column drop slot if no items present (per AGENTS.md) */}
              {columnItems.length === 0 && (
                <div className="h-24 border border-dashed border-border/70 rounded-md flex items-center justify-center text-center p-3 text-muted-foreground">
                  <span className="text-[11px]">Drop cards here</span>
                </div>
              )}
            </div>
          </div>
        );
      })}

      {/* New Column Action Slot */}
      {newColumnSlot && (
        <div className="w-72 shrink-0 flex items-start pt-1">
          {newColumnSlot}
        </div>
      )}

      {/* Extension Slot (Blank Container per AGENTS.md) */}
      {children}
    </div>
  );
};
