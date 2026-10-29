import React, { useState, useMemo } from 'react';
import {
  Database,
  Table2,
  Eye,
  Search,
  Plus,
  ChevronDown,
  Lock,
  X,
} from 'lucide-react';
import type { SchemaTableSidebarProps, DatabaseEntityType } from './types';

const EntityIcon: React.FC<{ type: DatabaseEntityType }> = ({ type }) => {
  switch (type) {
    case 'view':
    case 'materialized_view':
      return <Eye className="w-3.5 h-3.5 text-muted-foreground shrink-0" />;
    case 'table':
    default:
      return <Table2 className="w-3.5 h-3.5 text-muted-foreground shrink-0" />;
  }
};

export const SchemaTableSidebar: React.FC<SchemaTableSidebarProps> = ({
  schemas,
  selectedSchema,
  onSchemaChange,
  entities,
  selectedEntityId,
  onSelectEntity,
  onCreateTable,
  searchQuery = '',
  onSearchChange,
  children,
  className = '',
}) => {
  const [internalSearch, setInternalSearch] = useState('');
  const [isSchemaDropdownOpen, setIsSchemaDropdownOpen] = useState(false);

  const effectiveSearch = onSearchChange ? searchQuery : internalSearch;
  const handleSearch = (val: string) => {
    if (onSearchChange) onSearchChange(val);
    else setInternalSearch(val);
  };

  const filteredEntities = useMemo(() => {
    return entities.filter((e) =>
      e.name.toLowerCase().includes(effectiveSearch.toLowerCase())
    );
  }, [entities, effectiveSearch]);

  return (
    <aside
      role="navigation"
      aria-label="Database schema navigation"
      className={`flex flex-col w-64 h-full bg-background border-r border-border shrink-0 select-none ${className}`}
    >
      {/* Schema Selector Bar */}
      <div className="p-3 border-b border-border relative">
        <button
          type="button"
          onClick={() => setIsSchemaDropdownOpen(!isSchemaDropdownOpen)}
          className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-md bg-muted/50 border border-border text-xs font-medium text-foreground hover:bg-muted transition-colors"
        >
          <div className="flex items-center gap-2 truncate">
            <Database className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
            <span className="font-semibold truncate">{selectedSchema}</span>
            <span className="text-[10px] text-muted-foreground font-normal">schema</span>
          </div>
          <ChevronDown className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
        </button>

        {/* Schema Dropdown Menu */}
        {isSchemaDropdownOpen && (
          <div className="absolute left-3 right-3 top-12 mt-1 rounded-md bg-popover border border-border shadow-lg py-1 z-30">
            <div className="px-3 py-1.5 text-[10px] uppercase font-semibold text-muted-foreground tracking-wider border-b border-border">
              Select Schema
            </div>
            <div className="max-h-48 overflow-y-auto">
              {schemas.map((s) => (
                <button
                  key={s.name}
                  type="button"
                  onClick={() => {
                    onSchemaChange(s.name);
                    setIsSchemaDropdownOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-1.5 text-left text-xs transition-colors ${
                    s.name === selectedSchema
                      ? 'bg-primary/10 text-primary font-semibold'
                      : 'text-foreground hover:bg-muted'
                  }`}
                >
                  <span className="truncate">{s.name}</span>
                  {s.entityCount !== undefined && (
                    <span className="text-[10px] text-muted-foreground">{s.entityCount}</span>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Search & Actions Bar */}
      <div className="p-3 pb-2 flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="w-3.5 h-3.5 text-muted-foreground absolute left-2.5 top-2 pointer-events-none" />
          <input
            type="text"
            value={effectiveSearch}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Search tables..."
            className="w-full pl-8 pr-6 py-1 text-xs bg-muted/40 border border-border rounded-md text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary"
          />
          {effectiveSearch && (
            <button
              type="button"
              onClick={() => handleSearch('')}
              className="absolute right-2 top-2 text-muted-foreground hover:text-foreground"
            >
              <X className="w-3 h-3" />
            </button>
          )}
        </div>

        {onCreateTable && (
          <button
            type="button"
            onClick={onCreateTable}
            title="Create new table"
            aria-label="Create new table"
            className="p-1 rounded-md bg-muted text-muted-foreground hover:text-foreground hover:bg-muted/80 border border-border transition-colors shrink-0"
          >
            <Plus className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Table Entity List */}
      <div className="flex-1 overflow-y-auto px-2 py-1 space-y-0.5">
        {filteredEntities.map((entity) => {
          const isSelected = entity.id === selectedEntityId;

          return (
            <button
              key={entity.id}
              type="button"
              onClick={() => onSelectEntity(entity.id)}
              className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-md text-xs transition-colors text-left group ${
                isSelected
                  ? 'bg-primary/10 text-primary font-semibold'
                  : 'text-foreground hover:bg-muted/60'
              }`}
            >
              <div className="flex items-center gap-2 min-w-0">
                <EntityIcon type={entity.type} />
                <span className="truncate">{entity.name}</span>
                {entity.hasRls && (
                  <Lock className="w-3 h-3 text-muted-foreground/70 shrink-0" title="Row Level Security enabled" />
                )}
              </div>

              {entity.rowCount !== undefined && (
                <span className="text-[10px] text-muted-foreground group-hover:text-foreground/80 shrink-0 font-mono">
                  {entity.rowCount}
                </span>
              )}
            </button>
          );
        })}

        {filteredEntities.length === 0 && (
          <div className="py-8 text-center text-xs text-muted-foreground">
            No tables or views found
          </div>
        )}

        {/* Blank extension container per AGENTS.md */}
        {children}
      </div>
    </aside>
  );
};
