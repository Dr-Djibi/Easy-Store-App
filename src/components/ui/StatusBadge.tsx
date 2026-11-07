import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS, RADII, FONT_SIZE, SPACING } from '@/constants/theme';
import type { Order } from '@/types';

type Statut = Order['statut'];

const BADGE_COLORS: Record<Statut, { bg: string; text: string }> = {
  nouveau:  { bg: COLORS.ACCENT_BG,   text: COLORS.ACCENT },
  confirmé: { bg: COLORS.INFO_BG,     text: COLORS.INFO },
  livré:    { bg: COLORS.SUCCESS_BG,  text: COLORS.SUCCESS },
  annulé:   { bg: COLORS.DANGER_BG,   text: COLORS.DANGER },
};

interface StatusBadgeProps {
  statut: Statut;
}

export function StatusBadge({ statut }: StatusBadgeProps) {
  const colors = BADGE_COLORS[statut] ?? BADGE_COLORS.nouveau;
  return (
    <View style={[styles.badge, { backgroundColor: colors.bg }]}>
      <Text style={[styles.text, { color: colors.text }]}>
        {statut.toUpperCase()}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: RADII.sm,
  },
  text: {
    fontSize: FONT_SIZE.xs,
    fontWeight: 'bold',
  },
});
