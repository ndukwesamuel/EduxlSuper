
// ─── AILessonScreen.tsx ────────────────────────────────────────────
// Library view: lists all AI Lessons (podcasts) generated for a subject.
import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet,
  Animated, Alert, FlatList, ActivityIndicator, TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp, useFocusEffect } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import * as DocumentPicker from 'expo-document-picker';
import { AppStackParamList } from '../../navigation/types';
import {
  getSubjectPodcasts,
  createSubjectPodcast,
  deletePodcast,
  renamePodcast,
  Podcast,
  getSubjectMaterials,
  SubjectMaterial,
} from '../../../config/client';

type Nav   = NativeStackNavigationProp<AppStackParamList>;
type Route = RouteProp<AppStackParamList, 'AILesson'>;

export default function AILessonScreen() {
  const navigation = useNavigation<Nav>();
  const route      = useRoute<Route>();
  const { subjectId, subjectName } = route.params;

  const [podcasts, setPodcasts]     = useState<Podcast[]>([]);
  const [loading, setLoading]       = useState(true);
  const [generating, setGenerating] = useState(false);

  // Generate modal state
  const [showGenerateModal, setShowGenerateModal] = useState(false);
  const [pendingFile, setPendingFile] = useState<DocumentPicker.DocumentPickerAsset | null>(null);
  const [titleInput, setTitleInput]   = useState('');

  // Material picker state (for "Use Existing Notes")
  const [showMaterialPicker, setShowMaterialPicker] = useState(false);
  const [materials, setMaterials] = useState<SubjectMaterial[]>([]);
  const [loadingMaterials, setLoadingMaterials] = useState(false);
  const [selectedMaterialId, setSelectedMaterialId] = useState<string | null>(null);

  // Rename modal state
  const [renamingPodcast, setRenamingPodcast] = useState<Podcast | null>(null);
  const [renameInput, setRenameInput] = useState('');

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
      const data = await getSubjectPodcasts(subjectId);
      setPodcasts(Array.isArray(data) ? data : []);
    } catch {
      setPodcasts([]);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(useCallback(() => { load(); }, [subjectId]));

  // ── Step 1a: pick a new file to upload ─────────────────────────
  const pickFile = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['application/pdf', 'image/jpeg', 'image/png', 'image/webp'],
        copyToCacheDirectory: true,
      });

      if (result.canceled || !result.assets?.[0]) return;

      setPendingFile(result.assets[0]);
      setTitleInput('');
      setShowGenerateModal(true);
    } catch {
      Alert.alert('Error', 'Could not open file picker.');
    }
  };

  // ── Step 1b: show the list of documents already uploaded to this
  // subject, so the student picks the exact one to generate from ──
  const generateFromExisting = async () => {
    setShowMaterialPicker(true);
    setLoadingMaterials(true);
    try {
      const data = await getSubjectMaterials(subjectId);
      setMaterials(Array.isArray(data) ? data.filter(m => m.status === 'ready') : []);
    } catch {
      setMaterials([]);
    } finally {
      setLoadingMaterials(false);
    }
  };

  // ── Step 1c: student picked one specific document from the list ──
  const selectMaterial = (material: SubjectMaterial) => {
    setSelectedMaterialId(material._id);
    setPendingFile(null);
    setTitleInput('');
    setShowMaterialPicker(false);
    setShowGenerateModal(true);
  };

  // ── "+ New" entry point — choose upload vs. reuse existing notes ──
  const handleNewPress = () => {
    Alert.alert(
      'New AI Lesson',
      'Upload a new document, or generate from notes already uploaded to this subject.',
      [
        { text: 'Upload New Notes', onPress: pickFile },
        { text: 'Use Existing Notes', onPress: generateFromExisting },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

  // ── Step 2: confirm generate ─────────────────────────────────
  const confirmGenerate = async () => {
    setShowGenerateModal(false);
    setGenerating(true);

    try {
      const formData = new FormData();

      if (pendingFile) {
        formData.append('file', {
          uri: pendingFile.uri,
          name: pendingFile.name,
          type: pendingFile.mimeType || 'application/pdf',
        } as any);
      } else if (selectedMaterialId) {
        formData.append('materialId', selectedMaterialId);
      }

      const title = titleInput.trim() || subjectName;
      formData.append('title', title);

      const podcast = await createSubjectPodcast(subjectId, formData);
      setPodcasts(prev => [podcast, ...prev]);

      Alert.alert('AI Lesson ready!', `"${podcast.title}" has been generated.`);
    } catch (err: any) {
      Alert.alert('Generation failed', err?.message || 'Could not generate AI lesson. Try again.');
    } finally {
      setGenerating(false);
      setPendingFile(null);
      setSelectedMaterialId(null);
    }
  };

  // ── Rename ────────────────────────────────────────────────────
  const openRename = (podcast: Podcast) => {
    setRenamingPodcast(podcast);
    setRenameInput(podcast.title);
  };

  const confirmRename = async () => {
    if (!renamingPodcast) return;
    const newTitle = renameInput.trim();
    if (!newTitle) return;

    try {
      const updated = await renamePodcast(renamingPodcast._id, newTitle);
      setPodcasts(prev => prev.map(p => (p._id === updated._id ? updated : p)));
    } catch {
      Alert.alert('Error', 'Could not rename. Try again.');
    } finally {
      setRenamingPodcast(null);
    }
  };

  // ── Delete ────────────────────────────────────────────────────
  const handleDelete = (podcast: Podcast) => {
    Alert.alert(
      'Delete lesson?',
      `"${podcast.title}" will be permanently deleted.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deletePodcast(podcast._id);
              setPodcasts(prev => prev.filter(p => p._id !== podcast._id));
            } catch {
              Alert.alert('Error', 'Could not delete. Try again.');
            }
          },
        },
      ]
    );
  };

  // ── Long press menu ───────────────────────────────────────────
  const showOptions = (podcast: Podcast) => {
    Alert.alert(
      podcast.title,
      'What would you like to do?',
      [
        { text: 'Rename', onPress: () => openRename(podcast) },
        { text: 'Delete', style: 'destructive', onPress: () => handleDelete(podcast) },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

  const formatDuration = (secs: number) => {
    const m = Math.round(secs / 60);
    return m <= 1 ? '~1 min' : `~${m} min`;
  };

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-NG', { day: 'numeric', month: 'short' });
  };

  // ── Render podcast card ──────────────────────────────────────
  const renderItem = ({ item }: { item: Podcast }) => (
    <TouchableOpacity
      style={styles.podcastCard}
      activeOpacity={0.8}
      onPress={() => navigation.navigate('PodcastPlayer', { podcastId: item._id, subjectName })}
      onLongPress={() => showOptions(item)}
    >
      <View style={styles.podcastIconWrap}>
        <Text style={styles.podcastIcon}>🎧</Text>
      </View>
      <View style={{ flex: 1 }}>
        <Text style={styles.podcastTitle} numberOfLines={1}>{item.title}</Text>
        <Text style={styles.podcastMeta}>
          {formatDuration(item.durationSeconds)} · {formatDate(item.createdAt)}
        </Text>
      </View>
      <TouchableOpacity onPress={() => showOptions(item)} style={styles.moreBtn}>
        <Text style={styles.moreBtnText}>⋯</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#1D4ED8" />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <Animated.View style={[styles.container, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>

        {/* ── Header ── */}
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backRow}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>

        <View style={styles.headerRow}>
          <View>
            <Text style={styles.title}>AI Lessons</Text>
            <Text style={styles.subjectLabel}>{subjectName}</Text>
          </View>
          <TouchableOpacity
            style={styles.addBtn}
            onPress={handleNewPress}
            activeOpacity={0.85}
            disabled={generating}
          >
            <Text style={styles.addBtnText}>{generating ? '...' : '+ New'}</Text>
          </TouchableOpacity>
        </View>

        {/* ── Generating banner ── */}
        {generating && (
          <View style={styles.generatingBanner}>
            <ActivityIndicator size="small" color="#1D4ED8" />
            <Text style={styles.generatingText}>
              Generating your lesson... this takes 20-40 seconds.
            </Text>
          </View>
        )}

        {/* ── List or empty state ── */}
        {podcasts.length === 0 && !generating ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyEmoji}>🎧</Text>
            <Text style={styles.emptyTitle}>No AI lessons yet</Text>
            <Text style={styles.emptyDesc}>
              Upload your lecture notes (PDF or image) and we'll turn them into
              short audio lessons you can listen to anytime — even on your commute.
            </Text>
            <TouchableOpacity style={styles.btnPrimary} onPress={handleNewPress} activeOpacity={0.85}>
              <Text style={styles.btnPrimaryText}>📂 Upload Notes & Generate</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <FlatList
            data={podcasts}
            keyExtractor={(item) => item._id}
            renderItem={renderItem}
            contentContainerStyle={{ paddingBottom: 24, gap: 10 }}
            showsVerticalScrollIndicator={false}
          />
        )}

        {/* ── Commute tip ── */}
        {podcasts.length > 0 && (
          <View style={styles.commuteTip}>
            <Text style={styles.commuteTipTitle}>🎧 Great for commuting</Text>
            <Text style={styles.commuteTipText}>
              Tap any lesson to listen — your notes, read aloud.
            </Text>
          </View>
        )}

      </Animated.View>

      {/* ── Generate modal ── */}
      {showGenerateModal && (
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Name this lesson</Text>
            <Text style={styles.modalDesc}>
              {pendingFile ? (
                `Give your AI lesson a title, or leave blank to use "${subjectName}".`
              ) : selectedMaterialId ? (
                `Generating from "${materials.find(m => m._id === selectedMaterialId)?.filename || 'selected document'}". Give it a title, or leave blank.`
              ) : (
                `Give your AI lesson a title, or leave blank to use "${subjectName}".`
              )}
            </Text>
            <TextInput
              style={styles.modalInput}
              placeholder={subjectName}
              placeholderTextColor="#94A3B8"
              value={titleInput}
              onChangeText={setTitleInput}
              autoFocus
            />
            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.modalCancelBtn}
                onPress={() => { setShowGenerateModal(false); setPendingFile(null); setSelectedMaterialId(null); }}
              >
                <Text style={styles.modalCancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalConfirmBtn} onPress={confirmGenerate}>
                <Text style={styles.modalConfirmText}>Generate</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}

      {/* ── Material picker modal ── */}
      {showMaterialPicker && (
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Choose a document</Text>
            <Text style={styles.modalDesc}>
              Pick which uploaded document to generate this lesson from.
            </Text>

            {loadingMaterials ? (
              <ActivityIndicator size="small" color="#1D4ED8" style={{ marginVertical: 20 }} />
            ) : materials.length === 0 ? (
              <Text style={[styles.modalDesc, { marginVertical: 12 }]}>
                No documents uploaded yet for this subject.
              </Text>
            ) : (
              <FlatList
                data={materials}
                keyExtractor={(item) => item._id}
                style={{ maxHeight: 260, marginBottom: 8 }}
                renderItem={({ item }) => (
                  <TouchableOpacity style={styles.materialRow} onPress={() => selectMaterial(item)}>
                    <Text style={styles.materialIcon}>📄</Text>
                    <Text style={styles.materialName} numberOfLines={1}>{item.filename}</Text>
                  </TouchableOpacity>
                )}
              />
            )}

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.modalCancelBtn}
                onPress={() => setShowMaterialPicker(false)}
              >
                <Text style={styles.modalCancelText}>Cancel</Text>
              </TouchableOpacity>
              {!loadingMaterials && materials.length === 0 && (
                <TouchableOpacity
                  style={styles.modalConfirmBtn}
                  onPress={() => { setShowMaterialPicker(false); pickFile(); }}
                >
                  <Text style={styles.modalConfirmText}>Upload Instead</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </View>
      )}

      {/* ── Rename modal ── */}
      {renamingPodcast && (
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Rename lesson</Text>
            <TextInput
              style={styles.modalInput}
              value={renameInput}
              onChangeText={setRenameInput}
              autoFocus
            />
            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.modalCancelBtn} onPress={() => setRenamingPodcast(null)}>
                <Text style={styles.modalCancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalConfirmBtn} onPress={confirmRename}>
                <Text style={styles.modalConfirmText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe:   { flex: 1, backgroundColor: '#F8FAFC' },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  container: { flex: 1, padding: 16 },

  backRow:  { marginBottom: 8 },
  backText: { fontSize: 14, color: '#1D4ED8', fontWeight: '600' },

  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: -0.5,
    marginBottom: 2,
  },
  subjectLabel: {
    fontSize: 12,
    color: '#94A3B8',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  addBtn: {
    backgroundColor: '#1D4ED8',
    borderRadius: 9999,
    paddingHorizontal: 18,
    paddingVertical: 10,
  },
  addBtnText: { fontSize: 13, fontWeight: '700', color: '#fff' },

  // ── Generating banner ──
  generatingBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#EFF6FF',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#BFDBFE',
  },
  generatingText: { fontSize: 12, color: '#1D4ED8', fontWeight: '600', flex: 1 },

  // ── Empty state ──
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    paddingBottom: 80,
  },
  emptyEmoji: { fontSize: 48 },
  emptyTitle: { fontSize: 18, fontWeight: '800', color: '#0F172A' },
  emptyDesc: {
    fontSize: 13,
    color: '#475569',
    textAlign: 'center',
    lineHeight: 20,
    paddingHorizontal: 8,
  },
  btnPrimary: {
    backgroundColor: '#1D4ED8',
    borderRadius: 9999,
    paddingHorizontal: 24,
    paddingVertical: 14,
    marginTop: 8,
    shadowColor: '#1D4ED8',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 14,
    elevation: 6,
  },
  btnPrimaryText: { fontSize: 14, fontWeight: '700', color: '#fff' },

  // ── Podcast card ──
  podcastCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  podcastIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#FFF7ED',
    alignItems: 'center',
    justifyContent: 'center',
  },
  podcastIcon: { fontSize: 20 },
  podcastTitle: { fontSize: 14, fontWeight: '700', color: '#0F172A', marginBottom: 2 },
  podcastMeta: { fontSize: 11, color: '#94A3B8', fontWeight: '600' },
  moreBtn: { padding: 6 },
  moreBtnText: { fontSize: 18, color: '#94A3B8', fontWeight: '800' },

  // ── Commute tip ──
  commuteTip: {
    backgroundColor: '#FFF7ED',
    borderRadius: 12,
    padding: 12,
    borderLeftWidth: 3,
    borderLeftColor: '#F97316',
    marginTop: 12,
  },
  commuteTipTitle: { fontSize: 12, fontWeight: '700', color: '#9A3412', marginBottom: 2 },
  commuteTipText: { fontSize: 12, color: '#C2410C', lineHeight: 18 },

  // ── Modal ──
  modalOverlay: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(15,23,42,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  modalCard: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 20,
    gap: 8,
  },
  modalTitle: { fontSize: 16, fontWeight: '800', color: '#0F172A' },
  modalDesc: { fontSize: 12, color: '#64748B', lineHeight: 18, marginBottom: 4 },
  modalInput: {
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: '#0F172A',
    marginBottom: 8,
  },
  modalActions: { flexDirection: 'row', gap: 8 },
  modalCancelBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 9999,
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
  },
  modalCancelText: { fontSize: 13, fontWeight: '700', color: '#475569' },
  modalConfirmBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 9999,
    alignItems: 'center',
    backgroundColor: '#1D4ED8',
  },
  modalConfirmText: { fontSize: 13, fontWeight: '700', color: '#fff' },

  // ── Material picker ──
  materialRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderRadius: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  materialIcon: { fontSize: 16 },
  materialName: { fontSize: 13, fontWeight: '600', color: '#0F172A', flex: 1 },
});