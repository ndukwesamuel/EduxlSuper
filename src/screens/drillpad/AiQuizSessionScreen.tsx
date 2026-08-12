import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AppStackParamList } from '../../navigation/types';
import { Colors } from '../../theme';
import { submitCourseQuizSession } from '../../../config/client';

type Nav = NativeStackNavigationProp<AppStackParamList>;
type Route = RouteProp<AppStackParamList, 'AiQuizSession'>;

export default function AiQuizSessionScreen() {
  const navigation = useNavigation<Nav>();
  const route = useRoute<Route>();
  const { questions, subjectId, subjectName } = route.params;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, string>>({});
  const [submitting, setSubmitting] = useState(false);

  const currentQuestion = questions[currentIndex];

  const handleSelect = (optionLabel: string) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [currentIndex]: optionLabel
    }));
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      Alert.alert(
        'Submit Quiz?',
        `Are you sure you want to submit your answers for ${questions.length} questions?`,
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Submit Quiz', style: 'default', onPress: submitQuiz }
        ]
      );
    }
  };

  const submitQuiz = async () => {
    setSubmitting(true);
    let score = 0;
    const results = questions.map((q: any, i: number) => {
      const userAns = selectedAnswers[i] || null;
      const isCorrect = userAns === q.correctOption;
      if (isCorrect) score++;
      return {
        ...q,
        userAnswer: userAns,
        isCorrect
      };
    });

    if (subjectId) {
      try {
        await submitCourseQuizSession(subjectId, {
          score,
          totalQuestions: questions.length,
        });
      } catch (err) {
        console.log("Failed to save session to backend:", err);
      }
    }

    setSubmitting(false);
    navigation.replace('AiQuizResults', {
      score,
      total: questions.length,
      results,
      subjectId,
      subjectName,
    });
  };

  if (!currentQuestion) return null;

  const currentSelection = selectedAnswers[currentIndex];
  const answeredCount = Object.keys(selectedAnswers).length;

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => {
          Alert.alert('End Quiz Session?', 'Your progress in this quiz will be lost.', [
            { text: 'Cancel', style: 'cancel' },
            { text: 'End Session', style: 'destructive', onPress: () => navigation.goBack() }
          ]);
        }}>
          <Text style={styles.cancelText}>End Quiz</Text>
        </TouchableOpacity>
        <View style={styles.titleWrap}>
          {subjectName ? <Text style={styles.subjectTitle} numberOfLines={1}>{subjectName}</Text> : null}
          <Text style={styles.progress}>
            Question {currentIndex + 1} of {questions.length}
          </Text>
        </View>
        <Text style={styles.answeredBadge}>{answeredCount}/{questions.length}</Text>
      </View>

      <View style={styles.progressBar}>
        <View style={[styles.progressFill, { width: `${((currentIndex + 1) / questions.length) * 100}%` }]} />
      </View>

      <ScrollView style={styles.body} contentContainerStyle={{ padding: 20, paddingBottom: 100 }}>
        <Text style={styles.questionText}>{currentQuestion.question}</Text>
        
        <View style={styles.optionsList}>
          {currentQuestion.options.map((opt: any) => {
            const isSelected = currentSelection === opt.label;
            return (
              <TouchableOpacity
                key={opt.label}
                style={[styles.optionBtn, isSelected && styles.optionSelected]}
                onPress={() => handleSelect(opt.label)}
                activeOpacity={0.7}
              >
                <View style={[styles.optionBadge, isSelected && styles.badgeSelected]}>
                  <Text style={[styles.badgeText, isSelected && styles.badgeTextSelected]}>
                    {opt.label}
                  </Text>
                </View>
                <Text style={[styles.optionText, isSelected && styles.optionTextSelected]}>
                  {opt.text}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <View style={styles.navRow}>
          <TouchableOpacity
            style={[styles.navBtn, currentIndex === 0 && styles.btnDisabled]}
            onPress={() => setCurrentIndex(prev => Math.max(0, prev - 1))}
            disabled={currentIndex === 0}
          >
            <Text style={styles.navBtnText}>← Previous</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.nextBtn, !currentSelection && styles.nextBtnDisabled]}
            onPress={handleNext}
            disabled={!currentSelection || submitting}
          >
            {submitting ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.nextText}>
                {currentIndex === questions.length - 1 ? 'Submit Quiz ✨' : 'Next Question →'}
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#F8FAFC' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#E2E8F0' },
  cancelText: { color: '#EF4444', fontWeight: '700', fontSize: 14 },
  titleWrap: { alignItems: 'center' },
  subjectTitle: { fontSize: 12, fontWeight: '700', color: Colors.brand, textTransform: 'uppercase', letterSpacing: 0.5 },
  progress: { fontSize: 15, fontWeight: '800', color: '#0F172A' },
  answeredBadge: { fontSize: 13, fontWeight: '700', color: '#64748B', backgroundColor: '#F1F5F9', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  progressBar: { height: 5, backgroundColor: '#E2E8F0', width: '100%' },
  progressFill: { height: '100%', backgroundColor: Colors.brand },
  body: { flex: 1 },
  questionText: { fontSize: 18, fontWeight: '700', color: '#0F172A', lineHeight: 28, marginBottom: 24 },
  optionsList: { gap: 12 },
  optionBtn: { flexDirection: 'row', alignItems: 'center', padding: 16, backgroundColor: '#fff', borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 16, gap: 12 },
  optionSelected: { borderColor: Colors.brand, backgroundColor: '#EEF2FF' },
  optionBadge: { width: 34, height: 34, borderRadius: 17, backgroundColor: '#F1F5F9', alignItems: 'center', justifyContent: 'center' },
  badgeSelected: { backgroundColor: Colors.brand },
  badgeText: { fontSize: 14, fontWeight: '700', color: '#64748B' },
  badgeTextSelected: { color: '#fff' },
  optionText: { flex: 1, fontSize: 15, color: '#334155', lineHeight: 22 },
  optionTextSelected: { color: '#1E1B4B', fontWeight: '600' },
  footer: { padding: 16, backgroundColor: '#fff', borderTopWidth: 1, borderTopColor: '#E2E8F0' },
  navRow: { flexDirection: 'row', gap: 12 },
  navBtn: { paddingVertical: 14, paddingHorizontal: 16, borderRadius: 12, backgroundColor: '#F1F5F9', justifyContent: 'center' },
  navBtnText: { color: '#475569', fontWeight: '700', fontSize: 14 },
  btnDisabled: { opacity: 0.3 },
  nextBtn: { flex: 1, backgroundColor: Colors.brand, paddingVertical: 14, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  nextBtnDisabled: { opacity: 0.5 },
  nextText: { color: '#fff', fontSize: 15, fontWeight: '700' }
});
