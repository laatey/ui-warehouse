import React, { ReactNode } from 'react';
import { StyleProp, ViewStyle } from 'react-native';

export interface NativeScreenHeaderProps {
  title: string;
  onBack?: () => void;
  action?: ReactNode;
  titleSize?: number;
  titleWeight?: 'regular' | 'medium' | 'semibold' | 'bold';
  textColor?: string;
  style?: StyleProp<ViewStyle>;
}
