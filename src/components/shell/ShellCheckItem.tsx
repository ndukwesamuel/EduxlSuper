// ─── ShellCheckItem.tsx ───────────────────────────────────────────
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface Props { title: string; desc: string; done?: boolean; }

export default function ShellCheckItem({ title, desc, done = false }: Props) {
  return (
    <View style={styles.item}>
      <View style={[styles.box, done && styles.boxDone]}>
        {done && <Text style={styles.tick}>✓</Text>}
      </View>
      <View style={{ flex: 1 }}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.desc}>{desc}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  item:    { backgroundColor: '#fff', borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 14, padding: 14, flexDirection: 'row', gap: 12, marginBottom: 10 },
  box:     { width: 18, height: 18, borderRadius: 5, borderWidth: 1, borderColor: '#CBD5E1', backgroundColor: '#F1F5F9', marginTop: 1, alignItems: 'center', justifyContent: 'center' },
  boxDone: { backgroundColor: '#D1FAE5', borderColor: '#A7F3D0' },
  tick:    { fontSize: 10, color: '#059669', fontWeight: '700' },
  title:   { fontSize: 13, fontWeight: '600', color: '#0F172A', marginBottom: 3 },
  desc:    { fontSize: 11, color: '#475569', lineHeight: 16 },
});
