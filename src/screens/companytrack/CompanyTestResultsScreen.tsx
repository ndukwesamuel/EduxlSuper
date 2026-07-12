// ─── screens/tracks/CompanyTestResultsScreen.tsx ──────────────────
import React, { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AppStackParamList } from '../../navigation/types';
import {
  CompanyTestResultSummary,
  CompanyWrongAnswerDetail,
} from '../../../config/client';

type Nav = NativeStackNavigationProp<AppStackParamList>;
type Route = RouteProp<{
  params: {
    result: CompanyTestResultSummary;
    wrongAnswerDetails: CompanyWrongAnswerDetail[];
    progress?: { xpEarned: number; streakBonus?: boolean; newBadges?: string[] };
    companyId: string;
    stageName: string;
  };
}, 'params'>;

function getGrade(accuracy: number) {
  if (accuracy >= 80) return { label: 'Excellent! 🎉', color: '#059669' };
  if (accuracy >= 60) return { label: 'Good Job! 👍', color: '#1D4ED8' };
  if (accuracy >= 40) return { label: 'Fair 💪', color: '#D97706' };
  return { label: 'Keep Practising 📚', color: '#DC2626' };
}

export default function CompanyTestResultsScreen() {
  const navigation = useNavigation<Nav>();
  const route = useRoute<Route>();
  const { result, wrongAnswerDetails, progress, companyId, stageName } = route.params;
  const [reviewOpen, setReviewOpen] = useState(false);

  const grade = getGrade(result.accuracy);
  const mins = Math.floor(result.timeTaken / 60);
  const secs = String(result.timeTaken % 60).padStart(2, '0');

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <TouchableOpacity
        
        onPress={() => navigation.pop(2)}>
          
        {/* // onPress={() => navigation.navigate('CompanyTrackHome' as any, { companyId })}> */}
          <Text style={styles.backText}>← {stageName}</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Results</Text>
        <TouchableOpacity onPress={() => navigation.navigate('CompanyHistory' as any, { companyId })}>
          <Text style={styles.historyText}>History</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

        {/* Score section */}
        <View style={styles.scoreSection}>
          <View style={styles.ring}>
            <Text style={styles.ringPct}>{result.accuracy}%</Text>
            <Text style={styles.ringLabel}>Accuracy</Text>
          </View>
          <Text style={[styles.grade, { color: grade.color }]}>{grade.label}</Text>
          <Text style={styles.scoreSub}>
            You scored <Text style={styles.scoreHighlight}>{result.score} out of {result.totalQuestions}</Text>
          </Text>
        </View>

        {/* XP banner */}
        {progress && progress.xpEarned > 0 && (
          <View style={styles.xpBanner}>
            <Text style={styles.xpBannerText}>⭐ +{progress.xpEarned} XP earned!</Text>
            {progress.streakBonus && <Text style={styles.xpBonusText}>🔥 Streak bonus included</Text>}
            {progress.newBadges && progress.newBadges.length > 0 && (
              <Text style={styles.xpBonusText}>🏅 New badge unlocked!</Text>
            )}
          </View>
        )}

        {/* Stats grid */}
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <Text style={styles.statIcon}>🎯</Text>
            <Text style={styles.statValue}>{result.score}/{result.totalQuestions}</Text>
            <Text style={styles.statLabel}>Score</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statIcon}>📊</Text>
            <Text style={styles.statValue}>{result.accuracy}%</Text>
            <Text style={styles.statLabel}>Accuracy</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statIcon}>⏱️</Text>
            <Text style={styles.statValue}>{mins}m {secs}s</Text>
            <Text style={styles.statLabel}>Time</Text>
          </View>
        </View>

        {/* Weak areas */}
        {result.weakAreas.length > 0 && (
          <View style={styles.weakCard}>
            <Text style={styles.weakTitle}>⚠️ Areas to Improve</Text>
            <Text style={styles.weakSub}>You missed the most questions in:</Text>
            <View style={styles.weakTags}>
              {result.weakAreas.map((a) => (
                <View key={a} style={styles.tag}>
                  <Text style={styles.tagText}>{a}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Wrong answer review */}
        {wrongAnswerDetails.length > 0 && (
          <TouchableOpacity style={styles.reviewToggle} onPress={() => setReviewOpen((o) => !o)} activeOpacity={0.7}>
            <View style={styles.reviewToggleLeft}>
              <Text style={{ fontSize: 20 }}>📖</Text>
              <View>
                <Text style={styles.reviewToggleTitle}>Review Wrong Answers</Text>
                <Text style={styles.reviewToggleSub}>
                  {wrongAnswerDetails.length} question{wrongAnswerDetails.length > 1 ? 's' : ''} with explanations
                </Text>
              </View>
            </View>
            <Text style={styles.reviewChevron}>{reviewOpen ? '▲' : '▼'}</Text>
          </TouchableOpacity>
        )}

        {reviewOpen && wrongAnswerDetails.map((item, i) => (
          <View key={item.questionId} style={styles.wrongCard}>
            <Text style={styles.wrongQuestion}>{i + 1}. {item.questionText}</Text>
            <View style={styles.wrongAnswerRow}>
              <View style={[styles.tag, styles.tagWrong]}>
                <Text style={styles.tagWrongText}>Yours: {item.yourAnswer}</Text>
              </View>
              <View style={[styles.tag, styles.tagCorrect]}>
                <Text style={styles.tagCorrectText}>Correct: {item.correctAnswer}</Text>
              </View>
            </View>
            <View style={styles.explanationBox}>
              <Text style={styles.explanationLabel}>Explanation</Text>
              <Text style={styles.explanationText}>{item.explanation}</Text>
            </View>
          </View>
        ))}

        {/* CTAs */}
        <View style={styles.ctaRow}>
          <TouchableOpacity
            style={styles.primaryBtn}
            onPress={() => navigation.navigate('AptitudeTestStage' as any, {
              companyId, stageType: result.stageType, stageName,
            })}
            activeOpacity={0.85}
          >
            <Text style={styles.primaryBtnText}>Retake →</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.secondaryBtn}
            onPress={() => navigation.navigate('CompanyTrackHome' as any, { companyId })}
            activeOpacity={0.85}
          >
            <Text style={styles.secondaryBtnText}>Back to Track</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.ghostBtn}
          onPress={() => navigation.navigate('CompanyHistory' as any, { companyId })}
        >
          <Text style={styles.ghostBtnText}>View My Progress</Text>
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe:   { flex: 1, backgroundColor: '#F8FAFC' },
  scroll: { padding: 20, paddingBottom: 40 },

  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 14, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#E2E8F0' },
  backText: { fontSize: 14, color: '#1D4ED8', fontWeight: '500' },
  headerTitle: { fontSize: 16, fontWeight: '700', color: '#0F172A' },
  historyText: { fontSize: 14, color: '#475569' },

  scoreSection: { alignItems: 'center', paddingVertical: 32 },
  ring: { width: 140, height: 140, borderRadius: 70, borderWidth: 8, borderColor: '#1D4ED8', alignItems: 'center', justifyContent: 'center' },
  ringPct: { fontSize: 30, fontWeight: '800', color: '#0F172A' },
  ringLabel: { fontSize: 11, color: '#94A3B8' },
  grade: { fontSize: 22, fontWeight: '700', marginTop: 16 },
  scoreSub: { fontSize: 14, color: '#475569', marginTop: 6 },
  scoreHighlight: { fontWeight: '700', color: '#0F172A' },

  xpBanner: { backgroundColor: '#FFFBEB', borderRadius: 14, padding: 16, borderWidth: 1, borderColor: '#FDE68A', marginBottom: 16, alignItems: 'center', gap: 4 },
  xpBannerText: { fontSize: 16, fontWeight: '700', color: '#D97706' },
  xpBonusText: { fontSize: 12, color: '#475569' },

  statsGrid: { flexDirection: 'row', gap: 10, marginBottom: 16 },
  statCard: { flex: 1, backgroundColor: '#fff', borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 14, padding: 14, alignItems: 'center', gap: 4 },
  statIcon: { fontSize: 20 },
  statValue: { fontSize: 16, fontWeight: '700', color: '#0F172A' },
  statLabel: { fontSize: 10, color: '#94A3B8' },

  weakCard: { backgroundColor: '#fff', borderWidth: 1, borderColor: '#E2E8F0', borderLeftWidth: 3, borderLeftColor: '#D97706', borderRadius: 14, padding: 14, marginBottom: 16 },
  weakTitle: { fontSize: 14, fontWeight: '700', color: '#0F172A', marginBottom: 4 },
  weakSub: { fontSize: 12, color: '#475569', marginBottom: 10 },
  weakTags: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  tag: { backgroundColor: '#F1F5F9', borderRadius: 999, paddingHorizontal: 10, paddingVertical: 4 },
  tagText: { fontSize: 11, color: '#475569', fontWeight: '600' },

  reviewToggle: { backgroundColor: '#fff', borderRadius: 14, padding: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderWidth: 1, borderColor: '#E2E8F0', marginBottom: 8 },
  reviewToggleLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  reviewToggleTitle: { fontSize: 14, fontWeight: '600', color: '#0F172A' },
  reviewToggleSub: { fontSize: 11, color: '#94A3B8', marginTop: 2 },
  reviewChevron: { fontSize: 13, color: '#94A3B8' },

  wrongCard: { backgroundColor: '#fff', borderWidth: 1, borderColor: '#E2E8F0', borderLeftWidth: 3, borderLeftColor: '#DC2626', borderRadius: 14, padding: 14, marginBottom: 10 },
  wrongQuestion: { fontSize: 13, color: '#0F172A', fontWeight: '500', lineHeight: 20, marginBottom: 10 },
  wrongAnswerRow: { flexDirection: 'row', gap: 8, marginBottom: 10 },
  tagWrong: { backgroundColor: '#FEF2F2' },
  tagWrongText: { fontSize: 11, color: '#DC2626', fontWeight: '600' },
  tagCorrect: { backgroundColor: '#D1FAE5' },
  tagCorrectText: { fontSize: 11, color: '#059669', fontWeight: '600' },
  explanationBox: { backgroundColor: '#F8FAFC', borderRadius: 10, padding: 12 },
  explanationLabel: { fontSize: 10, fontWeight: '700', color: '#94A3B8', marginBottom: 4, textTransform: 'uppercase' },
  explanationText: { fontSize: 12, color: '#475569', lineHeight: 18 },

  ctaRow: { flexDirection: 'row', gap: 10, marginBottom: 10, marginTop: 8 },
  primaryBtn: { flex: 1, backgroundColor: '#1D4ED8', height: 50, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  primaryBtnText: { color: '#fff', fontWeight: '700', fontSize: 14 },
  secondaryBtn: { flex: 1, backgroundColor: '#F1F5F9', height: 50, borderRadius: 12, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#E2E8F0' },
  secondaryBtnText: { color: '#0F172A', fontWeight: '700', fontSize: 14 },

  ghostBtn: { alignItems: 'center', paddingVertical: 12 },
  ghostBtnText: { color: '#475569', fontWeight: '500', fontSize: 14 },
});
