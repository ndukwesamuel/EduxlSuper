import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator, StyleSheet, ViewStyle } from 'react-native';
import { Colors, Radius, FontSize, Shadows } from '../theme';

interface Props {
  label:     string;
  onPress:   () => void;
  variant?:  'primary' | 'secondary' | 'ghost' | 'danger' | 'gold';
  loading?:  boolean;
  disabled?: boolean;
  style?:    ViewStyle;
  fullWidth?: boolean;
}

export default function CCButton({
  label, onPress, variant = 'primary',
  loading = false, disabled = false, style, fullWidth = false,
}: Props) {
  const isDisabled = disabled || loading;

  const btnStyle = [
    styles.base,
    styles[variant],
    fullWidth && styles.fullWidth,
    isDisabled && styles.disabled,
    style,
  ];

  const textStyle = [
    styles.label,
    variant === 'secondary' ? styles.labelSecondary : styles.labelLight,
    variant === 'ghost'     ? styles.labelGhost      : null,
  ];

  return (
    <TouchableOpacity onPress={onPress} disabled={isDisabled} style={btnStyle} activeOpacity={0.8}>
      {loading
        ? <ActivityIndicator color={variant === 'secondary' ? Colors.brand : '#fff'} size="small" />
        : <Text style={textStyle}>{label}</Text>
      }
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: {
    height: 52, borderRadius: Radius.md, alignItems: 'center',
    justifyContent: 'center', paddingHorizontal: 24,
    ...Shadows.sm,
  },
  fullWidth: { width: '100%' },
  primary:   { backgroundColor: Colors.brand },
  secondary: { backgroundColor: Colors.surface2, borderWidth: 1, borderColor: Colors.border },
  ghost:     { backgroundColor: 'transparent' },
  danger:    { backgroundColor: Colors.danger },
  gold:      { backgroundColor: Colors.gold, ...Shadows.gold },
  disabled:  { opacity: 0.5 },
  label:     { fontSize: FontSize.bodyLarge, fontWeight: '600' },
  labelLight:{ color: '#fff' },
  labelSecondary: { color: Colors.textPrimary },
  labelGhost:{ color: Colors.textSecondary },
});
