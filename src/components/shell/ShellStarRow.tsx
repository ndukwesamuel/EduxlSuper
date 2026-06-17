// ─── ShellStarRow.tsx ────────────────────────────────────────────
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface Props {
  token:   string;   // S, T, A, R
  label:   string;
  desc:    string;
  active?: boolean;
}

export default function ShellStarRow({ token, label, desc, active = false }: Props) {
  return (
    <View style={[styles.row, active && styles.rowActive]}>
      <View style={[styles.token, active && styles.tokenActive]}>
        <Text style={[styles.tokenText, active && styles.tokenTextActive]}>{token}</Text>
      </View>
      <View style={{ flex: 1 }}>
        <Text style={styles.label}>{label}</Text>
        <Text style={styles.desc}>{desc}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row:           { backgroundColor: '#fff', borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 12, padding: 12, flexDirection: 'row', alignItems: 'flex-start', gap: 12, marginBottom: 8 },
  rowActive:     { borderColor: 'rgba(29,78,216,0.2)', backgroundColor: 'rgba(29,78,216,0.06)' },
  token:         { width: 24, height: 24, borderRadius: 6, backgroundColor: '#F1F5F9', borderWidth: 1, borderColor: '#E2E8F0', alignItems: 'center', justifyContent: 'center' },
  tokenActive:   { backgroundColor: '#1D4ED8', borderColor: '#1D4ED8' },
  tokenText:     { fontSize: 11, fontWeight: '700', color: '#94A3B8' },
  tokenTextActive:{ color: '#fff' },
  label:         { fontSize: 12, fontWeight: '700', color: '#0F172A', marginBottom: 2 },
  desc:          { fontSize: 11, color: '#475569', lineHeight: 16 },
});
