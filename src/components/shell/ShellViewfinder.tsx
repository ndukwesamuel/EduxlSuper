// ─── ShellViewfinder.tsx ─────────────────────────────────────────
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface Props {
  recording?: boolean;
  timer?:     string;   // e.g. "01:42"
  prepTimer?: string;   // e.g. "00:28"
}

export default function ShellViewfinder({ recording = false, timer, prepTimer }: Props) {
  return (
    <View style={styles.finder}>
      <View style={styles.overlay}>
        <Text style={styles.overlayText}>{recording ? '📷 Recording in Progress' : '📷 Front Camera Ready'}</Text>
      </View>
      {recording && timer && (
        <View style={styles.recBadge}>
          <View style={styles.recDot} />
          <Text style={styles.recTimer}>{timer}</Text>
        </View>
      )}
      {!recording && prepTimer && (
        <View style={styles.prepBadge}>
          <Text style={styles.prepText}>PREP: {prepTimer}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  finder: {
    height: 175, marginHorizontal: 20, marginBottom: 16,
    borderRadius: 16, borderWidth: 1, borderColor: '#334155',
    backgroundColor: '#0F172A',
    alignItems: 'center', justifyContent: 'center',
    position: 'relative', overflow: 'hidden',
  },
  overlay:     { backgroundColor: 'rgba(0,0,0,0.5)', paddingHorizontal: 14, paddingVertical: 6, borderRadius: 999 },
  overlayText: { fontSize: 12, fontWeight: '600', color: '#94A3B8' },
  recBadge:    { position: 'absolute', top: 12, right: 12, flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: 'rgba(0,0,0,0.5)', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 999 },
  recDot:      { width: 8, height: 8, borderRadius: 4, backgroundColor: '#DC2626' },
  recTimer:    { fontSize: 12, fontWeight: '700', color: '#fff', fontVariant: ['tabular-nums'] },
  prepBadge:   { position: 'absolute', top: 12, right: 12, backgroundColor: 'rgba(29,78,216,0.7)', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  prepText:    { fontSize: 12, fontWeight: '700', color: '#fff', fontVariant: ['tabular-nums'] },
});
