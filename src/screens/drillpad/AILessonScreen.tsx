// // // ─── AILessonScreen.tsx ────────────────────────────────────────────
// // import React, { useState, useRef, useEffect, useCallback } from 'react';
// // import {
// //   View, Text, TouchableOpacity, StyleSheet,
// //   Animated, Alert, ScrollView, ActivityIndicator,
// // } from 'react-native';
// // import { SafeAreaView } from 'react-native-safe-area-context';
// // import { useNavigation, useRoute, RouteProp, useFocusEffect } from '@react-navigation/native';
// // import { NativeStackNavigationProp } from '@react-navigation/native-stack';
// // import * as DocumentPicker from 'expo-document-picker';
// // import { Audio } from 'expo-av';
// // import { AppStackParamList } from '../../navigation/types';
// // import {
// //   getSubjectPodcast,
// //   generateSubjectPodcast,
// // } from '../../../config/client';

// // type Nav   = NativeStackNavigationProp<AppStackParamList>;
// // type Route = RouteProp<AppStackParamList, 'AILesson'>;

// // const SPEEDS = [0.75, 1, 1.25, 1.5];

// // export default function AILessonScreen() {
// //   const navigation = useNavigation<Nav>();
// //   const route      = useRoute<Route>();
// //   const { subjectId, subjectName } = route.params;

// //   const [loading, setLoading]       = useState(true);
// //   const [generating, setGenerating] = useState(false);
// //   const [podcast, setPodcast]       = useState<any>(null);

// //   const [sound, setSound]           = useState<Audio.Sound | null>(null);
// //   const [isPlaying, setIsPlaying]   = useState(false);
// //   const [position, setPosition]     = useState(0);
// //   const [duration, setDuration]     = useState(0);
// //   const [speed, setSpeed]           = useState(1);

// //   // ── Entrance animation ───────────────────────────────────────
// //   const fadeAnim  = useRef(new Animated.Value(0)).current;
// //   const slideAnim = useRef(new Animated.Value(30)).current;

// //   useEffect(() => {
// //     Animated.parallel([
// //       Animated.timing(fadeAnim,  { toValue: 1, duration: 400, useNativeDriver: true }),
// //       Animated.spring(slideAnim, { toValue: 0, tension: 65, friction: 10, useNativeDriver: true }),
// //     ]).start();
// //   }, []);

// //   const load = async () => {
// //     try {
// //       const data = await getSubjectPodcast(subjectId);
// //       if (data?.podcastAudioUrl) {
// //         setPodcast(data);
// //       }
// //     } catch {
// //       // no podcast yet — fine
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   useFocusEffect(useCallback(() => { load(); }, [subjectId]));

// //   // ── Cleanup sound on unmount ────────────────────────────────
// //   useEffect(() => {
// //     return () => {
// //       sound?.unloadAsync();
// //     };
// //   }, [sound]);

// //   // ── Pick file + generate ─────────────────────────────────────
// //   const pickFileAndGenerate = async () => {
// //     try {
// //       const result = await DocumentPicker.getDocumentAsync({
// //         type: ['application/pdf', 'image/jpeg', 'image/png', 'image/webp'],
// //         copyToCacheDirectory: true,
// //       });

// //       if (result.canceled || !result.assets?.[0]) return;
// //       const file = result.assets[0];

// //       setGenerating(true);

// //       const formData = new FormData();
// //       formData.append('file', {
// //         uri: file.uri,
// //         name: file.name,
// //         type: file.mimeType || 'application/pdf',
// //       } as any);
// //       formData.append('topic', subjectName);

// //       const data = await generateSubjectPodcast(subjectId, formData);
// //       setPodcast(data);

// //       Alert.alert('AI Lesson ready!', 'Your audio lesson has been generated.');
// //     } catch (err: any) {
// //       Alert.alert('Generation failed', err?.message || 'Could not generate AI lesson. Try again.');
// //     } finally {
// //       setGenerating(false);
// //     }
// //   };

// //   // ── Audio controls ───────────────────────────────────────────
// //   const togglePlay = async () => {
// //     if (!podcast?.podcastAudioUrl) return;

// //     if (sound) {
// //       if (isPlaying) {
// //         await sound.pauseAsync();
// //         setIsPlaying(false);
// //       } else {
// //         await sound.playAsync();
// //         setIsPlaying(true);
// //       }
// //       return;
// //     }

// //     // Load fresh
// //     const { sound: newSound } = await Audio.Sound.createAsync(
// //       { uri: podcast.podcastAudioUrl },
// //       { shouldPlay: true, rate: speed, shouldCorrectPitch: true }
// //     );

// //     setSound(newSound);
// //     setIsPlaying(true);

// //     newSound.setOnPlaybackStatusUpdate((status) => {
// //       if (status.isLoaded) {
// //         setPosition(status.positionMillis / 1000);
// //         setDuration((status.durationMillis ?? 0) / 1000);
// //         if (status.didJustFinish) {
// //           setIsPlaying(false);
// //           setPosition(0);
// //           newSound.setPositionAsync(0);
// //         }
// //       }
// //     });
// //   };

// //   const changeSpeed = async () => {
// //     const currentIdx = SPEEDS.indexOf(speed);
// //     const nextSpeed = SPEEDS[(currentIdx + 1) % SPEEDS.length];
// //     setSpeed(nextSpeed);
// //     if (sound) {
// //       await sound.setRateAsync(nextSpeed, true);
// //     }
// //   };

// //   const skip = async (seconds: number) => {
// //     if (!sound) return;
// //     const newPos = Math.max(0, Math.min(duration, position + seconds));
// //     await sound.setPositionAsync(newPos * 1000);
// //     setPosition(newPos);
// //   };

// //   const formatTime = (secs: number) => {
// //     const m = Math.floor(secs / 60);
// //     const s = Math.floor(secs % 60);
// //     return `${m}:${s.toString().padStart(2, '0')}`;
// //   };

// //   const progressPct = duration > 0 ? (position / duration) * 100 : 0;

// //   if (loading) {
// //     return (
// //       <SafeAreaView style={styles.safe}>
// //         <View style={styles.center}>
// //           <ActivityIndicator size="large" color="#1D4ED8" />
// //         </View>
// //       </SafeAreaView>
// //     );
// //   }

// //   return (
// //     <SafeAreaView style={styles.safe}>
// //       <ScrollView
// //         contentContainerStyle={styles.scroll}
// //         showsVerticalScrollIndicator={false}
// //       >
// //         <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}>

// //           {/* ── Header ── */}
// //           <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backRow}>
// //             <Text style={styles.backText}>← Back</Text>
// //           </TouchableOpacity>

// //           <Text style={styles.title}>AI Lesson</Text>
// //           <Text style={styles.subjectLabel}>{subjectName}</Text>

// //           {/* ── No podcast yet ── */}
// //           {!podcast && !generating && (
// //             <View style={styles.emptyState}>
// //               <Text style={styles.emptyEmoji}>🎧</Text>
// //               <Text style={styles.emptyTitle}>No AI lesson yet</Text>
// //               <Text style={styles.emptyDesc}>
// //                 Upload your lecture notes (PDF or image) and we'll turn them into
// //                 a short audio lesson you can listen to anytime — even on your commute.
// //               </Text>
// //               <TouchableOpacity style={styles.btnPrimary} onPress={pickFileAndGenerate} activeOpacity={0.85}>
// //                 <Text style={styles.btnPrimaryText}>📂 Upload Notes & Generate</Text>
// //               </TouchableOpacity>
// //             </View>
// //           )}

// //           {/* ── Generating ── */}
// //           {generating && (
// //             <View style={styles.emptyState}>
// //               <ActivityIndicator size="large" color="#1D4ED8" />
// //               <Text style={styles.generatingTitle}>Generating your lesson...</Text>
// //               <Text style={styles.emptyDesc}>
// //                 This usually takes 20-40 seconds. We're turning your notes into
// //                 a spoken lesson.
// //               </Text>
// //             </View>
// //           )}

// //           {/* ── Podcast player ── */}
// //           {podcast && !generating && (
// //             <>
// //               <View style={styles.playerCard}>
// //                 <View style={styles.glowCircle} />

// //                 <View style={styles.playerBadge}>
// //                   <Text style={styles.playerBadgeText}>🎧 AI LESSON</Text>
// //                 </View>

// //                 <Text style={styles.playerTitle}>{subjectName}</Text>
// //                 <Text style={styles.playerDuration}>
// //                   {podcast.podcastDurationSeconds
// //                     ? `~${Math.round(podcast.podcastDurationSeconds / 60)} min lesson`
// //                     : 'Audio lesson'}
// //                 </Text>

// //                 {/* Progress bar */}
// //                 <View style={styles.progressTrack}>
// //                   <View style={[styles.progressFill, { width: `${progressPct}%` }]} />
// //                 </View>
// //                 <View style={styles.timeRow}>
// //                   <Text style={styles.timeText}>{formatTime(position)}</Text>
// //                   <Text style={styles.timeText}>{formatTime(duration)}</Text>
// //                 </View>

// //                 {/* Controls */}
// //                 <View style={styles.controlsRow}>
// //                   <TouchableOpacity onPress={() => skip(-10)} style={styles.skipBtn}>
// //                     <Text style={styles.skipText}>⏮ 10s</Text>
// //                   </TouchableOpacity>

// //                   <TouchableOpacity onPress={togglePlay} style={styles.playBtn} activeOpacity={0.85}>
// //                     <Text style={styles.playIcon}>{isPlaying ? '⏸' : '▶️'}</Text>
// //                   </TouchableOpacity>

// //                   <TouchableOpacity onPress={() => skip(10)} style={styles.skipBtn}>
// //                     <Text style={styles.skipText}>10s ⏭</Text>
// //                   </TouchableOpacity>
// //                 </View>

// //                 {/* Speed */}
// //                 <TouchableOpacity onPress={changeSpeed} style={styles.speedBtn}>
// //                   <Text style={styles.speedText}>{speed}x speed</Text>
// //                 </TouchableOpacity>
// //               </View>

// //               {/* Commute tip */}
// //               <View style={styles.commuteTip}>
// //                 <Text style={styles.commuteTipTitle}>🎧 Great for commuting</Text>
// //                 <Text style={styles.commuteTipText}>
// //                   Listen to this lesson on your way to school. Your notes,
// //                   read aloud — no need to look at your phone.
// //                 </Text>
// //               </View>

// //               {/* Script preview */}
// //               {podcast.podcastScript && (
// //                 <View style={styles.scriptCard}>
// //                   <Text style={styles.scriptTitle}>📝 Lesson Transcript</Text>
// //                   <Text style={styles.scriptText} numberOfLines={8}>
// //                     {podcast.podcastScript}
// //                   </Text>
// //                 </View>
// //               )}

// //               {/* Regenerate */}
// //               <TouchableOpacity
// //                 style={styles.regenerateBtn}
// //                 onPress={pickFileAndGenerate}
// //                 activeOpacity={0.8}
// //               >
// //                 <Text style={styles.regenerateText}>🔄 Generate from new notes</Text>
// //               </TouchableOpacity>
// //             </>
// //           )}

// //         </Animated.View>
// //       </ScrollView>
// //     </SafeAreaView>
// //   );
// // }

// // const styles = StyleSheet.create({
// //   safe:   { flex: 1, backgroundColor: '#F8FAFC' },
// //   center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
// //   scroll: { padding: 16, paddingBottom: 48 },

// //   backRow:  { marginBottom: 8 },
// //   backText: { fontSize: 14, color: '#1D4ED8', fontWeight: '600' },

// //   title: {
// //     fontSize: 28,
// //     fontWeight: '800',
// //     color: '#0F172A',
// //     letterSpacing: -0.5,
// //     marginBottom: 2,
// //   },
// //   subjectLabel: {
// //     fontSize: 13,
// //     color: '#94A3B8',
// //     fontWeight: '600',
// //     textTransform: 'uppercase',
// //     letterSpacing: 0.5,
// //     marginBottom: 20,
// //   },

// //   // ── Empty state ──
// //   emptyState: {
// //     alignItems: 'center',
// //     paddingVertical: 32,
// //     gap: 12,
// //   },
// //   emptyEmoji: { fontSize: 48 },
// //   emptyTitle: { fontSize: 18, fontWeight: '800', color: '#0F172A' },
// //   generatingTitle: { fontSize: 16, fontWeight: '700', color: '#0F172A', marginTop: 4 },
// //   emptyDesc: {
// //     fontSize: 13,
// //     color: '#475569',
// //     textAlign: 'center',
// //     lineHeight: 20,
// //     paddingHorizontal: 8,
// //   },
// //   btnPrimary: {
// //     backgroundColor: '#1D4ED8',
// //     borderRadius: 9999,
// //     paddingHorizontal: 24,
// //     paddingVertical: 14,
// //     marginTop: 8,
// //     shadowColor: '#1D4ED8',
// //     shadowOffset: { width: 0, height: 6 },
// //     shadowOpacity: 0.3,
// //     shadowRadius: 14,
// //     elevation: 6,
// //   },
// //   btnPrimaryText: { fontSize: 14, fontWeight: '700', color: '#fff' },

// //   // ── Player card ──
// //   playerCard: {
// //     backgroundColor: '#1D4ED8',
// //     borderRadius: 20,
// //     padding: 20,
// //     marginBottom: 16,
// //     overflow: 'hidden',
// //     shadowColor: '#1D4ED8',
// //     shadowOffset: { width: 0, height: 8 },
// //     shadowOpacity: 0.3,
// //     shadowRadius: 16,
// //     elevation: 8,
// //   },
// //   glowCircle: {
// //     position: 'absolute',
// //     top: -40,
// //     right: -40,
// //     width: 140,
// //     height: 140,
// //     borderRadius: 70,
// //     backgroundColor: 'rgba(255,255,255,0.08)',
// //   },
// //   playerBadge: {
// //     backgroundColor: 'rgba(255,255,255,0.15)',
// //     borderRadius: 9999,
// //     paddingHorizontal: 12,
// //     paddingVertical: 4,
// //     alignSelf: 'flex-start',
// //     marginBottom: 10,
// //   },
// //   playerBadgeText: { fontSize: 11, fontWeight: '700', color: '#fff' },
// //   playerTitle: { fontSize: 20, fontWeight: '800', color: '#fff', marginBottom: 2 },
// //   playerDuration: { fontSize: 12, color: 'rgba(255,255,255,0.7)', marginBottom: 16 },

// //   progressTrack: {
// //     height: 4,
// //     backgroundColor: 'rgba(255,255,255,0.2)',
// //     borderRadius: 2,
// //     overflow: 'hidden',
// //     marginBottom: 6,
// //   },
// //   progressFill: { height: 4, backgroundColor: '#fff', borderRadius: 2 },
// //   timeRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 },
// //   timeText: { fontSize: 11, color: 'rgba(255,255,255,0.7)', fontWeight: '600' },

// //   controlsRow: {
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //     justifyContent: 'center',
// //     gap: 24,
// //     marginBottom: 14,
// //   },
// //   skipBtn: {
// //     paddingHorizontal: 10,
// //     paddingVertical: 6,
// //   },
// //   skipText: { fontSize: 13, color: 'rgba(255,255,255,0.85)', fontWeight: '700' },
// //   playBtn: {
// //     width: 56,
// //     height: 56,
// //     borderRadius: 28,
// //     backgroundColor: '#fff',
// //     alignItems: 'center',
// //     justifyContent: 'center',
// //   },
// //   playIcon: { fontSize: 22 },

// //   speedBtn: {
// //     alignSelf: 'center',
// //     backgroundColor: 'rgba(255,255,255,0.15)',
// //     borderRadius: 9999,
// //     paddingHorizontal: 16,
// //     paddingVertical: 6,
// //   },
// //   speedText: { fontSize: 12, fontWeight: '700', color: '#fff' },

// //   // ── Commute tip ──
// //   commuteTip: {
// //     backgroundColor: '#FFF7ED',
// //     borderRadius: 12,
// //     padding: 12,
// //     borderLeftWidth: 3,
// //     borderLeftColor: '#F97316',
// //     marginBottom: 16,
// //   },
// //   commuteTipTitle: { fontSize: 12, fontWeight: '700', color: '#9A3412', marginBottom: 2 },
// //   commuteTipText: { fontSize: 12, color: '#C2410C', lineHeight: 18 },

// //   // ── Script ──
// //   scriptCard: {
// //     backgroundColor: '#FFFFFF',
// //     borderRadius: 14,
// //     borderWidth: 1,
// //     borderColor: '#E2E8F0',
// //     padding: 14,
// //     marginBottom: 16,
// //   },
// //   scriptTitle: { fontSize: 13, fontWeight: '700', color: '#0F172A', marginBottom: 6 },
// //   scriptText: { fontSize: 13, color: '#475569', lineHeight: 20 },

// //   // ── Regenerate ──
// //   regenerateBtn: {
// //     borderWidth: 1.5,
// //     borderColor: '#1D4ED8',
// //     borderRadius: 9999,
// //     paddingVertical: 13,
// //     alignItems: 'center',
// //   },
// //   regenerateText: { fontSize: 13, fontWeight: '700', color: '#1D4ED8' },
// // });



// // ─── AILessonScreen.tsx ────────────────────────────────────────────
// import React, { useState, useRef, useEffect, useCallback } from 'react';
// import {
//   View, Text, TouchableOpacity, StyleSheet,
//   Animated, Alert, ScrollView, ActivityIndicator,
// } from 'react-native';
// import { SafeAreaView } from 'react-native-safe-area-context';
// import { useNavigation, useRoute, RouteProp, useFocusEffect } from '@react-navigation/native';
// import { NativeStackNavigationProp } from '@react-navigation/native-stack';
// import * as DocumentPicker from 'expo-document-picker';
// import { useAudioPlayer, useAudioPlayerStatus } from 'expo-audio';
// import { AppStackParamList } from '../../navigation/types';
// import {
//   getSubjectPodcast,
//   generateSubjectPodcast,
// } from '../../../config/client';

// type Nav   = NativeStackNavigationProp<AppStackParamList>;
// type Route = RouteProp<AppStackParamList, 'AILesson'>;

// const SPEEDS = [0.75, 1, 1.25, 1.5];

// export default function AILessonScreen() {
//   const navigation = useNavigation<Nav>();
//   const route      = useRoute<Route>();
//   const { subjectId, subjectName } = route.params;

//   const [loading, setLoading]       = useState(true);
//   const [generating, setGenerating] = useState(false);
//   const [podcast, setPodcast]       = useState<any>(null);

//   const [speed, setSpeed]           = useState(1);

//   // expo-audio player — source is the podcast URL once available
//   const player = useAudioPlayer(podcast?.podcastAudioUrl ?? null);
//   const status = useAudioPlayerStatus(player);

//   const isPlaying = status.playing;
//   const position  = status.currentTime ?? 0;
//   const duration  = status.duration ?? 0;

//   // ── Entrance animation ───────────────────────────────────────
//   const fadeAnim  = useRef(new Animated.Value(0)).current;
//   const slideAnim = useRef(new Animated.Value(30)).current;

//   useEffect(() => {
//     Animated.parallel([
//       Animated.timing(fadeAnim,  { toValue: 1, duration: 400, useNativeDriver: true }),
//       Animated.spring(slideAnim, { toValue: 0, tension: 65, friction: 10, useNativeDriver: true }),
//     ]).start();
//   }, []);

//   const load = async () => {
//     try {
//       const data = await getSubjectPodcast(subjectId);
//       if (data?.podcastAudioUrl) {
//         setPodcast(data);
//       }
//     } catch {
//       // no podcast yet — fine
//     } finally {
//       setLoading(false);
//     }
//   };

//   useFocusEffect(useCallback(() => { load(); }, [subjectId]));

//   // ── Pick file + generate ─────────────────────────────────────
//   const pickFileAndGenerate = async () => {
//     try {
//       const result = await DocumentPicker.getDocumentAsync({
//         type: ['application/pdf', 'image/jpeg', 'image/png', 'image/webp'],
//         copyToCacheDirectory: true,
//       });

//       if (result.canceled || !result.assets?.[0]) return;
//       const file = result.assets[0];

//       setGenerating(true);

//       const formData = new FormData();
//       formData.append('file', {
//         uri: file.uri,
//         name: file.name,
//         type: file.mimeType || 'application/pdf',
//       } as any);
//       formData.append('topic', subjectName);

//       const data = await generateSubjectPodcast(subjectId, formData);
//       setPodcast(data);

//       Alert.alert('AI Lesson ready!', 'Your audio lesson has been generated.');
//     } catch (err: any) {
//       Alert.alert('Generation failed', err?.message || 'Could not generate AI lesson. Try again.');
//     } finally {
//       setGenerating(false);
//     }
//   };

//   // ── Audio controls ───────────────────────────────────────────
//   const togglePlay = () => {
//     if (!podcast?.podcastAudioUrl) return;

//     if (isPlaying) {
//       player.pause();
//     } else {
//       // If finished, restart from beginning
//       if (status.didJustFinish || position >= duration - 0.5) {
//         player.seekTo(0);
//       }
//       player.play();
//     }
//   };

//   const changeSpeed = () => {
//     const currentIdx = SPEEDS.indexOf(speed);
//     const nextSpeed = SPEEDS[(currentIdx + 1) % SPEEDS.length];
//     setSpeed(nextSpeed);
//     player.setPlaybackRate(nextSpeed, 'high');
//   };

//   const skip = (seconds: number) => {
//     const newPos = Math.max(0, Math.min(duration, position + seconds));
//     player.seekTo(newPos);
//   };

//   const formatTime = (secs: number) => {
//     const m = Math.floor(secs / 60);
//     const s = Math.floor(secs % 60);
//     return `${m}:${s.toString().padStart(2, '0')}`;
//   };

//   const progressPct = duration > 0 ? (position / duration) * 100 : 0;

//   if (loading) {
//     return (
//       <SafeAreaView style={styles.safe}>
//         <View style={styles.center}>
//           <ActivityIndicator size="large" color="#1D4ED8" />
//         </View>
//       </SafeAreaView>
//     );
//   }

//   return (
//     <SafeAreaView style={styles.safe}>
//       <ScrollView
//         contentContainerStyle={styles.scroll}
//         showsVerticalScrollIndicator={false}
//       >
//         <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}>

//           {/* ── Header ── */}
//           <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backRow}>
//             <Text style={styles.backText}>← Back</Text>
//           </TouchableOpacity>

//           <Text style={styles.title}>AI Lesson</Text>
//           <Text style={styles.subjectLabel}>{subjectName}</Text>

//           {/* ── No podcast yet ── */}
//           {!podcast && !generating && (
//             <View style={styles.emptyState}>
//               <Text style={styles.emptyEmoji}>🎧</Text>
//               <Text style={styles.emptyTitle}>No AI lesson yet</Text>
//               <Text style={styles.emptyDesc}>
//                 Upload your lecture notes (PDF or image) and we'll turn them into
//                 a short audio lesson you can listen to anytime — even on your commute.
//               </Text>
//               <TouchableOpacity style={styles.btnPrimary} onPress={pickFileAndGenerate} activeOpacity={0.85}>
//                 <Text style={styles.btnPrimaryText}>📂 Upload Notes & Generate</Text>
//               </TouchableOpacity>
//             </View>
//           )}

//           {/* ── Generating ── */}
//           {generating && (
//             <View style={styles.emptyState}>
//               <ActivityIndicator size="large" color="#1D4ED8" />
//               <Text style={styles.generatingTitle}>Generating your lesson...</Text>
//               <Text style={styles.emptyDesc}>
//                 This usually takes 20-40 seconds. We're turning your notes into
//                 a spoken lesson.
//               </Text>
//             </View>
//           )}

//           {/* ── Podcast player ── */}
//           {podcast && !generating && (
//             <>
//               <View style={styles.playerCard}>
//                 <View style={styles.glowCircle} />

//                 <View style={styles.playerBadge}>
//                   <Text style={styles.playerBadgeText}>🎧 AI LESSON</Text>
//                 </View>

//                 <Text style={styles.playerTitle}>{subjectName}</Text>
//                 <Text style={styles.playerDuration}>
//                   {podcast.podcastDurationSeconds
//                     ? `~${Math.round(podcast.podcastDurationSeconds / 60)} min lesson`
//                     : 'Audio lesson'}
//                 </Text>

//                 {/* Progress bar */}
//                 <View style={styles.progressTrack}>
//                   <View style={[styles.progressFill, { width: `${progressPct}%` }]} />
//                 </View>
//                 <View style={styles.timeRow}>
//                   <Text style={styles.timeText}>{formatTime(position)}</Text>
//                   <Text style={styles.timeText}>{formatTime(duration)}</Text>
//                 </View>

//                 {/* Controls */}
//                 <View style={styles.controlsRow}>
//                   <TouchableOpacity onPress={() => skip(-10)} style={styles.skipBtn}>
//                     <Text style={styles.skipText}>⏮ 10s</Text>
//                   </TouchableOpacity>

//                   <TouchableOpacity onPress={togglePlay} style={styles.playBtn} activeOpacity={0.85}>
//                     <Text style={styles.playIcon}>{isPlaying ? '⏸' : '▶️'}</Text>
//                   </TouchableOpacity>

//                   <TouchableOpacity onPress={() => skip(10)} style={styles.skipBtn}>
//                     <Text style={styles.skipText}>10s ⏭</Text>
//                   </TouchableOpacity>
//                 </View>

//                 {/* Speed */}
//                 <TouchableOpacity onPress={changeSpeed} style={styles.speedBtn}>
//                   <Text style={styles.speedText}>{speed}x speed</Text>
//                 </TouchableOpacity>
//               </View>

//               {/* Commute tip */}
//               <View style={styles.commuteTip}>
//                 <Text style={styles.commuteTipTitle}>🎧 Great for commuting</Text>
//                 <Text style={styles.commuteTipText}>
//                   Listen to this lesson on your way to school. Your notes,
//                   read aloud — no need to look at your phone.
//                 </Text>
//               </View>

//               {/* Script preview */}
//               {podcast.podcastScript && (
//                 <View style={styles.scriptCard}>
//                   <Text style={styles.scriptTitle}>📝 Lesson Transcript</Text>
//                   <Text style={styles.scriptText} numberOfLines={8}>
//                     {podcast.podcastScript}
//                   </Text>
//                 </View>
//               )}

//               {/* Regenerate */}
//               <TouchableOpacity
//                 style={styles.regenerateBtn}
//                 onPress={pickFileAndGenerate}
//                 activeOpacity={0.8}
//               >
//                 <Text style={styles.regenerateText}>🔄 Generate from new notes</Text>
//               </TouchableOpacity>
//             </>
//           )}

//         </Animated.View>
//       </ScrollView>
//     </SafeAreaView>
//   );
// }

// const styles = StyleSheet.create({
//   safe:   { flex: 1, backgroundColor: '#F8FAFC' },
//   center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
//   scroll: { padding: 16, paddingBottom: 48 },

//   backRow:  { marginBottom: 8 },
//   backText: { fontSize: 14, color: '#1D4ED8', fontWeight: '600' },

//   title: {
//     fontSize: 28,
//     fontWeight: '800',
//     color: '#0F172A',
//     letterSpacing: -0.5,
//     marginBottom: 2,
//   },
//   subjectLabel: {
//     fontSize: 13,
//     color: '#94A3B8',
//     fontWeight: '600',
//     textTransform: 'uppercase',
//     letterSpacing: 0.5,
//     marginBottom: 20,
//   },

//   // ── Empty state ──
//   emptyState: {
//     alignItems: 'center',
//     paddingVertical: 32,
//     gap: 12,
//   },
//   emptyEmoji: { fontSize: 48 },
//   emptyTitle: { fontSize: 18, fontWeight: '800', color: '#0F172A' },
//   generatingTitle: { fontSize: 16, fontWeight: '700', color: '#0F172A', marginTop: 4 },
//   emptyDesc: {
//     fontSize: 13,
//     color: '#475569',
//     textAlign: 'center',
//     lineHeight: 20,
//     paddingHorizontal: 8,
//   },
//   btnPrimary: {
//     backgroundColor: '#1D4ED8',
//     borderRadius: 9999,
//     paddingHorizontal: 24,
//     paddingVertical: 14,
//     marginTop: 8,
//     shadowColor: '#1D4ED8',
//     shadowOffset: { width: 0, height: 6 },
//     shadowOpacity: 0.3,
//     shadowRadius: 14,
//     elevation: 6,
//   },
//   btnPrimaryText: { fontSize: 14, fontWeight: '700', color: '#fff' },

//   // ── Player card ──
//   playerCard: {
//     backgroundColor: '#1D4ED8',
//     borderRadius: 20,
//     padding: 20,
//     marginBottom: 16,
//     overflow: 'hidden',
//     shadowColor: '#1D4ED8',
//     shadowOffset: { width: 0, height: 8 },
//     shadowOpacity: 0.3,
//     shadowRadius: 16,
//     elevation: 8,
//   },
//   glowCircle: {
//     position: 'absolute',
//     top: -40,
//     right: -40,
//     width: 140,
//     height: 140,
//     borderRadius: 70,
//     backgroundColor: 'rgba(255,255,255,0.08)',
//   },
//   playerBadge: {
//     backgroundColor: 'rgba(255,255,255,0.15)',
//     borderRadius: 9999,
//     paddingHorizontal: 12,
//     paddingVertical: 4,
//     alignSelf: 'flex-start',
//     marginBottom: 10,
//   },
//   playerBadgeText: { fontSize: 11, fontWeight: '700', color: '#fff' },
//   playerTitle: { fontSize: 20, fontWeight: '800', color: '#fff', marginBottom: 2 },
//   playerDuration: { fontSize: 12, color: 'rgba(255,255,255,0.7)', marginBottom: 16 },

//   progressTrack: {
//     height: 4,
//     backgroundColor: 'rgba(255,255,255,0.2)',
//     borderRadius: 2,
//     overflow: 'hidden',
//     marginBottom: 6,
//   },
//   progressFill: { height: 4, backgroundColor: '#fff', borderRadius: 2 },
//   timeRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 },
//   timeText: { fontSize: 11, color: 'rgba(255,255,255,0.7)', fontWeight: '600' },

//   controlsRow: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//     gap: 24,
//     marginBottom: 14,
//   },
//   skipBtn: {
//     paddingHorizontal: 10,
//     paddingVertical: 6,
//   },
//   skipText: { fontSize: 13, color: 'rgba(255,255,255,0.85)', fontWeight: '700' },
//   playBtn: {
//     width: 56,
//     height: 56,
//     borderRadius: 28,
//     backgroundColor: '#fff',
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   playIcon: { fontSize: 22 },

//   speedBtn: {
//     alignSelf: 'center',
//     backgroundColor: 'rgba(255,255,255,0.15)',
//     borderRadius: 9999,
//     paddingHorizontal: 16,
//     paddingVertical: 6,
//   },
//   speedText: { fontSize: 12, fontWeight: '700', color: '#fff' },

//   // ── Commute tip ──
//   commuteTip: {
//     backgroundColor: '#FFF7ED',
//     borderRadius: 12,
//     padding: 12,
//     borderLeftWidth: 3,
//     borderLeftColor: '#F97316',
//     marginBottom: 16,
//   },
//   commuteTipTitle: { fontSize: 12, fontWeight: '700', color: '#9A3412', marginBottom: 2 },
//   commuteTipText: { fontSize: 12, color: '#C2410C', lineHeight: 18 },

//   // ── Script ──
//   scriptCard: {
//     backgroundColor: '#FFFFFF',
//     borderRadius: 14,
//     borderWidth: 1,
//     borderColor: '#E2E8F0',
//     padding: 14,
//     marginBottom: 16,
//   },
//   scriptTitle: { fontSize: 13, fontWeight: '700', color: '#0F172A', marginBottom: 6 },
//   scriptText: { fontSize: 13, color: '#475569', lineHeight: 20 },

//   // ── Regenerate ──
//   regenerateBtn: {
//     borderWidth: 1.5,
//     borderColor: '#1D4ED8',
//     borderRadius: 9999,
//     paddingVertical: 13,
//     alignItems: 'center',
//   },
//   regenerateText: { fontSize: 13, fontWeight: '700', color: '#1D4ED8' },
// });

// ─── AILessonScreen.tsx ────────────────────────────────────────────
// Library view: lists all AI Lessons (podcasts) generated for a subject.
import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet,
  Animated, Alert, FlatList, ActivityIndicator, TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp, useFocusEffect } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import * as DocumentPicker from 'expo-document-picker';
import { AppStackParamList } from '../../navigation/types';
import {
  getSubjectPodcasts,
  createSubjectPodcast,
  deletePodcast,
  renamePodcast,
  Podcast,
} from '../../../config/client';

type Nav   = NativeStackNavigationProp<AppStackParamList>;
type Route = RouteProp<AppStackParamList, 'AILesson'>;

export default function AILessonScreen() {
  const navigation = useNavigation<Nav>();
  const route      = useRoute<Route>();
  const { subjectId, subjectName } = route.params;

  const [podcasts, setPodcasts]     = useState<Podcast[]>([]);
  const [loading, setLoading]       = useState(true);
  const [generating, setGenerating] = useState(false);

  // Generate modal state
  const [showGenerateModal, setShowGenerateModal] = useState(false);
  const [pendingFile, setPendingFile] = useState<DocumentPicker.DocumentPickerAsset | null>(null);
  const [titleInput, setTitleInput]   = useState('');

  // Rename modal state
  const [renamingPodcast, setRenamingPodcast] = useState<Podcast | null>(null);
  const [renameInput, setRenameInput] = useState('');

  // ── Entrance animation ───────────────────────────────────────
  const fadeAnim  = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim,  { toValue: 1, duration: 400, useNativeDriver: true }),
      Animated.spring(slideAnim, { toValue: 0, tension: 65, friction: 10, useNativeDriver: true }),
    ]).start();
  }, []);

  const load = async () => {
    try {
      const data = await getSubjectPodcasts(subjectId);
      setPodcasts(Array.isArray(data) ? data : []);
    } catch {
      setPodcasts([]);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(useCallback(() => { load(); }, [subjectId]));

  // ── Step 1: pick file ────────────────────────────────────────
  const pickFile = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['application/pdf', 'image/jpeg', 'image/png', 'image/webp'],
        copyToCacheDirectory: true,
      });

      if (result.canceled || !result.assets?.[0]) return;

      setPendingFile(result.assets[0]);
      setTitleInput('');
      setShowGenerateModal(true);
    } catch {
      Alert.alert('Error', 'Could not open file picker.');
    }
  };

  // ── Step 2: confirm generate ─────────────────────────────────
  const confirmGenerate = async () => {
    if (!pendingFile) return;

    setShowGenerateModal(false);
    setGenerating(true);

    try {
      const formData = new FormData();
      formData.append('file', {
        uri: pendingFile.uri,
        name: pendingFile.name,
        type: pendingFile.mimeType || 'application/pdf',
      } as any);

      const title = titleInput.trim() || subjectName;
      formData.append('title', title);

      const podcast = await createSubjectPodcast(subjectId, formData);
      setPodcasts(prev => [podcast, ...prev]);

      Alert.alert('AI Lesson ready!', `"${podcast.title}" has been generated.`);
    } catch (err: any) {
      Alert.alert('Generation failed', err?.message || 'Could not generate AI lesson. Try again.');
    } finally {
      setGenerating(false);
      setPendingFile(null);
    }
  };

  // ── Rename ────────────────────────────────────────────────────
  const openRename = (podcast: Podcast) => {
    setRenamingPodcast(podcast);
    setRenameInput(podcast.title);
  };

  const confirmRename = async () => {
    if (!renamingPodcast) return;
    const newTitle = renameInput.trim();
    if (!newTitle) return;

    try {
      const updated = await renamePodcast(renamingPodcast._id, newTitle);
      setPodcasts(prev => prev.map(p => (p._id === updated._id ? updated : p)));
    } catch {
      Alert.alert('Error', 'Could not rename. Try again.');
    } finally {
      setRenamingPodcast(null);
    }
  };

  // ── Delete ────────────────────────────────────────────────────
  const handleDelete = (podcast: Podcast) => {
    Alert.alert(
      'Delete lesson?',
      `"${podcast.title}" will be permanently deleted.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deletePodcast(podcast._id);
              setPodcasts(prev => prev.filter(p => p._id !== podcast._id));
            } catch {
              Alert.alert('Error', 'Could not delete. Try again.');
            }
          },
        },
      ]
    );
  };

  // ── Long press menu ───────────────────────────────────────────
  const showOptions = (podcast: Podcast) => {
    Alert.alert(
      podcast.title,
      'What would you like to do?',
      [
        { text: 'Rename', onPress: () => openRename(podcast) },
        { text: 'Delete', style: 'destructive', onPress: () => handleDelete(podcast) },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

  const formatDuration = (secs: number) => {
    const m = Math.round(secs / 60);
    return m <= 1 ? '~1 min' : `~${m} min`;
  };

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-NG', { day: 'numeric', month: 'short' });
  };

  // ── Render podcast card ──────────────────────────────────────
  const renderItem = ({ item }: { item: Podcast }) => (
    <TouchableOpacity
      style={styles.podcastCard}
      activeOpacity={0.8}
      onPress={() => navigation.navigate('PodcastPlayer', { podcastId: item._id, subjectName })}
      onLongPress={() => showOptions(item)}
    >
      <View style={styles.podcastIconWrap}>
        <Text style={styles.podcastIcon}>🎧</Text>
      </View>
      <View style={{ flex: 1 }}>
        <Text style={styles.podcastTitle} numberOfLines={1}>{item.title}</Text>
        <Text style={styles.podcastMeta}>
          {formatDuration(item.durationSeconds)} · {formatDate(item.createdAt)}
        </Text>
      </View>
      <TouchableOpacity onPress={() => showOptions(item)} style={styles.moreBtn}>
        <Text style={styles.moreBtnText}>⋯</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#1D4ED8" />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <Animated.View style={[styles.container, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>

        {/* ── Header ── */}
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backRow}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>

        <View style={styles.headerRow}>
          <View>
            <Text style={styles.title}>AI Lessons</Text>
            <Text style={styles.subjectLabel}>{subjectName}</Text>
          </View>
          <TouchableOpacity
            style={styles.addBtn}
            onPress={pickFile}
            activeOpacity={0.85}
            disabled={generating}
          >
            <Text style={styles.addBtnText}>{generating ? '...' : '+ New'}</Text>
          </TouchableOpacity>
        </View>

        {/* ── Generating banner ── */}
        {generating && (
          <View style={styles.generatingBanner}>
            <ActivityIndicator size="small" color="#1D4ED8" />
            <Text style={styles.generatingText}>
              Generating your lesson... this takes 20-40 seconds.
            </Text>
          </View>
        )}

        {/* ── List or empty state ── */}
        {podcasts.length === 0 && !generating ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyEmoji}>🎧</Text>
            <Text style={styles.emptyTitle}>No AI lessons yet</Text>
            <Text style={styles.emptyDesc}>
              Upload your lecture notes (PDF or image) and we'll turn them into
              short audio lessons you can listen to anytime — even on your commute.
            </Text>
            <TouchableOpacity style={styles.btnPrimary} onPress={pickFile} activeOpacity={0.85}>
              <Text style={styles.btnPrimaryText}>📂 Upload Notes & Generate</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <FlatList
            data={podcasts}
            keyExtractor={(item) => item._id}
            renderItem={renderItem}
            contentContainerStyle={{ paddingBottom: 24, gap: 10 }}
            showsVerticalScrollIndicator={false}
          />
        )}

        {/* ── Commute tip ── */}
        {podcasts.length > 0 && (
          <View style={styles.commuteTip}>
            <Text style={styles.commuteTipTitle}>🎧 Great for commuting</Text>
            <Text style={styles.commuteTipText}>
              Tap any lesson to listen — your notes, read aloud.
            </Text>
          </View>
        )}

      </Animated.View>

      {/* ── Generate modal ── */}
      {showGenerateModal && (
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Name this lesson</Text>
            <Text style={styles.modalDesc}>
              Give your AI lesson a title, or leave blank to use "{subjectName}".
            </Text>
            <TextInput
              style={styles.modalInput}
              placeholder={subjectName}
              placeholderTextColor="#94A3B8"
              value={titleInput}
              onChangeText={setTitleInput}
              autoFocus
            />
            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.modalCancelBtn}
                onPress={() => { setShowGenerateModal(false); setPendingFile(null); }}
              >
                <Text style={styles.modalCancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalConfirmBtn} onPress={confirmGenerate}>
                <Text style={styles.modalConfirmText}>Generate</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}

      {/* ── Rename modal ── */}
      {renamingPodcast && (
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Rename lesson</Text>
            <TextInput
              style={styles.modalInput}
              value={renameInput}
              onChangeText={setRenameInput}
              autoFocus
            />
            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.modalCancelBtn} onPress={() => setRenamingPodcast(null)}>
                <Text style={styles.modalCancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalConfirmBtn} onPress={confirmRename}>
                <Text style={styles.modalConfirmText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe:   { flex: 1, backgroundColor: '#F8FAFC' },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  container: { flex: 1, padding: 16 },

  backRow:  { marginBottom: 8 },
  backText: { fontSize: 14, color: '#1D4ED8', fontWeight: '600' },

  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: -0.5,
    marginBottom: 2,
  },
  subjectLabel: {
    fontSize: 12,
    color: '#94A3B8',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  addBtn: {
    backgroundColor: '#1D4ED8',
    borderRadius: 9999,
    paddingHorizontal: 18,
    paddingVertical: 10,
  },
  addBtnText: { fontSize: 13, fontWeight: '700', color: '#fff' },

  // ── Generating banner ──
  generatingBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#EFF6FF',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#BFDBFE',
  },
  generatingText: { fontSize: 12, color: '#1D4ED8', fontWeight: '600', flex: 1 },

  // ── Empty state ──
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    paddingBottom: 80,
  },
  emptyEmoji: { fontSize: 48 },
  emptyTitle: { fontSize: 18, fontWeight: '800', color: '#0F172A' },
  emptyDesc: {
    fontSize: 13,
    color: '#475569',
    textAlign: 'center',
    lineHeight: 20,
    paddingHorizontal: 8,
  },
  btnPrimary: {
    backgroundColor: '#1D4ED8',
    borderRadius: 9999,
    paddingHorizontal: 24,
    paddingVertical: 14,
    marginTop: 8,
    shadowColor: '#1D4ED8',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 14,
    elevation: 6,
  },
  btnPrimaryText: { fontSize: 14, fontWeight: '700', color: '#fff' },

  // ── Podcast card ──
  podcastCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  podcastIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#FFF7ED',
    alignItems: 'center',
    justifyContent: 'center',
  },
  podcastIcon: { fontSize: 20 },
  podcastTitle: { fontSize: 14, fontWeight: '700', color: '#0F172A', marginBottom: 2 },
  podcastMeta: { fontSize: 11, color: '#94A3B8', fontWeight: '600' },
  moreBtn: { padding: 6 },
  moreBtnText: { fontSize: 18, color: '#94A3B8', fontWeight: '800' },

  // ── Commute tip ──
  commuteTip: {
    backgroundColor: '#FFF7ED',
    borderRadius: 12,
    padding: 12,
    borderLeftWidth: 3,
    borderLeftColor: '#F97316',
    marginTop: 12,
  },
  commuteTipTitle: { fontSize: 12, fontWeight: '700', color: '#9A3412', marginBottom: 2 },
  commuteTipText: { fontSize: 12, color: '#C2410C', lineHeight: 18 },

  // ── Modal ──
  modalOverlay: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(15,23,42,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  modalCard: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 20,
    gap: 8,
  },
  modalTitle: { fontSize: 16, fontWeight: '800', color: '#0F172A' },
  modalDesc: { fontSize: 12, color: '#64748B', lineHeight: 18, marginBottom: 4 },
  modalInput: {
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: '#0F172A',
    marginBottom: 8,
  },
  modalActions: { flexDirection: 'row', gap: 8 },
  modalCancelBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 9999,
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
  },
  modalCancelText: { fontSize: 13, fontWeight: '700', color: '#475569' },
  modalConfirmBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 9999,
    alignItems: 'center',
    backgroundColor: '#1D4ED8',
  },
  modalConfirmText: { fontSize: 13, fontWeight: '700', color: '#fff' },
});