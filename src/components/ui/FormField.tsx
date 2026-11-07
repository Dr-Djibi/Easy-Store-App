import React from 'react';
import { View, Text, TextInput, StyleSheet, TextInputProps } from 'react-native';
import { useAppTheme } from '@/hooks/useAppTheme';
import { SPACING, RADII, FONT_SIZE } from '@/constants/theme';

interface FormFieldProps extends TextInputProps {
  label: string;
}

export function FormField({ label, style, ...inputProps }: FormFieldProps) {
  const { colors } = useAppTheme();
  return (
    <View style={styles.container}>
      <Text style={[styles.label, { color: colors.TEXT_PRIMARY }]}>{label}</Text>
      <TextInput
        style={[
          styles.input,
          {
            backgroundColor: colors.BG_INPUT,
            borderColor: colors.BORDER,
            color: colors.TEXT_PRIMARY,
          },
          style,
        ]}
        placeholderTextColor={colors.TEXT_FAINT}
        {...inputProps}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 14,
  },
  label: {
    fontSize: FONT_SIZE.sm,
    fontWeight: '700',
    marginBottom: SPACING.xs + 2,
  },
  input: {
    borderWidth: 1,
    borderRadius: RADII.xl,
    paddingHorizontal: 14,
    paddingVertical: SPACING.md,
    fontSize: FONT_SIZE.base,
  },
});
