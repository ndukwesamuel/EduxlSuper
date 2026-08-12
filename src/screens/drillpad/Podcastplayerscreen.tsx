// ─── PodcastPlayerScreen.tsx ───────────────────────────────────────
import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet,
  Animated, ScrollView, ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp, useFocusEffect } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useAudioPlayer, useAudioPlayerStatus } from 'expo-audio';
import { AppStackParamList } from '../../navigation/types';
import { getPodcast, Podcast } from '../../../config/client';

type Nav   = NativeStackNavigationProp<AppStackParamList>;
type Route = RouteProp<AppStackParamList, 'PodcastPlayer'>;

const SPEEDS = [0.75, 1, 1.25, 1.5];

export default function PodcastPlayerScreen() {
  const navigation = useNavigation<Nav>();
  const route      = useRoute<Route>();
  const { podcastId, subjectName } = route.params;

  const [podcast, setPodcast] = useState<Podcast | null>(null);
  const [loading, setLoading] = useState(true);
  const [speed, setSpeed]     = useState(1);

  // expo-audio player
  const player = useAudioPlayer(podcast?.audioUrl ?? null);
  const status = useAudioPlayerStatus(player);

  const isPlaying = status.playing;
  const position  = status.currentTime ?? 0;
  const duration  = status.duration ?? 0;

  // ── Entrance animation ───────────────────────────────────────
  const fadeAnim  = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim,  { toValue: 1, duration: 400, useNativeDriver: true }),
      Animated.spring(slideAnim, { toValue: 0, tension: 65, friction: 10, useNativeDriver: true }),
    ]).start();
  }, []);

  const load = async () => {
    try {
      const data = await getPodcast(podcastId);
      setPodcast(data);
    } catch {
      // ignore — handled by empty state
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(useCallback(() => { load(); }, [podcastId]));

  // ── Controls ──────────────────────────────────────────────────
  const togglePlay = () => {
    if (!podcast?.audioUrl) return;

    if (isPlaying) {
      player.pause();
    } else {
      if (status.didJustFinish || position >= duration - 0.5) {
        player.seekTo(0);
      }
      player.play();
    }
  };

  const changeSpeed = () => {
    const currentIdx = SPEEDS.indexOf(speed);
    const nextSpeed = SPEEDS[(currentIdx + 1) % SPEEDS.length];
    setSpeed(nextSpeed);
    player.setPlaybackRate(nextSpeed, 'high');
  };

  const skip = (seconds: number) => {
    const newPos = Math.max(0, Math.min(duration, position + seconds));
    player.seekTo(newPos);
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const progressPct = duration > 0 ? (position / duration) * 100 : 0;

  if (loading) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#1D4ED8" />
        </View>
      </SafeAreaView>
    );
  }

  if (!podcast) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.center}>
          <Text style={styles.errorText}>Lesson not found.</Text>
          <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginTop: 12 }}>
            <Text style={styles.backText}>← Go back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}>

          {/* ── Header ── */}
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backRow}>
            <Text style={styles.backText}>← Back</Text>
          </TouchableOpacity>

          <Text style={styles.subjectLabel}>{subjectName}</Text>
          <Text style={styles.title}>{podcast.title}</Text>

          {/* ── Player card ── */}
          <View style={styles.playerCard}>
            <View style={styles.glowCircle} />

            <View style={styles.playerBadge}>
              <Text style={styles.playerBadgeText}>🎧 AI LESSON</Text>
            </View>

            <Text style={styles.playerDuration}>
              {podcast.durationSeconds
                ? `~${Math.round(podcast.durationSeconds / 60)} min lesson`
                : 'Audio lesson'}
            </Text>

            {/* Progress bar */}
            <View style={styles.progressTrack}>
              <View style={[styles.progressFill, { width: `${progressPct}%` }]} />
            </View>
            <View style={styles.timeRow}>
              <Text style={styles.timeText}>{formatTime(position)}</Text>
              <Text style={styles.timeText}>{formatTime(duration)}</Text>
            </View>

            {/* Controls */}
            <View style={styles.controlsRow}>
              <TouchableOpacity onPress={() => skip(-10)} style={styles.skipBtn}>
                <Text style={styles.skipText}>⏮ 10s</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={togglePlay} style={styles.playBtn} activeOpacity={0.85}>
                <Text style={styles.playIcon}>{isPlaying ? '⏸' : '▶️'}</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => skip(10)} style={styles.skipBtn}>
                <Text style={styles.skipText}>10s ⏭</Text>
              </TouchableOpacity>
            </View>

            {/* Speed */}
            <TouchableOpacity onPress={changeSpeed} style={styles.speedBtn}>
              <Text style={styles.speedText}>{speed}x speed</Text>
            </TouchableOpacity>
          </View>

          {/* Commute tip */}
          <View style={styles.commuteTip}>
            <Text style={styles.commuteTipTitle}>🎧 Great for commuting</Text>
            <Text style={styles.commuteTipText}>
              Listen on your way to school. Your notes, read aloud — no need to look at your phone.
            </Text>
          </View>

          {/* Script transcript */}
          <View style={styles.scriptCard}>
            <Text style={styles.scriptTitle}>📝 Lesson Transcript</Text>
            <Text style={styles.scriptText}>{podcast.script}</Text>
          </View>

        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe:   { flex: 1, backgroundColor: '#F8FAFC' },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  scroll: { padding: 16, paddingBottom: 48 },

  backRow:  { marginBottom: 8 },
  backText: { fontSize: 14, color: '#1D4ED8', fontWeight: '600' },
  errorText: { fontSize: 14, color: '#94A3B8' },

  subjectLabel: {
    fontSize: 12,
    color: '#94A3B8',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: -0.5,
    marginBottom: 20,
  },

  // ── Player card ──
  playerCard: {
    backgroundColor: '#1D4ED8',
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    overflow: 'hidden',
    shadowColor: '#1D4ED8',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  glowCircle: {
    position: 'absolute',
    top: -40,
    right: -40,
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
  playerBadge: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 9999,
    paddingHorizontal: 12,
    paddingVertical: 4,
    alignSelf: 'flex-start',
    marginBottom: 10,
  },
  playerBadgeText: { fontSize: 11, fontWeight: '700', color: '#fff' },
  playerDuration: { fontSize: 12, color: 'rgba(255,255,255,0.7)', marginBottom: 16 },

  progressTrack: {
    height: 4,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 2,
    overflow: 'hidden',
    marginBottom: 6,
  },
  progressFill: { height: 4, backgroundColor: '#fff', borderRadius: 2 },
  timeRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 },
  timeText: { fontSize: 11, color: 'rgba(255,255,255,0.7)', fontWeight: '600' },

  controlsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 24,
    marginBottom: 14,
  },
  skipBtn: { paddingHorizontal: 10, paddingVertical: 6 },
  skipText: { fontSize: 13, color: 'rgba(255,255,255,0.85)', fontWeight: '700' },
  playBtn: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  playIcon: { fontSize: 22 },

  speedBtn: {
    alignSelf: 'center',
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 9999,
    paddingHorizontal: 16,
    paddingVertical: 6,
  },
  speedText: { fontSize: 12, fontWeight: '700', color: '#fff' },

  // ── Commute tip ──
  commuteTip: {
    backgroundColor: '#FFF7ED',
    borderRadius: 12,
    padding: 12,
    borderLeftWidth: 3,
    borderLeftColor: '#F97316',
    marginBottom: 16,
  },
  commuteTipTitle: { fontSize: 12, fontWeight: '700', color: '#9A3412', marginBottom: 2 },
  commuteTipText: { fontSize: 12, color: '#C2410C', lineHeight: 18 },

  // ── Script ──
  scriptCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 14,
  },
  scriptTitle: { fontSize: 13, fontWeight: '700', color: '#0F172A', marginBottom: 6 },
  scriptText: { fontSize: 13, color: '#475569', lineHeight: 20 },
});