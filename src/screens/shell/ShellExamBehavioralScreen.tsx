// ─── ShellExamBehavioralScreen.tsx ───────────────────────────────
import React, { useState, useEffect, useRef } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AppStackParamList } from '../../navigation/types';
import ShellHUDBar   from '../../components/shell/ShellHUDBar';
import ShellPairCard from '../../components/shell/ShellPairCard';

type Nav = NativeStackNavigationProp<AppStackParamList>;

const PAIRS = [
  { id:1, stmtA:'I analyse complex data to find patterns others miss.',                          stmtB:'I make sure every team member is heard before decisions are made.' },
  { id:2, stmtA:'I push hard to exceed my personal performance targets.',                        stmtB:'I break down technical problems so the whole team understands them.' },
  { id:3, stmtA:'I invest time building relationships across different departments.',             stmtB:'I focus on delivering my individual work at the highest standard.' },
  { id:4, stmtA:'I prefer to deeply understand a problem before proposing any solution.',        stmtB:'I move quickly, test solutions in practice, and refine based on results.' },
  { id:5, stmtA:'I seek out new certifications to stay ahead in my technical field.',            stmtB:'I step up to coordinate others when a project loses direction.' },
  { id:6, stmtA:'I set very high standards and hold others to the same level.',                  stmtB:'I adapt my communication style to match the needs of each stakeholder.' },
  { id:7, stmtA:'I enjoy working through ambiguous problems with limited information.',          stmtB:'I build trust by consistently delivering what I promise, on time.' },
];

const TOTAL_TIME = 15 * 60;

export default function ShellExamBehavioralScreen() {
  const navigation = useNavigation<Nav>();
  const route      = useRoute<any>();
  const cogScore   = route.params?.cogScore ?? 0;

  const [idx, setIdx]         = useState(0);
  const [choices, setChoices] = useState<Record<number, { most: 'A'|'B'|null; least: 'A'|'B'|null }>>(
    Object.fromEntries(PAIRS.map((_, i) => [i, { most: null, least: null }]))
  );
  const [timeLeft, setTimeLeft] = useState(TOTAL_TIME);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const p      = PAIRS[idx];
  const choice = choices[idx];
  const isLast = idx === PAIRS.length - 1;
  const canNext = choice.most !== null && choice.least !== null && choice.most !== choice.least;

  useEffect(() => {
    timerRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) { clearInterval(timerRef.current!); handleFinish(); return 0; }
        return t - 1;
      });
    }, 1000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, []);

  const formatTime = (s: number) =>
    `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;

  const setMost = (val: 'A'|'B') => setChoices((p) => ({
    ...p, [idx]: { most: val, least: p[idx].least === val ? null : p[idx].least },
  }));
  const setLeast = (val: 'A'|'B') => setChoices((p) => ({
    ...p, [idx]: { least: val, most: p[idx].most === val ? null : p[idx].most },
  }));

  const handleNext = () => {
    if (isLast) { handleFinish(); return; }
    setIdx((i) => i + 1);
  };

  const handleFinish = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    const answered = Object.values(choices).filter(c => c.most && c.least).length;
    navigation.navigate('ShellExamVideo' as any, { cogScore, behavScore: answered } as any);
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ShellHUDBar label={`Pair ${idx + 1} / ${PAIRS.length}`} timer={formatTime(timeLeft)} />

      <View style={styles.progWrap}>
        <View style={styles.progTrack}>
          <View style={[styles.progFill, { width: `${((idx + 1) / PAIRS.length) * 100}%` as any, backgroundColor: '#D97706' }]} />
        </View>
        <View style={styles.progRow}>
          <Text style={styles.progLabel}>Working Style Matrix</Text>
          <Text style={[styles.progType, { color: '#D97706' }]}>CAR Scoring Active</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

        <Text style={styles.instruction}>
          Pick exactly <Text style={{ color: '#1D4ED8', fontWeight: '700' }}>one Most</Text> and <Text style={{ color: '#7C3AED', fontWeight: '700' }}>one Least</Text> like you per block.
        </Text>

        {/* Statement A */}
        <View style={styles.stmtCard}>
          <View style={styles.stmtHeader}>
            <View style={styles.labelA}><Text style={styles.labelAText}>A</Text></View>
          </View>
          <Text style={styles.stmtText}>{p.stmtA}</Text>
          <View style={styles.btnRow}>
            <TouchableOpacity style={[styles.btn, choice.most==='A' && styles.btnMost]} onPress={() => setMost('A')} activeOpacity={0.8}>
              <Text style={[styles.btnTxt, choice.most==='A' && styles.btnMostTxt]}>{choice.most==='A' ? '✓ Most Like Me' : 'Most Like Me'}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.btn, choice.least==='A' && styles.btnLeast]} onPress={() => setLeast('A')} activeOpacity={0.8}>
              <Text style={[styles.btnTxt, choice.least==='A' && styles.btnLeastTxt]}>{choice.least==='A' ? '✗ Least Like Me' : 'Least Like Me'}</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Statement B */}
        <View style={styles.stmtCard}>
          <View style={styles.stmtHeader}>
            <View style={[styles.labelA, { backgroundColor: '#EDE9FE' }]}><Text style={[styles.labelAText, { color: '#7C3AED' }]}>B</Text></View>
          </View>
          <Text style={styles.stmtText}>{p.stmtB}</Text>
          <View style={styles.btnRow}>
            <TouchableOpacity style={[styles.btn, choice.most==='B' && styles.btnMost]} onPress={() => setMost('B')} activeOpacity={0.8}>
              <Text style={[styles.btnTxt, choice.most==='B' && styles.btnMostTxt]}>{choice.most==='B' ? '✓ Most Like Me' : 'Most Like Me'}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.btn, choice.least==='B' && styles.btnLeast]} onPress={() => setLeast('B')} activeOpacity={0.8}>
              <Text style={[styles.btnTxt, choice.least==='B' && styles.btnLeastTxt]}>{choice.least==='B' ? '✗ Least Like Me' : 'Least Like Me'}</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.noExplainCard}>
          <Text style={styles.noExplainText}>⏱️ Exam mode — no explanations shown. Stay consistent with your overall profile.</Text>
        </View>

      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.btnPrimary, !canNext && styles.btnDisabled]}
          onPress={handleNext}
          activeOpacity={0.85}
          disabled={!canNext}
        >
          <Text style={styles.btnPrimaryText}>{isLast ? 'Finish & Move to Video →' : 'Next Pair →'}</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe:      { flex: 1, backgroundColor: '#F8FAFC' },
  scroll:    { padding: 20, paddingBottom: 32 },
  progWrap:  { paddingHorizontal: 20, paddingTop: 8, paddingBottom: 8, backgroundColor: '#F8FAFC', borderBottomWidth: 1, borderBottomColor: '#E2E8F0' },
  progTrack: { height: 4, backgroundColor: '#E2E8F0', borderRadius: 999, overflow: 'hidden', marginBottom: 6 },
  progFill:  { height: 4, borderRadius: 999 },
  progRow:   { flexDirection: 'row', justifyContent: 'space-between' },
  progLabel: { fontSize: 10, color: '#94A3B8' },
  progType:  { fontSize: 10, fontWeight: '700' },
  instruction: { fontSize: 13, color: '#475569', lineHeight: 20, marginBottom: 14 },
  stmtCard:  { backgroundColor: '#fff', borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 16, padding: 16, marginBottom: 12 },
  stmtHeader:{ marginBottom: 10 },
  labelA:    { width: 28, height: 28, borderRadius: 8, backgroundColor: '#EFF6FF', alignItems: 'center', justifyContent: 'center' },
  labelAText:{ fontSize: 12, fontWeight: '800', color: '#1D4ED8' },
  stmtText:  { fontSize: 13, fontWeight: '500', color: '#0F172A', lineHeight: 20, marginBottom: 14 },
  btnRow:    { flexDirection: 'row', gap: 8 },
  btn:       { flex: 1, padding: 10, borderRadius: 10, borderWidth: 1.5, borderColor: '#E2E8F0', backgroundColor: '#F1F5F9', alignItems: 'center' },
  btnTxt:    { fontSize: 11, fontWeight: '700', color: '#94A3B8', textTransform: 'uppercase', letterSpacing: 0.3 },
  btnMost:   { backgroundColor: 'rgba(29,78,216,0.08)', borderColor: 'rgba(29,78,216,0.25)' },
  btnMostTxt:{ color: '#1D4ED8' },
  btnLeast:  { backgroundColor: 'rgba(124,58,237,0.08)', borderColor: 'rgba(124,58,237,0.25)' },
  btnLeastTxt:{ color: '#7C3AED' },
  noExplainCard: { backgroundColor: '#F8FAFC', borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 12, padding: 12 },
  noExplainText: { fontSize: 12, color: '#94A3B8', textAlign: 'center' },
  footer:        { padding: 20, paddingBottom: 28, backgroundColor: '#F8FAFC', borderTopWidth: 1, borderTopColor: '#E2E8F0' },
  btnPrimary:    { backgroundColor: '#1D4ED8', borderRadius: 999, paddingVertical: 15, alignItems: 'center', shadowColor: '#1D4ED8', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.28, shadowRadius: 12, elevation: 6 },
  btnDisabled:   { backgroundColor: '#94A3B8', shadowOpacity: 0 },
  btnPrimaryText:{ fontSize: 15, fontWeight: '700', color: '#fff' },
});
