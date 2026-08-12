// ─── ShellHeroCard.tsx ───────────────────────────────────────────
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface Stat { label: string; value: string; }
interface Props {
  emoji:    string;
  title:    string;
  subtitle: string;
  stats:    Stat[];
}

export default function ShellHeroCard({ emoji, title, subtitle, stats }: Props) {
  return (
    <View style={styles.card}>
      <View style={styles.glow1} />
      <View style={styles.glow2} />
      <Text style={styles.emoji}>{emoji}</Text>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.subtitle}>{subtitle}</Text>
      <View style={styles.statsRow}>
        {stats.map((s, i) => (
          <View key={i} style={styles.stat}>
            <Text style={styles.statVal}>{s.value}</Text>
            <Text style={styles.statLbl}>{s.label}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#1D4ED8',
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    overflow: 'hidden',
  },
  glow1: {
    position: 'absolute', top: -30, right: -30,
    width: 120, height: 120, borderRadius: 60,
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
  glow2: {
    position: 'absolute', bottom: -20, right: 40,
    width: 80, height: 80, borderRadius: 40,
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
  emoji:    { fontSize: 32, marginBottom: 12 },
  title:    { fontSize: 20, fontWeight: '800', color: '#fff', lineHeight: 26, marginBottom: 6 },
  subtitle: { fontSize: 12, color: 'rgba(255,255,255,0.72)', lineHeight: 18, marginBottom: 16 },
  statsRow: { flexDirection: 'row', gap: 20 },
  stat:     { gap: 2 },
  statVal:  { fontSize: 20, fontWeight: '700', color: '#fff', fontVariant: ['tabular-nums'] },
  statLbl:  { fontSize: 10, color: 'rgba(255,255,255,0.55)', textTransform: 'uppercase', letterSpacing: 0.5 },
});
