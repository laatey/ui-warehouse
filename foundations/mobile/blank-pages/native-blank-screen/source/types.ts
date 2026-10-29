import React, { ReactNode } from 'react';
import { StyleProp, ViewStyle } from 'react-native';

export interface NativeBlankScreenProps {
  /** Title for header bar */
  title?: string;

  /** Back button handler (shows back arrow if provided) */
  onBack?: () => void;

  /** Header right-side actions slot */
  headerAction?: ReactNode;

  /** Blank screen content container (empty by default for agent's application) */
  children: ReactNode;

  /** Optional fixed footer slot pinned to the bottom (e.g., CTA button) */
  footer?: ReactNode;

  /** Whether the main content area should scroll (default true) */
  scrollable?: boolean;

  /** Background color (default #FFFFFF) */
  backgroundColor?: string;

  style?: StyleProp<ViewStyle>;
  contentContainerStyle?: StyleProp<ViewStyle>;
}
