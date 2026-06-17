// ─── ShellPracticeVerbalScreen.tsx ───────────────────────────────
import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AppStackParamList } from '../../navigation/types';
import ShellHUDBar         from '../../components/shell/ShellHUDBar';
import ShellQuestionOption from '../../components/shell/ShellQuestionOption';
import ShellExplainBox     from '../../components/shell/ShellExplainBox';

type Nav = NativeStackNavigationProp<AppStackParamList>;

// ── Dummy questions ────────────────────────────────────────────────
const QUESTIONS = [
  {
    id: 1,
    passage: 'While renewable energy investments in Sub-Saharan Africa grew by 40% over the last fiscal year, natural gas projects still retain the highest share of third-party institutional funding due to established pipeline infrastructure.',
    statement: 'Natural gas received more total funding than renewable energy last year.',
    options: ['True', 'False', 'Cannot Say'],
    correct: 2,
    explanation: {
      title: '💡 The "Cannot Say" Trap',
      text: 'The passage says gas has the "highest share" of third-party funding — not the highest total funding. You cannot assume monetary amounts without explicit data.\n\nShell\'s golden rule: If it is not stated word for word in the text, the answer is Cannot Say. Never use outside knowledge.',
    },
  },
  {
    id: 2,
    passage: 'Shell\'s graduate trainee programme requires a minimum Second Class Upper degree from an accredited university. Candidates with Second Class Lower qualifications may apply only if they hold a postgraduate degree in a relevant field. Applications from candidates with Third Class degrees are not considered under any circumstances.',
    statement: 'A candidate with a Second Class Lower and a Master\'s degree in Engineering can apply for the Shell graduate trainee programme.',
    options: ['True', 'False', 'Cannot Say'],
    correct: 0,
    explanation: {
      title: '💡 Read every condition carefully',
      text: 'The passage explicitly states: "Candidates with Second Class Lower qualifications may apply ONLY IF they hold a postgraduate degree in a relevant field." A Master\'s in Engineering qualifies as a postgraduate degree in a relevant field.\n\nAnswer: True — the condition is explicitly met.',
    },
  },
  {
    id: 3,
    passage: 'The Nigerian oil and gas sector accounted for approximately 86% of the country\'s export earnings in the last quarter. However, the Federal Government has announced plans to diversify revenue streams, targeting agriculture and technology sectors as primary growth areas over the next decade.',
    statement: 'The Nigerian government plans to reduce oil and gas exports by 50% within the next ten years.',
    options: ['True', 'False', 'Cannot Say'],
    correct: 2,
    explanation: {
      title: '💡 "Diversify" ≠ "reduce by 50%"',
      text: 'The passage says the government plans to "diversify revenue streams" and target agriculture/technology. This does NOT say they will reduce oil exports by 50%.\n\nThe exact reduction target is never mentioned. Answer: Cannot Say.\n\nCommon trap: Assuming that "diversification" means a specific reduction figure.',
    },
  },
  {
    id: 4,
    passage: 'Shell\'s Capacity, Achievement, and Relationships (CAR) framework is used to evaluate all graduate trainee candidates. Capacity refers to cognitive ability and learning agility. Achievement relates to drive and results orientation. Relationships measures interpersonal effectiveness and teamwork.',
    statement: 'A candidate who scores highly on cognitive tests but poorly on teamwork questions will have a strong overall CAR profile.',
    options: ['True', 'False', 'Cannot Say'],
    correct: 1,
    explanation: {
      title: '💡 All three CAR pillars must be strong',
      text: 'The passage describes CAR as three separate criteria — Capacity, Achievement, and Relationships. Scoring high on Capacity (cognitive) but poor on Relationships (teamwork) means one pillar is weak.\n\nThe passage implies all three are evaluated together, so a weak Relationships score means the overall profile is NOT strong. Answer: False.',
    },
  },
];

export default function ShellPracticeVerbalScreen() {
  const navigation = useNavigation<Nav>();
  const [idx, setIdx]           = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [revealed, setReveal]   = useState(false);
  const [scores, setScores]     = useState({ correct: 0, wrong: 0 });

  const q      = QUESTIONS[idx];
  const isLast = idx === QUESTIONS.length - 1;

  const handleSelect = (i: number) => { if (!revealed) setSelected(i); };

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

  const getState = (i: number) => {
    if (!revealed) return selected === i ? 'selected' : 'default';
    if (i === q.correct) return 'correct';
    if (i === selected && i !== q.correct) return 'wrong';
    return 'default';
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ShellHUDBar label={`Question ${idx + 1} / ${QUESTIONS.length}`} modePill="📚 Practice" />

      <View style={styles.progWrap}>
        <View style={styles.progTrack}>
          <View style={[styles.progFill, { width: `${((idx + 1) / QUESTIONS.length) * 100}%` as any }]} />
        </View>
        <View style={styles.progRow}>
          <Text style={styles.progLabel}>Verbal Reasoning</Text>
          <Text style={styles.progType}>True / False / Cannot Say</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

        {/* Score strip */}
        <View style={styles.scoreStrip}>
          <View style={styles.scoreItem}><Text style={[styles.scoreNum, { color: '#059669' }]}>{scores.correct}</Text><Text style={styles.scoreLbl}>Correct</Text></View>
          <View style={styles.scoreItem}><Text style={[styles.scoreNum, { color: '#DC2626' }]}>{scores.wrong}</Text><Text style={styles.scoreLbl}>Wrong</Text></View>
          <View style={styles.scoreItem}><Text style={[styles.scoreNum, { color: '#94A3B8' }]}>{QUESTIONS.length - idx - 1}</Text><Text style={styles.scoreLbl}>Left</Text></View>
        </View>

        {/* Passage */}
        <Text style={styles.passageLabel}>Read the passage — use only what's written</Text>
        <View style={styles.passageCard}>
          <Text style={styles.passageText}>"{q.passage}"</Text>
        </View>

        {/* Statement */}
        <View style={styles.statementCard}>
          <Text style={styles.statementLabel}>STATEMENT</Text>
          <Text style={styles.statementText}>{q.statement}</Text>
        </View>

        {/* Options */}
        {q.options.map((opt, i) => (
          <ShellQuestionOption key={i} label={opt} state={getState(i)} onPress={() => handleSelect(i)} />
        ))}

        {/* Rule reminder */}
        {!revealed && (
          <View style={styles.ruleCard}>
            <Text style={styles.ruleText}>📌 Only use information stated in the passage. Never bring in outside knowledge.</Text>
          </View>
        )}

        {/* Explanation */}
        {revealed && <ShellExplainBox title={q.explanation.title} text={q.explanation.text} />}

      </ScrollView>

      <View style={styles.footer}>
        {!revealed ? (
          <TouchableOpacity style={[styles.btnPrimary, selected === null && styles.btnDisabled]} onPress={handleReveal} activeOpacity={0.85} disabled={selected === null}>
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

  scoreStrip: { flexDirection: 'row', backgroundColor: '#fff', borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 14, padding: 12, marginBottom: 16, justifyContent: 'space-around' },
  scoreItem:  { alignItems: 'center', gap: 2 },
  scoreNum:   { fontSize: 18, fontWeight: '800' },
  scoreLbl:   { fontSize: 10, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: 0.3 },

  passageLabel: { fontSize: 10, fontWeight: '700', color: '#94A3B8', textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 8 },
  passageCard:  { backgroundColor: '#fff', borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 14, padding: 14, marginBottom: 14 },
  passageText:  { fontSize: 13, color: '#475569', lineHeight: 22, fontStyle: 'italic' },

  statementCard:  { backgroundColor: '#F8FAFC', borderWidth: 1, borderColor: '#CBD5E1', borderRadius: 12, padding: 12, marginBottom: 14 },
  statementLabel: { fontSize: 9, fontWeight: '700', color: '#94A3B8', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 6 },
  statementText:  { fontSize: 14, fontWeight: '600', color: '#0F172A', lineHeight: 22 },

  ruleCard:  { backgroundColor: '#EFF6FF', borderRadius: 12, padding: 12, marginTop: 4 },
  ruleText:  { fontSize: 11, color: '#1D4ED8', lineHeight: 18 },

  footer:     { padding: 20, paddingBottom: 28, backgroundColor: '#F8FAFC', borderTopWidth: 1, borderTopColor: '#E2E8F0' },
  btnPrimary: { backgroundColor: '#1D4ED8', borderRadius: 999, paddingVertical: 15, alignItems: 'center', shadowColor: '#1D4ED8', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.28, shadowRadius: 12, elevation: 6 },
  btnDisabled:{ backgroundColor: '#94A3B8', shadowOpacity: 0 },
  btnText:    { fontSize: 15, fontWeight: '700', color: '#fff' },
});
