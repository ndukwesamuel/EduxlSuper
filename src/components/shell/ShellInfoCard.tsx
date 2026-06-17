// ─── ShellInfoCard.tsx ────────────────────────────────────────────
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

type Variant = 'brand' | 'amber' | 'red' | 'green' | 'purple';

const VARIANTS: Record<Variant, { bg: string; border: string; titleColor: string; textColor: string }> = {
  brand:  { bg: 'rgba(29,78,216,0.06)',  border: 'rgba(29,78,216,0.15)',  titleColor: '#1D4ED8', textColor: '#475569' },
  amber:  { bg: 'rgba(180,83,9,0.06)',   border: 'rgba(180,83,9,0.15)',   titleColor: '#B45309', textColor: '#475569' },
  red:    { bg: 'rgba(220,38,38,0.05)',  border: 'rgba(220,38,38,0.15)',  titleColor: '#DC2626', textColor: '#475569' },
  green:  { bg: '#D1FAE5',              border: '#A7F3D0',               titleColor: '#059669', textColor: '#065F46' },
  purple: { bg: 'rgba(124,58,237,0.05)',border: 'rgba(124,58,237,0.15)', titleColor: '#7C3AED', textColor: '#475569' },
};

interface Props {
  title:    string;
  text:     string;
  variant?: Variant;
  style?:   any;
}

export default function ShellInfoCard({ title, text, variant = 'brand', style }: Props) {
  const v = VARIANTS[variant];
  return (
    <View style={[styles.card, { backgroundColor: v.bg, borderColor: v.border }, style]}>
      <Text style={[styles.title, { color: v.titleColor }]}>{title}</Text>
      <Text style={[styles.text,  { color: v.textColor  }]}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card:  { borderRadius: 14, padding: 14, borderWidth: 1 },
  title: { fontSize: 11, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 5 },
  text:  { fontSize: 12, lineHeight: 18 },
});
