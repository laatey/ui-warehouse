import React from 'react';
import { View, Pressable, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { NativeScreenHeaderProps } from './types';

export function NativeScreenHeader({
  title,
  onBack,
  action,
  titleSize = 20,
  titleWeight = 'bold',
  textColor = '#0B0F18',
  style,
}: NativeScreenHeaderProps): React.JSX.Element {
  const handleBack = async () => {
    if (onBack) {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      onBack();
    }
  };

  const fontWeightMap = {
    regular: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
    bold: '700' as const,
  };

  return (
    <View style={[styles.header, style]}>
      {onBack && (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Go back"
          onPress={handleBack}
          style={({ pressed }) => [styles.back, pressed && styles.pressed]}
        >
          <Ionicons name="chevron-back" size={22} color={textColor} />
        </Pressable>
      )}

      <Text
        style={[
          styles.title,
          {
            fontSize: titleSize,
            fontWeight: fontWeightMap[titleWeight],
            color: textColor,
          },
        ]}
        numberOfLines={1}
      >
        {title}
      </Text>

      {action && <View style={styles.action}>{action}</View>}
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 14,
    minHeight: 48,
  },
  back: {
    position: 'absolute',
    left: 12,
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  pressed: {
    opacity: 0.6,
  },
  title: {
    textAlign: 'center',
  },
  action: {
    position: 'absolute',
    right: 16,
    zIndex: 1,
  },
});
