import React, { useState } from 'react'
import { DiffViewerProps, DiffLineType } from './types'

const lineStyles: Record<DiffLineType, string> = {
  ctx: 'text-foreground hover:bg-muted/40',
  add: 'bg-emerald-500/10 text-emerald-900 dark:text-emerald-200 hover:bg-emerald-500/15',
  del: 'bg-rose-500/10 text-rose-900 dark:text-rose-200 hover:bg-rose-500/15'
}

const signSymbols: Record<DiffLineType, string> = {
  ctx: ' ',
  add: '+',
  del: '−'
}

const signColors: Record<DiffLineType, string> = {
  ctx: 'text-muted-foreground/40',
  add: 'text-emerald-600 dark:text-emerald-400 font-bold',
  del: 'text-rose-600 dark:text-rose-400 font-bold'
}

export function DiffViewer({
  file,
  maxLines = 1000,
  className = ''
}: DiffViewerProps): React.JSX.Element {
  const [showAll, setShowAll] = useState(false)
  const totalLines = file.hunks.reduce((acc, h) => acc + h.lines.length, 0)
  const isTruncated = !showAll && totalLines > maxLines

  if (!totalLines) {
    return <p className="p-4 text-xs text-muted-foreground">No textual changes.</p>
  }

  const showOldColumn = file.action !== 'create'
  const showNewColumn = file.action !== 'delete'

  let renderedLinesCount = 0

  return (
    <div className={`overflow-x-auto rounded-lg border border-border bg-background font-mono text-xs leading-5 select-text ${className}`}>
      <div className="min-w-max py-1">
        {file.hunks.map((hunk, hIdx) => {
          if (renderedLinesCount >= maxLines && !showAll) return null

          return (
            <div key={hIdx} className={hIdx > 0 ? 'my-1 border-t border-dashed border-border' : ''}>
              {hunk.lines.map((line, lIdx) => {
                if (renderedLinesCount >= maxLines && !showAll) return null
                renderedLinesCount++

                return (
                  <div key={lIdx} className={`flex items-stretch px-2 ${lineStyles[line.type]}`}>
                    {/* Old line number */}
                    {showOldColumn && (
                      <span className="w-10 shrink-0 text-right pr-2 text-muted-foreground/60 select-none">
                        {line.oldNo ?? ''}
                      </span>
                    )}

                    {/* New line number */}
                    {showNewColumn && (
                      <span className="w-10 shrink-0 text-right pr-2 text-muted-foreground/60 select-none">
                        {line.newNo ?? ''}
                      </span>
                    )}

                    {/* Sign (+ / - / space) */}
                    <span className={`w-4 shrink-0 text-center select-none ${signColors[line.type]}`}>
                      {signSymbols[line.type]}
                    </span>

                    {/* Line text */}
                    <span className="whitespace-pre pl-1.5 pr-4 flex-1">
                      {line.text}
                    </span>
                  </div>
                )
              })}
            </div>
          )
        })}

        {isTruncated && (
          <div className="p-3 text-center border-t border-border bg-muted/20">
            <button
              type="button"
              onClick={() => setShowAll(true)}
              className="text-xs text-primary font-medium hover:underline cursor-pointer"
            >
              Show all {totalLines} lines (currently showing {maxLines})
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
