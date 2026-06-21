// // ─── WhiteboardCreateScreen.tsx ───────────────────────────────────
// import React, { useState } from 'react';
// import {
//   View, Text, ScrollView, TouchableOpacity, TextInput,
//   StyleSheet, Alert,
// } from 'react-native';
// import { SafeAreaView } from 'react-native-safe-area-context';
// import { useNavigation, useRoute } from '@react-navigation/native';
// import { NativeStackNavigationProp } from '@react-navigation/native-stack';
// import * as DocumentPicker from 'expo-document-picker';
// import { AppStackParamList } from '../../navigation/types';

// type Nav = NativeStackNavigationProp<AppStackParamList>;
// type Mode = 'topic' | 'file';

// const STYLES = [
//   { id: 'notebook', emoji: '📓', label: 'Notebook',  desc: 'Handwritten notes feel',     color: '#D97706', bg: '#FEF3C7' },
//   { id: 'card',     emoji: '🃏', label: 'Card',      desc: 'Clean modern cards',         color: '#1D4ED8', bg: '#EFF6FF' },
//   { id: 'sketch',   emoji: '✏️', label: 'Sketch',    desc: 'Hand-drawn doodle style',    color: '#475569', bg: '#F1F5F9' },
//   { id: 'chalk',    emoji: '🖍️', label: 'Chalk',     desc: 'Blackboard chalk look',      color: '#059669', bg: '#D1FAE5' },
//   { id: 'minimal',  emoji: '⬜', label: 'Minimal',   desc: 'Simple, distraction-free',   color: '#7C3AED', bg: '#EDE9FE' },
// ];

// export default function WhiteboardCreateScreen() {
//   const navigation = useNavigation<Nav>();
//   const route      = useRoute<any>();
//   const subjectId   = route.params?.subjectId   ?? '';
//   const subjectName = route.params?.subjectName ?? 'Subject';

//   const [mode, setMode]     = useState<Mode>('topic');
//   const [topic, setTopic]   = useState('');
//   const [style, setStyle]   = useState('notebook');
//   const [file, setFile]     = useState<string | null>(null);

//   const pickFile = async () => {
//     try {
//       const result = await DocumentPicker.getDocumentAsync({
//         type: ['application/pdf', 'image/*'],
//       });
//       if (!result.canceled && result.assets?.[0]) {
//         setFile(result.assets[0].name);
//       }
//     } catch {
//       Alert.alert('Error', 'Could not open file picker.');
//     }
//   };

//   const canGenerate = mode === 'topic' ? topic.trim().length > 2 : !!file;

//   const handleGenerate = () => {
//     if (!canGenerate) return;
//     navigation.navigate('WhiteboardGenerating' as any, {
//       subjectId,
//       subjectName,
//       topic: mode === 'topic' ? topic.trim() : (file ?? 'Uploaded document'),
//       style,
//       mode,
//     });
//   };

//   return (
//     <SafeAreaView style={styles.safe}>
//       <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

//         <View style={styles.backRow}>
//           <TouchableOpacity onPress={() => navigation.goBack()}>
//             <Text style={styles.backBtn}>← {subjectName}</Text>
//           </TouchableOpacity>
//         </View>

//         <Text style={styles.title}>Generate a{'\n'}Whiteboard Video</Text>
//         <Text style={styles.sub}>AI turns any topic into an animated, narrated explainer video.</Text>

//         {/* Mode toggle */}
//         <View style={styles.modeToggle}>
//           <TouchableOpacity
//             style={[styles.modeBtn, mode === 'topic' && styles.modeBtnActive]}
//             onPress={() => setMode('topic')}
//             activeOpacity={0.8}
//           >
//             <Text style={[styles.modeBtnText, mode === 'topic' && styles.modeBtnTextActive]}>✍️ Type a Topic</Text>
//           </TouchableOpacity>
//           <TouchableOpacity
//             style={[styles.modeBtn, mode === 'file' && styles.modeBtnActive]}
//             onPress={() => setMode('file')}
//             activeOpacity={0.8}
//           >
//             <Text style={[styles.modeBtnText, mode === 'file' && styles.modeBtnTextActive]}>📄 Upload File</Text>
//           </TouchableOpacity>
//         </View>

//         {/* Topic input */}
//         {mode === 'topic' && (
//           <View style={styles.inputBlock}>
//             <Text style={styles.secLabel}>Topic</Text>
//             <TextInput
//               style={styles.input}
//               placeholder="e.g. Photosynthesis, Newton's Laws, CAR Framework"
//               placeholderTextColor="#94A3B8"
//               value={topic}
//               onChangeText={setTopic}
//             />
//             <Text style={styles.hint}>AI will research and script a 5-8 scene explainer on this topic.</Text>
//           </View>
//         )}

//         {/* File upload */}
//         {mode === 'file' && (
//           <View style={styles.inputBlock}>
//             <Text style={styles.secLabel}>Upload Source Material</Text>
//             <TouchableOpacity style={styles.uploadZone} onPress={pickFile} activeOpacity={0.8}>
//               <Text style={styles.uploadIcon}>{file ? '📄' : '📤'}</Text>
//               {file ? (
//                 <>
//                   <Text style={styles.uploadTitle}>{file}</Text>
//                   <Text style={styles.uploadMeta}>Tap to replace</Text>
//                 </>
//               ) : (
//                 <>
//                   <Text style={styles.uploadTitle}>Upload PDF or Image</Text>
//                   <Text style={styles.uploadMeta}>Lecture notes, slides, or textbook pages</Text>
//                 </>
//               )}
//             </TouchableOpacity>
//             <Text style={styles.hint}>AI extracts key concepts from your file and builds the video around them.</Text>
//           </View>
//         )}

//         {/* Style picker */}
//         <Text style={[styles.secLabel, { marginTop: 8 }]}>Visual Style</Text>
//         <View style={styles.styleGrid}>
//           {STYLES.map((s) => (
//             <TouchableOpacity
//               key={s.id}
//               style={[styles.styleCard, style === s.id && { borderColor: s.color, backgroundColor: s.bg }]}
//               onPress={() => setStyle(s.id)}
//               activeOpacity={0.8}
//             >
//               <Text style={styles.styleEmoji}>{s.emoji}</Text>
//               <Text style={[styles.styleLabel, style === s.id && { color: s.color }]}>{s.label}</Text>
//               <Text style={styles.styleDesc}>{s.desc}</Text>
//               {style === s.id && (
//                 <View style={[styles.checkDot, { backgroundColor: s.color }]}>
//                   <Text style={styles.checkDotText}>✓</Text>
//                 </View>
//               )}
//             </TouchableOpacity>
//           ))}
//         </View>

//       </ScrollView>

//       <View style={styles.footer}>
//         <TouchableOpacity
//           style={[styles.btnPrimary, !canGenerate && styles.btnDisabled]}
//           onPress={handleGenerate}
//           activeOpacity={0.85}
//           disabled={!canGenerate}
//         >
//           <Text style={styles.btnText}>
//             {canGenerate ? '✨ Generate Video' : mode === 'topic' ? 'Enter a topic to continue' : 'Upload a file to continue'}
//           </Text>
//         </TouchableOpacity>
//       </View>
//     </SafeAreaView>
//   );
// }

// const styles = StyleSheet.create({
//   safe:    { flex: 1, backgroundColor: '#F8FAFC' },
//   scroll:  { padding: 20, paddingBottom: 32 },
//   backRow: { marginBottom: 16 },
//   backBtn: { fontSize: 14, fontWeight: '600', color: '#1D4ED8' },
//   title:   { fontSize: 26, fontWeight: '800', color: '#0F172A', lineHeight: 32, letterSpacing: -0.5, marginBottom: 6 },
//   sub:     { fontSize: 13, color: '#475569', lineHeight: 20, marginBottom: 20 },

//   modeToggle: { flexDirection: 'row', gap: 8, marginBottom: 20 },
//   modeBtn:    { flex: 1, backgroundColor: '#fff', borderWidth: 1.5, borderColor: '#E2E8F0', borderRadius: 12, paddingVertical: 12, alignItems: 'center' },
//   modeBtnActive: { backgroundColor: '#EFF6FF', borderColor: '#1D4ED8' },
//   modeBtnText:   { fontSize: 13, fontWeight: '600', color: '#64748B' },
//   modeBtnTextActive: { color: '#1D4ED8', fontWeight: '700' },

//   inputBlock: { marginBottom: 20 },
//   secLabel:   { fontSize: 10, fontWeight: '700', color: '#94A3B8', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 10 },
//   input:      { backgroundColor: '#fff', borderWidth: 1, borderColor: '#CBD5E1', borderRadius: 12, padding: 14, fontSize: 14, color: '#0F172A' },
//   hint:       { fontSize: 11, color: '#94A3B8', marginTop: 8, lineHeight: 16 },

//   uploadZone:  { backgroundColor: '#fff', borderWidth: 2, borderStyle: 'dashed', borderColor: '#CBD5E1', borderRadius: 16, padding: 24, alignItems: 'center' },
//   uploadIcon:  { fontSize: 26, marginBottom: 8 },
//   uploadTitle: { fontSize: 13, fontWeight: '600', color: '#0F172A', marginBottom: 3 },
//   uploadMeta:  { fontSize: 11, color: '#94A3B8' },

//   styleGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
//   styleCard: { width: '47%', backgroundColor: '#fff', borderWidth: 1.5, borderColor: '#E2E8F0', borderRadius: 14, padding: 14, position: 'relative' },
//   styleEmoji:{ fontSize: 24, marginBottom: 6 },
//   styleLabel:{ fontSize: 13, fontWeight: '700', color: '#0F172A', marginBottom: 2 },
//   styleDesc: { fontSize: 10, color: '#94A3B8', lineHeight: 14 },
//   checkDot:  { position: 'absolute', top: 10, right: 10, width: 18, height: 18, borderRadius: 9, alignItems: 'center', justifyContent: 'center' },
//   checkDotText: { fontSize: 10, color: '#fff', fontWeight: '800' },

//   footer:     { padding: 20, paddingBottom: 28, backgroundColor: '#F8FAFC', borderTopWidth: 1, borderTopColor: '#E2E8F0' },
//   btnPrimary: { backgroundColor: '#1D4ED8', borderRadius: 999, paddingVertical: 15, alignItems: 'center', shadowColor: '#1D4ED8', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.28, shadowRadius: 12, elevation: 6 },
//   btnDisabled:{ backgroundColor: '#94A3B8', shadowOpacity: 0 },
//   btnText:    { fontSize: 15, fontWeight: '700', color: '#fff' },
// });


// ─── WhiteboardCreateScreen.tsx ───────────────────────────────────
import React, { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, TextInput,
  StyleSheet, Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import * as DocumentPicker from 'expo-document-picker';
import { AppStackParamList } from '../../navigation/types';

type Nav = NativeStackNavigationProp<AppStackParamList>;
type Mode = 'topic' | 'file';

// What we actually need to build the multipart FormData later —
// DocumentPicker gives us more, but this is all the upload needs.
export interface PickedFile {
  uri: string;
  name: string;
  mimeType?: string;
}

const STYLES = [
  { id: 'notebook', emoji: '📓', label: 'Notebook',  desc: 'Handwritten notes feel',     color: '#D97706', bg: '#FEF3C7' },
  { id: 'card',     emoji: '🃏', label: 'Card',      desc: 'Clean modern cards',         color: '#1D4ED8', bg: '#EFF6FF' },
  { id: 'sketch',   emoji: '✏️', label: 'Sketch',    desc: 'Hand-drawn doodle style',    color: '#475569', bg: '#F1F5F9' },
  { id: 'chalk',    emoji: '🖍️', label: 'Chalk',     desc: 'Blackboard chalk look',      color: '#059669', bg: '#D1FAE5' },
  { id: 'minimal',  emoji: '⬜', label: 'Minimal',   desc: 'Simple, distraction-free',   color: '#7C3AED', bg: '#EDE9FE' },
];

export default function WhiteboardCreateScreen() {
  const navigation = useNavigation<Nav>();
  const route      = useRoute<any>();
  const subjectId   = route.params?.subjectId   ?? '';
  const subjectName = route.params?.subjectName ?? 'Subject';

  const [mode, setMode]   = useState<Mode>('topic');
  const [topic, setTopic] = useState('');
  const [style, setStyle] = useState('notebook');
  const [file, setFile]   = useState<PickedFile | null>(null);

  const pickFile = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['application/pdf', 'image/*'],
      });
      if (!result.canceled && result.assets?.[0]) {
        const asset = result.assets[0];
        setFile({ uri: asset.uri, name: asset.name, mimeType: asset.mimeType });
      }
    } catch {
      Alert.alert('Error', 'Could not open file picker.');
    }
  };

  const canGenerate = mode === 'topic' ? topic.trim().length > 2 : !!file;

  const handleGenerate = () => {
    if (!canGenerate) return;
    navigation.navigate('WhiteboardGenerating' as any, {
      subjectId,
      subjectName,
      topic: mode === 'topic' ? topic.trim() : '',
      style,
      mode,
      // only relevant in file mode — Generating screen builds the FormData
      file: mode === 'file' ? file : null,
    });
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

        <View style={styles.backRow}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.backBtn}>← {subjectName}</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.title}>Generate a{'\n'}Whiteboard Video</Text>
        <Text style={styles.sub}>AI turns any topic into an animated, narrated explainer video.</Text>

        {/* Mode toggle */}
        <View style={styles.modeToggle}>
          <TouchableOpacity
            style={[styles.modeBtn, mode === 'topic' && styles.modeBtnActive]}
            onPress={() => setMode('topic')}
            activeOpacity={0.8}
          >
            <Text style={[styles.modeBtnText, mode === 'topic' && styles.modeBtnTextActive]}>✍️ Type a Topic</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.modeBtn, mode === 'file' && styles.modeBtnActive]}
            onPress={() => setMode('file')}
            activeOpacity={0.8}
          >
            <Text style={[styles.modeBtnText, mode === 'file' && styles.modeBtnTextActive]}>📄 Upload File</Text>
          </TouchableOpacity>
        </View>

        {/* Topic input */}
        {mode === 'topic' && (
          <View style={styles.inputBlock}>
            <Text style={styles.secLabel}>Topic</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. Photosynthesis, Newton's Laws, CAR Framework"
              placeholderTextColor="#94A3B8"
              value={topic}
              onChangeText={setTopic}
            />
            <Text style={styles.hint}>AI will research and script a 5-8 scene explainer on this topic.</Text>
          </View>
        )}

        {/* File upload */}
        {mode === 'file' && (
          <View style={styles.inputBlock}>
            <Text style={styles.secLabel}>Upload Source Material</Text>
            <TouchableOpacity style={styles.uploadZone} onPress={pickFile} activeOpacity={0.8}>
              <Text style={styles.uploadIcon}>{file ? '📄' : '📤'}</Text>
              {file ? (
                <>
                  <Text style={styles.uploadTitle}>{file.name}</Text>
                  <Text style={styles.uploadMeta}>Tap to replace</Text>
                </>
              ) : (
                <>
                  <Text style={styles.uploadTitle}>Upload PDF or Image</Text>
                  <Text style={styles.uploadMeta}>Lecture notes, slides, or textbook pages</Text>
                </>
              )}
            </TouchableOpacity>
            <Text style={styles.hint}>AI extracts key concepts from your file and builds the video around them.</Text>
          </View>
        )}

        {/* Style picker */}
        <Text style={[styles.secLabel, { marginTop: 8 }]}>Visual Style</Text>
        <View style={styles.styleGrid}>
          {STYLES.map((s) => (
            <TouchableOpacity
              key={s.id}
              style={[styles.styleCard, style === s.id && { borderColor: s.color, backgroundColor: s.bg }]}
              onPress={() => setStyle(s.id)}
              activeOpacity={0.8}
            >
              <Text style={styles.styleEmoji}>{s.emoji}</Text>
              <Text style={[styles.styleLabel, style === s.id && { color: s.color }]}>{s.label}</Text>
              <Text style={styles.styleDesc}>{s.desc}</Text>
              {style === s.id && (
                <View style={[styles.checkDot, { backgroundColor: s.color }]}>
                  <Text style={styles.checkDotText}>✓</Text>
                </View>
              )}
            </TouchableOpacity>
          ))}
        </View>

      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.btnPrimary, !canGenerate && styles.btnDisabled]}
          onPress={handleGenerate}
          activeOpacity={0.85}
          disabled={!canGenerate}
        >
          <Text style={styles.btnText}>
            {canGenerate ? '✨ Generate Video' : mode === 'topic' ? 'Enter a topic to continue' : 'Upload a file to continue'}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe:    { flex: 1, backgroundColor: '#F8FAFC' },
  scroll:  { padding: 20, paddingBottom: 32 },
  backRow: { marginBottom: 16 },
  backBtn: { fontSize: 14, fontWeight: '600', color: '#1D4ED8' },
  title:   { fontSize: 26, fontWeight: '800', color: '#0F172A', lineHeight: 32, letterSpacing: -0.5, marginBottom: 6 },
  sub:     { fontSize: 13, color: '#475569', lineHeight: 20, marginBottom: 20 },

  modeToggle: { flexDirection: 'row', gap: 8, marginBottom: 20 },
  modeBtn:    { flex: 1, backgroundColor: '#fff', borderWidth: 1.5, borderColor: '#E2E8F0', borderRadius: 12, paddingVertical: 12, alignItems: 'center' },
  modeBtnActive: { backgroundColor: '#EFF6FF', borderColor: '#1D4ED8' },
  modeBtnText:   { fontSize: 13, fontWeight: '600', color: '#64748B' },
  modeBtnTextActive: { color: '#1D4ED8', fontWeight: '700' },

  inputBlock: { marginBottom: 20 },
  secLabel:   { fontSize: 10, fontWeight: '700', color: '#94A3B8', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 10 },
  input:      { backgroundColor: '#fff', borderWidth: 1, borderColor: '#CBD5E1', borderRadius: 12, padding: 14, fontSize: 14, color: '#0F172A' },
  hint:       { fontSize: 11, color: '#94A3B8', marginTop: 8, lineHeight: 16 },

  uploadZone:  { backgroundColor: '#fff', borderWidth: 2, borderStyle: 'dashed', borderColor: '#CBD5E1', borderRadius: 16, padding: 24, alignItems: 'center' },
  uploadIcon:  { fontSize: 26, marginBottom: 8 },
  uploadTitle: { fontSize: 13, fontWeight: '600', color: '#0F172A', marginBottom: 3 },
  uploadMeta:  { fontSize: 11, color: '#94A3B8' },

  styleGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  styleCard: { width: '47%', backgroundColor: '#fff', borderWidth: 1.5, borderColor: '#E2E8F0', borderRadius: 14, padding: 14, position: 'relative' },
  styleEmoji:{ fontSize: 24, marginBottom: 6 },
  styleLabel:{ fontSize: 13, fontWeight: '700', color: '#0F172A', marginBottom: 2 },
  styleDesc: { fontSize: 10, color: '#94A3B8', lineHeight: 14 },
  checkDot:  { position: 'absolute', top: 10, right: 10, width: 18, height: 18, borderRadius: 9, alignItems: 'center', justifyContent: 'center' },
  checkDotText: { fontSize: 10, color: '#fff', fontWeight: '800' },

  footer:     { padding: 20, paddingBottom: 28, backgroundColor: '#F8FAFC', borderTopWidth: 1, borderTopColor: '#E2E8F0' },
  btnPrimary: { backgroundColor: '#1D4ED8', borderRadius: 999, paddingVertical: 15, alignItems: 'center', shadowColor: '#1D4ED8', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.28, shadowRadius: 12, elevation: 6 },
  btnDisabled:{ backgroundColor: '#94A3B8', shadowOpacity: 0 },
  btnText:    { fontSize: 15, fontWeight: '700', color: '#fff' },
});