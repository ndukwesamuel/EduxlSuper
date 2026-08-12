// ─── ShellExamCognitiveScreen.tsx ────────────────────────────────
import React, { useState, useEffect, useRef } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AppStackParamList } from '../../navigation/types';
import ShellHUDBar         from '../../components/shell/ShellHUDBar';
import ShellDataTable      from '../../components/shell/ShellDataTable';
import ShellQuestionOption from '../../components/shell/ShellQuestionOption';

type Nav = NativeStackNavigationProp<AppStackParamList>;

// ── Dummy exam questions (mixed numerical/verbal/abstract) ─────────
const QUESTIONS = [
  {
    id: 1, type: 'numerical',
    table: { headers: ['Asset', 'Q1 (Barrels)', 'Q2 (Barrels)'], rows: [['Delta West','120,000','150,000'],['Delta East','80,000','75,000']] },
    question: 'What is the percentage increase in output for Delta West from Q1 to Q2?',
    options: ['A. 20%', 'B. 25%', 'C. 30%', 'D. 15%'], correct: 1,
  },
  {
    id: 2, type: 'verbal',
    passage: 'Shell\'s CAR framework evaluates Capacity, Achievement, and Relationships. Candidates who score highly on Capacity but poorly on Relationships are rarely progressed to the final assessment stage.',
    question: 'A candidate with exceptional cognitive scores but low Relationships scores will progress to the final stage.',
    options: ['True', 'False', 'Cannot Say'], correct: 1,
  },
  {
    id: 3, type: 'numerical',
    table: { headers: ['Region', 'H1 ($M)', 'H2 ($M)'], rows: [['Lagos','4.2','5.04'],['Abuja','3.1','2.79'],['PH','6.0','6.60']] },
    question: 'Which region recorded the highest percentage revenue increase from H1 to H2?',
    options: ['A. Lagos Hub', 'B. Abuja Hub', 'C. PH Hub', 'D. All equal'], correct: 0,
  },
  {
    id: 4, type: 'abstract',
    question: 'Arrow sequence: ↑ → ↓ ? — What comes next? (90° clockwise rotation each step)',
    options: ['A. ↗', 'B. ←', 'C. ↑', 'D. ↙'], correct: 1,
  },
  {
    id: 5, type: 'verbal',
    passage: 'Nigeria\'s oil sector contributed 86% of export earnings last quarter. The Federal Government has announced plans to diversify into agriculture and technology over the next decade.',
    question: 'The government plans to reduce oil exports by 50% within ten years.',
    options: ['True', 'False', 'Cannot Say'], correct: 2,
  },
];

const TOTAL_TIME = 12 * 60; // 12 minutes in seconds

export default function ShellExamCognitiveScreen() {
  const navigation = useNavigation<Nav>();
  const [idx, setIdx]           = useState(0);
  const [answers, setAnswers]   = useState<Record<number, number | null>>({});
  const [flagged, setFlagged]   = useState<Record<number, boolean>>({});
  const [timeLeft, setTimeLeft] = useState(TOTAL_TIME);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const q        = QUESTIONS[idx];
  const selected = answers[idx] ?? null;
  const isLast   = idx === QUESTIONS.length - 1;

  // Timer
  useEffect(() => {
    timerRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(timerRef.current!);
          handleFinish();
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, []);

  const formatTime = (s: number) =>
    `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;

  const handleSelect = (i: number) => {
    setAnswers((prev) => ({ ...prev, [idx]: i }));
  };

  const handleFlag = () => {
    setFlagged((prev) => ({ ...prev, [idx]: !prev[idx] }));
  };

  const handleNext = () => {
    if (isLast) { handleFinish(); return; }
    setIdx((i) => i + 1);
  };

  const handleFinish = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    const correct = QUESTIONS.filter((q, i) => answers[i] === q.correct).length;
    navigation.navigate('ShellExamBehavioral' as any, { cogScore: correct } as any);
  };

  const timeColor = timeLeft < 120 ? '#DC2626' : timeLeft < 300 ? '#D97706' : '#EA580C';

  return (
    <SafeAreaView style={styles.safe}>
      <ShellHUDBar
        label={`Q ${idx + 1} / ${QUESTIONS.length}`}
        timer={formatTime(timeLeft)}
        showTools
      />

      {/* Progress */}
      <View style={styles.progWrap}>
        <View style={styles.progTrack}>
          <View style={[styles.progFill, { width: `${((idx + 1) / QUESTIONS.length) * 100}%` as any }]} />
        </View>
        <View style={styles.statRow}>
          <Text style={styles.statText}>✓ {Object.values(answers).filter(v => v !== null).length} answered</Text>
          <Text style={styles.statText}>🚩 {Object.values(flagged).filter(Boolean).length} flagged</Text>
          <Text style={[styles.statText, { color: timeColor }]}>⏱ {formatTime(timeLeft)}</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

        {/* Type badge */}
        <View style={styles.typeBadge}>
          <Text style={styles.typeBadgeText}>{q.type.toUpperCase()}</Text>
        </View>

        {/* Table (numerical) */}
        {q.type === 'numerical' && q.table && (
          <ShellDataTable headers={q.table.headers} rows={q.table.rows} />
        )}

        {/* Passage (verbal) */}
        {q.type === 'verbal' && q.passage && (
          <View style={styles.passageCard}>
            <Text style={styles.passageText}>"{q.passage}"</Text>
          </View>
        )}

        {/* Question */}
        <Text style={styles.question}>{q.question}</Text>

        {/* Options — no correct/wrong shown in exam mode */}
        {q.options.map((opt, i) => (
          <ShellQuestionOption
            key={i}
            label={opt}
            state={selected === i ? 'selected' : 'default'}
            onPress={() => handleSelect(i)}
          />
        ))}

        {flagged[idx] && (
          <View style={styles.flaggedBanner}>
            <Text style={styles.flaggedText}>🚩 This question is flagged for review</Text>
          </View>
        )}

      </ScrollView>

      <View style={styles.footer}>
        <View style={styles.footerRow}>
          <TouchableOpacity
            style={[styles.btnFlag, flagged[idx] && styles.btnFlagged]}
            onPress={handleFlag}
            activeOpacity={0.8}
          >
            <Text style={styles.btnFlagText}>{flagged[idx] ? '🚩 Flagged' : '🚩 Flag'}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.btnNext} onPress={handleNext} activeOpacity={0.85}>
            <Text style={styles.btnNextText}>{isLast ? 'Finish →' : 'Next →'}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe:      { flex: 1, backgroundColor: '#F8FAFC' },
  scroll:    { padding: 20, paddingBottom: 32 },
  progWrap:  { paddingHorizontal: 20, paddingTop: 8, paddingBottom: 8, backgroundColor: '#F8FAFC', borderBottomWidth: 1, borderBottomColor: '#E2E8F0' },
  progTrack: { height: 4, backgroundColor: '#E2E8F0', borderRadius: 999, overflow: 'hidden', marginBottom: 6 },
  progFill:  { height: 4, backgroundColor: '#1D4ED8', borderRadius: 999 },
  statRow:   { flexDirection: 'row', justifyContent: 'space-between' },
  statText:  { fontSize: 10, color: '#94A3B8', fontWeight: '600' },
  typeBadge: { backgroundColor: '#EFF6FF', borderRadius: 8, paddingHorizontal: 10, paddingVertical: 4, alignSelf: 'flex-start', marginBottom: 12 },
  typeBadgeText: { fontSize: 10, fontWeight: '700', color: '#1D4ED8', textTransform: 'uppercase', letterSpacing: 0.5 },
  passageCard: { backgroundColor: '#fff', borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 14, padding: 14, marginBottom: 14 },
  passageText: { fontSize: 12, color: '#475569', lineHeight: 20, fontStyle: 'italic' },
  question:    { fontSize: 14, fontWeight: '600', color: '#0F172A', lineHeight: 22, marginBottom: 14 },
  flaggedBanner: { backgroundColor: '#FEF3C7', borderRadius: 10, padding: 10, marginTop: 4 },
  flaggedText:   { fontSize: 12, color: '#D97706', fontWeight: '600' },
  footer:    { padding: 20, paddingBottom: 28, backgroundColor: '#F8FAFC', borderTopWidth: 1, borderTopColor: '#E2E8F0' },
  footerRow: { flexDirection: 'row', gap: 10 },
  btnFlag:   { flex: 1, backgroundColor: '#fff', borderWidth: 1.5, borderColor: '#E2E8F0', borderRadius: 999, paddingVertical: 14, alignItems: 'center' },
  btnFlagged:{ backgroundColor: '#FEF3C7', borderColor: '#FDE68A' },
  btnFlagText:{ fontSize: 14, fontWeight: '700', color: '#475569' },
  btnNext:   { flex: 2, backgroundColor: '#1D4ED8', borderRadius: 999, paddingVertical: 14, alignItems: 'center', shadowColor: '#1D4ED8', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.25, shadowRadius: 10, elevation: 5 },
  btnNextText:{ fontSize: 15, fontWeight: '700', color: '#fff' },
});
