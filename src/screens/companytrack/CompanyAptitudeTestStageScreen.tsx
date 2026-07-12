

// ─── screens/tracks/AptitudeTestStageScreen.tsx ───────────────────
import React, { useEffect, useState, useRef } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet, ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AppStackParamList } from '../../navigation/types';
import {
  getCompanyQuestions,
  submitCompanyTest,
  CompanyQuestion,
  CompanyOptionKey,
  CompanyModuleCategory,
  StageType,
} from '../../../config/client';

type Nav   = NativeStackNavigationProp<AppStackParamList>;
type Route = RouteProp<{
  params: { companyId: string; stageType: StageType; stageName: string };
}, 'params'>;

type Mode = 'practice' | 'exam';

const CATEGORIES: { id: CompanyModuleCategory; label: string; icon: string }[] = [
  { id: 'numerical', label: 'Numerical', icon: '🔢' },
  { id: 'verbal',    label: 'Verbal',    icon: '📖' },
  { id: 'logical',   label: 'Logical',   icon: '🧠' },
  { id: 'abstract',  label: 'Abstract',  icon: '🔷' },
];

export default function CompanyAptitudeTestStageScreen() {
  const navigation = useNavigation<Nav>();
  const route      = useRoute<Route>();
  const { companyId, stageName } = route.params;

  // ── Setup phase: pick mode + category before starting ───────────
  const [phase, setPhase]         = useState<'setup' | 'test' | 'submitting'>('setup');
  const [mode, setMode]           = useState<Mode>('practice');
  const [category, setCategory]   = useState<CompanyModuleCategory>('numerical');

  // ── Test state ────────────────────────────────────────────────────
  const [questions, setQuestions] = useState<CompanyQuestion[]>([]);
  const [idx, setIdx]             = useState(0);
  const [selected, setSelected]   = useState<CompanyOptionKey | null>(null);
  const [revealed, setRevealed]   = useState(false); // practice mode only
  const [answers, setAnswers]     = useState<Record<string, CompanyOptionKey>>({});
  const [loading, setLoading]     = useState(false);
  const [error, setError]         = useState('');

  const startTimeRef = useRef<number>(0);

  const handleStart = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await getCompanyQuestions(companyId, 'aptitude_test', category, 10, undefined, mode);
      setQuestions(res.questions);
      setIdx(0);
      setSelected(null);
      setRevealed(false);
      setAnswers({});
      startTimeRef.current = Date.now();
      setPhase('test');
    } catch {
      setError('Failed to load questions. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const q = questions[idx];
  const isLast = idx === questions.length - 1;

  const handleSelect = (opt: CompanyOptionKey) => {
    if (mode === 'practice' && revealed) return;
    setSelected(opt);
  };

  const handlePracticeCheck = () => {
    if (!selected) return;
    setRevealed(true);
    setAnswers((prev) => ({ ...prev, [q._id]: selected }));
  };

  const handleNext = () => {
    if (selected && mode === 'exam') {
      setAnswers((prev) => ({ ...prev, [q._id]: selected }));
    }

    if (isLast) {
      handleFinish();
      return;
    }
    setIdx((i) => i + 1);
    setSelected(null);
    setRevealed(false);
  };

  const handleFinish = async () => {
    const finalAnswers = { ...answers };
    if (selected && !finalAnswers[q._id]) {
      finalAnswers[q._id] = selected;
    }

    const answersPayload = Object.entries(finalAnswers).map(([questionId, selectedOption]) => ({
      questionId,
      selectedOption,
    }));

    if (answersPayload.length === 0) {
      navigation.goBack();
      return;
    }

    setPhase('submitting');
    const timeTaken = Math.round((Date.now() - startTimeRef.current) / 1000);

    try {
      const result = await submitCompanyTest(
        companyId, 'aptitude_test', category, answersPayload, timeTaken, mode,
      );
      navigation.navigate('CompanyTestResults' as any, {
        result: result.result,
        wrongAnswerDetails: result.wrongAnswerDetails,
        progress: result.progress,
        companyId,
        stageName,
      });
    } catch {
      setError('Failed to submit test. Please try again.');
      setPhase('test');
    }
  };

  const getOptionStyle = (opt: CompanyOptionKey) => {
    if (mode === 'exam' || !revealed) {
      return selected === opt ? styles.optionSelected : styles.option;
    }
    // Practice mode, revealed
    if (opt === q.correctAnswer) return styles.optionCorrect;
    if (opt === selected && opt !== q.correctAnswer) return styles.optionWrong;
    return styles.option;
  };

  // ── SETUP PHASE ───────────────────────────────────────────────────
  if (phase === 'setup') {
    return (
      <SafeAreaView style={styles.safe}>
        <ScrollView contentContainerStyle={styles.scroll}>
          <View style={styles.backRow}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Text style={styles.backBtn}>← Back</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.title}>{stageName}</Text>
          <Text style={styles.sub}>Choose how you want to practice.</Text>

          <Text style={styles.secLabel}>Mode</Text>
          <View style={styles.modeRow}>
            <TouchableOpacity
              style={[styles.modeCard, mode === 'practice' && styles.modeCardActive]}
              onPress={() => setMode('practice')}
            >
              <Text style={styles.modeIcon}>📚</Text>
              <Text style={[styles.modeLabel, mode === 'practice' && styles.modeLabelActive]}>Practice</Text>
              <Text style={styles.modeDesc}>See answers & explanations right away</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.modeCard, mode === 'exam' && styles.modeCardActive]}
              onPress={() => setMode('exam')}
            >
              <Text style={styles.modeIcon}>⏱️</Text>
              <Text style={[styles.modeLabel, mode === 'exam' && styles.modeLabelActive]}>Exam</Text>
              <Text style={styles.modeDesc}>No hints — get graded at the end</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.secLabel}>Category</Text>
          {CATEGORIES.map((c) => (
            <TouchableOpacity
              key={c.id}
              style={[styles.categoryRow, category === c.id && styles.categoryRowActive]}
              onPress={() => setCategory(c.id)}
            >
              <Text style={styles.categoryIcon}>{c.icon}</Text>
              <Text style={[styles.categoryLabel, category === c.id && styles.categoryLabelActive]}>{c.label}</Text>
              {category === c.id && <Text style={styles.categoryCheck}>✓</Text>}
            </TouchableOpacity>
          ))}

          {error !== '' && <Text style={styles.errorText}>{error}</Text>}
        </ScrollView>

        <View style={styles.footer}>
          <TouchableOpacity style={styles.btnPrimary} onPress={handleStart} disabled={loading} activeOpacity={0.85}>
            {loading ? <ActivityIndicator color="#fff" /> : (
              <Text style={styles.btnPrimaryText}>
                {mode === 'practice' ? 'Start Practice →' : 'Start Exam ⏱️'}
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // ── SUBMITTING ────────────────────────────────────────────────────
  if (phase === 'submitting') {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.loadingBox}>
          <ActivityIndicator size="large" color="#1D4ED8" />
          <Text style={styles.loadingText}>Grading your answers…</Text>
        </View>
      </SafeAreaView>
    );
  }

  // ── TEST PHASE ────────────────────────────────────────────────────
  if (!q) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.loadingBox}>
          <Text style={styles.loadingText}>No questions available.</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.hud}>
        <Text style={styles.hudLabel}>Question {idx + 1} / {questions.length}</Text>
        <View style={styles.hudModePill}>
          <Text style={styles.hudModePillText}>{mode === 'practice' ? '📚 Practice' : '⏱️ Exam'}</Text>
        </View>
      </View>

      <View style={styles.progTrack}>
        <View style={[styles.progFill, { width: `${((idx + 1) / questions.length) * 100}%` as any }]} />
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <Text style={styles.question}>{q.questionText}</Text>

        {(Object.keys(q.options) as CompanyOptionKey[]).map((key) => (
          <TouchableOpacity
            key={key}
            style={getOptionStyle(key)}
            onPress={() => handleSelect(key)}
            activeOpacity={0.8}
            disabled={mode === 'practice' && revealed}
          >
            <Text style={styles.optionText}>{key}. {q.options[key]}</Text>
          </TouchableOpacity>
        ))}

        {mode === 'practice' && revealed && q.explanation && (
          <View style={styles.explainBox}>
            <Text style={styles.explainTitle}>Explanation</Text>
            <Text style={styles.explainText}>{q.explanation}</Text>
          </View>
        )}
      </ScrollView>

      <View style={styles.footer}>
        {mode === 'practice' && !revealed ? (
          <TouchableOpacity
            style={[styles.btnPrimary, !selected && styles.btnDisabled]}
            onPress={handlePracticeCheck}
            disabled={!selected}
            activeOpacity={0.85}
          >
            <Text style={styles.btnPrimaryText}>Check Answer</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={[styles.btnPrimary, mode === 'exam' && !selected && styles.btnDisabled]}
            onPress={handleNext}
            disabled={mode === 'exam' && !selected}
            activeOpacity={0.85}
          >
            <Text style={styles.btnPrimaryText}>{isLast ? 'Finish & Submit ✓' : 'Next Question →'}</Text>
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe:   { flex: 1, backgroundColor: '#F8FAFC' },
  scroll: { padding: 20, paddingBottom: 32 },

  backRow: { marginBottom: 16 },
  backBtn: { fontSize: 14, fontWeight: '600', color: '#1D4ED8' },

  title: { fontSize: 26, fontWeight: '800', color: '#0F172A', marginBottom: 6 },
  sub:   { fontSize: 13, color: '#475569', marginBottom: 20 },

  secLabel: { fontSize: 10, fontWeight: '700', color: '#94A3B8', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 10, marginTop: 8 },

  modeRow: { flexDirection: 'row', gap: 10, marginBottom: 8 },
  modeCard: { flex: 1, backgroundColor: '#fff', borderWidth: 1.5, borderColor: '#E2E8F0', borderRadius: 16, padding: 16, alignItems: 'center', gap: 6 },
  modeCardActive: { backgroundColor: 'rgba(29,78,216,0.06)', borderColor: 'rgba(29,78,216,0.3)' },
  modeIcon: { fontSize: 22 },
  modeLabel: { fontSize: 13, fontWeight: '700', color: '#475569' },
  modeLabelActive: { color: '#1D4ED8' },
  modeDesc: { fontSize: 10, color: '#94A3B8', textAlign: 'center', lineHeight: 14 },

  categoryRow: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: '#fff', borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 14, padding: 14, marginBottom: 8 },
  categoryRowActive: { borderColor: '#1D4ED8', backgroundColor: 'rgba(29,78,216,0.04)' },
  categoryIcon: { fontSize: 18 },
  categoryLabel: { flex: 1, fontSize: 14, fontWeight: '600', color: '#0F172A' },
  categoryLabelActive: { color: '#1D4ED8' },
  categoryCheck: { fontSize: 16, color: '#1D4ED8', fontWeight: '700' },

  errorText: { fontSize: 13, color: '#DC2626', textAlign: 'center', marginTop: 12 },

  loadingBox: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12 },
  loadingText: { fontSize: 13, color: '#94A3B8' },

  hud: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 12, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#E2E8F0' },
  hudLabel: { fontSize: 11, fontWeight: '700', color: '#94A3B8', textTransform: 'uppercase' },
  hudModePill: { backgroundColor: '#F1F5F9', borderRadius: 8, paddingHorizontal: 10, paddingVertical: 4 },
  hudModePillText: { fontSize: 11, fontWeight: '700', color: '#475569' },

  progTrack: { height: 4, backgroundColor: '#E2E8F0' },
  progFill: { height: 4, backgroundColor: '#1D4ED8' },

  question: { fontSize: 15, fontWeight: '600', color: '#0F172A', lineHeight: 23, marginBottom: 16 },

  option: { borderWidth: 1, borderColor: '#E2E8F0', backgroundColor: '#fff', borderRadius: 14, padding: 14, marginBottom: 10 },
  optionSelected: { borderWidth: 1.5, borderColor: '#1D4ED8', backgroundColor: 'rgba(29,78,216,0.06)', borderRadius: 14, padding: 14, marginBottom: 10 },
  optionCorrect: { borderWidth: 1.5, borderColor: '#059669', backgroundColor: '#D1FAE5', borderRadius: 14, padding: 14, marginBottom: 10 },
  optionWrong: { borderWidth: 1.5, borderColor: '#DC2626', backgroundColor: '#FEF2F2', borderRadius: 14, padding: 14, marginBottom: 10 },
  optionText: { fontSize: 14, color: '#0F172A', lineHeight: 20 },

  explainBox: { backgroundColor: '#FFFBEB', borderWidth: 1, borderColor: '#FDE68A', borderRadius: 14, padding: 14, marginTop: 8 },
  explainTitle: { fontSize: 11, fontWeight: '700', color: '#92400E', marginBottom: 6 },
  explainText: { fontSize: 13, color: '#78350F', lineHeight: 19 },

  footer: { padding: 20, paddingBottom: 28, backgroundColor: '#F8FAFC', borderTopWidth: 1, borderTopColor: '#E2E8F0' },
  btnPrimary: { backgroundColor: '#1D4ED8', borderRadius: 999, paddingVertical: 15, alignItems: 'center' },
  btnDisabled: { backgroundColor: '#94A3B8' },
  btnPrimaryText: { fontSize: 15, fontWeight: '700', color: '#fff' },
});
