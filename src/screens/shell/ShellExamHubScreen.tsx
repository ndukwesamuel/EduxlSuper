// ─── ShellExamHubScreen.tsx ───────────────────────────────────────
import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AppStackParamList } from '../../navigation/types';
import ShellInfoCard from '../../components/shell/ShellInfoCard';
import ShellModuleRow from '../../components/shell/ShellModuleRow';

type Nav = NativeStackNavigationProp<AppStackParamList>;

const CHECKLIST = [
  { id: 'room',     icon: '🔇', label: 'Quiet room confirmed' },
  { id: 'internet', icon: '📶', label: 'Stable internet connection' },
  { id: 'camera',   icon: '📷', label: 'Front camera unblocked' },
  { id: 'paper',    icon: '📝', label: 'Pen and paper ready' },
  { id: 'time',     icon: '⏱️', label: '40 minutes free — no interruptions' },
];

export default function ShellExamHubScreen() {
  const navigation = useNavigation<Nav>();
  const [checked, setChecked] = useState<Record<string, boolean>>({});

  const toggle = (id: string) => setChecked((p) => ({ ...p, [id]: !p[id] }));
  const allChecked = CHECKLIST.every((c) => checked[c.id]);

  const handleLaunch = () => {
    if (!allChecked) {
      Alert.alert('Not ready', 'Complete all pre-flight checks before starting the simulation.');
      return;
    }
    navigation.navigate('ShellExamCognitive' as any);
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

        <View style={styles.backRow}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.backBtn}>← Shell Track</Text>
          </TouchableOpacity>
          <View style={styles.badge}><Text style={styles.badgeText}>EXAM SIM</Text></View>
        </View>

        <Text style={styles.title}>Stage 2{'\n'}Gateway</Text>
        <Text style={styles.sub}>This 40-minute simulation runs under real Shell conditions. Once started, the timer locks. No pausing.</Text>

        <ShellInfoCard
          title="⚠️ Before You Start"
          text="This simulation mirrors the exact Shell VJT format. Your cognitive, behavioral, and video responses are scored together. Treat it like the real thing."
          variant="red"
          style={styles.infoCard}
        />

        <Text style={styles.secLabel}>Assessment Slots</Text>
        <ShellModuleRow emoji="🧠" name="Cognitive Puzzles"     meta="50 questions · Numerical, Verbal, Abstract" time="12 min" timeColor="#1D4ED8" iconBg="#EFF6FF" />
        <ShellModuleRow emoji="📊" name="Working Style (CAR)"   meta="20 forced-choice pairs"                    time="15 min" timeColor="#D97706" iconBg="#FEF3C7" />
        <ShellModuleRow emoji="📹" name="On-Demand Video Pitch" meta="3 prompts · 2 min each"                    time="15 min" timeColor="#7C3AED" iconBg="#EDE9FE" />

        <Text style={styles.secLabel}>Pre-Flight Checks</Text>
        {CHECKLIST.map((c) => (
          <TouchableOpacity key={c.id} style={styles.checkRow} onPress={() => toggle(c.id)} activeOpacity={0.8}>
            <View style={[styles.checkBox, checked[c.id] && styles.checkBoxDone]}>
              {checked[c.id] && <Text style={styles.checkTick}>✓</Text>}
            </View>
            <Text style={styles.checkIcon}>{c.icon}</Text>
            <Text style={styles.checkLabel}>{c.label}</Text>
          </TouchableOpacity>
        ))}

        <ShellInfoCard
          title="💡 Shell C-A-R Tracking Active"
          text="All responses map to Capacity, Achievement, and Relationships. Consistency across all three sections is critical — contradictions are flagged automatically."
          variant="brand"
          style={{ marginTop: 8 }}
        />

      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.btnPrimary, !allChecked && styles.btnDisabled]}
          onPress={handleLaunch}
          activeOpacity={0.85}
        >
          <Text style={styles.btnText}>
            {allChecked ? 'Launch 40-Min Simulation ⏱️' : `Tick all ${CHECKLIST.filter(c => !checked[c.id]).length} remaining checks`}
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
  badge:   { marginLeft: 'auto', backgroundColor: 'rgba(220,38,38,0.08)', borderWidth: 1, borderColor: 'rgba(220,38,38,0.2)', borderRadius: 999, paddingHorizontal: 10, paddingVertical: 3 },
  badgeText: { fontSize: 10, fontWeight: '700', color: '#DC2626', letterSpacing: 0.5 },
  title:   { fontSize: 26, fontWeight: '800', color: '#0F172A', lineHeight: 32, letterSpacing: -0.5, marginBottom: 6 },
  sub:     { fontSize: 13, color: '#475569', lineHeight: 20, marginBottom: 20 },
  infoCard:{ marginBottom: 20 },
  secLabel:{ fontSize: 10, fontWeight: '700', color: '#94A3B8', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 10, marginTop: 8 },
  checkRow:{ backgroundColor: '#fff', borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 14, padding: 14, flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 10 },
  checkBox:{ width: 20, height: 20, borderRadius: 6, borderWidth: 1.5, borderColor: '#CBD5E1', backgroundColor: '#F1F5F9', alignItems: 'center', justifyContent: 'center' },
  checkBoxDone: { backgroundColor: '#D1FAE5', borderColor: '#059669' },
  checkTick:    { fontSize: 11, color: '#059669', fontWeight: '800' },
  checkIcon:    { fontSize: 18 },
  checkLabel:   { fontSize: 13, fontWeight: '500', color: '#0F172A', flex: 1 },
  footer:       { padding: 20, paddingBottom: 28, backgroundColor: '#F8FAFC', borderTopWidth: 1, borderTopColor: '#E2E8F0' },
  btnPrimary:   { backgroundColor: '#1D4ED8', borderRadius: 999, paddingVertical: 15, alignItems: 'center', shadowColor: '#1D4ED8', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.28, shadowRadius: 12, elevation: 6 },
  btnDisabled:  { backgroundColor: '#94A3B8', shadowOpacity: 0 },
  btnText:      { fontSize: 15, fontWeight: '700', color: '#fff' },
});
