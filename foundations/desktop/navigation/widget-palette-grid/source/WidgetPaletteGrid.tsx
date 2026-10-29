import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { WidgetPaletteGridProps, WidgetPaletteItem, WidgetPaletteCategory } from './types';

export const WidgetPaletteGrid: React.FC<WidgetPaletteGridProps> = ({
  categories,
  items,
  onSelectWidget,
  onDragStart,
  searchPlaceholder = 'Search widgets...',
  showSearch = true,
  columns = 2,
  className = '',
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  // Normalize input into categories
  const resolvedCategories: WidgetPaletteCategory[] = categories
    ? categories
    : items
    ? [{ id: 'all', title: 'Widgets', items }]
    : [];

  const filterItem = (item: WidgetPaletteItem) => {
    if (!searchQuery.trim()) return true;
    const query = searchQuery.toLowerCase();
    return (
      item.name.toLowerCase().includes(query) ||
      (item.description && item.description.toLowerCase().includes(query))
    );
  };

  const gridColsClass = {
    2: 'grid-cols-2',
    3: 'grid-cols-3',
    4: 'grid-cols-4',
  }[columns] || 'grid-cols-2';

  return (
    <div className={`flex flex-col h-full w-full bg-card text-foreground select-none overflow-hidden ${className}`}>
      {/* Search Header */}
      {showSearch && (
        <div className="p-3 border-b border-border bg-muted/20 shrink-0">
          <div className="relative flex items-center">
            <Search className="w-3.5 h-3.5 absolute left-2.5 text-muted-foreground pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={searchPlaceholder}
              className="w-full pl-8 pr-3 py-1.5 text-xs rounded-md border border-border bg-background focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
        </div>
      )}

      {/* Categorized Widget Grid */}
      <div className="flex-1 overflow-auto p-3 space-y-4">
        {resolvedCategories.map((category) => {
          const visibleItems = category.items.filter(filterItem);
          if (visibleItems.length === 0) return null;

          return (
            <div key={category.id} className="flex flex-col gap-2">
              <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider px-1">
                {category.title}
              </span>

              <div className={`grid ${gridColsClass} gap-2`}>
                {visibleItems.map((item) => (
                  <div
                    key={item.id}
                    draggable={Boolean(onDragStart)}
                    onDragStart={(e) => onDragStart && onDragStart(item, e)}
                    onClick={() => onSelectWidget && onSelectWidget(item)}
                    className="flex flex-col items-center justify-center p-3 rounded-lg border border-border bg-background hover:bg-muted/60 hover:border-primary/50 transition-all cursor-pointer group shadow-xs active:scale-98 text-center"
                    title={item.description || item.name}
                  >
                    <div className="w-8 h-8 rounded-md bg-muted flex items-center justify-center text-foreground group-hover:text-primary transition-colors mb-2">
                      {item.icon}
                    </div>
                    <span className="text-xs font-medium text-foreground truncate w-full">
                      {item.name}
                    </span>
                    {item.isBeta && (
                      <span className="mt-1 text-[9px] font-mono uppercase px-1 rounded bg-amber-500/10 text-amber-600 border border-amber-500/20">
                        Beta
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
