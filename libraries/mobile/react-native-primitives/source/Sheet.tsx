import React, { ReactNode, useState, useRef, useEffect } from 'react';
import {
  View,
  StyleSheet,
  PanResponder,
  Animated,
  ViewStyle,
  StyleProp,
  ScrollView,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import { theme, shadow } from './theme';

export function SheetHandle({ style }: { style?: StyleProp<ViewStyle> }): React.JSX.Element {
  return <View style={[styles.handle, style]} />;
}

/**
 * 60fps Native-Driver Bottom Sheet with 1-to-1 real-time gesture tracking.
 * Uses ref-tracked layout height to ensure PanResponder never locks or freezes.
 */
export function Sheet({
  children,
  bottomSlot,
  radius = 28,
  paddingBottom = 16,
  hideHandle = false,
  collapsible = false,
  collapsedHeight = 180,
  maxHeight,
  style,
  contentStyle,
}: {
  children: ReactNode;
  bottomSlot?: ReactNode;
  radius?: number;
  paddingBottom?: number;
  hideHandle?: boolean;
  collapsible?: boolean;
  collapsedHeight?: number;
  maxHeight?: number;
  scrollable?: boolean;
  flatBottom?: boolean;
  style?: StyleProp<ViewStyle>;
  contentStyle?: StyleProp<ViewStyle>;
}): React.JSX.Element {
  const [contentHeight, setContentHeight] = useState(0);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const isCollapsedRef = useRef(false);
  const translateY = useRef(new Animated.Value(0)).current;

  const maxCollapse = Math.max(0, contentHeight - collapsedHeight);
  const maxCollapseRef = useRef(maxCollapse);
  maxCollapseRef.current = maxCollapse;

  const collapsibleRef = useRef(collapsible);
  collapsibleRef.current = collapsible;

  useEffect(() => {
    if (isCollapsedRef.current) {
      Animated.spring(translateY, {
        toValue: maxCollapse,
        tension: 70,
        friction: 11,
        useNativeDriver: true,
      }).start();
    }
  }, [maxCollapse, translateY]);

  const snapTo = (toValue: number, collapsedState: boolean) => {
    setIsCollapsed(collapsedState);
    isCollapsedRef.current = collapsedState;
    Animated.spring(translateY, {
      toValue,
      tension: 70,
      friction: 11,
      useNativeDriver: true,
    }).start();
  };

  const toggle = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const next = !isCollapsedRef.current;
    snapTo(next ? maxCollapseRef.current : 0, next);
  };

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => collapsibleRef.current,
      onMoveShouldSetPanResponder: (_, gestureState) =>
        collapsibleRef.current && Math.abs(gestureState.dy) > 2,
      onPanResponderGrant: () => {
        if (!collapsibleRef.current) return;
        translateY.stopAnimation();
      },
      onPanResponderMove: (_, gestureState) => {
        if (!collapsibleRef.current) return;
        const maxC = maxCollapseRef.current;
        const initialY = isCollapsedRef.current ? maxC : 0;
        const targetY = Math.max(0, Math.min(maxC, initialY + gestureState.dy));
        translateY.setValue(targetY);
      },
      onPanResponderRelease: async (_, gestureState) => {
        if (!collapsibleRef.current) return;
        const maxC = maxCollapseRef.current;
        const dy = gestureState.dy;
        const velocityY = gestureState.vy;

        if (Math.abs(dy) < 6 && Math.abs(gestureState.dx) < 6) {
          await toggle();
          return;
        }

        if (velocityY > 0.25 || dy > 30) {
          snapTo(maxC, true);
        } else if (velocityY < -0.25 || dy < -30) {
          snapTo(0, false);
        } else {
          const currentY = (translateY as any)._value ?? 0;
          if (currentY > maxC / 2) {
            snapTo(maxC, true);
          } else {
            snapTo(0, false);
          }
        }
      },
      onPanResponderTerminate: () => {
        if (!collapsibleRef.current) return;
        snapTo(isCollapsedRef.current ? maxCollapseRef.current : 0, isCollapsedRef.current);
      },
    })
  ).current;

  return (
    <Animated.View
      style={[
        styles.sheet,
        {
          borderTopLeftRadius: radius,
          borderTopRightRadius: radius,
          borderBottomLeftRadius: 0,
          borderBottomRightRadius: 0,
          transform: [{ translateY }],
        },
        shadow.sheet,
        style,
      ]}
    >
      <View onLayout={(e) => setContentHeight(e.nativeEvent.layout.height)}>
        {collapsible && !hideHandle ? (
          <View
            {...panResponder.panHandlers}
            style={styles.handleTouchable}
            accessibilityLabel="Drag grab bar to collapse or expand sheet"
          >
            <SheetHandle />
          </View>
        ) : !hideHandle ? (
          <View style={styles.staticHandleWrap}>
            <SheetHandle />
          </View>
        ) : null}

        <ScrollView
          style={maxHeight ? { maxHeight } : undefined}
          showsVerticalScrollIndicator={false}
          nestedScrollEnabled
          contentContainerStyle={[
            { paddingHorizontal: 20, paddingBottom: bottomSlot ? 8 : paddingBottom },
            contentStyle,
          ]}
        >
          {children}
        </ScrollView>

        {bottomSlot ? (
          <View style={[styles.fixedFooter, { paddingHorizontal: 20, paddingBottom }]}>
            {bottomSlot}
          </View>
        ) : null}
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  sheet: {
    width: '100%',
    backgroundColor: theme.colors.background,
  },
  handleTouchable: {
    width: '100%',
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  staticHandleWrap: {
    paddingTop: 12,
    alignItems: 'center',
  },
  handle: {
    alignSelf: 'center',
    height: 5,
    width: 44,
    borderRadius: 9999,
    backgroundColor: theme.colors.border,
  },
  fixedFooter: {
    backgroundColor: theme.colors.background,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: theme.colors.border,
    paddingTop: 16,
  },
});
