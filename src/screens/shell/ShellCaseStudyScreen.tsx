// ─── ShellCaseStudyScreen.tsx ─────────────────────────────────────
import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AppStackParamList } from '../../navigation/types';
import ShellInfoCard from '../../components/shell/ShellInfoCard';

type Nav = NativeStackNavigationProp<AppStackParamList>;

const CASE_STUDIES = [
  {
    id: 1,
    title: 'Asset Block 12-C Production Decline',
    tag: 'Operations',
    data: 'Asset Block 12-C recorded a 15% production decline over the last two quarters. Q1 output was 120,000 barrels/day. Q2 output dropped to 102,000. Maintenance costs increased by 22%. Two of the three injection wells were taken offline in Q2 for unplanned repairs. The third well is operating at 78% capacity.',
    problem: 'Using the data provided, identify the root cause of the production decline, propose two corrective actions, and estimate their impact on Q3 output.',
    structure: [
      { step: '01', title: 'Problem Diagnosis', desc: 'State the root cause clearly. Use only the data given. 60 seconds max.', time: '~60s' },
      { step: '02', title: 'Two Corrective Actions', desc: 'Each with a risk and resource trade-off. Be specific — "restore injection wells" is stronger than "fix equipment".', time: '~3 min' },
      { step: '03', title: 'Impact Estimate', desc: 'Quantify projected Q3 output change based on your proposed actions. Show your working.', time: '~60s' },
    ],
    tip: 'Shell assessors care more about your reasoning process than your final number. Walk them through your logic. A wrong answer with sound reasoning beats a right answer with no explanation.',
    model: 'Root cause: 2 of 3 injection wells offline = 66% injection capacity lost → production decline. Restoring Well 1 (4 weeks): +12,000 bbl/day. Optimising Well 3 to 100% (2 weeks): +2,640 bbl/day. Projected Q3 output: ~116,640 bbl/day (+14.3% on Q2).',
  },
  {
    id: 2,
    title: 'Renewable Energy Investment Decision',
    tag: 'Commercial',
    data: 'Shell Nigeria has been allocated $50M for strategic investment. Option A: Expand offshore natural gas extraction (est. ROI: 18%, 5-year payback). Option B: Wind farm development in northern Nigeria (est. ROI: 12%, 8-year payback). Option C: Joint venture with a solar startup (est. ROI: 22%, 3-year payback, higher risk). Market data shows increasing global pressure to reduce carbon emissions.',
    problem: 'Which investment option would you recommend to Shell\'s leadership team and why? Consider financial returns, risk, and Shell\'s strategic direction.',
    structure: [
      { step: '01', title: 'Frame the Decision', desc: 'State which option you recommend upfront. Don\'t bury your conclusion at the end.', time: '~30s' },
      { step: '02', title: 'Justify with Data', desc: 'Use the ROI, payback period, and market context provided. Don\'t invent data.', time: '~3 min' },
      { step: '03', title: 'Acknowledge Trade-offs', desc: 'What does your recommendation sacrifice? Shell expects balanced thinking, not cheerleading.', time: '~90s' },
    ],
    tip: 'There is no single correct answer. Shell assesses whether you can structure a recommendation clearly, use the data provided, and acknowledge risk. Candidates who ignore the carbon emissions context lose points.',
    model: 'Recommendation: Option C (Solar JV) with risk mitigation. Rationale: Highest ROI (22%), fastest payback (3yr), aligns with Shell\'s energy transition strategy. Risk mitigation: Phase investment over 2 years, tie milestone payments to startup KPIs. Trade-off: Higher execution risk vs faster strategic alignment and financial return.',
  },
];

export default function ShellCaseStudyScreen() {
  const navigation = useNavigation<Nav>();
  const [caseIdx, setCaseIdx]   = useState(0);
  const [showModel, setShowModel] = useState(false);
  const [tab, setTab]           = useState<'problem'|'structure'|'model'>('problem');

  const cs = CASE_STUDIES[caseIdx];

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

        <View style={styles.backRow}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.backBtn}>← Results</Text>
          </TouchableOpacity>
          <View style={styles.badge}><Text style={styles.badgeText}>STAGE 3</Text></View>
        </View>

        <Text style={styles.title}>Final Round{'\n'}Case Study</Text>
        <Text style={styles.sub}>Shell sends you a business case 48 hours before the Final Assessment Day. You have 5 minutes to present a structured solution.</Text>

        {/* Case selector */}
        <View style={styles.caseSelector}>
          {CASE_STUDIES.map((c, i) => (
            <TouchableOpacity
              key={c.id}
              style={[styles.casePill, caseIdx === i && styles.casePillActive]}
              onPress={() => { setCaseIdx(i); setTab('problem'); setShowModel(false); }}
              activeOpacity={0.8}
            >
              <Text style={[styles.casePillText, caseIdx === i && styles.casePillTextActive]}>{c.tag}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Case header */}
        <View style={styles.caseCard}>
          <View style={styles.caseTag}><Text style={styles.caseTagText}>{cs.tag}</Text></View>
          <Text style={styles.caseName}>{cs.title}</Text>
        </View>

        {/* Tabs */}
        <View style={styles.tabs}>
          {(['problem','structure','model'] as const).map((t) => (
            <TouchableOpacity key={t} style={[styles.tab, tab === t && styles.tabActive]} onPress={() => setTab(t)} activeOpacity={0.8}>
              <Text style={[styles.tabText, tab === t && styles.tabTextActive]}>
                {t === 'problem' ? 'The Data' : t === 'structure' ? 'Structure' : 'Model Answer'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Tab content */}
        {tab === 'problem' && (
          <>
            <View style={styles.dataCard}>
              <Text style={styles.dataLabel}>CASE DATA</Text>
              <Text style={styles.dataText}>{cs.data}</Text>
            </View>
            <View style={styles.questionCard}>
              <Text style={styles.questionLabel}>YOUR TASK</Text>
              <Text style={styles.questionText}>{cs.problem}</Text>
            </View>
          </>
        )}

        {tab === 'structure' && (
          <>
            {cs.structure.map((s) => (
              <View key={s.step} style={styles.stepCard}>
                <View style={styles.stepNum}><Text style={styles.stepNumText}>{s.step}</Text></View>
                <View style={{ flex: 1 }}>
                  <View style={styles.stepHeader}>
                    <Text style={styles.stepTitle}>{s.title}</Text>
                    <Text style={styles.stepTime}>{s.time}</Text>
                  </View>
                  <Text style={styles.stepDesc}>{s.desc}</Text>
                </View>
              </View>
            ))}
            <ShellInfoCard title="💡 Assessor Tip" text={cs.tip} variant="amber" style={{ marginTop: 4 }} />
          </>
        )}

        {tab === 'model' && (
          <View style={styles.modelCard}>
            <Text style={styles.modelLabel}>MODEL ANSWER</Text>
            <Text style={styles.modelText}>{cs.model}</Text>
            <ShellInfoCard
              title="⚠️ Use this as a benchmark, not a script"
              text="Shell assessors can tell when you've memorised an answer. Use this to understand the reasoning structure, then practice with your own words."
              variant="red"
              style={{ marginTop: 12 }}
            />
          </View>
        )}

      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.btnPrimary}
          onPress={() => navigation.navigate('ShellConnect' as any)}
          activeOpacity={0.85}
        >
          <Text style={styles.btnText}>Stage 4 — Shell Connect →</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe:    { flex: 1, backgroundColor: '#F8FAFC' },
  scroll:  { padding: 20, paddingBottom: 32 },
  backRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  backBtn: { fontSize: 14, fontWeight: '600', color: '#1D4ED8' },
  badge:   { marginLeft: 'auto', backgroundColor: '#FEF3C7', borderWidth: 1, borderColor: '#FDE68A', borderRadius: 999, paddingHorizontal: 10, paddingVertical: 3 },
  badgeText: { fontSize: 10, fontWeight: '700', color: '#D97706', letterSpacing: 0.5 },
  title:   { fontSize: 26, fontWeight: '800', color: '#0F172A', lineHeight: 32, letterSpacing: -0.5, marginBottom: 6 },
  sub:     { fontSize: 13, color: '#475569', lineHeight: 20, marginBottom: 20 },
  caseSelector: { flexDirection: 'row', gap: 10, marginBottom: 16 },
  casePill:     { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 999, backgroundColor: '#fff', borderWidth: 1, borderColor: '#E2E8F0' },
  casePillActive:{ backgroundColor: '#1D4ED8', borderColor: '#1D4ED8' },
  casePillText:  { fontSize: 13, fontWeight: '600', color: '#475569' },
  casePillTextActive: { color: '#fff' },
  caseCard:  { backgroundColor: '#fff', borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 16, padding: 16, marginBottom: 16 },
  caseTag:   { backgroundColor: '#EFF6FF', borderRadius: 8, paddingHorizontal: 10, paddingVertical: 4, alignSelf: 'flex-start', marginBottom: 8 },
  caseTagText: { fontSize: 10, fontWeight: '700', color: '#1D4ED8', textTransform: 'uppercase', letterSpacing: 0.5 },
  caseName:  { fontSize: 16, fontWeight: '800', color: '#0F172A', lineHeight: 22 },
  tabs:      { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: '#E2E8F0', marginBottom: 16 },
  tab:       { flex: 1, paddingVertical: 10, alignItems: 'center' },
  tabActive: { borderBottomWidth: 2, borderBottomColor: '#1D4ED8' },
  tabText:   { fontSize: 12, fontWeight: '600', color: '#94A3B8' },
  tabTextActive: { color: '#1D4ED8' },
  dataCard:    { backgroundColor: '#F8FAFC', borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 14, padding: 14, marginBottom: 12 },
  dataLabel:   { fontSize: 9, fontWeight: '700', color: '#94A3B8', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 },
  dataText:    { fontSize: 12, color: '#475569', lineHeight: 20 },
  questionCard:{ backgroundColor: '#EFF6FF', borderWidth: 1, borderColor: 'rgba(29,78,216,0.15)', borderRadius: 14, padding: 14 },
  questionLabel:{ fontSize: 9, fontWeight: '700', color: '#1D4ED8', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 },
  questionText: { fontSize: 13, fontWeight: '600', color: '#0F172A', lineHeight: 20 },
  stepCard:    { backgroundColor: '#fff', borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 14, padding: 14, flexDirection: 'row', gap: 12, marginBottom: 10 },
  stepNum:     { width: 32, height: 32, borderRadius: 8, backgroundColor: '#EFF6FF', alignItems: 'center', justifyContent: 'center', flex: 0 },
  stepNumText: { fontSize: 12, fontWeight: '800', color: '#1D4ED8' },
  stepHeader:  { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
  stepTitle:   { fontSize: 13, fontWeight: '700', color: '#0F172A' },
  stepTime:    { fontSize: 11, color: '#94A3B8', fontWeight: '600' },
  stepDesc:    { fontSize: 12, color: '#475569', lineHeight: 18 },
  modelCard:   { backgroundColor: '#fff', borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 14, padding: 14 },
  modelLabel:  { fontSize: 9, fontWeight: '700', color: '#94A3B8', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 10 },
  modelText:   { fontSize: 12, color: '#475569', lineHeight: 20 },
  footer:      { padding: 20, paddingBottom: 28, backgroundColor: '#F8FAFC', borderTopWidth: 1, borderTopColor: '#E2E8F0' },
  btnPrimary:  { backgroundColor: '#1D4ED8', borderRadius: 999, paddingVertical: 15, alignItems: 'center', shadowColor: '#1D4ED8', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.28, shadowRadius: 12, elevation: 6 },
  btnText:     { fontSize: 15, fontWeight: '700', color: '#fff' },
});
