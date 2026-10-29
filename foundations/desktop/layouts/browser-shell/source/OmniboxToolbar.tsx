import React, { useState, useEffect } from 'react'
import { ArrowLeft, ArrowRight, RotateCw, X, Lock, Search } from 'lucide-react'
import { ToolbarState } from './types'

export interface OmniboxToolbarProps {
  state?: ToolbarState
  onNavigate?: (url: string) => void
  onBack?: () => void
  onForward?: () => void
  onReload?: () => void
  onStop?: () => void
  actions?: React.ReactNode
  className?: string
}

export function OmniboxToolbar({
  state,
  onNavigate,
  onBack,
  onForward,
  onReload,
  onStop,
  actions,
  className = ''
}: OmniboxToolbarProps): React.JSX.Element {
  const [urlInput, setUrlInput] = useState(state?.currentUrl || '')

  useEffect(() => {
    setUrlInput(state?.currentUrl || '')
  }, [state?.currentUrl])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (onNavigate && urlInput.trim()) {
      onNavigate(urlInput.trim())
    }
  }

  const isSecure = urlInput.startsWith('https://')

  return (
    <div
      className={`h-11 border-b border-border bg-background px-3 flex items-center gap-2 select-none shrink-0 ${className}`}
    >
      <div className="flex items-center gap-1 shrink-0">
        <button
          type="button"
          onClick={onBack}
          disabled={!state?.canGoBack}
          aria-label="Back"
          className={`p-1.5 rounded-md text-muted-foreground transition-colors ${
            state?.canGoBack ? 'hover:text-foreground hover:bg-accent cursor-pointer' : 'opacity-40 cursor-not-allowed'
          }`}
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={onForward}
          disabled={!state?.canGoForward}
          aria-label="Forward"
          className={`p-1.5 rounded-md text-muted-foreground transition-colors ${
            state?.canGoForward ? 'hover:text-foreground hover:bg-accent cursor-pointer' : 'opacity-40 cursor-not-allowed'
          }`}
        >
          <ArrowRight className="w-4 h-4" />
        </button>
        {state?.isLoading ? (
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

      {/* Omnibox URL / Search input */}
      <form onSubmit={handleSubmit} className="flex-1 max-w-2xl mx-auto">
        <div className="relative flex items-center w-full h-8 rounded-lg bg-muted/70 hover:bg-muted focus-within:bg-background focus-within:ring-1 focus-within:ring-ring border border-transparent focus-within:border-border transition-all px-2.5">
          <span className="mr-2 text-muted-foreground shrink-0">
            {isSecure ? (
              <Lock className="w-3.5 h-3.5 text-muted-foreground" />
            ) : (
              <Search className="w-3.5 h-3.5 text-muted-foreground" />
            )}
          </span>
          <input
            type="text"
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            placeholder="Search or enter web address"
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
