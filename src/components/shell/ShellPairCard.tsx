// ─── ShellPairCard.tsx ────────────────────────────────────────────
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

type Choice = 'most' | 'least' | null;

interface Props {
  statement: string;
  choice:    Choice;
  onMost:    () => void;
  onLeast:   () => void;
}

export default function ShellPairCard({ statement, choice, onMost, onLeast }: Props) {
  return (
    <View style={styles.card}>
      <Text style={styles.text}>{statement}</Text>
      <View style={styles.btns}>
        <TouchableOpacity
          style={[styles.btn, choice === 'most' && styles.btnMost]}
          onPress={onMost} activeOpacity={0.8}
        >
          <Text style={[styles.btnText, choice === 'most' && styles.btnMostText]}>
            {choice === 'most' ? '✓ Most Like Me' : 'Most Like Me'}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.btn, choice === 'least' && styles.btnLeast]}
          onPress={onLeast} activeOpacity={0.8}
        >
          <Text style={[styles.btnText, choice === 'least' && styles.btnLeastText]}>
            {choice === 'least' ? '✗ Least Like Me' : 'Least Like Me'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card:         { backgroundColor: '#fff', borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 16, padding: 16, marginBottom: 12 },
  text:         { fontSize: 13, fontWeight: '500', color: '#0F172A', lineHeight: 20, marginBottom: 12 },
  btns:         { flexDirection: 'row', gap: 8 },
  btn:          { flex: 1, padding: 10, borderRadius: 10, borderWidth: 1.5, borderColor: '#E2E8F0', backgroundColor: '#F1F5F9', alignItems: 'center' },
  btnText:      { fontSize: 11, fontWeight: '700', color: '#94A3B8', textTransform: 'uppercase', letterSpacing: 0.3 },
  btnMost:      { backgroundColor: 'rgba(29,78,216,0.08)', borderColor: 'rgba(29,78,216,0.2)' },
  btnMostText:  { color: '#1D4ED8' },
  btnLeast:     { backgroundColor: 'rgba(124,58,237,0.08)', borderColor: 'rgba(124,58,237,0.2)' },
  btnLeastText: { color: '#7C3AED' },
});
