


// ─── screens/tracks/CompanyTracksScreen.tsx ───────────────────────
import React from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AppStackParamList } from '../../navigation/types';

type Nav = NativeStackNavigationProp<AppStackParamList>;

const TRACKS = [
  {
    id: 'shell',
    emoji: '🐚',
    name: 'Shell Nigeria',
    // tag: 'LIVE',
    tag: 'SOON',

    tagColor: '#059669',
    tagBg: '#D1FAE5',
    borderColor: '#1D4ED8',
    screen: 'ShellTrackHome' as keyof AppStackParamList,
    stages: '4 stages',
    active: false,
  },
  {
    id: 'bank',
    emoji: '🏦',
    name: 'Banking Exams',
    tag: 'LIVE',
    tagColor: '#059669',
    tagBg: '#D1FAE5',
    borderColor: '#1D4ED8',
    screen: 'BankReady' as keyof AppStackParamList,
    stages: '639+ Qs',
    active: true,
  },
  {
    id: 'gtbank',
    emoji: '🏦',
    name: 'GTBank',
    tag: 'SOON',
    tagColor: '#D97706',
    tagBg: '#FEF3C7',
    borderColor: '#E2E8F0',
    screen: null,
    stages: '3 stages',
    active: false,
  },
  {
    id: 'kpmg',
    emoji: '📋',
    name: 'KPMG Nigeria',
    tag: 'SOON',
    tagColor: '#D97706',
    tagBg: '#FEF3C7',
    borderColor: '#E2E8F0',
    screen: null,
    stages: '3 stages',
    active: false,
  },
  {
    id: 'pwc',
    emoji: '🔵',
    name: 'PwC Nigeria',
    tag: 'SOON',
    tagColor: '#D97706',
    tagBg: '#FEF3C7',
    borderColor: '#E2E8F0',
    screen: null,
    stages: '3 stages',
    active: false,
  },
  {
    id: 'chevron',
    emoji: '⛽',
    name: 'Chevron Nigeria',
    tag: 'SOON',
    tagColor: '#D97706',
    tagBg: '#FEF3C7',
    borderColor: '#E2E8F0',
    screen: null,
    stages: '3 stages',
    active: false,
  },
  {
    id: 'dangote',
    emoji: '🏭',
    name: 'Dangote Group',
    tag: 'SOON',
    tagColor: '#D97706',
    tagBg: '#FEF3C7',
    borderColor: '#E2E8F0',
    screen: null,
    stages: '2 stages',
    active: false,
  },
];

export default function CompanyTracksScreen() {
  const navigation = useNavigation<Nav>();
  const liveCount = TRACKS.filter(t => t.active).length;

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

        <Text style={styles.title}>Company{'\n'}Prep Tracks</Text>
        <Text style={styles.sub}>Company-specific test simulations — exact formats, difficulty, and context used by each employer's screening platform.</Text>

        <View style={styles.liveLabel}>
          <View style={styles.liveDot} />
          <Text style={styles.liveLabelText}>{liveCount} track{liveCount === 1 ? '' : 's'} live now</Text>
        </View>

        {/* Compact grid — 2 columns */}
        <View style={styles.grid}>
          {TRACKS.map((t) => (
            <TouchableOpacity
              key={t.id}
              style={[styles.card, { borderColor: t.active ? t.borderColor : '#E2E8F0' }, t.active && styles.cardActive]}
              onPress={() => {
                if (t.active && t.screen) navigation.navigate(t.screen as any);
              }}
              activeOpacity={t.active ? 0.85 : 1}
              disabled={!t.active}
            >
              <View style={styles.cardTop}>
                <View style={[styles.emojiBox, { backgroundColor: t.active ? 'rgba(29,78,216,0.08)' : '#F8FAFC' }]}>
                  <Text style={styles.emoji}>{t.emoji}</Text>
                </View>
                <View style={[styles.tag, { backgroundColor: t.tagBg }]}>
                  <Text style={[styles.tagText, { color: t.tagColor }]}>{t.tag}</Text>
                </View>
              </View>

              <Text style={[styles.cardName, !t.active && styles.cardNameMuted]} numberOfLines={1}>
                {t.name}
              </Text>
              <Text style={styles.metaText}>📐 {t.stages}</Text>

              {t.active && (
                <Text style={styles.ctaText}>Start →</Text>
              )}
            </TouchableOpacity>
          ))}
        </View>

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

  ctaText: { fontSize: 11, fontWeight: '700', color: '#1D4ED8' },

  requestCard: { backgroundColor: '#F8FAFC', borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 16, padding: 16, marginTop: 20 },
  requestTitle:{ fontSize: 14, fontWeight: '700', color: '#0F172A', marginBottom: 6 },
  requestDesc: { fontSize: 12, color: '#475569', lineHeight: 18, marginBottom: 12 },
  requestBtn:  { backgroundColor: '#fff', borderWidth: 1, borderColor: '#CBD5E1', borderRadius: 999, paddingVertical: 10, alignItems: 'center' },
  requestBtnText: { fontSize: 13, fontWeight: '600', color: '#475569' },
});