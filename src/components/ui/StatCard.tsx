import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { useAppTheme } from '@/hooks/useAppTheme';
import { SPACING, RADII, FONT_SIZE } from '@/constants/theme';

interface StatCardProps {
  icon: React.ReactNode;
  value: string | number;
  label: string;
  style?: ViewStyle;
}

export function StatCard({ icon, value, label, style }: StatCardProps) {
  const { colors, isDark } = useAppTheme();
  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: colors.BG_CARD,
          borderColor: colors.BORDER,
          shadowColor: colors.TEXT_PRIMARY,
          shadowOpacity: isDark ? 0 : 0.05,
          elevation: isDark ? 0 : 2,
        },
        style,
      ]}
    >
      <View style={styles.iconContainer}>{icon}</View>
      <Text style={[styles.value, { color: colors.TEXT_PRIMARY }]}>{value}</Text>
      <Text style={[styles.label, { color: colors.TEXT_MUTED }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    minWidth: '45%',
    borderWidth: 1,
    borderRadius: RADII.xxl,
    padding: SPACING.lg,
    justifyContent: 'center',
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
  },
  iconContainer: {
    marginBottom: SPACING.xs,
  },
  value: {
    fontSize: FONT_SIZE.xxl,
    fontWeight: '900',
    marginTop: SPACING.xs,
    marginBottom: SPACING.xs,
    letterSpacing: -0.5,
  },
  label: {
    fontSize: FONT_SIZE.xs,
    fontWeight: '600',
  },
});
