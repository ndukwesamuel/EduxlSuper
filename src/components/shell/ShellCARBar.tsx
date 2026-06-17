// ─── ShellCARBar.tsx ─────────────────────────────────────────────
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const CAR_COLORS = ['#059669', '#D97706', '#DC2626'];

interface CARScore { label: string; pct: number; }
interface Props    { scores: CARScore[]; }

export default function ShellCARBar({ scores }: Props) {
  return (
    <View style={styles.card}>
      {scores.map((s, i) => (
        <View key={i} style={[styles.row, i < scores.length - 1 && styles.rowBorder]}>
          <View style={styles.info}>
            <Text style={styles.label}>{s.label}</Text>
            <Text style={[styles.pct, { color: CAR_COLORS[i] }]}>{s.pct}%</Text>
          </View>
          <View style={styles.track}>
            <View style={[styles.fill, { width: `${s.pct}%` as any, backgroundColor: CAR_COLORS[i] }]} />
          </View>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  card:      { backgroundColor: '#fff', borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 16, padding: 16, marginBottom: 20 },
  row:       { paddingBottom: 14, marginBottom: 14 },
  rowBorder: { borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
  info:      { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  label:     { fontSize: 13, fontWeight: '700', color: '#0F172A' },
  pct:       { fontSize: 13, fontWeight: '700', fontVariant: ['tabular-nums'] },
  track:     { height: 8, backgroundColor: '#E2E8F0', borderRadius: 999, overflow: 'hidden' },
  fill:      { height: 8, borderRadius: 999 },
});
