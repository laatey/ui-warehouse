import React, { useState } from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';
import { RibbonBarProps } from './types';

export function RibbonBar({
  tabs,
  activeTabId,
  onTabChange,
  activeToolId,
  collapsed: controlledCollapsed,
  onToggleCollapse,
  className = '',
}: RibbonBarProps): React.JSX.Element {
  const [internalTabId, setInternalTabId] = useState(tabs[0]?.id);
  const [internalCollapsed, setInternalCollapsed] = useState(false);

  const currentTabId = activeTabId ?? internalTabId;
  const isCollapsed = controlledCollapsed ?? internalCollapsed;
  const currentTab = tabs.find((t) => t.id === currentTabId) || tabs[0];

  const handleToggle = () => {
    if (onToggleCollapse) {
      onToggleCollapse();
    } else {
      setInternalCollapsed((prev) => !prev);
    }
  };

  return (
    <div className={`flex flex-col bg-background select-none ${className}`}>
      {/* Ribbon Tabs Header */}
      <div className="flex items-center justify-between border-b border-border px-2 h-8 bg-muted/30">
        <div className="flex items-center gap-1 overflow-x-auto no-scrollbar">
          {tabs.map((tab) => {
            const active = tab.id === currentTabId;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => {
                  setInternalTabId(tab.id);
                  onTabChange?.(tab.id);
                }}
                className={`px-3 py-1 text-xs rounded-t-md transition-colors cursor-pointer ${
                  active
                    ? 'bg-background text-foreground font-semibold border-b-2 border-primary -mb-px'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        <button
          type="button"
          onClick={handleToggle}
          title={isCollapsed ? 'Expand ribbon' : 'Minimize ribbon'}
          className="p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
        >
          {isCollapsed ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronUp className="w-3.5 h-3.5" />}
        </button>
      </div>

      {/* Ribbon Tool Groups Body */}
      {!isCollapsed && currentTab && (
        <div className="flex items-stretch h-24 px-2 py-1.5 gap-2 overflow-x-auto no-scrollbar bg-background">
          {currentTab.groups.map((group) => (
            <div
              key={group.id}
              className="flex flex-col justify-between border-r border-border/60 pr-2 last:border-r-0"
            >
              {/* Group Tools */}
              <div className="flex items-center gap-1 flex-1">
                {group.items.map((tool) => {
                  const isActive = tool.active ?? (activeToolId === tool.id);
                  const isLarge = tool.size !== 'small';

                  return (
                    <button
                      key={tool.id}
                      type="button"
                      disabled={tool.disabled}
                      onClick={tool.onClick}
                      title={tool.shortcut ? `${tool.label} (${tool.shortcut})` : tool.label}
                      className={`flex rounded-md p-1.5 transition-colors cursor-pointer ${
                        isLarge
                          ? 'flex-col items-center justify-center min-w-[48px] h-full gap-1'
                          : 'flex-row items-center gap-1.5 px-2 py-1'
                      } ${
                        isActive
                          ? 'bg-accent text-foreground font-medium ring-1 ring-border'
                          : 'text-muted-foreground hover:text-foreground hover:bg-muted/60'
                      } ${tool.disabled ? 'opacity-40 cursor-not-allowed' : ''}`}
                    >
                      {tool.icon && <span className="shrink-0">{tool.icon}</span>}
                      <span className="text-[11px] leading-tight text-center truncate max-w-[64px]">
                        {tool.label}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Group Title Label */}
              <div className="text-[10px] text-center text-muted-foreground/60 font-medium tracking-tight mt-0.5">
                {group.title}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
