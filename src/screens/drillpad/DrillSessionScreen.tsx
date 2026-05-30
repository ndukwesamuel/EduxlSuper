


// ─── DrillSessionScreen.tsx ───────────────────────────────────────
import React, { useEffect, useState, useRef, useCallback } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  StyleSheet, Alert, Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AppStackParamList } from '../../navigation/types';
import { Colors, FontSize, Radius, Spacing, Shadows } from '../../theme';
import CCLoader from '../../components/CCLoader';
import { getDrillQuestions, submitDrillSession, DrillQuestion } from  "../../../config/client"


type Nav   = NativeStackNavigationProp<AppStackParamList>;
type Route = RouteProp<AppStackParamList, 'DrillSession'>;

const EXAM_TIME_PER_Q = 60; // seconds per question in exam mode

export default function DrillSessionScreen() {
  const navigation = useNavigation<Nav>();
  const route      = useRoute<Route>();
  const { subjectId, subjectName, mode } = route.params;

  const [questions, setQuestions]     = useState<DrillQuestion[]>([]);
  const [loading, setLoading]         = useState(true);
  const [currentIdx, setCurrentIdx]   = useState(0);
  const [selected, setSelected]       = useState<string | null>(null);
  const [answered, setAnswered]       = useState(false);
  const [answers, setAnswers]         = useState<{ questionId: string; selectedOption: string }[]>([]);
  const [timeLeft, setTimeLeft]       = useState(0);
  const [submitting, setSubmitting]   = useState(false);
  const startTime                     = useRef(Date.now());
  const timerRef                      = useRef<ReturnType<typeof setInterval> | null>(null);
  const fadeAnim                      = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    loadQuestions();
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, []);

  const loadQuestions = async () => {
    try {
      const pool = mode === 'weak' ? 'weak' : 'all';
      const qs   = await getDrillQuestions(subjectId, pool, 10, true);
      if (qs.length === 0) {
        Alert.alert('No questions', 'No questions available for this mode.', [
          { text: 'OK', onPress: () => navigation.goBack() },
        ]);
        return;
      }
      setQuestions(qs);
      if (mode === 'exam') {
        setTimeLeft(qs.length * EXAM_TIME_PER_Q);
        startTimer();
      }
    } catch {
      Alert.alert('Error', 'Could not load questions');
      navigation.goBack();
    } finally {
      setLoading(false);
    }
  };

  const startTimer = () => {
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          if (timerRef.current) clearInterval(timerRef.current);
          handleAutoSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleAutoSubmit = useCallback(() => {
    setAnswers((currentAnswers) => {
      handleSubmit(currentAnswers);
      return currentAnswers;
    });
  }, [questions]);

  const handleSelect = (label: string) => {
    if (answered) return;
    setSelected(label);
    if (mode === 'practice') {
      setAnswered(true);
    }
  };

  const handleNext = () => {
    if (!selected) return Alert.alert('Select an answer', 'Pick an option before continuing');

    const newAnswers = [...answers, { questionId: questions[currentIdx]._id, selectedOption: selected }];
    setAnswers(newAnswers);

    if (currentIdx < questions.length - 1) {
      Animated.timing(fadeAnim, { toValue: 0, duration: 150, useNativeDriver: true }).start(() => {
        setCurrentIdx((i) => i + 1);
        setSelected(null);
        setAnswered(false);
        Animated.timing(fadeAnim, { toValue: 1, duration: 150, useNativeDriver: true }).start();
      });
    } else {
      handleSubmit(newAnswers);
    }
  };

  const handleSubmit = async (finalAnswers: typeof answers) => {
    if (timerRef.current) clearInterval(timerRef.current);
    setSubmitting(true);
    try {
      const duration = Math.round((Date.now() - startTime.current) / 1000);
      const result   = await submitDrillSession(subjectId, mode, finalAnswers, duration);
      navigation.navigate('DrillResults', { result, subjectId, subjectName, mode });
    } catch {
      Alert.alert('Error', 'Could not submit session');
    } finally {
      setSubmitting(false);
    }
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60).toString().padStart(2, '0');
    const s = (secs % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  if (loading || submitting) return <CCLoader />;

  const q       = questions[currentIdx];
  const isLast  = currentIdx === questions.length - 1;
  const isPractice = mode === 'practice';

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.topBar}>
        <TouchableOpacity
          onPress={() =>
            Alert.alert('Quit session?', 'Your progress will be lost.', [
              { text: 'Keep going', style: 'cancel' },
              { text: 'Quit', style: 'destructive', onPress: () => navigation.goBack() },
            ])
          }
        >
          <Text style={styles.quitText}>✕</Text>
        </TouchableOpacity>

        <Text style={styles.progress}>{currentIdx + 1} / {questions.length}</Text>

        {mode === 'exam' && (
          <Text style={[styles.timer, timeLeft < 60 && styles.timerWarning]}>
            ⏱ {formatTime(timeLeft)}
          </Text>
        )}
        {mode !== 'exam' && <View style={{ width: 40 }} />}
      </View>

      {/* Progress bar */}
      <View style={styles.progressBar}>
        <View style={[styles.progressFill, { width: `${((currentIdx) / questions.length) * 100}%` }]} />
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <Text style={styles.modeTag}>
          {mode === 'practice' ? '📚 Practice' : mode === 'exam' ? '⏱️ Exam' : '⚠️ Weak Questions'}
        </Text>

        <Animated.View style={{ opacity: fadeAnim }}>
          <Text style={styles.questionText}>{q.question}</Text>

          {q.options.map((opt) => {
            let style = styles.option;
            if (answered && isPractice) {
              if (opt.label === q.correctOption) style = styles.optionCorrect;
              else if (opt.label === selected) style = styles.optionWrong;
            } else if (selected === opt.label) {
              style = styles.optionSelected;
            }

            return (
              <TouchableOpacity
                key={opt.label}
                style={style}
                onPress={() => handleSelect(opt.label)}
                activeOpacity={0.75}
                disabled={answered && isPractice}
              >
                <View style={styles.optionLabelWrap}>
                  <Text style={styles.optionLabel}>{opt.label}</Text>
                </View>
                <Text style={styles.optionText}>{opt.text}</Text>
                {answered && isPractice && opt.label === q.correctOption && (
                  <Text style={styles.correctMark}>✓</Text>
                )}
                {answered && isPractice && opt.label === selected && opt.label !== q.correctOption && (
                  <Text style={styles.wrongMark}>✗</Text>
                )}
              </TouchableOpacity>
            );
          })}

          {/* Explanation in practice mode */}
          {answered && isPractice && q.explanation && (
            <View style={styles.explanationBox}>
              <Text style={styles.explanationTitle}>💡 Explanation</Text>
              <Text style={styles.explanationText}>{q.explanation}</Text>
            </View>
          )}
        </Animated.View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.nextBtn, !selected && styles.nextBtnDisabled]}
          onPress={handleNext}
          disabled={!selected}
        >
          <Text style={styles.nextBtnText}>
            {isLast ? 'Finish & see results' : isPractice && !answered ? 'Check answer' : 'Next →'}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe:   { flex: 1, backgroundColor: Colors.background },
  topBar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: Spacing.lg, paddingVertical: Spacing.md },
  quitText: { fontSize: 20, color: Colors.textSecondary, fontWeight: '600' },
  progress: { fontSize: FontSize.body, fontWeight: '700', color: Colors.textPrimary },
  timer: { fontSize: FontSize.body, fontWeight: '700', color: Colors.brand, minWidth: 60, textAlign: 'right' },
  timerWarning: { color: '#DC2626' },
  progressBar: { height: 4, backgroundColor: Colors.border, marginHorizontal: Spacing.lg, borderRadius: 2 },
  progressFill: { height: 4, backgroundColor: Colors.brand, borderRadius: 2 },
  scroll: { padding: Spacing.lg, paddingBottom: 120 },
  modeTag: { fontSize: FontSize.caption, fontWeight: '700', color: Colors.textMuted, marginBottom: Spacing.lg, textTransform: 'uppercase', letterSpacing: 0.5 },
  questionText: { fontSize: FontSize.heading2, fontWeight: '700', color: Colors.textPrimary, lineHeight: 30, marginBottom: Spacing['2xl'] },
  option: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.surface, borderRadius: Radius.lg, padding: Spacing.md, marginBottom: Spacing.md, borderWidth: 1.5, borderColor: Colors.border, gap: 12 },
  optionSelected: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#EEF2FF', borderRadius: Radius.lg, padding: Spacing.md, marginBottom: Spacing.md, borderWidth: 1.5, borderColor: Colors.brand, gap: 12 },
  optionCorrect: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F0FDF4', borderRadius: Radius.lg, padding: Spacing.md, marginBottom: Spacing.md, borderWidth: 1.5, borderColor: '#059669', gap: 12 },
  optionWrong: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FEF2F2', borderRadius: Radius.lg, padding: Spacing.md, marginBottom: Spacing.md, borderWidth: 1.5, borderColor: '#DC2626', gap: 12 },
  optionLabelWrap: { width: 32, height: 32, borderRadius: 16, backgroundColor: Colors.background, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: Colors.border },
  optionLabel: { fontSize: FontSize.body, fontWeight: '700', color: Colors.textPrimary },
  optionText: { flex: 1, fontSize: FontSize.body, color: Colors.textPrimary, lineHeight: 22 },
  correctMark: { fontSize: 18, color: '#059669', fontWeight: '700' },
  wrongMark: { fontSize: 18, color: '#DC2626', fontWeight: '700' },
  explanationBox: { backgroundColor: '#FFFBEB', borderRadius: Radius.md, padding: Spacing.md, marginTop: Spacing.md, borderWidth: 1, borderColor: '#FDE68A' },
  explanationTitle: { fontSize: FontSize.bodySmall, fontWeight: '700', color: '#92400E', marginBottom: 4 },
  explanationText: { fontSize: FontSize.bodySmall, color: '#78350F', lineHeight: 20 },
  footer: { position: 'absolute', bottom: 0, left: 0, right: 0, padding: Spacing.lg, backgroundColor: Colors.background, borderTopWidth: 1, borderTopColor: Colors.border },
  nextBtn: { backgroundColor: Colors.brand, borderRadius: Radius.full, paddingVertical: 16, alignItems: 'center' },
  nextBtnDisabled: { opacity: 0.4 },
  nextBtnText: { fontSize: FontSize.bodyLarge, fontWeight: '700', color: '#fff' },
});