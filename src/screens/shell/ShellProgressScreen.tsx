// ─── ShellProgressScreen.tsx ─────────────────────────────────────
import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AppStackParamList } from '../../navigation/types';
import ShellInfoCard from '../../components/shell/ShellInfoCard';

type Nav = NativeStackNavigationProp<AppStackParamList>;

// ── Dummy progress data ────────────────────────────────────────────
const STAGES = [
  {
    name: 'Stage 1 — CV Gate',
    pct: 100, color: '#059669',
    sub: [{ label: 'ATS Check', pct: 100 }, { label: 'NYSC Verification', pct: 100 }],
    status: 'done',
  },
  {
    name: 'Stage 2 — Assessment',
    pct: 72, color: '#1D4ED8',
    sub: [
      { label: 'Cognitive', pct: 84 },
      { label: 'Behavioral', pct: 68 },
      { label: 'Video', pct: 60 },
    ],
    status: 'active',
  },
  {
    name: 'Stage 3 — Final Round',
    pct: 0, color: '#94A3B8',
    sub: [{ label: 'Case Study', pct: 0 }, { label: 'Presentation', pct: 0 }],
    status: 'locked',
  },
  {
    name: 'Stage 4 — Shell Connect',
    pct: 0, color: '#94A3B8',
    sub: [{ label: 'Office Visit Prep', pct: 0 }],
    status: 'locked',
  },
];

const PRACTICE_HISTORY = [
  { date: 'Today',      type: 'Numerical Practice',  score: '3/3', result: 'pass' },
  { date: 'Yesterday',  type: 'Verbal Practice',      score: '3/4', result: 'pass' },
  { date: '2 days ago', type: 'Behavioral Practice',  score: '5/5 pairs', result: 'pass' },
  { date: '3 days ago', type: 'Abstract Practice',    score: '2/4', result: 'fail' },
  { date: '4 days ago', type: 'Full Exam Simulation', score: '38/50', result: 'pass' },
];

const overallPct = Math.round(STAGES.reduce((acc, s) => acc + s.pct, 0) / STAGES.length);

export default function ShellProgressScreen() {
  const navigation = useNavigation<Nav>();

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

        <View style={styles.backRow}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.backBtn}>← Shell Track</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.title}>Your Progress</Text>
        <Text style={styles.sub}>Shell Graduate Trainee Track — All Stages</Text>

        {/* Overall ring */}
        <View style={styles.ringSection}>
          <View style={styles.ringOuter}>
            <View style={styles.ringInner}>
              <Text style={styles.ringPct}>{overallPct}%</Text>
              <Text style={styles.ringLabel}>Ready</Text>
            </View>
          </View>
          <Text style={styles.ringCaption}>
            {overallPct >= 75 ? 'You\'re well prepared for the real test 💪'
              : overallPct >= 50 ? 'Good progress — keep going 📈'
              : 'Just getting started — build the habit 🌱'}
          </Text>
        </View>

        {/* Stage breakdown */}
        <Text style={styles.secLabel}>Stage Breakdown</Text>
        {STAGES.map((s) => (
          <View key={s.name} style={[styles.stageCard, s.status === 'locked' && styles.stageCardLocked]}>
            <View style={styles.stageTop}>
              <Text style={[styles.stageName, s.status === 'locked' && styles.stageNameMuted]}>{s.name}</Text>
              <Text style={[styles.stagePct, { color: s.color }]}>{s.pct}%</Text>
            </View>
            <View style={styles.stageTrack}>
              <View style={[styles.stageFill, { width: `${s.pct}%` as any, backgroundColor: s.color }]} />
            </View>
            {s.sub.length > 0 && s.status !== 'locked' && (
              <View style={styles.subRow}>
                {s.sub.map((sub) => (
                  <View key={sub.label} style={styles.subItem}>
                    <Text style={styles.subLabel}>{sub.label}</Text>
                    <Text style={[styles.subPct, { color: sub.pct >= 70 ? '#059669' : sub.pct >= 50 ? '#D97706' : '#DC2626' }]}>
                      {sub.pct}%
                    </Text>
                  </View>
                ))}
              </View>
            )}
            {s.status === 'locked' && (
              <Text style={styles.lockedText}>Complete Stage 2 to unlock</Text>
            )}
          </View>
        ))}

        {/* Practice history */}
        <Text style={styles.secLabel}>Recent Practice Sessions</Text>
        {PRACTICE_HISTORY.map((h, i) => (
          <View key={i} style={styles.historyRow}>
            <View style={[styles.historyDot, { backgroundColor: h.result === 'pass' ? '#059669' : '#DC2626' }]} />
            <View style={{ flex: 1 }}>
              <Text style={styles.historyType}>{h.type}</Text>
              <Text style={styles.historyDate}>{h.date}</Text>
            </View>
            <Text style={[styles.historyScore, { color: h.result === 'pass' ? '#059669' : '#DC2626' }]}>
              {h.score}
            </Text>
          </View>
        ))}

        {/* Focus card */}
        <ShellInfoCard
          title="📌 Focus: Relationships (CAR)"
          text="Your Relationships score (58%) is below Shell's benchmark. Do 3 more behavioral practice sessions focusing on collaboration-first statement choices before running the next exam simulation."
          variant="amber"
          style={{ marginTop: 4 }}
        />

      </ScrollView>

      <View style={styles.footer}>
        <View style={styles.footerRow}>
          <TouchableOpacity
            style={styles.btnSecondary}
            onPress={() => navigation.navigate('ShellModeSelector' as any)}
            activeOpacity={0.85}
          >
            <Text style={styles.btnSecondaryText}>Keep Practising</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.btnPrimary}
            onPress={() => navigation.navigate('ShellExamHub' as any)}
            activeOpacity={0.85}
          >
            <Text style={styles.btnPrimaryText}>Run Full Sim ⏱️</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe:    { flex: 1, backgroundColor: '#F8FAFC' },
  scroll:  { padding: 20, paddingBottom: 32 },
  backRow: { marginBottom: 16 },
  backBtn: { fontSize: 14, fontWeight: '600', color: '#1D4ED8' },
  title:   { fontSize: 26, fontWeight: '800', color: '#0F172A', letterSpacing: -0.5, marginBottom: 4 },
  sub:     { fontSize: 13, color: '#475569', marginBottom: 24 },
  secLabel:{ fontSize: 10, fontWeight: '700', color: '#94A3B8', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 12, marginTop: 8 },

  // Ring
  ringSection: { alignItems: 'center', marginBottom: 28 },
  ringOuter:   { width: 110, height: 110, borderRadius: 55, borderWidth: 5, borderColor: '#1D4ED8', alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
  ringInner:   { alignItems: 'center' },
  ringPct:     { fontSize: 26, fontWeight: '800', color: '#1D4ED8' },
  ringLabel:   { fontSize: 10, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: 0.5 },
  ringCaption: { fontSize: 13, color: '#475569', textAlign: 'center' },

  // Stage cards
  stageCard:      { backgroundColor: '#fff', borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 16, padding: 14, marginBottom: 10 },
  stageCardLocked:{ opacity: 0.5 },
  stageTop:       { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  stageName:      { fontSize: 13, fontWeight: '700', color: '#0F172A' },
  stageNameMuted: { color: '#94A3B8' },
  stagePct:       { fontSize: 13, fontWeight: '700' },
  stageTrack:     { height: 6, backgroundColor: '#E2E8F0', borderRadius: 999, overflow: 'hidden', marginBottom: 10 },
  stageFill:      { height: 6, borderRadius: 999 },
  subRow:         { flexDirection: 'row', gap: 12 },
  subItem:        { flex: 1 },
  subLabel:       { fontSize: 10, color: '#94A3B8', marginBottom: 2 },
  subPct:         { fontSize: 12, fontWeight: '700' },
  lockedText:     { fontSize: 11, color: '#94A3B8' },

  // History
  historyRow:  { backgroundColor: '#fff', borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 12, padding: 12, flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 8 },
  historyDot:  { width: 10, height: 10, borderRadius: 5 },
  historyType: { fontSize: 13, fontWeight: '600', color: '#0F172A', marginBottom: 2 },
  historyDate: { fontSize: 11, color: '#94A3B8' },
  historyScore:{ fontSize: 13, fontWeight: '700' },

  // Footer
  footer:          { padding: 20, paddingBottom: 28, backgroundColor: '#F8FAFC', borderTopWidth: 1, borderTopColor: '#E2E8F0' },
  footerRow:       { flexDirection: 'row', gap: 10 },
  btnSecondary:    { flex: 1, backgroundColor: '#fff', borderWidth: 1.5, borderColor: '#CBD5E1', borderRadius: 999, paddingVertical: 14, alignItems: 'center' },
  btnSecondaryText:{ fontSize: 14, fontWeight: '700', color: '#475569' },
  btnPrimary:      { flex: 1, backgroundColor: '#1D4ED8', borderRadius: 999, paddingVertical: 14, alignItems: 'center', shadowColor: '#1D4ED8', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.28, shadowRadius: 12, elevation: 6 },
  btnPrimaryText:  { fontSize: 14, fontWeight: '700', color: '#fff' },
});
