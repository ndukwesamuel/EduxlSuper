// ─── ShellModuleRow.tsx ───────────────────────────────────────────
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface Props {
  emoji:   string;
  name:    string;
  meta:    string;
  time:    string;
  timeColor?: string;
  iconBg?: string;
}

export default function ShellModuleRow({ emoji, name, meta, time, timeColor = '#1D4ED8', iconBg = '#EFF6FF' }: Props) {
  return (
    <View style={styles.row}>
      <View style={[styles.icon, { backgroundColor: iconBg }]}>
        <Text style={styles.iconText}>{emoji}</Text>
      </View>
      <View style={styles.info}>
        <Text style={styles.name}>{name}</Text>
        <Text style={styles.meta}>{meta}</Text>
      </View>
      <Text style={[styles.time, { color: timeColor }]}>{time}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row:      { backgroundColor: '#fff', borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 14, padding: 14, flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 10 },
  icon:     { width: 40, height: 40, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  iconText: { fontSize: 18 },
  info:     { flex: 1 },
  name:     { fontSize: 13, fontWeight: '700', color: '#0F172A' },
  meta:     { fontSize: 11, color: '#475569', marginTop: 1 },
  time:     { fontSize: 11, fontWeight: '700', fontVariant: ['tabular-nums'] },
});
