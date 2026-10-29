import React, { useState } from 'react'
import { BlankSettingsPageProps } from './types'

export function BlankSettingsPage({
  title = 'Settings',
  description,
  sections,
  activeSectionId,
  onSectionChange,
  children,
  className = ''
}: BlankSettingsPageProps): React.JSX.Element {
  const [internalActiveId, setInternalActiveId] = useState(sections[0]?.id)
  const currentId = activeSectionId ?? internalActiveId
  const handleSelect = (id: string) => {
    setInternalActiveId(id)
    onSectionChange?.(id)
  }

  const activeSection = sections.find((s) => s.id === currentId) || sections[0]

  return (
    <div className={`flex flex-col min-h-full w-full p-6 md:p-8 space-y-6 ${className}`}>
      {/* Header */}
      <div className="pb-4 border-b border-border">
        <h1 className="text-xl md:text-2xl font-semibold tracking-tight text-foreground">
          {title}
        </h1>
        {description && (
          <p className="text-sm text-muted-foreground mt-1">
            {description}
          </p>
        )}
      </div>

      {/* Two-Column Settings Container */}
      <div className="flex flex-col md:flex-row gap-8 items-start flex-1 min-h-0">
        {/* Navigation Sidebar */}
        <aside className="w-full md:w-56 shrink-0 space-y-1">
          {sections.map((section) => {
            const isActive = section.id === currentId
            return (
              <button
                key={section.id}
                type="button"
                onClick={() => handleSelect(section.id)}
                className={`w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium rounded-md text-left transition-colors cursor-pointer ${
                  isActive
                    ? 'bg-accent text-foreground'
                    : 'text-muted-foreground hover:text-foreground hover:bg-accent/50'
                }`}
              >
                {section.icon && <span className="shrink-0">{section.icon}</span>}
                <span className="truncate">{section.label}</span>
              </button>
            )
          })}
        </aside>

        {/* Section Content Area (Empty by default for future configuration fields) */}
        <div className="flex-1 min-w-0 w-full space-y-6">
          {activeSection && (
            <div className="space-y-1">
              <h2 className="text-base font-medium text-foreground">
                {activeSection.label}
              </h2>
              {activeSection.description && (
                <p className="text-xs text-muted-foreground">
                  {activeSection.description}
                </p>
              )}
            </div>
          )}

          <div className="w-full pt-2">
            {children ?? activeSection?.content}
          </div>
        </div>
      </div>
    </div>
  )
}
