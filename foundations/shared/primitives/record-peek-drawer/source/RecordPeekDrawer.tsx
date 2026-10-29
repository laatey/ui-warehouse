import React, { useEffect, useRef } from 'react';
import { X, ExternalLink, ChevronRight } from 'lucide-react';
import type { RecordPeekDrawerProps } from './types';

export const RecordPeekDrawer: React.FC<RecordPeekDrawerProps> = ({
  isOpen,
  onClose,
  title = 'Record Details',
  recordType,
  recordIcon,
  headerActions,
  tabs = [],
  activeTabId,
  onTabChange,
  fields = [],
  onFieldChange,
  width = 480,
  children,
  footerSlot,
  className = '',
}) => {
  const drawerRef = useRef<HTMLDivElement>(null);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const widthStyle = typeof width === 'number' ? `${width}px` : width;

  return (
    <aside
      ref={drawerRef}
      role="dialog"
      aria-modal="true"
      aria-label={title}
      style={{ width: widthStyle }}
      className={`fixed top-0 right-0 h-screen z-50 flex flex-col bg-background border-l border-border shadow-2xl transition-transform duration-200 ease-in-out ${className}`}
    >
      {/* Drawer Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-border bg-background/95 backdrop-blur shrink-0">
        <div className="flex items-center gap-3 min-w-0">
          {recordIcon && (
            <div className="w-8 h-8 rounded-md bg-muted flex items-center justify-center shrink-0 text-muted-foreground">
              {recordIcon}
            </div>
          )}
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h2 className="text-base font-semibold text-foreground truncate">{title}</h2>
              {recordType && (
                <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-muted text-muted-foreground uppercase tracking-wider">
                  {recordType}
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1 shrink-0">
          {headerActions}
          <button
            type="button"
            onClick={onClose}
            aria-label="Close drawer"
            className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Tabs strip */}
      {tabs.length > 0 && (
        <div className="flex items-center px-4 border-b border-border bg-muted/20 shrink-0 gap-1 overflow-x-auto">
          {tabs.map((tab) => {
            const isActive = tab.id === activeTabId;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => onTabChange?.(tab.id)}
                className={`flex items-center gap-2 px-3 py-2.5 text-xs font-medium border-b-2 transition-colors whitespace-nowrap ${
                  isActive
                    ? 'border-primary text-foreground font-semibold'
                    : 'border-transparent text-muted-foreground hover:text-foreground'
                }`}
              >
                {tab.icon && <span className="w-3.5 h-3.5">{tab.icon}</span>}
                <span>{tab.label}</span>
                {tab.badge !== undefined && (
                  <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-muted text-muted-foreground">
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      )}

      {/* Quick properties overview bar (if provided) */}
      {fields.length > 0 && (
        <div className="p-4 border-b border-border bg-muted/10 grid grid-cols-2 gap-3 text-xs shrink-0">
          {fields.map((field) => (
            <div key={field.id} className="flex flex-col gap-1">
              <span className="text-muted-foreground font-medium text-[11px] flex items-center gap-1.5">
                {field.icon && <span className="w-3 h-3">{field.icon}</span>}
                {field.label}
              </span>
              <div className="text-foreground font-medium truncate">
                {field.value ?? <span className="text-muted-foreground/50 italic">Empty</span>}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty Main Content Slot (Blank by default per AGENTS.md) */}
      <div className="flex-1 overflow-y-auto p-5">
        {children ?? (
          <div className="h-full flex flex-col items-center justify-center border-2 border-dashed border-border rounded-lg p-6 text-center text-muted-foreground">
            <p className="text-sm font-medium">Record content container</p>
            <p className="text-xs text-muted-foreground mt-1">Pass children to render tabs, timeline, notes or forms</p>
          </div>
        )}
      </div>

      {/* Optional Footer Slot */}
      {footerSlot && (
        <div className="p-4 border-t border-border bg-background/95 shrink-0 flex items-center justify-between">
          {footerSlot}
        </div>
      )}
    </aside>
  );
};
