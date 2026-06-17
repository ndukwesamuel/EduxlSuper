// ─── ShellProgressBar.tsx ────────────────────────────────────────
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface Props {
  label:   string;
  pct:     number;       // 0–100
  color?:  string;
  showPct?: boolean;
}

export default function ShellProgressBar({ label, pct, color = '#1D4ED8', showPct = true }: Props) {
  return (
    <View style={styles.wrap}>
      <View style={styles.row}>
        <Text style={styles.label}>{label}</Text>
        {showPct && <Text style={[styles.pct, { color }]}>{pct}%</Text>}
      </View>
      <View style={styles.track}>
        <View style={[styles.fill, { width: `${pct}%` as any, backgroundColor: color }]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap:  { marginBottom: 14 },
  row:   { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  label: { fontSize: 13, fontWeight: '700', color: '#0F172A' },
  pct:   { fontSize: 13, fontWeight: '700', fontVariant: ['tabular-nums'] },
  track: { height: 8, backgroundColor: '#E2E8F0', borderRadius: 999, overflow: 'hidden' },
  fill:  { height: 8, borderRadius: 999 },
});
