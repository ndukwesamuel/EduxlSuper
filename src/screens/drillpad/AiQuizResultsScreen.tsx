import React, { useState } from 'react';
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
  const { score, total, results, subjectId, subjectName } = route.params;

  const [filter, setFilter] = useState<'all' | 'correct' | 'incorrect'>('all');

  const percentage = Math.round((score / total) * 100);

  let statusText = "Great effort!";
  let statusColor = "#059669"; // Green
  if (percentage >= 80) {
    statusText = "Excellent Performance! 🏆";
    statusColor = "#059669";
  } else if (percentage >= 60) {
    statusText = "Good Job! Keep practicing 💪";
    statusColor = Colors.brand;
  } else {
    statusText = "Needs Review — Check detailed solutions below 💡";
    statusColor = "#DC2626";
  }

  const filteredResults = results.filter(r => {
    if (filter === 'correct') return r.isCorrect;
    if (filter === 'incorrect') return !r.isCorrect;
    return true;
  });

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Quiz Results</Text>
          {subjectName ? <Text style={styles.subjectSub}>{subjectName}</Text> : null}
        </View>
        <TouchableOpacity
          onPress={() => {
            if (subjectId && subjectName) {
              navigation.navigate('DrillSubject', { subjectId, subjectName });
            } else {
              navigation.navigate('DrillPad');
            }
          }}
          style={styles.doneBtn}
        >
          <Text style={styles.doneText}>Done</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.body} contentContainerStyle={{ padding: 20, paddingBottom: 80 }}>
        
        {/* Score Card */}
        <View style={styles.scoreCard}>
          <Text style={styles.scoreLabel}>QUIZ COMPLETED</Text>
          <Text style={styles.scoreVal}>{score} / {total}</Text>
          <Text style={styles.scorePct}>{percentage}% Accuracy</Text>
          <View style={[styles.statusPill, { backgroundColor: statusColor }]}>
            <Text style={styles.statusPillText}>{statusText}</Text>
          </View>
        </View>

        {/* Filter Tabs */}
        <View style={styles.filterRow}>
          <TouchableOpacity
            style={[styles.filterTab, filter === 'all' && styles.filterTabActive]}
            onPress={() => setFilter('all')}
          >
            <Text style={[styles.filterTabText, filter === 'all' && styles.filterTabTextActive]}>
              All ({results.length})
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.filterTab, filter === 'correct' && styles.filterTabActive]}
            onPress={() => setFilter('correct')}
          >
            <Text style={[styles.filterTabText, filter === 'correct' && styles.filterTabTextActive]}>
              Correct ({score})
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.filterTab, filter === 'incorrect' && styles.filterTabActive]}
            onPress={() => setFilter('incorrect')}
          >
            <Text style={[styles.filterTabText, filter === 'incorrect' && styles.filterTabTextActive]}>
              Incorrect ({total - score})
            </Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.reviewTitle}>Detailed Solutions & Explanations</Text>

        {filteredResults.map((r, idx) => {
          const originalIndex = results.indexOf(r) + 1;
          return (
            <View key={idx} style={[styles.qCard, r.isCorrect ? styles.qCardCorrect : styles.qCardIncorrect]}>
              <View style={styles.qHeader}>
                <Text style={styles.qIndex}>Question {originalIndex}</Text>
                <View style={[styles.badge, r.isCorrect ? styles.badgeSuccess : styles.badgeDanger]}>
                  <Text style={[styles.badgeText, r.isCorrect ? styles.badgeTextSuccess : styles.badgeTextDanger]}>
                    {r.isCorrect ? '✓ Correct' : '✕ Incorrect'}
                  </Text>
                </View>
              </View>

              <Text style={styles.qText}>{r.question}</Text>
              
              {/* Options list showing user selection and correct option */}
              <View style={styles.optionsReview}>
                {r.options.map((opt: any) => {
                  const isUserSelected = r.userAnswer === opt.label;
                  const isCorrectOpt = r.correctOption === opt.label;

                  let optBg = '#F8FAFC';
                  let optBorder = '#E2E8F0';
                  let tagText = null;

                  if (isCorrectOpt) {
                    optBg = '#ECFDF5';
                    optBorder = '#10B981';
                    tagText = 'Correct Answer';
                  } else if (isUserSelected && !r.isCorrect) {
                    optBg = '#FEF2F2';
                    optBorder = '#EF4444';
                    tagText = 'Your Choice';
                  }

                  return (
                    <View key={opt.label} style={[styles.optRow, { backgroundColor: optBg, borderColor: optBorder }]}>
                      <Text style={[styles.optLabel, (isCorrectOpt || isUserSelected) && { fontWeight: '800' }]}>
                        {opt.label}. {opt.text}
                      </Text>
                      {tagText ? (
                        <View style={[styles.tag, isCorrectOpt ? styles.tagSuccess : styles.tagDanger]}>
                          <Text style={styles.tagText}>{tagText}</Text>
                        </View>
                      ) : null}
                    </View>
                  );
                })}
              </View>

              {/* Detailed AI Explanation */}
              <View style={styles.explanationBox}>
                <Text style={styles.explanationLabel}>💡 Detailed Solution & Explanation:</Text>
                <Text style={styles.explanationText}>{r.explanation}</Text>
              </View>
            </View>
          );
        })}

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#F8FAFC' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#E2E8F0' },
  title: { fontSize: 18, fontWeight: '800', color: '#0F172A' },
  subjectSub: { fontSize: 12, fontWeight: '600', color: Colors.brand },
  doneBtn: { backgroundColor: Colors.brand, paddingHorizontal: 16, paddingVertical: 8, borderRadius: 999 },
  doneText: { color: '#fff', fontWeight: '700', fontSize: 13 },
  body: { flex: 1 },
  scoreCard: { backgroundColor: '#1E1B4B', padding: 24, borderRadius: 20, alignItems: 'center', marginBottom: 20 },
  scoreLabel: { color: '#94A3B8', fontSize: 12, fontWeight: '800', letterSpacing: 1, marginBottom: 6 },
  scoreVal: { color: '#fff', fontSize: 44, fontWeight: '900' },
  scorePct: { color: '#A5B4FC', fontSize: 16, fontWeight: '700', marginTop: 4, marginBottom: 16 },
  statusPill: { paddingHorizontal: 14, paddingVertical: 6, borderRadius: 999 },
  statusPillText: { color: '#fff', fontSize: 13, fontWeight: '700' },
  filterRow: { flexDirection: 'row', gap: 8, marginBottom: 20 },
  filterTab: { flex: 1, paddingVertical: 10, backgroundColor: '#fff', borderRadius: 12, borderWidth: 1, borderColor: '#E2E8F0', alignItems: 'center' },
  filterTabActive: { backgroundColor: Colors.brand, borderColor: Colors.brand },
  filterTabText: { fontSize: 13, fontWeight: '700', color: '#64748B' },
  filterTabTextActive: { color: '#fff' },
  reviewTitle: { fontSize: 18, fontWeight: '800', color: '#0F172A', marginBottom: 16 },
  qCard: { backgroundColor: '#fff', padding: 16, borderRadius: 18, marginBottom: 16, borderWidth: 1, borderColor: '#E2E8F0' },
  qCardCorrect: { borderColor: '#A7F3D0' },
  qCardIncorrect: { borderColor: '#FECACA' },
  qHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  qIndex: { fontSize: 12, fontWeight: '800', color: '#94A3B8', textTransform: 'uppercase', letterSpacing: 0.5 },
  badge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 6 },
  badgeSuccess: { backgroundColor: '#D1FAE5' },
  badgeDanger: { backgroundColor: '#FEE2E2' },
  badgeText: { fontSize: 12, fontWeight: '800' },
  badgeTextSuccess: { color: '#047857' },
  badgeTextDanger: { color: '#B91C1C' },
  qText: { fontSize: 15, color: '#0F172A', fontWeight: '700', lineHeight: 22, marginBottom: 14 },
  optionsReview: { gap: 8, marginBottom: 14 },
  optRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 12, borderRadius: 10, borderWidth: 1 },
  optLabel: { fontSize: 14, color: '#334155', flex: 1 },
  tag: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 4 },
  tagSuccess: { backgroundColor: '#10B981' },
  tagDanger: { backgroundColor: '#EF4444' },
  tagText: { color: '#fff', fontSize: 10, fontWeight: '800' },
  explanationBox: { backgroundColor: '#F0F9FF', padding: 14, borderRadius: 12, borderWidth: 1, borderColor: '#BAE6FD' },
  explanationLabel: { fontSize: 13, fontWeight: '800', color: '#0369A1', marginBottom: 6 },
  explanationText: { fontSize: 13, color: '#0C4A6E', lineHeight: 20 }
});
