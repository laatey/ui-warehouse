import React from 'react';
import { Text as RNText, TextProps, StyleSheet } from 'react-native';
import { theme } from './theme';

type Weight = 'regular' | 'medium' | 'semibold' | 'bold';

export type AppTextProps = TextProps & {
  size?: number;
  weight?: Weight;
  color?: string;
  center?: boolean;
};

const fontWeightMap = {
  regular: '400' as const,
  medium: '500' as const,
  semibold: '600' as const,
  bold: '700' as const,
};

export function Text({
  size = 15,
  weight = 'regular',
  color,
  center,
  style,
  ...rest
}: AppTextProps): React.JSX.Element {
  return (
    <RNText
      {...rest}
      style={[
        styles.base,
        {
          fontSize: size,
          fontWeight: fontWeightMap[weight],
          color: color ?? theme.colors.foreground,
          textAlign: center ? 'center' : undefined,
        },
        style,
      ]}
    />
  );
}

export function Muted(props: AppTextProps): React.JSX.Element {
  return <Text size={12} color={theme.colors.mutedForeground} {...props} />;
}

const styles = StyleSheet.create({
  base: {
    includeFontPadding: false,
  },
});
