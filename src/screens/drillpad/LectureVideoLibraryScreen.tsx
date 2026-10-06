// ─── LectureVideoLibraryScreen.tsx ────────────────────────────────
// Lists the lecture videos uploaded to a subject, and lets the student
// upload a new one. Each video gets its own transcript (generated once,
// in the background) — tapping a 'ready' video opens LectureVideoPlayer,
// where the student can watch it and chat with it directly.
import React, { useState, useCallback, useEffect } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, FlatList, ActivityIndicator, Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute, useFocusEffect } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import * as DocumentPicker from 'expo-document-picker';
import { AppStackParamList } from '../../navigation/types';
import CCLoader from '../../components/CCLoader';
import {
  getLectureVideos,
  getDueReview,
  getLectureVideo,
  uploadLectureVideo,
  deleteLectureVideo,
  LectureVideo,
} from '../../../config/client';

type Nav = NativeStackNavigationProp<AppStackParamList>;

const VIDEO_MIME_TYPES = ['video/mp4', 'video/quicktime', 'video/webm', 'video/x-matroska'];

function formatDuration(s: number) {
  if (!s) return '—';
  const m = Math.floor(s / 60);
  const sec = Math.round(s % 60);
  return m > 0 ? `${m}m ${sec}s` : `${sec}s`;
}

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-NG', { day: 'numeric', month: 'short' });
}

const STATUS_META: Record<LectureVideo['status'], { label: string; color: string; bg: string }> = {
  uploading:    { label: 'Uploading…',    color: '#D97706', bg: '#FEF3C7' },
  transcribing: { label: 'Transcribing…', color: '#D97706', bg: '#FEF3C7' },
  ready:        { label: 'Ready',         color: '#059669', bg: '#D1FAE5' },
  failed:       { label: 'Failed',        color: '#DC2626', bg: '#FEE2E2' },
};

export default function LectureVideoLibraryScreen() {
  const navigation = useNavigation<Nav>();
  const route      = useRoute<any>();
  const subjectId   = route.params?.subjectId;
  const subjectName = route.params?.subjectName ?? 'Subject';

  const [videos, setVideos]   = useState<LectureVideo[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [dueCount, setDueCount] = useState(0);

  const load = useCallback(async () => {
    try {
      const data = await getLectureVideos(subjectId);
      setVideos(Array.isArray(data) ? data : []);
      getDueReview().then((r) => setDueCount(r.totalDue)).catch(() => setDueCount(0));
    } catch {
      setVideos([]);
    } finally {
      setLoading(false);
    }
  }, [subjectId]);

  useFocusEffect(useCallback(() => { load(); }, [load]));

  // ── Pick a video file and start the upload ───────────────────────
  const pickAndUpload = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: VIDEO_MIME_TYPES,
        copyToCacheDirectory: true,
      });
      if (result.canceled || !result.assets?.[0]) return;

      const file = result.assets[0];
      setUploading(true);

      const formData = new FormData();
      formData.append('file', {
        uri: file.uri,
        name: file.name,
        type: file.mimeType || 'video/mp4',
      } as any);
      formData.append('title', file.name.replace(/\.[^/.]+$/, '') || subjectName);

      // Returns almost immediately with status: 'uploading' — the polling
      // effect below picks it up and moves the card to 'ready'/'failed'.
      const video = await uploadLectureVideo(subjectId, formData);
      setVideos((prev) => [video, ...prev]);
    } catch (err: any) {
      Alert.alert('Upload failed', err?.response?.data?.message || err?.message || 'Could not start the upload. Try again.');
    } finally {
      setUploading(false);
    }
  };

  // ── Poll any in-progress videos until they're ready/failed ───────
  // Transcription runs in the background on the server and can take
  // minutes for a full lecture, so this screen polls instead of blocking.
  useEffect(() => {
    const pendingIds = videos
      .filter((v) => v.status === 'uploading' || v.status === 'transcribing')
      .map((v) => v._id);
    if (pendingIds.length === 0) return;

    const interval = setInterval(async () => {
      for (const id of pendingIds) {
        try {
          const updated = await getLectureVideo(id);
          if (updated.status === 'uploading' || updated.status === 'transcribing') continue;

          setVideos((prev) => prev.map((v) => (v._id === id ? updated : v)));
          if (updated.status === 'ready') {
            Alert.alert('Video ready! 🎬', `"${updated.title}" has been transcribed — you can now watch it and ask questions.`);
          } else if (updated.status === 'failed') {
            Alert.alert('Processing failed', updated.error || `"${updated.title}" could not be processed.`);
          }
        } catch {
          // transient network hiccup — just try again next tick
        }
      }
    }, 4000);

    return () => clearInterval(interval);
  }, [videos]);

  const openVideo = (video: LectureVideo) => {
    if (video.status !== 'ready') return;
    navigation.navigate('LectureVideoPlayer', { videoId: video._id, subjectName });
  };

  const showOptions = (video: LectureVideo) => {
    // Rename is intentionally left out here — Alert.prompt (the quickest way
    // to grab text input) is iOS-only and silently no-ops on Android, and
    // this app ships to both. Worth a proper modal input later if renaming
    // turns out to matter; not needed for the core upload/watch/chat flow.
    Alert.alert(video.title, 'What would you like to do?', [
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => {
          Alert.alert('Delete video?', `"${video.title}" will be permanently deleted.`, [
            { text: 'Cancel', style: 'cancel' },
            {
              text: 'Delete',
              style: 'destructive',
              onPress: async () => {
                try {
                  await deleteLectureVideo(video._id);
                  setVideos((prev) => prev.filter((v) => v._id !== video._id));
                } catch {
                  Alert.alert('Error', 'Could not delete. Try again.');
                }
              },
            },
          ]);
        },
      },
      { text: 'Cancel', style: 'cancel' },
    ]);
  };

  const renderItem = ({ item }: { item: LectureVideo }) => {
    const meta = STATUS_META[item.status];
    const isInteractive = item.status === 'ready';
    return (
      <TouchableOpacity
        style={styles.card}
        activeOpacity={isInteractive ? 0.8 : 1}
        onPress={() => openVideo(item)}
        onLongPress={() => showOptions(item)}
      >
        <View style={styles.cardIcon}>
          <Text style={styles.cardEmoji}>🎥</Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.cardTitle} numberOfLines={1}>{item.title}</Text>
          <View style={styles.cardMetaRow}>
            <View style={[styles.statusBadge, { backgroundColor: meta.bg }]}>
              {(item.status === 'uploading' || item.status === 'transcribing') && (
                <ActivityIndicator size="small" color={meta.color} style={{ marginRight: 4 }} />
              )}
              <Text style={[styles.statusText, { color: meta.color }]}>{meta.label}</Text>
            </View>
            {item.status === 'ready' && (
              <>
                <Text style={styles.cardMetaDot}>·</Text>
                <Text style={styles.cardMetaText}>{formatDuration(item.durationSeconds)}</Text>
                <Text style={styles.cardMetaDot}>·</Text>
                <Text style={styles.cardMetaText}>{item.chapters?.length ?? 0} chapters</Text>
              </>
            )}
            <Text style={styles.cardMetaDot}>·</Text>
            <Text style={styles.cardMetaText}>{formatDate(item.createdAt)}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.safe}>
        <CCLoader />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.backRow}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backBtn}>← {subjectName}</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.title}>Lecture Videos</Text>
      <Text style={styles.sub}>Upload a recorded class — chat with it, jump to chapters, ask anything.</Text>

      {dueCount > 0 && (
        <TouchableOpacity
          style={styles.reviewBanner}
          onPress={() => navigation.navigate('PracticeSession', { mode: 'review' })}
          activeOpacity={0.85}
        >
          <Text style={styles.reviewBannerText}>📝 {dueCount} question{dueCount === 1 ? '' : 's'} due for review</Text>
        </TouchableOpacity>
      )}

      <FlatList
        data={videos}
        keyExtractor={(v) => v._id}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyEmoji}>🎥</Text>
            <Text style={styles.emptyTitle}>No lecture videos yet</Text>
            <Text style={styles.emptyDesc}>Upload a recorded class to chat with it and jump to any chapter.</Text>
          </View>
        }
      />

      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.btnPrimary, uploading && styles.btnDisabled]}
          onPress={pickAndUpload}
          disabled={uploading}
          activeOpacity={0.85}
        >
          {uploading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.btnPrimaryText}>+ Upload Lecture Video</Text>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#F8FAFC' },
  backRow: { paddingHorizontal: 20, paddingTop: 12, marginBottom: 8 },
  backBtn: { fontSize: 14, fontWeight: '600', color: '#1D4ED8' },

  title: { fontSize: 22, fontWeight: '800', color: '#0F172A', paddingHorizontal: 20, marginBottom: 4 },
  reviewBanner: { marginHorizontal: 20, marginBottom: 12, backgroundColor: '#FEF3C7', borderRadius: 12, paddingVertical: 10, alignItems: 'center' },
  reviewBannerText: { fontSize: 13, fontWeight: '700', color: '#92400E' },
  sub:   { fontSize: 13, color: '#64748B', paddingHorizontal: 20, marginBottom: 16, lineHeight: 18 },

  list: { paddingHorizontal: 20, paddingBottom: 100 },

  card: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: '#fff', borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 14, padding: 14, marginBottom: 10 },
  cardIcon: { width: 44, height: 44, borderRadius: 12, backgroundColor: '#EFF6FF', alignItems: 'center', justifyContent: 'center' },
  cardEmoji: { fontSize: 20 },
  cardTitle: { fontSize: 15, fontWeight: '700', color: '#0F172A', marginBottom: 4 },
  cardMetaRow: { flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', gap: 4 },
  statusBadge: { flexDirection: 'row', alignItems: 'center', borderRadius: 999, paddingHorizontal: 8, paddingVertical: 2 },
  statusText: { fontSize: 10, fontWeight: '700' },
  cardMetaDot: { fontSize: 11, color: '#CBD5E1' },
  cardMetaText: { fontSize: 11, color: '#64748B' },

  emptyState: { alignItems: 'center', justifyContent: 'center', paddingTop: 80, paddingHorizontal: 40 },
  emptyEmoji: { fontSize: 44, marginBottom: 14 },
  emptyTitle: { fontSize: 16, fontWeight: '700', color: '#0F172A', marginBottom: 6 },
  emptyDesc: { fontSize: 13, color: '#64748B', textAlign: 'center', lineHeight: 19 },

  footer: { position: 'absolute', bottom: 0, left: 0, right: 0, padding: 20, paddingBottom: 28, backgroundColor: '#F8FAFC', borderTopWidth: 1, borderTopColor: '#E2E8F0' },
  btnPrimary: { backgroundColor: '#1D4ED8', borderRadius: 999, paddingVertical: 14, alignItems: 'center' },
  btnDisabled: { opacity: 0.7 },
  btnPrimaryText: { fontSize: 14, fontWeight: '700', color: '#fff' },
});
