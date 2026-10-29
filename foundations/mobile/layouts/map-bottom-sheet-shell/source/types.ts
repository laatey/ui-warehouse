import React, { ReactNode } from 'react';
import { StyleProp, ViewStyle } from 'react-native';

export interface MapBottomSheetShellProps {
  /** Background viewport component (e.g. MapView, Camera, or empty container) */
  mapView?: ReactNode;

  /** Content displayed inside the bottom sheet (blank by default for agent's application) */
  children: ReactNode;

  /** Optional fixed footer slot pinned to the bottom of the sheet */
  bottomSlot?: ReactNode;

  /** Show back arrow button in top-left */
  onBack?: () => void;

  /** Custom top-right action button or status chip */
  topRight?: ReactNode;

  /** Floating button slot above the sheet (e.g., location recenter, layer toggle) */
  floatingAction?: ReactNode;

  /** Center marker or crosshair slot over the viewport */
  centerMarker?: ReactNode;

  /** Whether the sheet can be collapsed/expanded via drag gestures */
  collapsible?: boolean;

  /** Height in px when sheet is collapsed (default 180) */
  collapsedHeight?: number;

  /** Maximum sheet height as a ratio of screen height (default 0.6) */
  maxHeightRatio?: number;

  /** Sheet corner radius (default 32) */
  radius?: number;

  /** Hide the grab handle bar */
  hideHandle?: boolean;

  style?: StyleProp<ViewStyle>;
}
