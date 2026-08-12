

// // // ─── DrillSubjectScreen.tsx ───────────────────────────────────────
// // import React, { useEffect, useState, useCallback } from 'react';
// // import {
// //   View, Text, ScrollView, TouchableOpacity,
// //   StyleSheet, Alert, RefreshControl,
// // } from 'react-native';
// // import { SafeAreaView } from 'react-native-safe-area-context';
// // import { useNavigation, useRoute, RouteProp, useFocusEffect } from '@react-navigation/native';
// // import { NativeStackNavigationProp } from '@react-navigation/native-stack';
// // import { AppStackParamList } from '../../navigation/types';
// // import { Colors, FontSize, Radius, Spacing, Shadows } from '../../theme';
// // import CCCard from '../../components/CCCard';
// // import CCLoader from '../../components/CCLoader';
// // import { getSubject, getDrillStats } from "../../../config/client" 

// // type Nav   = NativeStackNavigationProp<AppStackParamList>;
// // type Route = RouteProp<AppStackParamList, 'DrillSubject'>;

// // export default function DrillSubjectScreen() {
// //   const navigation = useNavigation<Nav>();
// //   const route      = useRoute<Route>();
// //   const { subjectId, subjectName } = route.params;

// //   const [subject, setSubject]   = useState<any>(null);
// //   const [stats, setStats]       = useState<any>(null);
// //   const [loading, setLoading]   = useState(true);
// //   const [refreshing, setRefreshing] = useState(false);

// //   const load = async () => {
// //     try {
// //       const [s, st] = await Promise.all([
// //         getSubject(subjectId),
// //         getDrillStats(subjectId),
// //       ]);
// //       setSubject(s);
// //       setStats(st);
// //     } catch {
// //       Alert.alert('Error', 'Could not load subject');
// //     }
// //   };

// //   useFocusEffect(useCallback(() => {
// //     load().finally(() => setLoading(false));
// //   }, [subjectId]));

// //   const onRefresh = async () => {
// //     setRefreshing(true);
// //     await load();
// //     setRefreshing(false);
// //   };

// //   const startSession = (mode: 'practice' | 'exam' | 'weak') => {
// //     if ((subject?.totalQuestions ?? 0) === 0) {
// //       return Alert.alert('No questions', 'Add questions to this subject first before starting a session.');
// //     }
// //     if (mode === 'weak' && (subject?.weakCount ?? 0) === 0) {
// //       return Alert.alert('No weak questions', 'Keep practicing and weak questions will appear here automatically.');
// //     }
// //     navigation.navigate('DrillSession', { subjectId, subjectName, mode });
// //   };

// //   const startFlashcards = () => {
// //     if ((subject?.totalQuestions ?? 0) === 0) {
// //       return Alert.alert('No questions', 'Add questions to this subject first before using flashcards.');
// //     }
// //     navigation.navigate('Flashcard', { subjectId, subjectName });
// //   };

// //   if (loading) return <CCLoader />;

// //   const recentSessions = subject?.sessions?.slice(0, 5) ?? [];

// //   return (
// //     <SafeAreaView style={styles.safe}>
// //       <ScrollView
// //         contentContainerStyle={styles.scroll}
// //         showsVerticalScrollIndicator={false}
// //         refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Colors.brand} />}
// //       >
// //         {/* Header */}
// //         <View style={styles.header}>
// //           <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
// //             <Text style={styles.backText}>← Back</Text>
// //           </TouchableOpacity>
// //           <TouchableOpacity
// //             onPress={() => navigation.navigate('DrillAddQuestions', { subjectId, subjectName })}
// //             style={styles.addBtn}
// //           >
// //             <Text style={styles.addBtnText}>+ Add</Text>
// //           </TouchableOpacity>
// //         </View>

// //         <Text style={styles.subjectName}>{subjectName}</Text>

// //         {/* Stats row */}
// //         <View style={styles.statsRow}>
// //           <View style={styles.statBox}>
// //             <Text style={styles.statNum}>{subject?.totalQuestions ?? 0}</Text>
// //             <Text style={styles.statLabel}>Questions</Text>
// //           </View>
// //           <View style={styles.statBox}>
// //             <Text style={styles.statNum}>{stats?.avgScore ?? 0}/10</Text>
// //             <Text style={styles.statLabel}>Avg score</Text>
// //           </View>
// //           <View style={styles.statBox}>
// //             <Text style={styles.statNum}>{stats?.bestScore ?? 0}/10</Text>
// //             <Text style={styles.statLabel}>Best</Text>
// //           </View>
// //           <View style={styles.statBox}>
// //             <Text style={styles.statNum}>{stats?.totalSessions ?? 0}</Text>
// //             <Text style={styles.statLabel}>Sessions</Text>
// //           </View>
// //         </View>

// //         {/* Mode buttons */}
// //         <Text style={styles.sectionTitle}>Start a session</Text>

// //         <TouchableOpacity style={styles.modeCard} onPress={startFlashcards} activeOpacity={0.8}>
// //           <View style={[styles.modeIcon, { backgroundColor: '#EDE9FE' }]}>
// //             <Text style={{ fontSize: 24 }}>🃏</Text>
// //           </View>
// //           <View style={{ flex: 1 }}>
// //             <Text style={styles.modeTitle}>Flashcard Mode</Text>
// //             <Text style={styles.modeDesc}>Review cards. Swipe Easy or Missed. Spaced repetition.</Text>
// //           </View>
// //           <Text style={styles.arrow}>→</Text>
// //         </TouchableOpacity>

// //         <TouchableOpacity
// //           style={styles.modeCard}
// //           onPress={() => navigation.navigate('AILesson', { subjectId, subjectName })}
// //           activeOpacity={0.8}
// //         >
// //           <View style={[styles.modeIcon, { backgroundColor: '#FFF7ED' }]}>
// //             <Text style={{ fontSize: 24 }}>🎧</Text>
// //           </View>
// //           <View style={{ flex: 1 }}>
// //             <Text style={styles.modeTitle}>AI Lesson</Text>
// //             <Text style={styles.modeDesc}>Listen to your notes as an audio lesson</Text>
// //           </View>
// //           <Text style={styles.arrow}>→</Text>
// //         </TouchableOpacity>

// //         <TouchableOpacity
// //           style={styles.modeCard}
// //           onPress={() => navigation.navigate('WhiteboardLibrary', { subjectId, subjectName })}
// //           activeOpacity={0.8}
// //         >
// //           <View style={[styles.modeIcon, { backgroundColor: '#FEF3C7' }]}>
// //             <Text style={{ fontSize: 24 }}>🎬</Text>
// //           </View>
// //           <View style={{ flex: 1 }}>
// //             <Text style={styles.modeTitle}>Whiteboard Video</Text>
// //             <Text style={styles.modeDesc}>AI-animated explainer videos — turn any topic into a narrated lesson</Text>
// //           </View>
// //           <Text style={styles.arrow}>→</Text>
// //         </TouchableOpacity>

// //         <TouchableOpacity style={styles.modeCard} onPress={() => startSession('practice')} activeOpacity={0.8}>
// //           <View style={[styles.modeIcon, { backgroundColor: '#EEF2FF' }]}>
// //             <Text style={{ fontSize: 24 }}>📚</Text>
// //           </View>
// //           <View style={{ flex: 1 }}>
// //             <Text style={styles.modeTitle}>Practice Mode</Text>
// //             <Text style={styles.modeDesc}>No timer. Instant feedback after each question.</Text>
// //           </View>
// //           <Text style={styles.arrow}>→</Text>
// //         </TouchableOpacity>

// //         <TouchableOpacity style={styles.modeCard} onPress={() => startSession('exam')} activeOpacity={0.8}>
// //           <View style={[styles.modeIcon, { backgroundColor: '#FFF7ED' }]}>
// //             <Text style={{ fontSize: 24 }}>⏱️</Text>
// //           </View>
// //           <View style={{ flex: 1 }}>
// //             <Text style={styles.modeTitle}>Exam Mode</Text>
// //             <Text style={styles.modeDesc}>Timed. No feedback until end. Real exam pressure.</Text>
// //           </View>
// //           <Text style={styles.arrow}>→</Text>
// //         </TouchableOpacity>

// //         <TouchableOpacity
// //           style={[styles.modeCard, (subject?.weakCount ?? 0) === 0 && styles.modeCardDisabled]}
// //           onPress={() => startSession('weak')}
// //           activeOpacity={0.8}
// //         >
// //           <View style={[styles.modeIcon, { backgroundColor: '#FEF3C7' }]}>
// //             <Text style={{ fontSize: 24 }}>⚠️</Text>
// //           </View>
// //           <View style={{ flex: 1 }}>
// //             <Text style={styles.modeTitle}>
// //               Weak Questions {subject?.weakCount > 0 ? `(${subject.weakCount})` : ''}
// //             </Text>
// //             <Text style={styles.modeDesc}>
// //               {(subject?.weakCount ?? 0) === 0
// //                 ? 'Practice more to identify your weak spots'
// //                 : 'Drill only the questions you keep getting wrong'}
// //             </Text>
// //           </View>
// //           <Text style={styles.arrow}>→</Text>
// //         </TouchableOpacity>

// //         {/* Recent sessions */}
// //         {recentSessions.length > 0 && (
// //           <>
// //             <Text style={styles.sectionTitle}>Recent sessions</Text>
// //             <CCCard>
// //               {recentSessions.map((s: any, i: number) => (
// //                 <View key={s._id} style={[styles.sessionRow, i > 0 && styles.sessionBorder]}>
// //                   <View>
// //                     <Text style={styles.sessionMode}>{s.mode} mode</Text>
// //                     <Text style={styles.sessionDate}>
// //                       {new Date(s.completedAt).toLocaleDateString('en-NG', { day: 'numeric', month: 'short' })}
// //                     </Text>
// //                   </View>
// //                   <Text style={[styles.sessionScore, { color: s.score >= 7 ? '#059669' : s.score >= 5 ? Colors.brand : '#DC2626' }]}>
// //                     {s.score}/10
// //                   </Text>
// //                 </View>
// //               ))}
// //             </CCCard>
// //           </>
// //         )}
// //       </ScrollView>
// //     </SafeAreaView>
// //   );
// // }

// // const styles = StyleSheet.create({
// //   safe:   { flex: 1, backgroundColor: Colors.background },
// //   scroll: { padding: Spacing.lg, paddingBottom: Spacing['5xl'] },
// //   header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: Spacing.lg },
// //   backBtn: { paddingVertical: 4 },
// //   backText: { fontSize: FontSize.body, color: Colors.brand, fontWeight: '600' },
// //   addBtn: { backgroundColor: Colors.brand, paddingHorizontal: 16, paddingVertical: 8, borderRadius: Radius.full },
// //   addBtnText: { fontSize: FontSize.body, fontWeight: '700', color: '#fff' },
// //   subjectName: { fontSize: FontSize.displayL, fontWeight: '800', color: Colors.textPrimary, marginBottom: Spacing['2xl'] },
// //   statsRow: { flexDirection: 'row', gap: 8, marginBottom: Spacing['2xl'] },
// //   statBox: { flex: 1, backgroundColor: Colors.surface, borderRadius: Radius.md, padding: 10, alignItems: 'center', borderWidth: 1, borderColor: Colors.border },
// //   statNum: { fontSize: FontSize.heading2, fontWeight: '800', color: Colors.textPrimary },
// //   statLabel: { fontSize: FontSize.micro, color: Colors.textMuted, marginTop: 2 },
// //   sectionTitle: { fontSize: FontSize.heading3, fontWeight: '700', color: Colors.textPrimary, marginBottom: Spacing.md, marginTop: Spacing.sm },
// //   modeCard: { backgroundColor: Colors.surface, borderRadius: Radius.xl, padding: Spacing.lg, marginBottom: Spacing.md, flexDirection: 'row', alignItems: 'center', gap: Spacing.md, borderWidth: 1, borderColor: Colors.border, ...Shadows.sm },
// //   modeCardDisabled: { opacity: 0.5 },
// //   modeIcon: { width: 52, height: 52, borderRadius: Radius.md, alignItems: 'center', justifyContent: 'center' },
// //   modeTitle: { fontSize: FontSize.bodyLarge, fontWeight: '700', color: Colors.textPrimary, marginBottom: 2 },
// //   modeDesc: { fontSize: FontSize.bodySmall, color: Colors.textSecondary, lineHeight: 18 },
// //   arrow: { fontSize: 18, color: Colors.textMuted },
// //   sessionRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 10 },
// //   sessionBorder: { borderTopWidth: 1, borderTopColor: Colors.border },
// //   sessionMode: { fontSize: FontSize.body, fontWeight: '600', color: Colors.textPrimary, textTransform: 'capitalize' },
// //   sessionDate: { fontSize: FontSize.caption, color: Colors.textMuted, marginTop: 2 },
// //   sessionScore: { fontSize: FontSize.heading2, fontWeight: '800' },
// // }); 

// // ─── DrillSubjectScreen.tsx ──────────────────────────────────────
// import React, { useState, useCallback, useRef } from 'react';
// import {
//   View, Text, ScrollView, TouchableOpacity, StyleSheet,
//   Alert, RefreshControl, Modal, TextInput, KeyboardAvoidingView,
//   Platform, FlatList, ActivityIndicator, Pressable,
// } from 'react-native';
// import { SafeAreaView } from 'react-native-safe-area-context';
// import { useNavigation, useRoute, RouteProp, useFocusEffect } from '@react-navigation/native';
// import { NativeStackNavigationProp } from '@react-navigation/native-stack';
// import Svg, { Path, Circle, Rect } from 'react-native-svg';
// import { AppStackParamList } from '../../navigation/types';
// import { Colors, FontSize, Radius, Spacing, Shadows } from '../../theme';
// import CCLoader from '../../components/CCLoader';
// import { getSubject, getDrillStats } from '../../../config/client';

// type Nav   = NativeStackNavigationProp<AppStackParamList>;
// type Route = RouteProp<AppStackParamList, 'DrillSubject'>;

// // ── Chat message type ─────────────────────────────────────────────
// interface ChatMessage {
//   id: string;
//   role: 'user' | 'ai';
//   text: string;
// }

// // ── SVG Icons ─────────────────────────────────────────────────────
// function BackIcon() {
//   return (
//     <Svg width={18} height={18} viewBox="0 0 24 24" fill="none"
//       stroke="#1D4ED8" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
//       <Path d="m15 18-6-6 6-6" />
//     </Svg>
//   );
// }

// function UploadIcon() {
//   return (
//     <Svg width={18} height={18} viewBox="0 0 24 24" fill="none"
//       stroke="#fff" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
//       <Path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
//       <Path d="m17 8-5-5-5 5" />
//       <Path d="M12 3v12" />
//     </Svg>
//   );
// }

// function ChatIcon({ color = '#fff' }: { color?: string }) {
//   return (
//     <Svg width={18} height={18} viewBox="0 0 24 24" fill="none"
//       stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
//       <Path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
//     </Svg>
//   );
// }

// function SendIcon() {
//   return (
//     <Svg width={18} height={18} viewBox="0 0 24 24" fill="none"
//       stroke="#fff" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
//       <Path d="m22 2-7 20-4-9-9-4Z" />
//       <Path d="M22 2 11 13" />
//     </Svg>
//   );
// }

// function CloseIcon() {
//   return (
//     <Svg width={20} height={20} viewBox="0 0 24 24" fill="none"
//       stroke="#64748B" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
//       <Path d="M18 6 6 18M6 6l12 12" />
//     </Svg>
//   );
// }

// function SparkleIcon() {
//   return (
//     <Svg width={16} height={16} viewBox="0 0 24 24" fill="none"
//       stroke="#6366F1" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
//       <Path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
//     </Svg>
//   );
// }

// // ── Main Screen ───────────────────────────────────────────────────
// export default function DrillSubjectScreen() {
//   const navigation = useNavigation<Nav>();
//   const route      = useRoute<Route>();
//   const { subjectId, subjectName } = route.params;

//   const [subject, setSubject]       = useState<any>(null);
//   const [stats, setStats]           = useState<any>(null);
//   const [loading, setLoading]       = useState(true);
//   const [refreshing, setRefreshing] = useState(false);

//   // Chat state
//   const [chatOpen, setChatOpen]     = useState(false);
//   const [messages, setMessages]     = useState<ChatMessage[]>([]);
//   const [inputText, setInputText]   = useState('');
//   const [aiLoading, setAiLoading]   = useState(false);
//   const flatListRef                 = useRef<FlatList>(null);

//   const load = async () => {
//     try {
//       const [s, st] = await Promise.all([
//         getSubject(subjectId),
//         getDrillStats(subjectId),
//       ]);
//       setSubject(s);
//       setStats(st);
//     } catch {
//       Alert.alert('Error', 'Could not load course');
//     }
//   };

//   useFocusEffect(useCallback(() => {
//     load().finally(() => setLoading(false));
//   }, [subjectId]));

//   const onRefresh = async () => {
//     setRefreshing(true);
//     await load();
//     setRefreshing(false);
//   };

//   const startSession = (mode: 'practice' | 'exam' | 'weak') => {
//     if ((subject?.totalQuestions ?? 0) === 0) {
//       return Alert.alert('No questions', 'Upload questions to this course first.');
//     }
//     if (mode === 'weak' && (subject?.weakCount ?? 0) === 0) {
//       return Alert.alert('No weak questions', 'Keep practicing and weak questions will appear here automatically.');
//     }
//     navigation.navigate('DrillSession', { subjectId, subjectName, mode });
//   };

//   const startFlashcards = () => {
//     if ((subject?.totalQuestions ?? 0) === 0) {
//       return Alert.alert('No questions', 'Upload questions to this course first.');
//     }
//     navigation.navigate('Flashcard', { subjectId, subjectName });
//   };

//   // ── Chat ─────────────────────────────────────────────────────────
//   const sendMessage = async () => {
//     const text = inputText.trim();
//     if (!text || aiLoading) return;

//     const userMsg: ChatMessage = { id: Date.now().toString(), role: 'user', text };
//     setMessages((prev) => [...prev, userMsg]);
//     setInputText('');
//     setAiLoading(true);

//     setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);

//     try {
//       const response = await fetch('https://api.anthropic.com/v1/messages', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({
//           model: 'claude-sonnet-4-6',
//           max_tokens: 1000,
//           system: `You are a helpful study tutor for the course "${subjectName}". 
// The student is studying this subject and may ask you to explain concepts, 
// quiz them, or help them understand questions they got wrong. 
// Be concise, clear, and encouraging. Use simple language.`,
//           messages: [
//             ...messages.map((m) => ({ role: m.role === 'user' ? 'user' : 'assistant', content: m.text })),
//             { role: 'user', content: text },
//           ],
//         }),
//       });

//       const data = await response.json();
//       const aiText = data?.content?.[0]?.text ?? 'Sorry, I could not respond. Try again.';

//       const aiMsg: ChatMessage = { id: (Date.now() + 1).toString(), role: 'ai', text: aiText };
//       setMessages((prev) => [...prev, aiMsg]);
//       setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);
//     } catch {
//       const errMsg: ChatMessage = {
//         id: (Date.now() + 1).toString(),
//         role: 'ai',
//         text: 'Something went wrong. Check your connection and try again.',
//       };
//       setMessages((prev) => [...prev, errMsg]);
//     } finally {
//       setAiLoading(false);
//     }
//   };

//   if (loading) return <CCLoader />;

//   const recentSessions = subject?.sessions?.slice(0, 5) ?? [];
//   const readiness      = stats?.bestScore != null ? Math.round((stats.bestScore / 10) * 100) : 0;
//   const readinessColor = readiness >= 70 ? '#059669' : readiness >= 40 ? '#1D4ED8' : '#DC2626';

//   return (
//     <SafeAreaView style={styles.safe}>
//       <ScrollView
//         contentContainerStyle={styles.scroll}
//         showsVerticalScrollIndicator={false}
//         refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Colors.brand} />}
//       >
//         {/* ── Header ── */}
//         <View style={styles.header}>
//           <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
//             <BackIcon />
//             <Text style={styles.backText}>My Courses</Text>
//           </TouchableOpacity>
//           <TouchableOpacity
//             style={styles.uploadBtn}
//             onPress={() => navigation.navigate('DrillAddQuestions', { subjectId, subjectName })}
//           >
//             <UploadIcon />
//             <Text style={styles.uploadBtnText}>Upload</Text>
//           </TouchableOpacity>
//         </View>

//         {/* ── Course name ── */}
//         <View style={styles.heroWrap}>
//           <Text style={styles.courseLabel}>COURSE</Text>
//           <Text style={styles.courseName}>{subjectName}</Text>

//           {/* Stats row */}
//           <View style={styles.statsRow}>
//             <View style={styles.statBox}>
//               <Text style={styles.statNum}>{subject?.totalQuestions ?? 0}</Text>
//               <Text style={styles.statLabel}>Questions</Text>
//             </View>
//             <View style={styles.statBox}>
//               <Text style={styles.statNum}>{stats?.avgScore ?? 0}/10</Text>
//               <Text style={styles.statLabel}>Avg score</Text>
//             </View>
//             <View style={styles.statBox}>
//               <Text style={styles.statNum}>{stats?.bestScore ?? 0}/10</Text>
//               <Text style={styles.statLabel}>Best</Text>
//             </View>
//             <View style={styles.statBox}>
//               <Text style={styles.statNum}>{stats?.totalSessions ?? 0}</Text>
//               <Text style={styles.statLabel}>Sessions</Text>
//             </View>
//           </View>

//           {/* Readiness bar */}
//           <View style={styles.readinessWrap}>
//             <View style={styles.readinessRow}>
//               <Text style={styles.readinessLabel}>Readiness</Text>
//               <Text style={[styles.readinessPct, { color: readinessColor }]}>{readiness}%</Text>
//             </View>
//             <View style={styles.readinessTrack}>
//               <View style={[styles.readinessFill, { width: `${readiness}%`, backgroundColor: readinessColor }]} />
//             </View>
//           </View>
//         </View>

//         {/* ── STUDY section ── */}
//         <Text style={styles.sectionLabel}>STUDY</Text>
//         <View style={styles.grid}>
//           <TouchableOpacity style={styles.gridCard} onPress={startFlashcards} activeOpacity={0.75}>
//             <View style={[styles.gridIcon, { backgroundColor: '#EDE9FE' }]}>
//               <Text style={styles.gridEmoji}>🃏</Text>
//             </View>
//             <Text style={styles.gridTitle}>Flashcards</Text>
//             <Text style={styles.gridDesc}>Spaced repetition review</Text>
//           </TouchableOpacity>

//           <TouchableOpacity
//             style={styles.gridCard}
//             onPress={() => navigation.navigate('AILesson', { subjectId, subjectName })}
//             activeOpacity={0.75}
//           >
//             <View style={[styles.gridIcon, { backgroundColor: '#FFF7ED' }]}>
//               <Text style={styles.gridEmoji}>🎧</Text>
//             </View>
//             <Text style={styles.gridTitle}>AI Lesson</Text>
//             <Text style={styles.gridDesc}>Listen while you commute</Text>
//           </TouchableOpacity>

//           <TouchableOpacity
//             style={styles.gridCard}
//             onPress={() => navigation.navigate('WhiteboardLibrary', { subjectId, subjectName })}
//             activeOpacity={0.75}
//           >
//             <View style={[styles.gridIcon, { backgroundColor: '#FEF3C7' }]}>
//               <Text style={styles.gridEmoji}>🎬</Text>
//             </View>
//             <Text style={styles.gridTitle}>Whiteboard</Text>
//             <Text style={styles.gridDesc}>Animated explainer video</Text>
//           </TouchableOpacity>

//           <TouchableOpacity
//             style={[styles.gridCard, { borderColor: '#C7D2FE', backgroundColor: '#F5F7FF' }]}
//             onPress={() => setChatOpen(true)}
//             activeOpacity={0.75}
//           >
//             <View style={[styles.gridIcon, { backgroundColor: '#E0E7FF' }]}>
//               <Text style={styles.gridEmoji}>💬</Text>
//             </View>
//             <Text style={[styles.gridTitle, { color: '#4F46E5' }]}>Ask AI</Text>
//             <Text style={styles.gridDesc}>Chat with your material</Text>
//           </TouchableOpacity>
//         </View>

//         {/* ── Chat with AI full-width button ── */}
//         <TouchableOpacity
//           style={styles.chatBanner}
//           onPress={() => setChatOpen(true)}
//           activeOpacity={0.85}
//         >
//           <View style={styles.chatBannerLeft}>
//             <View style={styles.chatBannerIcon}>
//               <SparkleIcon />
//             </View>
//             <View>
//               <Text style={styles.chatBannerTitle}>Chat with your material</Text>
//               <Text style={styles.chatBannerDesc}>Ask anything about {subjectName}</Text>
//             </View>
//           </View>
//           <View style={styles.chatBannerBtn}>
//             <ChatIcon color="#6366F1" />
//             <Text style={styles.chatBannerBtnText}>Start chat</Text>
//           </View>
//         </TouchableOpacity>

//         {/* ── PRACTICE section ── */}
//         <Text style={styles.sectionLabel}>PRACTICE</Text>
//         <View style={styles.grid}>
//           <TouchableOpacity style={styles.gridCard} onPress={() => startSession('practice')} activeOpacity={0.75}>
//             <View style={[styles.gridIcon, { backgroundColor: '#EEF2FF' }]}>
//               <Text style={styles.gridEmoji}>📚</Text>
//             </View>
//             <Text style={styles.gridTitle}>Practice</Text>
//             <Text style={styles.gridDesc}>Instant feedback, no timer</Text>
//           </TouchableOpacity>

//           <TouchableOpacity style={styles.gridCard} onPress={() => startSession('exam')} activeOpacity={0.75}>
//             <View style={[styles.gridIcon, { backgroundColor: '#FFF7ED' }]}>
//               <Text style={styles.gridEmoji}>⏱️</Text>
//             </View>
//             <Text style={styles.gridTitle}>Exam Mode</Text>
//             <Text style={styles.gridDesc}>Timed, real pressure</Text>
//           </TouchableOpacity>
//         </View>

//         {/* Weak questions — full width */}
//         <TouchableOpacity
//           style={[
//             styles.weakCard,
//             (subject?.weakCount ?? 0) === 0 && { opacity: 0.45 },
//           ]}
//           onPress={() => startSession('weak')}
//           activeOpacity={0.8}
//         >
//           <View style={[styles.gridIcon, { backgroundColor: '#FEF3C7', marginBottom: 0 }]}>
//             <Text style={styles.gridEmoji}>⚠️</Text>
//           </View>
//           <View style={{ flex: 1 }}>
//             <Text style={styles.gridTitle}>Weak Questions</Text>
//             <Text style={styles.gridDesc}>
//               {(subject?.weakCount ?? 0) === 0
//                 ? 'Practice more to find your weak spots'
//                 : 'Drill only what you keep getting wrong'}
//             </Text>
//           </View>
//           {(subject?.weakCount ?? 0) > 0 && (
//             <View style={styles.weakBadge}>
//               <Text style={styles.weakBadgeText}>{subject.weakCount} weak</Text>
//             </View>
//           )}
//         </TouchableOpacity>

//         {/* ── Recent sessions ── */}
//         {recentSessions.length > 0 && (
//           <>
//             <Text style={[styles.sectionLabel, { marginTop: 20 }]}>RECENT SESSIONS</Text>
//             <View style={styles.sessionsCard}>
//               {recentSessions.map((s: any, i: number) => (
//                 <View key={s._id} style={[styles.sessionRow, i > 0 && styles.sessionBorder]}>
//                   <View>
//                     <Text style={styles.sessionMode}>{s.mode} mode</Text>
//                     <Text style={styles.sessionDate}>
//                       {new Date(s.completedAt).toLocaleDateString('en-NG', { day: 'numeric', month: 'short' })}
//                     </Text>
//                   </View>
//                   <Text style={[
//                     styles.sessionScore,
//                     { color: s.score >= 7 ? '#059669' : s.score >= 5 ? Colors.brand : '#DC2626' },
//                   ]}>
//                     {s.score}/10
//                   </Text>
//                 </View>
//               ))}
//             </View>
//           </>
//         )}

//         <View style={{ height: 40 }} />
//       </ScrollView>

//       {/* ── Chat bottom sheet ── */}
//       <Modal
//         visible={chatOpen}
//         animationType="slide"
//         transparent
//         onRequestClose={() => setChatOpen(false)}
//       >
//         <KeyboardAvoidingView
//           style={{ flex: 1 }}
//           behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
//         >
//           <Pressable style={styles.chatOverlay} onPress={() => setChatOpen(false)} />

//           <View style={styles.chatSheet}>
//             {/* Sheet header */}
//             <View style={styles.chatSheetHeader}>
//               <View style={styles.chatSheetHandle} />
//               <View style={styles.chatSheetTitleRow}>
//                 <View style={styles.chatSheetIconWrap}>
//                   <SparkleIcon />
//                 </View>
//                 <View>
//                   <Text style={styles.chatSheetTitle}>Ask AI</Text>
//                   <Text style={styles.chatSheetSub}>{subjectName}</Text>
//                 </View>
//               </View>
//               <TouchableOpacity onPress={() => setChatOpen(false)} style={styles.chatCloseBtn}>
//                 <CloseIcon />
//               </TouchableOpacity>
//             </View>

//             {/* Messages */}
//             <FlatList
//               ref={flatListRef}
//               data={messages}
//               keyExtractor={(m) => m.id}
//               contentContainerStyle={styles.chatMessages}
//               showsVerticalScrollIndicator={false}
//               ListEmptyComponent={
//                 <View style={styles.chatEmpty}>
//                   <Text style={styles.chatEmptyIcon}>💬</Text>
//                   <Text style={styles.chatEmptyTitle}>Ask anything about {subjectName}</Text>
//                   <Text style={styles.chatEmptyDesc}>
//                     Explain a concept, quiz yourself, or ask why you got something wrong.
//                   </Text>
//                   <View style={styles.chatSuggestions}>
//                     {[
//                       `Explain the key concepts in ${subjectName}`,
//                       'Quiz me on the hardest topics',
//                       'What should I focus on most?',
//                     ].map((s) => (
//                       <TouchableOpacity
//                         key={s}
//                         style={styles.chatSuggestion}
//                         onPress={() => { setInputText(s); }}
//                       >
//                         <Text style={styles.chatSuggestionText}>{s}</Text>
//                       </TouchableOpacity>
//                     ))}
//                   </View>
//                 </View>
//               }
//               renderItem={({ item }) => (
//                 <View style={[
//                   styles.chatBubble,
//                   item.role === 'user' ? styles.chatBubbleUser : styles.chatBubbleAI,
//                 ]}>
//                   <Text style={[
//                     styles.chatBubbleText,
//                     item.role === 'user' ? styles.chatBubbleTextUser : styles.chatBubbleTextAI,
//                   ]}>
//                     {item.text}
//                   </Text>
//                 </View>
//               )}
//             />

//             {/* Typing indicator */}
//             {aiLoading && (
//               <View style={styles.typingRow}>
//                 <View style={styles.chatBubbleAI}>
//                   <ActivityIndicator size="small" color="#6366F1" />
//                 </View>
//               </View>
//             )}

//             {/* Input */}
//             <View style={styles.chatInputRow}>
//               <TextInput
//                 style={styles.chatInput}
//                 placeholder="Ask anything about this course..."
//                 placeholderTextColor="#94A3B8"
//                 value={inputText}
//                 onChangeText={setInputText}
//                 multiline
//                 maxLength={500}
//                 returnKeyType="send"
//                 onSubmitEditing={sendMessage}
//               />
//               <TouchableOpacity
//                 style={[styles.chatSendBtn, (!inputText.trim() || aiLoading) && { opacity: 0.4 }]}
//                 onPress={sendMessage}
//                 disabled={!inputText.trim() || aiLoading}
//               >
//                 <SendIcon />
//               </TouchableOpacity>
//             </View>
//           </View>
//         </KeyboardAvoidingView>
//       </Modal>
//     </SafeAreaView>
//   );
// }

// // ── Styles ────────────────────────────────────────────────────────
// const styles = StyleSheet.create({
//   safe:   { flex: 1, backgroundColor: '#F8FAFC' },
//   scroll: { paddingBottom: 40 },

//   // Header
//   header:        { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, paddingBottom: 8 },
//   backBtn:       { flexDirection: 'row', alignItems: 'center', gap: 4 },
//   backText:      { fontSize: 14, fontWeight: '600', color: '#1D4ED8' },
//   uploadBtn:     { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#1D4ED8', paddingHorizontal: 14, paddingVertical: 8, borderRadius: 999 },
//   uploadBtnText: { fontSize: 13, fontWeight: '700', color: '#fff' },

//   // Hero
//   heroWrap:     { padding: 20, paddingTop: 8, paddingBottom: 0 },
//   courseLabel:  { fontSize: 11, fontWeight: '700', color: '#94A3B8', letterSpacing: 1, marginBottom: 4 },
//   courseName:   { fontSize: 28, fontWeight: '800', color: '#0F172A', letterSpacing: -0.5, marginBottom: 16, lineHeight: 32 },

//   // Stats
//   statsRow: { flexDirection: 'row', gap: 8, marginBottom: 14 },
//   statBox:  { flex: 1, backgroundColor: '#fff', borderRadius: 12, padding: 10, alignItems: 'center', borderWidth: 1, borderColor: '#E2E8F0' },
//   statNum:  { fontSize: 16, fontWeight: '800', color: '#0F172A' },
//   statLabel:{ fontSize: 10, color: '#94A3B8', fontWeight: '500', marginTop: 1 },

//   // Readiness
//   readinessWrap:  { marginBottom: 20 },
//   readinessRow:   { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
//   readinessLabel: { fontSize: 12, fontWeight: '600', color: '#64748B' },
//   readinessPct:   { fontSize: 12, fontWeight: '800' },
//   readinessTrack: { height: 6, backgroundColor: '#E2E8F0', borderRadius: 3, overflow: 'hidden' },
//   readinessFill:  { height: 6, borderRadius: 3 },

//   // Section
//   sectionLabel: { fontSize: 11, fontWeight: '700', color: '#94A3B8', letterSpacing: 1.1, paddingHorizontal: 20, marginBottom: 10 },

//   // Grid
//   grid:      { flexDirection: 'row', flexWrap: 'wrap', gap: 10, paddingHorizontal: 20, marginBottom: 10 },
//   gridCard:  { width: '47.5%', backgroundColor: '#fff', borderRadius: 18, padding: 16, borderWidth: 1, borderColor: '#E2E8F0' },
//   gridIcon:  { width: 44, height: 44, borderRadius: 13, alignItems: 'center', justifyContent: 'center', marginBottom: 10 },
//   gridEmoji: { fontSize: 20 },
//   gridTitle: { fontSize: 14, fontWeight: '700', color: '#0F172A', marginBottom: 3 },
//   gridDesc:  { fontSize: 11, color: '#94A3B8', lineHeight: 16 },

//   // Chat banner
//   chatBanner: {
//     flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
//     marginHorizontal: 20, marginBottom: 20,
//     backgroundColor: '#F5F3FF', borderRadius: 16,
//     borderWidth: 1, borderColor: '#DDD6FE',
//     padding: 14,
//   },
//   chatBannerLeft:    { flexDirection: 'row', alignItems: 'center', gap: 12 },
//   chatBannerIcon:    { width: 36, height: 36, borderRadius: 10, backgroundColor: '#EDE9FE', alignItems: 'center', justifyContent: 'center' },
//   chatBannerTitle:   { fontSize: 14, fontWeight: '700', color: '#3730A3', marginBottom: 2 },
//   chatBannerDesc:    { fontSize: 12, color: '#6366F1' },
//   chatBannerBtn:     { flexDirection: 'row', alignItems: 'center', gap: 5, backgroundColor: '#EDE9FE', paddingHorizontal: 12, paddingVertical: 7, borderRadius: 999 },
//   chatBannerBtnText: { fontSize: 12, fontWeight: '700', color: '#6366F1' },

//   // Weak card
//   weakCard: {
//     flexDirection: 'row', alignItems: 'center', gap: 14,
//     marginHorizontal: 20, marginBottom: 8,
//     backgroundColor: '#fff', borderRadius: 18,
//     borderWidth: 1, borderColor: '#E2E8F0', padding: 14,
//   },
//   weakBadge:     { backgroundColor: '#FEF3C7', borderRadius: 999, paddingHorizontal: 10, paddingVertical: 4 },
//   weakBadgeText: { fontSize: 12, fontWeight: '700', color: '#D97706' },

//   // Sessions
//   sessionsCard:  { marginHorizontal: 20, backgroundColor: '#fff', borderRadius: 18, borderWidth: 1, borderColor: '#E2E8F0', overflow: 'hidden' },
//   sessionRow:    { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 14 },
//   sessionBorder: { borderTopWidth: 1, borderTopColor: '#F1F5F9' },
//   sessionMode:   { fontSize: 13, fontWeight: '600', color: '#0F172A', textTransform: 'capitalize' },
//   sessionDate:   { fontSize: 11, color: '#94A3B8', marginTop: 2 },
//   sessionScore:  { fontSize: 20, fontWeight: '800' },

//   // Chat sheet
//   chatOverlay:       { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)' },
//   chatSheet:         { height: '80%', backgroundColor: '#fff', borderTopLeftRadius: 28, borderTopRightRadius: 28 },
//   chatSheetHeader:   { padding: 16, paddingBottom: 12, borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
//   chatSheetHandle:   { width: 36, height: 4, backgroundColor: '#E2E8F0', borderRadius: 2, alignSelf: 'center', marginBottom: 14 },
//   chatSheetTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
//   chatSheetIconWrap: { width: 36, height: 36, borderRadius: 10, backgroundColor: '#EDE9FE', alignItems: 'center', justifyContent: 'center' },
//   chatSheetTitle:    { fontSize: 17, fontWeight: '800', color: '#0F172A' },
//   chatSheetSub:      { fontSize: 12, color: '#94A3B8', marginTop: 1 },
//   chatCloseBtn:      { position: 'absolute', top: 20, right: 16, padding: 4 },

//   // Messages
//   chatMessages: { padding: 16, paddingBottom: 8, flexGrow: 1 },
//   chatEmpty:    { alignItems: 'center', paddingTop: 24, paddingHorizontal: 16 },
//   chatEmptyIcon:  { fontSize: 36, marginBottom: 10 },
//   chatEmptyTitle: { fontSize: 16, fontWeight: '700', color: '#0F172A', marginBottom: 6, textAlign: 'center' },
//   chatEmptyDesc:  { fontSize: 13, color: '#94A3B8', textAlign: 'center', lineHeight: 20, marginBottom: 20 },
//   chatSuggestions:    { width: '100%', gap: 8 },
//   chatSuggestion:     { backgroundColor: '#F8FAFC', borderRadius: 12, padding: 12, borderWidth: 1, borderColor: '#E2E8F0' },
//   chatSuggestionText: { fontSize: 13, color: '#475569', fontWeight: '500' },

//   chatBubble:         { maxWidth: '80%', borderRadius: 16, padding: 12, marginBottom: 8 },
//   chatBubbleUser:     { backgroundColor: '#1D4ED8', alignSelf: 'flex-end', borderBottomRightRadius: 4 },
//   chatBubbleAI:       { backgroundColor: '#F1F5F9', alignSelf: 'flex-start', borderBottomLeftRadius: 4, paddingHorizontal: 14, paddingVertical: 10 },
//   chatBubbleText:     { fontSize: 14, lineHeight: 20 },
//   chatBubbleTextUser: { color: '#fff' },
//   chatBubbleTextAI:   { color: '#0F172A' },

//   typingRow: { paddingHorizontal: 16, paddingBottom: 4 },

//   // Input
//   chatInputRow: { flexDirection: 'row', alignItems: 'flex-end', gap: 8, padding: 12, borderTopWidth: 1, borderTopColor: '#F1F5F9' },
//   chatInput:    { flex: 1, backgroundColor: '#F8FAFC', borderRadius: 14, borderWidth: 1, borderColor: '#E2E8F0', padding: 12, fontSize: 14, color: '#0F172A', maxHeight: 100 },
//   chatSendBtn:  { width: 42, height: 42, borderRadius: 21, backgroundColor: '#1D4ED8', alignItems: 'center', justifyContent: 'center' },
// });

// ─── DrillSubjectScreen.tsx ──────────────────────────────────────
import React, { useState, useCallback, useRef } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet,
  Alert, RefreshControl, Modal, TextInput, KeyboardAvoidingView,
  Platform, FlatList, ActivityIndicator, Pressable,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp, useFocusEffect } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Svg, { Path, Circle, Rect } from 'react-native-svg';
import { AppStackParamList } from '../../navigation/types';
import { Colors, FontSize, Radius, Spacing, Shadows } from '../../theme';
import CCLoader from '../../components/CCLoader';
import { getSubject, getDrillStats, sendSubjectChat } from '../../../config/client';

type Nav   = NativeStackNavigationProp<AppStackParamList>;
type Route = RouteProp<AppStackParamList, 'DrillSubject'>;

// ── Chat message type ─────────────────────────────────────────────
interface ChatMessage {
  id: string;
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

function UploadIcon() {
  return (
    <Svg width={18} height={18} viewBox="0 0 24 24" fill="none"
      stroke="#fff" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <Path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <Path d="m17 8-5-5-5 5" />
      <Path d="M12 3v12" />
    </Svg>
  );
}

function ChatIcon({ color = '#fff' }: { color?: string }) {
  return (
    <Svg width={18} height={18} viewBox="0 0 24 24" fill="none"
      stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <Path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
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

function CloseIcon() {
  return (
    <Svg width={20} height={20} viewBox="0 0 24 24" fill="none"
      stroke="#64748B" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <Path d="M18 6 6 18M6 6l12 12" />
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

// ── Main Screen ───────────────────────────────────────────────────
export default function DrillSubjectScreen() {
  const navigation = useNavigation<Nav>();
  const route      = useRoute<Route>();
  const { subjectId, subjectName } = route.params;

  const [subject, setSubject]       = useState<any>(null);
  const [stats, setStats]           = useState<any>(null);
  const [loading, setLoading]       = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [fileCount, setFileCount]   = useState(0);
  const [linkCount, setLinkCount]   = useState(0);

  // Chat state
  const [chatOpen, setChatOpen]     = useState(false);
  const [messages, setMessages]     = useState<ChatMessage[]>([]);
  const [inputText, setInputText]   = useState('');
  const [aiLoading, setAiLoading]   = useState(false);
  const flatListRef                 = useRef<FlatList>(null);

  const load = async () => {
    try {
      const [s, st] = await Promise.all([
        getSubject(subjectId),
        getDrillStats(subjectId),
      ]);
      setSubject(s);
      setStats(st);
      setFileCount(s?.fileCount ?? 0);
      setLinkCount(s?.linkCount ?? 0);
    } catch {
      Alert.alert('Error', 'Could not load course');
    }
  };

  useFocusEffect(useCallback(() => {
    load().finally(() => setLoading(false));
  }, [subjectId]));

  const onRefresh = async () => {
    setRefreshing(true);
    await load();
    setRefreshing(false);
  };

  const startSession = (mode: 'practice' | 'exam' | 'weak') => {
    if ((subject?.totalQuestions ?? 0) === 0) {
      return Alert.alert('No questions', 'Upload questions to this course first.');
    }
    if (mode === 'weak' && (subject?.weakCount ?? 0) === 0) {
      return Alert.alert('No weak questions', 'Keep practicing and weak questions will appear here automatically.');
    }
    navigation.navigate('DrillSession', { subjectId, subjectName, mode });
  };

  const startFlashcards = () => {
    if ((subject?.totalQuestions ?? 0) === 0) {
      return Alert.alert('No questions', 'Upload questions to this course first.');
    }
    navigation.navigate('Flashcard', { subjectId, subjectName });
  };

  // ── Chat ─────────────────────────────────────────────────────────
  const sendMessage = async () => {
    const text = inputText.trim();
    if (!text || aiLoading) return;

    const userMsg: ChatMessage = { id: Date.now().toString(), role: 'user', text };
    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setAiLoading(true);

    setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);

    try {
      const response = await sendSubjectChat(
        subjectId,
        subjectName,
        text,
        messages.map((m) => ({ role: m.role === 'user' ? 'user' : 'model', content: m.text })),
      );

      const aiText = response?.reply ?? 'Sorry, I could not respond. Try again.';

      const aiMsg: ChatMessage = { id: (Date.now() + 1).toString(), role: 'ai', text: aiText };
      setMessages((prev) => [...prev, aiMsg]);
      setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);
    } catch {
      const errMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'ai',
        text: 'Something went wrong. Check your connection and try again.',
      };
      setMessages((prev) => [...prev, errMsg]);
    } finally {
      setAiLoading(false);
    }
  };

  if (loading) return <CCLoader />;

  const recentSessions = subject?.sessions?.slice(0, 5) ?? [];
  const readiness      = stats?.bestScore != null ? Math.round((stats.bestScore / 10) * 100) : 0;
  const readinessColor = readiness >= 70 ? '#059669' : readiness >= 40 ? '#1D4ED8' : '#DC2626';

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Colors.brand} />}
      >
        {/* ── Header ── */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <BackIcon />
            <Text style={styles.backText}>My Courses</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.uploadBtn}
            onPress={() => navigation.navigate('DrillAddQuestions', { subjectId, subjectName })}
          >
            <UploadIcon />
            <Text style={styles.uploadBtnText}>Upload</Text>
          </TouchableOpacity>
        </View>


        {/* ── Course name ── */}
        <View style={styles.heroWrap}>
          <Text style={styles.courseLabel}>COURSE</Text>
          <Text style={styles.courseName}>{subjectName}</Text>

          {/* Stats row */}
          <View style={styles.statsRow}>
            <View style={styles.statBox}>
              <Text style={styles.statNum}>{subject?.totalQuestions ?? 0}</Text>
              <Text style={styles.statLabel}>Questions</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statNum}>{stats?.avgScore ?? 0}/10</Text>
              <Text style={styles.statLabel}>Avg score</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statNum}>{stats?.bestScore ?? 0}/10</Text>
              <Text style={styles.statLabel}>Best</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statNum}>{stats?.totalSessions ?? 0}</Text>
              <Text style={styles.statLabel}>Sessions</Text>
            </View>
          </View>

          {/* Readiness bar + document count */}
          <View style={styles.readinessWrap}>
            <View style={styles.readinessRow}>
              <Text style={styles.readinessLabel}>Readiness</Text>
              <View style={styles.readinessRight}>

                {/* Document count pill */}
                <TouchableOpacity
                  style={styles.docPill}
                  // onPress={() => navigation.navigate('DrillAddQuestions', { subjectId, subjectName })}
                  onPress={() => navigation.navigate('SubjectMaterials', { subjectId, subjectName })}

                >
                  <Text style={styles.docPillIcon}>📄</Text>
                  <Text style={styles.docPillText}>
                    {subject?.documentCount ?? 0} doc{(subject?.documentCount ?? 0) !== 1 ? 's' : ''}

                    uploaded material
                  </Text>
                </TouchableOpacity>
                <Text style={[styles.readinessPct, { color: readinessColor }]}>{readiness}%</Text>
              </View>
            </View>
            <View style={styles.readinessTrack}>
              <View style={[styles.readinessFill, { width: `${readiness}%`, backgroundColor: readinessColor }]} />
            </View>
          </View>
        </View>

        {/* ── STUDY section ── */}
        <Text style={styles.sectionLabel}>STUDY</Text>
        <View style={styles.grid}>
          <TouchableOpacity style={styles.gridCard} onPress={startFlashcards} activeOpacity={0.75}>
            <View style={[styles.gridIcon, { backgroundColor: '#EDE9FE' }]}>
              <Text style={styles.gridEmoji}>🃏</Text>
            </View>
            <Text style={styles.gridTitle}>Flashcards</Text>
            <Text style={styles.gridDesc}>Spaced repetition review</Text>
          </TouchableOpacity>



          <TouchableOpacity
            style={styles.gridCard}
            onPress={() => navigation.navigate('AILesson', { subjectId, subjectName })}
            activeOpacity={0.75}
          >
            <View style={[styles.gridIcon, { backgroundColor: '#FFF7ED' }]}>
              <Text style={styles.gridEmoji}>🎧</Text>
            </View>
            <Text style={styles.gridTitle}>AI Lesson</Text>
            <Text style={styles.gridDesc}>Listen while you commute</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.gridCard}
            onPress={() => navigation.navigate('WhiteboardLibrary', { subjectId, subjectName })}
            activeOpacity={0.75}
          >
            <View style={[styles.gridIcon, { backgroundColor: '#FEF3C7' }]}>
              <Text style={styles.gridEmoji}>🎬</Text>
            </View>
            <Text style={styles.gridTitle}>Whiteboard</Text>
            <Text style={styles.gridDesc}>Animated explainer video</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.gridCard, { borderColor: '#C7D2FE', backgroundColor: '#F5F7FF' }]}
            // onPress={() => setChatOpen(true)}

                      onPress={() => navigation.navigate('SubjectChat', {
  subjectId,
  subjectName,
  documentCount: fileCount + linkCount,
  fileCount,
  linkCount,
})}
            activeOpacity={0.75}
          >
            <View style={[styles.gridIcon, { backgroundColor: '#E0E7FF' }]}>
              <Text style={styles.gridEmoji}>💬</Text>
            </View>
            <Text style={[styles.gridTitle, { color: '#4F46E5' }]}>Ask AI</Text>
            <Text style={styles.gridDesc}>Chat with your material</Text>
          </TouchableOpacity>
        </View>

        {/* ── Chat with AI full-width button ── */}
        <TouchableOpacity
          style={styles.chatBanner}
          // onPress={() => setChatOpen(true)}
          onPress={() => navigation.navigate('SubjectChat', {
  subjectId,
  subjectName,
  documentCount: fileCount + linkCount,
  fileCount,
  linkCount,
})}
          activeOpacity={0.85}
        >
          <View style={styles.chatBannerLeft}>
            <View style={styles.chatBannerIcon}>
              <SparkleIcon />
            </View>
            <View>
              <Text style={styles.chatBannerTitle}>Chat with your material</Text>
              <Text style={styles.chatBannerDesc}>Ask anything about {subjectName}</Text>
            </View>
          </View>
          <View style={styles.chatBannerBtn}>
            <ChatIcon color="#6366F1" />
            <Text style={styles.chatBannerBtnText}>Start chat</Text>
          </View>
        </TouchableOpacity>

        {/* ── PRACTICE section ── */}
        <Text style={styles.sectionLabel}>PRACTICE</Text>
        <View style={styles.grid}>
          <TouchableOpacity style={styles.gridCard} onPress={() => startSession('practice')} activeOpacity={0.75}>
            <View style={[styles.gridIcon, { backgroundColor: '#EEF2FF' }]}>
              <Text style={styles.gridEmoji}>📚</Text>
            </View>
            <Text style={styles.gridTitle}>Practice</Text>
            <Text style={styles.gridDesc}>Instant feedback, no timer</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.gridCard} onPress={() => startSession('exam')} activeOpacity={0.75}>
            <View style={[styles.gridIcon, { backgroundColor: '#FFF7ED' }]}>
              <Text style={styles.gridEmoji}>⏱️</Text>
            </View>
            <Text style={styles.gridTitle}>Exam Mode</Text>
            <Text style={styles.gridDesc}>Timed, real pressure</Text>
          </TouchableOpacity>
        </View>

        {/* Weak questions — full width */}
        <TouchableOpacity
          style={[
            styles.weakCard,
            (subject?.weakCount ?? 0) === 0 && { opacity: 0.45 },
          ]}
          onPress={() => startSession('weak')}
          activeOpacity={0.8}
        >
          <View style={[styles.gridIcon, { backgroundColor: '#FEF3C7', marginBottom: 0 }]}>
            <Text style={styles.gridEmoji}>⚠️</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.gridTitle}>Weak Questions</Text>
            <Text style={styles.gridDesc}>
              {(subject?.weakCount ?? 0) === 0
                ? 'Practice more to find your weak spots'
                : 'Drill only what you keep getting wrong'}
            </Text>
          </View>
          {(subject?.weakCount ?? 0) > 0 && (
            <View style={styles.weakBadge}>
              <Text style={styles.weakBadgeText}>{subject.weakCount} weak</Text>
            </View>
          )}
        </TouchableOpacity>

        {/* ── Recent sessions ── */}
        {recentSessions.length > 0 && (
          <>
            <Text style={[styles.sectionLabel, { marginTop: 20 }]}>RECENT SESSIONS</Text>
            <View style={styles.sessionsCard}>
              {recentSessions.map((s: any, i: number) => (
                <View key={s._id} style={[styles.sessionRow, i > 0 && styles.sessionBorder]}>
                  <View>
                    <Text style={styles.sessionMode}>{s.mode} mode</Text>
                    <Text style={styles.sessionDate}>
                      {new Date(s.completedAt).toLocaleDateString('en-NG', { day: 'numeric', month: 'short' })}
                    </Text>
                  </View>
                  <Text style={[
                    styles.sessionScore,
                    { color: s.score >= 7 ? '#059669' : s.score >= 5 ? Colors.brand : '#DC2626' },
                  ]}>
                    {s.score}/10
                  </Text>
                </View>
              ))}
            </View>
          </>
        )}

        <View style={{ height: 40 }} />
      </ScrollView>

      {/* ── Chat bottom sheet ── */}
      <Modal
        visible={chatOpen}
        animationType="slide"
        transparent
        onRequestClose={() => setChatOpen(false)}
      >
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <Pressable style={styles.chatOverlay} onPress={() => setChatOpen(false)} />

          <View style={styles.chatSheet}>
            {/* Sheet header */}
            <View style={styles.chatSheetHeader}>
              <View style={styles.chatSheetHandle} />
              <View style={styles.chatSheetTitleRow}>
                <View style={styles.chatSheetIconWrap}>
                  <SparkleIcon />
                </View>
                <View>
                  <Text style={styles.chatSheetTitle}>Ask AI</Text>
                  <Text style={styles.chatSheetSub}>{subjectName}</Text>
                </View>
              </View>
              <TouchableOpacity onPress={() => setChatOpen(false)} style={styles.chatCloseBtn}>
                <CloseIcon />
              </TouchableOpacity>
            </View>

            {/* Messages */}
            <FlatList
              ref={flatListRef}
              data={messages}
              keyExtractor={(m) => m.id}
              contentContainerStyle={styles.chatMessages}
              showsVerticalScrollIndicator={false}
              ListEmptyComponent={
                <View style={styles.chatEmpty}>
                  <Text style={styles.chatEmptyIcon}>💬</Text>
                  <Text style={styles.chatEmptyTitle}>Ask anything about {subjectName}</Text>
                  <Text style={styles.chatEmptyDesc}>
                    Explain a concept, quiz yourself, or ask why you got something wrong.
                  </Text>
                  <View style={styles.chatSuggestions}>
                    {[
                      `Explain the key concepts in ${subjectName}`,
                      'Quiz me on the hardest topics',
                      'What should I focus on most?',
                    ].map((s) => (
                      <TouchableOpacity
                        key={s}
                        style={styles.chatSuggestion}
                        onPress={() => { setInputText(s); }}
                      >
                        <Text style={styles.chatSuggestionText}>{s}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              }
              renderItem={({ item }) => (
                <View style={[
                  styles.chatBubble,
                  item.role === 'user' ? styles.chatBubbleUser : styles.chatBubbleAI,
                ]}>
                  <Text style={[
                    styles.chatBubbleText,
                    item.role === 'user' ? styles.chatBubbleTextUser : styles.chatBubbleTextAI,
                  ]}>
                    {item.text}
                  </Text>
                </View>
              )}
            />

            {/* Typing indicator */}
            {aiLoading && (
              <View style={styles.typingRow}>
                <View style={styles.chatBubbleAI}>
                  <ActivityIndicator size="small" color="#6366F1" />
                </View>
              </View>
            )}

            {/* Input */}
            <View style={styles.chatInputRow}>
              <TextInput
                style={styles.chatInput}
                placeholder="Ask anything about this course..."
                placeholderTextColor="#94A3B8"
                value={inputText}
                onChangeText={setInputText}
                multiline
                maxLength={500}
                returnKeyType="send"
                onSubmitEditing={sendMessage}
              />
              <TouchableOpacity
                style={[styles.chatSendBtn, (!inputText.trim() || aiLoading) && { opacity: 0.4 }]}
                onPress={sendMessage}
                disabled={!inputText.trim() || aiLoading}
              >
                <SendIcon />
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </SafeAreaView>
  );
}

// ── Styles ────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  safe:   { flex: 1, backgroundColor: '#F8FAFC' },
  scroll: { paddingBottom: 40 },

  // Header
  header:        { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, paddingBottom: 8 },
  backBtn:       { flexDirection: 'row', alignItems: 'center', gap: 4 },
  backText:      { fontSize: 14, fontWeight: '600', color: '#1D4ED8' },
  uploadBtn:     { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#1D4ED8', paddingHorizontal: 14, paddingVertical: 8, borderRadius: 999 },
  uploadBtnText: { fontSize: 13, fontWeight: '700', color: '#fff' },

  // Hero
  heroWrap:     { padding: 20, paddingTop: 8, paddingBottom: 0 },
  courseLabel:  { fontSize: 11, fontWeight: '700', color: '#94A3B8', letterSpacing: 1, marginBottom: 4 },
  courseName:   { fontSize: 28, fontWeight: '800', color: '#0F172A', letterSpacing: -0.5, marginBottom: 16, lineHeight: 32 },

  // Stats
  statsRow: { flexDirection: 'row', gap: 8, marginBottom: 14 },
  statBox:  { flex: 1, backgroundColor: '#fff', borderRadius: 12, padding: 10, alignItems: 'center', borderWidth: 1, borderColor: '#E2E8F0' },
  statNum:  { fontSize: 16, fontWeight: '800', color: '#0F172A' },
  statLabel:{ fontSize: 10, color: '#94A3B8', fontWeight: '500', marginTop: 1 },

  // Readiness
  readinessWrap:  { marginBottom: 20 },
  readinessRow:   { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
  readinessLabel: { fontSize: 12, fontWeight: '600', color: '#64748B' },
  readinessRight: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  readinessPct:   { fontSize: 12, fontWeight: '800' },
  docPill:        { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: '#F1F5F9', borderRadius: 999, paddingHorizontal: 10, paddingVertical: 4, borderWidth: 1, borderColor: '#E2E8F0' },
  docPillIcon:    { fontSize: 12 },
  docPillText:    { fontSize: 12, fontWeight: '600', color: '#475569' },
  readinessTrack: { height: 6, backgroundColor: '#E2E8F0', borderRadius: 3, overflow: 'hidden' },
  readinessFill:  { height: 6, borderRadius: 3 },

  // Section
  sectionLabel: { fontSize: 11, fontWeight: '700', color: '#94A3B8', letterSpacing: 1.1, paddingHorizontal: 20, marginBottom: 10 },

  // Grid
  grid:      { flexDirection: 'row', flexWrap: 'wrap', gap: 10, paddingHorizontal: 20, marginBottom: 10 },
  gridCard:  { width: '47.5%', backgroundColor: '#fff', borderRadius: 18, padding: 16, borderWidth: 1, borderColor: '#E2E8F0' },
  gridIcon:  { width: 44, height: 44, borderRadius: 13, alignItems: 'center', justifyContent: 'center', marginBottom: 10 },
  gridEmoji: { fontSize: 20 },
  gridTitle: { fontSize: 14, fontWeight: '700', color: '#0F172A', marginBottom: 3 },
  gridDesc:  { fontSize: 11, color: '#94A3B8', lineHeight: 16 },

  // Chat banner
  chatBanner: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    marginHorizontal: 20, marginBottom: 20,
    backgroundColor: '#F5F3FF', borderRadius: 16,
    borderWidth: 1, borderColor: '#DDD6FE',
    padding: 14,
  },
  chatBannerLeft:    { flexDirection: 'row', alignItems: 'center', gap: 12 },
  chatBannerIcon:    { width: 36, height: 36, borderRadius: 10, backgroundColor: '#EDE9FE', alignItems: 'center', justifyContent: 'center' },
  chatBannerTitle:   { fontSize: 14, fontWeight: '700', color: '#3730A3', marginBottom: 2 },
  chatBannerDesc:    { fontSize: 12, color: '#6366F1' },
  chatBannerBtn:     { flexDirection: 'row', alignItems: 'center', gap: 5, backgroundColor: '#EDE9FE', paddingHorizontal: 12, paddingVertical: 7, borderRadius: 999 },
  chatBannerBtnText: { fontSize: 12, fontWeight: '700', color: '#6366F1' },

  // Weak card
  weakCard: {
    flexDirection: 'row', alignItems: 'center', gap: 14,
    marginHorizontal: 20, marginBottom: 8,
    backgroundColor: '#fff', borderRadius: 18,
    borderWidth: 1, borderColor: '#E2E8F0', padding: 14,
  },
  weakBadge:     { backgroundColor: '#FEF3C7', borderRadius: 999, paddingHorizontal: 10, paddingVertical: 4 },
  weakBadgeText: { fontSize: 12, fontWeight: '700', color: '#D97706' },

  // Sessions
  sessionsCard:  { marginHorizontal: 20, backgroundColor: '#fff', borderRadius: 18, borderWidth: 1, borderColor: '#E2E8F0', overflow: 'hidden' },
  sessionRow:    { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 14 },
  sessionBorder: { borderTopWidth: 1, borderTopColor: '#F1F5F9' },
  sessionMode:   { fontSize: 13, fontWeight: '600', color: '#0F172A', textTransform: 'capitalize' },
  sessionDate:   { fontSize: 11, color: '#94A3B8', marginTop: 2 },
  sessionScore:  { fontSize: 20, fontWeight: '800' },

  // Chat sheet
  chatOverlay:       { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)' },
  chatSheet:         { height: '80%', backgroundColor: '#fff', borderTopLeftRadius: 28, borderTopRightRadius: 28 },
  chatSheetHeader:   { padding: 16, paddingBottom: 12, borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
  chatSheetHandle:   { width: 36, height: 4, backgroundColor: '#E2E8F0', borderRadius: 2, alignSelf: 'center', marginBottom: 14 },
  chatSheetTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  chatSheetIconWrap: { width: 36, height: 36, borderRadius: 10, backgroundColor: '#EDE9FE', alignItems: 'center', justifyContent: 'center' },
  chatSheetTitle:    { fontSize: 17, fontWeight: '800', color: '#0F172A' },
  chatSheetSub:      { fontSize: 12, color: '#94A3B8', marginTop: 1 },
  chatCloseBtn:      { position: 'absolute', top: 20, right: 16, padding: 4 },

  // Messages
  chatMessages: { padding: 16, paddingBottom: 8, flexGrow: 1 },
  chatEmpty:    { alignItems: 'center', paddingTop: 24, paddingHorizontal: 16 },
  chatEmptyIcon:  { fontSize: 36, marginBottom: 10 },
  chatEmptyTitle: { fontSize: 16, fontWeight: '700', color: '#0F172A', marginBottom: 6, textAlign: 'center' },
  chatEmptyDesc:  { fontSize: 13, color: '#94A3B8', textAlign: 'center', lineHeight: 20, marginBottom: 20 },
  chatSuggestions:    { width: '100%', gap: 8 },
  chatSuggestion:     { backgroundColor: '#F8FAFC', borderRadius: 12, padding: 12, borderWidth: 1, borderColor: '#E2E8F0' },
  chatSuggestionText: { fontSize: 13, color: '#475569', fontWeight: '500' },

  chatBubble:         { maxWidth: '80%', borderRadius: 16, padding: 12, marginBottom: 8 },
  chatBubbleUser:     { backgroundColor: '#1D4ED8', alignSelf: 'flex-end', borderBottomRightRadius: 4 },
  chatBubbleAI:       { backgroundColor: '#F1F5F9', alignSelf: 'flex-start', borderBottomLeftRadius: 4, paddingHorizontal: 14, paddingVertical: 10 },
  chatBubbleText:     { fontSize: 14, lineHeight: 20 },
  chatBubbleTextUser: { color: '#fff' },
  chatBubbleTextAI:   { color: '#0F172A' },

  typingRow: { paddingHorizontal: 16, paddingBottom: 4 },

  // Input
  chatInputRow: { flexDirection: 'row', alignItems: 'flex-end', gap: 8, padding: 12, borderTopWidth: 1, borderTopColor: '#F1F5F9' },
  chatInput:    { flex: 1, backgroundColor: '#F8FAFC', borderRadius: 14, borderWidth: 1, borderColor: '#E2E8F0', padding: 12, fontSize: 14, color: '#0F172A', maxHeight: 100 },
  chatSendBtn:  { width: 42, height: 42, borderRadius: 21, backgroundColor: '#1D4ED8', alignItems: 'center', justifyContent: 'center' },
});