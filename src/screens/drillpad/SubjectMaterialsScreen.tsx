// ─── SubjectMaterialsScreen.tsx ──────────────────────────────────
import React, { useState, useCallback } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet,
  RefreshControl, Alert, ActivityIndicator, Linking,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp, useFocusEffect } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Svg, { Path, Circle } from 'react-native-svg';
import { AppStackParamList } from '../../navigation/types';
import { Colors, Spacing } from '../../theme';

type Nav   = NativeStackNavigationProp<AppStackParamList>;
type Route = RouteProp<AppStackParamList, 'SubjectMaterials'>;

// ── API calls ─────────────────────────────────────────────────────
// Add these to your config/client.ts

export interface SubjectMaterial {
  _id: string;
  filename: string;
  mimeType: string;
  fileSize: number;
  fileUrl: string;
  status: 'ready' | 'processing' | 'failed';
  createdAt: string;
}

async function getMaterials(subjectId: string): Promise<SubjectMaterial[]> {
  const { store } = require('../../../src/store/store');
  const token = store.getState().auth?.token ?? '';
  const res = await fetch(
    `https://eduxl2-production.up.railway.app/api/v1/drillpad/subjects/${subjectId}/materials`,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  const json = await res.json();
  return json?.data ?? [];
}

async function deleteMaterialApi(materialId: string): Promise<void> {
  const { store } = require('../../../src/store/store');
  const token = store.getState().auth?.token ?? '';
  await fetch(
    `https://eduxl2-production.up.railway.app/api/v1/drillpad/materials/${materialId}`,
    { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } }
  );
}

// ── SVG Icons ─────────────────────────────────────────────────────
function BackIcon() {
  return (
    <Svg width={18} height={18} viewBox="0 0 24 24" fill="none"
      stroke="#1D4ED8" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <Path d="m15 18-6-6 6-6" />
    </Svg>
  );
}

function UploadIcon() {
  return (
    <Svg width={18} height={18} viewBox="0 0 24 24" fill="none"
      stroke="#fff" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <Path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <Path d="m17 8-5-5-5 5" />
      <Path d="M12 3v12" />
    </Svg>
  );
}

function TrashIcon() {
  return (
    <Svg width={16} height={16} viewBox="0 0 24 24" fill="none"
      stroke="#DC2626" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <Path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
    </Svg>
  );
}

function ExternalLinkIcon() {
  return (
    <Svg width={14} height={14} viewBox="0 0 24 24" fill="none"
      stroke="#1D4ED8" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <Path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
      <Path d="M15 3h6v6" />
      <Path d="m10 14 11-11" />
    </Svg>
  );
}

// ── Helpers ───────────────────────────────────────────────────────
function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-NG', {
    day: 'numeric', month: 'short', year: 'numeric',
  });
}

function fileIcon(mimeType: string): string {
  if (mimeType === 'application/pdf') return '📄';
  if (mimeType.startsWith('image/')) return '🖼️';
  return '📁';
}

// ── Screen ────────────────────────────────────────────────────────
export default function SubjectMaterialsScreen() {
  const navigation = useNavigation<Nav>();
  const route      = useRoute<Route>();
  const { subjectId, subjectName } = route.params;

  const [materials, setMaterials]   = useState<SubjectMaterial[]>([]);
  const [loading, setLoading]       = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [deleting, setDeleting]     = useState<string | null>(null);

  const load = async () => {
    try {
      const data = await getMaterials(subjectId);
      setMaterials(data);
    } catch {
      Alert.alert('Error', 'Could not load materials.');
    }
  };

  useFocusEffect(useCallback(() => {
    load().finally(() => setLoading(false));
  }, [subjectId]));

  const onRefresh = async () => {
    setRefreshing(true);
    await load();
    setRefreshing(false);
  };

  const handleDelete = (material: SubjectMaterial) => {
    Alert.alert(
      'Delete material?',
      `"${material.filename}" will be removed from ${subjectName}. The AI won't be able to reference it in chat anymore.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            setDeleting(material._id);
            try {
              await deleteMaterialApi(material._id);
              setMaterials((prev) => prev.filter((m) => m._id !== material._id));
            } catch {
              Alert.alert('Error', 'Could not delete material.');
            } finally {
              setDeleting(null);
            }
          },
        },
      ]
    );
  };

  const handleOpen = (material: SubjectMaterial) => {
    Linking.openURL(material.fileUrl).catch(() => {
      Alert.alert('Error', 'Could not open file.');
    });
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.loader}>
          <ActivityIndicator size="large" color={Colors.brand} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Colors.brand} />
        }
      >
        {/* ── Header ── */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <BackIcon />
            <Text style={styles.backText}>{subjectName}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.uploadBtn}
            onPress={() => navigation.navigate('DrillAddQuestions', { subjectId, subjectName })}
          >
            <UploadIcon />
            <Text style={styles.uploadBtnText}>Upload</Text>
          </TouchableOpacity>
        </View>

        {/* ── Title ── */}
        <Text style={styles.title}>Materials</Text>
        <Text style={styles.subtitle}>
          {materials.length} document{materials.length !== 1 ? 's' : ''} · used as AI chat context
        </Text>

        {/* ── Info banner ── */}
        <View style={styles.infoBanner}>
          <Text style={styles.infoBannerIcon}>💬</Text>
          <Text style={styles.infoBannerText}>
            When you chat with AI in this course, it references all your uploaded documents to give grounded answers.
          </Text>
        </View>

        {/* ── Empty state ── */}
        {materials.length === 0 && (
          <View style={styles.empty}>
            <Text style={styles.emptyIcon}>📂</Text>
            <Text style={styles.emptyTitle}>No materials yet</Text>
            <Text style={styles.emptyDesc}>
              Upload your lecture notes, past questions, or textbook pages. The AI will use them when you chat about {subjectName}.
            </Text>
            <TouchableOpacity
              style={styles.emptyBtn}
              onPress={() => navigation.navigate('DrillAddQuestions', { subjectId, subjectName })}
            >
              <Text style={styles.emptyBtnText}>📤 Upload your first document</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* ── Materials list ── */}
        {materials.length > 0 && (
          <>
            <Text style={styles.sectionLabel}>YOUR DOCUMENTS</Text>
            {materials.map((material) => (
              <View key={material._id} style={styles.materialCard}>

                {/* Left: icon + info */}
                <View style={styles.materialLeft}>
                  <View style={[
                    styles.materialIcon,
                    { backgroundColor: material.mimeType === 'application/pdf' ? '#FEF2F2' : '#EFF6FF' },
                  ]}>
                    <Text style={styles.materialIconText}>{fileIcon(material.mimeType)}</Text>
                  </View>
                  <View style={styles.materialBody}>
                    <Text style={styles.materialName} numberOfLines={2}>{material.filename}</Text>
                    <View style={styles.materialMeta}>
                      <Text style={styles.materialMetaText}>{formatFileSize(material.fileSize)}</Text>
                      <Text style={styles.materialMetaDot}>·</Text>
                      <Text style={styles.materialMetaText}>{formatDate(material.createdAt)}</Text>
                    </View>
                    {/* Status pill */}
                    <View style={[
                      styles.statusPill,
                      { backgroundColor: material.status === 'ready' ? '#D1FAE5' : material.status === 'processing' ? '#FEF3C7' : '#FEE2E2' },
                    ]}>
                      <Text style={[
                        styles.statusText,
                        { color: material.status === 'ready' ? '#059669' : material.status === 'processing' ? '#D97706' : '#DC2626' },
                      ]}>
                        {material.status === 'ready' ? '✓ Ready' : material.status === 'processing' ? '⏳ Processing' : '✗ Failed'}
                      </Text>
                    </View>
                  </View>
                </View>

                {/* Right: actions */}
                <View style={styles.materialActions}>
                  {/* Open */}
                  <TouchableOpacity
                    style={styles.actionBtn}
                    onPress={() => handleOpen(material)}
                  >
                    <ExternalLinkIcon />
                  </TouchableOpacity>

                  {/* Delete */}
                  <TouchableOpacity
                    style={[styles.actionBtn, styles.actionBtnDelete]}
                    onPress={() => handleDelete(material)}
                    disabled={deleting === material._id}
                  >
                    {deleting === material._id
                      ? <ActivityIndicator size="small" color="#DC2626" />
                      : <TrashIcon />
                    }
                  </TouchableOpacity>
                </View>

              </View>
            ))}
          </>
        )}

        {/* ── Upload more CTA ── */}
        {materials.length > 0 && (
          <TouchableOpacity
            style={styles.uploadMoreBtn}
            onPress={() => navigation.navigate('DrillAddQuestions', { subjectId, subjectName })}
            activeOpacity={0.8}
          >
            <Text style={styles.uploadMoreText}>📤 Upload another document</Text>
          </TouchableOpacity>
        )}

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

// ── Styles ────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  safe:   { flex: 1, backgroundColor: '#F8FAFC' },
  loader: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  scroll: { paddingBottom: 40 },

  // Header
  header:        { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, paddingBottom: 8 },
  backBtn:       { flexDirection: 'row', alignItems: 'center', gap: 4 },
  backText:      { fontSize: 14, fontWeight: '600', color: '#1D4ED8' },
  uploadBtn:     { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#1D4ED8', paddingHorizontal: 14, paddingVertical: 8, borderRadius: 999 },
  uploadBtnText: { fontSize: 13, fontWeight: '700', color: '#fff' },

  // Title
  title:    { fontSize: 28, fontWeight: '800', color: '#0F172A', letterSpacing: -0.5, paddingHorizontal: 20, marginBottom: 4 },
  subtitle: { fontSize: 13, color: '#94A3B8', fontWeight: '500', paddingHorizontal: 20, marginBottom: 16 },

  // Info banner
  infoBanner: {
    flexDirection: 'row', alignItems: 'flex-start', gap: 10,
    backgroundColor: '#F5F3FF', borderRadius: 14, padding: 14,
    marginHorizontal: 20, marginBottom: 20,
    borderWidth: 1, borderColor: '#DDD6FE',
  },
  infoBannerIcon: { fontSize: 16, marginTop: 1 },
  infoBannerText: { flex: 1, fontSize: 13, color: '#4338CA', lineHeight: 20 },

  // Section label
  sectionLabel: { fontSize: 11, fontWeight: '700', color: '#94A3B8', letterSpacing: 1.2, paddingHorizontal: 20, marginBottom: 10 },

  // Material card
  materialCard: {
    flexDirection: 'row', alignItems: 'flex-start',
    backgroundColor: '#fff', borderWidth: 1, borderColor: '#E2E8F0',
    borderRadius: 18, padding: 14,
    marginHorizontal: 20, marginBottom: 10,
    gap: 12,
  },
  materialLeft:     { flex: 1, flexDirection: 'row', gap: 12, alignItems: 'flex-start' },
  materialIcon:     { width: 44, height: 44, borderRadius: 12, alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  materialIconText: { fontSize: 20 },
  materialBody:     { flex: 1, minWidth: 0 },
  materialName:     { fontSize: 14, fontWeight: '700', color: '#0F172A', marginBottom: 4, lineHeight: 20 },
  materialMeta:     { flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 6 },
  materialMetaText: { fontSize: 11, color: '#94A3B8', fontWeight: '500' },
  materialMetaDot:  { fontSize: 11, color: '#CBD5E1' },
  statusPill:       { alignSelf: 'flex-start', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 999 },
  statusText:       { fontSize: 11, fontWeight: '700' },

  // Actions
  materialActions: { flexDirection: 'column', gap: 8, flexShrink: 0 },
  actionBtn:       { width: 34, height: 34, borderRadius: 10, backgroundColor: '#F1F5F9', alignItems: 'center', justifyContent: 'center' },
  actionBtnDelete: { backgroundColor: '#FEF2F2' },

  // Empty state
  empty:       { margin: 20, backgroundColor: '#fff', borderWidth: 1.5, borderStyle: 'dashed', borderColor: '#E2E8F0', borderRadius: 20, padding: 36, alignItems: 'center' },
  emptyIcon:   { fontSize: 40, marginBottom: 12 },
  emptyTitle:  { fontSize: 18, fontWeight: '700', color: '#0F172A', marginBottom: 6 },
  emptyDesc:   { fontSize: 13, color: '#94A3B8', textAlign: 'center', lineHeight: 20, marginBottom: 24 },
  emptyBtn:    { backgroundColor: '#1D4ED8', paddingHorizontal: 24, paddingVertical: 13, borderRadius: 999 },
  emptyBtnText:{ fontSize: 14, fontWeight: '700', color: '#fff' },

  // Upload more
  uploadMoreBtn:  { marginHorizontal: 20, marginTop: 8, padding: 15, borderRadius: 14, borderWidth: 1.5, borderStyle: 'dashed', borderColor: '#C7D2FE', alignItems: 'center', backgroundColor: '#F5F7FF' },
  uploadMoreText: { fontSize: 14, fontWeight: '600', color: '#4F46E5' },
});
