


// ─── WhiteboardPlayerScreen.tsx ──────────────────────────────────
import React, { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useVideoPlayer, VideoView } from 'expo-video';
import { AppStackParamList } from '../../navigation/types';
// ⚠️ adjust this import path to match your project structure
import { WhiteboardVideo, WhiteboardScene } from '../../../config/client';

type Nav = NativeStackNavigationProp<AppStackParamList>;

const LAYOUT_LABELS: Record<string, string> = {
  TITLE: 'Title Slide',
  FLOW_CHART: 'Flow Chart',
  BULLET_LIST: 'Bullet List',
  COMPARISON: 'Comparison',
};

function formatTime(s: number) {
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${m}:${String(sec).padStart(2, '0')}`;
}

// Layout types store their icon(s) in different places — pull whichever applies.
function getSceneIcon(scene: WhiteboardScene): string {
  const d = scene.layout_data || {};
  if (d.scene_icon) return d.scene_icon;
  if (Array.isArray(d.step_icons) && d.step_icons[0]) return d.step_icons[0];
  if (Array.isArray(d.icons) && d.icons[0]) return d.icons[0];
  if (d.left_icon) return d.left_icon;
  if (d.right_icon) return d.right_icon;
  return '🎬';
}

export default function WhiteboardPlayerScreen() {
  const navigation = useNavigation<Nav>();
  const route      = useRoute<any>();
  const video: WhiteboardVideo | undefined = route.params?.video;

  const [activeScene, setActiveScene] = useState(1);

  // useVideoPlayer needs a source even before `video` resolves — fall back
  // to an empty string source if it's somehow missing (see empty state below).
  const player = useVideoPlayer(video?.video_url ?? '', (p) => {
    p.loop = false;
  });

  if (!video) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.emptyState}>
          <Text style={styles.emptyEmoji}>🎬</Text>
          <Text style={styles.emptyTitle}>Video not found</Text>
          <Text style={styles.emptyDesc}>We couldn't find the data for this video. Try generating it again.</Text>
          <TouchableOpacity style={styles.btnSecondary} onPress={() => navigation.goBack()} activeOpacity={0.85}>
            <Text style={styles.btnSecondaryText}>Back to Library</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

        <View style={styles.backRow}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.backBtn}>← Library</Text>
          </TouchableOpacity>
          <View style={styles.styleBadge}>
            <Text style={styles.styleBadgeText}>{video.style}</Text>
          </View>
        </View>

        {/* Video player */}
        <View style={styles.videoWrap}>
          <VideoView
            style={styles.video}
            player={player}
            allowsFullscreen
            allowsPictureInPicture
            nativeControls
          />
        </View>

        <Text style={styles.title} numberOfLines={2}>{video.topic}</Text>
        <View style={styles.metaRow}>
          <Text style={styles.metaText}>🎬 {video.total_scenes} scenes</Text>
          <Text style={styles.metaDot}>·</Text>
          <Text style={styles.metaText}>⏱ {formatTime(video.total_duration_seconds)}</Text>
          <Text style={styles.metaDot}>·</Text>
          <Text style={styles.metaText}>AI-generated</Text>
        </View>

        {/* Scene breakdown */}
        <Text style={styles.secLabel}>Scene Breakdown</Text>
        <Text style={styles.secSub}>Tap a scene to jump to that part of the video.</Text>

        {video.scenes.map((s) => (
          <TouchableOpacity
            key={s.scene}
            style={[styles.sceneRow, activeScene === s.scene && styles.sceneRowActive]}
            onPress={() => setActiveScene(s.scene)}
            activeOpacity={0.8}
          >
            <View style={styles.sceneNum}>
              <Text style={styles.sceneNumText}>{s.scene}</Text>
            </View>
            <Text style={styles.sceneIcon}>{getSceneIcon(s)}</Text>
            <View style={{ flex: 1 }}>
              <View style={styles.sceneTopRow}>
                <View style={styles.layoutTag}>
                  <Text style={styles.layoutTagText}>{LAYOUT_LABELS[s.layout_type] ?? s.layout_type}</Text>
                </View>
                <Text style={styles.sceneDuration}>{s.actual_duration.toFixed(1)}s</Text>
              </View>
              <Text style={styles.sceneNarration}>{s.narration}</Text>
            </View>
          </TouchableOpacity>
        ))}

      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.btnSecondary}
          onPress={() => navigation.goBack()}
          activeOpacity={0.85}
        >
          <Text style={styles.btnSecondaryText}>Back to Library</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe:    { flex: 1, backgroundColor: '#F8FAFC' },
  scroll:  { padding: 20, paddingBottom: 32 },
  backRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  backBtn: { fontSize: 14, fontWeight: '600', color: '#1D4ED8' },
  styleBadge: { marginLeft: 'auto', backgroundColor: '#FEF3C7', borderRadius: 999, paddingHorizontal: 10, paddingVertical: 3 },
  styleBadgeText: { fontSize: 10, fontWeight: '700', color: '#D97706', textTransform: 'capitalize' },

  videoWrap: { width: '100%', aspectRatio: 16/9, backgroundColor: '#0F172A', borderRadius: 16, overflow: 'hidden', marginBottom: 16 },
  video:     { width: '100%', height: '100%' },

  title: { fontSize: 20, fontWeight: '800', color: '#0F172A', textTransform: 'capitalize', marginBottom: 8, lineHeight: 26 },
  metaRow:  { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 24 },
  metaText: { fontSize: 12, color: '#64748B' },
  metaDot:  { fontSize: 12, color: '#CBD5E1' },

  secLabel: { fontSize: 10, fontWeight: '700', color: '#94A3B8', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 4 },
  secSub:   { fontSize: 11, color: '#94A3B8', marginBottom: 14 },

  sceneRow:  { backgroundColor: '#fff', borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 14, padding: 12, flexDirection: 'row', alignItems: 'flex-start', gap: 10, marginBottom: 10 },
  sceneRowActive: { borderColor: '#1D4ED8', backgroundColor: '#EFF6FF' },
  sceneNum:  { width: 22, height: 22, borderRadius: 11, backgroundColor: '#F1F5F9', alignItems: 'center', justifyContent: 'center', marginTop: 1 },
  sceneNumText: { fontSize: 10, fontWeight: '700', color: '#64748B' },
  sceneIcon: { fontSize: 18, marginTop: 1 },
  sceneTopRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
  layoutTag:   { backgroundColor: '#F1F5F9', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 999 },
  layoutTagText: { fontSize: 9, fontWeight: '700', color: '#64748B', textTransform: 'uppercase', letterSpacing: 0.3 },
  sceneDuration: { fontSize: 10, color: '#94A3B8', fontWeight: '600' },
  sceneNarration:{ fontSize: 12, color: '#475569', lineHeight: 18 },

  emptyState: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 40 },
  emptyEmoji: { fontSize: 48, marginBottom: 16 },
  emptyTitle: { fontSize: 18, fontWeight: '700', color: '#0F172A', marginBottom: 6 },
  emptyDesc:  { fontSize: 13, color: '#64748B', textAlign: 'center', lineHeight: 20, marginBottom: 20 },

  footer:       { padding: 20, paddingBottom: 28, backgroundColor: '#F8FAFC', borderTopWidth: 1, borderTopColor: '#E2E8F0' },
  btnSecondary: { backgroundColor: '#fff', borderWidth: 1.5, borderColor: '#CBD5E1', borderRadius: 999, paddingVertical: 14, alignItems: 'center' },
  btnSecondaryText: { fontSize: 14, fontWeight: '700', color: '#475569' },
});