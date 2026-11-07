import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useAppTheme } from '@/hooks/useAppTheme';
import { RADII, FONT_SIZE, SPACING } from '@/constants/theme';
import type { Order } from '@/types';

type Statut = Order['statut'];

interface StatusBadgeProps {
  statut: Statut;
}

export function StatusBadge({ statut }: StatusBadgeProps) {
  const { colors } = useAppTheme();

  const badgeMap: Record<Statut, { bg: string; text: string }> = {
    nouveau:  { bg: colors.ACCENT_BG,  text: colors.ACCENT },
    confirmé: { bg: colors.INFO_BG,    text: colors.INFO },
    livré:    { bg: colors.SUCCESS_BG, text: colors.SUCCESS },
    annulé:   { bg: colors.DANGER_BG,  text: colors.DANGER },
  };

  const current = badgeMap[statut] ?? badgeMap.nouveau;

  return (
    <View style={[styles.badge, { backgroundColor: current.bg }]}>
      <Text style={[styles.text, { color: current.text }]}>
        {statut.toUpperCase()}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: SPACING.sm + 2,
    paddingVertical: SPACING.xs,
    borderRadius: RADII.sm,
  },
  text: {
    fontSize: FONT_SIZE.xs,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
});
