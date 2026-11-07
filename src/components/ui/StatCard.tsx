import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { COLORS, SPACING, RADII, FONT_SIZE } from '@/constants/theme';

interface StatCardProps {
  icon: React.ReactNode;
  value: string | number;
  label: string;
  style?: ViewStyle;
}

export function StatCard({ icon, value, label, style }: StatCardProps) {
  return (
    <View style={[styles.card, style]}>
      {icon}
      <Text style={styles.value}>{value}</Text>
      <Text style={styles.label}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: COLORS.BG_CARD,
    borderWidth: 1,
    borderColor: COLORS.BORDER,
    borderRadius: RADII.xxxl,
    padding: SPACING.lg,
    justifyContent: 'center',
  },
  value: {
    fontSize: FONT_SIZE.xxl,
    fontWeight: '900',
    color: COLORS.TEXT_PRIMARY,
    marginTop: SPACING.sm + 2,
    marginBottom: SPACING.xs,
  },
  label: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.TEXT_MUTED,
  },
});
