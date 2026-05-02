import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors, FontSize, Radius } from '../theme';

const XP_PER_LEVEL = 500;

interface Props { xp: number; }

export default function XPBar({ xp }: Props) {
  const level     = Math.floor(xp / XP_PER_LEVEL) + 1;
  const xpInLevel = xp % XP_PER_LEVEL;
  const pct       = (xpInLevel / XP_PER_LEVEL) * 100;

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <Text style={styles.level}>⭐ Level {level}</Text>
        <Text style={styles.xpText}>{xpInLevel} / {XP_PER_LEVEL} XP</Text>
      </View>
      <View style={styles.track}>
        <View style={[styles.fill, { width: `${pct}%` }]} />
      </View>
      <Text style={styles.total}>{xp} total XP</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: 4 },
  row:       { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  level:     { fontSize: FontSize.caption, fontWeight: '600', color: Colors.gold },
  xpText:    { fontSize: FontSize.caption, color: Colors.textMuted },
  track:     { height: 8, backgroundColor: Colors.surface2, borderRadius: Radius.full, overflow: 'hidden' },
  fill:      { height: '100%', backgroundColor: Colors.gold, borderRadius: Radius.full },
  total:     { fontSize: FontSize.micro, color: Colors.textMuted },
});
