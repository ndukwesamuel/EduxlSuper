// ─── ShellHUDBar.tsx ─────────────────────────────────────────────
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

interface Props {
  label:      string;   // e.g. "Question 3 / 16"
  timer?:     string;   // e.g. "11:24" — shown red when present
  modePill?:  string;   // e.g. "📚 Practice"
  showTools?: boolean;  // show calculator + scratchpad icons
}

export default function ShellHUDBar({ label, timer, modePill, showTools = false }: Props) {
  return (
    <View style={styles.bar}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.right}>
        {modePill && (
          <View style={styles.modePill}>
            <Text style={styles.modePillText}>{modePill}</Text>
          </View>
        )}
        {timer && (
          <View style={styles.timer}>
            <Text style={styles.timerText}>⏱ {timer}</Text>
          </View>
        )}
        {showTools && (
          <>
            <View style={styles.tool}><Text style={styles.toolIcon}>🧮</Text></View>
            <View style={styles.tool}><Text style={styles.toolIcon}>📝</Text></View>
          </>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  bar:          { backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#E2E8F0', padding: 10, paddingHorizontal: 20, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  label:        { fontSize: 11, fontWeight: '700', color: '#94A3B8', textTransform: 'uppercase', letterSpacing: 0.5 },
  right:        { flexDirection: 'row', alignItems: 'center', gap: 8 },
  modePill:     { backgroundColor: '#F1F5F9', borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 8, paddingHorizontal: 10, paddingVertical: 4 },
  modePillText: { fontSize: 11, fontWeight: '700', color: '#94A3B8' },
  timer:        { backgroundColor: '#FFF7ED', borderWidth: 1, borderColor: '#FED7AA', borderRadius: 8, paddingHorizontal: 10, paddingVertical: 4 },
  timerText:    { fontSize: 13, fontWeight: '700', color: '#EA580C', fontVariant: ['tabular-nums'] },
  tool:         { width: 30, height: 30, backgroundColor: '#F1F5F9', borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  toolIcon:     { fontSize: 13 },
});
