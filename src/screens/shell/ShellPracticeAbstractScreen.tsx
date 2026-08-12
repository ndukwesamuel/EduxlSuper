// ─── ShellPracticeAbstractScreen.tsx ─────────────────────────────
import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AppStackParamList } from '../../navigation/types';
import ShellHUDBar from '../../components/shell/ShellHUDBar';
import ShellExplainBox from '../../components/shell/ShellExplainBox';
// import ShellHUDBar    from '../components/ShellHUDBar';
// import ShellExplainBox from '../components/ShellExplainBox';
// ShellExplainBox



type Nav = NativeStackNavigationProp<AppStackParamList>;

// ── Dummy questions ────────────────────────────────────────────────
const QUESTIONS = [
  {
    id: 1,
    type: 'sequence',
    label: 'What arrow comes next in the sequence?',
    sequence: ['↑', '→', '↓', '?'],
    options: ['↗', '←', '↑', '↙'],
    correct: 1,
    rule: '90° clockwise rotation',
    explanation: {
      title: '💡 Rule: 90° clockwise rotation each step',
      text: '↑ → → → ↓ → ←\nEach box rotates exactly 90° clockwise.\n\nShell abstract tip: Pick ONE element to track first — in this case, direction. Eliminate wrong answers before committing. Never stare at the whole picture at once.',
    },
  },
  {
    id: 2,
    type: 'sequence',
    label: 'What shape comes next in the sequence?',
    sequence: ['■', '▲', '●', '■', '▲', '?'],
    options: ['■', '▲', '●', '▼'],
    correct: 2,
    rule: 'Repeating cycle: ■ ▲ ●',
    explanation: {
      title: '💡 Rule: Repeating 3-shape cycle',
      text: 'The pattern is: ■ → ▲ → ● → ■ → ▲ → ●\nAfter position 6 (▲), the next must be ● to complete the second cycle.\n\nTip: When you spot a repeat, count the cycle length first (here it\'s 3), then predict forward.',
    },
  },
  {
    id: 3,
    type: 'count',
    label: 'How many sides does the next shape have? (Pattern: sides increase by 1)',
    sequence: ['△', '□', '⬠', '⬡', '?'],
    options: ['A. 6 sides', 'B. 7 sides', 'C. 8 sides', 'D. 5 sides'],
    correct: 1,
    rule: 'Sides +1 each step: 3 → 4 → 5 → 6 → 7',
    explanation: {
      title: '💡 Rule: Count the sides — they increase by 1',
      text: '△ = 3 sides → □ = 4 → ⬠ = 5 → ⬡ = 6 → next = 7 sides\n\nWhen shapes change, always count specific attributes: sides, dots, shading %. This is the fastest way to decode Shell\'s abstract matrices.',
    },
  },
  {
    id: 4,
    type: 'shading',
    label: 'Which option correctly completes the pattern? (Shading moves one position clockwise each step)',
    sequence: ['◑', '◒', '◕', '?'],
    options: ['◉', '◐', '○', '●'],
    correct: 3,
    rule: 'Shading fills clockwise — next step is fully filled',
    explanation: {
      title: '💡 Rule: Shading fills clockwise quarter by quarter',
      text: '◑ (left half) → ◒ (right half) → ◕ (3 quarters) → ● (fully filled)\n\nThe shading adds one quarter clockwise each step. After 3/4 filled, the next is 4/4 = fully filled (●).\n\nTip: Track the shading percentage, not the direction of shading.',
    },
  },
];

// ── Shape sequence display component ──────────────────────────────
function ShapeSequence({ shapes, revealed }: { shapes: string[]; revealed: boolean }) {
  return (
    <View style={seqStyles.row}>
      {shapes.map((s, i) => {
        const isQuestion = s === '?';
        return (
          <View
            key={i}
            style={[
              seqStyles.box,
              isQuestion && seqStyles.boxQuestion,
              revealed && isQuestion && seqStyles.boxRevealed,
            ]}
          >
            <Text style={[seqStyles.shape, isQuestion && seqStyles.shapeQuestion]}>
              {s}
            </Text>
          </View>
        );
      })}
    </View>
  );
}

const seqStyles = StyleSheet.create({
  row:           { flexDirection: 'row', gap: 10, justifyContent: 'center', padding: 16 },
  box:           { width: 54, height: 54, backgroundColor: '#F1F5F9', borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  boxQuestion:   { backgroundColor: 'rgba(29,78,216,0.08)', borderWidth: 1.5, borderStyle: 'dashed', borderColor: '#1D4ED8' },
  boxRevealed:   { backgroundColor: '#D1FAE5', borderColor: '#059669', borderStyle: 'solid' },
  shape:         { fontSize: 26 },
  shapeQuestion: { fontSize: 18, fontWeight: '800', color: '#1D4ED8' },
});

// ── Option grid for abstract ───────────────────────────────────────
function AbstractOptions({
  options, selected, revealed, correct, onSelect,
}: {
  options: string[]; selected: number | null;
  revealed: boolean; correct: number;
  onSelect: (i: number) => void;
}) {
  const getBg = (i: number) => {
    if (!revealed) return selected === i ? 'rgba(29,78,216,0.08)' : '#fff';
    if (i === correct) return '#D1FAE5';
    if (i === selected && i !== correct) return '#FEF2F2';
    return '#fff';
  };
  const getBorder = (i: number) => {
    if (!revealed) return selected === i ? '#1D4ED8' : '#E2E8F0';
    if (i === correct) return '#059669';
    if (i === selected && i !== correct) return '#DC2626';
    return '#E2E8F0';
  };
  const getTextColor = (i: number) => {
    if (!revealed) return selected === i ? '#1D4ED8' : '#0F172A';
    if (i === correct) return '#059669';
    if (i === selected && i !== correct) return '#DC2626';
    return '#0F172A';
  };

  return (
    <View style={optStyles.grid}>
      {options.map((opt, i) => (
        <TouchableOpacity
          key={i}
          style={[optStyles.cell, { backgroundColor: getBg(i), borderColor: getBorder(i) }]}
          onPress={() => onSelect(i)}
          activeOpacity={0.75}
          disabled={revealed}
        >
          <Text style={[optStyles.optText, { color: getTextColor(i) }]}>
            {opt}
            {revealed && i === correct ? ' ✓' : ''}
            {revealed && i === selected && i !== correct ? ' ✗' : ''}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const optStyles = StyleSheet.create({
  grid:    { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 14 },
  cell:    { width: '47%', borderWidth: 1.5, borderRadius: 14, paddingVertical: 18, alignItems: 'center', justifyContent: 'center' },
  optText: { fontSize: 22, fontWeight: '700' },
});

// ── Main screen ───────────────────────────────────────────────────
export default function ShellPracticeAbstractScreen() {
  const navigation = useNavigation<Nav>();
  const [idx, setIdx]           = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [revealed, setReveal]   = useState(false);
  const [scores, setScores]     = useState({ correct: 0, wrong: 0 });

  const q      = QUESTIONS[idx];
  const isLast = idx === QUESTIONS.length - 1;

  const handleReveal = () => {
    if (selected === null) return;
    setReveal(true);
    if (selected === q.correct) setScores((s) => ({ ...s, correct: s.correct + 1 }));
    else setScores((s) => ({ ...s, wrong: s.wrong + 1 }));
  };

  const handleNext = () => {
    if (isLast) { navigation.goBack(); return; }
    setIdx((i) => i + 1);
    setSelected(null);
    setReveal(false);
  };

  // Build sequence with answer revealed
  const displaySequence = revealed
    ? q.sequence.map((s) => s === '?' ? q.options[q.correct] : s)
    : q.sequence;

  return (
    <SafeAreaView style={styles.safe}>
      <ShellHUDBar label={`Question ${idx + 1} / ${QUESTIONS.length}`} modePill="📚 Practice" />

      <View style={styles.progWrap}>
        <View style={styles.progTrack}>
          <View style={[styles.progFill, { width: `${((idx + 1) / QUESTIONS.length) * 100}%` as any }]} />
        </View>
        <View style={styles.progRow}>
          <Text style={styles.progLabel}>Abstract Reasoning</Text>
          <Text style={styles.progType}>Shape Patterns</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

        {/* Score strip */}
        <View style={styles.scoreStrip}>
          <View style={styles.scoreItem}><Text style={[styles.scoreNum, { color: '#059669' }]}>{scores.correct}</Text><Text style={styles.scoreLbl}>Correct</Text></View>
          <View style={styles.scoreItem}><Text style={[styles.scoreNum, { color: '#DC2626' }]}>{scores.wrong}</Text><Text style={styles.scoreLbl}>Wrong</Text></View>
          <View style={styles.scoreItem}><Text style={[styles.scoreNum, { color: '#94A3B8' }]}>{QUESTIONS.length - idx - 1}</Text><Text style={styles.scoreLbl}>Left</Text></View>
        </View>

        {/* Tip */}
        <View style={styles.tipCard}>
          <Text style={styles.tipText}>💡 Pick ONE element to track — rotation, shading, count. Eliminate options before committing.</Text>
        </View>

        {/* Question label */}
        <Text style={styles.question}>{q.label}</Text>

        {/* Shape sequence */}
        <View style={styles.sequenceCard}>
          <ShapeSequence shapes={displaySequence} revealed={revealed} />
          {revealed && (
            <View style={styles.ruleTag}>
              <Text style={styles.ruleText}>✓ Rule: {q.rule}</Text>
            </View>
          )}
        </View>

        {/* Option grid */}
        <Text style={styles.chooseLabel}>Choose what replaces the ?</Text>
        <AbstractOptions
          options={q.options}
          selected={selected}
          revealed={revealed}
          correct={q.correct}
          onSelect={(i) => { if (!revealed) setSelected(i); }}
        />

        {/* Explanation */}
        {revealed && <ShellExplainBox title={q.explanation.title} text={q.explanation.text} />}

      </ScrollView>

      <View style={styles.footer}>
        {!revealed ? (
          <TouchableOpacity style={[styles.btnPrimary, selected === null && styles.btnDisabled]} onPress={handleReveal} disabled={selected === null} activeOpacity={0.85}>
            <Text style={styles.btnText}>Check Answer</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.btnPrimary} onPress={handleNext} activeOpacity={0.85}>
            <Text style={styles.btnText}>{isLast ? 'Finish Session ✓' : 'Next Question →'}</Text>
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe:     { flex: 1, backgroundColor: '#F8FAFC' },
  scroll:   { padding: 20, paddingBottom: 32 },
  progWrap: { paddingHorizontal: 20, paddingTop: 10, paddingBottom: 4, backgroundColor: '#F8FAFC' },
  progTrack:{ height: 4, backgroundColor: '#E2E8F0', borderRadius: 999, overflow: 'hidden', marginBottom: 6 },
  progFill: { height: 4, backgroundColor: '#1D4ED8', borderRadius: 999 },
  progRow:  { flexDirection: 'row', justifyContent: 'space-between' },
  progLabel:{ fontSize: 10, color: '#94A3B8' },
  progType: { fontSize: 10, color: '#1D4ED8', fontWeight: '700' },

  scoreStrip: { flexDirection: 'row', backgroundColor: '#fff', borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 14, padding: 12, marginBottom: 14, justifyContent: 'space-around' },
  scoreItem:  { alignItems: 'center', gap: 2 },
  scoreNum:   { fontSize: 18, fontWeight: '800' },
  scoreLbl:   { fontSize: 10, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: 0.3 },

  tipCard:  { backgroundColor: '#EFF6FF', borderRadius: 12, padding: 12, marginBottom: 14 },
  tipText:  { fontSize: 11, color: '#1D4ED8', lineHeight: 17 },

  question:  { fontSize: 14, fontWeight: '600', color: '#0F172A', lineHeight: 22, marginBottom: 12 },

  sequenceCard: { backgroundColor: '#fff', borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 16, marginBottom: 16 },
  ruleTag:      { alignItems: 'center', paddingBottom: 12 },
  ruleText:     { fontSize: 11, fontWeight: '700', color: '#059669', backgroundColor: '#D1FAE5', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 999 },

  chooseLabel: { fontSize: 11, fontWeight: '700', color: '#94A3B8', textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 10 },

  footer:     { padding: 20, paddingBottom: 28, backgroundColor: '#F8FAFC', borderTopWidth: 1, borderTopColor: '#E2E8F0' },
  btnPrimary: { backgroundColor: '#1D4ED8', borderRadius: 999, paddingVertical: 15, alignItems: 'center', shadowColor: '#1D4ED8', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.28, shadowRadius: 12, elevation: 6 },
  btnDisabled:{ backgroundColor: '#94A3B8', shadowOpacity: 0 },
  btnText:    { fontSize: 15, fontWeight: '700', color: '#fff' },
});
