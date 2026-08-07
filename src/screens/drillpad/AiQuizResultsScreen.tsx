import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AppStackParamList } from '../../navigation/types';
import { Colors } from '../../theme';

type Nav = NativeStackNavigationProp<AppStackParamList>;
type Route = RouteProp<AppStackParamList, 'AiQuizResults'>;

export default function AiQuizResultsScreen() {
  const navigation = useNavigation<Nav>();
  const route = useRoute<Route>();
  const { score, total, results } = route.params;

  const percentage = Math.round((score / total) * 100);

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <Text style={styles.title}>Quiz Results</Text>
        <TouchableOpacity onPress={() => navigation.navigate('DrillPad')} style={styles.doneBtn}>
          <Text style={styles.doneText}>Done</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.body} contentContainerStyle={{ padding: 20, paddingBottom: 60 }}>
        
        <View style={styles.scoreCard}>
          <Text style={styles.scoreLabel}>Your Score</Text>
          <Text style={styles.scoreVal}>{score} / {total}</Text>
          <Text style={styles.scorePct}>{percentage}% Accuracy</Text>
        </View>

        <Text style={styles.reviewTitle}>Detailed Review</Text>

        {results.map((r, i) => (
          <View key={i} style={styles.qCard}>
            <Text style={styles.qIndex}>Question {i + 1}</Text>
            <Text style={styles.qText}>{r.question}</Text>
            
            <View style={styles.answersRow}>
              <View style={[styles.badge, r.isCorrect ? styles.badgeSuccess : styles.badgeDanger]}>
                <Text style={styles.badgeText}>You: {r.userAnswer || 'None'}</Text>
              </View>
              {!r.isCorrect && (
                <View style={[styles.badge, styles.badgeSuccess]}>
                  <Text style={styles.badgeText}>Correct: {r.correctOption}</Text>
                </View>
              )}
            </View>

            <View style={styles.explanationBox}>
              <Text style={styles.explanationLabel}>💡 AI Explanation:</Text>
              <Text style={styles.explanationText}>{r.explanation}</Text>
            </View>
          </View>
        ))}

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#F8FAFC' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#E2E8F0' },
  title: { fontSize: 18, fontWeight: '700', color: '#0F172A' },
  doneBtn: { padding: 8 },
  doneText: { color: Colors.brand, fontWeight: '700' },
  body: { flex: 1 },
  scoreCard: { backgroundColor: Colors.brand, padding: 30, borderRadius: 20, alignItems: 'center', marginBottom: 24 },
  scoreLabel: { color: '#E0E7FF', fontSize: 14, fontWeight: '600', marginBottom: 8 },
  scoreVal: { color: '#fff', fontSize: 48, fontWeight: '800' },
  scorePct: { color: '#C7D2FE', fontSize: 16, fontWeight: '600', marginTop: 8 },
  reviewTitle: { fontSize: 20, fontWeight: '700', color: '#0F172A', marginBottom: 16 },
  qCard: { backgroundColor: '#fff', padding: 16, borderRadius: 16, marginBottom: 16, borderWidth: 1, borderColor: '#E2E8F0' },
  qIndex: { fontSize: 12, fontWeight: '700', color: '#94A3B8', textTransform: 'uppercase', marginBottom: 8, letterSpacing: 0.5 },
  qText: { fontSize: 15, color: '#0F172A', fontWeight: '600', lineHeight: 22, marginBottom: 12 },
  answersRow: { flexDirection: 'row', gap: 8, marginBottom: 12 },
  badge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 6 },
  badgeSuccess: { backgroundColor: '#D1FAE5' },
  badgeDanger: { backgroundColor: '#FEE2E2' },
  badgeText: { fontSize: 12, fontWeight: '700', color: '#0F172A' },
  explanationBox: { backgroundColor: '#F8FAFC', padding: 12, borderRadius: 12, borderWidth: 1, borderColor: '#F1F5F9' },
  explanationLabel: { fontSize: 13, fontWeight: '700', color: '#475569', marginBottom: 6 },
  explanationText: { fontSize: 13, color: '#475569', lineHeight: 20 }
});
