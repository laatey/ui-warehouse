import React, { useState, useEffect } from 'react'
import { ArrowLeft, ArrowRight, RotateCw, X, Lock, Search } from 'lucide-react'
import { OmniboxToolbarProps } from './types'

export function OmniboxToolbar({
  url = '',
  canGoBack = false,
  canGoForward = false,
  isLoading = false,
  onNavigate,
  onBack,
  onForward,
  onReload,
  onStop,
  actions,
  className = ''
}: OmniboxToolbarProps): React.JSX.Element {
  const [inputValue, setInputValue] = useState(url)

  useEffect(() => {
    setInputValue(url)
  }, [url])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (onNavigate && inputValue.trim()) {
      onNavigate(inputValue.trim())
    }
  }

  const isSecure = inputValue.startsWith('https://')

  return (
    <div
      role="toolbar"
      aria-label="Browser navigation"
      className={`h-11 border-b border-border bg-background px-3 flex items-center gap-2 select-none shrink-0 ${className}`}
    >
      <div className="flex items-center gap-1 shrink-0">
        <button
          type="button"
          onClick={onBack}
          disabled={!canGoBack}
          aria-label="Back"
          className={`p-1.5 rounded-md text-muted-foreground transition-colors ${
            canGoBack ? 'hover:text-foreground hover:bg-accent cursor-pointer' : 'opacity-40 cursor-not-allowed'
          }`}
        >
          <ArrowLeft className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={onForward}
          disabled={!canGoForward}
          aria-label="Forward"
          className={`p-1.5 rounded-md text-muted-foreground transition-colors ${
            canGoForward ? 'hover:text-foreground hover:bg-accent cursor-pointer' : 'opacity-40 cursor-not-allowed'
          }`}
        >
          <ArrowRight className="w-4 h-4" />
        </button>

        {isLoading ? (
          <button
            type="button"
            onClick={onStop}
            aria-label="Stop loading"
            className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-accent transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        ) : (
          <button
            type="button"
            onClick={onReload}
            aria-label="Reload page"
            className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-accent transition-colors cursor-pointer"
          >
            <RotateCw className="w-4 h-4" />
          </button>
        )}
      </div>

      <form onSubmit={handleSubmit} className="flex-1 max-w-2xl mx-auto">
        <div className="relative flex items-center w-full h-8 rounded-lg bg-muted/60 hover:bg-muted focus-within:bg-background focus-within:ring-1 focus-within:ring-ring border border-transparent focus-within:border-border transition-all px-2.5">
          <span className="mr-2 text-muted-foreground shrink-0">
            {isSecure ? (
              <Lock className="w-3.5 h-3.5 text-muted-foreground" />
            ) : (
              <Search className="w-3.5 h-3.5 text-muted-foreground" />
            )}
          </span>
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Search or enter URL"
            className="w-full bg-transparent text-xs text-foreground placeholder:text-muted-foreground/60 outline-none"
          />
        </div>
      </form>

      <div className="flex items-center gap-1 shrink-0 ml-auto">
        {actions}
      </div>
    </div>
  )
}
