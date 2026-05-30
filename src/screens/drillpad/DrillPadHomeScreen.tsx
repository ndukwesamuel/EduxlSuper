

import React, { useState, useCallback } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  StyleSheet, RefreshControl, Alert, Modal, TextInput, ActivityIndicator,
  Button,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AppStackParamList } from '../../navigation/types';
import { Colors, FontSize, Radius, Spacing, Shadows } from '../../theme';
import { getSubjects, createSubject, DrillSubject } from "../../../config/client" 

type Nav = NativeStackNavigationProp<AppStackParamList>;

export default function DrillPadHomeScreen() {

  const navigation = useNavigation<Nav>();

  const [subjects, setSubjects]         = useState<DrillSubject[]>([]);
  const [loading, setLoading]           = useState(true);
  const [refreshing, setRefreshing]     = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [newName, setNewName]           = useState('');
  const [newDesc, setNewDesc]           = useState('');
  const [creating, setCreating]         = useState(false);

  const load = async () => {
    try {
      const data = await getSubjects();
      console.log({ data });
      setSubjects(data);
    } catch (e) {
      Alert.alert('Error', 'Could not load subjects. Check your connection.');
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
    if (!newName.trim()) return Alert.alert('Required', 'Enter a subject name');
    setCreating(true);
    try {
      const subject = await createSubject(newName.trim(), newDesc.trim() || undefined);
      setSubjects((prev) => [subject, ...prev]);
      setModalVisible(false);
      setNewName('');
      setNewDesc('');
    } catch {
      Alert.alert('Error', 'Could not create subject');
    } finally {
      setCreating(false);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.loaderWrap}>
          <ActivityIndicator size="large" color={Colors.brand} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>


      <Button title="Go to DrillSubjectScreen (test)" 
      // onPress={() =>navigation.navi}
      onPress={() => navigation.goBack()}
      // onPress={() => navigation.navigate('DrillSubject', {
      //   subjectId: '64b8c9f1e4b0a5d6c1234567',
      //   subjectName: 'Sample Subject',
      // })} 
      
      />
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Colors.brand} />
        }
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>DrillPad</Text>
            <Text style={styles.subtitle}>Your private question bank</Text>
          </View>
          <TouchableOpacity style={styles.newBtn} onPress={() => setModalVisible(true)}>
            <Text style={styles.newBtnText}>+ New</Text>
          </TouchableOpacity>
        </View>

        {/* Empty state */}
        {subjects.length === 0 && (
          <View style={styles.emptyWrap}>
            <Text style={styles.emptyIcon}>📚</Text>
            <Text style={styles.emptyTitle}>No subjects yet</Text>
            <Text style={styles.emptyDesc}>
              Create a subject, paste your questions from ChatGPT or DeepSeek, and start drilling.
            </Text>
            <TouchableOpacity style={styles.emptyBtn} onPress={() => setModalVisible(true)}>
              <Text style={styles.emptyBtnText}>Create your first subject</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Subject list */}
        {subjects.map((subject) => (
          <TouchableOpacity
            key={subject._id}
            style={styles.card}
            activeOpacity={0.8}
            onPress={() => navigation.navigate('DrillSubject', {
              subjectId: subject._id,
              subjectName: subject.name,
            })}
          >
            <View style={styles.cardLeft}>
              <View style={styles.cardIcon}>
                <Text style={{ fontSize: 22 }}>📖</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.cardName}>{subject.name}</Text>
                {subject.description ? (
                  <Text style={styles.cardDesc} numberOfLines={1}>{subject.description}</Text>
                ) : null}
                <View style={styles.cardMeta}>
                  <Text style={styles.metaText}>📝 {subject.totalQuestions} questions</Text>
                  {subject.weakCount > 0 && (
                    <View style={styles.weakPill}>
                      <Text style={styles.weakPillText}>⚠️ {subject.weakCount} weak</Text>
                    </View>
                  )}
                </View>
              </View>
            </View>
            <View style={styles.cardRight}>
              {subject.lastScore !== null && (
                <Text style={styles.scoreText}>{subject.lastScore}/10</Text>
              )}
              {subject.bestScore !== null && (
                <Text style={styles.bestText}>Best {subject.bestScore}/10</Text>
              )}
              <Text style={styles.arrow}>→</Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Create subject modal */}
      <Modal visible={modalVisible} transparent animationType="slide" onRequestClose={() => setModalVisible(false)}>
        <View style={styles.overlay}>
          <View style={styles.sheet}>
            <Text style={styles.sheetTitle}>New Subject</Text>
            <TextInput
              style={styles.input}
              placeholder="Subject name e.g. Law of Contract"
              placeholderTextColor={Colors.textMuted}
              value={newName}
              onChangeText={setNewName}
              autoFocus
            />
            <TextInput
              style={[styles.input, { marginTop: 10 }]}
              placeholder="Description (optional)"
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
                <Text style={styles.createText}>{creating ? 'Creating...' : 'Create'}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe:       { flex: 1, backgroundColor: Colors.background },
  loaderWrap: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  scroll:     { padding: Spacing.lg, paddingBottom: 100 },
  header:     { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 },
  title:      { fontSize: 28, fontWeight: '800', color: Colors.textPrimary },
  subtitle:   { fontSize: 14, color: Colors.textSecondary, marginTop: 2 },
  newBtn:     { backgroundColor: Colors.brand, paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20 },
  newBtnText: { fontSize: 14, fontWeight: '700', color: '#fff' },
  emptyWrap:  { alignItems: 'center', paddingVertical: 48 },
  emptyIcon:  { fontSize: 52, marginBottom: 16 },
  emptyTitle: { fontSize: 20, fontWeight: '700', color: Colors.textPrimary, marginBottom: 8 },
  emptyDesc:  { fontSize: 14, color: Colors.textSecondary, textAlign: 'center', lineHeight: 22, marginBottom: 24, paddingHorizontal: 16 },
  emptyBtn:   { backgroundColor: Colors.brand, paddingHorizontal: 24, paddingVertical: 12, borderRadius: 20 },
  emptyBtnText: { fontSize: 14, fontWeight: '700', color: '#fff' },
  card:       { backgroundColor: Colors.surface, borderRadius: 16, padding: 16, marginBottom: 12, flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: Colors.border },
  cardLeft:   { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 12 },
  cardIcon:   { width: 48, height: 48, borderRadius: 12, backgroundColor: '#EEF2FF', alignItems: 'center', justifyContent: 'center' },
  cardName:   { fontSize: 16, fontWeight: '700', color: Colors.textPrimary, marginBottom: 2 },
  cardDesc:   { fontSize: 12, color: Colors.textSecondary, marginBottom: 4 },
  cardMeta:   { flexDirection: 'row', alignItems: 'center', gap: 8 },
  metaText:   { fontSize: 12, color: Colors.textMuted },
  weakPill:   { backgroundColor: '#FEF3C7', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 10 },
  weakPillText: { fontSize: 11, fontWeight: '600', color: '#92400E' },
  cardRight:  { alignItems: 'flex-end', gap: 2 },
  scoreText:  { fontSize: 18, fontWeight: '800', color: Colors.brand },
  bestText:   { fontSize: 11, color: Colors.textMuted },
  arrow:      { fontSize: 18, color: Colors.textMuted, marginTop: 4 },
  overlay:    { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  sheet:      { backgroundColor: Colors.surface, borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24, paddingBottom: 40 },
  sheetTitle: { fontSize: 20, fontWeight: '800', color: Colors.textPrimary, marginBottom: 16 },
  input:      { backgroundColor: Colors.background, borderRadius: 10, borderWidth: 1, borderColor: Colors.border, padding: 14, fontSize: 14, color: Colors.textPrimary },
  sheetBtns:  { flexDirection: 'row', gap: 12, marginTop: 16 },
  cancelBtn:  { flex: 1, padding: 14, borderRadius: 10, borderWidth: 1, borderColor: Colors.border, alignItems: 'center' },
  cancelText: { fontSize: 14, fontWeight: '600', color: Colors.textSecondary },
  createBtn:  { flex: 1, padding: 14, borderRadius: 10, backgroundColor: Colors.brand, alignItems: 'center' },
  createText: { fontSize: 14, fontWeight: '700', color: '#fff' },
});