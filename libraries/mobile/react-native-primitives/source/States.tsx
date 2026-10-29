import React from 'react';
import { ActivityIndicator, View, StyleSheet, type StyleProp, type ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Text } from './Text';
import { Button } from './UI';
import { theme } from './theme';

export function LoadingState({
  label = 'Loading…',
  style,
}: {
  label?: string;
  style?: StyleProp<ViewStyle>;
}): React.JSX.Element {
  return (
    <View style={[styles.center, style]}>
      <ActivityIndicator color={theme.colors.primary} />
      <Text size={13} color={theme.colors.mutedForeground}>
        {label}
      </Text>
    </View>
  );
}

export function ErrorState({
  message = "Couldn't load this",
  detail,
  onRetry,
  style,
}: {
  message?: string;
  detail?: string;
  onRetry?: () => void;
  style?: StyleProp<ViewStyle>;
}): React.JSX.Element {
  return (
    <View style={[styles.center, style]}>
      <View style={styles.iconCircle}>
        <Ionicons name="cloud-offline-outline" size={22} color={theme.colors.destructive} />
      </View>
      <Text size={14} weight="semibold" center>
        {message}
      </Text>
      {detail ? (
        <Text size={13} color={theme.colors.mutedForeground} center>
          {detail}
        </Text>
      ) : null}
      {onRetry ? (
        <Button label="Try again" variant="outline" onPress={onRetry} style={{ marginTop: 8 }} />
      ) : null}
    </View>
  );
}

export function EmptyState({
  icon = 'file-tray-outline',
  title,
  detail,
  action,
  style,
}: {
  icon?: keyof typeof Ionicons.glyphMap;
  title: string;
  detail?: string;
  action?: { label: string; onPress: () => void };
  style?: StyleProp<ViewStyle>;
}): React.JSX.Element {
  return (
    <View style={[styles.center, style]}>
      <View style={[styles.iconCircle, { backgroundColor: theme.colors.secondary }]}>
        <Ionicons name={icon} size={22} color={theme.colors.mutedForeground} />
      </View>
      <Text size={14} weight="semibold" center>
        {title}
      </Text>
      {detail ? (
        <Text size={13} color={theme.colors.mutedForeground} center>
          {detail}
        </Text>
      ) : null}
      {action ? (
        <Button label={action.label} variant="outline" onPress={action.onPress} style={{ marginTop: 8 }} />
      ) : null}
    </View>
  );
}

export function InlineError({ message }: { message: string | null }): React.JSX.Element | null {
  if (!message) return null;
  return (
    <View style={styles.inline}>
      <Ionicons name="alert-circle" size={15} color={theme.colors.destructive} />
      <Text size={12} color={theme.colors.destructive} style={{ flex: 1 }}>
        {message}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  center: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 40,
    paddingHorizontal: 24,
  },
  iconCircle: {
    width: 46,
    height: 46,
    borderRadius: 23,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FDECEC',
  },
  inline: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#FDECEC',
    borderRadius: theme.radius.md,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
});
