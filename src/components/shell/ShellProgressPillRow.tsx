// ─── ShellProgressPillRow.tsx ─────────────────────────────────────
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface Pill { label: string; pct: number; color: string; }
interface Props { pills: Pill[]; }

export default function ShellProgressPillRow({ pills }: Props) {
  return (
    <View style={styles.row}>
      {pills.map((p, i) => (
        <View key={i} style={styles.pill}>
          <Text style={styles.label}>{p.label}</Text>
          <View style={styles.track}>
            <View style={[styles.fill, { width: `${p.pct}%` as any, backgroundColor: p.color }]} />
          </View>
          <Text style={[styles.val, { color: p.color }]}>{p.pct}%</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row:   { flexDirection: 'row', gap: 8, marginBottom: 20 },
  pill:  { flex: 1, backgroundColor: '#fff', borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 12, padding: 10, gap: 6 },
  label: { fontSize: 10, fontWeight: '700', color: '#94A3B8', textTransform: 'uppercase', letterSpacing: 0.3 },
  track: { height: 4, backgroundColor: '#E2E8F0', borderRadius: 999, overflow: 'hidden' },
  fill:  { height: 4, borderRadius: 999 },
  val:   { fontSize: 12, fontWeight: '700' },
});
