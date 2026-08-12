// ─── ShellPracticeBehavioralScreen.tsx ───────────────────────────
import React, { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AppStackParamList } from '../../navigation/types';
import ShellHUDBar     from '../../components/shell/ShellHUDBar';
import ShellPairCard   from '../../components/shell/ShellPairCard';
import ShellExplainBox from '../../components/shell/ShellExplainBox';
import ShellInfoCard   from '../../components/shell/ShellInfoCard';

type Nav   = NativeStackNavigationProp<AppStackParamList>;
type Choice = 'most' | 'least' | null;

// ── Dummy pairs ────────────────────────────────────────────────────
const PAIRS = [
  {
    id: 1,
    pillar: 'C vs R',
    stmtA: 'I look for patterns and systemic trends within highly fragmented energy production datasets to uncover operational inefficiencies.',
    stmtB: 'I naturally step up to coordinate others when a team project loses its direction or falls behind schedule.',
    tipsA: 'Capacity (C) — analytical thinking, data-driven problem solving',
    tipsB: 'Relationships (R) — coordination, team leadership',
    explanation: 'This pair pits Capacity against Relationships. Neither is wrong — Shell needs both. But if you choose A as Most every time, your Relationships score drops. Balance your choices across sessions.',
  },
  {
    id: 2,
    pillar: 'A vs C',
    stmtA: 'I set very high personal standards for my work and push hard to exceed targets even when no one is watching.',
    stmtB: 'I enjoy breaking down complex technical problems into simple frameworks that others on the team can quickly understand.',
    tipsA: 'Achievement (A) — drive, self-motivation, results orientation',
    tipsB: 'Capacity (C) — analytical clarity, knowledge transfer',
    explanation: 'Achievement vs Capacity. Both are Shell values. Picking A (Most) signals strong personal drive. Picking B (Most) signals intellectual generosity. Shell wants to see both across your full profile.',
  },
  {
    id: 3,
    pillar: 'R vs A',
    stmtA: 'I make sure every team member feels heard and valued before we move forward with a major project decision.',
    stmtB: 'I focus intensely on delivering my individual tasks at the highest quality before worrying about others\' work.',
    tipsA: 'Relationships (R) — inclusion, psychological safety, collaboration',
    tipsB: 'Achievement (A) — personal excellence, individual accountability',
    explanation: 'Relationships vs Achievement. This is Shell\'s most common contradiction trap. If you pick B (Most) here but claimed strong teamwork in pair 1, the system flags inconsistency. Be consistent with your overall profile story.',
  },
  {
    id: 4,
    pillar: 'C vs A',
    stmtA: 'When facing a new technical challenge, I dedicate time to deeply understanding the root cause before proposing any solution.',
    stmtB: 'I prefer to move quickly, test solutions in practice, and refine my approach based on real-world results rather than extended analysis.',
    tipsA: 'Capacity (C) — analytical depth, first-principles thinking',
    tipsB: 'Achievement (A) — bias for action, execution speed, agility',
    explanation: 'This is the classic "think vs act" pair. Shell values both but wants to see where you naturally lean. In oil & gas operations, both matter — analysis prevents costly mistakes, but speed matters in field decisions.',
  },
  {
    id: 5,
    pillar: 'R vs C',
    stmtA: 'I invest significant time in building strong working relationships with colleagues across different departments and functions.',
    stmtB: 'I continuously seek out new technical knowledge and certifications to stay ahead in my area of expertise.',
    tipsA: 'Relationships (R) — cross-functional collaboration, stakeholder management',
    tipsB: 'Capacity (C) — continuous learning, technical mastery',
    explanation: 'Relationships vs Capacity again but framed differently. If your previous answers were very Capacity-heavy, choosing A (Most) here helps balance your CAR profile and avoids the "brilliant loner" flag.',
  },
];

// ── CAR score tracker ──────────────────────────────────────────────
function calcCAR(choices: Record<number, { most: 'A' | 'B' | null; least: 'A' | 'B' | null }>, pairs: typeof PAIRS) {
  let C = 0, A = 0, R = 0, total = 0;
  pairs.forEach((p, i) => {
    const choice = choices[i];
    if (!choice?.most) return;
    total++;
    const [first, second] = p.pillar.split(' vs ');
    const mostPillar  = choice.most  === 'A' ? first  : second;
    const leastPillar = choice.least === 'A' ? first  : second;
    if (mostPillar  === 'C') C += 2;
    if (mostPillar  === 'A') A += 2;
    if (mostPillar  === 'R') R += 2;
    if (leastPillar === 'C') C -= 1;
    if (leastPillar === 'A') A -= 1;
    if (leastPillar === 'R') R -= 1;
  });
  const max = total * 2 || 1;
  return {
    C: Math.max(0, Math.round((C / max) * 100)),
    A: Math.max(0, Math.round((A / max) * 100)),
    R: Math.max(0, Math.round((R / max) * 100)),
  };
}

export default function ShellPracticeBehavioralScreen() {
  const navigation = useNavigation<Nav>();
  const [idx, setIdx]     = useState(0);
  const [revealed, setReveal] = useState(false);

  // choices[pairIndex] = { most: 'A'|'B'|null, least: 'A'|'B'|null }
  const [choices, setChoices] = useState<Record<number, { most: 'A' | 'B' | null; least: 'A' | 'B' | null }>>(
    Object.fromEntries(PAIRS.map((_, i) => [i, { most: null, least: null }]))
  );

  const p      = PAIRS[idx];
  const choice = choices[idx];
  const isLast = idx === PAIRS.length - 1;
  const car    = calcCAR(choices, PAIRS);

  const setMost = (val: 'A' | 'B') => {
    if (revealed) return;
    setChoices((prev) => ({
      ...prev,
      [idx]: {
        most:  val,
        least: prev[idx].least === val ? null : prev[idx].least,
      },
    }));
  };

  const setLeast = (val: 'A' | 'B') => {
    if (revealed) return;
    setChoices((prev) => ({
      ...prev,
      [idx]: {
        least: val,
        most:  prev[idx].most === val ? null : prev[idx].most,
      },
    }));
  };

  const canReveal = choice.most !== null && choice.least !== null && choice.most !== choice.least;

  const handleReveal = () => { if (canReveal) setReveal(true); };

  const handleNext = () => {
    if (isLast) { navigation.goBack(); return; }
    setIdx((i) => i + 1);
    setReveal(false);
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ShellHUDBar label={`Pair ${idx + 1} / ${PAIRS.length}`} modePill="📚 Practice" />

      {/* Progress bar */}
      <View style={styles.progWrap}>
        <View style={styles.progTrack}>
          <View style={[styles.progFill, { width: `${((idx + 1) / PAIRS.length) * 100}%` as any }]} />
        </View>
        <View style={styles.progRow}>
          <Text style={styles.progLabel}>Behavioral — CAR Framework</Text>
          <Text style={styles.progType}>{p.pillar}</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

        {/* Live CAR profile */}
        <View style={styles.carCard}>
          <Text style={styles.carTitle}>Your CAR Profile So Far</Text>
          <View style={styles.carBars}>
            {[
              { key: 'C', label: 'Capacity',      val: car.C, color: '#1D4ED8' },
              { key: 'A', label: 'Achievement',   val: car.A, color: '#D97706' },
              { key: 'R', label: 'Relationships', val: car.R, color: '#7C3AED' },
            ].map((b) => (
              <View key={b.key} style={styles.carRow}>
                <View style={styles.carLabelRow}>
                  <Text style={styles.carLabel}>{b.label}</Text>
                  <Text style={[styles.carPct, { color: b.color }]}>{b.val}%</Text>
                </View>
                <View style={styles.carTrack}>
                  <View style={[styles.carFill, { width: `${b.val}%` as any, backgroundColor: b.color }]} />
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Instruction */}
        <Text style={styles.instruction}>
          Pick exactly <Text style={{ color: '#1D4ED8', fontWeight: '700' }}>one Most</Text> and exactly <Text style={{ color: '#7C3AED', fontWeight: '700' }}>one Least</Text> like you.
        </Text>

        {/* Statement A */}
        <View style={styles.stmtCard}>
          <View style={styles.stmtHeader}>
            <View style={styles.stmtLabel}><Text style={styles.stmtLabelText}>A</Text></View>
            {!revealed && <Text style={styles.pillarHint}>{p.tipsA}</Text>}
          </View>
          <Text style={styles.stmtText}>{p.stmtA}</Text>
          <View style={styles.btnRow}>
            <TouchableOpacity
              style={[styles.choiceBtn, choice.most  === 'A' && styles.mostBtn]}
              onPress={() => setMost('A')} activeOpacity={0.8}
            >
              <Text style={[styles.choiceBtnText, choice.most  === 'A' && styles.mostBtnText]}>
                {choice.most === 'A' ? '✓ Most Like Me' : 'Most Like Me'}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.choiceBtn, choice.least === 'A' && styles.leastBtn]}
              onPress={() => setLeast('A')} activeOpacity={0.8}
            >
              <Text style={[styles.choiceBtnText, choice.least === 'A' && styles.leastBtnText]}>
                {choice.least === 'A' ? '✗ Least Like Me' : 'Least Like Me'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Statement B */}
        <View style={styles.stmtCard}>
          <View style={styles.stmtHeader}>
            <View style={[styles.stmtLabel, { backgroundColor: '#EDE9FE' }]}>
              <Text style={[styles.stmtLabelText, { color: '#7C3AED' }]}>B</Text>
            </View>
            {!revealed && <Text style={styles.pillarHint}>{p.tipsB}</Text>}
          </View>
          <Text style={styles.stmtText}>{p.stmtB}</Text>
          <View style={styles.btnRow}>
            <TouchableOpacity
              style={[styles.choiceBtn, choice.most  === 'B' && styles.mostBtn]}
              onPress={() => setMost('B')} activeOpacity={0.8}
            >
              <Text style={[styles.choiceBtnText, choice.most  === 'B' && styles.mostBtnText]}>
                {choice.most === 'B' ? '✓ Most Like Me' : 'Most Like Me'}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.choiceBtn, choice.least === 'B' && styles.leastBtn]}
              onPress={() => setLeast('B')} activeOpacity={0.8}
            >
              <Text style={[styles.choiceBtnText, choice.least === 'B' && styles.leastBtnText]}>
                {choice.least === 'B' ? '✗ Least Like Me' : 'Least Like Me'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Explanation after reveal */}
        {revealed && (
          <ShellExplainBox
            title="💡 What this pair measures"
            text={p.explanation}
          />
        )}

        {/* Consistency warning */}
        {revealed && car.R < 30 && (
          <ShellInfoCard
            title="⚠️ Relationships Score Low"
            text="Your choices are skewing heavily toward Capacity and Achievement. Shell flags candidates who show no collaborative traits. Try choosing Relationship-oriented statements as Most in upcoming pairs."
            variant="amber"
            style={{ marginTop: 10 }}
          />
        )}

      </ScrollView>

      <View style={styles.footer}>
        {!revealed ? (
          <TouchableOpacity
            style={[styles.btnPrimary, !canReveal && styles.btnDisabled]}
            onPress={handleReveal}
            activeOpacity={0.85}
            disabled={!canReveal}
          >
            <Text style={styles.btnText}>
              {!canReveal ? 'Select Most and Least first' : 'See What This Measures'}
            </Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.btnPrimary} onPress={handleNext} activeOpacity={0.85}>
            <Text style={styles.btnText}>{isLast ? 'Finish Session ✓' : 'Next Pair →'}</Text>
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe:     { flex: 1, backgroundColor: '#F8FAFC' },
  scroll:   { padding: 20, paddingBottom: 32 },
  progWrap: { paddingHorizontal: 20, paddingTop: 10, paddingBottom: 4, backgroundColor: '#F8FAFC' },
  progTrack:{ height: 4, backgroundColor: '#E2E8F0', borderRadius: 999, overflow: 'hidden', marginBottom: 6 },
  progFill: { height: 4, backgroundColor: '#1D4ED8', borderRadius: 999 },
  progRow:  { flexDirection: 'row', justifyContent: 'space-between' },
  progLabel:{ fontSize: 10, color: '#94A3B8' },
  progType: { fontSize: 10, color: '#1D4ED8', fontWeight: '700' },

  // Live CAR card
  carCard:    { backgroundColor: '#fff', borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 16, padding: 14, marginBottom: 16 },
  carTitle:   { fontSize: 11, fontWeight: '700', color: '#94A3B8', textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 12 },
  carBars:    { gap: 10 },
  carRow:     { gap: 5 },
  carLabelRow:{ flexDirection: 'row', justifyContent: 'space-between' },
  carLabel:   { fontSize: 12, fontWeight: '600', color: '#0F172A' },
  carPct:     { fontSize: 12, fontWeight: '700' },
  carTrack:   { height: 6, backgroundColor: '#E2E8F0', borderRadius: 999, overflow: 'hidden' },
  carFill:    { height: 6, borderRadius: 999 },

  instruction: { fontSize: 13, color: '#475569', lineHeight: 20, marginBottom: 14 },

  // Statement cards
  stmtCard:   { backgroundColor: '#fff', borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 16, padding: 16, marginBottom: 12 },
  stmtHeader: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 10 },
  stmtLabel:  { width: 28, height: 28, borderRadius: 8, backgroundColor: '#EFF6FF', alignItems: 'center', justifyContent: 'center' },
  stmtLabelText:{ fontSize: 12, fontWeight: '800', color: '#1D4ED8' },
  pillarHint: { fontSize: 10, color: '#94A3B8', flex: 1, lineHeight: 14 },
  stmtText:   { fontSize: 13, fontWeight: '500', color: '#0F172A', lineHeight: 20, marginBottom: 14 },
  btnRow:     { flexDirection: 'row', gap: 8 },

  choiceBtn:     { flex: 1, padding: 10, borderRadius: 10, borderWidth: 1.5, borderColor: '#E2E8F0', backgroundColor: '#F1F5F9', alignItems: 'center' },
  choiceBtnText: { fontSize: 11, fontWeight: '700', color: '#94A3B8', textTransform: 'uppercase', letterSpacing: 0.3 },
  mostBtn:       { backgroundColor: 'rgba(29,78,216,0.08)', borderColor: 'rgba(29,78,216,0.25)' },
  mostBtnText:   { color: '#1D4ED8' },
  leastBtn:      { backgroundColor: 'rgba(124,58,237,0.08)', borderColor: 'rgba(124,58,237,0.25)' },
  leastBtnText:  { color: '#7C3AED' },

  footer:     { padding: 20, paddingBottom: 28, backgroundColor: '#F8FAFC', borderTopWidth: 1, borderTopColor: '#E2E8F0' },
  btnPrimary: { backgroundColor: '#1D4ED8', borderRadius: 999, paddingVertical: 15, alignItems: 'center', shadowColor: '#1D4ED8', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.28, shadowRadius: 12, elevation: 6 },
  btnDisabled:{ backgroundColor: '#94A3B8', shadowOpacity: 0 },
  btnText:    { fontSize: 15, fontWeight: '700', color: '#fff' },
});
