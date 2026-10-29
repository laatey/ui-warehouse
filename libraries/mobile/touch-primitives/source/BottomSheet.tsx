import React from 'react'
import { Drawer } from 'vaul'
import { BottomSheetProps } from './types'

export function BottomSheet({
  open,
  onOpenChange,
  title,
  description,
  children,
  trigger,
  className = ''
}: BottomSheetProps): React.JSX.Element {
  return (
    <Drawer.Root open={open} onOpenChange={onOpenChange}>
      {trigger && <Drawer.Trigger asChild>{trigger}</Drawer.Trigger>}
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs" />
        <Drawer.Content
          aria-label={typeof title === 'string' ? title : 'Drawer'}
          className={`fixed inset-x-0 bottom-0 z-50 mt-24 flex max-h-[85vh] flex-col rounded-t-[10px] bg-background border-t border-border focus:outline-none ${className}`}
        >
          <div className="mx-auto mt-3 h-1.5 w-12 shrink-0 rounded-full bg-muted-foreground/30" />
          
          {(title || description) && (
            <div className="p-4 border-b border-border text-center sm:text-left">
              {title && (
                <Drawer.Title className="text-base font-semibold text-foreground">
                  {title}
                </Drawer.Title>
              )}
              {description && (
                <Drawer.Description className="text-xs text-muted-foreground mt-0.5">
                  {description}
                </Drawer.Description>
              )}
            </div>
          )}

          <div className="flex-1 overflow-y-auto p-4 pb-[calc(1rem+env(safe-area-inset-bottom))]">
            {children}
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  )
}
