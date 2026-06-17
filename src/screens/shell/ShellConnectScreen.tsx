// ─── ShellConnectScreen.tsx ───────────────────────────────────────
import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AppStackParamList } from '../../navigation/types';
import ShellStageCard from '../../components/shell/ShellStageCard';
import ShellInfoCard  from '../../components/shell/ShellInfoCard';

type Nav = NativeStackNavigationProp<AppStackParamList>;

const WHAT_HAPPENS = [
  { emoji: '🏢', name: 'Office Tour', meta: 'See Shell\'s operations. Ask smart questions.', iconBg: '#EFF6FF' },
  { emoji: '🤝', name: 'Meet Your Future Manager', meta: 'Informal conversation. They\'re assessing fit, not grilling you.', iconBg: '#D1FAE5' },
  { emoji: '🎤', name: 'Live Behavioural Interview', meta: '40 minutes · Full CAR assessment · STAR answers expected', iconBg: '#FEF3C7' },
];

const SMART_QUESTIONS = [
  { q: '"What does success look like in the first 90 days for a graduate trainee on this track?"', why: 'Shows you\'re thinking about performance, not just getting the job.' },
  { q: '"How does Shell support graduate trainees transitioning from academic to operational thinking?"', why: 'Signals humility and learning orientation — two things Shell values heavily.' },
  { q: '"What\'s the biggest energy transition challenge your team is working on right now?"', why: 'Demonstrates you\'ve researched Shell\'s current strategic priorities.' },
  { q: '"How do you see this role evolving over the next 2-3 years given the energy transition?"', why: 'Shows long-term thinking and commitment to Shell\'s mission.' },
];

const DO_DONTS = [
  { type: 'do',   text: 'Arrive 10-15 minutes early — not 30.' },
  { type: 'do',   text: 'Address interviewers by name — note them when introduced.' },
  { type: 'do',   text: 'Bring a printed copy of your CV and case study notes.' },
  { type: 'dont', text: 'Don\'t check your phone during tours or between sessions.' },
  { type: 'dont', text: 'Don\'t speak negatively about previous employers or colleagues.' },
  { type: 'dont', text: 'Don\'t ask about salary, leave, or benefits at this stage.' },
];

export default function ShellConnectScreen() {
  const navigation = useNavigation<Nav>();
  const [openQ, setOpenQ] = useState<number | null>(null);

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

        <View style={styles.backRow}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.backBtn}>← Case Study</Text>
          </TouchableOpacity>
          <View style={styles.badge}><Text style={styles.badgeText}>STAGE 4</Text></View>
        </View>

        <Text style={styles.title}>Shell Connect{'\n'}Office Visit</Text>
        <Text style={styles.sub}>You made it. Shell invites you to visit their office, meet the team, and do a final live interview. Here's how to nail it.</Text>

        <ShellInfoCard
          title="✅ You're Almost There"
          text="Shell Connect candidates have already passed cognitive, behavioral, and video screening. The office visit is about culture fit and confirming you're the person in your application. Be yourself — that's who passed."
          variant="green"
          style={styles.infoCard}
        />

        {/* What happens */}
        <Text style={styles.secLabel}>What Happens on the Day</Text>
        {WHAT_HAPPENS.map((w) => (
          <ShellStageCard
            key={w.name}
            emoji={w.emoji}
            name={w.name}
            meta={w.meta}
            status="active"
            iconBg={w.iconBg}
          />
        ))}

        {/* Smart questions */}
        <Text style={styles.secLabel}>Smart Questions to Ask Shell</Text>
        {SMART_QUESTIONS.map((q, i) => (
          <TouchableOpacity
            key={i}
            style={styles.questionCard}
            onPress={() => setOpenQ(openQ === i ? null : i)}
            activeOpacity={0.8}
          >
            <View style={styles.questionTop}>
              <Text style={styles.questionText}>{q.q}</Text>
              <Text style={styles.questionArrow}>{openQ === i ? '▲' : '▼'}</Text>
            </View>
            {openQ === i && (
              <View style={styles.whyBox}>
                <Text style={styles.whyLabel}>WHY THIS WORKS</Text>
                <Text style={styles.whyText}>{q.why}</Text>
              </View>
            )}
          </TouchableOpacity>
        ))}

        {/* Do's and Don'ts */}
        <Text style={styles.secLabel}>Day-Of Etiquette</Text>
        {DO_DONTS.map((d, i) => (
          <View key={i} style={[styles.doCard, d.type === 'dont' && styles.dontCard]}>
            <Text style={[styles.doIcon, d.type === 'dont' && styles.dontIcon]}>
              {d.type === 'do' ? '✓' : '✗'}
            </Text>
            <Text style={[styles.doText, d.type === 'dont' && styles.dontText]}>{d.text}</Text>
          </View>
        ))}

      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.btnPrimary}
          onPress={() => navigation.navigate('ShellProgress' as any)}
          activeOpacity={0.85}
        >
          <Text style={styles.btnText}>View Overall Progress →</Text>
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
  badge:   { marginLeft: 'auto', backgroundColor: '#EDE9FE', borderWidth: 1, borderColor: 'rgba(124,58,237,0.2)', borderRadius: 999, paddingHorizontal: 10, paddingVertical: 3 },
  badgeText: { fontSize: 10, fontWeight: '700', color: '#7C3AED', letterSpacing: 0.5 },
  title:   { fontSize: 26, fontWeight: '800', color: '#0F172A', lineHeight: 32, letterSpacing: -0.5, marginBottom: 6 },
  sub:     { fontSize: 13, color: '#475569', lineHeight: 20, marginBottom: 20 },
  infoCard:{ marginBottom: 20 },
  secLabel:{ fontSize: 10, fontWeight: '700', color: '#94A3B8', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 10, marginTop: 8 },
  questionCard: { backgroundColor: '#fff', borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 14, padding: 14, marginBottom: 10 },
  questionTop:  { flexDirection: 'row', gap: 10, alignItems: 'flex-start' },
  questionText: { fontSize: 13, fontWeight: '600', color: '#0F172A', lineHeight: 20, flex: 1, fontStyle: 'italic' },
  questionArrow:{ fontSize: 12, color: '#94A3B8', marginTop: 2 },
  whyBox:       { backgroundColor: '#EFF6FF', borderRadius: 10, padding: 10, marginTop: 10 },
  whyLabel:     { fontSize: 9, fontWeight: '700', color: '#1D4ED8', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 5 },
  whyText:      { fontSize: 12, color: '#1D4ED8', lineHeight: 18 },
  doCard:  { backgroundColor: '#D1FAE5', borderRadius: 12, padding: 12, flexDirection: 'row', gap: 10, alignItems: 'center', marginBottom: 8 },
  dontCard:{ backgroundColor: '#FEF2F2' },
  doIcon:  { fontSize: 16, color: '#059669', fontWeight: '800', width: 20 },
  dontIcon:{ color: '#DC2626' },
  doText:  { fontSize: 13, color: '#065F46', flex: 1, lineHeight: 18 },
  dontText:{ color: '#991B1B' },
  footer:  { padding: 20, paddingBottom: 28, backgroundColor: '#F8FAFC', borderTopWidth: 1, borderTopColor: '#E2E8F0' },
  btnPrimary: { backgroundColor: '#1D4ED8', borderRadius: 999, paddingVertical: 15, alignItems: 'center', shadowColor: '#1D4ED8', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.28, shadowRadius: 12, elevation: 6 },
  btnText:    { fontSize: 15, fontWeight: '700', color: '#fff' },
});
