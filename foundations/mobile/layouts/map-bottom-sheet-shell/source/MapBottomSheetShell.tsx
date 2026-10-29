import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  StyleSheet,
  Pressable,
  Dimensions,
  Animated,
  PanResponder,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { MapBottomSheetShellProps } from './types';

const { height: SCREEN_H } = Dimensions.get('window');

export function MapBottomSheetShell({
  mapView,
  children,
  bottomSlot,
  onBack,
  topRight,
  floatingAction,
  centerMarker,
  collapsible = true,
  collapsedHeight = 180,
  maxHeightRatio = 0.6,
  radius = 32,
  hideHandle = false,
  style,
}: MapBottomSheetShellProps): React.JSX.Element {
  const insets = useSafeAreaInsets();
  const [contentHeight, setContentHeight] = useState(0);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const isCollapsedRef = useRef(false);
  const translateY = useRef(new Animated.Value(0)).current;

  const sheetMaxHeight = SCREEN_H * maxHeightRatio;
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
    })
  ).current;

  return (
    <View style={[styles.root, style]}>
      {/* Background Map or Viewport Surface */}
      <View style={StyleSheet.absoluteFill}>
        {mapView}
      </View>

      {/* Center Marker Slot */}
      {centerMarker && (
        <View style={styles.centerMarkerContainer} pointerEvents="none">
          {centerMarker}
        </View>
      )}

      {/* Floating Top Navigation Bar */}
      {(onBack || topRight) && (
        <View style={[styles.topBar, { paddingTop: insets.top + 8 }]}>
          {onBack ? (
            <Pressable
              accessibilityLabel="Go back"
              onPress={async () => {
                await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                onBack();
              }}
              style={({ pressed }) => [styles.roundBtn, pressed && styles.pressed]}
            >
              <Ionicons name="chevron-back" size={20} color="#0B0F18" />
            </Pressable>
          ) : (
            <View />
          )}
          {topRight ?? <View />}
        </View>
      )}

      {/* Floating Action Button above Sheet */}
      {floatingAction && (
        <View style={[styles.floatingWrap, { bottom: sheetMaxHeight + 12 }]} pointerEvents="box-none">
          {floatingAction}
        </View>
      )}

      {/* Draggable Bottom Sheet */}
      <View style={[styles.sheetWrap, { maxHeight: sheetMaxHeight }]} pointerEvents="box-none">
        <Animated.View
          style={[
            styles.sheet,
            {
              borderTopLeftRadius: radius,
              borderTopRightRadius: radius,
              transform: [{ translateY }],
            },
          ]}
        >
          <View onLayout={(e) => setContentHeight(e.nativeEvent.layout.height)}>
            {/* Grab Handle */}
            {!hideHandle && (
              <View
                {...(collapsible ? panResponder.panHandlers : {})}
                style={styles.handleTouchable}
                accessibilityLabel="Drag grab bar to collapse or expand sheet"
              >
                <View style={styles.handle} />
              </View>
            )}

            {/* Empty Main Content Container for Agent's Application */}
            <ScrollView
              style={{ maxHeight: sheetMaxHeight - 56 }}
              showsVerticalScrollIndicator={false}
              nestedScrollEnabled
              contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: bottomSlot ? 8 : 24 }}
            >
              {children}
            </ScrollView>

            {/* Optional Fixed Bottom Action Slot */}
            {bottomSlot && (
              <View style={[styles.fixedFooter, { paddingBottom: Math.max(insets.bottom, 16) }]}>
                {bottomSlot}
              </View>
            )}
          </View>
        </Animated.View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#EDF0F6' },
  topBar: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    zIndex: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  roundBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    shadowColor: '#0B0F18',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  pressed: { opacity: 0.75, transform: [{ scale: 0.98 }] },
  centerMarkerContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: Math.round(SCREEN_H * 0.35),
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 15,
  },
  floatingWrap: {
    position: 'absolute',
    right: 20,
    zIndex: 12,
  },
  sheetWrap: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 10,
    justifyContent: 'flex-end',
  },
  sheet: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    shadowColor: '#0B0F18',
    shadowOffset: { width: 0, height: -8 },
    shadowOpacity: 0.12,
    shadowRadius: 20,
    elevation: 10,
  },
  handleTouchable: {
    width: '100%',
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  handle: {
    width: 44,
    height: 5,
    borderRadius: 9999,
    backgroundColor: '#E2E5EA',
  },
  fixedFooter: {
    backgroundColor: '#FFFFFF',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#E2E5EA',
    paddingTop: 14,
    paddingHorizontal: 20,
  },
});
