import React, { ReactNode, useEffect, useRef, useState } from 'react';
import {
  Modal,
  View,
  Pressable,
  ScrollView,
  StyleSheet,
  Animated,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';

import { Text } from './Text';
import { SheetHandle } from './Sheet';
import { theme, shadow } from './theme';

export function ActionSheet({
  open,
  onClose,
  title,
  subtitle,
  children,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  children: ReactNode;
}): React.JSX.Element | null {
  const [mounted, setMounted] = useState(open);
  const backdropAnim = useRef(new Animated.Value(0)).current;
  const sheetAnim = useRef(new Animated.Value(400)).current;

  useEffect(() => {
    if (open) {
      setMounted(true);
      Animated.parallel([
        Animated.timing(backdropAnim, {
          toValue: 1,
          duration: 220,
          useNativeDriver: true,
        }),
        Animated.spring(sheetAnim, {
          toValue: 0,
          tension: 65,
          friction: 11,
          useNativeDriver: true,
        }),
      ]).start();
    } else if (mounted) {
      Animated.parallel([
        Animated.timing(backdropAnim, {
          toValue: 0,
          duration: 180,
          useNativeDriver: true,
        }),
        Animated.timing(sheetAnim, {
          toValue: 400,
          duration: 180,
          useNativeDriver: true,
        }),
      ]).start(() => setMounted(false));
    }
  }, [open, mounted, backdropAnim, sheetAnim]);

  const handleClose = () => {
    Animated.parallel([
      Animated.timing(backdropAnim, {
        toValue: 0,
        duration: 180,
        useNativeDriver: true,
      }),
      Animated.timing(sheetAnim, {
        toValue: 400,
        duration: 180,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setMounted(false);
      onClose();
    });
  };

  if (!mounted && !open) return null;

  return (
    <Modal visible={mounted || open} transparent animationType="none" onRequestClose={handleClose}>
      <View style={styles.root}>
        <Animated.View
          style={[
            StyleSheet.absoluteFill,
            { backgroundColor: 'rgba(11,15,24,0.4)', opacity: backdropAnim },
          ]}
        >
          <Pressable accessibilityLabel="Close sheet" style={StyleSheet.absoluteFill} onPress={handleClose} />
        </Animated.View>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardWrap}
          pointerEvents="box-none"
        >
          <Animated.View style={[styles.sheet, shadow.sheet, { transform: [{ translateY: sheetAnim }] }]}>
            <SheetHandle style={{ marginBottom: 12 }} />
            <View style={styles.header}>
              <View style={styles.headerTitleWrap}>
                <Text size={18} weight="semibold">
                  {title}
                </Text>
                {!!subtitle && (
                  <Text size={12} color={theme.colors.mutedForeground}>
                    {subtitle}
                  </Text>
                )}
              </View>
              <Pressable
                accessibilityLabel="Close"
                onPress={handleClose}
                style={({ pressed }) => [styles.close, pressed && { opacity: 0.7 }]}
              >
                <Ionicons name="close" size={16} color={theme.colors.foreground} />
              </Pressable>
            </View>
            <ScrollView
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
              contentContainerStyle={{ paddingBottom: 32 }}
            >
              {children}
            </ScrollView>
          </Animated.View>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
}

export function ActionRow({
  icon,
  customIcon,
  label,
  detail,
  tone,
  onPress,
  right,
  last = false,
}: {
  icon?: keyof typeof Ionicons.glyphMap;
  customIcon?: ReactNode;
  label: string;
  detail?: string;
  tone?: 'danger';
  onPress?: () => void;
  right?: ReactNode;
  last?: boolean;
}): React.JSX.Element {
  const color = tone === 'danger' ? theme.colors.destructive : theme.colors.foreground;

  return (
    <Pressable
      onPress={async () => {
        if (!onPress) return;
        await Haptics.impactAsync(
          tone === 'danger' ? Haptics.ImpactFeedbackStyle.Medium : Haptics.ImpactFeedbackStyle.Light
        );
        onPress();
      }}
      style={({ pressed }) => [styles.row, pressed && { opacity: 0.7 }]}
    >
      <View style={styles.rowIcon}>
        {customIcon ? (
          customIcon
        ) : icon ? (
          <Ionicons
            name={icon}
            size={18}
            color={tone === 'danger' ? theme.colors.destructive : theme.colors.mutedForeground}
          />
        ) : null}
      </View>
      <View style={[styles.rowBody, !last && styles.dashed]}>
        <Text size={15} weight="semibold" color={color} numberOfLines={1}>
          {label}
        </Text>
        {!!detail && (
          <Text size={12} color={theme.colors.mutedForeground} numberOfLines={1}>
            {detail}
          </Text>
        )}
      </View>
      {right ? <View style={{ paddingLeft: 8 }}>{right}</View> : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: 'transparent' },
  keyboardWrap: { flex: 1, justifyContent: 'flex-end' },
  sheet: {
    maxHeight: '70%',
    width: '100%',
    backgroundColor: theme.colors.background,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 24,
  },
  header: { flexDirection: 'row', alignItems: 'flex-start', gap: 12, marginBottom: 12 },
  headerTitleWrap: { flex: 1, minWidth: 0 },
  close: {
    width: 36,
    height: 36,
    borderRadius: 9999,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.secondary,
  },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  rowIcon: { width: 36, alignItems: 'center', justifyContent: 'center' },
  rowBody: { flex: 1, minWidth: 0, paddingVertical: 14 },
  dashed: { borderBottomWidth: 1, borderStyle: 'dashed', borderBottomColor: theme.colors.border },
});
