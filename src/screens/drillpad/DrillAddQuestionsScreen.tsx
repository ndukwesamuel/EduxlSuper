// // ─── DrillAddQuestionsScreen.tsx ─────────────────────────────────
// import React, { useState } from 'react';
// import {
//   View, Text, ScrollView, TouchableOpacity,
//   StyleSheet, Alert, TextInput, KeyboardAvoidingView, Platform,
// } from 'react-native';
// import { SafeAreaView } from 'react-native-safe-area-context';
// import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
// import { NativeStackNavigationProp } from '@react-navigation/native-stack';
// import { AppStackParamList } from '../../navigation/types';
// import { Colors, FontSize, Radius, Spacing } from '../../theme';
// import CCCard from '../../components/CCCard';
// import { addBulkQuestions, addSingleQuestion, DrillOption } from  "../../../config/client"


// type Nav   = NativeStackNavigationProp<AppStackParamList>;
// type Route = RouteProp<AppStackParamList, 'DrillAddQuestions'>;

// type TabType = 'paste' | 'manual';

// // ─── Paste parser ─────────────────────────────────────────────────
// // Expects format like:
// // Q: What is consideration?
// // A: A promise by one party
// // B: Something of value exchanged
// // C: Written agreement only
// // D: Signature of both parties
// // Answer: B
// // (blank line between questions)

// function parsePastedQuestions(text: string) {
//   const blocks = text.trim().split(/\n{2,}/);
//   const results: { question: string; options: DrillOption[]; correctOption: string }[] = [];

//   for (const block of blocks) {
//     const lines = block.trim().split('\n').map((l) => l.trim()).filter(Boolean);
//     if (lines.length < 6) continue;

//     const qLine = lines.find((l) => l.match(/^Q[:.]/i));
//     const aLine = lines.find((l) => l.match(/^A[:.]/i));
//     const bLine = lines.find((l) => l.match(/^B[:.]/i));
//     const cLine = lines.find((l) => l.match(/^C[:.]/i));
//     const dLine = lines.find((l) => l.match(/^D[:.]/i));
//     const ansLine = lines.find((l) => l.match(/^Answer[:.]/i));

//     if (!qLine || !aLine || !bLine || !cLine || !dLine || !ansLine) continue;

//     const extract = (line: string) => line.replace(/^[A-Za-z]+[:.]\s*/, '').trim();

//     results.push({
//       question: extract(qLine),
//       options: [
//         { label: 'A', text: extract(aLine) },
//         { label: 'B', text: extract(bLine) },
//         { label: 'C', text: extract(cLine) },
//         { label: 'D', text: extract(dLine) },
//       ],
//       correctOption: extract(ansLine).toUpperCase().charAt(0),
//     });
//   }

//   return results;
// }

// export default function DrillAddQuestionsScreen() {
//   const navigation = useNavigation<Nav>();
//   const route      = useRoute<Route>();
//   const { subjectId, subjectName } = route.params;

//   const [tab, setTab]         = useState<TabType>('paste');
//   const [pasteText, setPasteText] = useState('');
//   const [submitting, setSubmitting] = useState(false);
//   const [preview, setPreview] = useState<ReturnType<typeof parsePastedQuestions>>([]);

//   // Manual form state
//   const [question, setQuestion]   = useState('');
//   const [optA, setOptA]           = useState('');
//   const [optB, setOptB]           = useState('');
//   const [optC, setOptC]           = useState('');
//   const [optD, setOptD]           = useState('');
//   const [correct, setCorrect]     = useState('');
//   const [explanation, setExplanation] = useState('');

//   const handlePreview = () => {
//     const parsed = parsePastedQuestions(pasteText);
//     if (parsed.length === 0) {
//       return Alert.alert(
//         'Could not parse',
//         'Make sure your questions follow the format:\n\nQ: question\nA: option\nB: option\nC: option\nD: option\nAnswer: B\n\n(blank line between questions)'
//       );
//     }
//     setPreview(parsed);
//   };

//   const handleBulkSubmit = async () => {
//     if (preview.length === 0) return handlePreview();
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
//         explanation.trim() || undefined
//       );
//       Alert.alert('Added!', 'Question added', [
//         { text: 'Add another', onPress: () => { setQuestion(''); setOptA(''); setOptB(''); setOptC(''); setOptD(''); setCorrect(''); setExplanation(''); } },
//         { text: 'Done', onPress: () => navigation.goBack() },
//       ]);
//     } catch {
//       Alert.alert('Error', 'Could not add question');
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   return (
//     <SafeAreaView style={styles.safe}>
//       <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
//         <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

//           {/* Header */}
//           <View style={styles.header}>
//             <TouchableOpacity onPress={() => navigation.goBack()}>
//               <Text style={styles.backText}>← Back</Text>
//             </TouchableOpacity>
//           </View>
//           <Text style={styles.title}>Add Questions</Text>
//           <Text style={styles.subtitle}>{subjectName}</Text>

//           {/* Tabs */}
//           <View style={styles.tabs}>
//             <TouchableOpacity
//               style={[styles.tab, tab === 'paste' && styles.tabActive]}
//               onPress={() => setTab('paste')}
//             >
//               <Text style={[styles.tabText, tab === 'paste' && styles.tabTextActive]}>📋 Paste bulk</Text>
//             </TouchableOpacity>
//             <TouchableOpacity
//               style={[styles.tab, tab === 'manual' && styles.tabActive]}
//               onPress={() => setTab('manual')}
//             >
//               <Text style={[styles.tabText, tab === 'manual' && styles.tabTextActive]}>✏️ Manual</Text>
//             </TouchableOpacity>
//           </View>

//           {/* Paste tab */}
//           {tab === 'paste' && (
//             <>
//               <CCCard style={styles.formatCard}>
//                 <Text style={styles.formatTitle}>Expected format:</Text>
//                 <Text style={styles.formatCode}>{`Q: What is consideration?\nA: A promise by one party\nB: Something of value exchanged\nC: Written agreement only\nD: Signature of both parties\nAnswer: B\n\n(blank line between questions)`}</Text>
//               </CCCard>

//               <TextInput
//                 style={styles.textArea}
//                 placeholder="Paste your questions here..."
//                 placeholderTextColor={Colors.textMuted}
//                 multiline
//                 numberOfLines={12}
//                 value={pasteText}
//                 onChangeText={(t) => { setPasteText(t); setPreview([]); }}
//                 textAlignVertical="top"
//               />

//               {preview.length > 0 && (
//                 <CCCard style={styles.previewCard}>
//                   <Text style={styles.previewTitle}>✅ {preview.length} questions parsed — ready to upload</Text>
//                   {preview.slice(0, 2).map((q, i) => (
//                     <Text key={i} style={styles.previewQ} numberOfLines={1}>• {q.question}</Text>
//                   ))}
//                   {preview.length > 2 && (
//                     <Text style={styles.previewMore}>+ {preview.length - 2} more...</Text>
//                   )}
//                 </CCCard>
//               )}

//               {preview.length === 0 ? (
//                 <TouchableOpacity style={styles.primaryBtn} onPress={handlePreview}>
//                   <Text style={styles.primaryBtnText}>Preview questions</Text>
//                 </TouchableOpacity>
//               ) : (
//                 <TouchableOpacity
//                   style={[styles.primaryBtn, submitting && { opacity: 0.6 }]}
//                   onPress={handleBulkSubmit}
//                   disabled={submitting}
//                 >
//                   <Text style={styles.primaryBtnText}>
//                     {submitting ? 'Adding...' : `Add ${preview.length} questions`}
//                   </Text>
//                 </TouchableOpacity>
//               )}
//             </>
//           )}

//           {/* Manual tab */}
//           {tab === 'manual' && (
//             <>
//               <TextInput style={styles.input} placeholder="Question" placeholderTextColor={Colors.textMuted} value={question} onChangeText={setQuestion} multiline />
//               {(['A', 'B', 'C', 'D'] as const).map((label) => {
//                 const val = label === 'A' ? optA : label === 'B' ? optB : label === 'C' ? optC : optD;
//                 const set = label === 'A' ? setOptA : label === 'B' ? setOptB : label === 'C' ? setOptC : setOptD;
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
//               >
//                 <Text style={styles.primaryBtnText}>{submitting ? 'Adding...' : 'Add question'}</Text>
//               </TouchableOpacity>
//             </>
//           )}

//         </ScrollView>
//       </KeyboardAvoidingView>
//     </SafeAreaView>
//   );
// }

// const styles = StyleSheet.create({
//   safe:    { flex: 1, backgroundColor: Colors.background },
//   scroll:  { padding: Spacing.lg, paddingBottom: Spacing['5xl'] },
//   header:  { marginBottom: Spacing.md },
//   backText: { fontSize: FontSize.body, color: Colors.brand, fontWeight: '600' },
//   title:   { fontSize: FontSize.displayL, fontWeight: '800', color: Colors.textPrimary },
//   subtitle: { fontSize: FontSize.body, color: Colors.textSecondary, marginTop: 2, marginBottom: Spacing['2xl'] },
//   tabs:    { flexDirection: 'row', backgroundColor: Colors.surface, borderRadius: Radius.lg, padding: 4, marginBottom: Spacing.lg, borderWidth: 1, borderColor: Colors.border },
//   tab:     { flex: 1, paddingVertical: 10, borderRadius: Radius.md, alignItems: 'center' },
//   tabActive: { backgroundColor: Colors.brand },
//   tabText: { fontSize: FontSize.body, fontWeight: '600', color: Colors.textSecondary },
//   tabTextActive: { color: '#fff' },
//   formatCard: { marginBottom: Spacing.md, backgroundColor: '#F8F9FF' },
//   formatTitle: { fontSize: FontSize.bodySmall, fontWeight: '700', color: Colors.textPrimary, marginBottom: 6 },
//   formatCode: { fontSize: FontSize.caption, color: Colors.textSecondary, fontFamily: 'monospace', lineHeight: 18 },
//   textArea: { backgroundColor: Colors.surface, borderRadius: Radius.md, borderWidth: 1, borderColor: Colors.border, padding: 14, fontSize: FontSize.body, color: Colors.textPrimary, height: 200, marginBottom: Spacing.md },
//   previewCard: { marginBottom: Spacing.md, backgroundColor: '#F0FDF4' },
//   previewTitle: { fontSize: FontSize.body, fontWeight: '700', color: '#065F46', marginBottom: 6 },
//   previewQ: { fontSize: FontSize.bodySmall, color: Colors.textSecondary, marginBottom: 2 },
//   previewMore: { fontSize: FontSize.caption, color: Colors.textMuted, marginTop: 4 },
//   primaryBtn: { backgroundColor: Colors.brand, borderRadius: Radius.full, paddingVertical: 16, alignItems: 'center', marginBottom: Spacing.md },
//   primaryBtnText: { fontSize: FontSize.bodyLarge, fontWeight: '700', color: '#fff' },
//   input: { backgroundColor: Colors.surface, borderRadius: Radius.md, borderWidth: 1, borderColor: Colors.border, padding: 14, fontSize: FontSize.body, color: Colors.textPrimary, marginBottom: 10 },
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
import { AppStackParamList } from '../../navigation/types';
import { Colors, FontSize, Radius, Spacing } from '../../theme';
import { addBulkQuestions, addSingleQuestion, DrillOption } from "../../../config/client"

type Nav   = NativeStackNavigationProp<AppStackParamList>;
type Route = RouteProp<AppStackParamList, 'DrillAddQuestions'>;
type TabType = 'csv' | 'manual';

// ─── CSV Parser ────────────────────────────────────────────────────
// Columns: question, A, B, C, D, answer, explanation
// Row 1 = headers, row 2+ = data

function parseCSV(text: string): { question: string; options: DrillOption[]; correctOption: string; explanation?: string }[] {
  const lines = text.trim().split('\n').map((l) => l.trim()).filter(Boolean);
  if (lines.length < 2) return [];

  // Detect delimiter — comma or semicolon
  const delimiter = lines[0].includes(';') ? ';' : ',';

  // Parse a CSV line handling quoted fields
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

  const qIdx    = headers.findIndex((h) => h === 'question');
  const aIdx    = headers.findIndex((h) => h === 'a');
  const bIdx    = headers.findIndex((h) => h === 'b');
  const cIdx    = headers.findIndex((h) => h === 'c');
  const dIdx    = headers.findIndex((h) => h === 'd');
  const ansIdx  = headers.findIndex((h) => h === 'answer');
  const expIdx  = headers.findIndex((h) => h === 'explanation');

  if (qIdx === -1 || aIdx === -1 || bIdx === -1 || cIdx === -1 || dIdx === -1 || ansIdx === -1) {
    return [];
  }

  const results: { question: string; options: DrillOption[]; correctOption: string; explanation?: string }[] = [];

  for (let i = 1; i < lines.length; i++) {
    const cols = parseLine(lines[i]);
    const question = cols[qIdx]?.replace(/^["']|["']$/g, '').trim();
    const optA     = cols[aIdx]?.replace(/^["']|["']$/g, '').trim();
    const optB     = cols[bIdx]?.replace(/^["']|["']$/g, '').trim();
    const optC     = cols[cIdx]?.replace(/^["']|["']$/g, '').trim();
    const optD     = cols[dIdx]?.replace(/^["']|["']$/g, '').trim();
    const answer   = cols[ansIdx]?.replace(/^["']|["']$/g, '').trim().toUpperCase();
    const explanation = expIdx !== -1 ? cols[expIdx]?.replace(/^["']|["']$/g, '').trim() : undefined;

    if (!question || !optA || !optB || !optC || !optD || !['A','B','C','D'].includes(answer)) continue;

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

  const [tab, setTab]               = useState<TabType>('csv');
  const [fileName, setFileName]     = useState('');
  const [preview, setPreview]       = useState<ReturnType<typeof parseCSV>>([]);
  const [submitting, setSubmitting] = useState(false);
  const [picking, setPicking]       = useState(false);

  // Manual form state
  const [question, setQuestion]         = useState('');
  const [optA, setOptA]                 = useState('');
  const [optB, setOptB]                 = useState('');
  const [optC, setOptC]                 = useState('');
  const [optD, setOptD]                 = useState('');
  const [correct, setCorrect]           = useState('');
  const [explanation, setExplanation]   = useState('');

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
          'Make sure your CSV has these column headers:\nquestion, A, B, C, D, answer, explanation\n\nAsk ChatGPT to generate questions in this format.'
        );
        return;
      }

      setPreview(parsed);
    } catch (e) {
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
        explanation.trim() || undefined
      );
      Alert.alert('Added!', 'Question added', [
        { text: 'Add another', onPress: () => { setQuestion(''); setOptA(''); setOptB(''); setOptC(''); setOptD(''); setCorrect(''); setExplanation(''); } },
        { text: 'Done', onPress: () => navigation.goBack() },
      ]);
    } catch {
      Alert.alert('Error', 'Could not add question');
    } finally {
      setSubmitting(false);
    }
  };

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

          {/* CSV Tab */}
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

              {/* ChatGPT prompt to copy */}
              <View style={styles.promptCard}>
                <Text style={styles.promptLabel}>Copy this prompt into ChatGPT:</Text>
                <Text style={styles.promptText}>
                  {`Generate 20 questions about [your topic] as a CSV.\nColumns: question, A, B, C, D, answer, explanation\nAnswer column = just the letter A B C or D.\nFirst row must be the column headers.`}
                </Text>
              </View>

              {/* Upload button */}
              {preview.length === 0 ? (
                <TouchableOpacity
                  style={[styles.uploadBtn, picking && { opacity: 0.6 }]}
                  onPress={handlePickFile}
                  disabled={picking}
                >
                  {picking ? (
                    <ActivityIndicator color="#fff" />
                  ) : (
                    <Text style={styles.uploadBtnText}>📂 Choose CSV file</Text>
                  )}
                </TouchableOpacity>
              ) : (
                <>
                  {/* Preview */}
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

          {/* Manual Tab */}
          {tab === 'manual' && (
            <>
              <TextInput style={styles.input} placeholder="Question" placeholderTextColor={Colors.textMuted} value={question} onChangeText={setQuestion} multiline />
              {(['A', 'B', 'C', 'D'] as const).map((label) => {
                const val = label === 'A' ? optA : label === 'B' ? optB : label === 'C' ? optC : optD;
                const set = label === 'A' ? setOptA : label === 'B' ? setOptB : label === 'C' ? setOptC : setOptD;
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
              >
                <Text style={styles.primaryBtnText}>{submitting ? 'Adding...' : 'Add question'}</Text>
              </TouchableOpacity>
            </>
          )}

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe:         { flex: 1, backgroundColor: Colors.background },
  scroll:       { padding: Spacing.lg, paddingBottom: 100 },
  backRow:      { marginBottom: 12 },
  backText:     { fontSize: 14, color: Colors.brand, fontWeight: '600' },
  title:        { fontSize: 28, fontWeight: '800', color: Colors.textPrimary },
  subtitle:     { fontSize: 14, color: Colors.textSecondary, marginTop: 2, marginBottom: 24 },
  tabs:         { flexDirection: 'row', backgroundColor: Colors.surface, borderRadius: 12, padding: 4, marginBottom: 20, borderWidth: 1, borderColor: Colors.border },
  tab:          { flex: 1, paddingVertical: 10, borderRadius: 10, alignItems: 'center' },
  tabActive:    { backgroundColor: Colors.brand },
  tabText:      { fontSize: 14, fontWeight: '600', color: Colors.textSecondary },
  tabTextActive:{ color: '#fff' },
  infoCard:     { backgroundColor: '#EEF2FF', borderRadius: 12, padding: 16, marginBottom: 12 },
  infoTitle:    { fontSize: 14, fontWeight: '700', color: '#3730A3', marginBottom: 8 },
  infoText:     { fontSize: 13, color: '#4338CA', marginBottom: 4, lineHeight: 20 },
  columnsBox:   { backgroundColor: '#C7D2FE', borderRadius: 6, padding: 8, marginVertical: 6 },
  columnsText:  { fontSize: 12, fontFamily: 'monospace', color: '#312E81', fontWeight: '600' },
  promptCard:   { backgroundColor: '#F0FDF4', borderRadius: 12, padding: 16, marginBottom: 20, borderWidth: 1, borderColor: '#BBF7D0' },
  promptLabel:  { fontSize: 12, fontWeight: '700', color: '#065F46', marginBottom: 6 },
  promptText:   { fontSize: 12, color: '#047857', lineHeight: 20, fontFamily: 'monospace' },
  uploadBtn:    { backgroundColor: Colors.brand, borderRadius: 50, paddingVertical: 16, alignItems: 'center', marginBottom: 12 },
  uploadBtnText:{ fontSize: 16, fontWeight: '700', color: '#fff' },
  previewCard:  { backgroundColor: '#F0FDF4', borderRadius: 12, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: '#BBF7D0' },
  previewTitle: { fontSize: 14, fontWeight: '700', color: '#065F46', marginBottom: 8 },
  previewQ:     { fontSize: 13, color: Colors.textSecondary, marginBottom: 3 },
  previewMore:  { fontSize: 12, color: Colors.textMuted, marginTop: 4 },
  primaryBtn:   { backgroundColor: Colors.brand, borderRadius: 50, paddingVertical: 16, alignItems: 'center', marginBottom: 12 },
  primaryBtnText:{ fontSize: 16, fontWeight: '700', color: '#fff' },
  changeFileBtn:{ alignItems: 'center', paddingVertical: 10 },
  changeFileBtnText:{ fontSize: 14, color: Colors.textSecondary, fontWeight: '600' },
  input:        { backgroundColor: Colors.surface, borderRadius: 10, borderWidth: 1, borderColor: Colors.border, padding: 14, fontSize: 14, color: Colors.textPrimary, marginBottom: 10 },
});