// ─── screens/tracks/CompanyHistoryScreen.tsx ──────────────────────
import React, { useEffect, useState, useCallback } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet,
  ActivityIndicator, RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AppStackParamList } from '../../navigation/types';
import { getCompanyHistory, CompanyHistoryAttempt } from '../../../config/client';

type Nav = NativeStackNavigationProp<AppStackParamList>;
type Route = RouteProp<{ params: { companyId: string } }, 'params'>;

function accColor(a: number) {
  return a >= 80 ? '#059669' : a >= 60 ? '#1D4ED8' : a >= 40 ? '#D97706' : '#DC2626';
}
function fmtTime(s: number) {
  return `${Math.floor(s / 60)}m ${String(s % 60).padStart(2, '0')}s`;
}
function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-NG', { day: 'numeric', month: 'short', year: 'numeric' });
}

export default function CompanyHistoryScreen() {
  const navigation = useNavigation<Nav>();
  const route = useRoute<Route>();
  const { companyId } = route.params;

  const [attempts, setAttempts] = useState<CompanyHistoryAttempt[]>([]);
  const [trend, setTrend] = useState<{ firstAttemptAccuracy: number; latestAttemptAccuracy: number; change: number; improving: boolean } | null>(null);
  const [totalAttempts, setTotalAttempts] = useState(0);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    try {
      setError('');
      const res = await getCompanyHistory(companyId);
      setAttempts(res.history);
      setTrend(res.trend);
      setTotalAttempts(res.totalAttempts);
    } catch {
      setError('Failed to load history.');
    }
  }, [companyId]);

  useEffect(() => {
    setLoading(true);
    load().finally(() => setLoading(false));
  }, [load]);

  const onRefresh = async () => {
    setRefreshing(true);
    await load();
    setRefreshing(false);
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Progress</Text>
        <View style={{ width: 50 }} />
      </View>

      {loading ? (
        <View style={styles.loadingBox}>
          <ActivityIndicator size="large" color="#1D4ED8" />
          <Text style={styles.loadingText}>Loading history…</Text>
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={styles.scroll}
          showsVerticalScrollIndicator={false}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#1D4ED8" />}
        >
          {error !== '' && (
            <View style={styles.errorBox}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          )}

          {totalAttempts === 0 ? (
            <View style={styles.empty}>
              <Text style={{ fontSize: 48 }}>📋</Text>
              <Text style={styles.emptyTitle}>No attempts yet</Text>
              <Text style={styles.emptySub}>Take a test to start tracking your progress.</Text>
            </View>
          ) : (
            <>
              <Text style={styles.attemptCount}>{totalAttempts} attempt{totalAttempts !== 1 ? 's' : ''} completed</Text>

              {trend && (
                <View style={[styles.trendCard, { borderLeftColor: trend.improving ? '#059669' : '#D97706' }]}>
                  <Text style={{ fontSize: 26 }}>{trend.improving ? '📈' : '📉'}</Text>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.trendTitle}>
                      {trend.improving ? `Improving! +${trend.change}%` : `Down ${Math.abs(trend.change)}% — keep practising!`}
                    </Text>
                    <Text style={styles.trendSub}>
                      First: <Text style={styles.trendBold}>{trend.firstAttemptAccuracy}%</Text>{'  →  '}
                      Latest: <Text style={[styles.trendBold, { color: accColor(trend.latestAttemptAccuracy) }]}>{trend.latestAttemptAccuracy}%</Text>
                    </Text>
                  </View>
                </View>
              )}

              <Text style={styles.sectionTitle}>ALL ATTEMPTS</Text>
              {[...attempts].reverse().map((attempt) => (
                <View key={attempt._id} style={styles.attemptCard}>
                  <View style={styles.attemptHeader}>
                    <Text style={styles.attemptTitle}>
                      Attempt {attempt.attemptNumber} · {attempt.category}
                    </Text>
                    <Text style={[styles.attemptAccuracy, { color: accColor(attempt.accuracy) }]}>
                      {attempt.accuracy}%
                    </Text>
                  </View>
                  <View style={styles.barTrack}>
                    <View style={[styles.barFill, { width: `${attempt.accuracy}%` as any, backgroundColor: accColor(attempt.accuracy) }]} />
                  </View>
                  <View style={styles.attemptMeta}>
                    <Text style={styles.metaText}>🎯 {attempt.score}/{attempt.totalQuestions}</Text>
                    <Text style={styles.metaText}>⏱️ {fmtTime(attempt.timeTaken)}</Text>
                    <Text style={styles.metaText}>📅 {fmtDate(attempt.createdAt)}</Text>
                  </View>
                  {attempt.weakAreas.length > 0 && (
                    <View style={styles.weakRow}>
                      <Text style={styles.weakLabel}>Weak areas:</Text>
                      {attempt.weakAreas.map((a) => (
                        <View key={a} style={styles.tag}>
                          <Text style={styles.tagText}>{a}</Text>
                        </View>
                      ))}
                    </View>
                  )}
                </View>
              ))}
            </>
          )}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe:   { flex: 1, backgroundColor: '#F8FAFC' },
  scroll: { padding: 20, paddingBottom: 40 },

  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 14, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#E2E8F0' },
  backText: { fontSize: 14, color: '#1D4ED8', fontWeight: '500' },
  headerTitle: { fontSize: 16, fontWeight: '700', color: '#0F172A' },

  loadingBox: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12 },
  loadingText: { fontSize: 13, color: '#94A3B8' },

  errorBox: { backgroundColor: '#FEF2F2', borderWidth: 1, borderColor: '#FECACA', borderRadius: 14, padding: 16, marginBottom: 16 },
  errorText: { fontSize: 13, color: '#DC2626', textAlign: 'center' },

  empty: { alignItems: 'center', paddingVertical: 60, gap: 12 },
  emptyTitle: { fontSize: 18, fontWeight: '700', color: '#0F172A' },
  emptySub: { fontSize: 13, color: '#475569', textAlign: 'center' },

  attemptCount: { fontSize: 12, color: '#94A3B8', marginBottom: 16 },

  trendCard: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: '#fff', borderWidth: 1, borderColor: '#E2E8F0', borderLeftWidth: 4, borderRadius: 14, padding: 14, marginBottom: 20 },
  trendTitle: { fontSize: 14, fontWeight: '600', color: '#0F172A' },
  trendSub: { fontSize: 12, color: '#475569', marginTop: 4 },
  trendBold: { fontWeight: '700', color: '#0F172A' },

  sectionTitle: { fontSize: 11, fontWeight: '700', color: '#94A3B8', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 12 },

  attemptCard: { backgroundColor: '#fff', borderWidth: 1.5, borderColor: '#E2E8F0', borderRadius: 14, padding: 14, marginBottom: 10 },
  attemptHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  attemptTitle: { fontSize: 14, fontWeight: '600', color: '#0F172A' },
  attemptAccuracy: { fontSize: 20, fontWeight: '800' },
  barTrack: { height: 6, backgroundColor: '#F1F5F9', borderRadius: 999, overflow: 'hidden', marginBottom: 8 },
  barFill: { height: '100%', borderRadius: 999 },
  attemptMeta: { flexDirection: 'row', gap: 16, flexWrap: 'wrap' },
  metaText: { fontSize: 11, color: '#94A3B8' },
  weakRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, alignItems: 'center', marginTop: 8 },
  weakLabel: { fontSize: 11, color: '#94A3B8' },
  tag: { backgroundColor: '#F1F5F9', borderRadius: 999, paddingHorizontal: 10, paddingVertical: 4 },
  tagText: { fontSize: 11, color: '#475569', fontWeight: '600' },
});
