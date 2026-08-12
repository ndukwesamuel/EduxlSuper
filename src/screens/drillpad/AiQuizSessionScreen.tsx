import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AppStackParamList } from '../../navigation/types';
import { Colors } from '../../theme';

type Nav = NativeStackNavigationProp<AppStackParamList>;
type Route = RouteProp<AppStackParamList, 'AiQuizSession'>;

export default function AiQuizSessionScreen() {
  const navigation = useNavigation<Nav>();
  const route = useRoute<Route>();
  const { questions } = route.params;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, string>>({});

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
      // Submit
      Alert.alert(
        'Submit Quiz?',
        'Are you sure you want to submit your answers?',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Submit', style: 'default', onPress: submitQuiz }
        ]
      );
    }
  };

  const submitQuiz = () => {
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

    navigation.replace('AiQuizResults', {
      score,
      total: questions.length,
      results
    });
  };

  if (!currentQuestion) return null;

  const currentSelection = selectedAnswers[currentIndex];

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => {
          Alert.alert('End Session?', 'Your progress will be lost.', [
            { text: 'Cancel', style: 'cancel' },
            { text: 'End', style: 'destructive', onPress: () => navigation.goBack() }
          ]);
        }}>
          <Text style={styles.cancelText}>Cancel</Text>
        </TouchableOpacity>
        <Text style={styles.progress}>
          {currentIndex + 1} of {questions.length}
        </Text>
        <View style={{ width: 50 }} />
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
        <TouchableOpacity
          style={[styles.nextBtn, !currentSelection && styles.nextBtnDisabled]}
          onPress={handleNext}
          disabled={!currentSelection}
        >
          <Text style={styles.nextText}>
            {currentIndex === questions.length - 1 ? 'Submit' : 'Next'}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#F8FAFC' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16, backgroundColor: '#fff' },
  cancelText: { color: '#EF4444', fontWeight: '600' },
  progress: { fontSize: 16, fontWeight: '700', color: '#0F172A' },
  progressBar: { height: 4, backgroundColor: '#E2E8F0', width: '100%' },
  progressFill: { height: '100%', backgroundColor: Colors.brand },
  body: { flex: 1 },
  questionText: { fontSize: 18, fontWeight: '700', color: '#0F172A', lineHeight: 28, marginBottom: 30 },
  optionsList: { gap: 12 },
  optionBtn: { flexDirection: 'row', alignItems: 'center', padding: 16, backgroundColor: '#fff', borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 16, gap: 12 },
  optionSelected: { borderColor: Colors.brand, backgroundColor: '#EEF2FF' },
  optionBadge: { width: 32, height: 32, borderRadius: 16, backgroundColor: '#F1F5F9', alignItems: 'center', justifyContent: 'center' },
  badgeSelected: { backgroundColor: Colors.brand },
  badgeText: { fontSize: 14, fontWeight: '700', color: '#64748B' },
  badgeTextSelected: { color: '#fff' },
  optionText: { flex: 1, fontSize: 15, color: '#334155', lineHeight: 22 },
  optionTextSelected: { color: '#1E1B4B', fontWeight: '500' },
  footer: { padding: 20, backgroundColor: '#fff', borderTopWidth: 1, borderTopColor: '#E2E8F0' },
  nextBtn: { backgroundColor: Colors.brand, padding: 16, borderRadius: 12, alignItems: 'center' },
  nextBtnDisabled: { opacity: 0.5 },
  nextText: { color: '#fff', fontSize: 16, fontWeight: '700' }
});
