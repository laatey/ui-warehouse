import React from 'react';
import { StyleProp, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';

export interface TabRouteConfig {
  name: string;
  label?: string;
  iconName: keyof typeof Ionicons.glyphMap;
  badge?: number | string;
}

export interface NativeTabBarProps extends BottomTabBarProps {
  activeColor?: string;
  inactiveColor?: string;
  backgroundColor?: string;
  borderColor?: string;
  style?: StyleProp<ViewStyle>;
}
