import React, { useState } from 'react';
import { DynamicIslandShellProps, DynamicIslandState } from './types';

export const DynamicIslandShell: React.FC<DynamicIslandShellProps> = ({
  state: controlledState,
  onStateChange,
  placement = 'flush-notch',
  showConcaveEars = true,
  idleSlot,
  compactSlot,
  expandedSlot,
  children,
  className = '',
}) => {
  const [internalState, setInternalState] = useState<DynamicIslandState>('idle');
  const currentState = controlledState !== undefined ? controlledState : internalState;

  const setState = (nextState: DynamicIslandState) => {
    if (controlledState === undefined) {
      setInternalState(nextState);
    }
    if (onStateChange) {
      onStateChange(nextState);
    }
  };

  const isFlush = placement === 'flush-notch';

  // Geometry dimensions based on state
  const dimensionClasses = {
    idle: isFlush ? 'w-[140px] h-[32px] rounded-b-xl' : 'w-[140px] h-[36px] rounded-full mt-3',
    compact: isFlush ? 'w-[320px] h-[44px] rounded-b-2xl' : 'w-[340px] h-[48px] rounded-full mt-3',
    expanded: isFlush ? 'w-[440px] min-h-[180px] rounded-b-3xl' : 'w-[440px] min-h-[180px] rounded-3xl mt-3',
  }[currentState];

  return (
    <div className={`relative flex items-start justify-center select-none ${className}`}>
      {/* Left Concave Fillet Ear (for flush notch integration) */}
      {isFlush && showConcaveEars && (
        <svg
          className="text-foreground shrink-0 w-3 h-3 fill-current pointer-events-none transition-transform"
          viewBox="0 0 12 12"
          width="12"
          height="12"
          fill="none"
          aria-hidden="true"
        >
          <path d="M 0 0 L 12 0 L 12 12 A 12 12 0 0 0 0 0 Z" />
        </svg>
      )}

      {/* Main Dynamic Island Morphing Container */}
      <div
        className={`relative overflow-hidden bg-foreground text-background transition-all duration-300 ease-out shadow-2xl flex flex-col justify-center ${dimensionClasses}`}
        role="region"
        aria-label="Dynamic Island HUD"
      >
        {children ? (
          children
        ) : (
          <>
            {currentState === 'idle' && (
              <div
                className="w-full h-full flex items-center justify-between px-3 cursor-pointer text-xs font-medium"
                onClick={() => setState('compact')}
              >
                {idleSlot || (
                  <>
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="opacity-80">Idle</span>
                  </>
                )}
              </div>
            )}

            {currentState === 'compact' && (
              <div
                className="w-full h-full flex items-center justify-between px-4 cursor-pointer text-sm"
                onClick={() => setState('expanded')}
              >
                {compactSlot || (
                  <>
                    <span className="truncate opacity-90 text-xs">Activity in progress...</span>
                    <span className="text-xs font-mono opacity-70">Active</span>
                  </>
                )}
              </div>
            )}

            {currentState === 'expanded' && (
              <div className="w-full p-4 flex flex-col justify-between">
                {expandedSlot || (
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-semibold">Active Status</h4>
                      <button
                        type="button"
                        onClick={() => setState('idle')}
                        className="text-xs opacity-70 hover:opacity-100 transition-opacity"
                        aria-label="Collapse island"
                      >
                        Minimize
                      </button>
                    </div>
                    <div className="h-16 flex items-center justify-center border border-background/20 rounded-lg text-xs opacity-60">
                      Empty HUD Container Slot
                    </div>
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>

      {/* Right Concave Fillet Ear (for flush notch integration) */}
      {isFlush && showConcaveEars && (
        <svg
          className="text-foreground shrink-0 w-3 h-3 fill-current pointer-events-none transition-transform"
          viewBox="0 0 12 12"
          width="12"
          height="12"
          fill="none"
          aria-hidden="true"
        >
          <path d="M 0 0 L 0 12 A 12 12 0 0 1 12 0 Z" />
        </svg>
      )}
    </div>
  );
};
