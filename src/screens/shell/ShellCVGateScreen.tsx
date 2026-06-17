// ─── ShellCVGateScreen.tsx ────────────────────────────────────────
import React, { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import * as DocumentPicker from 'expo-document-picker';
import { AppStackParamList } from '../../navigation/types';
import ShellCheckItem from '../../components/shell/ShellCheckItem';
import ShellInfoCard from '../../components/shell/ShellInfoCard';
// import ShellCheckItem from '../components/ShellCheckItem';
// import ShellInfoCard  from '../components/ShellInfoCard';

// ShellInfoCard

// ShellCheckItem

type Nav = NativeStackNavigationProp<AppStackParamList>;

// ── Dummy data ─────────────────────────────────────────────────────
const STREAMS = [
  'Technical Engineering & Operations',
  'Commercial & Business Strategy',
  'Finance & Corporate Services',
  'IT & Data Science',
];

const CHECKLIST = [
  {
    id: 'nysc',
    title: 'NYSC Status Stated',
    desc: "Discharge/exemption certificate must be clearly declared. Shell's ATS auto-rejects applications missing this.",
    done: true,
  },
  {
    id: 'keywords',
    title: 'Stream Keyword Match',
    desc: 'CV must contain domain-specific keywords matching your selected career stream to pass the ATS filter.',
    done: false,
  },
  {
    id: 'dates',
    title: 'Clean Date Format',
    desc: 'Use YYYY–YYYY format so experience duration is parsed correctly by Shells applicant tracking system.',
    done: false,
  },
  {
    id: 'photo',
    title: 'No Photo or Personal Info at Top',
    desc: 'Remove date of birth, state of origin, religion, and photos. Shells ATS scores these as formatting errors.',
    done: false,
  },
];

const ATS_TIPS = [
  { icon: '✅', tip: 'Use a single-column layout — multi-column breaks ATS parsing.' },
  { icon: '✅', tip: 'Keep file under 2MB and use standard fonts (Arial, Calibri).' },
  { icon: '⚠️', tip: 'Avoid tables, text boxes, and graphics — they confuse ATS engines.' },
  { icon: '⚠️', tip: 'Use standard section headers: "Work Experience", "Education", not custom names.' },
];

export default function ShellCVGateScreen() {
  const navigation = useNavigation<Nav>();
  const [cvFile, setCVFile]         = useState<string | null>(null);
  const [stream, setStream]         = useState(STREAMS[0]);
  const [showStreams, setShowStreams]= useState(false);
  const [checklist, setChecklist]   = useState(CHECKLIST);

  const pickCV = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({ type: 'application/pdf' });
      if (!result.canceled && result.assets?.[0]) {
        setCVFile(result.assets[0].name);
      }
    } catch {
      Alert.alert('Error', 'Could not open file picker.');
    }
  };

  const toggleCheck = (id: string) => {
    setChecklist((prev) => prev.map((c) => c.id === id ? { ...c, done: !c.done } : c));
  };

  const doneCount = checklist.filter((c) => c.done).length;
  const allDone   = doneCount === checklist.length;

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

        {/* Back row */}
        <View style={styles.backRow}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.backBtn}>← Shell Track</Text>
          </TouchableOpacity>
          <View style={styles.badge}><Text style={styles.badgeText}>STAGE 1</Text></View>
        </View>

        <Text style={styles.title}>Profile &{'\n'}CV Check</Text>
        <Text style={styles.sub}>Shell's ATS auto-rejects 40% of applicants before any human sees a CV. Fix that now.</Text>

        {/* Upload zone */}
        <TouchableOpacity style={styles.uploadZone} onPress={pickCV} activeOpacity={0.8}>
          <Text style={styles.uploadIcon}>{cvFile ? '📄' : '📤'}</Text>
          {cvFile ? (
            <>
              <Text style={styles.uploadTitle}>{cvFile}</Text>
              <Text style={styles.uploadMeta}>Tap to replace</Text>
            </>
          ) : (
            <>
              <Text style={styles.uploadTitle}>Upload your CV</Text>
              <Text style={styles.uploadMeta}>PDF preferred · Max 5MB</Text>
            </>
          )}
        </TouchableOpacity>

        {/* Stream selector */}
        <Text style={styles.secLabel}>Career Stream</Text>
        <TouchableOpacity
          style={styles.selector}
          onPress={() => setShowStreams(!showStreams)}
          activeOpacity={0.8}
        >
          <Text style={styles.selectorText}>{stream}</Text>
          <Text style={styles.selectorArrow}>{showStreams ? '▲' : '▼'}</Text>
        </TouchableOpacity>
        {showStreams && (
          <View style={styles.dropdown}>
            {STREAMS.map((s) => (
              <TouchableOpacity
                key={s}
                style={[styles.dropdownItem, s === stream && styles.dropdownItemActive]}
                onPress={() => { setStream(s); setShowStreams(false); }}
              >
                <Text style={[styles.dropdownText, s === stream && styles.dropdownTextActive]}>{s}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Checklist */}
        <View style={styles.checkHeader}>
          <Text style={styles.secLabel}>Mandatory Checks</Text>
          <Text style={styles.checkCount}>{doneCount}/{checklist.length} done</Text>
        </View>

        {checklist.map((c) => (
          <TouchableOpacity key={c.id} onPress={() => toggleCheck(c.id)} activeOpacity={0.8}>
            <ShellCheckItem title={c.title} desc={c.desc} done={c.done} />
          </TouchableOpacity>
        ))}

        {/* ATS Tips */}
        <Text style={[styles.secLabel, { marginTop: 8 }]}>ATS Formatting Tips</Text>
        <View style={styles.tipsCard}>
          {ATS_TIPS.map((t, i) => (
            <View key={i} style={[styles.tipRow, i < ATS_TIPS.length - 1 && styles.tipBorder]}>
              <Text style={styles.tipIcon}>{t.icon}</Text>
              <Text style={styles.tipText}>{t.tip}</Text>
            </View>
          ))}
        </View>

        {/* Info card */}
        <ShellInfoCard
          title="🇳🇬 Nigeria Regional Rule"
          text="Shell Nigeria explicitly checks for NYSC completion. Your application will be filtered before human review if your NYSC status is not clearly stated. This is a hard block — not optional."
          variant="red"
          style={{ marginTop: 4 }}
        />

      </ScrollView>

      {/* Footer */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.btnPrimary, !allDone && styles.btnDisabled]}
          onPress={() => navigation.navigate('ShellModeSelector' as any)}
          activeOpacity={0.85}
        >
          <Text style={styles.btnPrimaryText}>
            {allDone ? 'Save & Proceed to Stage 2 →' : `Complete all ${checklist.length - doneCount} remaining checks`}
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
  badge:   { marginLeft: 'auto', backgroundColor: 'rgba(29,78,216,0.08)', borderWidth: 1, borderColor: 'rgba(29,78,216,0.18)', borderRadius: 999, paddingHorizontal: 10, paddingVertical: 3 },
  badgeText: { fontSize: 10, fontWeight: '700', color: '#1D4ED8', letterSpacing: 0.5 },

  title: { fontSize: 26, fontWeight: '800', color: '#0F172A', lineHeight: 32, letterSpacing: -0.5, marginBottom: 6 },
  sub:   { fontSize: 13, color: '#475569', lineHeight: 20, marginBottom: 20 },
  secLabel: { fontSize: 10, fontWeight: '700', color: '#94A3B8', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 10 },

  // Upload
  uploadZone:  { backgroundColor: '#fff', borderWidth: 2, borderStyle: 'dashed', borderColor: '#CBD5E1', borderRadius: 18, padding: 28, alignItems: 'center', marginBottom: 20 },
  uploadIcon:  { fontSize: 28, marginBottom: 10 },
  uploadTitle: { fontSize: 13, fontWeight: '600', color: '#0F172A', marginBottom: 3 },
  uploadMeta:  { fontSize: 11, color: '#94A3B8' },

  // Selector
  selector:      { backgroundColor: '#fff', borderWidth: 1, borderColor: '#CBD5E1', borderRadius: 12, padding: 14, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
  selectorText:  { fontSize: 13, color: '#0F172A', flex: 1 },
  selectorArrow: { fontSize: 12, color: '#94A3B8' },

  // Dropdown
  dropdown:          { backgroundColor: '#fff', borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 12, overflow: 'hidden', marginBottom: 16 },
  dropdownItem:      { padding: 14, borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
  dropdownItemActive:{ backgroundColor: '#EFF6FF' },
  dropdownText:      { fontSize: 13, color: '#0F172A' },
  dropdownTextActive:{ color: '#1D4ED8', fontWeight: '600' },

  // Checklist header
  checkHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  checkCount:  { fontSize: 12, fontWeight: '700', color: '#1D4ED8' },

  // Tips
  tipsCard:  { backgroundColor: '#fff', borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 14, padding: 14, marginBottom: 12 },
  tipRow:    { flexDirection: 'row', gap: 10, paddingVertical: 8, alignItems: 'flex-start' },
  tipBorder: { borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
  tipIcon:   { fontSize: 14, marginTop: 1 },
  tipText:   { fontSize: 12, color: '#475569', flex: 1, lineHeight: 18 },

  // Footer
  footer:         { padding: 20, paddingBottom: 28, backgroundColor: '#F8FAFC', borderTopWidth: 1, borderTopColor: '#E2E8F0' },
  btnPrimary:     { backgroundColor: '#1D4ED8', borderRadius: 999, paddingVertical: 15, alignItems: 'center', shadowColor: '#1D4ED8', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.28, shadowRadius: 12, elevation: 6 },
  btnDisabled:    { backgroundColor: '#94A3B8', shadowOpacity: 0 },
  btnPrimaryText: { fontSize: 15, fontWeight: '700', color: '#fff' },
});
