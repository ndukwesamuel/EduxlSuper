// ─── LectureVideoPlayerScreen.tsx ─────────────────────────────────
// Plays one lecture video and lets the student chat with it directly —
// its own ecosystem, separate from the subject-wide chat. Tapping
// "Ask about this moment" grabs the player's current timestamp so the
// answer is grounded in the transcript around exactly what the student
// was just watching (see ChatService.chatWithVideo on the backend).
import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, TextInput, StyleSheet,
  KeyboardAvoidingView, Platform, ActivityIndicator, Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useVideoPlayer, VideoView } from 'expo-video';
import { AppStackParamList } from '../../navigation/types';
import CCLoader from '../../components/CCLoader';
import {
  getLectureVideo,
  sendVideoChat,
  getVideoPodcasts,
  createVideoPodcast,
  createVideoExplainer,
  LectureVideo,
  ChatMessage,
  Podcast,
} from '../../../config/client';

type Nav = NativeStackNavigationProp<AppStackParamList>;

function formatTime(s: number) {
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${m}:${String(sec).padStart(2, '0')}`;
}

interface DisplayMessage {
  role: 'user' | 'model';
  content: string;
  timestampSeconds?: number; // set on user messages asked while paused at a moment
}

export default function LectureVideoPlayerScreen() {
  const navigation = useNavigation<Nav>();
  const route      = useRoute<any>();
  const videoId     = route.params?.videoId;
  const subjectName = route.params?.subjectName ?? 'Subject';
  const startSeconds: number = route.params?.startSeconds ?? 0;

  const [video, setVideo]     = useState<LectureVideo | null>(null);
  const [loading, setLoading] = useState(true);

  const [messages, setMessages]   = useState<DisplayMessage[]>([]);
  const [input, setInput]         = useState('');
  const [sending, setSending]     = useState(false);
  const [anchorSeconds, setAnchorSeconds] = useState<number | null>(null);

  // "Listen instead" — a conversational podcast generated from this
  // video's transcript (see createVideoPodcast). Normally 0 or 1 of these
  // per video; reuses the existing PodcastPlayer screen unchanged once ready.
  const [podcasts, setPodcasts]         = useState<Podcast[]>([]);
  const [startingPodcast, setStartingPodcast] = useState(false);

  const scrollRef = useRef<ScrollView>(null);

  const player = useVideoPlayer(video?.videoUrl ?? '', (p) => {
    p.loop = false;
  });

  // Opened from a wrong practice answer: start at the part of the lecture that covers it.
  useEffect(() => {
    if (video?.videoUrl && startSeconds > 0) {
      player.currentTime = startSeconds;
    }
  }, [video?.videoUrl, startSeconds]);

  const load = useCallback(async () => {
    try {
      const data = await getLectureVideo(videoId);
      setVideo(data);
    } catch {
      setVideo(null);
    } finally {
      setLoading(false);
    }
  }, [videoId]);

  useEffect(() => { load(); }, [load]);

  const loadPodcasts = useCallback(async () => {
    try {
      const data = await getVideoPodcasts(videoId);
      setPodcasts(Array.isArray(data) ? data : []);
    } catch {
      // non-critical — the player works fine with no podcast section
    }
  }, [videoId]);

  useEffect(() => { loadPodcasts(); }, [loadPodcasts]);

  // ── Poll while a podcast is generating (can take over a minute — script
  // + ~18 sequential TTS calls + stitching), same pattern as AILessonScreen ──
  useEffect(() => {
    const processingIds = podcasts.filter((p) => p.status === 'processing').map((p) => p._id);
    if (processingIds.length === 0) return;

    const interval = setInterval(async () => {
      try {
        const updated = await getVideoPodcasts(videoId);
        setPodcasts(Array.isArray(updated) ? updated : []);
      } catch {
        // transient network hiccup — just try again next tick
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [podcasts, videoId]);

  // ── "20 minute mode" — a short animated explainer of this video ──
  // Hooks must stay above the early returns, so the second player is set up here too.
  const [showExplainer, setShowExplainer] = useState(false);
  const [startingExplainer, setStartingExplainer] = useState(false);
  const explainerPlayer = useVideoPlayer(video?.explainer?.videoUrl ?? '', (p) => {
    p.loop = false;
  });

  // Poll while the explainer renders (a few minutes), same as the podcast.
  useEffect(() => {
    if (video?.explainer?.status !== 'processing') return;
    const interval = setInterval(() => { load(); }, 6000);
    return () => clearInterval(interval);
  }, [video?.explainer?.status, load]);

  const startExplainer = async () => {
    setStartingExplainer(true);
    try {
      const updated = await createVideoExplainer(videoId);
      setVideo((prev) => (prev ? { ...prev, explainer: updated.explainer } : prev));
    } catch (err: any) {
      const msg = err?.response?.data?.message || err?.message || 'Could not start the explainer. Try again.';
      Alert.alert('Explainer failed', msg);
    } finally {
      setStartingExplainer(false);
    }
  };

  const startPodcast = async () => {
    setStartingPodcast(true);
    try {
      const podcast = await createVideoPodcast(videoId);
      setPodcasts((prev) => [podcast, ...prev]);
    } catch (err: any) {
      const msg = err?.response?.data?.message || err?.message || 'Could not start audio generation. Try again.';
      Alert.alert('Generation failed', msg);
    } finally {
      setStartingPodcast(false);
    }
  };

  const openPodcast = (podcast: Podcast) => {
    if (podcast.status !== 'ready') return;
    navigation.navigate('PodcastPlayer', { podcastId: podcast._id, subjectName });
  };

  // ── Capture the current playback position and pause, so the student's
  // next question is anchored to exactly what they were just watching ──
  const askAboutThisMoment = () => {
    const t = player.currentTime ?? 0;
    player.pause();
    setAnchorSeconds(t);
  };

  const clearAnchor = () => setAnchorSeconds(null);

  const send = async () => {
    const text = input.trim();
    if (!text || sending || !video) return;

    const timestampSeconds = anchorSeconds ?? undefined;
    const userMsg: DisplayMessage = { role: 'user', content: text, timestampSeconds };
    const history: ChatMessage[] = messages.map((m) => ({ role: m.role, content: m.content }));

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setAnchorSeconds(null);
    setSending(true);

    try {
      const { reply } = await sendVideoChat(video._id, text, history, timestampSeconds);
      setMessages((prev) => [...prev, { role: 'model', content: reply }]);
    } catch (err: any) {
      const msg = err?.response?.data?.message || err?.message || 'Could not get a response. Try again.';
      setMessages((prev) => [...prev, { role: 'model', content: `⚠️ ${msg}` }]);
    } finally {
      setSending(false);
      setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 100);
    }
  };

  const jumpToChapter = (startSeconds: number) => {
    player.currentTime = startSeconds;
    player.play();
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.safe}>
        <CCLoader />
      </SafeAreaView>
    );
  }

  if (!video) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.emptyState}>
          <Text style={styles.emptyEmoji}>🎥</Text>
          <Text style={styles.emptyTitle}>Video not found</Text>
          <TouchableOpacity style={styles.btnSecondary} onPress={() => navigation.goBack()} activeOpacity={0.85}>
            <Text style={styles.btnSecondaryText}>Back to Library</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>

        <View style={styles.backRow}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.backBtn}>← {subjectName}</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.videoWrap}>
          <VideoView style={styles.video} player={player} allowsFullscreen allowsPictureInPicture nativeControls />
        </View>

        <Text style={styles.title} numberOfLines={2}>{video.title}</Text>

        {/* ── AI summary + key points — the gist before committing to watching ── */}
        {(video.summary || (video.keyPoints && video.keyPoints.length > 0)) && (
          <View style={styles.summaryCard}>
            {video.summary ? <Text style={styles.summaryText}>{video.summary}</Text> : null}
            {video.keyPoints && video.keyPoints.length > 0 && (
              <View style={styles.keyPointsList}>
                {video.keyPoints.map((point, i) => (
                  <View key={i} style={styles.keyPointRow}>
                    <Text style={styles.keyPointBullet}>•</Text>
                    <Text style={styles.keyPointText}>{point}</Text>
                  </View>
                ))}
              </View>
            )}
          </View>
        )}

        {video.chapters?.length > 0 && (
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chapterRow} contentContainerStyle={{ paddingHorizontal: 16 }}>
            {video.chapters.map((c, i) => (
              <TouchableOpacity key={i} style={styles.chapterChip} onPress={() => jumpToChapter(c.start)} activeOpacity={0.8}>
                <Text style={styles.chapterChipTime}>{formatTime(c.start)}</Text>
                <Text style={styles.chapterChipTitle} numberOfLines={1}>{c.title}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}

        {/* ── Practice this video, one chapter at a time ── */}
        {video.chapters?.length > 0 && (
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chapterRow} contentContainerStyle={{ paddingHorizontal: 16 }}>
            {video.chapters.map((c, i) => (
              <TouchableOpacity
                key={`p${i}`}
                style={[styles.chapterChip, { borderColor: '#BFDBFE' }]}
                onPress={() => navigation.navigate('PracticeSession', {
                  mode: 'chapter', videoId: video._id, chapterTitle: c.title, chapterIndex: i, subjectName,
                })}
                activeOpacity={0.8}
              >
                <Text style={styles.chapterChipTime}>📝 Practice</Text>
                <Text style={styles.chapterChipTitle} numberOfLines={1}>{c.title}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}

        {/* ── 20 minute mode — short animated explainer ── */}
        <View style={styles.listenRow}>
          {video.explainer?.status === 'ready' && video.explainer.videoUrl ? (
            showExplainer ? (
              <View>
                <View style={styles.explainerWrap}>
                  <VideoView style={styles.video} player={explainerPlayer} allowsFullscreen nativeControls />
                </View>
                <TouchableOpacity style={[styles.listenBtn, { marginTop: 8 }]} onPress={() => setShowExplainer(false)} activeOpacity={0.8}>
                  <Text style={styles.listenBtnText}>Hide explainer</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity style={styles.listenBtn} onPress={() => setShowExplainer(true)} activeOpacity={0.8}>
                <Text style={styles.listenBtnText}>⏱ Watch 20-min explainer</Text>
              </TouchableOpacity>
            )
          ) : video.explainer?.status === 'processing' ? (
            <View style={[styles.listenBtn, styles.listenBtnDisabled]}>
              <ActivityIndicator size="small" color="#1D4ED8" style={{ marginRight: 8 }} />
              <Text style={styles.listenBtnText}>Building explainer…</Text>
            </View>
          ) : (
            <TouchableOpacity style={styles.listenBtn} onPress={startExplainer} disabled={startingExplainer} activeOpacity={0.8}>
              {startingExplainer ? (
                <ActivityIndicator size="small" color="#1D4ED8" />
              ) : (
                <Text style={styles.listenBtnText}>
                  {video.explainer?.status === 'failed' ? '⚠️ Explainer failed — tap to retry' : '⏱ Make 20-min explainer'}
                </Text>
              )}
            </TouchableOpacity>
          )}
        </View>

        {/* ── Listen instead — audio version of this video ── */}
        <View style={styles.listenRow}>
          {podcasts.length === 0 ? (
            <TouchableOpacity
              style={styles.listenBtn}
              onPress={startPodcast}
              disabled={startingPodcast}
              activeOpacity={0.8}
            >
              {startingPodcast ? (
                <ActivityIndicator size="small" color="#1D4ED8" />
              ) : (
                <Text style={styles.listenBtnText}>🎧 Generate audio version</Text>
              )}
            </TouchableOpacity>
          ) : (
            podcasts.slice(0, 1).map((p) => (
              <TouchableOpacity
                key={p._id}
                style={[styles.listenBtn, p.status === 'processing' && styles.listenBtnDisabled]}
                onPress={() => (p.status === 'failed' ? startPodcast() : openPodcast(p))}
                disabled={p.status === 'processing' || startingPodcast}
                activeOpacity={0.8}
              >
                {p.status === 'processing' ? (
                  <>
                    <ActivityIndicator size="small" color="#1D4ED8" style={{ marginRight: 8 }} />
                    <Text style={styles.listenBtnText}>Generating audio version…</Text>
                  </>
                ) : p.status === 'failed' ? (
                  <Text style={styles.listenBtnText}>⚠️ Generation failed — tap to retry</Text>
                ) : (
                  <Text style={styles.listenBtnText}>🎧 Listen instead</Text>
                )}
              </TouchableOpacity>
            ))
          )}
        </View>

        {/* ── Chat with this video ── */}
        <ScrollView ref={scrollRef} style={styles.chat} contentContainerStyle={styles.chatContent}>
          {messages.length === 0 && (
            <View style={styles.chatEmpty}>
              <Text style={styles.chatEmptyText}>Ask anything about this video, or pause and tap "Ask about this moment" to ask about exactly what you're watching.</Text>
            </View>
          )}
          {messages.map((m, i) => (
            <View key={i} style={[styles.bubble, m.role === 'user' ? styles.bubbleUser : styles.bubbleModel]}>
              {m.role === 'user' && typeof m.timestampSeconds === 'number' && (
                <Text style={styles.bubbleTimestamp}>📍 at {formatTime(m.timestampSeconds)}</Text>
              )}
              <Text style={[styles.bubbleText, m.role === 'user' && styles.bubbleTextUser]}>{m.content}</Text>
            </View>
          ))}
          {sending && (
            <View style={[styles.bubble, styles.bubbleModel]}>
              <ActivityIndicator size="small" color="#64748B" />
            </View>
          )}
        </ScrollView>

        {anchorSeconds !== null && (
          <View style={styles.anchorBar}>
            <Text style={styles.anchorText}>📍 Asking about {formatTime(anchorSeconds)}</Text>
            <TouchableOpacity onPress={clearAnchor}>
              <Text style={styles.anchorClear}>Clear</Text>
            </TouchableOpacity>
          </View>
        )}

        <View style={styles.inputBar}>
          <TouchableOpacity style={styles.anchorBtn} onPress={askAboutThisMoment} activeOpacity={0.8}>
            <Text style={styles.anchorBtnText}>📍</Text>
          </TouchableOpacity>
          <TextInput
            style={styles.input}
            placeholder="Ask about this video..."
            placeholderTextColor="#94A3B8"
            value={input}
            onChangeText={setInput}
            multiline
          />
          <TouchableOpacity
            style={[styles.sendBtn, (!input.trim() || sending) && styles.btnDisabled]}
            onPress={send}
            disabled={!input.trim() || sending}
            activeOpacity={0.8}
          >
            <Text style={styles.sendBtnText}>➤</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#F8FAFC' },
  backRow: { paddingHorizontal: 20, paddingTop: 4, marginBottom: 8 },
  backBtn: { fontSize: 14, fontWeight: '600', color: '#1D4ED8' },

  videoWrap: { width: '100%', aspectRatio: 16 / 9, backgroundColor: '#0F172A' },
  video: { width: '100%', height: '100%' },

  title: { fontSize: 16, fontWeight: '800', color: '#0F172A', paddingHorizontal: 20, marginTop: 10, marginBottom: 8 },

  chapterRow: { maxHeight: 54, marginBottom: 8 },
  chapterChip: { backgroundColor: '#fff', borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 12, paddingHorizontal: 12, paddingVertical: 8, marginRight: 8, maxWidth: 160 },
  chapterChipTime: { fontSize: 10, fontWeight: '700', color: '#1D4ED8', marginBottom: 2 },
  chapterChipTitle: { fontSize: 11, color: '#475569', fontWeight: '600' },

  summaryCard: { marginHorizontal: 16, marginBottom: 10, backgroundColor: '#fff', borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 12, padding: 12 },
  summaryText: { fontSize: 13, color: '#334155', lineHeight: 19, marginBottom: 8 },
  keyPointsList: { gap: 4 },
  keyPointRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 6 },
  keyPointBullet: { fontSize: 13, color: '#1D4ED8', fontWeight: '700' },
  keyPointText: { flex: 1, fontSize: 12, color: '#475569', lineHeight: 18 },

  explainerWrap: { width: '100%', aspectRatio: 16 / 9, backgroundColor: '#0F172A', borderRadius: 12, overflow: 'hidden' },

  listenRow: { paddingHorizontal: 16, marginBottom: 10 },
  listenBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#EFF6FF', borderWidth: 1, borderColor: '#BFDBFE', borderRadius: 12, paddingVertical: 12 },
  listenBtnDisabled: { opacity: 0.8 },
  listenBtnText: { fontSize: 13, fontWeight: '700', color: '#1D4ED8' },

  chat: { flex: 1, paddingHorizontal: 16 },
  chatContent: { paddingVertical: 8, paddingBottom: 16 },
  chatEmpty: { padding: 20 },
  chatEmptyText: { fontSize: 13, color: '#94A3B8', textAlign: 'center', lineHeight: 19 },

  bubble: { maxWidth: '82%', borderRadius: 14, paddingHorizontal: 14, paddingVertical: 10, marginBottom: 8 },
  bubbleUser: { alignSelf: 'flex-end', backgroundColor: '#1D4ED8' },
  bubbleModel: { alignSelf: 'flex-start', backgroundColor: '#fff', borderWidth: 1, borderColor: '#E2E8F0' },
  bubbleTimestamp: { fontSize: 10, fontWeight: '700', color: '#BFDBFE', marginBottom: 2 },
  bubbleText: { fontSize: 14, color: '#0F172A', lineHeight: 20 },
  bubbleTextUser: { color: '#fff' },

  anchorBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#EFF6FF', paddingHorizontal: 16, paddingVertical: 8 },
  anchorText: { fontSize: 12, fontWeight: '700', color: '#1D4ED8' },
  anchorClear: { fontSize: 12, fontWeight: '700', color: '#64748B' },

  inputBar: { flexDirection: 'row', alignItems: 'flex-end', gap: 8, paddingHorizontal: 16, paddingVertical: 12, paddingBottom: 20, backgroundColor: '#fff', borderTopWidth: 1, borderTopColor: '#E2E8F0' },
  anchorBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#F1F5F9', alignItems: 'center', justifyContent: 'center' },
  anchorBtnText: { fontSize: 16 },
  input: { flex: 1, backgroundColor: '#F1F5F9', borderRadius: 20, paddingHorizontal: 14, paddingVertical: 10, fontSize: 14, color: '#0F172A', maxHeight: 100 },
  sendBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#1D4ED8', alignItems: 'center', justifyContent: 'center' },
  sendBtnText: { fontSize: 16, color: '#fff', fontWeight: '700' },
  btnDisabled: { opacity: 0.5 },

  emptyState: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 40 },
  emptyEmoji: { fontSize: 48, marginBottom: 16 },
  emptyTitle: { fontSize: 18, fontWeight: '700', color: '#0F172A', marginBottom: 20 },
  btnSecondary: { backgroundColor: '#fff', borderWidth: 1.5, borderColor: '#CBD5E1', borderRadius: 999, paddingVertical: 14, paddingHorizontal: 24 },
  btnSecondaryText: { fontSize: 14, fontWeight: '700', color: '#475569' },
});
