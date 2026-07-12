// ─── screens/tracks/CompanyTrackHomeScreen.tsx ────────────────────
import React, { useEffect, useState, useCallback } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet, ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AppStackParamList } from '../../navigation/types';
import { getCompanyTrack, CompanyTrack, StageConfig, StageType } from '../../../config/client';

type Nav   = NativeStackNavigationProp<AppStackParamList>;
type Route = RouteProp<{ params: { companyId: string } }, 'params'>;

// ── Stage type → icon + color mapping (generic, reused across all companies) ──
const STAGE_STYLE: Record<StageType, { emoji: string; iconBg: string }> = {
  cv_gate:           { emoji: '📄', iconBg: '#D1FAE5' },
  aptitude_test:     { emoji: '🧠', iconBg: '#EFF6FF' },
  psychometric:      { emoji: '📊', iconBg: '#FEF3C7' },
  assessment_center: { emoji: '🏢', iconBg: '#EDE9FE' },
  essay_practice:    { emoji: '✍️', iconBg: '#FCE7F3' },
  interview:         { emoji: '🎤', iconBg: '#FFF7ED' },
  onboarding:        { emoji: '🎓', iconBg: '#ECFDF5' },
};

// ── Maps a stage to which screen it should open (only used when live) ──
function getStageScreen(stageType: StageType): keyof AppStackParamList | null {
  switch (stageType) {
    case 'aptitude_test': return 'AptitudeTestStage' as any;
    // Other stage screens can be added here as they're built:
    // case 'cv_gate': return 'CVGateStage' as any;
    // case 'psychometric': return 'PsychometricStage' as any;
    default: return null;
  }
}

export default function CompanyTrackHomeScreen() {
  const navigation = useNavigation<Nav>();
  const route      = useRoute<Route>();
  const { companyId } = route.params;

  const [track, setTrack]     = useState<CompanyTrack | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState('');

  const loadTrack = useCallback(async () => {
    try {
      setError('');
      const data = await getCompanyTrack(companyId);
      setTrack(data);
    } catch {
      setError('Failed to load this company track.');
    }
  }, [companyId]);

  useEffect(() => {
    setLoading(true);
    loadTrack().finally(() => setLoading(false));
  }, [loadTrack]);

  const handleStagePress = (stage: StageConfig) => {
    if (stage.status !== 'live') {
      navigation.navigate('ComingSoonStage' as any, {
        stageName: stage.name,
        message: stage.fallbackMessage ?? 'This stage is coming soon.',
      });
      return;
    }

    const screen = getStageScreen(stage.type);
    if (screen) {
      navigation.navigate(screen as any, {
        companyId: track?.companyId,
        stageType: stage.type,
        stageName: stage.name,
      });
    } else {
      // Live but no screen built yet — fall back gracefully
      navigation.navigate('ComingSoonStage' as any, {
        stageName: stage.name,
        message: 'This stage is being finalized. Check back shortly.',
      });
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.loadingBox}>
          <ActivityIndicator size="large" color="#1D4ED8" />
          <Text style={styles.loadingText}>Loading track…</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error || !track) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.backRow}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.backBtn}>← Company Tracks</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.errorBox}>
          <Text style={styles.errorText}>{error || 'Track not found.'}</Text>
        </View>
      </SafeAreaView>
    );
  }

  const sortedStages = [...track.stages].sort((a, b) => a.order - b.order);
  const liveStages   = sortedStages.filter((s) => s.status === 'live');

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

        {/* Back row */}
        <View style={styles.backRow}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.backBtn}>← Company Tracks</Text>
          </TouchableOpacity>
          <View style={[styles.badge, { backgroundColor: `${track.brandColor}15`, borderColor: `${track.brandColor}30` }]}>
            <Text style={[styles.badgeText, { color: track.brandColor }]}>
              {track.name.toUpperCase()}
            </Text>
          </View>
        </View>

        {/* Hero */}
        <View style={[styles.hero, { backgroundColor: track.brandColor }]}>
          <Text style={styles.heroEmoji}>{track.emoji}</Text>
          <Text style={styles.heroTitle}>{track.name}{'\n'}Recruitment Prep</Text>
          <Text style={styles.heroSubtitle}>
            Practice the exact stages of {track.name}'s real recruitment pipeline.
          </Text>
          <View style={styles.heroStatsRow}>
            <View style={styles.heroStat}>
              <Text style={styles.heroStatValue}>{sortedStages.length}</Text>
              <Text style={styles.heroStatLabel}>Stages</Text>
            </View>
            <View style={styles.heroStat}>
              <Text style={styles.heroStatValue}>{liveStages.length}</Text>
              <Text style={styles.heroStatLabel}>Live Now</Text>
            </View>
          </View>
        </View>


        <View
        style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12, marginTop: 20 }}
        >
          <TouchableOpacity onPress={() => navigation.navigate('CompanyHistory' as any, { companyId })}>
            <Text style={{ fontSize: 14, fontWeight: '700', color: '#1D4ED8' }}>My Progress</Text>
          </TouchableOpacity>

        </View>
          


        {/* Stages */}
        <Text style={styles.secLabel}>Recruitment Stages</Text>
        {sortedStages.map((stage) => {
          const style = STAGE_STYLE[stage.type] ?? { emoji: '📌', iconBg: '#F1F5F9' };
          const live = stage.status === 'live';

          return (
            <TouchableOpacity
              key={`${stage.type}-${stage.order}`}
              style={[styles.stageCard, live && styles.stageCardLive]}
              onPress={() => handleStagePress(stage)}
              activeOpacity={0.8}
            >
              <View style={[styles.stageIcon, { backgroundColor: style.iconBg }]}>
                <Text style={styles.stageIconText}>{style.emoji}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.stageName}>{stage.name}</Text>
                <Text style={styles.stageMeta}>
                  {live ? 'Ready to practice' : (stage.fallbackMessage ?? 'Coming soon')}
                </Text>
              </View>
              <View style={[styles.statusPill, live ? styles.statusPillLive : styles.statusPillSoon]}>
                <Text style={[styles.statusPillText, live ? styles.statusPillTextLive : styles.statusPillTextSoon]}>
                  {live ? 'LIVE' : 'SOON'}
                </Text>
              </View>
            </TouchableOpacity>
          );
        })}

      </ScrollView>

      {/* Footer CTA — jumps to first live stage */}
      {liveStages.length > 0 && (
        <View style={styles.footer}>
          <TouchableOpacity
            style={[styles.btnPrimary, { backgroundColor: track.brandColor }]}
            onPress={() => handleStagePress(liveStages[0])}
            activeOpacity={0.85}
          >
            <Text style={styles.btnPrimaryText}>Start {liveStages[0].name} →</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe:    { flex: 1, backgroundColor: '#F8FAFC' },
  scroll:  { padding: 20, paddingBottom: 32 },

  loadingBox: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12 },
  loadingText: { fontSize: 13, color: '#94A3B8' },

  errorBox: { margin: 20, backgroundColor: '#FEF2F2', borderWidth: 1, borderColor: '#FECACA', borderRadius: 14, padding: 16 },
  errorText: { fontSize: 13, color: '#DC2626', textAlign: 'center' },

  backRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  backBtn: { fontSize: 14, fontWeight: '600', color: '#1D4ED8' },
  badge:   { marginLeft: 'auto', borderWidth: 1, borderRadius: 999, paddingHorizontal: 10, paddingVertical: 3 },
  badgeText: { fontSize: 10, fontWeight: '700', letterSpacing: 0.5 },

  hero: {
    borderRadius: 20, padding: 20, marginBottom: 24, overflow: 'hidden',
  },
  heroEmoji: { fontSize: 32, marginBottom: 12 },
  heroTitle: { fontSize: 20, fontWeight: '800', color: '#fff', lineHeight: 26, marginBottom: 6 },
  heroSubtitle: { fontSize: 12, color: 'rgba(255,255,255,0.75)', lineHeight: 18, marginBottom: 16 },
  heroStatsRow: { flexDirection: 'row', gap: 20 },
  heroStat: { gap: 2 },
  heroStatValue: { fontSize: 20, fontWeight: '700', color: '#fff' },
  heroStatLabel: { fontSize: 10, color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase', letterSpacing: 0.5 },

  secLabel: { fontSize: 10, fontWeight: '700', color: '#94A3B8', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 12 },

  stageCard: {
    backgroundColor: '#fff', borderWidth: 1, borderColor: '#E2E8F0',
    borderRadius: 16, padding: 14,
    flexDirection: 'row', alignItems: 'center', gap: 14,
    marginBottom: 10,
  },
  stageCardLive: { borderColor: 'rgba(29,78,216,0.2)' },
  stageIcon: { width: 44, height: 44, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  stageIconText: { fontSize: 20 },
  stageName: { fontSize: 14, fontWeight: '700', color: '#0F172A', marginBottom: 2 },
  stageMeta: { fontSize: 11, color: '#475569' },

  statusPill: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 999 },
  statusPillLive: { backgroundColor: '#D1FAE5' },
  statusPillSoon: { backgroundColor: '#FEF3C7' },
  statusPillText: { fontSize: 9, fontWeight: '700', letterSpacing: 0.4 },
  statusPillTextLive: { color: '#059669' },
  statusPillTextSoon: { color: '#D97706' },

  footer: { padding: 20, paddingBottom: 28, backgroundColor: '#F8FAFC', borderTopWidth: 1, borderTopColor: '#E2E8F0' },
  btnPrimary: { borderRadius: 999, paddingVertical: 15, alignItems: 'center', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.28, shadowRadius: 12, elevation: 6 },
  btnPrimaryText: { fontSize: 15, fontWeight: '700', color: '#fff' },
});
