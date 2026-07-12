// ─── screens/tracks/CompanyTracksScreen.tsx ───────────────────────
import React, { useEffect, useState, useCallback } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet,
  ActivityIndicator, RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AppStackParamList } from '../../navigation/types';
import { getCompanyTracks, CompanyTrack } from '../../../config/client';

type Nav = NativeStackNavigationProp<AppStackParamList>;

function isLive(track: CompanyTrack): boolean {
  return track.stages.some((s) => s.status === 'live');
}

// ── BankReady is a separate module, not a CompanyTrack — hardcoded ──
const BANK_READY_CARD = {
  id: 'bank',
  emoji: '🏦',
  name: 'Banking Exams',
  tag: 'LIVE',
  stages: '639+ Qs',
  screen: 'BankReady' as keyof AppStackParamList,
  brandColor: '#1D4ED8',
};

export default function CompanyTracksScreen() {
  const navigation = useNavigation<Nav>();
  const [tracks, setTracks]         = useState<CompanyTrack[]>([]);
  const [loading, setLoading]       = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError]           = useState('');

  const loadTracks = useCallback(async () => {
    try {
      setError('');
      const data = await getCompanyTracks();
      setTracks(data);
    } catch {
      setError('Failed to load tracks. Pull down to retry.');
    }
  }, []);

  useEffect(() => {
    setLoading(true);
    loadTracks().finally(() => setLoading(false));
  }, [loadTracks]);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadTracks();
    setRefreshing(false);
  };

  // BankReady's card always counts as live, plus any live dynamic tracks
  const liveCount = 1 + tracks.filter(isLive).length;

  const handlePress = (track: CompanyTrack) => {
    if (isLive(track)) {
      navigation.navigate('CompanyTrackHome' as any, { companyId: track.companyId });
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#1D4ED8" />}
      >

        <Text style={styles.title}>Company{'\n'}Prep Tracks</Text>
        <Text style={styles.sub}>Company-specific test simulations — exact formats, difficulty, and context used by each employer's screening platform.</Text>

        <View style={styles.liveLabel}>
          <View style={styles.liveDot} />
          <Text style={styles.liveLabelText}>{liveCount} track{liveCount === 1 ? '' : 's'} live now</Text>
        </View>

        {loading && (
          <View style={styles.loadingBox}>
            <ActivityIndicator size="large" color="#1D4ED8" />
            <Text style={styles.loadingText}>Loading tracks…</Text>
          </View>
        )}

        {!loading && error !== '' && (
          <View style={styles.errorBox}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        {/* Compact grid — 2 columns */}
        {!loading && (
          <View style={styles.grid}>

            {/* Hardcoded BankReady card — always shown first */}
            <TouchableOpacity
              style={[styles.card, { borderColor: BANK_READY_CARD.brandColor }, styles.cardActive]}
              onPress={() => navigation.navigate(BANK_READY_CARD.screen as any)}
              activeOpacity={0.85}
            >
              <View style={styles.cardTop}>
                <View style={[styles.emojiBox, { backgroundColor: `${BANK_READY_CARD.brandColor}15` }]}>
                  <Text style={styles.emoji}>{BANK_READY_CARD.emoji}</Text>
                </View>
                <View style={[styles.tag, { backgroundColor: '#D1FAE5' }]}>
                  <Text style={[styles.tagText, { color: '#059669' }]}>LIVE</Text>
                </View>
              </View>
              <Text style={styles.cardName} numberOfLines={1}>{BANK_READY_CARD.name}</Text>
              <Text style={styles.metaText}>📐 {BANK_READY_CARD.stages}</Text>
              <Text style={[styles.ctaText, { color: BANK_READY_CARD.brandColor }]}>Start →</Text>
            </TouchableOpacity>

            {/* Dynamic company tracks from backend */}
            {tracks.map((t) => {
              const live = isLive(t);
              const liveStageCount = t.stages.filter((s) => s.status === 'live').length;
              return (
                <TouchableOpacity
                  key={t.companyId}
                  style={[styles.card, { borderColor: live ? t.brandColor : '#E2E8F0' }, live && styles.cardActive]}
                  onPress={() => handlePress(t)}
                  activeOpacity={live ? 0.85 : 1}
                  disabled={!live}
                >
                  <View style={styles.cardTop}>
                    <View style={[styles.emojiBox, { backgroundColor: live ? `${t.brandColor}15` : '#F8FAFC' }]}>
                      <Text style={styles.emoji}>{t.emoji}</Text>
                    </View>
                    <View style={[styles.tag, { backgroundColor: live ? '#D1FAE5' : '#FEF3C7' }]}>
                      <Text style={[styles.tagText, { color: live ? '#059669' : '#D97706' }]}>
                        {live ? 'LIVE' : 'SOON'}
                      </Text>
                    </View>
                  </View>

                  <Text style={[styles.cardName, !live && styles.cardNameMuted]} numberOfLines={1}>
                    {t.name}
                  </Text>
                  <Text style={styles.metaText}>
                    📐 {t.stages.length} stage{t.stages.length === 1 ? '' : 's'}
                    {live ? ` · ${liveStageCount} live` : ''}
                  </Text>

                  {live && (
                    <Text style={[styles.ctaText, { color: t.brandColor }]}>Start →</Text>
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        )}

        <View style={styles.requestCard}>
          <Text style={styles.requestTitle}>Don't see your company?</Text>
          <Text style={styles.requestDesc}>We add new tracks based on demand. If you're preparing for a company not listed, let us know and we'll prioritize it.</Text>
          <TouchableOpacity style={styles.requestBtn}>
            <Text style={styles.requestBtnText}>Request a Track</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe:   { flex: 1, backgroundColor: '#F8FAFC' },
  scroll: { padding: 20, paddingBottom: 48 },

  title: { fontSize: 28, fontWeight: '800', color: '#0F172A', lineHeight: 34, letterSpacing: -0.5, marginBottom: 8 },
  sub:   { fontSize: 13, color: '#475569', lineHeight: 20, marginBottom: 20 },

  liveLabel:     { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 14 },
  liveDot:       { width: 8, height: 8, borderRadius: 4, backgroundColor: '#059669' },
  liveLabelText: { fontSize: 12, fontWeight: '700', color: '#059669' },

  loadingBox: { alignItems: 'center', paddingVertical: 40, gap: 12 },
  loadingText: { fontSize: 13, color: '#94A3B8' },

  errorBox: { backgroundColor: '#FEF2F2', borderWidth: 1, borderColor: '#FECACA', borderRadius: 14, padding: 16, marginBottom: 16 },
  errorText: { fontSize: 13, color: '#DC2626', textAlign: 'center' },

  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },

  card: {
    width: '47.5%',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderRadius: 16,
    padding: 12,
  },
  cardActive: {
    borderWidth: 1.5,
    shadowColor: '#1D4ED8',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },

  cardTop:  { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  emojiBox: { width: 36, height: 36, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  emoji:    { fontSize: 18 },
  tag:      { paddingHorizontal: 7, paddingVertical: 3, borderRadius: 999 },
  tagText:  { fontSize: 9, fontWeight: '700', letterSpacing: 0.3 },

  cardName:      { fontSize: 13, fontWeight: '800', color: '#0F172A', marginBottom: 4 },
  cardNameMuted: { color: '#94A3B8' },
  metaText:      { fontSize: 10, color: '#94A3B8', fontWeight: '500', marginBottom: 6 },

  ctaText: { fontSize: 11, fontWeight: '700' },

  requestCard: { backgroundColor: '#F8FAFC', borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 16, padding: 16, marginTop: 20 },
  requestTitle:{ fontSize: 14, fontWeight: '700', color: '#0F172A', marginBottom: 6 },
  requestDesc: { fontSize: 12, color: '#475569', lineHeight: 18, marginBottom: 12 },
  requestBtn:  { backgroundColor: '#fff', borderWidth: 1, borderColor: '#CBD5E1', borderRadius: 999, paddingVertical: 10, alignItems: 'center' },
  requestBtnText: { fontSize: 13, fontWeight: '600', color: '#475569' },
});