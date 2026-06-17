// ─── ShellTrackHomeScreen.tsx ─────────────────────────────────────
import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AppStackParamList } from '../../navigation/types';
// import ShellHeroCard from '../components/ShellHeroCard';
// import ShellProgressPillRow from '../components/ShellProgressPillRow';
// import ShellStageCard from '../components/ShellStageCard';
import ShellHeroCard from '../../components/shell/ShellHeroCard';
import ShellProgressPillRow from '../../components/shell/ShellProgressPillRow';
import ShellStageCard from '../../components/shell/ShellStageCard';

type Nav = NativeStackNavigationProp<AppStackParamList>;

// ── Dummy data ────────────────────────────────────────────────────
const HERO_STATS = [
  { label: 'Stages',  value: '4'   },
  { label: 'Screens', value: '16'  },
  { label: 'Sim',     value: '40m' },
];

const PROGRESS_PILLS = [
  { label: 'Cognitive',  pct: 65, color: '#1D4ED8' },
  { label: 'Behavioral', pct: 40, color: '#D97706' },
  { label: 'Video',      pct: 20, color: '#7C3AED' },
];

const STAGES = [
  {
    emoji: '📄', name: 'Stage 1 — CV Gate',
    meta: 'ATS check · NYSC verification',
    status: 'done' as const, iconBg: '#D1FAE5',
    screen: 'ShellCVGate' as const,
  },
  {
    emoji: '🧠', name: 'Stage 2 — Assessment',
    meta: 'Cognitive · Behavioral · Video',
    status: 'active' as const, iconBg: '#EFF6FF',
    screen: 'ShellModeSelector' as const,
  },
  {
    emoji: '📊', name: 'Stage 3 — Final Round',
    meta: 'Case study · Presentation · Interview',
    status: 'locked' as const, iconBg: '#FEF3C7',
    screen: 'ShellCaseStudy' as const,
  },
  {
    emoji: '🏢', name: 'Stage 4 — Shell Connect',
    meta: 'Office visit · Team prep',
    status: 'locked' as const, iconBg: '#EDE9FE',
    screen: 'ShellConnect' as const,
  },
];

export default function ShellTrackHomeScreen() {
  const navigation = useNavigation<Nav>();

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

        {/* Back row */}
        <View style={styles.backRow}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.backBtn}>← Company Tracks</Text>
          </TouchableOpacity>
          <View style={styles.badge}><Text style={styles.badgeText}>SHELL</Text></View>
        </View>

        {/* Hero */}
        <ShellHeroCard
          emoji="🐚"
          title={`Shell Graduate\nTrainee Prep`}
          subtitle="Master the VJT, CAR behavioral profile, and HireVue video interview — all in one track."
          stats={HERO_STATS}
        />

        {/* Progress pills */}
        <Text style={styles.secLabel}>Your Progress</Text>
        <ShellProgressPillRow pills={PROGRESS_PILLS} />

        {/* Stages */}
        <Text style={styles.secLabel}>Stages</Text>
        {STAGES.map((s) => (
          <ShellStageCard
            key={s.name}
            emoji={s.emoji}
            name={s.name}
            meta={s.meta}
            status={s.status}
            iconBg={s.iconBg}
            onPress={() => {
              if (s.status !== 'locked') {
                navigation.navigate(s.screen as any);
              }
            }}
          />
        ))}

      </ScrollView>

      {/* Footer */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.btnPrimary}
          onPress={() => navigation.navigate('ShellModeSelector' as any)}
          activeOpacity={0.85}
        >
          <Text style={styles.btnPrimaryText}>Continue Stage 2 →</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe:     { flex: 1, backgroundColor: '#F8FAFC' },
  scroll:   { padding: 20, paddingBottom: 32 },
  backRow:  { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  backBtn:  { fontSize: 14, fontWeight: '600', color: '#1D4ED8' },
  badge:    { marginLeft: 'auto', backgroundColor: 'rgba(29,78,216,0.08)', borderWidth: 1, borderColor: 'rgba(29,78,216,0.18)', borderRadius: 999, paddingHorizontal: 10, paddingVertical: 3 },
  badgeText:{ fontSize: 10, fontWeight: '700', color: '#1D4ED8', letterSpacing: 0.5 },
  secLabel: { fontSize: 10, fontWeight: '700', color: '#94A3B8', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 10 },
  footer:   { padding: 20, paddingBottom: 28, backgroundColor: '#F8FAFC', borderTopWidth: 1, borderTopColor: '#E2E8F0' },
  btnPrimary: { backgroundColor: '#1D4ED8', borderRadius: 999, paddingVertical: 15, alignItems: 'center', shadowColor: '#1D4ED8', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.28, shadowRadius: 12, elevation: 6 },
  btnPrimaryText: { fontSize: 15, fontWeight: '700', color: '#fff' },
});
