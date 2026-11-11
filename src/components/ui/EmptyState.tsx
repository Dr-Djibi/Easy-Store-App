import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { PackageOpen } from 'lucide-react-native';
import { useAppTheme } from '@/hooks/useAppTheme';
import { SPACING, FONT_SIZE } from '@/constants/theme';

interface EmptyStateProps {
  message?: string;
  icon?: React.ReactNode;
}

export function EmptyState({ message = 'Aucun élément répertorié.', icon }: EmptyStateProps) {
  const { colors } = useAppTheme();
  return (
    <View style={styles.container}>
      <View style={styles.iconWrap}>
        {icon ? icon : <PackageOpen size={36} color={colors.TEXT_MUTED} strokeWidth={1.5} />}
      </View>
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
  iconWrap: {
    marginBottom: SPACING.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  message: {
    fontSize: FONT_SIZE.sm,
    textAlign: 'center',
    fontWeight: '500',
    maxWidth: 280,
    lineHeight: 20,
  },
});
