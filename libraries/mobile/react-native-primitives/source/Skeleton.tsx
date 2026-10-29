import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import { theme } from './theme';

export function Skeleton({
  width,
  height = 14,
  radius = 8,
  style,
}: {
  width?: number | `${number}%`;
  height?: number;
  radius?: number;
  style?: StyleProp<ViewStyle>;
}): React.JSX.Element {
  const opacity = useRef(new Animated.Value(0.35)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, { toValue: 1, duration: 650, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 0.35, duration: 650, useNativeDriver: true }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [opacity]);

  return (
    <Animated.View
      style={[
        styles.base,
        { width, height, borderRadius: radius, opacity },
        style,
      ]}
    />
  );
}

export function SkeletonText({
  width = '100%',
  size = 14,
  style,
}: {
  width?: number | `${number}%`;
  size?: number;
  style?: StyleProp<ViewStyle>;
}): React.JSX.Element {
  return <Skeleton width={width} height={Math.round(size * 1.05)} radius={4} style={style} />;
}

export function SkeletonCircle({
  size = 40,
  style,
}: {
  size?: number;
  style?: StyleProp<ViewStyle>;
}): React.JSX.Element {
  return <Skeleton width={size} height={size} radius={size / 2} style={style} />;
}

export function SkeletonRow({ style }: { style?: StyleProp<ViewStyle> }): React.JSX.Element {
  return (
    <View style={[styles.row, style]}>
      <SkeletonCircle size={36} />
      <View style={styles.rowContent}>
        <SkeletonText width="60%" size={15} />
        <SkeletonText width="40%" size={12} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  base: { backgroundColor: theme.colors.secondary },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 12 },
  rowContent: { flex: 1, gap: 6 },
});
