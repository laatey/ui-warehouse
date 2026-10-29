import React, { useState } from 'react';
import {
  Table2,
  Filter,
  ArrowUpDown,
  UserCheck,
  Plus,
  RefreshCw,
  Download,
  ChevronDown,
} from 'lucide-react';
import type { DataGridToolbarProps } from './types';

export const DataGridToolbar: React.FC<DataGridToolbarProps> = ({
  tableName = 'records',
  schemaName = 'public',
  rowCount,
  filterCount = 0,
  onOpenFilter,
  sortCount = 0,
  onOpenSort,
  activeRole,
  onRoleChange,
  onInsertRow,
  onRefresh,
  isRefreshing = false,
  onExport,
  extraActionsSlot,
  children,
  className = '',
}) => {
  const [isExportMenuOpen, setIsExportMenuOpen] = useState(false);

  return (
    <div
      role="toolbar"
      aria-label="Data grid management toolbar"
      className={`flex items-center justify-between gap-3 px-4 py-2 border-b border-border bg-background/95 backdrop-blur text-xs shrink-0 ${className}`}
    >
      {/* Left side: Breadcrumb schema/table title & Row Count */}
      <div className="flex items-center gap-2 min-w-0">
        <Table2 className="w-4 h-4 text-muted-foreground shrink-0" />
        <div className="flex items-center gap-1.5 font-medium min-w-0">
          <span className="text-muted-foreground">{schemaName}</span>
          <span className="text-muted-foreground/60">/</span>
          <span className="font-semibold text-foreground truncate">{tableName}</span>
        </div>

        {rowCount !== undefined && (
          <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-muted text-muted-foreground font-mono shrink-0 ml-1">
            {rowCount} rows
          </span>
        )}
      </div>

      {/* Middle Custom Slot (Blank by default per AGENTS.md) */}
      {children && <div className="flex items-center gap-2">{children}</div>}

      {/* Right side: Filter, Sort, Role View, Insert, Refresh, Export */}
      <div className="flex items-center gap-2 shrink-0">
        {/* Filter Trigger Button */}
        {onOpenFilter && (
          <button
            type="button"
            onClick={onOpenFilter}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md border text-xs font-medium transition-colors ${
              filterCount > 0
                ? 'border-primary bg-primary/10 text-primary'
                : 'border-border bg-background text-muted-foreground hover:text-foreground hover:bg-muted'
            }`}
          >
            <Filter className="w-3.5 h-3.5" />
            <span>Filter</span>
            {filterCount > 0 && (
              <span className="w-4 h-4 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-[10px] font-bold">
                {filterCount}
              </span>
            )}
          </button>
        )}

        {/* Sort Trigger Button */}
        {onOpenSort && (
          <button
            type="button"
            onClick={onOpenSort}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md border text-xs font-medium transition-colors ${
              sortCount > 0
                ? 'border-primary bg-primary/10 text-primary'
                : 'border-border bg-background text-muted-foreground hover:text-foreground hover:bg-muted'
            }`}
          >
            <ArrowUpDown className="w-3.5 h-3.5" />
            <span>Sort</span>
            {sortCount > 0 && (
              <span className="w-4 h-4 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-[10px] font-bold">
                {sortCount}
              </span>
            )}
          </button>
        )}

        {/* View Role Impersonation Trigger (if supported) */}
        {activeRole && (
          <div className="flex items-center gap-1 px-2 py-1 rounded-md bg-muted/60 text-muted-foreground text-xs">
            <UserCheck className="w-3.5 h-3.5" />
            <span>role:</span>
            <span className="font-semibold text-foreground">{activeRole}</span>
          </div>
        )}

        {/* Refresh Button */}
        {onRefresh && (
          <button
            type="button"
            onClick={onRefresh}
            disabled={isRefreshing}
            aria-label="Refresh grid"
            className="p-1.5 rounded-md border border-border text-muted-foreground hover:text-foreground hover:bg-muted transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-primary' : ''}`} />
          </button>
        )}

        {/* Export Dropdown Trigger */}
        {onExport && (
          <div className="relative inline-block">
            <button
              type="button"
              onClick={() => setIsExportMenuOpen(!isExportMenuOpen)}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-md border border-border bg-background text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export</span>
              <ChevronDown className="w-3 h-3 ml-0.5" />
            </button>

            {isExportMenuOpen && (
              <div className="absolute right-0 mt-1 w-36 rounded-md bg-popover border border-border shadow-lg py-1 z-30">
                <button
                  type="button"
                  onClick={() => {
                    onExport('csv');
                    setIsExportMenuOpen(false);
                  }}
                  className="w-full px-3 py-1.5 text-left text-xs text-foreground hover:bg-muted transition-colors"
                >
                  Export as CSV
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onExport('json');
                    setIsExportMenuOpen(false);
                  }}
                  className="w-full px-3 py-1.5 text-left text-xs text-foreground hover:bg-muted transition-colors"
                >
                  Export as JSON
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onExport('sql');
                    setIsExportMenuOpen(false);
                  }}
                  className="w-full px-3 py-1.5 text-left text-xs text-foreground hover:bg-muted transition-colors"
                >
                  Export as SQL
                </button>
              </div>
            )}
          </div>
        )}

        {/* Extra Action Slot */}
        {extraActionsSlot}

        {/* Primary Action Button (+ Insert row) */}
        {onInsertRow && (
          <button
            type="button"
            onClick={onInsertRow}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Insert row</span>
          </button>
        )}
      </div>
    </div>
  );
};
