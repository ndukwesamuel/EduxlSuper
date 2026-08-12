// // ─── WhiteboardGeneratingScreen.tsx ──────────────────────────────
// import React, { useState, useEffect, useRef } from 'react';
// import { View, Text, StyleSheet, Animated } from 'react-native';
// import { SafeAreaView } from 'react-native-safe-area-context';
// import { useNavigation, useRoute } from '@react-navigation/native';
// import { NativeStackNavigationProp } from '@react-navigation/native-stack';
// import { AppStackParamList } from '../../navigation/types';

// type Nav = NativeStackNavigationProp<AppStackParamList>;

// // ── Simulated generation steps ─────────────────────────────────────
// // Real flow: script → narration audio per scene → animation render → stitch
// const STEPS = [
//   { id: 'script',  label: 'Writing script',          icon: '✍️', duration: 3000 },
//   { id: 's1',      label: 'Generating scene 1 / 6',   icon: '🎬', duration: 2500 },
//   { id: 's2',      label: 'Generating scene 2 / 6',   icon: '🎬', duration: 2500 },
//   { id: 's3',      label: 'Generating scene 3 / 6',   icon: '🎬', duration: 2500 },
//   { id: 's4',      label: 'Generating scene 4 / 6',   icon: '🎬', duration: 2500 },
//   { id: 's5',      label: 'Generating scene 5 / 6',   icon: '🎬', duration: 2500 },
//   { id: 's6',      label: 'Generating scene 6 / 6',   icon: '🎬', duration: 2500 },
//   { id: 'voice',   label: 'Recording narration',      icon: '🎙️', duration: 3000 },
//   { id: 'stitch',  label: 'Stitching final video',    icon: '🪡', duration: 2500 },
// ];

// const TOTAL_DURATION = STEPS.reduce((acc, s) => acc + s.duration, 0); // ~26s

// export default function WhiteboardGeneratingScreen() {
//   const navigation = useNavigation<Nav>();
//   const route      = useRoute<any>();
//   const { subjectId, subjectName, topic, style } = route.params ?? {};

//   const [stepIdx, setStepIdx]   = useState(0);
//   const [completed, setCompleted] = useState<string[]>([]);
//   const progressAnim = useRef(new Animated.Value(0)).current;
//   const pulseAnim     = useRef(new Animated.Value(1)).current;

//   // Overall progress bar animation
//   useEffect(() => {
//     Animated.timing(progressAnim, {
//       toValue: 1,
//       duration: TOTAL_DURATION,
//       useNativeDriver: false,
//     }).start();
//   }, []);

//   // Pulse animation on active icon
//   useEffect(() => {
//     const loop = Animated.loop(
//       Animated.sequence([
//         Animated.timing(pulseAnim, { toValue: 1.15, duration: 500, useNativeDriver: true }),
//         Animated.timing(pulseAnim, { toValue: 1,    duration: 500, useNativeDriver: true }),
//       ])
//     );
//     loop.start();
//     return () => loop.stop();
//   }, []);

//   // Step-by-step progression
//   useEffect(() => {
//     if (stepIdx >= STEPS.length) {
//       // Done — navigate to player after a short beat
//       const finishTimer = setTimeout(() => {
//         navigation.replace('WhiteboardPlayer' as any, {
//           videoId: 'newly-generated',
//           subjectId, subjectName, topic, style,
//         });
//       }, 600);
//       return () => clearTimeout(finishTimer);
//     }

//     const timer = setTimeout(() => {
//       setCompleted((prev) => [...prev, STEPS[stepIdx].id]);
//       setStepIdx((i) => i + 1);
//     }, STEPS[stepIdx].duration);

//     return () => clearTimeout(timer);
//   }, [stepIdx]);

//   const currentStep = STEPS[stepIdx];
//   const progressWidth = progressAnim.interpolate({
//     inputRange: [0, 1],
//     outputRange: ['0%', '100%'],
//   });

//   return (
//     <SafeAreaView style={styles.safe}>
//       <View style={styles.content}>

//         {/* Animated icon */}
//         <Animated.View style={[styles.iconCircle, { transform: [{ scale: pulseAnim }] }]}>
//           <Text style={styles.iconEmoji}>{currentStep?.icon ?? '✨'}</Text>
//         </Animated.View>

//         <Text style={styles.title}>Generating Your Video</Text>
//         <Text style={styles.topicText}>"{topic ?? 'Your topic'}"</Text>

//         {/* Progress bar */}
//         <View style={styles.progressTrack}>
//           <Animated.View style={[styles.progressFill, { width: progressWidth }]} />
//         </View>
//         <Text style={styles.currentStepText}>
//           {stepIdx < STEPS.length ? currentStep.label : 'Finalizing...'}
//         </Text>

//         {/* Step checklist */}
//         <View style={styles.stepList}>
//           {STEPS.map((s, i) => {
//             const isDone   = completed.includes(s.id);
//             const isActive = i === stepIdx;
//             return (
//               <View key={s.id} style={styles.stepRow}>
//                 <View style={[
//                   styles.stepDot,
//                   isDone && styles.stepDotDone,
//                   isActive && styles.stepDotActive,
//                 ]}>
//                   <Text style={styles.stepDotText}>
//                     {isDone ? '✓' : isActive ? '●' : ''}
//                   </Text>
//                 </View>
//                 <Text style={[
//                   styles.stepLabel,
//                   isDone && styles.stepLabelDone,
//                   isActive && styles.stepLabelActive,
//                 ]}>
//                   {s.label}
//                 </Text>
//               </View>
//             );
//           })}
//         </View>

//         <Text style={styles.footerNote}>This usually takes 20-40 seconds. Don't close the app.</Text>

//       </View>
//     </SafeAreaView>
//   );
// }

// const styles = StyleSheet.create({
//   safe:    { flex: 1, backgroundColor: '#F8FAFC' },
//   content: { flex: 1, padding: 24, alignItems: 'center', justifyContent: 'center' },

//   iconCircle: { width: 88, height: 88, borderRadius: 44, backgroundColor: '#EFF6FF', alignItems: 'center', justifyContent: 'center', marginBottom: 24 },
//   iconEmoji:  { fontSize: 36 },

//   title:     { fontSize: 22, fontWeight: '800', color: '#0F172A', marginBottom: 6, letterSpacing: -0.3 },
//   topicText: { fontSize: 14, color: '#64748B', fontStyle: 'italic', marginBottom: 28, textTransform: 'capitalize' },

//   progressTrack: { width: '100%', height: 6, backgroundColor: '#E2E8F0', borderRadius: 999, overflow: 'hidden', marginBottom: 10 },
//   progressFill:  { height: 6, backgroundColor: '#1D4ED8', borderRadius: 999 },
//   currentStepText: { fontSize: 13, fontWeight: '600', color: '#1D4ED8', marginBottom: 28 },

//   stepList: { width: '100%', gap: 12, marginBottom: 28 },
//   stepRow:  { flexDirection: 'row', alignItems: 'center', gap: 12 },
//   stepDot:  { width: 22, height: 22, borderRadius: 11, backgroundColor: '#F1F5F9', borderWidth: 1, borderColor: '#E2E8F0', alignItems: 'center', justifyContent: 'center' },
//   stepDotDone:   { backgroundColor: '#D1FAE5', borderColor: '#A7F3D0' },
//   stepDotActive: { backgroundColor: '#EFF6FF', borderColor: '#1D4ED8' },
//   stepDotText:   { fontSize: 11, color: '#059669', fontWeight: '800' },
//   stepLabel:       { fontSize: 13, color: '#CBD5E1', fontWeight: '500' },
//   stepLabelDone:   { color: '#94A3B8', textDecorationLine: 'line-through' },
//   stepLabelActive: { color: '#0F172A', fontWeight: '700' },

//   footerNote: { fontSize: 11, color: '#94A3B8', textAlign: 'center' },
// });


// ─── WhiteboardGeneratingScreen.tsx ──────────────────────────────
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { View, Text, StyleSheet, Animated, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AppStackParamList } from '../../navigation/types';
// ⚠️ adjust this import path to match your project structure
import { generateWhiteboardVideo, WhiteboardVideo } from '../../../config/client';

type Nav = NativeStackNavigationProp<AppStackParamList>;

// ── Visual-only steps ──────────────────────────────────────────────
// These no longer drive navigation — they're just a progress narrative
// while we wait on the real request. The cycle holds on the last step
// until the API actually responds, since real generation time varies.
const STEPS = [
  { id: 'script',  label: 'Writing script',         icon: '✍️', duration: 3000 },
  { id: 'scenes',  label: 'Generating scenes',       icon: '🎬', duration: 4000 },
  { id: 'voice',   label: 'Recording narration',     icon: '🎙️', duration: 4000 },
  { id: 'stitch',  label: 'Stitching final video',   icon: '🪡', duration: 4000 },
];

export default function WhiteboardGeneratingScreen() {
  const navigation = useNavigation<Nav>();
  const route      = useRoute<any>();
  const { subjectId, subjectName, topic, style, mode, file } = route.params ?? {};

  const [stepIdx, setStepIdx]     = useState(0);
  const [completed, setCompleted] = useState<string[]>([]);
  const [video, setVideo]         = useState<WhiteboardVideo | null>(null);
  const [error, setError]         = useState<string | null>(null);

  const progressAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim     = useRef(new Animated.Value(1)).current;

  // ── The real network call ──────────────────────────────────────
  const runGeneration = useCallback(async () => {
    setError(null);
    setVideo(null);
    setStepIdx(0);
    setCompleted([]);
    try {
      const formData = new FormData();
      formData.append('style', style ?? 'notebook');
      formData.append('topic', topic ?? '');
      if (mode === 'file' && file) {
        // @ts-ignore — React Native's FormData accepts this uri/name/type shape
        formData.append('file', {
          uri: file.uri,
          name: file.name,
          type: file.mimeType || 'application/octet-stream',
        });
      }
      const result = await generateWhiteboardVideo(subjectId, formData);
      setVideo(result);
    } catch (e: any) {
      setError(e?.response?.data?.message ?? 'Video generation failed. Please try again.');
    }
  }, [subjectId, topic, style, mode, file]);

  useEffect(() => {
    runGeneration();
  }, [runGeneration]);

  // Pulse animation on the active icon
  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.15, duration: 500, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1,    duration: 500, useNativeDriver: true }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, []);

  // Cycle through the visual steps, but hold on the last one
  // until the real request actually finishes (success or error).
  useEffect(() => {
    if (video || error) return;
    if (stepIdx >= STEPS.length - 1) return;
    const timer = setTimeout(() => {
      setCompleted((prev) => [...prev, STEPS[stepIdx].id]);
      setStepIdx((i) => i + 1);
    }, STEPS[stepIdx].duration);
    return () => clearTimeout(timer);
  }, [stepIdx, video, error]);

  // Animate the progress bar toward the current step, or to 100%
  // once the real video has come back.
  useEffect(() => {
    const target = video ? 1 : (stepIdx / STEPS.length);
    Animated.timing(progressAnim, {
      toValue: target,
      duration: 500,
      useNativeDriver: false,
    }).start();
  }, [stepIdx, video]);

  // Once we have a real video, mark everything done and move on.
  useEffect(() => {
    if (!video) return;
    setCompleted(STEPS.map((s) => s.id));
    const t = setTimeout(() => {
      navigation.replace('WhiteboardPlayer' as any, { video, subjectName });
    }, 500);
    return () => clearTimeout(t);
  }, [video]);

  const currentStep = STEPS[Math.min(stepIdx, STEPS.length - 1)];
  const progressWidth = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  if (error) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.content}>
          <View style={[styles.iconCircle, { backgroundColor: '#FEE2E2' }]}>
            <Text style={styles.iconEmoji}>⚠️</Text>
          </View>
          <Text style={styles.title}>Generation Failed</Text>
          <Text style={[styles.topicText, { fontStyle: 'normal', marginBottom: 24 }]}>{error}</Text>
          <TouchableOpacity style={styles.retryBtn} onPress={runGeneration} activeOpacity={0.85}>
            <Text style={styles.retryBtnText}>Try Again</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.backLink} onPress={() => navigation.goBack()}>
            <Text style={styles.backLinkText}>← Back to Create</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.content}>

        {/* Animated icon */}
        <Animated.View style={[styles.iconCircle, { transform: [{ scale: pulseAnim }] }]}>
          <Text style={styles.iconEmoji}>{video ? '✅' : currentStep?.icon ?? '✨'}</Text>
        </Animated.View>

        <Text style={styles.title}>Generating Your Video</Text>
        <Text style={styles.topicText}>"{topic || (file?.name ?? 'Your topic')}"</Text>

        {/* Progress bar */}
        <View style={styles.progressTrack}>
          <Animated.View style={[styles.progressFill, { width: progressWidth }]} />
        </View>
        <Text style={styles.currentStepText}>
          {video ? 'Done!' : currentStep.label}
        </Text>

        {/* Step checklist */}
        <View style={styles.stepList}>
          {STEPS.map((s, i) => {
            const isDone   = completed.includes(s.id) || !!video;
            const isActive = i === stepIdx && !video;
            return (
              <View key={s.id} style={styles.stepRow}>
                <View style={[
                  styles.stepDot,
                  isDone && styles.stepDotDone,
                  isActive && styles.stepDotActive,
                ]}>
                  <Text style={styles.stepDotText}>
                    {isDone ? '✓' : isActive ? '●' : ''}
                  </Text>
                </View>
                <Text style={[
                  styles.stepLabel,
                  isDone && styles.stepLabelDone,
                  isActive && styles.stepLabelActive,
                ]}>
                  {s.label}
                </Text>
              </View>
            );
          })}
        </View>

        <Text style={styles.footerNote}>This usually takes 20-40 seconds. Don't close the app.</Text>

      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe:    { flex: 1, backgroundColor: '#F8FAFC' },
  content: { flex: 1, padding: 24, alignItems: 'center', justifyContent: 'center' },

  iconCircle: { width: 88, height: 88, borderRadius: 44, backgroundColor: '#EFF6FF', alignItems: 'center', justifyContent: 'center', marginBottom: 24 },
  iconEmoji:  { fontSize: 36 },

  title:     { fontSize: 22, fontWeight: '800', color: '#0F172A', marginBottom: 6, letterSpacing: -0.3 },
  topicText: { fontSize: 14, color: '#64748B', fontStyle: 'italic', marginBottom: 28, textTransform: 'capitalize', textAlign: 'center' },

  progressTrack: { width: '100%', height: 6, backgroundColor: '#E2E8F0', borderRadius: 999, overflow: 'hidden', marginBottom: 10 },
  progressFill:  { height: 6, backgroundColor: '#1D4ED8', borderRadius: 999 },
  currentStepText: { fontSize: 13, fontWeight: '600', color: '#1D4ED8', marginBottom: 28 },

  stepList: { width: '100%', gap: 12, marginBottom: 28 },
  stepRow:  { flexDirection: 'row', alignItems: 'center', gap: 12 },
  stepDot:  { width: 22, height: 22, borderRadius: 11, backgroundColor: '#F1F5F9', borderWidth: 1, borderColor: '#E2E8F0', alignItems: 'center', justifyContent: 'center' },
  stepDotDone:   { backgroundColor: '#D1FAE5', borderColor: '#A7F3D0' },
  stepDotActive: { backgroundColor: '#EFF6FF', borderColor: '#1D4ED8' },
  stepDotText:   { fontSize: 11, color: '#059669', fontWeight: '800' },
  stepLabel:       { fontSize: 13, color: '#CBD5E1', fontWeight: '500' },
  stepLabelDone:   { color: '#94A3B8', textDecorationLine: 'line-through' },
  stepLabelActive: { color: '#0F172A', fontWeight: '700' },

  footerNote: { fontSize: 11, color: '#94A3B8', textAlign: 'center' },

  retryBtn:     { backgroundColor: '#1D4ED8', borderRadius: 999, paddingHorizontal: 24, paddingVertical: 14, marginBottom: 14 },
  retryBtnText: { color: '#fff', fontWeight: '700', fontSize: 14 },
  backLink:     { padding: 8 },
  backLinkText: { color: '#64748B', fontWeight: '600', fontSize: 13 },
});