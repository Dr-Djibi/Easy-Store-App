import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useAppTheme } from '@/hooks/useAppTheme';
import { SPACING, FONT_SIZE } from '@/constants/theme';

interface EmptyStateProps {
  message?: string;
  icon?: string;
}

export function EmptyState({ message = 'Aucun élément.', icon = '📭' }: EmptyStateProps) {
  const { colors } = useAppTheme();
  return (
    <View style={styles.container}>
      <Text style={styles.icon}>{icon}</Text>
      <Text style={[styles.message, { color: colors.TEXT_MUTED }]}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 50,
  },
  icon: {
    fontSize: 40,
    marginBottom: SPACING.md,
  },
  message: {
    fontSize: FONT_SIZE.sm,
    textAlign: 'center',
    fontWeight: '500',
  },
});
