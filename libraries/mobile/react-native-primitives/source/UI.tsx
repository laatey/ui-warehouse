import React, { forwardRef, ReactNode } from 'react';
import {
  View,
  Pressable,
  StyleSheet,
  TextInput,
  StyleProp,
  ViewStyle,
  TextInputProps,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';

import { Text } from './Text';
import { theme, shadow } from './theme';

export function Button({
  label,
  onPress,
  variant = 'primary',
  disabled = false,
  loading = false,
  style,
  haptic = 'light',
}: {
  label: string;
  onPress?: () => void;
  variant?: 'primary' | 'outline' | 'secondary' | 'danger';
  disabled?: boolean;
  loading?: boolean;
  style?: StyleProp<ViewStyle>;
  haptic?: 'light' | 'success' | 'warning' | 'none';
}): React.JSX.Element {
  const bg =
    variant === 'primary'
      ? theme.colors.primary
      : variant === 'secondary'
        ? theme.colors.secondary
        : variant === 'danger'
          ? theme.colors.destructive
          : 'transparent';
  const fg =
    variant === 'primary' || variant === 'danger'
      ? theme.colors.primaryForeground
      : theme.colors.foreground;

  return (
    <Pressable
      disabled={disabled || loading}
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={async () => {
        if (!onPress) return;
        if (haptic === 'success') {
          await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        } else if (haptic === 'warning') {
          await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
        } else if (haptic === 'light') {
          await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        }
        onPress();
      }}
      style={({ pressed }) => [
        styles.button,
        { backgroundColor: bg },
        variant === 'outline' && { borderWidth: 1, borderColor: theme.colors.border },
        (disabled || loading) && { opacity: 0.45 },
        pressed && !disabled && !loading && { opacity: 0.85, transform: [{ scale: 0.99 }] },
        style,
      ]}
    >
      <View style={styles.buttonInner}>
        {loading ? <ActivityIndicator size="small" color={fg} /> : null}
        <Text size={15} weight="semibold" color={fg}>
          {label}
        </Text>
      </View>
    </Pressable>
  );
}

export function Card({
  children,
  style,
}: {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
}): React.JSX.Element {
  return <View style={[styles.card, shadow.soft, style]}>{children}</View>;
}

export function Outlined({
  children,
  style,
}: {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
}): React.JSX.Element {
  return <View style={[styles.outlined, style]}>{children}</View>;
}

export function DataRow({
  label,
  value,
  tone,
  last = false,
}: {
  label: string;
  value: string;
  tone?: 'positive' | 'negative';
  last?: boolean;
}): React.JSX.Element {
  return (
    <View style={[styles.dataRow, !last && styles.dashed]}>
      <Text size={14} color={theme.colors.mutedForeground}>
        {label}
      </Text>
      <Text
        size={14}
        weight="semibold"
        color={
          tone === 'positive'
            ? theme.colors.success
            : tone === 'negative'
              ? theme.colors.destructive
              : undefined
        }
      >
        {value}
      </Text>
    </View>
  );
}

export function ListRow({
  icon,
  label,
  detail,
  right,
  onPress,
  tone,
  last = false,
}: {
  icon?: keyof typeof Ionicons.glyphMap;
  label: string;
  detail?: string;
  right?: ReactNode;
  onPress?: () => void;
  tone?: 'danger';
  last?: boolean;
}): React.JSX.Element {
  const color = tone === 'danger' ? theme.colors.destructive : theme.colors.foreground;

  return (
    <Pressable
      onPress={async () => {
        if (!onPress) return;
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        onPress();
      }}
      style={({ pressed }) => [styles.listRow, pressed && onPress ? { opacity: 0.7 } : null]}
    >
      {icon ? (
        <View style={styles.listIcon}>
          <Ionicons
            name={icon}
            size={18}
            color={tone === 'danger' ? theme.colors.destructive : theme.colors.mutedForeground}
          />
        </View>
      ) : null}
      <View style={[styles.listBody, !last && styles.dashed]}>
        <View style={styles.flexShrink}>
          <Text size={15} weight="semibold" color={color} numberOfLines={1}>
            {label}
          </Text>
          {!!detail && (
            <Text size={12} color={theme.colors.mutedForeground} numberOfLines={1}>
              {detail}
            </Text>
          )}
        </View>
        {right}
      </View>
    </Pressable>
  );
}

export const Field = forwardRef<
  TextInput,
  TextInputProps & { label?: string; hint?: string; containerStyle?: StyleProp<ViewStyle> }
>(function Field({ label, hint, style, containerStyle, ...rest }, ref) {
  return (
    <View style={[styles.fieldWrap, containerStyle]}>
      {!!label && (
        <Text size={12} color={theme.colors.mutedForeground}>
          {label}
        </Text>
      )}
      <TextInput
        ref={ref}
        placeholderTextColor={theme.colors.mutedForeground}
        {...rest}
        style={[styles.input, style]}
      />
      {!!hint && (
        <Text size={11} color={theme.colors.mutedForeground}>
          {hint}
        </Text>
      )}
    </View>
  );
});

export function Pill({
  label,
  tone = 'accent',
}: {
  label: string;
  tone?: 'accent' | 'secondary' | 'danger';
}): React.JSX.Element {
  const bg =
    tone === 'accent'
      ? theme.colors.accent
      : tone === 'danger'
        ? '#FDECEC'
        : theme.colors.secondary;
  const fg =
    tone === 'accent'
      ? theme.colors.accentForeground
      : tone === 'danger'
        ? theme.colors.destructive
        : theme.colors.secondaryForeground;

  return (
    <View style={[styles.pill, { backgroundColor: bg }]}>
      <Text size={12} weight="semibold" color={fg}>
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  button: {
    height: 52,
    borderRadius: 9999,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  buttonInner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  card: {
    backgroundColor: theme.colors.secondary,
    borderRadius: theme.radius.xl,
    padding: 16,
  },
  outlined: {
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radius['2xl'],
    padding: 16,
    backgroundColor: theme.colors.card,
  },
  dataRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  listRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  listIcon: {
    width: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  listBody: {
    flex: 1,
    minWidth: 0,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 14,
  },
  flexShrink: {
    flex: 1,
    minWidth: 0,
  },
  dashed: {
    borderBottomWidth: 1,
    borderStyle: 'dashed',
    borderBottomColor: theme.colors.border,
  },
  fieldWrap: {
    gap: 6,
  },
  input: {
    height: 48,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.card,
    paddingHorizontal: 16,
    fontSize: 15,
    color: theme.colors.foreground,
  },
  pill: {
    borderRadius: 9999,
    paddingHorizontal: 12,
    paddingVertical: 4,
    alignSelf: 'flex-start',
  },
});
