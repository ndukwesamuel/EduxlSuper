

// import React, { useState } from 'react';
// import {
//   View, Text, ScrollView, TouchableOpacity,
//   StyleSheet, Alert, KeyboardAvoidingView,
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
// import { Colors, Spacing } from '../../theme';
// import { addBulkQuestions, addSingleQuestion, DrillOption } from '../../../config/client';

// type Nav   = NativeStackNavigationProp<AppStackParamList>;
// type Route = RouteProp<AppStackParamList, 'DrillAddQuestions'>;
// type TabType = 'csv' | 'pdf';

// const getChatGPTPrompt = (topic: string) =>
//   `Generate 20 questions about ${topic} as a CSV.\n` +
//   `Columns: question, A, B, C, D, answer, explanation\n` +
//   `Answer column = just the letter A B C or D.\n` +
//   `First row must be the column headers.`;

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
//   return raw.replace(/```[a-z]*\n?/gi, '').trim();
// }

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
//       if (ch === '"') { inQuotes = !inQuotes; }
//       else if (ch === delimiter && !inQuotes) { result.push(current.trim()); current = ''; }
//       else { current += ch; }
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
//   if (qIdx === -1 || aIdx === -1 || bIdx === -1 || cIdx === -1 || dIdx === -1 || ansIdx === -1) return [];
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
//     if (!question || !optA || !optB || !optC || !optD || !['A', 'B', 'C', 'D'].includes(answer)) continue;
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

// export default function DrillAddQuestionsScreen() {
//   const navigation = useNavigation<Nav>();
//   const route      = useRoute<Route>();
//   const { subjectId, subjectName } = route.params;

//   const [tab, setTab]                   = useState<TabType>('csv');
//   const [fileName, setFileName]         = useState('');
//   const [preview, setPreview]           = useState<ReturnType<typeof parseCSV>>([]);
//   const [submitting, setSubmitting]     = useState(false);
//   const [picking, setPicking]           = useState(false);
//   const [copied, setCopied]             = useState(false);
//   const [downloading, setDownloading]   = useState(false);
//   const [pdfFileName, setPdfFileName]   = useState('');
//   const [pdfGenerating, setPdfGenerating] = useState(false);
//   const [pdfQuestions, setPdfQuestions] = useState<any[]>([]);
//   const [pdfSubmitting, setPdfSubmitting] = useState(false);
//   const [showPdfReview, setShowPdfReview] = useState(false);

//   const handleCopyPrompt = async () => {
//     await Clipboard.setStringAsync(getChatGPTPrompt(subjectName));
//     setCopied(true);
//     setTimeout(() => setCopied(false), 2500);
//   };

//   const handleDownloadSample = async () => {
//     setDownloading(true);
//     try {
//       const csv  = await generateSampleCSV(subjectName);
//       const path = FileSystem.cacheDirectory + `${subjectName.replace(/\s+/g, '_')}_sample.csv`;
//       await FileSystem.writeAsStringAsync(path, csv, { encoding: FileSystem.EncodingType.UTF8 });
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
//         Alert.alert('Could not read file', 'Make sure your CSV has these column headers:\nquestion, A, B, C, D, answer, explanation\n\nDownload the sample CSV to see the exact format.');
//         return;
//       }
//       setPreview(parsed);
//     } catch {
//       Alert.alert('Error', 'Could not read file');
//     } finally {
//       setPicking(false);
//     }
//   };

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

//   const handlePickPDF = async () => {
//     try {
//       const res = await DocumentPicker.getDocumentAsync({
//         type: ['application/pdf'],
//         copyToCacheDirectory: true,
//       });
//       if (res.canceled) return;

//       const file = res.assets[0];

//       if (file.size && file.size > 50 * 1024 * 1024) {
//         Alert.alert('File too large', 'Please use a PDF under 50MB');
//         return;
//       }

//       setPdfFileName(file.name);
//       setPdfGenerating(true);
//       setPdfQuestions([]);
//       setShowPdfReview(false);

//       const formData = new FormData();
//       formData.append('file', {
//         uri: file.uri,
//         name: file.name,
//         type: 'application/pdf',
//       } as any);
//       formData.append('topic', subjectName);
//       formData.append('count', '20');

//       // Use native fetch — axios breaks multipart/form-data in React Native
//       const { store } = require('../../../src/store/store');
//       const token = store.getState().auth?.token ?? '';

//       const fetchResponse = await fetch('https://eduxl2-production.up.railway.app/api/v1/ai', {
//         method: 'POST',
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//         body: formData,
//       });

//       const json = await fetchResponse.json();
//       const questions = json?.data?.questions ?? [];

//       if (questions.length === 0) {
//         Alert.alert('Error', 'No questions were generated. Try a different PDF.');
//         return;
//       }

//       setPdfQuestions(questions);
//       setShowPdfReview(true);

//     } catch (err: any) {
//       Alert.alert('Error', err?.message ?? 'Could not generate questions. Check your connection and try again.');
//     } finally {
//       setPdfGenerating(false);
//     }
//   };

//   const handlePdfUpload = async () => {
//     if (pdfQuestions.length === 0) return;
//     setPdfSubmitting(true);
//     try {
//       const result = await addBulkQuestions(subjectId, pdfQuestions);
//       Alert.alert('Done!', `${result.added} questions added to ${subjectName}`, [
//         { text: 'OK', onPress: () => navigation.goBack() },
//       ]);
//     } catch {
//       Alert.alert('Error', 'Could not upload questions');
//     } finally {
//       setPdfSubmitting(false);
//     }
//   };

//   return (
//     <SafeAreaView style={styles.safe}>
//       <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
//         <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

//           <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backRow}>
//             <Text style={styles.backText}>← Back</Text>
//           </TouchableOpacity>
//           <Text style={styles.title}>Add Questions</Text>
//           <Text style={styles.subtitle}>{subjectName}</Text>

//           <View style={styles.tabs}>
//             <TouchableOpacity
//               style={[styles.tab, tab === 'csv' && styles.tabActive]}
//               onPress={() => setTab('csv')}
//             >
//               <Text style={[styles.tabText, tab === 'csv' && styles.tabTextActive]}>📂 CSV Upload</Text>
//             </TouchableOpacity>
//             <TouchableOpacity
//               style={[styles.tab, tab === 'pdf' && styles.tabActive]}
//               onPress={() => setTab('pdf')}
//             >
//               <Text style={[styles.tabText, tab === 'pdf' && styles.tabTextActive]}>🤖 AI from PDF</Text>
//             </TouchableOpacity>
//           </View>

//           {/* ── CSV Tab ── */}
//           {tab === 'csv' && (
//             <>
//               <View style={styles.infoCard}>
//                 <Text style={styles.infoTitle}>📋 How to use</Text>
//                 <Text style={styles.infoText}>1. Ask ChatGPT or DeepSeek to generate questions</Text>
//                 <Text style={styles.infoText}>2. Tell it to format as CSV with these columns:</Text>
//                 <View style={styles.columnsBox}>
//                   <Text style={styles.columnsText}>question, A, B, C, D, answer, explanation</Text>
//                 </View>
//                 <Text style={styles.infoText}>3. Save as .csv and upload below</Text>
//               </View>

//               <View style={styles.promptCard}>
//                 <View style={styles.promptHeader}>
//                   <Text style={styles.promptLabel}>Copy this prompt into ChatGPT:</Text>
//                   <TouchableOpacity onPress={handleCopyPrompt} style={styles.copyBtn} activeOpacity={0.7}>
//                     <Text style={styles.copyBtnText}>{copied ? '✅ Copied!' : '📋 Copy'}</Text>
//                   </TouchableOpacity>
//                 </View>
//                 <Text style={styles.promptText}>{getChatGPTPrompt(subjectName)}</Text>
//               </View>

//               <TouchableOpacity
//                 style={[styles.sampleBtn, downloading && { opacity: 0.6 }]}
//                 onPress={handleDownloadSample}
//                 disabled={downloading}
//                 activeOpacity={0.8}
//               >
//                 {downloading ? (
//                   <ActivityIndicator color={Colors.brand} />
//                 ) : (
//                   <Text style={styles.sampleBtnText}>⬇️ Download sample — {subjectName}</Text>
//                 )}
//               </TouchableOpacity>

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
//                     <Text style={styles.previewTitle}>✅ {preview.length} questions found in {fileName}</Text>
//                     {preview.slice(0, 3).map((q, i) => (
//                       <Text key={i} style={styles.previewQ} numberOfLines={1}>• {q.question}</Text>
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
//                   <TouchableOpacity style={styles.changeFileBtn} onPress={() => { setPreview([]); setFileName(''); }}>
//                     <Text style={styles.changeFileBtnText}>Choose different file</Text>
//                   </TouchableOpacity>
//                 </>
//               )}
//             </>
//           )}

//           {/* ── PDF Tab ── */}
//           {tab === 'pdf' && (
//             <>
//               <View style={styles.pdfInfoCard}>
//                 <Text style={styles.pdfInfoTitle}>🤖 AI Question Generator</Text>
//                 <Text style={styles.pdfInfoText}>
//                   Upload your lecture notes or textbook PDF. Our AI will read it and automatically generate
//                   multiple-choice questions about <Text style={{ fontWeight: '700' }}>{subjectName}</Text>.
//                 </Text>
//                 <Text style={styles.pdfStep}>1. Pick your PDF (max 50MB)</Text>
//                 <Text style={styles.pdfStep}>2. AI reads and generates questions</Text>
//                 <Text style={styles.pdfStep}>3. Review questions, then upload</Text>
//               </View>

//               {!pdfGenerating && !showPdfReview && (
//                 <TouchableOpacity style={styles.primaryBtn} onPress={handlePickPDF} activeOpacity={0.8}>
//                   <Text style={styles.primaryBtnText}>📄 Pick PDF file</Text>
//                 </TouchableOpacity>
//               )}

//               {pdfGenerating && (
//                 <View style={styles.generatingCard}>
//                   <ActivityIndicator color={Colors.brand} size="large" />
//                   <Text style={styles.generatingTitle}>AI is reading your PDF...</Text>
//                   <Text style={styles.generatingSubtitle}>Generating {subjectName} questions from {pdfFileName}</Text>
//                   <Text style={styles.generatingHint}>This may take 15–30 seconds</Text>
//                 </View>
//               )}

//               {showPdfReview && pdfQuestions.length > 0 && (
//                 <>
//                   <View style={styles.reviewHeader}>
//                     <Text style={styles.reviewTitle}>✅ {pdfQuestions.length} questions generated from {pdfFileName}</Text>
//                     <Text style={styles.reviewSubtitle}>Review before uploading:</Text>
//                   </View>

//                           <TouchableOpacity
//                     style={[styles.primaryBtn, pdfSubmitting && { opacity: 0.6 }]}
//                     onPress={handlePdfUpload}
//                     disabled={pdfSubmitting}
//                     activeOpacity={0.8}
//                   >
//                     {pdfSubmitting ? (
//                       <ActivityIndicator color="#fff" />
//                     ) : (
//                       <Text style={styles.primaryBtnText}>Upload {pdfQuestions.length} questions to {subjectName}</Text>
//                     )}
//                   </TouchableOpacity>

//                   <TouchableOpacity
//                     style={styles.changeFileBtn}
//                     onPress={() => { setPdfQuestions([]); setPdfFileName(''); setShowPdfReview(false); }}
//                   >
//                     <Text style={styles.changeFileBtnText}>Try a different PDF</Text>
//                   </TouchableOpacity>

//                   {pdfQuestions.map((q, i) => (
//                     <View key={i} style={styles.questionCard}>
//                       <Text style={styles.questionNum}>Q{i + 1}</Text>
//                       <Text style={styles.questionText}>{q.question}</Text>
//                       {q.options.map((opt: any) => (
//                         <View
//                           key={opt.label}
//                           style={[styles.optionRow, opt.label === q.correctOption && styles.optionRowCorrect]}
//                         >
//                           <Text style={[styles.optionLabel, opt.label === q.correctOption && styles.optionLabelCorrect]}>
//                             {opt.label}
//                           </Text>
//                           <Text style={[styles.optionText, opt.label === q.correctOption && styles.optionTextCorrect]}>
//                             {opt.text}
//                           </Text>
//                           {opt.label === q.correctOption && <Text style={styles.correctTick}>✓</Text>}
//                         </View>
//                       ))}
//                       {q.explanation ? (
//                         <View style={styles.explanationBox}>
//                           <Text style={styles.explanationText}>💡 {q.explanation}</Text>
//                         </View>
//                       ) : null}
//                     </View>
//                   ))}

          
//                 </>
//               )}
//             </>
//           )}

//         </ScrollView>
//       </KeyboardAvoidingView>
//     </SafeAreaView>
//   );
// }

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
//   tab:           { flex: 1, paddingVertical: 10, borderRadius: 10, alignItems: 'center' },
//   tabActive:     { backgroundColor: Colors.brand },
//   tabText:       { fontSize: 14, fontWeight: '600', color: Colors.textSecondary },
//   tabTextActive: { color: '#fff' },

//   infoCard:    { backgroundColor: '#EEF2FF', borderRadius: 12, padding: 16, marginBottom: 12 },
//   infoTitle:   { fontSize: 14, fontWeight: '700', color: '#3730A3', marginBottom: 8 },
//   infoText:    { fontSize: 13, color: '#4338CA', marginBottom: 4, lineHeight: 20 },
//   columnsBox:  { backgroundColor: '#C7D2FE', borderRadius: 6, padding: 8, marginVertical: 6 },
//   columnsText: { fontSize: 12, fontFamily: 'monospace', color: '#312E81', fontWeight: '600' },

//   promptCard: {
//     backgroundColor: '#F0FDF4', borderRadius: 12, padding: 16, marginBottom: 12,
//     borderWidth: 1, borderColor: '#BBF7D0',
//   },
//   promptHeader:  { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
//   promptLabel:   { fontSize: 12, fontWeight: '700', color: '#065F46' },
//   copyBtn:       { backgroundColor: '#D1FAE5', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 5 },
//   copyBtnText:   { fontSize: 12, fontWeight: '700', color: '#065F46' },
//   promptText:    { fontSize: 12, color: '#047857', lineHeight: 20, fontFamily: 'monospace' },

//   sampleBtn:     { borderWidth: 1.5, borderColor: Colors.brand, borderRadius: 50, paddingVertical: 14, alignItems: 'center', marginBottom: 16 },
//   sampleBtnText: { fontSize: 15, fontWeight: '700', color: Colors.brand },

//   primaryBtn:     { backgroundColor: Colors.brand, borderRadius: 50, paddingVertical: 16, alignItems: 'center', marginBottom: 12 },
//   primaryBtnText: { fontSize: 16, fontWeight: '700', color: '#fff' },

//   previewCard:  { backgroundColor: '#F0FDF4', borderRadius: 12, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: '#BBF7D0' },
//   previewTitle: { fontSize: 14, fontWeight: '700', color: '#065F46', marginBottom: 8 },
//   previewQ:     { fontSize: 13, color: Colors.textSecondary, marginBottom: 3 },
//   previewMore:  { fontSize: 12, color: Colors.textMuted, marginTop: 4 },

//   changeFileBtn:     { alignItems: 'center', paddingVertical: 10, marginBottom: 20 },
//   changeFileBtnText: { fontSize: 14, color: Colors.textSecondary, fontWeight: '600' },

//   pdfInfoCard:  { backgroundColor: '#FFF7ED', borderRadius: 12, padding: 16, marginBottom: 20, borderWidth: 1, borderColor: '#FED7AA' },
//   pdfInfoTitle: { fontSize: 15, fontWeight: '700', color: '#9A3412', marginBottom: 8 },
//   pdfInfoText:  { fontSize: 13, color: '#C2410C', lineHeight: 20, marginBottom: 12 },
//   pdfStep:      { fontSize: 13, color: '#92400E', fontWeight: '600', marginBottom: 6 },

//   generatingCard:     { backgroundColor: Colors.surface, borderRadius: 16, padding: 32, alignItems: 'center', marginBottom: 20, borderWidth: 1, borderColor: Colors.border },
//   generatingTitle:    { fontSize: 16, fontWeight: '700', color: Colors.textPrimary, marginTop: 16, marginBottom: 6 },
//   generatingSubtitle: { fontSize: 13, color: Colors.textSecondary, textAlign: 'center', marginBottom: 8 },
//   generatingHint:     { fontSize: 12, color: Colors.textMuted, textAlign: 'center' },

//   reviewHeader:   { backgroundColor: '#F0FDF4', borderRadius: 12, padding: 16, marginBottom: 16, borderWidth: 1, borderColor: '#BBF7D0' },
//   reviewTitle:    { fontSize: 14, fontWeight: '700', color: '#065F46', marginBottom: 4 },
//   reviewSubtitle: { fontSize: 12, color: '#047857' },

//   questionCard: { backgroundColor: Colors.surface, borderRadius: 12, padding: 14, marginBottom: 12, borderWidth: 1, borderColor: Colors.border },
//   questionNum:  { fontSize: 11, fontWeight: '700', color: Colors.brand, marginBottom: 6, textTransform: 'uppercase' },
//   questionText: { fontSize: 14, fontWeight: '600', color: Colors.textPrimary, lineHeight: 20, marginBottom: 10 },

//   optionRow:          { flexDirection: 'row', alignItems: 'center', paddingVertical: 6, paddingHorizontal: 8, borderRadius: 8, marginBottom: 4, backgroundColor: Colors.background },
//   optionRowCorrect:   { backgroundColor: '#F0FDF4' },
//   optionLabel:        { fontSize: 13, fontWeight: '700', color: Colors.textSecondary, width: 20 },
//   optionLabelCorrect: { color: '#059669' },
//   optionText:         { flex: 1, fontSize: 13, color: Colors.textSecondary },
//   optionTextCorrect:  { color: '#065F46', fontWeight: '600' },
//   correctTick:        { fontSize: 14, color: '#059669', fontWeight: '700' },

//   explanationBox:  { backgroundColor: '#FFFBEB', borderRadius: 8, padding: 10, marginTop: 8, borderWidth: 1, borderColor: '#FDE68A' },
//   explanationText: { fontSize: 12, color: '#78350F', lineHeight: 18 },
// });

import React, { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  StyleSheet, Alert, KeyboardAvoidingView,
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
import { Colors, Spacing } from '../../theme';
import { addBulkQuestions, addSingleQuestion, DrillOption } from '../../../config/client';

type Nav   = NativeStackNavigationProp<AppStackParamList>;
type Route = RouteProp<AppStackParamList, 'DrillAddQuestions'>;
type TabType = 'csv' | 'pdf';

const getChatGPTPrompt = (topic: string) =>
  `Generate 20 questions about ${topic} as a CSV.\n` +
  `Columns: question, A, B, C, D, answer, explanation\n` +
  `Answer column = just the letter A B C or D.\n` +
  `First row must be the column headers.`;

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
  return raw.replace(/```[a-z]*\n?/gi, '').trim();
}

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
      if (ch === '"') { inQuotes = !inQuotes; }
      else if (ch === delimiter && !inQuotes) { result.push(current.trim()); current = ''; }
      else { current += ch; }
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
  if (qIdx === -1 || aIdx === -1 || bIdx === -1 || cIdx === -1 || dIdx === -1 || ansIdx === -1) return [];
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
    if (!question || !optA || !optB || !optC || !optD || !['A', 'B', 'C', 'D'].includes(answer)) continue;
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

export default function DrillAddQuestionsScreen() {
  const navigation = useNavigation<Nav>();
  const route      = useRoute<Route>();
  const { subjectId, subjectName } = route.params;

  const [tab, setTab]                   = useState<TabType>('csv');
  const [fileName, setFileName]         = useState('');
  const [preview, setPreview]           = useState<ReturnType<typeof parseCSV>>([]);
  const [submitting, setSubmitting]     = useState(false);
  const [picking, setPicking]           = useState(false);
  const [copied, setCopied]             = useState(false);
  const [downloading, setDownloading]   = useState(false);
  const [pdfFileName, setPdfFileName]   = useState('');
  const [pdfGenerating, setPdfGenerating] = useState(false);
  const [pdfQuestions, setPdfQuestions] = useState<any[]>([]);
  const [pdfSubmitting, setPdfSubmitting] = useState(false);
  const [showPdfReview, setShowPdfReview] = useState(false);

  const handleCopyPrompt = async () => {
    await Clipboard.setStringAsync(getChatGPTPrompt(subjectName));
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleDownloadSample = async () => {
    setDownloading(true);
    try {
      const csv  = await generateSampleCSV(subjectName);
      const path = FileSystem.cacheDirectory + `${subjectName.replace(/\s+/g, '_')}_sample.csv`;
      await FileSystem.writeAsStringAsync(path, csv, { encoding: FileSystem.EncodingType.UTF8 });
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
        Alert.alert('Could not read file', 'Make sure your CSV has these column headers:\nquestion, A, B, C, D, answer, explanation\n\nDownload the sample CSV to see the exact format.');
        return;
      }
      setPreview(parsed);
    } catch {
      Alert.alert('Error', 'Could not read file');
    } finally {
      setPicking(false);
    }
  };

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

  const handlePickPDF = async () => {
    try {
      const res = await DocumentPicker.getDocumentAsync({
        // ── CHANGE 1: accept images too ──────────────────────────
        type: ['application/pdf', 'image/jpeg', 'image/png', 'image/webp'],
        copyToCacheDirectory: true,
      });
      if (res.canceled) return;

      const file = res.assets[0];

      if (file.size && file.size > 50 * 1024 * 1024) {
        Alert.alert('File too large', 'Please use a PDF under 50MB');
        return;
      }

      setPdfFileName(file.name);
      setPdfGenerating(true);
      setPdfQuestions([]);
      setShowPdfReview(false);

      const formData = new FormData();
      formData.append('file', {
        uri: file.uri,
        name: file.name,
        // ── CHANGE 2: use actual mime type from picked file ───────
        type: (file.mimeType ?? 'application/pdf') as any,
      } as any);
      formData.append('topic', subjectName);
      formData.append('count', '20');

      // Use native fetch — axios breaks multipart/form-data in React Native
      const { store } = require('../../../src/store/store');
      const token = store.getState().auth?.token ?? '';

      const fetchResponse = await fetch('https://eduxl2-production.up.railway.app/api/v1/ai', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const json = await fetchResponse.json();
      const questions = json?.data?.questions ?? [];

      if (questions.length === 0) {
        Alert.alert('Error', 'No questions were generated. Try a different PDF.');
        return;
      }

      setPdfQuestions(questions);
      setShowPdfReview(true);

    } catch (err: any) {
      Alert.alert('Error', err?.message ?? 'Could not generate questions. Check your connection and try again.');
    } finally {
      setPdfGenerating(false);
    }
  };

  const handlePdfUpload = async () => {
    if (pdfQuestions.length === 0) return;
    setPdfSubmitting(true);
    try {
      const result = await addBulkQuestions(subjectId, pdfQuestions);
      Alert.alert('Done!', `${result.added} questions added to ${subjectName}`, [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch {
      Alert.alert('Error', 'Could not upload questions');
    } finally {
      setPdfSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backRow}>
            <Text style={styles.backText}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Add Questions</Text>
          <Text style={styles.subtitle}>{subjectName}</Text>

          <View style={styles.tabs}>
            <TouchableOpacity
              style={[styles.tab, tab === 'csv' && styles.tabActive]}
              onPress={() => setTab('csv')}
            >
              <Text style={[styles.tabText, tab === 'csv' && styles.tabTextActive]}>📂 CSV Upload</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.tab, tab === 'pdf' && styles.tabActive]}
              onPress={() => setTab('pdf')}
            >
              <Text style={[styles.tabText, tab === 'pdf' && styles.tabTextActive]}>🤖 AI from PDF</Text>
            </TouchableOpacity>
          </View>

          {/* ── CSV Tab ── */}
          {tab === 'csv' && (
            <>
              <View style={styles.infoCard}>
                <Text style={styles.infoTitle}>📋 How to use</Text>
                <Text style={styles.infoText}>1. Ask ChatGPT or DeepSeek to generate questions</Text>
                <Text style={styles.infoText}>2. Tell it to format as CSV with these columns:</Text>
                <View style={styles.columnsBox}>
                  <Text style={styles.columnsText}>question, A, B, C, D, answer, explanation</Text>
                </View>
                <Text style={styles.infoText}>3. Save as .csv and upload below</Text>
              </View>

              <View style={styles.promptCard}>
                <View style={styles.promptHeader}>
                  <Text style={styles.promptLabel}>Copy this prompt into ChatGPT:</Text>
                  <TouchableOpacity onPress={handleCopyPrompt} style={styles.copyBtn} activeOpacity={0.7}>
                    <Text style={styles.copyBtnText}>{copied ? '✅ Copied!' : '📋 Copy'}</Text>
                  </TouchableOpacity>
                </View>
                <Text style={styles.promptText}>{getChatGPTPrompt(subjectName)}</Text>
              </View>

              <TouchableOpacity
                style={[styles.sampleBtn, downloading && { opacity: 0.6 }]}
                onPress={handleDownloadSample}
                disabled={downloading}
                activeOpacity={0.8}
              >
                {downloading ? (
                  <ActivityIndicator color={Colors.brand} />
                ) : (
                  <Text style={styles.sampleBtnText}>⬇️ Download sample — {subjectName}</Text>
                )}
              </TouchableOpacity>

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
                    <Text style={styles.previewTitle}>✅ {preview.length} questions found in {fileName}</Text>
                    {preview.slice(0, 3).map((q, i) => (
                      <Text key={i} style={styles.previewQ} numberOfLines={1}>• {q.question}</Text>
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
                  <TouchableOpacity style={styles.changeFileBtn} onPress={() => { setPreview([]); setFileName(''); }}>
                    <Text style={styles.changeFileBtnText}>Choose different file</Text>
                  </TouchableOpacity>
                </>
              )}
            </>
          )}

          {/* ── PDF Tab ── */}
          {tab === 'pdf' && (
            <>
              <View style={styles.pdfInfoCard}>
                <Text style={styles.pdfInfoTitle}>🤖 AI Question Generator</Text>
                <Text style={styles.pdfInfoText}>
                  Upload your lecture notes or textbook PDF. Our AI will read it and automatically generate
                  multiple-choice questions about <Text style={{ fontWeight: '700' }}>{subjectName}</Text>.
                </Text>
                <Text style={styles.pdfStep}>1. Pick your PDF (max 50MB)</Text>
                <Text style={styles.pdfStep}>2. AI reads and generates questions</Text>
                <Text style={styles.pdfStep}>3. Review questions, then upload</Text>
              </View>

              {!pdfGenerating && !showPdfReview && (
                <TouchableOpacity style={styles.primaryBtn} onPress={handlePickPDF} activeOpacity={0.8}>
                  <Text style={styles.primaryBtnText}>📄 Pick PDF file</Text>
                </TouchableOpacity>
              )}

              {pdfGenerating && (
                <View style={styles.generatingCard}>
                  <ActivityIndicator color={Colors.brand} size="large" />
                  <Text style={styles.generatingTitle}>AI is reading your PDF...</Text>
                  <Text style={styles.generatingSubtitle}>Generating {subjectName} questions from {pdfFileName}</Text>
                  <Text style={styles.generatingHint}>This may take 15–30 seconds</Text>
                </View>
              )}

              {showPdfReview && pdfQuestions.length > 0 && (
                <>
                  <View style={styles.reviewHeader}>
                    <Text style={styles.reviewTitle}>✅ {pdfQuestions.length} questions generated from {pdfFileName}</Text>
                    <Text style={styles.reviewSubtitle}>Review before uploading:</Text>
                  </View>

                          <TouchableOpacity
                    style={[styles.primaryBtn, pdfSubmitting && { opacity: 0.6 }]}
                    onPress={handlePdfUpload}
                    disabled={pdfSubmitting}
                    activeOpacity={0.8}
                  >
                    {pdfSubmitting ? (
                      <ActivityIndicator color="#fff" />
                    ) : (
                      <Text style={styles.primaryBtnText}>Upload {pdfQuestions.length} questions to {subjectName}</Text>
                    )}
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.changeFileBtn}
                    onPress={() => { setPdfQuestions([]); setPdfFileName(''); setShowPdfReview(false); }}
                  >
                    <Text style={styles.changeFileBtnText}>Try a different PDF</Text>
                  </TouchableOpacity>

                  {pdfQuestions.map((q, i) => (
                    <View key={i} style={styles.questionCard}>
                      <Text style={styles.questionNum}>Q{i + 1}</Text>
                      <Text style={styles.questionText}>{q.question}</Text>
                      {q.options.map((opt: any) => (
                        <View
                          key={opt.label}
                          style={[styles.optionRow, opt.label === q.correctOption && styles.optionRowCorrect]}
                        >
                          <Text style={[styles.optionLabel, opt.label === q.correctOption && styles.optionLabelCorrect]}>
                            {opt.label}
                          </Text>
                          <Text style={[styles.optionText, opt.label === q.correctOption && styles.optionTextCorrect]}>
                            {opt.text}
                          </Text>
                          {opt.label === q.correctOption && <Text style={styles.correctTick}>✓</Text>}
                        </View>
                      ))}
                      {q.explanation ? (
                        <View style={styles.explanationBox}>
                          <Text style={styles.explanationText}>💡 {q.explanation}</Text>
                        </View>
                      ) : null}
                    </View>
                  ))}

          
                </>
              )}
            </>
          )}

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

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

  infoCard:    { backgroundColor: '#EEF2FF', borderRadius: 12, padding: 16, marginBottom: 12 },
  infoTitle:   { fontSize: 14, fontWeight: '700', color: '#3730A3', marginBottom: 8 },
  infoText:    { fontSize: 13, color: '#4338CA', marginBottom: 4, lineHeight: 20 },
  columnsBox:  { backgroundColor: '#C7D2FE', borderRadius: 6, padding: 8, marginVertical: 6 },
  columnsText: { fontSize: 12, fontFamily: 'monospace', color: '#312E81', fontWeight: '600' },

  promptCard: {
    backgroundColor: '#F0FDF4', borderRadius: 12, padding: 16, marginBottom: 12,
    borderWidth: 1, borderColor: '#BBF7D0',
  },
  promptHeader:  { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  promptLabel:   { fontSize: 12, fontWeight: '700', color: '#065F46' },
  copyBtn:       { backgroundColor: '#D1FAE5', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 5 },
  copyBtnText:   { fontSize: 12, fontWeight: '700', color: '#065F46' },
  promptText:    { fontSize: 12, color: '#047857', lineHeight: 20, fontFamily: 'monospace' },

  sampleBtn:     { borderWidth: 1.5, borderColor: Colors.brand, borderRadius: 50, paddingVertical: 14, alignItems: 'center', marginBottom: 16 },
  sampleBtnText: { fontSize: 15, fontWeight: '700', color: Colors.brand },

  primaryBtn:     { backgroundColor: Colors.brand, borderRadius: 50, paddingVertical: 16, alignItems: 'center', marginBottom: 12 },
  primaryBtnText: { fontSize: 16, fontWeight: '700', color: '#fff' },

  previewCard:  { backgroundColor: '#F0FDF4', borderRadius: 12, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: '#BBF7D0' },
  previewTitle: { fontSize: 14, fontWeight: '700', color: '#065F46', marginBottom: 8 },
  previewQ:     { fontSize: 13, color: Colors.textSecondary, marginBottom: 3 },
  previewMore:  { fontSize: 12, color: Colors.textMuted, marginTop: 4 },

  changeFileBtn:     { alignItems: 'center', paddingVertical: 10, marginBottom: 20 },
  changeFileBtnText: { fontSize: 14, color: Colors.textSecondary, fontWeight: '600' },

  pdfInfoCard:  { backgroundColor: '#FFF7ED', borderRadius: 12, padding: 16, marginBottom: 20, borderWidth: 1, borderColor: '#FED7AA' },
  pdfInfoTitle: { fontSize: 15, fontWeight: '700', color: '#9A3412', marginBottom: 8 },
  pdfInfoText:  { fontSize: 13, color: '#C2410C', lineHeight: 20, marginBottom: 12 },
  pdfStep:      { fontSize: 13, color: '#92400E', fontWeight: '600', marginBottom: 6 },

  generatingCard:     { backgroundColor: Colors.surface, borderRadius: 16, padding: 32, alignItems: 'center', marginBottom: 20, borderWidth: 1, borderColor: Colors.border },
  generatingTitle:    { fontSize: 16, fontWeight: '700', color: Colors.textPrimary, marginTop: 16, marginBottom: 6 },
  generatingSubtitle: { fontSize: 13, color: Colors.textSecondary, textAlign: 'center', marginBottom: 8 },
  generatingHint:     { fontSize: 12, color: Colors.textMuted, textAlign: 'center' },

  reviewHeader:   { backgroundColor: '#F0FDF4', borderRadius: 12, padding: 16, marginBottom: 16, borderWidth: 1, borderColor: '#BBF7D0' },
  reviewTitle:    { fontSize: 14, fontWeight: '700', color: '#065F46', marginBottom: 4 },
  reviewSubtitle: { fontSize: 12, color: '#047857' },

  questionCard: { backgroundColor: Colors.surface, borderRadius: 12, padding: 14, marginBottom: 12, borderWidth: 1, borderColor: Colors.border },
  questionNum:  { fontSize: 11, fontWeight: '700', color: Colors.brand, marginBottom: 6, textTransform: 'uppercase' },
  questionText: { fontSize: 14, fontWeight: '600', color: Colors.textPrimary, lineHeight: 20, marginBottom: 10 },

  optionRow:          { flexDirection: 'row', alignItems: 'center', paddingVertical: 6, paddingHorizontal: 8, borderRadius: 8, marginBottom: 4, backgroundColor: Colors.background },
  optionRowCorrect:   { backgroundColor: '#F0FDF4' },
  optionLabel:        { fontSize: 13, fontWeight: '700', color: Colors.textSecondary, width: 20 },
  optionLabelCorrect: { color: '#059669' },
  optionText:         { flex: 1, fontSize: 13, color: Colors.textSecondary },
  optionTextCorrect:  { color: '#065F46', fontWeight: '600' },
  correctTick:        { fontSize: 14, color: '#059669', fontWeight: '700' },

  explanationBox:  { backgroundColor: '#FFFBEB', borderRadius: 8, padding: 10, marginTop: 8, borderWidth: 1, borderColor: '#FDE68A' },
  explanationText: { fontSize: 12, color: '#78350F', lineHeight: 18 },
});