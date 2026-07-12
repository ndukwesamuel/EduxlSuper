// // ─── screens/tracks/CompanyTracksScreen.tsx ───────────────────────
// // Entry hub listing all company prep tracks.
// // Currently only Shell is active — others show "Coming Soon".

// import React from 'react';
// import {
//   View, Text, ScrollView, TouchableOpacity, StyleSheet,
// } from 'react-native';
// import { SafeAreaView } from 'react-native-safe-area-context';
// import { useNavigation } from '@react-navigation/native';
// import { NativeStackNavigationProp } from '@react-navigation/native-stack';
// import { AppStackParamList } from '../../navigation/types';

// type Nav = NativeStackNavigationProp<AppStackParamList>;

// // ── Dummy track data ───────────────────────────────────────────────
// const TRACKS = [
//   {
//     id: 'shell',
//     emoji: '🐚',
//     name: 'Shell Nigeria',
//     desc: 'Graduate Trainee Programme — VJT, CAR behavioral, HireVue video',
//     // tag: 'LIVE',
//     tag: 'COMING SOON',

//     tagColor: '#059669',
//     tagBg: '#D1FAE5',
//     borderColor: '#1D4ED8',
//     screen: 'ShellTrackHome' as keyof AppStackParamList,
//     stages: '4 stages · 16 screens',
//     vendor: 'Cubiks/Talogy Logiks Advanced',
//     active: false,
//   },
//   {
//     id: 'gtbank',
//     emoji: '🏦',
//     name: 'GTBank',
//     desc: 'Graduate Trainee Programme — Dragnet speed test, banking data tables',
//     tag: 'COMING SOON',
//     tagColor: '#D97706',
//     tagBg: '#FEF3C7',
//     borderColor: '#E2E8F0',
//     screen: null,
//     stages: '3 stages · 12 screens',
//     vendor: 'Dragnet / Assessify',
//     active: false,
//   },
//   {
//     id: 'kpmg',
//     emoji: '📋',
//     name: 'KPMG Nigeria',
//     desc: 'Graduate Programme — SHL OPQ, case study, consulting frameworks',
//     tag: 'COMING SOON',
//     tagColor: '#D97706',
//     tagBg: '#FEF3C7',
//     borderColor: '#E2E8F0',
//     screen: null,
//     stages: '3 stages · 14 screens',
//     vendor: 'SHL Verify',
//     active: false,
//   },
//   {
//     id: 'pwc',
//     emoji: '🔵',
//     name: 'PwC Nigeria',
//     desc: 'Graduate Programme — SHL tests, game-based assessment, interviews',
//     tag: 'COMING SOON',
//     tagColor: '#D97706',
//     tagBg: '#FEF3C7',
//     borderColor: '#E2E8F0',
//     screen: null,
//     stages: '3 stages · 13 screens',
//     vendor: 'SHL / Pymetrics',
//     active: false,
//   },
//   {
//     id: 'chevron',
//     emoji: '⛽',
//     name: 'Chevron Nigeria',
//     desc: 'Graduate Trainee — Technical + behavioral, oil & gas context',
//     tag: 'COMING SOON',
//     tagColor: '#D97706',
//     tagBg: '#FEF3C7',
//     borderColor: '#E2E8F0',
//     screen: null,
//     stages: '3 stages · 12 screens',
//     vendor: 'Custom / Workforce Group',
//     active: false,
//   },
//   {
//     id: 'dangote',
//     emoji: '🏭',
//     name: 'Dangote Group',
//     desc: 'Management Trainee — Numerical, verbal, manufacturing context',
//     tag: 'COMING SOON',
//     tagColor: '#D97706',
//     tagBg: '#FEF3C7',
//     borderColor: '#E2E8F0',
//     screen: null,
//     stages: '2 stages · 10 screens',
//     vendor: 'Dragnet',
//     active: false,
//   },
// ];

// export default function CompanyTracksScreen() {
//   const navigation = useNavigation<Nav>();

//   return (
//     <SafeAreaView style={styles.safe}>
//       <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

//         {/* Header */}
//         <View style={styles.backRow}>
//           <TouchableOpacity onPress={() => navigation.goBack()}>
//             <Text style={styles.backBtn}>← Home</Text>
//           </TouchableOpacity>
//         </View>

//         <Text style={styles.title}>Company{'\n'}Prep Tracks</Text>
//         <Text style={styles.sub}>Company-specific test simulations — exact formats, difficulty, and context used by each employer's screening platform.</Text>

//         {/* Live track highlight */}
//         <View style={styles.liveLabel}>
//           <View style={styles.liveDot} />
//           <Text style={styles.liveLabelText}>1 track live now</Text>
//         </View>

//         {/* Track cards */}
//         {TRACKS.map((t) => (
//           <TouchableOpacity
//             key={t.id}
//             style={[styles.card, { borderColor: t.active ? t.borderColor : '#E2E8F0' }, t.active && styles.cardActive]}
//             onPress={() => {
//               if (t.active && t.screen) {
//                 navigation.navigate(t.screen as any);
//               }
//             }}
//             activeOpacity={t.active ? 0.85 : 1}
//             disabled={!t.active}
//           >
//             {/* Top row */}
//             <View style={styles.cardTop}>
//               <View style={[styles.emojiBox, { backgroundColor: t.active ? 'rgba(29,78,216,0.08)' : '#F8FAFC' }]}>
//                 <Text style={styles.emoji}>{t.emoji}</Text>
//               </View>
//               <View style={[styles.tag, { backgroundColor: t.tagBg }]}>
//                 <Text style={[styles.tagText, { color: t.tagColor }]}>{t.tag}</Text>
//               </View>
//             </View>

//             {/* Info */}
//             <Text style={[styles.cardName, !t.active && styles.cardNameMuted]}>{t.name}</Text>
//             <Text style={styles.cardDesc}>{t.desc}</Text>

//             {/* Meta row */}
//             <View style={styles.metaRow}>
//               <Text style={styles.metaText}>📐 {t.stages}</Text>
//             </View>
//             <View style={styles.vendorRow}>
//               <Text style={styles.vendorText}>Test vendor: {t.vendor}</Text>
//             </View>

//             {/* CTA only for active */}
//             {t.active && (
//               <View style={styles.ctaRow}>
//                 <Text style={styles.ctaText}>Start Prep →</Text>
//               </View>
//             )}
//           </TouchableOpacity>
//         ))}

//         {/* Request a track */}
//         <View style={styles.requestCard}>
//           <Text style={styles.requestTitle}>Don't see your company?</Text>
//           <Text style={styles.requestDesc}>We add new tracks based on demand. If you're preparing for a company not listed, let us know and we'll prioritize it.</Text>
//           <TouchableOpacity style={styles.requestBtn}>
//             <Text style={styles.requestBtnText}>Request a Track</Text>
//           </TouchableOpacity>
//         </View>

//       </ScrollView>
//     </SafeAreaView>
//   );
// }

// const styles = StyleSheet.create({
//   safe:    { flex: 1, backgroundColor: '#F8FAFC' },
//   scroll:  { padding: 20, paddingBottom: 48 },
//   backRow: { marginBottom: 16 },
//   backBtn: { fontSize: 14, fontWeight: '600', color: '#1D4ED8' },

//   title: { fontSize: 28, fontWeight: '800', color: '#0F172A', lineHeight: 34, letterSpacing: -0.5, marginBottom: 8 },
//   sub:   { fontSize: 13, color: '#475569', lineHeight: 20, marginBottom: 20 },

//   liveLabel:     { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 14 },
//   liveDot:       { width: 8, height: 8, borderRadius: 4, backgroundColor: '#059669' },
//   liveLabelText: { fontSize: 12, fontWeight: '700', color: '#059669' },

//   card:       { backgroundColor: '#fff', borderWidth: 1, borderRadius: 18, padding: 16, marginBottom: 12 },
//   cardActive: { borderWidth: 1.5, shadowColor: '#1D4ED8', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.08, shadowRadius: 12, elevation: 3 },

//   cardTop:  { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
//   emojiBox: { width: 48, height: 48, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
//   emoji:    { fontSize: 24 },
//   tag:      { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 999 },
//   tagText:  { fontSize: 10, fontWeight: '700', letterSpacing: 0.3 },

//   cardName:     { fontSize: 16, fontWeight: '800', color: '#0F172A', marginBottom: 4, letterSpacing: -0.2 },
//   cardNameMuted:{ color: '#94A3B8' },
//   cardDesc:     { fontSize: 12, color: '#475569', lineHeight: 18, marginBottom: 10 },

//   metaRow:    { flexDirection: 'row', gap: 12, marginBottom: 4 },
//   metaText:   { fontSize: 11, color: '#64748B', fontWeight: '500' },
//   vendorRow:  { marginBottom: 10 },
//   vendorText: { fontSize: 11, color: '#94A3B8' },

//   ctaRow: { borderTopWidth: 1, borderTopColor: '#E2E8F0', paddingTop: 10, marginTop: 4 },
//   ctaText:{ fontSize: 13, fontWeight: '700', color: '#1D4ED8' },

//   requestCard: { backgroundColor: '#F8FAFC', borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 16, padding: 16, marginTop: 8 },
//   requestTitle:{ fontSize: 14, fontWeight: '700', color: '#0F172A', marginBottom: 6 },
//   requestDesc: { fontSize: 12, color: '#475569', lineHeight: 18, marginBottom: 12 },
//   requestBtn:  { backgroundColor: '#fff', borderWidth: 1, borderColor: '#CBD5E1', borderRadius: 999, paddingVertical: 10, alignItems: 'center' },
//   requestBtnText: { fontSize: 13, fontWeight: '600', color: '#475569' },
// });

// ─── screens/tracks/CompanyTracksScreen.tsx ───────────────────────
// Entry hub listing all company prep tracks — fetches real data from backend.

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

// ── Helpers for badge/color styling based on live stage count ──────
function getLiveStageCount(track: CompanyTrack): number {
  return track.stages.filter((s) => s.status === 'live').length;
}

function hasAnyLiveStage(track: CompanyTrack): boolean {
  return getLiveStageCount(track) > 0;
}

export default function CompanyTracksScreen() {
  const navigation = useNavigation<Nav>();
  const [tracks, setTracks]       = useState<CompanyTrack[]>([]);
  const [loading, setLoading]     = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError]         = useState('');

  const loadTracks = useCallback(async () => {
    try {
      setError('');
      const data = await getCompanyTracks();
      setTracks(data);
    } catch (e) {
      setError('Failed to load company tracks. Pull down to retry.');
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

  const liveCount = tracks.filter(hasAnyLiveStage).length;

  const handleTrackPress = (track: CompanyTrack) => {
    navigation.navigate('CompanyTrackHome' as any, { companyId: track.companyId });
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#1D4ED8" />
        }
      >
        {/* Header */}
        <View style={styles.backRow}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.backBtn}>← Home</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.title}>Company{'\n'}Prep Tracks</Text>
        <Text style={styles.sub}>Company-specific test simulations — exact formats, difficulty, and context used by each employer's screening platform.</Text>

        {/* Live track highlight */}
        {!loading && tracks.length > 0 && (
          <View style={styles.liveLabel}>
            <View style={styles.liveDot} />
            <Text style={styles.liveLabelText}>
              {liveCount} track{liveCount === 1 ? '' : 's'} live now
            </Text>
          </View>
        )}

        {/* Loading state */}
        {loading && (
          <View style={styles.loadingBox}>
            <ActivityIndicator size="large" color="#1D4ED8" />
            <Text style={styles.loadingText}>Loading company tracks…</Text>
          </View>
        )}

        {/* Error state */}
        {!loading && error !== '' && (
          <View style={styles.errorBox}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        {/* Empty state */}
        {!loading && error === '' && tracks.length === 0 && (
          <View style={styles.emptyBox}>
            <Text style={styles.emptyText}>No company tracks available yet. Check back soon.</Text>
          </View>
        )}

        {/* Track cards */}
        {!loading && tracks.map((t) => {
          const isLive = hasAnyLiveStage(t);
          const liveStagesCount = getLiveStageCount(t);

          return (
            <TouchableOpacity
              key={t.companyId}
              style={[
                styles.card,
                { borderColor: isLive ? t.brandColor : '#E2E8F0' },
                isLive && styles.cardActive,
              ]}
              onPress={() => handleTrackPress(t)}
              activeOpacity={0.85}
            >
              {/* Top row */}
              <View style={styles.cardTop}>
                <View style={[styles.emojiBox, { backgroundColor: isLive ? `${t.brandColor}15` : '#F8FAFC' }]}>
                  <Text style={styles.emoji}>{t.emoji}</Text>
                </View>
                <View
                  style={[
                    styles.tag,
                    { backgroundColor: isLive ? '#D1FAE5' : '#FEF3C7' },
                  ]}
                >
                  <Text
                    style={[
                      styles.tagText,
                      { color: isLive ? '#059669' : '#D97706' },
                    ]}
                  >
                    {isLive ? 'LIVE' : 'COMING SOON'}
                  </Text>
                </View>
              </View>

              {/* Info */}
              <Text style={styles.cardName}>{t.name}</Text>
              <Text style={styles.cardDesc}>
                {t.stages.length} stage{t.stages.length === 1 ? '' : 's'} total
                {isLive ? ` · ${liveStagesCount} available now` : ''}
              </Text>

              {/* Stage preview row */}
              <View style={styles.metaRow}>
                <Text style={styles.metaText}>
                  📐 {t.stages.map((s) => s.name.split('—')[1]?.trim() ?? s.name).join(' · ')}
                </Text>
              </View>

              {/* CTA only when at least one stage is live */}
              {isLive && (
                <View style={styles.ctaRow}>
                  <Text style={[styles.ctaText, { color: t.brandColor }]}>Start Prep →</Text>
                </View>
              )}
            </TouchableOpacity>
          );
        })}

        {/* Request a track */}
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
  safe:    { flex: 1, backgroundColor: '#F8FAFC' },
  scroll:  { padding: 20, paddingBottom: 48 },
  backRow: { marginBottom: 16 },
  backBtn: { fontSize: 14, fontWeight: '600', color: '#1D4ED8' },

  title: { fontSize: 28, fontWeight: '800', color: '#0F172A', lineHeight: 34, letterSpacing: -0.5, marginBottom: 8 },
  sub:   { fontSize: 13, color: '#475569', lineHeight: 20, marginBottom: 20 },

  liveLabel:     { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 14 },
  liveDot:       { width: 8, height: 8, borderRadius: 4, backgroundColor: '#059669' },
  liveLabelText: { fontSize: 12, fontWeight: '700', color: '#059669' },

  loadingBox: { alignItems: 'center', paddingVertical: 40, gap: 12 },
  loadingText: { fontSize: 13, color: '#94A3B8' },

  errorBox: { backgroundColor: '#FEF2F2', borderWidth: 1, borderColor: '#FECACA', borderRadius: 14, padding: 16, marginBottom: 16 },
  errorText: { fontSize: 13, color: '#DC2626', textAlign: 'center' },

  emptyBox: { alignItems: 'center', paddingVertical: 40 },
  emptyText: { fontSize: 13, color: '#94A3B8', textAlign: 'center' },

  card:       { backgroundColor: '#fff', borderWidth: 1, borderRadius: 18, padding: 16, marginBottom: 12 },
  cardActive: { borderWidth: 1.5, shadowColor: '#1D4ED8', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.08, shadowRadius: 12, elevation: 3 },

  cardTop:  { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  emojiBox: { width: 48, height: 48, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  emoji:    { fontSize: 24 },
  tag:      { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 999 },
  tagText:  { fontSize: 10, fontWeight: '700', letterSpacing: 0.3 },

  cardName:     { fontSize: 16, fontWeight: '800', color: '#0F172A', marginBottom: 4, letterSpacing: -0.2 },
  cardDesc:     { fontSize: 12, color: '#475569', lineHeight: 18, marginBottom: 10 },

  metaRow:    { flexDirection: 'row', gap: 12, marginBottom: 4 },
  metaText:   { fontSize: 11, color: '#64748B', fontWeight: '500' },

  ctaRow: { borderTopWidth: 1, borderTopColor: '#E2E8F0', paddingTop: 10, marginTop: 10 },
  ctaText:{ fontSize: 13, fontWeight: '700' },

  requestCard: { backgroundColor: '#F8FAFC', borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 16, padding: 16, marginTop: 8 },
  requestTitle:{ fontSize: 14, fontWeight: '700', color: '#0F172A', marginBottom: 6 },
  requestDesc: { fontSize: 12, color: '#475569', lineHeight: 18, marginBottom: 12 },
  requestBtn:  { backgroundColor: '#fff', borderWidth: 1, borderColor: '#CBD5E1', borderRadius: 999, paddingVertical: 10, alignItems: 'center' },
  requestBtnText: { fontSize: 13, fontWeight: '600', color: '#475569' },
});