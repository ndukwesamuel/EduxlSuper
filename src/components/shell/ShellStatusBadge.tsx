// ─── ShellStatusBadge.tsx ─────────────────────────────────────────
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

type Status = 'locked' | 'active' | 'done';

const CONFIG: Record<Status, { label: string; bg: string; color: string; border: string }> = {
  locked: { label: 'Locked',  bg: '#F1F5F9', color: '#94A3B8', border: '#E2E8F0' },
  active: { label: 'Active',  bg: 'rgba(29,78,216,0.08)', color: '#1D4ED8', border: 'rgba(29,78,216,0.18)' },
  done:   { label: '✓ Done',  bg: '#D1FAE5', color: '#059669', border: '#A7F3D0' },
};

interface Props { status: Status; }

export default function ShellStatusBadge({ status }: Props) {
  const c = CONFIG[status];
  return (
    <View style={[styles.pill, { backgroundColor: c.bg, borderColor: c.border }]}>
      <Text style={[styles.text, { color: c.color }]}>{c.label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  pill: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 999, borderWidth: 1 },
  text: { fontSize: 10, fontWeight: '700', letterSpacing: 0.3 },
});
