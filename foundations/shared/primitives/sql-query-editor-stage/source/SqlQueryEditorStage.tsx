import React, { useEffect, useState } from 'react';
import {
  Play,
  RotateCw,
  Sparkles,
  Terminal,
  Table2,
  Clock,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';
import type { SqlQueryEditorStageProps } from './types';

export const SqlQueryEditorStage: React.FC<SqlQueryEditorStageProps> = ({
  queryName = 'New Query',
  onQueryNameChange,
  querySql,
  onQuerySqlChange,
  onRunQuery,
  isRunning = false,
  onFormatQuery,
  metrics,
  activeUtilityTab = 'results',
  onUtilityTabChange,
  editorSlot,
  children,
  className = '',
}) => {
  const [internalTab, setInternalTab] = useState<'results' | 'messages' | string>(activeUtilityTab);

  const currentTab = onUtilityTabChange ? activeUtilityTab : internalTab;
  const setTab = (tab: string) => {
    if (onUtilityTabChange) onUtilityTabChange(tab);
    else setInternalTab(tab);
  };

  // Keyboard shortcut: Ctrl+Enter / Cmd+Enter to run query
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        if (!isRunning) {
          onRunQuery();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onRunQuery, isRunning]);

  return (
    <div className={`flex flex-col h-full w-full bg-background border border-border rounded-lg overflow-hidden ${className}`}>
      {/* Top Action Bar */}
      <div className="flex items-center justify-between gap-3 px-4 py-2 border-b border-border bg-background/95 backdrop-blur shrink-0">
        {/* Query Name */}
        <div className="flex items-center gap-2 min-w-0">
          <Terminal className="w-4 h-4 text-muted-foreground shrink-0" />
          {onQueryNameChange ? (
            <input
              type="text"
              value={queryName}
              onChange={(e) => onQueryNameChange(e.target.value)}
              className="text-xs font-semibold text-foreground bg-transparent border-b border-transparent hover:border-border focus:border-primary focus:outline-none px-1 py-0.5 truncate"
            />
          ) : (
            <span className="text-xs font-semibold text-foreground truncate">{queryName}</span>
          )}
        </div>

        {/* Toolbar Actions */}
        <div className="flex items-center gap-2 shrink-0">
          {onFormatQuery && (
            <button
              type="button"
              onClick={onFormatQuery}
              title="Prettify SQL"
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-md border border-border bg-background text-xs text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Format</span>
            </button>
          )}

          {/* Run Query Button */}
          <button
            type="button"
            onClick={onRunQuery}
            disabled={isRunning}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-primary text-primary-foreground text-xs font-medium hover:bg-primary/90 transition-colors shadow-xs disabled:opacity-50"
          >
            {isRunning ? (
              <RotateCw className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Play className="w-3.5 h-3.5 fill-current" />
            )}
            <span>Run</span>
            <kbd className="hidden sm:inline-block ml-1 px-1 py-0.2 text-[10px] bg-primary-foreground/20 rounded font-mono">
              Ctrl+↵
            </kbd>
          </button>
        </div>
      </div>

      {/* SQL Editor Area */}
      <div className="flex-[3] min-h-[160px] border-b border-border relative bg-muted/10 overflow-hidden flex flex-col">
        {editorSlot ?? (
          <textarea
            value={querySql}
            onChange={(e) => onQuerySqlChange(e.target.value)}
            placeholder="-- Write your SQL query here&#10;SELECT * FROM records LIMIT 10;"
            spellCheck={false}
            className="w-full h-full p-4 font-mono text-xs text-foreground bg-transparent resize-none focus:outline-none"
          />
        )}
      </div>

      {/* Utility / Results Panel */}
      <div className="flex-[2] min-h-[140px] flex flex-col bg-background">
        {/* Results Tab Bar & Execution Metrics */}
        <div className="flex items-center justify-between px-4 border-b border-border bg-muted/30 shrink-0">
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => setTab('results')}
              className={`flex items-center gap-1.5 px-3 py-2 text-xs font-medium border-b-2 transition-colors ${
                currentTab === 'results'
                  ? 'border-primary text-foreground font-semibold'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              <Table2 className="w-3.5 h-3.5" />
              <span>Results</span>
            </button>
            <button
              type="button"
              onClick={() => setTab('messages')}
              className={`flex items-center gap-1.5 px-3 py-2 text-xs font-medium border-b-2 transition-colors ${
                currentTab === 'messages'
                  ? 'border-primary text-foreground font-semibold'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              <Terminal className="w-3.5 h-3.5" />
              <span>Messages</span>
            </button>
          </div>

          {/* Metrics summary */}
          {metrics && (
            <div className="flex items-center gap-3 text-[11px] text-muted-foreground font-mono">
              {metrics.executionTimeMs !== undefined && (
                <div className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  <span>{metrics.executionTimeMs}ms</span>
                </div>
              )}
              {metrics.rowCount !== undefined && (
                <div className="flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                  <span>{metrics.rowCount} rows</span>
                </div>
              )}
              {metrics.error && (
                <div className="flex items-center gap-1 text-red-500 font-sans">
                  <AlertTriangle className="w-3 h-3" />
                  <span>Error</span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Results / Empty Content Area (Blank by default per AGENTS.md) */}
        <div className="flex-1 overflow-auto p-4">
          {currentTab === 'messages' ? (
            <div className="font-mono text-xs text-muted-foreground">
              {metrics?.error ? (
                <span className="text-red-500">{metrics.error}</span>
              ) : (
                <span>Success: Query executed cleanly.</span>
              )}
            </div>
          ) : (
            children ?? (
              <div className="h-full flex flex-col items-center justify-center border border-dashed border-border rounded-lg text-center text-muted-foreground p-6">
                <p className="text-sm font-medium">Empty query results container</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Execute query or pass children to render tabulated data
                </p>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
};
