// ─── PracticeSessionScreen.tsx ────────────────────────────────────
// Runs one practice set of 5 questions. Two modes:
// - 'chapter': questions for one chapter of a lecture video (#9)
// - 'review':  missed questions that are due for spaced review (#10)
// On submit, wrong answers that came from a lecture show a button that opens
// the video at that point (#11).
import React, { useEffect, useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet, ActivityIndicator, Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AppStackParamList } from '../../navigation/types';
import {
  getVideoPracticeSet,
  generateVideoPractice,
  getDueReview,
  submitDrillSession,
  PracticeQuestion,
  ReviewQuestion,
  DrillSessionResult,
} from '../../../config/client';

type Nav = NativeStackNavigationProp<AppStackParamList>;

type Q = PracticeQuestion & { subjectId?: string };

export default function PracticeSessionScreen() {
  const navigation = useNavigation<Nav>();
  const route = useRoute<any>();
  const mode: 'chapter' | 'review' = route.params?.mode ?? 'chapter';
  const videoId: string | undefined = route.params?.videoId;
  const chapterTitle: string | undefined = route.params?.chapterTitle;
  const chapterIndex: number | undefined = route.params?.chapterIndex;
  const subjectName: string = route.params?.subjectName ?? 'Practice';

  const [questions, setQuestions] = useState<Q[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<DrillSessionResult | null>(null);
  const [startedAt] = useState(() => Date.now());
  const [subjectId, setSubjectId] = useState<string | undefined>(route.params?.subjectId);

  const loadSet = async () => {
    setLoading(true);
    try {
      if (mode === 'chapter' && videoId) {
        const data = await getVideoPracticeSet(videoId, chapterTitle);
        setQuestions(data.questions);
      } else {
        const data = await getDueReview(route.params?.subjectId);
        const qs = data.questions as ReviewQuestion[];
        setQuestions(qs);
        if (qs[0]?.subjectId) setSubjectId(qs[0].subjectId);
      }
    } catch (err: any) {
      Alert.alert('Could not load questions', err?.response?.data?.message || err?.message || 'Try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadSet(); }, []);

  // A chapter with no questions yet gets a pool written once, then the set loads.
  const generatePool = async () => {
    if (!videoId || chapterIndex === undefined) return;
    setGenerating(true);
    try {
      await generateVideoPractice(videoId, chapterIndex);
      await loadSet();
    } catch (err: any) {
      Alert.alert('Could not make questions', err?.response?.data?.message || err?.message || 'Try again.');
    } finally {
      setGenerating(false);
    }
  };

  const pick = (qid: string, label: string) => setAnswers((a) => ({ ...a, [qid]: label }));

  const submit = async () => {
    if (!subjectId) {
      Alert.alert('Practice', 'This set has no subject to record against.');
      return;
    }
    setSubmitting(true);
    try {
      const payload = questions.map((q) => ({ questionId: q._id, selectedOption: answers[q._id] ?? '' }));
      const res = await submitDrillSession(subjectId, 'practice', payload, Math.round((Date.now() - startedAt) / 1000));
      setResult(res);
    } catch (err: any) {
      Alert.alert('Could not submit', err?.response?.data?.message || err?.message || 'Try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const allAnswered = questions.length > 0 && questions.every((q) => answers[q._id]);

  if (loading || generating) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#1D4ED8" />
          <Text style={styles.muted}>{generating ? 'Writing questions for this chapter…' : 'Loading questions…'}</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (result) {
    return (
      <SafeAreaView style={styles.safe}>
        <ScrollView contentContainerStyle={styles.scroll}>
          <Text style={styles.title}>{result.correctCount} of {result.totalQuestions} correct</Text>
          <Text style={styles.muted}>Score {result.score}/10</Text>

          {result.wrongQuestions.length > 0 && <Text style={styles.sectionLabel}>To review</Text>}
          {result.wrongQuestions.map((w) => (
            <View key={w.questionId} style={styles.card}>
              <Text style={styles.qText}>{w.question}</Text>
              <Text style={styles.wrongText}>Your answer: {w.selectedOption}  ·  Correct: {w.correctOption}</Text>
              {!!w.explanation && <Text style={styles.explain}>{w.explanation}</Text>}
              {w.source?.videoId && (
                <TouchableOpacity
                  style={styles.watchBtn}
                  onPress={() => navigation.navigate('LectureVideoPlayer', {
                    videoId: w.source!.videoId,
                    subjectName,
                    startSeconds: w.source!.start ?? 0,
                  })}
                  activeOpacity={0.85}
                >
                  <Text style={styles.watchBtnText}>▶ Watch the explanation{w.source.chapterTitle ? ` · ${w.source.chapterTitle}` : ''}</Text>
                </TouchableOpacity>
              )}
            </View>
          ))}

          <TouchableOpacity style={styles.btnPrimary} onPress={() => navigation.goBack()} activeOpacity={0.85}>
            <Text style={styles.btnPrimaryText}>Done</Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    );
  }

  if (questions.length === 0) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.center}>
          <Text style={styles.emoji}>{mode === 'review' ? '✅' : '📝'}</Text>
          <Text style={styles.title}>{mode === 'review' ? 'Nothing due for review' : 'No questions for this chapter yet'}</Text>
          <Text style={styles.muted}>
            {mode === 'review' ? 'Missed questions come back here on their due day.' : 'Write a set of questions from this chapter.'}
          </Text>
          {mode === 'chapter' && chapterIndex !== undefined && (
            <TouchableOpacity style={styles.btnPrimary} onPress={generatePool} activeOpacity={0.85}>
              <Text style={styles.btnPrimaryText}>Write questions</Text>
            </TouchableOpacity>
          )}
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.title}>{mode === 'review' ? 'Review' : chapterTitle ?? 'Practice'}</Text>
        <Text style={styles.muted}>{Object.keys(answers).length} of {questions.length} answered</Text>

        {questions.map((q, i) => (
          <View key={q._id} style={styles.card}>
            <Text style={styles.qText}>{i + 1}. {q.question}</Text>
            {q.options.map((o) => {
              const selected = answers[q._id] === o.label;
              return (
                <TouchableOpacity
                  key={o.label}
                  style={[styles.option, selected && styles.optionSelected]}
                  onPress={() => pick(q._id, o.label)}
                  activeOpacity={0.8}
                >
                  <Text style={[styles.optionText, selected && styles.optionTextSelected]}>{o.label}. {o.text}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        ))}

        <TouchableOpacity
          style={[styles.btnPrimary, (!allAnswered || submitting) && styles.btnDisabled]}
          onPress={submit}
          disabled={!allAnswered || submitting}
          activeOpacity={0.85}
        >
          {submitting ? <ActivityIndicator color="#fff" /> : <Text style={styles.btnPrimaryText}>Submit</Text>}
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#F8FAFC' },
  scroll: { padding: 20, paddingBottom: 40 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 32 },
  title: { fontSize: 20, fontWeight: '800', color: '#0F172A', marginBottom: 4 },
  muted: { fontSize: 13, color: '#64748B', marginBottom: 12, textAlign: 'center' },
  emoji: { fontSize: 44, marginBottom: 12 },
  sectionLabel: { fontSize: 11, fontWeight: '700', color: '#94A3B8', textTransform: 'uppercase', marginTop: 16, marginBottom: 8 },
  card: { backgroundColor: '#fff', borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 14, padding: 14, marginBottom: 12 },
  qText: { fontSize: 14, fontWeight: '700', color: '#0F172A', marginBottom: 10, lineHeight: 20 },
  option: { borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 10, padding: 10, marginBottom: 6 },
  optionSelected: { borderColor: '#1D4ED8', backgroundColor: '#EFF6FF' },
  optionText: { fontSize: 13, color: '#334155' },
  optionTextSelected: { color: '#1D4ED8', fontWeight: '700' },
  wrongText: { fontSize: 12, color: '#DC2626', fontWeight: '600', marginBottom: 6 },
  explain: { fontSize: 12, color: '#475569', lineHeight: 18, marginBottom: 8 },
  watchBtn: { backgroundColor: '#EFF6FF', borderRadius: 10, paddingVertical: 10, alignItems: 'center', marginTop: 4 },
  watchBtnText: { fontSize: 13, fontWeight: '700', color: '#1D4ED8' },
  btnPrimary: { backgroundColor: '#1D4ED8', borderRadius: 999, paddingVertical: 14, alignItems: 'center', marginTop: 8 },
  btnPrimaryText: { fontSize: 14, fontWeight: '700', color: '#fff' },
  btnDisabled: { opacity: 0.5 },
});
