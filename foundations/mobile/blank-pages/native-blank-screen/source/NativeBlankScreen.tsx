import React from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { NativeScreenHeader } from '../../navigation/native-screen-header/source/NativeScreenHeader';
import { NativeBlankScreenProps } from './types';

export function NativeBlankScreen({
  title,
  onBack,
  headerAction,
  children,
  footer,
  scrollable = true,
  backgroundColor = '#FFFFFF',
  style,
  contentContainerStyle,
}: NativeBlankScreenProps): React.JSX.Element {
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.root,
        {
          backgroundColor,
          paddingTop: insets.top,
        },
        style,
      ]}
    >
      {/* Optional Screen Header */}
      {(title || onBack || headerAction) && (
        <NativeScreenHeader
          title={title ?? ''}
          onBack={onBack}
          action={headerAction}
        />
      )}

      {/* Main Content Area (Empty by default) */}
      {scrollable ? (
        <ScrollView
          style={styles.flex}
          contentContainerStyle={[
            styles.scrollContent,
            { paddingBottom: footer ? 12 : Math.max(insets.bottom, 20) },
            contentContainerStyle,
          ]}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {children}
        </ScrollView>
      ) : (
        <View style={[styles.flex, styles.staticContent, contentContainerStyle]}>
          {children}
        </View>
      )}

      {/* Optional Sticky / Fixed Footer Slot */}
      {footer && (
        <View
          style={[
            styles.footer,
            { paddingBottom: Math.max(insets.bottom, 16) },
          ]}
        >
          {footer}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  flex: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 8,
  },
  staticContent: {
    paddingHorizontal: 20,
    paddingTop: 8,
  },
  footer: {
    paddingHorizontal: 20,
    paddingTop: 12,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#E2E5EA',
    backgroundColor: '#FFFFFF',
  },
});
