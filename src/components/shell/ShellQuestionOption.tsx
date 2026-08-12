// ─── ShellQuestionOption.tsx ─────────────────────────────────────
import React from 'react';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';

type State = 'default' | 'selected' | 'correct' | 'wrong';

const COLORS: Record<State, { border: string; bg: string; radio: string; text: string }> = {
  default:  { border: '#E2E8F0', bg: '#fff',                    radio: '#CBD5E1', text: '#0F172A' },
  selected: { border: '#1D4ED8', bg: 'rgba(29,78,216,0.08)',   radio: '#1D4ED8', text: '#1D4ED8' },
  correct:  { border: '#059669', bg: '#D1FAE5',                radio: '#059669', text: '#059669' },
  wrong:    { border: '#DC2626', bg: '#FEF2F2',                radio: '#DC2626', text: '#DC2626' },
};

interface Props {
  label:    string;
  state?:   State;
  onPress?: () => void;
}

export default function ShellQuestionOption({ label, state = 'default', onPress }: Props) {
  const c = COLORS[state];
  return (
    <TouchableOpacity
      style={[styles.opt, { borderColor: c.border, backgroundColor: c.bg }]}
      onPress={onPress}
      activeOpacity={0.75}
      disabled={state === 'correct' || state === 'wrong'}
    >
      <View style={[styles.radio, { borderColor: c.radio, backgroundColor: state !== 'default' ? c.radio : 'transparent' }]}>
        {state !== 'default' && <View style={styles.rdot} />}
      </View>
      <Text style={[styles.text, { color: c.text, fontWeight: state !== 'default' ? '700' : '500' }]}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  opt:   { borderWidth: 1, borderRadius: 14, padding: 14, flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 10 },
  radio: { width: 18, height: 18, borderRadius: 9, borderWidth: 2, alignItems: 'center', justifyContent: 'center' },
  rdot:  { width: 8, height: 8, borderRadius: 4, backgroundColor: '#fff' },
  text:  { fontSize: 13, flex: 1, lineHeight: 20 },
});
