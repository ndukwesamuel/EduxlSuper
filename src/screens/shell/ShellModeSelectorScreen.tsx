// ─── ShellModeSelectorScreen.tsx ─────────────────────────────────
import React, { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AppStackParamList } from '../../navigation/types';
import ShellModuleRow from '../../components/shell/ShellModuleRow';
import ShellInfoCard from '../../components/shell/ShellInfoCard';
// import ShellModuleRow from '../components/ShellModuleRow';
// import ShellInfoCard  from '../components/ShellInfoCard';


// ShellInfoCard

type Nav  = NativeStackNavigationProp<AppStackParamList>;
type Mode = 'practice' | 'exam';

// ── Dummy data ─────────────────────────────────────────────────────
const MODES: { id: Mode; icon: string; label: string; desc: string }[] = [
  {
    id: 'practice', icon: '📚', label: 'Practice',
    desc: 'One question at a time. Explanations after each answer. No timer pressure.',
  },
  {
    id: 'exam', icon: '⏱️', label: 'Exam Sim',
    desc: 'Full 40-min simulation. Real Shell conditions. Timer locks on start.',
  },
];

const MODULES = [
  { emoji: '🧠', name: 'Cognitive Puzzles',    meta: 'Numerical · Verbal · Abstract',  time: '12 min', timeColor: '#1D4ED8', iconBg: '#EFF6FF' },
  { emoji: '📊', name: 'Working Style (CAR)',   meta: 'Forced-choice behavioral pairs',  time: '15 min', timeColor: '#D97706', iconBg: '#FEF3C7' },
  { emoji: '📹', name: 'Video Interview',       meta: '3 prompts · STAR method',         time: '15 min', timeColor: '#7C3AED', iconBg: '#EDE9FE' },
];

// Practice sub-types (used for navigation)
const PRACTICE_TYPES: { icon: string; label: string; meta: string; screen: string }[] = [
  { icon: '🔢', label: 'Numerical',  meta: 'Data tables, percentages, ratios',    screen: 'ShellPracticeNumerical'  },
  { icon: '📖', label: 'Verbal',     meta: 'True / False / Cannot Say passages',  screen: 'ShellPracticeVerbal'     },
  { icon: '🔷', label: 'Abstract',   meta: 'Shape sequences and grid matrices',   screen: 'ShellPracticeAbstract'   },
  { icon: '🤝', label: 'Behavioral', meta: 'CAR forced-choice pairs',             screen: 'ShellPracticeBehavioral' },
  { icon: '🎥', label: 'Video Booth',meta: 'STAR method practice recordings',     screen: 'ShellPracticeVideo'      },
];

export default function ShellModeSelectorScreen() {
  const navigation = useNavigation<Nav>();
  const [mode, setMode] = useState<Mode>('practice');

  const handleStart = () => {
    if (mode === 'exam') {
      navigation.navigate('ShellExamHub' as any);
    } else {
      // Default to first practice type
      navigation.navigate('ShellPracticeNumerical' as any);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

        {/* Back row */}
        <View style={styles.backRow}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.backBtn}>← Shell Track</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.title}>Stage 2{'\n'}Assessment</Text>
        <Text style={styles.sub}>Choose how you want to approach Shell's 40-minute combined assessment.</Text>

        {/* Mode cards */}
        <Text style={styles.secLabel}>Select Mode</Text>
        <View style={styles.modeGrid}>
          {MODES.map((m) => (
            <TouchableOpacity
              key={m.id}
              style={[styles.modeCard, mode === m.id && styles.modeCardActive]}
              onPress={() => setMode(m.id)}
              activeOpacity={0.8}
            >
              <Text style={styles.modeIcon}>{m.icon}</Text>
              <Text style={[styles.modeLabel, mode === m.id && styles.modeLabelActive]}>{m.label}</Text>
              <Text style={[styles.modeDesc, mode === m.id && styles.modeDescActive]}>{m.desc}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Module breakdown */}
        <Text style={styles.secLabel}>What's Inside</Text>
        {MODULES.map((m) => (
          <ShellModuleRow key={m.name} {...m} />
        ))}

        {/* CAR info */}
        <ShellInfoCard
          title="💡 Shell C-A-R Framework"
          text="All responses are scored against Shell's Capacity, Achievement, and Relationships criteria. Consistency across all three tests is critical."
          variant="brand"
          style={styles.infoCard}
        />

        {/* Practice sub-type selector (only in practice mode) */}
        {mode === 'practice' && (
          <>
            <Text style={[styles.secLabel, { marginTop: 8 }]}>Jump to a specific area</Text>
            {PRACTICE_TYPES.map((p) => (
              <TouchableOpacity
                key={p.label}
                style={styles.practiceRow}
                onPress={() => navigation.navigate(p.screen as any)}
                activeOpacity={0.8}
              >
                <View style={styles.practiceIcon}>
                  <Text style={{ fontSize: 18 }}>{p.icon}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.practiceName}>{p.label}</Text>
                  <Text style={styles.practiceMeta}>{p.meta}</Text>
                </View>
                <Text style={styles.arrow}>→</Text>
              </TouchableOpacity>
            ))}
          </>
        )}

      </ScrollView>

      {/* Footer */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.btnPrimary} onPress={handleStart} activeOpacity={0.85}>
          <Text style={styles.btnPrimaryText}>
            {mode === 'practice' ? 'Start Practice Mode →' : 'Launch 40-Min Simulation ⏱️'}
          </Text>
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

  title: { fontSize: 26, fontWeight: '800', color: '#0F172A', lineHeight: 32, letterSpacing: -0.5, marginBottom: 6 },
  sub:   { fontSize: 13, color: '#475569', lineHeight: 20, marginBottom: 20 },

  secLabel: { fontSize: 10, fontWeight: '700', color: '#94A3B8', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 10 },

  // Mode cards
  modeGrid: { flexDirection: 'row', gap: 10, marginBottom: 20 },
  modeCard: {
    flex: 1, backgroundColor: '#fff', borderWidth: 1.5, borderColor: '#E2E8F0',
    borderRadius: 16, padding: 16, alignItems: 'center', gap: 6,
  },
  modeCardActive: { backgroundColor: 'rgba(29,78,216,0.06)', borderColor: 'rgba(29,78,216,0.2)' },
  modeIcon:       { fontSize: 24 },
  modeLabel:      { fontSize: 13, fontWeight: '700', color: '#475569', textAlign: 'center' },
  modeLabelActive:{ color: '#1D4ED8' },
  modeDesc:       { fontSize: 10, color: '#94A3B8', textAlign: 'center', lineHeight: 14 },
  modeDescActive: { color: '#475569' },

  infoCard: { marginBottom: 16 },

  // Practice type rows
  practiceRow: {
    backgroundColor: '#fff', borderWidth: 1, borderColor: '#E2E8F0',
    borderRadius: 14, padding: 14, flexDirection: 'row',
    alignItems: 'center', gap: 12, marginBottom: 10,
  },
  practiceIcon: { width: 40, height: 40, borderRadius: 10, backgroundColor: '#F1F5F9', alignItems: 'center', justifyContent: 'center' },
  practiceName: { fontSize: 14, fontWeight: '700', color: '#0F172A', marginBottom: 2 },
  practiceMeta: { fontSize: 11, color: '#475569' },
  arrow:        { fontSize: 18, color: '#94A3B8' },

  // Footer
  footer:         { padding: 20, paddingBottom: 28, backgroundColor: '#F8FAFC', borderTopWidth: 1, borderTopColor: '#E2E8F0' },
  btnPrimary:     { backgroundColor: '#1D4ED8', borderRadius: 999, paddingVertical: 15, alignItems: 'center', shadowColor: '#1D4ED8', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.28, shadowRadius: 12, elevation: 6 },
  btnPrimaryText: { fontSize: 15, fontWeight: '700', color: '#fff' },
});
