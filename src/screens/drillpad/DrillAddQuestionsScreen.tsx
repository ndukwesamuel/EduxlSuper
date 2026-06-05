// import React, { useState } from 'react';
// import {
//   View, Text, ScrollView, TouchableOpacity,
//   StyleSheet, Alert, TextInput, KeyboardAvoidingView,
//   Platform, ActivityIndicator,
// } from 'react-native';
// import { SafeAreaView } from 'react-native-safe-area-context';
// import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
// import { NativeStackNavigationProp } from '@react-navigation/native-stack';
// import * as DocumentPicker from 'expo-document-picker';
// import * as Clipboard from 'expo-clipboard';
// import * as FileSystem from 'expo-file-system';
// import * as Sharing from 'expo-sharing';
// import { AppStackParamList } from '../../navigation/types';
// import { Colors, FontSize, Radius, Spacing } from '../../theme';
// import { addBulkQuestions, addSingleQuestion, DrillOption } from '../../../config/client';

// type Nav   = NativeStackNavigationProp<AppStackParamList>;
// type Route = RouteProp<AppStackParamList, 'DrillAddQuestions'>;
// type TabType = 'csv' | 'manual';

// // ─── Prompt constant ───────────────────────────────────────────────
// const CHATGPT_PROMPT =
//   'Generate 20 questions about [your topic] as a CSV.\n' +
//   'Columns: question, A, B, C, D, answer, explanation\n' +
//   'Answer column = just the letter A B C or D.\n' +
//   'First row must be the column headers.';

// // ─── Generate sample CSV via Claude API ───────────────────────────
// async function generateSampleCSV(topic: string): Promise<string> {
//   const response = await fetch('https://api.anthropic.com/v1/messages', {
//     method: 'POST',
//     headers: { 'Content-Type': 'application/json' },
//     body: JSON.stringify({
//       model: 'claude-sonnet-4-20250514',
//       max_tokens: 1000,
//       system:
//         'You are a question generator. Return ONLY valid CSV text with no explanation, ' +
//         'no markdown, no backticks, and no extra text before or after. ' +
//         'First row must be exactly these headers: question,A,B,C,D,answer,explanation\n' +
//         'Each subsequent row is one question. Wrap every cell in double quotes. ' +
//         'The answer column must be a single letter: A, B, C, or D.',
//       messages: [
//         {
//           role: 'user',
//           content:
//             `Generate exactly 5 multiple-choice questions about "${topic}" as a CSV.\n` +
//             'Columns: question, A, B, C, D, answer, explanation\n' +
//             'Answer column = just the letter A B C or D.\n' +
//             'First row must be the column headers.\n' +
//             'Wrap every cell value in double quotes.',
//         },
//       ],
//     }),
//   });

//   if (!response.ok) throw new Error('API error');

//   const data = await response.json();
//   const raw  = data.content?.find((b: any) => b.type === 'text')?.text ?? '';

//   // Strip any accidental markdown fences
//   return raw.replace(/```[a-z]*\n?/gi, '').trim();
// }

// // ─── CSV Parser ────────────────────────────────────────────────────
// function parseCSV(
//   text: string,
// ): { question: string; options: DrillOption[]; correctOption: string; explanation?: string }[] {
//   const lines = text.trim().split('\n').map((l) => l.trim()).filter(Boolean);
//   if (lines.length < 2) return [];

//   const delimiter = lines[0].includes(';') ? ';' : ',';

//   const parseLine = (line: string): string[] => {
//     const result: string[] = [];
//     let current = '';
//     let inQuotes = false;
//     for (let i = 0; i < line.length; i++) {
//       const ch = line[i];
//       if (ch === '"') {
//         inQuotes = !inQuotes;
//       } else if (ch === delimiter && !inQuotes) {
//         result.push(current.trim());
//         current = '';
//       } else {
//         current += ch;
//       }
//     }
//     result.push(current.trim());
//     return result;
//   };

//   const headers = parseLine(lines[0]).map((h) => h.toLowerCase().replace(/['"]/g, '').trim());

//   const qIdx   = headers.findIndex((h) => h === 'question');
//   const aIdx   = headers.findIndex((h) => h === 'a');
//   const bIdx   = headers.findIndex((h) => h === 'b');
//   const cIdx   = headers.findIndex((h) => h === 'c');
//   const dIdx   = headers.findIndex((h) => h === 'd');
//   const ansIdx = headers.findIndex((h) => h === 'answer');
//   const expIdx = headers.findIndex((h) => h === 'explanation');

//   if (qIdx === -1 || aIdx === -1 || bIdx === -1 || cIdx === -1 || dIdx === -1 || ansIdx === -1) {
//     return [];
//   }

//   const results: { question: string; options: DrillOption[]; correctOption: string; explanation?: string }[] = [];

//   for (let i = 1; i < lines.length; i++) {
//     const cols        = parseLine(lines[i]);
//     const question    = cols[qIdx]?.replace(/^["']|["']$/g, '').trim();
//     const optA        = cols[aIdx]?.replace(/^["']|["']$/g, '').trim();
//     const optB        = cols[bIdx]?.replace(/^["']|["']$/g, '').trim();
//     const optC        = cols[cIdx]?.replace(/^["']|["']$/g, '').trim();
//     const optD        = cols[dIdx]?.replace(/^["']|["']$/g, '').trim();
//     const answer      = cols[ansIdx]?.replace(/^["']|["']$/g, '').trim().toUpperCase();
//     const explanation = expIdx !== -1 ? cols[expIdx]?.replace(/^["']|["']$/g, '').trim() : undefined;

//     if (!question || !optA || !optB || !optC || !optD || !['A', 'B', 'C', 'D'].includes(answer))
//       continue;

//     results.push({
//       question,
//       options: [
//         { label: 'A', text: optA },
//         { label: 'B', text: optB },
//         { label: 'C', text: optC },
//         { label: 'D', text: optD },
//       ],
//       correctOption: answer,
//       explanation: explanation || undefined,
//     });
//   }

//   return results;
// }

// // ─── Screen ────────────────────────────────────────────────────────
// export default function DrillAddQuestionsScreen() {
//   const navigation = useNavigation<Nav>();
//   const route      = useRoute<Route>();
//   const { subjectId, subjectName } = route.params;

//   const [tab, setTab]               = useState<TabType>('csv');
//   const [fileName, setFileName]     = useState('');
//   const [preview, setPreview]       = useState<ReturnType<typeof parseCSV>>([]);
//   const [submitting, setSubmitting] = useState(false);
//   const [picking, setPicking]       = useState(false);
//   const [copied, setCopied]         = useState(false);
//   const [downloading, setDownloading] = useState(false);

//   // Manual form
//   const [question, setQuestion]       = useState('');
//   const [optA, setOptA]               = useState('');
//   const [optB, setOptB]               = useState('');
//   const [optC, setOptC]               = useState('');
//   const [optD, setOptD]               = useState('');
//   const [correct, setCorrect]         = useState('');
//   const [explanation, setExplanation] = useState('');

//   // ─── Copy prompt ──────────────────────────────────────────────────
//   const handleCopyPrompt = async () => {
//     await Clipboard.setStringAsync(CHATGPT_PROMPT);
//     setCopied(true);
//     setTimeout(() => setCopied(false), 2500);
//   };

//   // ─── Download sample CSV (AI-generated for this subject) ─────────
//   const handleDownloadSample = async () => {
//     setDownloading(true);
//     try {
//       const csv  = await generateSampleCSV(subjectName);
//       const path = FileSystem.cacheDirectory + `${subjectName.replace(/\s+/g, '_')}_sample.csv`;
//       await FileSystem.writeAsStringAsync(path, csv, {
//         encoding: FileSystem.EncodingType.UTF8,
//       });
//       await Sharing.shareAsync(path, {
//         mimeType: 'text/csv',
//         dialogTitle: `Save ${subjectName} sample CSV`,
//         UTI: 'public.comma-separated-values-text',
//       });
//     } catch {
//       Alert.alert('Error', 'Could not generate sample — check your internet connection and try again.');
//     } finally {
//       setDownloading(false);
//     }
//   };

//   // ─── Pick CSV file ────────────────────────────────────────────────
//   const handlePickFile = async () => {
//     setPicking(true);
//     try {
//       const res = await DocumentPicker.getDocumentAsync({
//         type: ['text/csv', 'text/comma-separated-values', 'application/csv', '*/*'],
//         copyToCacheDirectory: true,
//       });

//       if (res.canceled) return;

//       const file = res.assets[0];
//       setFileName(file.name);

//       const response = await fetch(file.uri);
//       const text     = await response.text();
//       const parsed   = parseCSV(text);

//       if (parsed.length === 0) {
//         Alert.alert(
//           'Could not read file',
//           'Make sure your CSV has these column headers:\nquestion, A, B, C, D, answer, explanation\n\nDownload the sample CSV to see the exact format.',
//         );
//         return;
//       }

//       setPreview(parsed);
//     } catch {
//       Alert.alert('Error', 'Could not read file');
//     } finally {
//       setPicking(false);
//     }
//   };

//   // ─── Bulk submit ──────────────────────────────────────────────────
//   const handleBulkSubmit = async () => {
//     if (preview.length === 0) return;
//     setSubmitting(true);
//     try {
//       const result = await addBulkQuestions(subjectId, preview);
//       Alert.alert('Done!', `${result.added} questions added to ${subjectName}`, [
//         { text: 'OK', onPress: () => navigation.goBack() },
//       ]);
//     } catch {
//       Alert.alert('Error', 'Could not add questions');
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   // ─── Manual submit ────────────────────────────────────────────────
//   const handleManualSubmit = async () => {
//     if (!question.trim() || !optA || !optB || !optC || !optD || !correct) {
//       return Alert.alert('Required', 'Fill in all fields');
//     }
//     const validCorrect = correct.toUpperCase().trim();
//     if (!['A', 'B', 'C', 'D'].includes(validCorrect)) {
//       return Alert.alert('Invalid', 'Correct answer must be A, B, C, or D');
//     }
//     setSubmitting(true);
//     try {
//       await addSingleQuestion(
//         subjectId,
//         question.trim(),
//         [
//           { label: 'A', text: optA.trim() },
//           { label: 'B', text: optB.trim() },
//           { label: 'C', text: optC.trim() },
//           { label: 'D', text: optD.trim() },
//         ],
//         validCorrect,
//         explanation.trim() || undefined,
//       );
//       Alert.alert('Added!', 'Question added', [
//         {
//           text: 'Add another',
//           onPress: () => {
//             setQuestion('');
//             setOptA('');
//             setOptB('');
//             setOptC('');
//             setOptD('');
//             setCorrect('');
//             setExplanation('');
//           },
//         },
//         { text: 'Done', onPress: () => navigation.goBack() },
//       ]);
//     } catch {
//       Alert.alert('Error', 'Could not add question');
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   // ─── Render ───────────────────────────────────────────────────────
//   return (
//     <SafeAreaView style={styles.safe}>
//       <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
//         <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

//           {/* Header */}
//           <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backRow}>
//             <Text style={styles.backText}>← Back</Text>
//           </TouchableOpacity>
//           <Text style={styles.title}>Add Questions</Text>
//           <Text style={styles.subtitle}>{subjectName}</Text>

//           {/* Tabs */}
//           <View style={styles.tabs}>
//             <TouchableOpacity
//               style={[styles.tab, tab === 'csv' && styles.tabActive]}
//               onPress={() => setTab('csv')}
//             >
//               <Text style={[styles.tabText, tab === 'csv' && styles.tabTextActive]}>📂 Upload CSV</Text>
//             </TouchableOpacity>
//             <TouchableOpacity
//               style={[styles.tab, tab === 'manual' && styles.tabActive]}
//               onPress={() => setTab('manual')}
//             >
//               <Text style={[styles.tabText, tab === 'manual' && styles.tabTextActive]}>✏️ Manual</Text>
//             </TouchableOpacity>
//           </View>

//           {/* ── CSV Tab ── */}
//           {tab === 'csv' && (
//             <>
//               {/* How to use */}
//               <View style={styles.infoCard}>
//                 <Text style={styles.infoTitle}>📋 How to use</Text>
//                 <Text style={styles.infoText}>1. Ask ChatGPT or DeepSeek to generate questions</Text>
//                 <Text style={styles.infoText}>2. Tell it to format as CSV with these columns:</Text>
//                 <View style={styles.columnsBox}>
//                   <Text style={styles.columnsText}>question, A, B, C, D, answer, explanation</Text>
//                 </View>
//                 <Text style={styles.infoText}>3. Save as .csv and upload below</Text>
//               </View>

//               {/* ChatGPT prompt — copyable */}
//               <View style={styles.promptCard}>
//                 <View style={styles.promptHeader}>
//                   <Text style={styles.promptLabel}>Copy this prompt into ChatGPT:</Text>
//                   <TouchableOpacity onPress={handleCopyPrompt} style={styles.copyBtn} activeOpacity={0.7}>
//                     <Text style={styles.copyBtnText}>{copied ? '✅ Copied!' : '📋 Copy'}</Text>
//                   </TouchableOpacity>
//                 </View>
//                 <Text style={styles.promptText}>{CHATGPT_PROMPT}</Text>
//               </View>

//               {/* Download sample CSV */}
//               <TouchableOpacity
//                 style={[styles.sampleBtn, downloading && { opacity: 0.6 }]}
//                 onPress={handleDownloadSample}
//                 disabled={downloading}
//                 activeOpacity={0.8}
//               >
//                 {downloading ? (
//                   <>
//                     <ActivityIndicator color={Colors.brand} />
//                     <Text style={[styles.sampleBtnText, { marginTop: 6, fontSize: 12 }]}>
//                       Generating {subjectName} questions...
//                     </Text>
//                   </>
//                 ) : (
//                   <Text style={styles.sampleBtnText}>⬇️ Download sample — {subjectName}</Text>
//                 )}
//               </TouchableOpacity>

//               {/* Upload / Preview */}
//               {preview.length === 0 ? (
//                 <TouchableOpacity
//                   style={[styles.primaryBtn, picking && { opacity: 0.6 }]}
//                   onPress={handlePickFile}
//                   disabled={picking}
//                   activeOpacity={0.8}
//                 >
//                   {picking ? (
//                     <ActivityIndicator color="#fff" />
//                   ) : (
//                     <Text style={styles.primaryBtnText}>📂 Choose CSV file</Text>
//                   )}
//                 </TouchableOpacity>
//               ) : (
//                 <>
//                   <View style={styles.previewCard}>
//                     <Text style={styles.previewTitle}>
//                       ✅ {preview.length} questions found in {fileName}
//                     </Text>
//                     {preview.slice(0, 3).map((q, i) => (
//                       <Text key={i} style={styles.previewQ} numberOfLines={1}>
//                         • {q.question}
//                       </Text>
//                     ))}
//                     {preview.length > 3 && (
//                       <Text style={styles.previewMore}>+ {preview.length - 3} more...</Text>
//                     )}
//                   </View>

//                   <TouchableOpacity
//                     style={[styles.primaryBtn, submitting && { opacity: 0.6 }]}
//                     onPress={handleBulkSubmit}
//                     disabled={submitting}
//                     activeOpacity={0.8}
//                   >
//                     {submitting ? (
//                       <ActivityIndicator color="#fff" />
//                     ) : (
//                       <Text style={styles.primaryBtnText}>Upload {preview.length} questions</Text>
//                     )}
//                   </TouchableOpacity>

//                   <TouchableOpacity
//                     style={styles.changeFileBtn}
//                     onPress={() => { setPreview([]); setFileName(''); }}
//                   >
//                     <Text style={styles.changeFileBtnText}>Choose different file</Text>
//                   </TouchableOpacity>
//                 </>
//               )}
//             </>
//           )}

//           {/* ── Manual Tab ── */}
//           {tab === 'manual' && (
//             <>
//               <TextInput
//                 style={styles.input}
//                 placeholder="Question"
//                 placeholderTextColor={Colors.textMuted}
//                 value={question}
//                 onChangeText={setQuestion}
//                 multiline
//               />
//               {(['A', 'B', 'C', 'D'] as const).map((label) => {
//                 const val =
//                   label === 'A' ? optA
//                   : label === 'B' ? optB
//                   : label === 'C' ? optC
//                   : optD;
//                 const set =
//                   label === 'A' ? setOptA
//                   : label === 'B' ? setOptB
//                   : label === 'C' ? setOptC
//                   : setOptD;
//                 return (
//                   <TextInput
//                     key={label}
//                     style={styles.input}
//                     placeholder={`Option ${label}`}
//                     placeholderTextColor={Colors.textMuted}
//                     value={val}
//                     onChangeText={set}
//                   />
//                 );
//               })}
//               <TextInput
//                 style={styles.input}
//                 placeholder="Correct answer (A / B / C / D)"
//                 placeholderTextColor={Colors.textMuted}
//                 value={correct}
//                 onChangeText={setCorrect}
//                 autoCapitalize="characters"
//                 maxLength={1}
//               />
//               <TextInput
//                 style={styles.input}
//                 placeholder="Explanation (optional)"
//                 placeholderTextColor={Colors.textMuted}
//                 value={explanation}
//                 onChangeText={setExplanation}
//                 multiline
//               />
//               <TouchableOpacity
//                 style={[styles.primaryBtn, submitting && { opacity: 0.6 }]}
//                 onPress={handleManualSubmit}
//                 disabled={submitting}
//                 activeOpacity={0.8}
//               >
//                 <Text style={styles.primaryBtnText}>
//                   {submitting ? 'Adding...' : 'Add question'}
//                 </Text>
//               </TouchableOpacity>
//             </>
//           )}

//         </ScrollView>
//       </KeyboardAvoidingView>
//     </SafeAreaView>
//   );
// }

// // ─── Styles ────────────────────────────────────────────────────────
// const styles = StyleSheet.create({
//   safe:    { flex: 1, backgroundColor: Colors.background },
//   scroll:  { padding: Spacing.lg, paddingBottom: 100 },

//   backRow:  { marginBottom: 12 },
//   backText: { fontSize: 14, color: Colors.brand, fontWeight: '600' },
//   title:    { fontSize: 28, fontWeight: '800', color: Colors.textPrimary },
//   subtitle: { fontSize: 14, color: Colors.textSecondary, marginTop: 2, marginBottom: 24 },

//   tabs: {
//     flexDirection: 'row',
//     backgroundColor: Colors.surface,
//     borderRadius: 12,
//     padding: 4,
//     marginBottom: 20,
//     borderWidth: 1,
//     borderColor: Colors.border,
//   },
//   tab:          { flex: 1, paddingVertical: 10, borderRadius: 10, alignItems: 'center' },
//   tabActive:    { backgroundColor: Colors.brand },
//   tabText:      { fontSize: 14, fontWeight: '600', color: Colors.textSecondary },
//   tabTextActive: { color: '#fff' },

//   // How to use card
//   infoCard:   { backgroundColor: '#EEF2FF', borderRadius: 12, padding: 16, marginBottom: 12 },
//   infoTitle:  { fontSize: 14, fontWeight: '700', color: '#3730A3', marginBottom: 8 },
//   infoText:   { fontSize: 13, color: '#4338CA', marginBottom: 4, lineHeight: 20 },
//   columnsBox: { backgroundColor: '#C7D2FE', borderRadius: 6, padding: 8, marginVertical: 6 },
//   columnsText:{ fontSize: 12, fontFamily: 'monospace', color: '#312E81', fontWeight: '600' },

//   // Prompt card
//   promptCard: {
//     backgroundColor: '#F0FDF4',
//     borderRadius: 12,
//     padding: 16,
//     marginBottom: 12,
//     borderWidth: 1,
//     borderColor: '#BBF7D0',
//   },
//   promptHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: 10,
//   },
//   promptLabel: { fontSize: 12, fontWeight: '700', color: '#065F46' },
//   copyBtn:     { backgroundColor: '#D1FAE5', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 5 },
//   copyBtnText: { fontSize: 12, fontWeight: '700', color: '#065F46' },
//   promptText:  { fontSize: 12, color: '#047857', lineHeight: 20, fontFamily: 'monospace' },

//   // Sample download button
//   sampleBtn: {
//     borderWidth: 1.5,
//     borderColor: Colors.brand,
//     borderRadius: 50,
//     paddingVertical: 14,
//     alignItems: 'center',
//     marginBottom: 16,
//   },
//   sampleBtnText: { fontSize: 15, fontWeight: '700', color: Colors.brand },

//   // Primary button
//   primaryBtn:    { backgroundColor: Colors.brand, borderRadius: 50, paddingVertical: 16, alignItems: 'center', marginBottom: 12 },
//   primaryBtnText:{ fontSize: 16, fontWeight: '700', color: '#fff' },

//   // Preview card
//   previewCard: {
//     backgroundColor: '#F0FDF4',
//     borderRadius: 12,
//     padding: 16,
//     marginBottom: 12,
//     borderWidth: 1,
//     borderColor: '#BBF7D0',
//   },
//   previewTitle: { fontSize: 14, fontWeight: '700', color: '#065F46', marginBottom: 8 },
//   previewQ:     { fontSize: 13, color: Colors.textSecondary, marginBottom: 3 },
//   previewMore:  { fontSize: 12, color: Colors.textMuted, marginTop: 4 },

//   // Change file link
//   changeFileBtn:    { alignItems: 'center', paddingVertical: 10 },
//   changeFileBtnText:{ fontSize: 14, color: Colors.textSecondary, fontWeight: '600' },

//   // Manual tab inputs
//   input: {
//     backgroundColor: Colors.surface,
//     borderRadius: 10,
//     borderWidth: 1,
//     borderColor: Colors.border,
//     padding: 14,
//     fontSize: 14,
//     color: Colors.textPrimary,
//     marginBottom: 10,
//   },
// });

import React, { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  StyleSheet, Alert, TextInput, KeyboardAvoidingView,
  Platform, ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import * as DocumentPicker from 'expo-document-picker';
import * as Clipboard from 'expo-clipboard';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { AppStackParamList } from '../../navigation/types';
import { Colors, FontSize, Radius, Spacing } from '../../theme';
import { addBulkQuestions, addSingleQuestion, DrillOption } from '../../../config/client';

type Nav   = NativeStackNavigationProp<AppStackParamList>;
type Route = RouteProp<AppStackParamList, 'DrillAddQuestions'>;
type TabType = 'csv' | 'manual';

// ─── Dynamic prompt using subject name ────────────────────────────
const getChatGPTPrompt = (topic: string) =>
  `Generate 20 questions about ${topic} as a CSV.\n` +
  `Columns: question, A, B, C, D, answer, explanation\n` +
  `Answer column = just the letter A B C or D.\n` +
  `First row must be the column headers.`;

// ─── Generate sample CSV via Claude API ───────────────────────────
async function generateSampleCSV(topic: string): Promise<string> {
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1000,
      system:
        'You are a question generator. Return ONLY valid CSV text with no explanation, ' +
        'no markdown, no backticks, and no extra text before or after. ' +
        'First row must be exactly these headers: question,A,B,C,D,answer,explanation\n' +
        'Each subsequent row is one question. Wrap every cell in double quotes. ' +
        'The answer column must be a single letter: A, B, C, or D.',
      messages: [
        {
          role: 'user',
          content:
            `Generate exactly 5 multiple-choice questions about "${topic}" as a CSV.\n` +
            'Columns: question, A, B, C, D, answer, explanation\n' +
            'Answer column = just the letter A B C or D.\n' +
            'First row must be the column headers.\n' +
            'Wrap every cell value in double quotes.',
        },
      ],
    }),
  });

  if (!response.ok) throw new Error('API error');

  const data = await response.json();
  const raw  = data.content?.find((b: any) => b.type === 'text')?.text ?? '';

  // Strip any accidental markdown fences
  return raw.replace(/```[a-z]*\n?/gi, '').trim();
}

// ─── CSV Parser ────────────────────────────────────────────────────
function parseCSV(
  text: string,
): { question: string; options: DrillOption[]; correctOption: string; explanation?: string }[] {
  const lines = text.trim().split('\n').map((l) => l.trim()).filter(Boolean);
  if (lines.length < 2) return [];

  const delimiter = lines[0].includes(';') ? ';' : ',';

  const parseLine = (line: string): string[] => {
    const result: string[] = [];
    let current = '';
    let inQuotes = false;
    for (let i = 0; i < line.length; i++) {
      const ch = line[i];
      if (ch === '"') {
        inQuotes = !inQuotes;
      } else if (ch === delimiter && !inQuotes) {
        result.push(current.trim());
        current = '';
      } else {
        current += ch;
      }
    }
    result.push(current.trim());
    return result;
  };

  const headers = parseLine(lines[0]).map((h) => h.toLowerCase().replace(/['"]/g, '').trim());

  const qIdx   = headers.findIndex((h) => h === 'question');
  const aIdx   = headers.findIndex((h) => h === 'a');
  const bIdx   = headers.findIndex((h) => h === 'b');
  const cIdx   = headers.findIndex((h) => h === 'c');
  const dIdx   = headers.findIndex((h) => h === 'd');
  const ansIdx = headers.findIndex((h) => h === 'answer');
  const expIdx = headers.findIndex((h) => h === 'explanation');

  if (qIdx === -1 || aIdx === -1 || bIdx === -1 || cIdx === -1 || dIdx === -1 || ansIdx === -1) {
    return [];
  }

  const results: { question: string; options: DrillOption[]; correctOption: string; explanation?: string }[] = [];

  for (let i = 1; i < lines.length; i++) {
    const cols        = parseLine(lines[i]);
    const question    = cols[qIdx]?.replace(/^["']|["']$/g, '').trim();
    const optA        = cols[aIdx]?.replace(/^["']|["']$/g, '').trim();
    const optB        = cols[bIdx]?.replace(/^["']|["']$/g, '').trim();
    const optC        = cols[cIdx]?.replace(/^["']|["']$/g, '').trim();
    const optD        = cols[dIdx]?.replace(/^["']|["']$/g, '').trim();
    const answer      = cols[ansIdx]?.replace(/^["']|["']$/g, '').trim().toUpperCase();
    const explanation = expIdx !== -1 ? cols[expIdx]?.replace(/^["']|["']$/g, '').trim() : undefined;

    if (!question || !optA || !optB || !optC || !optD || !['A', 'B', 'C', 'D'].includes(answer))
      continue;

    results.push({
      question,
      options: [
        { label: 'A', text: optA },
        { label: 'B', text: optB },
        { label: 'C', text: optC },
        { label: 'D', text: optD },
      ],
      correctOption: answer,
      explanation: explanation || undefined,
    });
  }

  return results;
}

// ─── Screen ────────────────────────────────────────────────────────
export default function DrillAddQuestionsScreen() {
  const navigation = useNavigation<Nav>();
  const route      = useRoute<Route>();
  const { subjectId, subjectName } = route.params;

  const [tab, setTab]                 = useState<TabType>('csv');
  const [fileName, setFileName]       = useState('');
  const [preview, setPreview]         = useState<ReturnType<typeof parseCSV>>([]);
  const [submitting, setSubmitting]   = useState(false);
  const [picking, setPicking]         = useState(false);
  const [copied, setCopied]           = useState(false);
  const [downloading, setDownloading] = useState(false);

  // Manual form
  const [question, setQuestion]       = useState('');
  const [optA, setOptA]               = useState('');
  const [optB, setOptB]               = useState('');
  const [optC, setOptC]               = useState('');
  const [optD, setOptD]               = useState('');
  const [correct, setCorrect]         = useState('');
  const [explanation, setExplanation] = useState('');

  // ─── Copy prompt (uses subjectName) ──────────────────────────────
  const handleCopyPrompt = async () => {
    await Clipboard.setStringAsync(getChatGPTPrompt(subjectName));
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  // ─── Download sample CSV (AI-generated for this subject) ─────────
  const handleDownloadSample = async () => {
    setDownloading(true);
    try {
      const csv  = await generateSampleCSV(subjectName);
      const path = FileSystem.cacheDirectory + `${subjectName.replace(/\s+/g, '_')}_sample.csv`;
      await FileSystem.writeAsStringAsync(path, csv, {
        encoding: FileSystem.EncodingType.UTF8,
      });
      await Sharing.shareAsync(path, {
        mimeType: 'text/csv',
        dialogTitle: `Save ${subjectName} sample CSV`,
        UTI: 'public.comma-separated-values-text',
      });
    } catch {
      Alert.alert('Error', 'Could not generate sample — check your internet connection and try again.');
    } finally {
      setDownloading(false);
    }
  };

  // ─── Pick CSV file ────────────────────────────────────────────────
  const handlePickFile = async () => {
    setPicking(true);
    try {
      const res = await DocumentPicker.getDocumentAsync({
        type: ['text/csv', 'text/comma-separated-values', 'application/csv', '*/*'],
        copyToCacheDirectory: true,
      });

      if (res.canceled) return;

      const file = res.assets[0];
      setFileName(file.name);

      const response = await fetch(file.uri);
      const text     = await response.text();
      const parsed   = parseCSV(text);

      if (parsed.length === 0) {
        Alert.alert(
          'Could not read file',
          'Make sure your CSV has these column headers:\nquestion, A, B, C, D, answer, explanation\n\nDownload the sample CSV to see the exact format.',
        );
        return;
      }

      setPreview(parsed);
    } catch {
      Alert.alert('Error', 'Could not read file');
    } finally {
      setPicking(false);
    }
  };

  // ─── Bulk submit ──────────────────────────────────────────────────
  const handleBulkSubmit = async () => {
    if (preview.length === 0) return;
    setSubmitting(true);
    try {
      const result = await addBulkQuestions(subjectId, preview);
      Alert.alert('Done!', `${result.added} questions added to ${subjectName}`, [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch {
      Alert.alert('Error', 'Could not add questions');
    } finally {
      setSubmitting(false);
    }
  };

  // ─── Manual submit ────────────────────────────────────────────────
  const handleManualSubmit = async () => {
    if (!question.trim() || !optA || !optB || !optC || !optD || !correct) {
      return Alert.alert('Required', 'Fill in all fields');
    }
    const validCorrect = correct.toUpperCase().trim();
    if (!['A', 'B', 'C', 'D'].includes(validCorrect)) {
      return Alert.alert('Invalid', 'Correct answer must be A, B, C, or D');
    }
    setSubmitting(true);
    try {
      await addSingleQuestion(
        subjectId,
        question.trim(),
        [
          { label: 'A', text: optA.trim() },
          { label: 'B', text: optB.trim() },
          { label: 'C', text: optC.trim() },
          { label: 'D', text: optD.trim() },
        ],
        validCorrect,
        explanation.trim() || undefined,
      );
      Alert.alert('Added!', 'Question added', [
        {
          text: 'Add another',
          onPress: () => {
            setQuestion('');
            setOptA('');
            setOptB('');
            setOptC('');
            setOptD('');
            setCorrect('');
            setExplanation('');
          },
        },
        { text: 'Done', onPress: () => navigation.goBack() },
      ]);
    } catch {
      Alert.alert('Error', 'Could not add question');
    } finally {
      setSubmitting(false);
    }
  };

  // ─── Render ───────────────────────────────────────────────────────
  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

          {/* Header */}
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backRow}>
            <Text style={styles.backText}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Add Questions</Text>
          <Text style={styles.subtitle}>{subjectName}</Text>

          {/* Tabs */}
          <View style={styles.tabs}>
            <TouchableOpacity
              style={[styles.tab, tab === 'csv' && styles.tabActive]}
              onPress={() => setTab('csv')}
            >
              <Text style={[styles.tabText, tab === 'csv' && styles.tabTextActive]}>📂 Upload CSV</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.tab, tab === 'manual' && styles.tabActive]}
              onPress={() => setTab('manual')}
            >
              <Text style={[styles.tabText, tab === 'manual' && styles.tabTextActive]}>✏️ Manual</Text>
            </TouchableOpacity>
          </View>

          {/* ── CSV Tab ── */}
          {tab === 'csv' && (
            <>
              {/* How to use */}
              <View style={styles.infoCard}>
                <Text style={styles.infoTitle}>📋 How to use</Text>
                <Text style={styles.infoText}>1. Ask ChatGPT or DeepSeek to generate questions</Text>
                <Text style={styles.infoText}>2. Tell it to format as CSV with these columns:</Text>
                <View style={styles.columnsBox}>
                  <Text style={styles.columnsText}>question, A, B, C, D, answer, explanation</Text>
                </View>
                <Text style={styles.infoText}>3. Save as .csv and upload below</Text>
              </View>

              {/* ChatGPT prompt — uses subjectName, fully copyable */}
              <View style={styles.promptCard}>
                <View style={styles.promptHeader}>
                  <Text style={styles.promptLabel}>Copy this prompt into ChatGPT:</Text>
                  <TouchableOpacity onPress={handleCopyPrompt} style={styles.copyBtn} activeOpacity={0.7}>
                    <Text style={styles.copyBtnText}>{copied ? '✅ Copied!' : '📋 Copy'}</Text>
                  </TouchableOpacity>
                </View>
                {/* Display shows the actual subject name — no [your topic] placeholder */}
                <Text style={styles.promptText}>{getChatGPTPrompt(subjectName)}</Text>
              </View>

              {/* Download sample CSV — AI generates questions for this subject */}
              <TouchableOpacity
                style={[styles.sampleBtn, downloading && { opacity: 0.6 }]}
                onPress={handleDownloadSample}
                disabled={downloading}
                activeOpacity={0.8}
              >
                {downloading ? (
                  <>
                    <ActivityIndicator color={Colors.brand} />
                    <Text style={[styles.sampleBtnText, { marginTop: 6, fontSize: 12 }]}>
                      Generating {subjectName} questions...
                    </Text>
                  </>
                ) : (
                  <Text style={styles.sampleBtnText}>⬇️ Download sample — {subjectName}</Text>
                )}
              </TouchableOpacity>

              {/* Upload / Preview */}
              {preview.length === 0 ? (
                <TouchableOpacity
                  style={[styles.primaryBtn, picking && { opacity: 0.6 }]}
                  onPress={handlePickFile}
                  disabled={picking}
                  activeOpacity={0.8}
                >
                  {picking ? (
                    <ActivityIndicator color="#fff" />
                  ) : (
                    <Text style={styles.primaryBtnText}>📂 Choose CSV file</Text>
                  )}
                </TouchableOpacity>
              ) : (
                <>
                  <View style={styles.previewCard}>
                    <Text style={styles.previewTitle}>
                      ✅ {preview.length} questions found in {fileName}
                    </Text>
                    {preview.slice(0, 3).map((q, i) => (
                      <Text key={i} style={styles.previewQ} numberOfLines={1}>
                        • {q.question}
                      </Text>
                    ))}
                    {preview.length > 3 && (
                      <Text style={styles.previewMore}>+ {preview.length - 3} more...</Text>
                    )}
                  </View>

                  <TouchableOpacity
                    style={[styles.primaryBtn, submitting && { opacity: 0.6 }]}
                    onPress={handleBulkSubmit}
                    disabled={submitting}
                    activeOpacity={0.8}
                  >
                    {submitting ? (
                      <ActivityIndicator color="#fff" />
                    ) : (
                      <Text style={styles.primaryBtnText}>Upload {preview.length} questions</Text>
                    )}
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.changeFileBtn}
                    onPress={() => { setPreview([]); setFileName(''); }}
                  >
                    <Text style={styles.changeFileBtnText}>Choose different file</Text>
                  </TouchableOpacity>
                </>
              )}
            </>
          )}

          {/* ── Manual Tab ── */}
          {tab === 'manual' && (
            <>
              <TextInput
                style={styles.input}
                placeholder="Question"
                placeholderTextColor={Colors.textMuted}
                value={question}
                onChangeText={setQuestion}
                multiline
              />
              {(['A', 'B', 'C', 'D'] as const).map((label) => {
                const val =
                  label === 'A' ? optA
                  : label === 'B' ? optB
                  : label === 'C' ? optC
                  : optD;
                const set =
                  label === 'A' ? setOptA
                  : label === 'B' ? setOptB
                  : label === 'C' ? setOptC
                  : setOptD;
                return (
                  <TextInput
                    key={label}
                    style={styles.input}
                    placeholder={`Option ${label}`}
                    placeholderTextColor={Colors.textMuted}
                    value={val}
                    onChangeText={set}
                  />
                );
              })}
              <TextInput
                style={styles.input}
                placeholder="Correct answer (A / B / C / D)"
                placeholderTextColor={Colors.textMuted}
                value={correct}
                onChangeText={setCorrect}
                autoCapitalize="characters"
                maxLength={1}
              />
              <TextInput
                style={styles.input}
                placeholder="Explanation (optional)"
                placeholderTextColor={Colors.textMuted}
                value={explanation}
                onChangeText={setExplanation}
                multiline
              />
              <TouchableOpacity
                style={[styles.primaryBtn, submitting && { opacity: 0.6 }]}
                onPress={handleManualSubmit}
                disabled={submitting}
                activeOpacity={0.8}
              >
                <Text style={styles.primaryBtnText}>
                  {submitting ? 'Adding...' : 'Add question'}
                </Text>
              </TouchableOpacity>
            </>
          )}

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

// ─── Styles ────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  safe:    { flex: 1, backgroundColor: Colors.background },
  scroll:  { padding: Spacing.lg, paddingBottom: 100 },

  backRow:  { marginBottom: 12 },
  backText: { fontSize: 14, color: Colors.brand, fontWeight: '600' },
  title:    { fontSize: 28, fontWeight: '800', color: Colors.textPrimary },
  subtitle: { fontSize: 14, color: Colors.textSecondary, marginTop: 2, marginBottom: 24 },

  tabs: {
    flexDirection: 'row',
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 4,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  tab:           { flex: 1, paddingVertical: 10, borderRadius: 10, alignItems: 'center' },
  tabActive:     { backgroundColor: Colors.brand },
  tabText:       { fontSize: 14, fontWeight: '600', color: Colors.textSecondary },
  tabTextActive: { color: '#fff' },

  // How to use card
  infoCard:    { backgroundColor: '#EEF2FF', borderRadius: 12, padding: 16, marginBottom: 12 },
  infoTitle:   { fontSize: 14, fontWeight: '700', color: '#3730A3', marginBottom: 8 },
  infoText:    { fontSize: 13, color: '#4338CA', marginBottom: 4, lineHeight: 20 },
  columnsBox:  { backgroundColor: '#C7D2FE', borderRadius: 6, padding: 8, marginVertical: 6 },
  columnsText: { fontSize: 12, fontFamily: 'monospace', color: '#312E81', fontWeight: '600' },

  // Prompt card
  promptCard: {
    backgroundColor: '#F0FDF4',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#BBF7D0',
  },
  promptHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  promptLabel: { fontSize: 12, fontWeight: '700', color: '#065F46' },
  copyBtn:     { backgroundColor: '#D1FAE5', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 5 },
  copyBtnText: { fontSize: 12, fontWeight: '700', color: '#065F46' },
  promptText:  { fontSize: 12, color: '#047857', lineHeight: 20, fontFamily: 'monospace' },

  // Sample download button
  sampleBtn: {
    borderWidth: 1.5,
    borderColor: Colors.brand,
    borderRadius: 50,
    paddingVertical: 14,
    alignItems: 'center',
    marginBottom: 16,
  },
  sampleBtnText: { fontSize: 15, fontWeight: '700', color: Colors.brand },

  // Primary button
  primaryBtn:     { backgroundColor: Colors.brand, borderRadius: 50, paddingVertical: 16, alignItems: 'center', marginBottom: 12 },
  primaryBtnText: { fontSize: 16, fontWeight: '700', color: '#fff' },

  // Preview card
  previewCard: {
    backgroundColor: '#F0FDF4',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#BBF7D0',
  },
  previewTitle: { fontSize: 14, fontWeight: '700', color: '#065F46', marginBottom: 8 },
  previewQ:     { fontSize: 13, color: Colors.textSecondary, marginBottom: 3 },
  previewMore:  { fontSize: 12, color: Colors.textMuted, marginTop: 4 },

  // Change file link
  changeFileBtn:     { alignItems: 'center', paddingVertical: 10 },
  changeFileBtnText: { fontSize: 14, color: Colors.textSecondary, fontWeight: '600' },

  // Manual tab inputs
  input: {
    backgroundColor: Colors.surface,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 14,
    fontSize: 14,
    color: Colors.textPrimary,
    marginBottom: 10,
  },
});