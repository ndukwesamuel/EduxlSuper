import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors, FontSize, Radius } from '../theme';

interface Props { streak: number; }

export default function StreakBadge({ streak }: Props) {
  const isActive = streak > 0;
  const icon     = streak >= 3 ? '🔥' : '📅';

  return (
    <View style={[styles.container, isActive && styles.active]}>
      <Text style={styles.icon}>{icon}</Text>
      <View>
        <Text style={[styles.count, isActive && styles.countActive]}>{streak} day streak</Text>
        <Text style={styles.sub}>{streak === 0 ? 'Practice today!' : 'Keep going!'}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    padding: 12, borderRadius: Radius.md,
    backgroundColor: Colors.surface2,
  },
  active:     { backgroundColor: '#FFF7ED' },
  icon:       { fontSize: 28 },
  count:      { fontSize: FontSize.bodyLarge, fontWeight: '700', color: Colors.textSecondary },
  countActive:{ color: Colors.warning },
  sub:        { fontSize: FontSize.caption, color: Colors.textMuted, marginTop: 2 },
});
