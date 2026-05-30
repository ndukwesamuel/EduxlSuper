// ─── DrillSubjectScreen.tsx ───────────────────────────────────────
import React, { useEffect, useState, useCallback } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  StyleSheet, Alert, RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp, useFocusEffect } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AppStackParamList } from '../../navigation/types';
import { Colors, FontSize, Radius, Spacing, Shadows } from '../../theme';
import CCCard from '../../components/CCCard';
import CCLoader from '../../components/CCLoader';
import { getSubject, getDrillStats } from "../../../config/client" 

type Nav   = NativeStackNavigationProp<AppStackParamList>;
type Route = RouteProp<AppStackParamList, 'DrillSubject'>;

export default function DrillSubjectScreen() {
  const navigation = useNavigation<Nav>();
  const route      = useRoute<Route>();
  const { subjectId, subjectName } = route.params;

  const [subject, setSubject]   = useState<any>(null);
  const [stats, setStats]       = useState<any>(null);
  const [loading, setLoading]   = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const load = async () => {
    try {
      const [s, st] = await Promise.all([
        getSubject(subjectId),
        getDrillStats(subjectId),
      ]);
      setSubject(s);
      setStats(st);
    } catch {
      Alert.alert('Error', 'Could not load subject');
    }
  };

  useFocusEffect(useCallback(() => {
    load().finally(() => setLoading(false));
  }, [subjectId]));

  const onRefresh = async () => {
    setRefreshing(true);
    await load();
    setRefreshing(false);
  };

  const startSession = (mode: 'practice' | 'exam' | 'weak') => {
    if ((subject?.totalQuestions ?? 0) === 0) {
      return Alert.alert('No questions', 'Add questions to this subject first before starting a session.');
    }
    if (mode === 'weak' && (subject?.weakCount ?? 0) === 0) {
      return Alert.alert('No weak questions', 'Keep practicing and weak questions will appear here automatically.');
    }
    navigation.navigate('DrillSession', { subjectId, subjectName, mode });
  };

  if (loading) return <CCLoader />;

  const recentSessions = subject?.sessions?.slice(0, 5) ?? [];

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Colors.brand} />}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <Text style={styles.backText}>← Back</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => navigation.navigate('DrillAddQuestions', { subjectId, subjectName })}
            style={styles.addBtn}
          >
            <Text style={styles.addBtnText}>+ Add</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.subjectName}>{subjectName}</Text>

        {/* Stats row */}
        <View style={styles.statsRow}>
          <View style={styles.statBox}>
            <Text style={styles.statNum}>{subject?.totalQuestions ?? 0}</Text>
            <Text style={styles.statLabel}>Questions</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statNum}>{stats?.avgScore ?? 0}/10</Text>
            <Text style={styles.statLabel}>Avg score</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statNum}>{stats?.bestScore ?? 0}/10</Text>
            <Text style={styles.statLabel}>Best</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statNum}>{stats?.totalSessions ?? 0}</Text>
            <Text style={styles.statLabel}>Sessions</Text>
          </View>
        </View>

        {/* Mode buttons */}
        <Text style={styles.sectionTitle}>Start a session</Text>

        <TouchableOpacity style={styles.modeCard} onPress={() => startSession('practice')} activeOpacity={0.8}>
          <View style={[styles.modeIcon, { backgroundColor: '#EEF2FF' }]}>
            <Text style={{ fontSize: 24 }}>📚</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.modeTitle}>Practice Mode</Text>
            <Text style={styles.modeDesc}>No timer. Instant feedback after each question.</Text>
          </View>
          <Text style={styles.arrow}>→</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.modeCard} onPress={() => startSession('exam')} activeOpacity={0.8}>
          <View style={[styles.modeIcon, { backgroundColor: '#FFF7ED' }]}>
            <Text style={{ fontSize: 24 }}>⏱️</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.modeTitle}>Exam Mode</Text>
            <Text style={styles.modeDesc}>Timed. No feedback until end. Real exam pressure.</Text>
          </View>
          <Text style={styles.arrow}>→</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.modeCard, (subject?.weakCount ?? 0) === 0 && styles.modeCardDisabled]}
          onPress={() => startSession('weak')}
          activeOpacity={0.8}
        >
          <View style={[styles.modeIcon, { backgroundColor: '#FEF3C7' }]}>
            <Text style={{ fontSize: 24 }}>⚠️</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.modeTitle}>
              Weak Questions {subject?.weakCount > 0 ? `(${subject.weakCount})` : ''}
            </Text>
            <Text style={styles.modeDesc}>
              {(subject?.weakCount ?? 0) === 0
                ? 'Practice more to identify your weak spots'
                : 'Drill only the questions you keep getting wrong'}
            </Text>
          </View>
          <Text style={styles.arrow}>→</Text>
        </TouchableOpacity>

        {/* Recent sessions */}
        {recentSessions.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>Recent sessions</Text>
            <CCCard>
              {recentSessions.map((s: any, i: number) => (
                <View key={s._id} style={[styles.sessionRow, i > 0 && styles.sessionBorder]}>
                  <View>
                    <Text style={styles.sessionMode}>{s.mode} mode</Text>
                    <Text style={styles.sessionDate}>
                      {new Date(s.completedAt).toLocaleDateString('en-NG', { day: 'numeric', month: 'short' })}
                    </Text>
                  </View>
                  <Text style={[styles.sessionScore, { color: s.score >= 7 ? '#059669' : s.score >= 5 ? Colors.brand : '#DC2626' }]}>
                    {s.score}/10
                  </Text>
                </View>
              ))}
            </CCCard>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe:   { flex: 1, backgroundColor: Colors.background },
  scroll: { padding: Spacing.lg, paddingBottom: Spacing['5xl'] },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: Spacing.lg },
  backBtn: { paddingVertical: 4 },
  backText: { fontSize: FontSize.body, color: Colors.brand, fontWeight: '600' },
  addBtn: { backgroundColor: Colors.brand, paddingHorizontal: 16, paddingVertical: 8, borderRadius: Radius.full },
  addBtnText: { fontSize: FontSize.body, fontWeight: '700', color: '#fff' },
  subjectName: { fontSize: FontSize.displayL, fontWeight: '800', color: Colors.textPrimary, marginBottom: Spacing['2xl'] },
  statsRow: { flexDirection: 'row', gap: 8, marginBottom: Spacing['2xl'] },
  statBox: { flex: 1, backgroundColor: Colors.surface, borderRadius: Radius.md, padding: 10, alignItems: 'center', borderWidth: 1, borderColor: Colors.border },
  statNum: { fontSize: FontSize.heading2, fontWeight: '800', color: Colors.textPrimary },
  statLabel: { fontSize: FontSize.micro, color: Colors.textMuted, marginTop: 2 },
  sectionTitle: { fontSize: FontSize.heading3, fontWeight: '700', color: Colors.textPrimary, marginBottom: Spacing.md, marginTop: Spacing.sm },
  modeCard: { backgroundColor: Colors.surface, borderRadius: Radius.xl, padding: Spacing.lg, marginBottom: Spacing.md, flexDirection: 'row', alignItems: 'center', gap: Spacing.md, borderWidth: 1, borderColor: Colors.border, ...Shadows.sm },
  modeCardDisabled: { opacity: 0.5 },
  modeIcon: { width: 52, height: 52, borderRadius: Radius.md, alignItems: 'center', justifyContent: 'center' },
  modeTitle: { fontSize: FontSize.bodyLarge, fontWeight: '700', color: Colors.textPrimary, marginBottom: 2 },
  modeDesc: { fontSize: FontSize.bodySmall, color: Colors.textSecondary, lineHeight: 18 },
  arrow: { fontSize: 18, color: Colors.textMuted },
  sessionRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 10 },
  sessionBorder: { borderTopWidth: 1, borderTopColor: Colors.border },
  sessionMode: { fontSize: FontSize.body, fontWeight: '600', color: Colors.textPrimary, textTransform: 'capitalize' },
  sessionDate: { fontSize: FontSize.caption, color: Colors.textMuted, marginTop: 2 },
  sessionScore: { fontSize: FontSize.heading2, fontWeight: '800' },
});
