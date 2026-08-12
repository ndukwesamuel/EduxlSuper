import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, TextInput,
  ActivityIndicator, Alert, KeyboardAvoidingView, Platform
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import * as DocumentPicker from 'expo-document-picker';
import { AppStackParamList } from '../../navigation/types';
import { Colors } from '../../theme';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import { BASE_URL } from '../../../config/client';

type Nav = NativeStackNavigationProp<AppStackParamList>;

export default function AiQuizSetupScreen() {
  const navigation = useNavigation<Nav>();
  const token = useSelector((s: RootState) => s.auth.token);

  const [url, setUrl] = useState('');
  const [file, setFile] = useState<DocumentPicker.DocumentPickerAsset | null>(null);
  const [loading, setLoading] = useState(false);

  const pickFile = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['application/pdf', 'image/*'],
        copyToCacheDirectory: true,
      });
      if (!result.canceled && result.assets && result.assets.length > 0) {
        setFile(result.assets[0]);
        setUrl(''); // Clear url if file is picked
      }
    } catch (e) {
      console.log(e);
    }
  };

  const handleGenerate = async () => {
    if (!url.trim() && !file) {
      Alert.alert('Required', 'Please provide a URL or upload a file.');
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('count', '50');

      if (file) {
        formData.append('file', {
          uri: file.uri,
          name: file.name,
          type: file.mimeType || 'application/pdf',
        } as any);
      } else if (url.trim()) {
        formData.append('url', url.trim());
      }
      const res = await fetch(`${BASE_URL}/ai/generate-quiz`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });
      console.log("res data: ", res);

      const data = await res.json();
      console.log("data: ", data);

      if (!res.ok) {
        throw new Error(data.message || 'Failed to generate quiz');
      }

      const questions = data.data.questions;
      if (!questions || questions.length === 0) {
        throw new Error('No questions generated');
      }

      navigation.replace('AiQuizSession', { questions });

    } catch (err: any) {
      Alert.alert('Error', err.message || 'An error occurred during generation.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <Text style={styles.backText}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.title}>AI Quiz Setup</Text>
          <View style={{ width: 60 }} />
        </View>

        <View style={styles.body}>
          <Text style={styles.desc}>
            Upload a PDF or paste a link, and our AI will instantly generate up to 50 multiple-choice questions with detailed explanations for you to test your knowledge!
          </Text>

          {/* Option 1: URL */}
          <Text style={styles.label}>1. Paste a Link</Text>
          <TextInput
            style={styles.input}
            placeholder="https://example.com/article"
            value={url}
            onChangeText={(t) => { setUrl(t); setFile(null); }}
            autoCapitalize="none"
            keyboardType="url"
          />

          <Text style={styles.or}>— OR —</Text>

          {/* Option 2: File */}
          <Text style={styles.label}>2. Upload a File</Text>
          <TouchableOpacity style={styles.uploadBtn} onPress={pickFile}>
            <Text style={styles.uploadBtnText}>
              {file ? `File: ${file.name}` : 'Pick PDF or Image'}
            </Text>
          </TouchableOpacity>

          <View style={{ flex: 1 }} />

          <TouchableOpacity
            style={[styles.generateBtn, loading && { opacity: 0.7 }]}
            onPress={handleGenerate}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.generateBtnText}>Generate Quiz ✨</Text>
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#F8FAFC' },
  container: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16, borderBottomWidth: 1, borderBottomColor: '#E2E8F0', backgroundColor: '#fff' },
  backBtn: { padding: 8, width: 60 },
  backText: { color: Colors.brand, fontWeight: '600' },
  title: { fontSize: 18, fontWeight: '700', color: '#0F172A' },
  body: { flex: 1, padding: 20 },
  desc: { fontSize: 14, color: '#64748B', lineHeight: 22, marginBottom: 30 },
  label: { fontSize: 14, fontWeight: '600', color: '#0F172A', marginBottom: 8 },
  input: { backgroundColor: '#fff', borderWidth: 1, borderColor: '#CBD5E1', borderRadius: 12, padding: 14, fontSize: 15 },
  or: { textAlign: 'center', marginVertical: 20, color: '#94A3B8', fontWeight: '600' },
  uploadBtn: { backgroundColor: '#fff', borderWidth: 1, borderColor: Colors.brand, borderStyle: 'dashed', borderRadius: 12, padding: 20, alignItems: 'center' },
  uploadBtnText: { color: Colors.brand, fontWeight: '600', fontSize: 15 },
  generateBtn: { backgroundColor: Colors.brand, padding: 16, borderRadius: 12, alignItems: 'center', marginTop: 20 },
  generateBtnText: { color: '#fff', fontSize: 16, fontWeight: '700' },
});
