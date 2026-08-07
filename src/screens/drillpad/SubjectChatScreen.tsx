// ─── SubjectChatScreen.tsx ────────────────────────────────────────
import React, { useState, useRef, useCallback } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  FlatList, ActivityIndicator, KeyboardAvoidingView,
  Platform, Alert, Pressable,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Svg, { Path, Circle } from 'react-native-svg';
import { AppStackParamList } from '../../navigation/types';
import { Colors } from '../../theme';
import { sendSubjectChat } from '../../../config/client';

type Nav   = NativeStackNavigationProp<AppStackParamList>;
type Route = RouteProp<AppStackParamList, 'SubjectChat'>;

// ── Types ─────────────────────────────────────────────────────────
interface Message {
  id:   string;
  role: 'user' | 'ai';
  text: string;
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

function SendIcon() {
  return (
    <Svg width={18} height={18} viewBox="0 0 24 24" fill="none"
      stroke="#fff" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <Path d="m22 2-7 20-4-9-9-4Z" />
      <Path d="M22 2 11 13" />
    </Svg>
  );
}

function SparkleIcon() {
  return (
    <Svg width={16} height={16} viewBox="0 0 24 24" fill="none"
      stroke="#6366F1" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <Path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
    </Svg>
  );
}

// ── Suggestion prompts ────────────────────────────────────────────
const getSuggestions = (subjectName: string) => [
  `Explain the key concepts in ${subjectName}`,
  'Quiz me on the most important topics',
  'Summarise what I need to know for the exam',
  'What are the hardest topics in this subject?',
];

// ── Screen ────────────────────────────────────────────────────────
export default function SubjectChatScreen() {
  const navigation = useNavigation<Nav>();
  const route      = useRoute<Route>();
  const { subjectId, subjectName, documentCount = 0, fileCount = 0, linkCount = 0 } = route.params;

  // "3 files, 2 links" / "3 files" / "2 links" — whichever parts are non-zero
  const materialBreakdown = [
    fileCount > 0 ? `${fileCount} file${fileCount !== 1 ? 's' : ''}` : null,
    linkCount > 0 ? `${linkCount} link${linkCount !== 1 ? 's' : ''}` : null,
  ].filter(Boolean).join(', ') || `${documentCount} document${documentCount !== 1 ? 's' : ''}`;

  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading]     = useState(false);
  const flatListRef = useRef<FlatList>(null);

  // Convert local messages to Gemini history format
  const buildHistory = (msgs: Message[]) =>
    msgs.map((m) => ({
      role:    m.role === 'user' ? 'user' as const : 'model' as const,
      content: m.text,
    }));

  const send = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || loading) return;

    const userMsg: Message = {
      id:   Date.now().toString(),
      role: 'user',
      text: trimmed,
    };

    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInputText('');
    setLoading(true);

    setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);

    try {
      // Send history BEFORE the new message (backend expects prior turns only)
      const history  = buildHistory(messages);
      const response = await sendSubjectChat(subjectId, subjectName, trimmed, history);
      const reply    = response.reply;

      const aiMsg: Message = {
        id:   (Date.now() + 1).toString(),
        role: 'ai',
        text: reply,
      };

      setMessages((prev) => [...prev, aiMsg]);
      setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);
    } catch (err: any) {
      Alert.alert('Error', err?.message ?? 'Could not get a response. Check your connection.');
      // Remove the user message if AI failed
      setMessages(messages);
    } finally {
      setLoading(false);
    }
  };

  const renderMessage = ({ item }: { item: Message }) => {
    const isUser = item.role === 'user';
    return (
      <View style={[styles.bubbleWrap, isUser ? styles.bubbleWrapUser : styles.bubbleWrapAI]}>
        {!isUser && (
          <View style={styles.aiAvatar}>
            <SparkleIcon />
          </View>
        )}
        <View style={[styles.bubble, isUser ? styles.bubbleUser : styles.bubbleAI]}>
          <Text style={[styles.bubbleText, isUser ? styles.bubbleTextUser : styles.bubbleTextAI]}>
            {item.text}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >

        {/* ── Header ── */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <BackIcon />
          </TouchableOpacity>
          <View style={styles.headerCenter}>
            <View style={styles.headerIconWrap}>
              <SparkleIcon />
            </View>
            <View>
              <Text style={styles.headerTitle}>Ask AI</Text>
              <Text style={styles.headerSub} numberOfLines={1}>{subjectName}</Text>
            </View>
          </View>
          {/* Document context badge */}
          <View style={[
            styles.docBadge,
            { backgroundColor: documentCount > 0 ? '#D1FAE5' : '#F1F5F9' },
          ]}>
            <Text style={[
              styles.docBadgeText,
              { color: documentCount > 0 ? '#059669' : '#94A3B8' },
            ]}>
              📄 {materialBreakdown}
            </Text>
          </View>
        </View>

        {/* ── Messages ── */}
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={(m) => m.id}
          renderItem={renderMessage}
          contentContainerStyle={styles.messagesList}
          showsVerticalScrollIndicator={false}
          onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
          ListEmptyComponent={
            <View style={styles.emptyChat}>
              {/* Grounded badge */}
              <View style={[
                styles.groundedBadge,
                { backgroundColor: documentCount > 0 ? '#D1FAE5' : '#F1F5F9' },
              ]}>
                <Text style={[
                  styles.groundedBadgeText,
                  { color: documentCount > 0 ? '#059669' : '#64748B' },
                ]}>
                  {documentCount > 0
                    ? `📚 Grounded in ${materialBreakdown}`
                    : '💬 General AI tutor — upload notes for grounded answers'}
                </Text>
              </View>

              <Text style={styles.emptyChatTitle}>Ask anything about</Text>
              <Text style={styles.emptyChatSubject}>{subjectName}</Text>
              <Text style={styles.emptyChatDesc}>
                {documentCount > 0
                  ? 'I have read your uploaded notes. Ask me to explain, quiz you, or clarify anything.'
                  : 'I can answer from general knowledge. Upload your notes so I can reference your specific material.'}
              </Text>

              {/* Suggestion chips */}
              <View style={styles.suggestions}>
                {getSuggestions(subjectName).map((s) => (
                  <TouchableOpacity
                    key={s}
                    style={styles.suggestionChip}
                    onPress={() => send(s)}
                    activeOpacity={0.75}
                  >
                    <Text style={styles.suggestionText}>{s}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* Upload nudge if no docs */}
              {documentCount === 0 && (
                <TouchableOpacity
                  style={styles.uploadNudge}
                  onPress={() => navigation.navigate('DrillAddQuestions', { subjectId, subjectName })}
                >
                  <Text style={styles.uploadNudgeText}>📤 Upload your notes</Text>
                </TouchableOpacity>
              )}
            </View>
          }
        />

        {/* Typing indicator */}
        {loading && (
          <View style={styles.typingWrap}>
            <View style={styles.aiAvatar}>
              <SparkleIcon />
            </View>
            <View style={styles.typingBubble}>
              <ActivityIndicator size="small" color="#6366F1" />
              <Text style={styles.typingText}>Thinking...</Text>
            </View>
          </View>
        )}

        {/* ── Input ── */}
        <View style={styles.inputRow}>
          <TextInput
            style={styles.input}
            placeholder={`Ask about ${subjectName}...`}
            placeholderTextColor="#94A3B8"
            value={inputText}
            onChangeText={setInputText}
            multiline
            maxLength={1000}
            returnKeyType="send"
            blurOnSubmit={false}
            onSubmitEditing={() => send(inputText)}
            editable={!loading}
          />
          <TouchableOpacity
            style={[styles.sendBtn, (!inputText.trim() || loading) && styles.sendBtnDisabled]}
            onPress={() => send(inputText)}
            disabled={!inputText.trim() || loading}
          >
            <SendIcon />
          </TouchableOpacity>
        </View>

      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

// ── Styles ────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#F8FAFC' },

  // Header
  header:         { flexDirection: 'row', alignItems: 'center', padding: 14, borderBottomWidth: 1, borderBottomColor: '#F1F5F9', backgroundColor: '#fff', gap: 10 },
  backBtn:        { padding: 4 },
  headerCenter:   { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 10 },
  headerIconWrap: { width: 36, height: 36, borderRadius: 10, backgroundColor: '#EDE9FE', alignItems: 'center', justifyContent: 'center' },
  headerTitle:    { fontSize: 15, fontWeight: '800', color: '#0F172A' },
  headerSub:      { fontSize: 11, color: '#94A3B8', marginTop: 1 },
  docBadge:       { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 999 },
  docBadgeText:   { fontSize: 10, fontWeight: '700' },

  // Messages list
  messagesList: { padding: 16, paddingBottom: 8, flexGrow: 1 },

  // Bubbles
  bubbleWrap:     { flexDirection: 'row', marginBottom: 12, alignItems: 'flex-end', gap: 8 },
  bubbleWrapUser: { justifyContent: 'flex-end' },
  bubbleWrapAI:   { justifyContent: 'flex-start' },
  aiAvatar:       { width: 28, height: 28, borderRadius: 8, backgroundColor: '#EDE9FE', alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  bubble:         { maxWidth: '78%', borderRadius: 18, padding: 12 },
  bubbleUser:     { backgroundColor: '#1D4ED8', borderBottomRightRadius: 4 },
  bubbleAI:       { backgroundColor: '#fff', borderBottomLeftRadius: 4, borderWidth: 1, borderColor: '#E2E8F0' },
  bubbleText:     { fontSize: 14, lineHeight: 21 },
  bubbleTextUser: { color: '#fff' },
  bubbleTextAI:   { color: '#0F172A' },

  // Typing indicator
  typingWrap:   { flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 16, paddingBottom: 8 },
  typingBubble: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: '#fff', borderRadius: 18, borderBottomLeftRadius: 4, padding: 12, borderWidth: 1, borderColor: '#E2E8F0' },
  typingText:   { fontSize: 13, color: '#6366F1', fontWeight: '500' },

  // Empty / welcome state
  emptyChat:       { flex: 1, alignItems: 'center', paddingTop: 32, paddingHorizontal: 20 },
  groundedBadge:   { paddingHorizontal: 14, paddingVertical: 6, borderRadius: 999, marginBottom: 24 },
  groundedBadgeText:{ fontSize: 12, fontWeight: '600' },
  emptyChatTitle:  { fontSize: 16, color: '#94A3B8', fontWeight: '500' },
  emptyChatSubject:{ fontSize: 22, fontWeight: '800', color: '#0F172A', letterSpacing: -0.3, marginBottom: 8, textAlign: 'center' },
  emptyChatDesc:   { fontSize: 13, color: '#64748B', textAlign: 'center', lineHeight: 20, marginBottom: 24 },

  // Suggestions
  suggestions:    { width: '100%', gap: 8, marginBottom: 20 },
  suggestionChip: { backgroundColor: '#fff', borderRadius: 12, padding: 12, borderWidth: 1, borderColor: '#E2E8F0' },
  suggestionText: { fontSize: 13, color: '#475569', fontWeight: '500' },

  // Upload nudge
  uploadNudge:     { backgroundColor: '#EDE9FE', borderRadius: 999, paddingHorizontal: 20, paddingVertical: 10 },
  uploadNudgeText: { fontSize: 13, fontWeight: '700', color: '#6366F1' },

  // Input
  inputRow:       { flexDirection: 'row', alignItems: 'flex-end', gap: 8, padding: 12, borderTopWidth: 1, borderTopColor: '#F1F5F9', backgroundColor: '#fff' },
  input:          { flex: 1, backgroundColor: '#F8FAFC', borderRadius: 16, borderWidth: 1, borderColor: '#E2E8F0', padding: 12, fontSize: 14, color: '#0F172A', maxHeight: 120, minHeight: 44 },
  sendBtn:        { width: 44, height: 44, borderRadius: 22, backgroundColor: '#1D4ED8', alignItems: 'center', justifyContent: 'center' },
  sendBtnDisabled:{ opacity: 0.35 },
});
