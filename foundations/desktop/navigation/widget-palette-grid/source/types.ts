import React from 'react';

export interface WidgetPaletteItem {
  id: string;
  name: string;
  icon: React.ReactNode;
  category?: string;
  description?: string;
  isBeta?: boolean;
}

export interface WidgetPaletteCategory {
  id: string;
  title: string;
  items: WidgetPaletteItem[];
}

export interface WidgetPaletteGridProps {
  categories?: WidgetPaletteCategory[];
  items?: WidgetPaletteItem[];
  onSelectWidget?: (widget: WidgetPaletteItem) => void;
  onDragStart?: (widget: WidgetPaletteItem, e: React.DragEvent) => void;
  searchPlaceholder?: string;
  showSearch?: boolean;
  columns?: 2 | 3 | 4;
  className?: string;
}
