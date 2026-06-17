// ─── ShellResultsScreen.tsx ───────────────────────────────────────
import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AppStackParamList } from '../../navigation/types';
import ShellCARBar  from '../../components/shell/ShellCARBar';
import ShellInfoCard from '../../components/shell/ShellInfoCard';

type Nav = NativeStackNavigationProp<AppStackParamList>;

export default function ShellResultsScreen() {
  const navigation = useNavigation<Nav>();
  const route      = useRoute<any>();

  // Dummy scores — will come from route.params in real app
  const cogScore   = route.params?.cogScore   ?? 38;
  const behavScore = route.params?.behavScore ?? 14;
  const videoScore = route.params?.videoScore ?? 2;

  const cogPct   = Math.round((cogScore   / 50) * 100);
  const behavPct = Math.round((behavScore / 20) * 100);
  const videoPct = Math.round((videoScore / 3)  * 100);

  // Dummy CAR scores
  const carScores = [
    { label: 'Capacity (C)',      pct: 84 },
    { label: 'Achievement (A)',   pct: 72 },
    { label: 'Relationships (R)', pct: 58 },
  ];

  const overallPct = Math.round((cogPct + behavPct + videoPct) / 3);

  const getEmoji = (pct: number) => pct >= 75 ? '🟢' : pct >= 50 ? '🟡' : '🔴';

  const INSIGHTS = [
    { icon: '✓', color: '#059669', bg: '#D1FAE5', title: 'Strong Cognitive Velocity', desc: 'Numerical and abstract scores are well inside Shell\'s benchmark percentiles for the Technical Engineering track.' },
    { icon: '⚠', color: '#D97706', bg: '#FEF3C7', title: 'Relationships Score Low (58%)', desc: 'Forced-choice pairs revealed a pattern of prioritising individual execution over collaborative alignment. Shell flags this in behavioral reviews — balance this in your next attempt.' },
  ];

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

        {/* Header */}
        <View style={styles.heroSection}>
          <Text style={styles.heroEmoji}>{overallPct >= 70 ? '🔥' : overallPct >= 50 ? '💪' : '📈'}</Text>
          <Text style={styles.heroTitle}>Stage 2 Complete</Text>
          <Text style={styles.heroSub}>Here's how your responses mapped to Shell's C-A-R criteria.</Text>
        </View>

        {/* Score cards */}
        <View style={styles.scoreRow}>
          <View style={styles.scoreCard}>
            <Text style={styles.scoreNum}>{cogScore}/50</Text>
            <Text style={styles.scoreLbl}>Cognitive</Text>
            <Text style={styles.scoreEmoji}>{getEmoji(cogPct)}</Text>
          </View>
          <View style={styles.scoreCard}>
            <Text style={styles.scoreNum}>{behavScore}/20</Text>
            <Text style={styles.scoreLbl}>Behavioral</Text>
            <Text style={styles.scoreEmoji}>{getEmoji(behavPct)}</Text>
          </View>
          <View style={styles.scoreCard}>
            <Text style={styles.scoreNum}>{videoScore}/3</Text>
            <Text style={styles.scoreLbl}>Video</Text>
            <Text style={styles.scoreEmoji}>{getEmoji(videoPct)}</Text>
          </View>
        </View>

        {/* CAR bars */}
        <Text style={styles.secLabel}>Shell C-A-R Alignment</Text>
        <ShellCARBar scores={carScores} />

        {/* Overall score ring (CSS-style) */}
        <View style={styles.ringCard}>
          <View style={styles.ring}>
            <Text style={styles.ringPct}>{overallPct}%</Text>
            <Text style={styles.ringLabel}>Overall</Text>
          </View>
          <View style={styles.ringInfo}>
            <Text style={styles.ringInfoTitle}>
              {overallPct >= 75 ? 'Strong performance' : overallPct >= 55 ? 'Solid — needs polish' : 'Keep practising'}
            </Text>
            <Text style={styles.ringInfoSub}>
              Shell's passing benchmark is typically 65%+ across all three sections combined.
            </Text>
          </View>
        </View>

        {/* Insights */}
        <Text style={styles.secLabel}>Insights</Text>
        {INSIGHTS.map((ins, i) => (
          <View key={i} style={styles.insightCard}>
            <View style={[styles.insightIcon, { backgroundColor: ins.bg }]}>
              <Text style={[styles.insightIconText, { color: ins.color }]}>{ins.icon}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.insightTitle}>{ins.title}</Text>
              <Text style={styles.insightDesc}>{ins.desc}</Text>
            </View>
          </View>
        ))}

        {/* Next stage info */}
        <ShellInfoCard
          title="📌 Next: Stage 3 — Final Round"
          text="If your real Shell scores meet the threshold, you'll receive an invite to the Final Assessment Day — case study, presentation, and live interview with Shell employees."
          variant="brand"
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
            <Text style={styles.btnSecondaryText}>Retake Weak Areas</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.btnPrimary}
            onPress={() => navigation.navigate('ShellCaseStudy' as any)}
            activeOpacity={0.85}
          >
            <Text style={styles.btnPrimaryText}>Stage 3 Prep →</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe:   { flex: 1, backgroundColor: '#F8FAFC' },
  scroll: { padding: 20, paddingBottom: 32 },
  heroSection: { alignItems: 'center', paddingVertical: 24 },
  heroEmoji:   { fontSize: 52, marginBottom: 12 },
  heroTitle:   { fontSize: 28, fontWeight: '800', color: '#0F172A', letterSpacing: -0.5, marginBottom: 6 },
  heroSub:     { fontSize: 13, color: '#475569', textAlign: 'center', lineHeight: 20 },
  scoreRow:    { flexDirection: 'row', gap: 10, marginBottom: 24 },
  scoreCard:   { flex: 1, backgroundColor: '#fff', borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 14, padding: 14, alignItems: 'center', gap: 4 },
  scoreNum:    { fontSize: 18, fontWeight: '800', color: '#0F172A' },
  scoreLbl:    { fontSize: 10, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: 0.3 },
  scoreEmoji:  { fontSize: 14 },
  secLabel:    { fontSize: 10, fontWeight: '700', color: '#94A3B8', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 12 },
  ringCard:    { backgroundColor: '#fff', borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 16, padding: 16, flexDirection: 'row', alignItems: 'center', gap: 16, marginBottom: 20 },
  ring:        { width: 80, height: 80, borderRadius: 40, backgroundColor: '#EFF6FF', borderWidth: 4, borderColor: '#1D4ED8', alignItems: 'center', justifyContent: 'center' },
  ringPct:     { fontSize: 18, fontWeight: '800', color: '#1D4ED8' },
  ringLabel:   { fontSize: 9, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: 0.5 },
  ringInfo:    { flex: 1 },
  ringInfoTitle:{ fontSize: 14, fontWeight: '700', color: '#0F172A', marginBottom: 4 },
  ringInfoSub:  { fontSize: 12, color: '#475569', lineHeight: 18 },
  insightCard: { backgroundColor: '#fff', borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 14, padding: 14, flexDirection: 'row', gap: 12, marginBottom: 10 },
  insightIcon: { width: 28, height: 28, borderRadius: 8, alignItems: 'center', justifyContent: 'center', flex: 0 },
  insightIconText: { fontSize: 13, fontWeight: '700' },
  insightTitle:{ fontSize: 13, fontWeight: '700', color: '#0F172A', marginBottom: 3 },
  insightDesc: { fontSize: 11, color: '#475569', lineHeight: 17 },
  footer:      { padding: 20, paddingBottom: 28, backgroundColor: '#F8FAFC', borderTopWidth: 1, borderTopColor: '#E2E8F0' },
  footerRow:   { flexDirection: 'row', gap: 10 },
  btnSecondary:{ flex: 1, backgroundColor: '#fff', borderWidth: 1.5, borderColor: '#CBD5E1', borderRadius: 999, paddingVertical: 14, alignItems: 'center' },
  btnSecondaryText: { fontSize: 14, fontWeight: '700', color: '#475569' },
  btnPrimary:  { flex: 1, backgroundColor: '#1D4ED8', borderRadius: 999, paddingVertical: 14, alignItems: 'center', shadowColor: '#1D4ED8', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.28, shadowRadius: 12, elevation: 6 },
  btnPrimaryText: { fontSize: 14, fontWeight: '700', color: '#fff' },
});
