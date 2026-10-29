import React from 'react';
import { View, Pressable, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { NativeTabBarProps } from './types';

export function NativeTabBar({
  state,
  descriptors,
  navigation,
  activeColor = '#0B0F18',
  inactiveColor = '#6C727E',
  backgroundColor = '#FFFFFF',
  borderColor = '#E2E5EA',
  style,
}: NativeTabBarProps): React.JSX.Element {
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.wrap,
        {
          backgroundColor,
          borderTopColor: borderColor,
          paddingBottom: Math.max(insets.bottom, 6),
        },
        style,
      ]}
    >
      <View style={styles.bar}>
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const label =
            options.tabBarLabel !== undefined
              ? (options.tabBarLabel as string)
              : options.title !== undefined
                ? options.title
                : route.name;
          const icon = (options as any).iconName as keyof typeof Ionicons.glyphMap;
          const focused = state.index === index;

          return (
            <Pressable
              key={route.key}
              accessibilityRole="button"
              accessibilityState={focused ? { selected: true } : {}}
              accessibilityLabel={options.tabBarAccessibilityLabel ?? label}
              onPress={async () => {
                await Haptics.selectionAsync();
                const event = navigation.emit({
                  type: 'tabPress',
                  target: route.key,
                  canPreventDefault: true,
                });
                if (!focused && !event.defaultPrevented) {
                  navigation.navigate(route.name);
                }
              }}
              style={styles.item}
            >
              {icon ? (
                <Ionicons
                  name={focused ? icon : (`${icon}-outline` as keyof typeof Ionicons.glyphMap)}
                  size={22}
                  color={focused ? activeColor : inactiveColor}
                />
              ) : null}
              <Text
                style={[
                  styles.label,
                  {
                    color: focused ? activeColor : inactiveColor,
                    fontWeight: focused ? '600' : '500',
                  },
                ]}
                numberOfLines={1}
              >
                {label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    borderTopWidth: 1,
  },
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    height: 54,
  },
  item: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 3,
    paddingVertical: 6,
  },
  label: {
    fontSize: 11,
    textAlign: 'center',
  },
});
