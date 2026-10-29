import React from 'react';

export type DynamicIslandState = 'idle' | 'compact' | 'expanded';
export type DynamicIslandPlacement = 'flush-notch' | 'floating-island';

export interface DynamicIslandShellProps {
  state?: DynamicIslandState;
  onStateChange?: (state: DynamicIslandState) => void;
  placement?: DynamicIslandPlacement;
  showConcaveEars?: boolean;
  idleSlot?: React.ReactNode;
  compactSlot?: React.ReactNode;
  expandedSlot?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
}
