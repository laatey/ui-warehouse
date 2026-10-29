import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, ChevronUp, Maximize2, Minimize2 } from 'lucide-react';
import { QueryConsoleDrawerProps, ConsoleTabItem } from './types';

export const QueryConsoleDrawer: React.FC<QueryConsoleDrawerProps> = ({
  tabs = [
    { id: 'query', label: 'Query' },
    { id: 'response', label: 'Response' },
    { id: 'errors', label: 'Errors', badgeCount: 0, badgeVariant: 'error' },
    { id: 'logs', label: 'Logs' },
  ],
  activeTab: controlledActiveTab,
  onTabChange,
  isOpen: controlledIsOpen,
  onToggleOpen,
  height = 240,
  onHeightChange,
  minHeight = 120,
  maxHeight = 600,
  actionsSlot,
  children,
  className = '',
}) => {
  const [internalOpen, setInternalOpen] = useState(false);
  const [internalActiveTab, setInternalActiveTab] = useState(tabs[0]?.id || 'query');
  const [isMaximized, setIsMaximized] = useState(false);
  const [currentHeight, setCurrentHeight] = useState(height);
  const isDraggingRef = useRef(false);

  const isOpen = controlledIsOpen !== undefined ? controlledIsOpen : internalOpen;
  const activeTab = controlledActiveTab !== undefined ? controlledActiveTab : internalActiveTab;

  const toggleOpen = () => {
    if (onToggleOpen) onToggleOpen();
    else setInternalOpen(!internalOpen);
  };

  const handleTabClick = (tabId: string) => {
    if (!isOpen) {
      if (onToggleOpen) onToggleOpen();
      else setInternalOpen(true);
    }
    if (controlledActiveTab === undefined) setInternalActiveTab(tabId);
    if (onTabChange) onTabChange(tabId);
  };

  const startResize = (e: React.MouseEvent) => {
    e.preventDefault();
    isDraggingRef.current = true;

    const handleMouseMove = (moveEvent: MouseEvent) => {
      if (!isDraggingRef.current) return;
      const newHeight = window.innerHeight - moveEvent.clientY;
      if (newHeight >= minHeight && newHeight <= maxHeight) {
        setCurrentHeight(newHeight);
        if (onHeightChange) onHeightChange(newHeight);
      }
    };

    const handleMouseUp = () => {
      isDraggingRef.current = false;
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  };

  const displayedHeight = !isOpen ? 38 : isMaximized ? '80vh' : `${currentHeight}px`;

  return (
    <div
      style={{ height: displayedHeight }}
      className={`w-full border-t border-border bg-card text-foreground flex flex-col transition-[height] duration-200 select-none z-30 shrink-0 relative ${className}`}
    >
      {/* Top Resize Handle */}
      {isOpen && !isMaximized && (
        <div
          onMouseDown={startResize}
          className="absolute top-0 left-0 right-0 h-1 cursor-row-resize hover:bg-primary/40 transition-colors z-40"
        />
      )}

      {/* Header Bar with Tabs and Controls */}
      <div className="h-[38px] border-b border-border/60 bg-muted/30 px-3 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-1 overflow-x-auto">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => handleTabClick(tab.id)}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-medium transition-colors ${
                  isActive && isOpen
                    ? 'bg-background text-foreground shadow-xs font-semibold'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <span>{tab.label}</span>
                {tab.badgeCount !== undefined && tab.badgeCount > 0 && (
                  <span
                    className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono font-bold ${
                      tab.badgeVariant === 'error'
                        ? 'bg-destructive/15 text-destructive'
                        : 'bg-muted text-muted-foreground'
                    }`}
                  >
                    {tab.badgeCount}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Right Action Buttons */}
        <div className="flex items-center gap-1">
          {actionsSlot}

          {isOpen && (
            <button
              type="button"
              onClick={() => setIsMaximized(!isMaximized)}
              className="p-1 rounded text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              title={isMaximized ? 'Restore height' : 'Maximize'}
              aria-label={isMaximized ? 'Restore height' : 'Maximize'}
            >
              {isMaximized ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
            </button>
          )}

          <button
            type="button"
            onClick={toggleOpen}
            className="p-1 rounded text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            title={isOpen ? 'Collapse console' : 'Expand console'}
            aria-label={isOpen ? 'Collapse console' : 'Expand console'}
          >
            {isOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Main Console Content Body */}
      {isOpen && (
        <div className="flex-1 overflow-auto p-3 bg-background">
          {children}
        </div>
      )}
    </div>
  );
};
