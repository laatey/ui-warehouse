import React, { useState } from 'react';
import { ChevronDown, ChevronRight, Copy, Trash2, X, Search, Code2, HelpCircle } from 'lucide-react';
import { PropertyInspectorPanelProps, PropertyTab } from './types';

export const PropertyInspectorPanel: React.FC<PropertyInspectorPanelProps> = ({
  title,
  entityType,
  onTitleChange,
  activeTab: controlledTab,
  onTabChange,
  availableTabs = ['content', 'style', 'events'],
  sections = [],
  onDelete,
  onDuplicate,
  onClose,
  headerActions,
  searchPlaceholder = 'Search properties...',
  className = '',
}) => {
  const [internalTab, setInternalTab] = useState<PropertyTab>('content');
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [currentTitle, setCurrentTitle] = useState(title);
  const [searchQuery, setSearchQuery] = useState('');
  const [openSections, setOpenSections] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    sections.forEach((s) => {
      initial[s.id] = s.defaultOpen !== false;
    });
    return initial;
  });

  const activeTab = controlledTab !== undefined ? controlledTab : internalTab;

  const handleTabClick = (tab: PropertyTab) => {
    if (controlledTab === undefined) setInternalTab(tab);
    if (onTabChange) onTabChange(tab);
  };

  const toggleSection = (id: string) => {
    setOpenSections((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleTitleSubmit = () => {
    setIsEditingTitle(false);
    if (onTitleChange && currentTitle.trim() !== '') {
      onTitleChange(currentTitle.trim());
    }
  };

  const filteredSections = sections
    .map((sec) => ({
      ...sec,
      fields: sec.fields.filter(
        (f) =>
          searchQuery.trim() === '' ||
          f.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
          sec.title.toLowerCase().includes(searchQuery.toLowerCase())
      ),
    }))
    .filter((sec) => sec.fields.length > 0 || searchQuery.trim() === '');

  return (
    <div className={`flex flex-col h-full w-full bg-card text-foreground border-l border-border select-none overflow-hidden ${className}`}>
      {/* 1. Header with Editable Title & Actions */}
      <div className="h-12 border-b border-border px-4 py-2 flex items-center justify-between shrink-0 bg-muted/20">
        <div className="flex items-center gap-2 min-w-0 flex-1">
          {isEditingTitle ? (
            <input
              type="text"
              value={currentTitle}
              onChange={(e) => setCurrentTitle(e.target.value)}
              onBlur={handleTitleSubmit}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleTitleSubmit();
                if (e.key === 'Escape') {
                  setCurrentTitle(title);
                  setIsEditingTitle(false);
                }
              }}
              autoFocus
              className="px-2 py-0.5 text-sm font-semibold rounded border border-primary bg-background focus:outline-none w-full max-w-[180px]"
            />
          ) : (
            <span
              onClick={() => setIsEditingTitle(true)}
              className="text-sm font-semibold truncate cursor-pointer hover:underline"
              title="Click to rename"
            >
              {title}
            </span>
          )}

          {entityType && (
            <span className="text-[10px] font-mono uppercase px-1.5 py-0.5 rounded bg-muted text-muted-foreground border border-border shrink-0">
              {entityType}
            </span>
          )}
        </div>

        <div className="flex items-center gap-1 shrink-0 ml-2">
          {headerActions}
          {onDuplicate && (
            <button
              type="button"
              onClick={onDuplicate}
              className="p-1 rounded text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              title="Duplicate"
              aria-label="Duplicate"
            >
              <Copy className="w-3.5 h-3.5" />
            </button>
          )}
          {onDelete && (
            <button
              type="button"
              onClick={onDelete}
              className="p-1 rounded text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
              title="Delete"
              aria-label="Delete"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="p-1 rounded text-muted-foreground hover:text-foreground hover:bg-muted transition-colors ml-1"
              title="Close Panel"
              aria-label="Close Panel"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* 2. Sticky Tab Bar */}
      {availableTabs.length > 1 && (
        <div className="border-b border-border bg-card px-4 flex items-center gap-4 shrink-0">
          {availableTabs.map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => handleTabClick(tab)}
              className={`py-2 text-xs font-medium capitalize border-b-2 transition-colors -mb-[1px] ${
                activeTab === tab
                  ? 'border-primary text-foreground font-semibold'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      )}

      {/* 3. Search Filter Input */}
      <div className="p-3 border-b border-border/60 bg-muted/10 shrink-0">
        <div className="relative flex items-center">
          <Search className="w-3.5 h-3.5 absolute left-2.5 text-muted-foreground pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={searchPlaceholder}
            className="w-full pl-8 pr-3 py-1 text-xs rounded-md border border-border bg-background focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
      </div>

      {/* 4. Scrollable Property Sections List */}
      <div className="flex-1 overflow-auto divide-y divide-border/50">
        {filteredSections.map((section) => {
          const isOpen = openSections[section.id] !== false;
          return (
            <div key={section.id} className="flex flex-col">
              <button
                type="button"
                onClick={() => toggleSection(section.id)}
                className="w-full px-4 py-2 flex items-center justify-between text-xs font-semibold text-muted-foreground hover:text-foreground hover:bg-muted/40 transition-colors"
              >
                <span>{section.title}</span>
                {isOpen ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
              </button>

              {isOpen && (
                <div className="px-4 pb-3 pt-1 space-y-3">
                  {section.fields.map((field) => (
                    <div key={field.id} className="flex flex-col gap-1.5">
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <div className="flex items-center gap-1.5">
                          <span>{field.label}</span>
                          {field.tooltip && (
                            <span title={field.tooltip} className="cursor-help text-muted-foreground/70 hover:text-foreground">
                              <HelpCircle className="w-3 h-3" />
                            </span>
                          )}
                        </div>
                        {field.onToggleJs && (
                          <button
                            type="button"
                            onClick={field.onToggleJs}
                            className={`p-1 rounded text-[10px] font-mono transition-colors ${
                              field.isJsExpression
                                ? 'bg-primary/10 text-primary font-bold'
                                : 'text-muted-foreground/60 hover:text-foreground'
                            }`}
                            title="Toggle JS Expression"
                          >
                            <Code2 className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                      <div className="w-full">
                        {field.children}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
