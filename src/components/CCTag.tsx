import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors, Radius, FontSize } from '../theme';

type TagVariant = 'easy' | 'medium' | 'hard' | 'blue' | 'purple' | 'orange' | 'green';

interface Props { label: string; variant?: TagVariant; }

const TAG_STYLES: Record<TagVariant, { bg: string; color: string }> = {
  easy:   { bg: '#D1FAE5', color: '#065F46' },
  medium: { bg: '#FEF3C7', color: '#92400E' },
  hard:   { bg: '#FEE2E2', color: '#991B1B' },
  blue:   { bg: '#DBEAFE', color: '#1E40AF' },
  purple: { bg: '#EDE9FE', color: '#5B21B6' },
  orange: { bg: '#FFEDD5', color: '#9A3412' },
  green:  { bg: '#D1FAE5', color: '#065F46' },
};

export default function CCTag({ label, variant = 'blue' }: Props) {
  const { bg, color } = TAG_STYLES[variant];
  return (
    <View style={[styles.tag, { backgroundColor: bg }]}>
      <Text style={[styles.text, { color }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  tag: {
    paddingHorizontal: 10, paddingVertical: 4,
    borderRadius: Radius.full, alignSelf: 'flex-start',
  },
  text: { fontSize: FontSize.caption, fontWeight: '600' },
});
