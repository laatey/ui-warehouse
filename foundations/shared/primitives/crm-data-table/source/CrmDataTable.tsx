import React from 'react';
import { ArrowUp, ArrowDown, ChevronRight, Check } from 'lucide-react';
import type { CrmDataTableProps, TableSortDirection } from './types';

export const CrmDataTable: React.FC<CrmDataTableProps> = ({
  columns,
  rows = [],
  selectedRowIds = [],
  onSelectRow,
  onSelectAll,
  sortColumnId,
  sortDirection,
  onSortChange,
  renderCell,
  onRowClick,
  headerActionsSlot,
  emptyStateSlot,
  children,
  footerSlot,
  className = '',
}) => {
  const isAllSelected = rows.length > 0 && selectedRowIds.length === rows.length;
  const isIndeterminate = selectedRowIds.length > 0 && selectedRowIds.length < rows.length;

  const handleHeaderSort = (columnId: string, sortable?: boolean) => {
    if (!sortable || !onSortChange) return;

    let nextDirection: TableSortDirection = 'asc';
    if (sortColumnId === columnId) {
      if (sortDirection === 'asc') nextDirection = 'desc';
      else if (sortDirection === 'desc') nextDirection = null;
      else nextDirection = 'asc';
    }
    onSortChange(columnId, nextDirection);
  };

  return (
    <div className={`flex flex-col h-full w-full bg-background border border-border rounded-lg overflow-hidden ${className}`}>
      {/* Scrollable table viewport */}
      <div className="flex-1 overflow-auto relative">
        <table className="w-full text-left text-xs border-collapse">
          {/* Table Header */}
          <thead className="sticky top-0 z-20 bg-background/95 backdrop-blur border-b border-border shadow-xs">
            <tr>
              {/* Row selection column */}
              {onSelectAll && (
                <th className="w-10 px-3 py-2 text-center">
                  <input
                    type="checkbox"
                    checked={isAllSelected}
                    ref={(el) => {
                      if (el) el.indeterminate = isIndeterminate;
                    }}
                    onChange={(e) => onSelectAll(e.target.checked)}
                    aria-label="Select all rows"
                    className="rounded border-border text-primary focus:ring-primary w-3.5 h-3.5 cursor-pointer"
                  />
                </th>
              )}

              {/* Data Columns */}
              {columns.map((col) => {
                const isSorted = sortColumnId === col.id;
                const widthStyle = col.width ? (typeof col.width === 'number' ? `${col.width}px` : col.width) : 'auto';

                return (
                  <th
                    key={col.id}
                    style={{ width: widthStyle, minWidth: col.minWidth ? `${col.minWidth}px` : undefined }}
                    onClick={() => handleHeaderSort(col.id, col.sortable)}
                    className={`px-3 py-2.5 font-semibold text-muted-foreground select-none border-r border-border/40 last:border-r-0 ${
                      col.sortable ? 'cursor-pointer hover:text-foreground hover:bg-muted/30' : ''
                    }`}
                  >
                    <div className="flex items-center gap-1.5">
                      {col.icon && <span className="w-3.5 h-3.5 text-muted-foreground/80">{col.icon}</span>}
                      <span className="truncate">{col.label}</span>
                      {col.sortable && isSorted && (
                        <span className="text-primary">
                          {sortDirection === 'asc' ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />}
                        </span>
                      )}
                    </div>
                  </th>
                );
              })}

              {/* Header Action Slot (e.g. + Add column) */}
              {headerActionsSlot && (
                <th className="w-12 px-2 py-2 text-center border-l border-border/40">
                  {headerActionsSlot}
                </th>
              )}
            </tr>
          </thead>

          {/* Table Body */}
          <tbody className="divide-y divide-border/60">
            {rows.map((row) => {
              const isSelected = selectedRowIds.includes(row.id);

              return (
                <tr
                  key={row.id}
                  onClick={() => onRowClick?.(row)}
                  className={`hover:bg-muted/40 transition-colors group ${
                    isSelected ? 'bg-primary/5' : ''
                  } ${onRowClick ? 'cursor-pointer' : ''}`}
                >
                  {/* Row Checkbox */}
                  {onSelectRow && (
                    <td className="w-10 px-3 py-2 text-center" onClick={(e) => e.stopPropagation()}>
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={(e) => onSelectRow(row.id, e.target.checked)}
                        aria-label={`Select row ${row.id}`}
                        className="rounded border-border text-primary focus:ring-primary w-3.5 h-3.5 cursor-pointer"
                      />
                    </td>
                  )}

                  {/* Row Cells */}
                  {columns.map((col) => (
                    <td key={col.id} className="px-3 py-2 text-foreground truncate border-r border-border/20 last:border-r-0">
                      {renderCell ? renderCell(row, col) : String(row[col.id] ?? '')}
                    </td>
                  ))}

                  {/* Empty last cell spacer if header actions present */}
                  {headerActionsSlot && <td className="w-12" />}
                </tr>
              );
            })}
          </tbody>
        </table>

        {/* Empty Content Area (Shown when no rows are passed, per AGENTS.md) */}
        {rows.length === 0 && (
          <div className="p-8">
            {children ?? emptyStateSlot ?? (
              <div className="flex flex-col items-center justify-center p-8 border border-dashed border-border rounded-lg text-center text-muted-foreground">
                <p className="text-sm font-medium">Empty data table container</p>
                <p className="text-xs text-muted-foreground mt-1">Pass rows or children to render table contents</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Optional Table Footer / Pagination Slot */}
      {footerSlot && (
        <div className="px-4 py-2.5 border-t border-border bg-muted/20 text-xs text-muted-foreground shrink-0 flex items-center justify-between">
          {footerSlot}
        </div>
      )}
    </div>
  );
};
