// ─── ShellExplainBox.tsx ─────────────────────────────────────────
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface Props { title: string; text: string; style?: any; }

export default function ShellExplainBox({ title, text, style }: Props) {
  return (
    <View style={[styles.box, style]}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.text}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  box:   { backgroundColor: '#FFFBEB', borderWidth: 1, borderColor: '#FDE68A', borderRadius: 12, padding: 12, marginTop: 10 },
  title: { fontSize: 11, fontWeight: '700', color: '#92400E', marginBottom: 5 },
  text:  { fontSize: 12, color: '#78350F', lineHeight: 18 },
});
