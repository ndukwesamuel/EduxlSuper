// ─── ShellStageCard.tsx ───────────────────────────────────────────
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import ShellStatusBadge from './ShellStatusBadge';

type Status = 'locked' | 'active' | 'done';

interface Props {
  emoji:   string;
  name:    string;
  meta:    string;
  status:  Status;
  iconBg:  string;
  onPress?: () => void;
}

export default function ShellStageCard({ emoji, name, meta, status, iconBg, onPress }: Props) {
  return (
    <TouchableOpacity
      style={[styles.card, status === 'active' && styles.cardActive]}
      onPress={onPress}
      activeOpacity={0.8}
      disabled={status === 'locked'}
    >
      <View style={[styles.iconBox, { backgroundColor: iconBg }]}>
        <Text style={styles.icon}>{emoji}</Text>
      </View>
      <View style={styles.info}>
        <Text style={styles.name}>{name}</Text>
        <Text style={styles.meta}>{meta}</Text>
      </View>
      <ShellStatusBadge status={status} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff', borderWidth: 1, borderColor: '#E2E8F0',
    borderRadius: 16, padding: 14,
    flexDirection: 'row', alignItems: 'center', gap: 14,
    marginBottom: 10,
  },
  cardActive: { borderColor: 'rgba(29,78,216,0.2)' },
  iconBox: { width: 44, height: 44, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  icon:    { fontSize: 20 },
  info:    { flex: 1 },
  name:    { fontSize: 14, fontWeight: '700', color: '#0F172A', marginBottom: 2 },
  meta:    { fontSize: 11, color: '#475569' },
});
