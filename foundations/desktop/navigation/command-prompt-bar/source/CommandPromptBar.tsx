import React, { useState, useRef, useEffect } from 'react';
import { Terminal } from 'lucide-react';
import { CommandPromptBarProps } from './types';

export function CommandPromptBar({
  promptLabel = 'COMMAND',
  placeholder = 'Type a command or press Enter...',
  onExecute,
  suggestions = [],
  recentHistory = [],
  statusText,
  className = '',
}: CommandPromptBarProps): React.JSX.Element {
  const [value, setValue] = useState('');
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const filteredSuggestions = value.trim()
    ? suggestions.filter((s) => s.command.toLowerCase().startsWith(value.toLowerCase().trim()))
    : [];

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (value.trim()) {
        onExecute(value.trim());
        setValue('');
        setHistoryIndex(-1);
        setShowSuggestions(false);
      }
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (recentHistory.length > 0) {
        const nextIdx = Math.min(recentHistory.length - 1, historyIndex + 1);
        setHistoryIndex(nextIdx);
        setValue(recentHistory[recentHistory.length - 1 - nextIdx] || '');
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex > 0) {
        const nextIdx = historyIndex - 1;
        setHistoryIndex(nextIdx);
        setValue(recentHistory[recentHistory.length - 1 - nextIdx] || '');
      } else if (historyIndex === 0) {
        setHistoryIndex(-1);
        setValue('');
      }
    } else if (e.key === 'Escape') {
      setValue('');
      setShowSuggestions(false);
      inputRef.current?.blur();
    }
  };

  return (
    <div className={`relative flex flex-col w-full select-none ${className}`}>
      {/* Suggestions Dropdown Popover */}
      {showSuggestions && filteredSuggestions.length > 0 && (
        <div className="absolute bottom-full mb-1 left-0 right-0 max-h-48 overflow-y-auto rounded-lg border border-border bg-popover text-popover-foreground shadow-lg p-1 z-30">
          {filteredSuggestions.map((s) => (
            <button
              key={s.command}
              type="button"
              onClick={() => {
                setValue(s.command);
                inputRef.current?.focus();
                setShowSuggestions(false);
              }}
              className="w-full flex items-center justify-between px-2.5 py-1.5 text-xs rounded-md text-left hover:bg-accent transition-colors cursor-pointer"
            >
              <span className="font-mono font-medium text-foreground">{s.command}</span>
              {s.description && (
                <span className="text-[11px] text-muted-foreground">{s.description}</span>
              )}
            </button>
          ))}
        </div>
      )}

      {/* Main Command Input Bar */}
      <div className="flex items-center h-9 px-3 rounded-lg border border-border bg-background/95 backdrop-blur-md shadow-md gap-2">
        <div className="flex items-center gap-1.5 text-muted-foreground shrink-0">
          <Terminal className="w-3.5 h-3.5" />
          <span className="font-mono text-[11px] font-bold tracking-wider uppercase text-foreground">
            {promptLabel}:
          </span>
        </div>

        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
            setShowSuggestions(true);
          }}
          onFocus={() => setShowSuggestions(true)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="flex-1 bg-transparent font-mono text-xs text-foreground placeholder:text-muted-foreground/50 outline-none"
        />

        {statusText && (
          <span className="text-[11px] text-muted-foreground truncate shrink-0">
            {statusText}
          </span>
        )}
      </div>
    </div>
  );
}
