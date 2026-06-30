

import React, { useState, useCallback } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet,
  RefreshControl, Alert, Modal, TextInput, ActivityIndicator,
  Pressable,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Svg, { Path, Circle, Rect } from 'react-native-svg';
import { AppStackParamList } from '../../navigation/types';
import { Colors, FontSize, Radius, Spacing } from '../../theme';
import { getSubjects, createSubject, DrillSubject } from '../../../config/client';

type Nav = NativeStackNavigationProp<AppStackParamList>;

// ── Course accent colours (cycles through list) ───────────────────
const ACCENTS = [
  { bg: '#FEF3C7', text: '#D97706' }, // amber
  { bg: '#EDE9FE', text: '#7C3AED' }, // purple
  { bg: '#DBEAFE', text: '#2563EB' }, // blue
  { bg: '#D1FAE5', text: '#059669' }, // green
  { bg: '#FCE7F3', text: '#DB2777' }, // pink
  { bg: '#FEE2E2', text: '#DC2626' }, // red
];

const COURSE_EMOJIS = ['📐', '📱', '✍️', '🧬', '📓', '🔬', '📊', '🧪', '🌍', '📖'];

function accentFor(index: number) {
  return ACCENTS[index % ACCENTS.length];
}
function emojiFor(index: number) {
  return COURSE_EMOJIS[index % COURSE_EMOJIS.length];
}

// ── SVG Icons ─────────────────────────────────────────────────────
function SearchIcon() {
  return (
    <Svg width={16} height={16} viewBox="0 0 24 24" fill="none"
      stroke="#CBD5E1" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <Circle cx={11} cy={11} r={8} />
      <Path d="m21 21-4.3-4.3" />
    </Svg>
  );
}

function PlusIcon({ color = '#fff', size = 20 }: { color?: string; size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke={color} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
      <Path d="M12 5v14M5 12h14" />
    </Svg>
  );
}

function ChevronRightIcon() {
  return (
    <Svg width={16} height={16} viewBox="0 0 24 24" fill="none"
      stroke="#CBD5E1" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <Path d="m9 18 6-6-6-6" />
    </Svg>
  );
}

function BookIcon({ color }: { color: string }) {
  return (
    <Svg width={22} height={22} viewBox="0 0 24 24" fill="none"
      stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <Path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
      <Path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
    </Svg>
  );
}

// ── Main Screen ───────────────────────────────────────────────────
export default function LearnScreen() {
  const navigation = useNavigation<Nav>();

  const [courses, setCourses]           = useState<DrillSubject[]>([]);
  const [loading, setLoading]           = useState(true);
  const [refreshing, setRefreshing]     = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [search, setSearch]             = useState('');
  const [newName, setNewName]           = useState('');
  const [newDesc, setNewDesc]           = useState('');
  const [creating, setCreating]         = useState(false);

  const load = async () => {
    try {
      const data = await getSubjects();
      setCourses(data);
    } catch {
      Alert.alert('Error', 'Could not load courses. Check your connection.');
    }
  };

  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      load().finally(() => setLoading(false));
    }, [])
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await load();
    setRefreshing(false);
  };

  const handleCreate = async () => {
    if (!newName.trim()) return Alert.alert('Required', 'Enter a course name');
    setCreating(true);
    try {
      const course = await createSubject(newName.trim(), newDesc.trim() || undefined);
      setCourses((prev) => [course, ...prev]);
      setModalVisible(false);
      setNewName('');
      setNewDesc('');
    } catch {
      Alert.alert('Error', 'Could not create course');
    } finally {
      setCreating(false);
    }
  };

  const filtered = courses.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  // aggregate stats
  const totalQuestions = courses.reduce((s, c) => s + c.totalQuestions, 0);
  const totalWeak      = courses.reduce((s, c) => s + c.weakCount, 0);

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
        keyboardShouldPersistTaps="handled"
      >
        {/* ── Header ── */}
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>My Courses</Text>
            <Text style={styles.subtitle}>
              {courses.length} course{courses.length !== 1 ? 's' : ''} · keep pushing 💪
            </Text>
          </View>
          <TouchableOpacity style={styles.addBtn} onPress={() => setModalVisible(true)}>
            <PlusIcon />
          </TouchableOpacity>
        </View>

        {/* ── Search ── */}
        <View style={styles.searchBar}>
          <SearchIcon />
          <TextInput
            style={styles.searchInput}
            placeholder="Search courses..."
            placeholderTextColor="#CBD5E1"
            value={search}
            onChangeText={setSearch}
          />
        </View>

        {/* ── Stats strip ── */}
        {courses.length > 0 && (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.statsStrip}
          >
            <View style={styles.statChip}>
              <Text style={styles.statChipIcon}>📚</Text>
              <View>
                <Text style={styles.statChipVal}>{courses.length}</Text>
                <Text style={styles.statChipLabel}>courses</Text>
              </View>
            </View>
            <View style={styles.statChip}>
              <Text style={styles.statChipIcon}>✅</Text>
              <View>
                <Text style={styles.statChipVal}>{totalQuestions}</Text>
                <Text style={styles.statChipLabel}>questions</Text>
              </View>
            </View>
            {totalWeak > 0 && (
              <View style={[styles.statChip, { borderColor: '#FDE68A' }]}>
                <Text style={styles.statChipIcon}>⚠️</Text>
                <View>
                  <Text style={[styles.statChipVal, { color: '#D97706' }]}>{totalWeak}</Text>
                  <Text style={styles.statChipLabel}>weak questions</Text>
                </View>
              </View>
            )}
          </ScrollView>
        )}

        {/* ── Empty state ── */}
        {courses.length === 0 && (
          <View style={styles.empty}>
            <Text style={styles.emptyIcon}>📖</Text>
            <Text style={styles.emptyTitle}>No courses yet</Text>
            <Text style={styles.emptyDesc}>
              Create a course, add your questions from ChatGPT or any AI tool, and start drilling.
            </Text>
            <TouchableOpacity style={styles.emptyBtn} onPress={() => setModalVisible(true)}>
              <Text style={styles.emptyBtnText}>Create your first course</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* ── Course list ── */}
        {filtered.length > 0 && (
          <>
            <Text style={styles.sectionLabel}>YOUR COURSES</Text>
            {filtered.map((course, index) => {
              const accent   = accentFor(index);
              const emoji    = emojiFor(index);
              const progress = course.bestScore !== null
                ? Math.round((course.bestScore / 10) * 100)
                : 0;

              return (
                <TouchableOpacity
                  key={course._id}
                  style={[
                    styles.courseCard,
                    course.weakCount > 0 && styles.courseCardWeak,
                  ]}
                  activeOpacity={0.75}
                  onPress={() => navigation.navigate('DrillSubject', {
                    subjectId: course._id,
                    subjectName: course.name,
                  })}
                >
                  {/* Icon */}
                  <View style={[styles.courseIcon, { backgroundColor: accent.bg }]}>
                    <Text style={{ fontSize: 22 }}>{emoji}</Text>
                  </View>

                  {/* Body */}
                  <View style={styles.courseBody}>
                    <Text style={styles.courseName} numberOfLines={1}>{course.name}</Text>

                    <View style={styles.courseMeta}>
                      <Text style={styles.courseMetaText}>
                        {course.totalQuestions} question{course.totalQuestions !== 1 ? 's' : ''}
                      </Text>
                      {course.weakCount > 0 && (
                        <>
                          <Text style={styles.courseMetaDot}>·</Text>
                          <View style={styles.weakPill}>
                            <Text style={styles.weakPillText}>⚠️ {course.weakCount} weak</Text>
                          </View>
                        </>
                      )}
                      {course.totalQuestions === 0 && (
                        <View style={styles.notStartedPill}>
                          <Text style={styles.notStartedText}>not started</Text>
                        </View>
                      )}
                    </View>

                    {/* Progress bar */}
                    <View style={styles.progressRow}>
                      <View style={styles.progressTrack}>
                        <View style={[
                          styles.progressFill,
                          { width: `${progress}%` as any, backgroundColor: accent.text },
                        ]} />
                      </View>
                      <Text style={styles.progressPct}>{progress}%</Text>
                    </View>
                  </View>

                  {/* Score + arrow */}
                  <View style={styles.courseRight}>
                    {course.lastScore !== null && (
                      <View style={styles.scoreBadge}>
                        <Text style={[styles.scoreVal, { color: accent.text }]}>
                          {course.lastScore}/10
                        </Text>
                        <Text style={styles.scoreSub}>last</Text>
                      </View>
                    )}
                    <ChevronRightIcon />
                  </View>
                </TouchableOpacity>
              );
            })}
          </>
        )}

        {/* No search results */}
        {courses.length > 0 && filtered.length === 0 && (
          <View style={styles.noResults}>
            <Text style={styles.noResultsText}>No courses match "{search}"</Text>
          </View>
        )}

        <View style={{ height: 80 }} />
      </ScrollView>

      {/* ── FAB ── */}
      <TouchableOpacity style={styles.fab} onPress={() => setModalVisible(true)}>
        <PlusIcon size={24} />
      </TouchableOpacity>

      {/* ── Create course modal ── */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <Pressable style={styles.overlay} onPress={() => setModalVisible(false)}>
          <Pressable style={styles.sheet} onPress={() => {}}>
            <View style={styles.sheetHandle} />

            <View style={styles.sheetHeader}>
              <BookIcon color={Colors.brand} />
              <Text style={styles.sheetTitle}>New Course</Text>
            </View>
            <Text style={styles.sheetSub}>
              Give your course a name — e.g. "Financial Accounting" or "Verbal Reasoning"
            </Text>

            <Text style={styles.inputLabel}>Course name</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. Law of Contract"
              placeholderTextColor={Colors.textMuted}
              value={newName}
              onChangeText={setNewName}
              autoFocus
            />

            <Text style={[styles.inputLabel, { marginTop: 12 }]}>Description (optional)</Text>
            <TextInput
              style={styles.input}
              placeholder="What is this course about?"
              placeholderTextColor={Colors.textMuted}
              value={newDesc}
              onChangeText={setNewDesc}
            />

            <View style={styles.sheetBtns}>
              <TouchableOpacity
                style={styles.cancelBtn}
                onPress={() => { setModalVisible(false); setNewName(''); setNewDesc(''); }}
              >
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.createBtn, creating && { opacity: 0.6 }]}
                onPress={handleCreate}
                disabled={creating}
              >
                {creating
                  ? <ActivityIndicator size="small" color="#fff" />
                  : <Text style={styles.createText}>Create course</Text>
                }
              </TouchableOpacity>
            </View>
          </Pressable>
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
}

// ── Styles ────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  safe:   { flex: 1, backgroundColor: '#F8FAFC' },
  loader: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  scroll: { paddingBottom: 120 },

  // Header
  header:   { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', padding: 20, paddingBottom: 8 },
  title:    { fontSize: 30, fontWeight: '800', color: '#0F172A', letterSpacing: -0.8 },
  subtitle: { fontSize: 13, color: '#94A3B8', fontWeight: '500', marginTop: 4 },
  addBtn:   { width: 44, height: 44, borderRadius: 22, backgroundColor: '#0F172A', alignItems: 'center', justifyContent: 'center' },

  // Search
  searchBar:   { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: '#fff', borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 14, padding: 11, marginHorizontal: 20, marginBottom: 4 },
  searchInput: { flex: 1, fontSize: 14, color: '#0F172A', padding: 0 },

  // Stats strip
  statsStrip: { paddingHorizontal: 20, paddingVertical: 16, gap: 10 },
  statChip:   { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: '#fff', borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 12, paddingHorizontal: 14, paddingVertical: 10 },
  statChipIcon:  { fontSize: 16 },
  statChipVal:   { fontSize: 15, fontWeight: '800', color: '#0F172A' },
  statChipLabel: { fontSize: 11, color: '#94A3B8', fontWeight: '500' },

  // Section label
  sectionLabel: { fontSize: 11, fontWeight: '700', color: '#94A3B8', letterSpacing: 1.2, paddingHorizontal: 20, paddingBottom: 10, paddingTop: 4 },

  // Course card
  courseCard: {
    flexDirection: 'row', alignItems: 'center', gap: 14,
    backgroundColor: '#fff', borderWidth: 1, borderColor: '#E2E8F0',
    borderRadius: 20, padding: 16, marginHorizontal: 20, marginBottom: 10,
  },
  courseCardWeak: { borderColor: '#FDE68A' },
  courseIcon: { width: 52, height: 52, borderRadius: 16, alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  courseBody: { flex: 1, minWidth: 0 },
  courseName: { fontSize: 16, fontWeight: '700', color: '#0F172A', marginBottom: 3 },
  courseMeta: { flexDirection: 'row', alignItems: 'center', gap: 6, flexWrap: 'wrap', marginBottom: 8 },
  courseMetaText: { fontSize: 12, color: '#94A3B8', fontWeight: '500' },
  courseMetaDot:  { fontSize: 12, color: '#CBD5E1' },

  weakPill:      { backgroundColor: '#FEF3C7', borderRadius: 999, paddingHorizontal: 8, paddingVertical: 2 },
  weakPillText:  { fontSize: 11, fontWeight: '700', color: '#D97706' },
  notStartedPill:{ backgroundColor: '#F1F5F9', borderRadius: 999, paddingHorizontal: 8, paddingVertical: 2 },
  notStartedText:{ fontSize: 11, fontWeight: '600', color: '#94A3B8' },

  progressRow:  { flexDirection: 'row', alignItems: 'center', gap: 8 },
  progressTrack:{ flex: 1, height: 4, backgroundColor: '#F1F5F9', borderRadius: 2, overflow: 'hidden' },
  progressFill: { height: 4, borderRadius: 2 },
  progressPct:  { fontSize: 11, fontWeight: '700', color: '#64748B', width: 30, textAlign: 'right' },

  courseRight: { alignItems: 'flex-end', gap: 6, flexShrink: 0 },
  scoreBadge:  { alignItems: 'flex-end' },
  scoreVal:    { fontSize: 20, fontWeight: '800', lineHeight: 22 },
  scoreSub:    { fontSize: 10, color: '#94A3B8', fontWeight: '500' },

  // No results
  noResults:     { alignItems: 'center', paddingVertical: 32 },
  noResultsText: { fontSize: 14, color: '#94A3B8' },

  // Empty state
  empty:       { margin: 20, backgroundColor: '#fff', borderWidth: 1.5, borderColor: '#E2E8F0', borderStyle: 'dashed', borderRadius: 20, padding: 40, alignItems: 'center' },
  emptyIcon:   { fontSize: 42, marginBottom: 12 },
  emptyTitle:  { fontSize: 18, fontWeight: '700', color: '#0F172A', marginBottom: 6 },
  emptyDesc:   { fontSize: 13, color: '#94A3B8', lineHeight: 20, textAlign: 'center', marginBottom: 24 },
  emptyBtn:    { backgroundColor: '#0F172A', paddingHorizontal: 28, paddingVertical: 14, borderRadius: 999 },
  emptyBtnText:{ fontSize: 14, fontWeight: '700', color: '#fff' },

  // FAB
  fab: {
    position: 'absolute', bottom: 100, right: 22,
    width: 56, height: 56, borderRadius: 28,
    backgroundColor: Colors.brand,
    alignItems: 'center', justifyContent: 'center',
    shadowColor: Colors.brand, shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3, shadowRadius: 16, elevation: 8,
  },

  // Modal
  overlay:    { flex: 1, backgroundColor: 'rgba(0,0,0,0.45)', justifyContent: 'flex-end' },
  sheet:      { backgroundColor: '#fff', borderTopLeftRadius: 28, borderTopRightRadius: 28, padding: 24, paddingBottom: 40 },
  sheetHandle:{ width: 36, height: 4, backgroundColor: '#E2E8F0', borderRadius: 2, alignSelf: 'center', marginBottom: 20 },
  sheetHeader:{ flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 6 },
  sheetTitle: { fontSize: 22, fontWeight: '800', color: '#0F172A' },
  sheetSub:   { fontSize: 13, color: '#94A3B8', lineHeight: 20, marginBottom: 20 },
  inputLabel: { fontSize: 12, fontWeight: '700', color: '#64748B', marginBottom: 6, letterSpacing: 0.3 },
  input:      { backgroundColor: '#F8FAFC', borderRadius: 12, borderWidth: 1, borderColor: '#E2E8F0', padding: 14, fontSize: 15, color: '#0F172A' },
  sheetBtns:  { flexDirection: 'row', gap: 12, marginTop: 24 },
  cancelBtn:  { flex: 1, padding: 15, borderRadius: 12, borderWidth: 1, borderColor: '#E2E8F0', alignItems: 'center' },
  cancelText: { fontSize: 14, fontWeight: '600', color: '#64748B' },
  createBtn:  { flex: 2, padding: 15, borderRadius: 12, backgroundColor: Colors.brand, alignItems: 'center' },
  createText: { fontSize: 14, fontWeight: '700', color: '#fff' },
});