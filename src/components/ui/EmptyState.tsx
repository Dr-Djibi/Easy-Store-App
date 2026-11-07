import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS, SPACING, FONT_SIZE } from '@/constants/theme';

interface EmptyStateProps {
  message?: string;
  icon?: string;
}

export function EmptyState({ message = 'Aucun élément.', icon = '📭' }: EmptyStateProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.icon}>{icon}</Text>
      <Text style={styles.message}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  icon: {
    fontSize: 40,
    marginBottom: SPACING.md,
  },
  message: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.TEXT_MUTED,
    textAlign: 'center',
  },
});
