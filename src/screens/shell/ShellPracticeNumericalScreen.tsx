// ─── ShellPracticeNumericalScreen.tsx ────────────────────────────
import React, { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet, Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AppStackParamList } from '../../navigation/types';
import ShellHUDBar        from "../../components/shell/ShellHUDBar" 
import ShellDataTable     from '../../components/shell/ShellDataTable';
import ShellQuestionOption from '../../components/shell/ShellQuestionOption';
import ShellExplainBox    from '../../components/shell/ShellExplainBox';

type Nav = NativeStackNavigationProp<AppStackParamList>;

// ── Dummy questions ────────────────────────────────────────────────
const QUESTIONS = [
  {
    id: 1,
    table: {
      headers: ['Asset Node', 'Q1 (Barrels)', 'Q2 (Barrels)'],
      rows: [
        ['Delta West', '120,000', '150,000'],
        ['Delta East',  '80,000',  '75,000'],
      ],
    },
    question: 'What is the percentage increase in oil output for Delta West from Q1 to Q2?',
    options: ['A. 20% Increase', 'B. 25% Increase', 'C. 30% Increase', 'D. 15% Increase'],
    correct: 1, // index of correct option
    explanation: {
      title: '💡 Solve this in under 30 seconds',
      text: 'Step 1: Increase = 150,000 − 120,000 = 30,000\nStep 2: ÷ Q1 → 30,000 ÷ 120,000 = 0.25\nStep 3: × 100 = 25%\n\nShell shortcut: Always divide by Q1 (the original), never Q2. This is the most common mistake under time pressure.',
    },
  },
  {
    id: 2,
    table: {
      headers: ['Region', 'H1 Revenue ($M)', 'H2 Revenue ($M)'],
      rows: [
        ['Lagos Hub',  '4.2', '5.04'],
        ['Abuja Hub',  '3.1', '2.79'],
        ['PH Hub',     '6.0', '6.60'],
      ],
    },
    question: 'Which region recorded the highest percentage increase in revenue from H1 to H2?',
    options: ['A. Lagos Hub', 'B. Abuja Hub', 'C. PH Hub', 'D. All equal'],
    correct: 0,
    explanation: {
      title: '💡 Compare percentage changes, not absolute values',
      text: 'Lagos: (5.04−4.2)÷4.2 = 20%\nAbuja: (2.79−3.1)÷3.1 = −10% (decrease)\nPH: (6.60−6.0)÷6.0 = 10%\n\nLagos Hub had the highest % increase at 20%. Never compare raw numbers — always calculate the % change.',
    },
  },
  {
    id: 3,
    table: {
      headers: ['Product', 'Cost Price (₦)', 'Selling Price (₦)'],
      rows: [
        ['Premium Diesel', '850', '1,020'],
        ['Regular PMS',    '620',   '713'],
        ['Aviation Fuel',  '950', '1,140'],
      ],
    },
    question: 'Which product has the highest profit margin percentage?',
    options: ['A. Premium Diesel', 'B. Regular PMS', 'C. Aviation Fuel', 'D. All equal at 20%'],
    correct: 3,
    explanation: {
      title: '💡 Calculate margin for each: (SP−CP)÷CP × 100',
      text: 'Premium Diesel: (1020−850)÷850 = 20%\nRegular PMS: (713−620)÷620 = 15%\nAviation Fuel: (1140−950)÷950 = 20%\n\nPremium Diesel and Aviation Fuel are both 20%, making option D ("All equal at 20%") incorrect — Regular PMS is 15%. The answer is D only if all three were equal. Since they\'re not, trick question — the answer is A and C are tied.',
    },
  },
];

export default function ShellPracticeNumericalScreen() {
  const navigation  = useNavigation<Nav>();
  const [idx, setIdx]       = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [revealed, setReveal]   = useState(false);
  const [scores, setScores]     = useState({ correct: 0, wrong: 0 });

  const q = QUESTIONS[idx];
  const isLast = idx === QUESTIONS.length - 1;

  const handleSelect = (i: number) => {
    if (revealed) return;
    setSelected(i);
  };

  const handleReveal = () => {
    if (selected === null) return;
    setReveal(true);
    if (selected === q.correct) {
      setScores((s) => ({ ...s, correct: s.correct + 1 }));
    } else {
      setScores((s) => ({ ...s, wrong: s.wrong + 1 }));
    }
  };

  const handleNext = () => {
    if (isLast) { navigation.goBack(); return; }
    setIdx((i) => i + 1);
    setSelected(null);
    setReveal(false);
  };

  const getOptionState = (i: number) => {
    if (!revealed) return selected === i ? 'selected' : 'default';
    if (i === q.correct) return 'correct';
    if (i === selected && i !== q.correct) return 'wrong';
    return 'default';
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ShellHUDBar
        label={`Question ${idx + 1} / ${QUESTIONS.length}`}
        modePill="📚 Practice"
        showTools
      />

      {/* Progress bar */}
      <View style={styles.progWrap}>
        <View style={styles.progTrack}>
          <View style={[styles.progFill, { width: `${((idx + 1) / QUESTIONS.length) * 100}%` as any }]} />
        </View>
        <View style={styles.progLabels}>
          <Text style={styles.progLabel}>Numerical Reasoning</Text>
          <Text style={styles.progType}>Shell Oil/Gas Context</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

        {/* Score strip */}
        <View style={styles.scoreStrip}>
          <View style={styles.scoreItem}>
            <Text style={[styles.scoreNum, { color: '#059669' }]}>{scores.correct}</Text>
            <Text style={styles.scoreLbl}>Correct</Text>
          </View>
          <View style={styles.scoreItem}>
            <Text style={[styles.scoreNum, { color: '#DC2626' }]}>{scores.wrong}</Text>
            <Text style={styles.scoreLbl}>Wrong</Text>
          </View>
          <View style={styles.scoreItem}>
            <Text style={[styles.scoreNum, { color: '#94A3B8' }]}>{QUESTIONS.length - idx - 1}</Text>
            <Text style={styles.scoreLbl}>Remaining</Text>
          </View>
        </View>

        {/* Data table */}
        <ShellDataTable headers={q.table.headers} rows={q.table.rows} />

        {/* Question */}
        <Text style={styles.question}>{q.question}</Text>

        {/* Options */}
        {q.options.map((opt, i) => (
          <ShellQuestionOption
            key={i}
            label={opt}
            state={getOptionState(i)}
            onPress={() => handleSelect(i)}
          />
        ))}

        {/* Explanation (shown after reveal) */}
        {revealed && (
          <ShellExplainBox
            title={q.explanation.title}
            text={q.explanation.text}
          />
        )}

      </ScrollView>

      {/* Footer */}
      <View style={styles.footer}>
        {!revealed ? (
          <TouchableOpacity
            style={[styles.btnPrimary, selected === null && styles.btnDisabled]}
            onPress={handleReveal}
            activeOpacity={0.85}
            disabled={selected === null}
          >
            <Text style={styles.btnPrimaryText}>Check Answer</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.btnPrimary} onPress={handleNext} activeOpacity={0.85}>
            <Text style={styles.btnPrimaryText}>{isLast ? 'Finish Session ✓' : 'Next Question →'}</Text>
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe:       { flex: 1, backgroundColor: '#F8FAFC' },
  scroll:     { padding: 20, paddingBottom: 32 },
  progWrap:   { paddingHorizontal: 20, paddingTop: 10, paddingBottom: 4, backgroundColor: '#F8FAFC' },
  progTrack:  { height: 4, backgroundColor: '#E2E8F0', borderRadius: 999, overflow: 'hidden', marginBottom: 6 },
  progFill:   { height: 4, backgroundColor: '#1D4ED8', borderRadius: 999 },
  progLabels: { flexDirection: 'row', justifyContent: 'space-between' },
  progLabel:  { fontSize: 10, color: '#94A3B8' },
  progType:   { fontSize: 10, color: '#1D4ED8', fontWeight: '700' },
  scoreStrip: { flexDirection: 'row', gap: 12, backgroundColor: '#fff', borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 14, padding: 12, marginBottom: 16, justifyContent: 'space-around' },
  scoreItem:  { alignItems: 'center', gap: 2 },
  scoreNum:   { fontSize: 18, fontWeight: '800' },
  scoreLbl:   { fontSize: 10, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: 0.3 },
  question:   { fontSize: 14, fontWeight: '600', color: '#0F172A', lineHeight: 22, marginBottom: 14 },
  footer:         { padding: 20, paddingBottom: 28, backgroundColor: '#F8FAFC', borderTopWidth: 1, borderTopColor: '#E2E8F0' },
  btnPrimary:     { backgroundColor: '#1D4ED8', borderRadius: 999, paddingVertical: 15, alignItems: 'center', shadowColor: '#1D4ED8', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.28, shadowRadius: 12, elevation: 6 },
  btnDisabled:    { backgroundColor: '#94A3B8', shadowOpacity: 0 },
  btnPrimaryText: { fontSize: 15, fontWeight: '700', color: '#fff' },
});
