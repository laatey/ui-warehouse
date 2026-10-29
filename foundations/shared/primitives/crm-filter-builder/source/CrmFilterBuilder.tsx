import React, { useState } from 'react';
import { Filter, Plus, X, ChevronDown } from 'lucide-react';
import type { CrmFilterBuilderProps, FilterOperatorType } from './types';

const OPERATOR_LABELS: Record<FilterOperatorType, string> = {
  equals: 'is',
  not_equals: 'is not',
  contains: 'contains',
  not_contains: 'does not contain',
  is_empty: 'is empty',
  is_not_empty: 'is not empty',
  greater_than: 'greater than',
  less_than: 'less than',
};

export const CrmFilterBuilder: React.FC<CrmFilterBuilderProps> = ({
  filters,
  availableFields,
  onAddFilter,
  onUpdateFilter,
  onRemoveFilter,
  onClearAll,
  extraSlot,
  children,
  className = '',
}) => {
  const [isFieldMenuOpen, setIsFieldMenuOpen] = useState(false);

  // Quick lookup helper for field definitions
  const getField = (fieldId: string) => availableFields.find((f) => f.id === fieldId);

  return (
    <div className={`flex flex-wrap items-center gap-2 py-2 text-xs text-foreground ${className}`}>
      {/* Filter Icon & Status */}
      <div className="flex items-center gap-1.5 text-muted-foreground mr-1 shrink-0 font-medium select-none">
        <Filter className="w-3.5 h-3.5" />
        <span>Filters</span>
        {filters.length > 0 && (
          <span className="w-4 h-4 rounded-full bg-primary/10 text-primary flex items-center justify-center text-[10px] font-semibold">
            {filters.length}
          </span>
        )}
      </div>

      {/* Render Active Filter Chips */}
      {filters.map((filter) => {
        const field = getField(filter.fieldId);
        const fieldLabel = field?.label || filter.fieldId;
        const operatorLabel = OPERATOR_LABELS[filter.operator] || filter.operator;
        const displayValue = filter.value !== undefined && filter.value !== '' ? String(filter.value) : '...';

        return (
          <div
            key={filter.id}
            className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-muted/60 border border-border text-foreground hover:border-foreground/30 transition-colors shadow-xs"
          >
            {field?.icon && <span className="w-3 h-3 text-muted-foreground">{field.icon}</span>}
            <span className="font-semibold text-foreground/90">{fieldLabel}</span>
            <span className="text-muted-foreground font-normal">{operatorLabel}</span>
            
            {filter.operator !== 'is_empty' && filter.operator !== 'is_not_empty' && (
              <input
                type="text"
                value={String(filter.value ?? '')}
                onChange={(e) => onUpdateFilter(filter.id, { value: e.target.value })}
                placeholder="value"
                className="bg-transparent border-b border-border/80 focus:border-primary text-foreground text-xs px-1 py-0.5 focus:outline-none w-20"
              />
            )}

            <button
              type="button"
              onClick={() => onRemoveFilter(filter.id)}
              aria-label={`Remove filter for ${fieldLabel}`}
              className="ml-1 p-0.5 rounded text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        );
      })}

      {/* Add Filter Trigger Dropdown */}
      <div className="relative inline-block">
        <button
          type="button"
          onClick={() => setIsFieldMenuOpen(!isFieldMenuOpen)}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-md border border-dashed border-border text-muted-foreground hover:text-foreground hover:border-foreground/40 hover:bg-muted/40 transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add filter</span>
        </button>

        {isFieldMenuOpen && (
          <div className="absolute left-0 mt-1 w-48 rounded-md bg-popover border border-border shadow-lg py-1 z-30">
            <div className="px-3 py-1.5 text-[10px] uppercase font-semibold text-muted-foreground tracking-wider border-b border-border">
              Select Field
            </div>
            <div className="max-h-56 overflow-y-auto">
              {availableFields.map((field) => (
                <button
                  key={field.id}
                  type="button"
                  onClick={() => {
                    onAddFilter(field.id);
                    setIsFieldMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-2 px-3 py-1.5 text-left text-xs text-foreground hover:bg-muted transition-colors"
                >
                  {field.icon && <span className="w-3.5 h-3.5 text-muted-foreground">{field.icon}</span>}
                  <span>{field.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Clear All Action */}
      {filters.length > 0 && onClearAll && (
        <button
          type="button"
          onClick={onClearAll}
          className="text-xs text-muted-foreground hover:text-foreground underline underline-offset-2 ml-1"
        >
          Clear all
        </button>
      )}

      {/* Optional Extra Action Slots */}
      {extraSlot && <div className="ml-auto flex items-center gap-2">{extraSlot}</div>}

      {/* Custom Container Slot for extensions */}
      {children}
    </div>
  );
};
