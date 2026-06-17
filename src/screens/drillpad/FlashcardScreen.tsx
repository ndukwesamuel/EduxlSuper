// // // // ─── FlashcardScreen.tsx ──────────────────────────────────────────
// // // import React, { useState, useRef, useEffect, useCallback } from 'react';
// // // import {
// // //   View, Text, TouchableOpacity, StyleSheet,
// // //   Animated, PanResponder, Dimensions, Alert,
// // //   SafeAreaView as RNSafeAreaView,
// // // } from 'react-native';
// // // import { SafeAreaView } from 'react-native-safe-area-context';
// // // import { useNavigation, useRoute, RouteProp, useFocusEffect } from '@react-navigation/native';
// // // import { NativeStackNavigationProp } from '@react-navigation/native-stack';
// // // import { AppStackParamList } from '../../navigation/types';
// // // import { getDrillQuestions, DrillQuestion } from "../../../config/client";

// // // type Nav   = NativeStackNavigationProp<AppStackParamList>;
// // // type Route = RouteProp<AppStackParamList, 'Flashcard'>;

// // // const { width: SCREEN_WIDTH } = Dimensions.get('window');
// // // const SWIPE_THRESHOLD = SCREEN_WIDTH * 0.3;

// // // type Rating = 'easy' | 'hard' | 'missed';

// // // interface CardResult {
// // //   questionId: string;
// // //   rating: Rating;
// // // }

// // // export default function FlashcardScreen() {
// // //   const navigation = useNavigation<Nav>();
// // //   const route      = useRoute<Route>();
// // //   const { subjectId, subjectName } = route.params;

// // //   const [questions, setQuestions]   = useState<DrillQuestion[]>([]);
// // //   const [loading, setLoading]       = useState(true);
// // //   const [currentIdx, setCurrentIdx] = useState(0);
// // //   const [isFlipped, setIsFlipped]   = useState(false);
// // //   const [results, setResults]       = useState<CardResult[]>([]);
// // //   const [showSummary, setShowSummary] = useState(false);
// // //   const [swipeDirection, setSwipeDirection] = useState<'left' | 'right' | null>(null);

// // //   // ── Animations ───────────────────────────────────────────────
// // //   const flipAnim    = useRef(new Animated.Value(0)).current;
// // //   const swipeAnim   = useRef(new Animated.Value(0)).current;
// // //   const swipeRotate = useRef(new Animated.Value(0)).current;
// // //   const fadeAnim    = useRef(new Animated.Value(1)).current;
// // //   const scaleAnim   = useRef(new Animated.Value(1)).current;

// // //   // Screen entrance
// // //   const entranceFade  = useRef(new Animated.Value(0)).current;
// // //   const entranceSlide = useRef(new Animated.Value(30)).current;

// // //   useEffect(() => {
// // //     Animated.parallel([
// // //       Animated.timing(entranceFade,  { toValue: 1, duration: 400, useNativeDriver: true }),
// // //       Animated.spring(entranceSlide, { toValue: 0, tension: 65, friction: 10, useNativeDriver: true }),
// // //     ]).start();
// // //   }, []);

// // //   // ── Load questions ────────────────────────────────────────────
// // //   useEffect(() => {
// // //     loadQuestions();
// // //   }, []);

// // //   const loadQuestions = async () => {
// // //     try {
// // //       const qs = await getDrillQuestions(subjectId, 'all', 20, true);
// // //       if (qs.length === 0) {
// // //         Alert.alert('No questions', 'Add questions to this subject first.', [
// // //           { text: 'OK', onPress: () => navigation.goBack() },
// // //         ]);
// // //         return;
// // //       }
// // //       setQuestions(qs);
// // //     } catch {
// // //       Alert.alert('Error', 'Could not load questions.');
// // //       navigation.goBack();
// // //     } finally {
// // //       setLoading(false);
// // //     }
// // //   };

// // //   // ── 3D Flip ───────────────────────────────────────────────────
// // //   const handleFlip = () => {

// // //     console.log("you toch soemthing ");
    
// // //     if (isFlipped) return;
// // //     Animated.spring(flipAnim, {
// // //       toValue: 1,
// // //       friction: 8,
// // //       tension: 40,
// // //       useNativeDriver: true,
// // //     }).start();
// // //     setIsFlipped(true);
// // //   };

// // //   const frontInterpolate = flipAnim.interpolate({
// // //     inputRange: [0, 1],
// // //     outputRange: ['0deg', '180deg'],
// // //   });

// // //   const backInterpolate = flipAnim.interpolate({
// // //     inputRange: [0, 1],
// // //     outputRange: ['180deg', '360deg'],
// // //   });

// // //   const frontAnimatedStyle = { transform: [{ rotateY: frontInterpolate }] };
// // //   const backAnimatedStyle  = { transform: [{ rotateY: backInterpolate }] };

// // //   // ── Swipe gesture ─────────────────────────────────────────────
// // //   const panResponder = useRef(
// // //     PanResponder.create({
// // //       onStartShouldSetPanResponder: () => false,
// // //       onMoveShouldSetPanResponder: (_, gestureState) => {
// // //         return Math.abs(gestureState.dx) > 10 && Math.abs(gestureState.dy) < 60;
// // //       },
// // //       onPanResponderMove: (_, gestureState) => {
// // //         if (!isFlipped) return;
// // //         swipeAnim.setValue(gestureState.dx);
// // //         swipeRotate.setValue(gestureState.dx * 0.05);
// // //         setSwipeDirection(gestureState.dx > 0 ? 'right' : 'left');
// // //       },
// // //       onPanResponderRelease: (_, gestureState) => {
// // //         if (!isFlipped) return;
// // //         if (gestureState.dx > SWIPE_THRESHOLD) {
// // //           handleRate('easy');
// // //         } else if (gestureState.dx < -SWIPE_THRESHOLD) {
// // //           handleRate('missed');
// // //         } else {
// // //           // Snap back
// // //           setSwipeDirection(null);
// // //           Animated.spring(swipeAnim,   { toValue: 0, useNativeDriver: true }).start();
// // //           Animated.spring(swipeRotate, { toValue: 0, useNativeDriver: true }).start();
// // //         }
// // //       },
// // //     })
// // //   ).current;

// // //   // ── Rate and advance ──────────────────────────────────────────
// // //   const handleRate = (rating: Rating) => {
// // //     const q = questions[currentIdx];
// // //     const newResults = [...results, { questionId: q._id, rating }];
// // //     setResults(newResults);

// // //     const isLast = currentIdx === questions.length - 1;
// // //     const exitX  = rating === 'easy' ? SCREEN_WIDTH * 1.5 : -SCREEN_WIDTH * 1.5;

// // //     // Fly card off screen
// // //     Animated.parallel([
// // //       Animated.timing(swipeAnim, {
// // //         toValue: exitX,
// // //         duration: 280,
// // //         useNativeDriver: true,
// // //       }),
// // //       Animated.timing(fadeAnim, {
// // //         toValue: 0,
// // //         duration: 280,
// // //         useNativeDriver: true,
// // //       }),
// // //     ]).start(() => {
// // //       if (isLast) {
// // //         setShowSummary(true);
// // //         return;
// // //       }
// // //       // Reset for next card
// // //       flipAnim.setValue(0);
// // //       swipeAnim.setValue(0);
// // //       swipeRotate.setValue(0);
// // //       fadeAnim.setValue(0);
// // //       setSwipeDirection(null);
// // //       setIsFlipped(false);
// // //       setCurrentIdx(i => i + 1);
// // //       // Fade next card in
// // //       Animated.timing(fadeAnim, {
// // //         toValue: 1,
// // //         duration: 250,
// // //         useNativeDriver: true,
// // //       }).start();
// // //     });
// // //   };

// // //   // ── Summary stats ─────────────────────────────────────────────
// // //   const easyCount  = results.filter(r => r.rating === 'easy').length;
// // //   const hardCount  = results.filter(r => r.rating === 'hard').length;
// // //   const missedCount = results.filter(r => r.rating === 'missed').length;

// // //   // ── Swipe hint colors ─────────────────────────────────────────
// // //   const swipeOpacity = swipeAnim.interpolate({
// // //     inputRange: [-SCREEN_WIDTH * 0.3, 0, SCREEN_WIDTH * 0.3],
// // //     outputRange: [1, 0, 1],
// // //     extrapolate: 'clamp',
// // //   });

// // //   const easyHintOpacity = swipeAnim.interpolate({
// // //     inputRange: [0, SCREEN_WIDTH * 0.2],
// // //     outputRange: [0, 1],
// // //     extrapolate: 'clamp',
// // //   });

// // //   const missedHintOpacity = swipeAnim.interpolate({
// // //     inputRange: [-SCREEN_WIDTH * 0.2, 0],
// // //     outputRange: [1, 0],
// // //     extrapolate: 'clamp',
// // //   });

// // //   if (loading) {
// // //     return (
// // //       <SafeAreaView style={styles.safe}>
// // //         <View style={styles.loaderWrap}>
// // //           <Text style={styles.loadingText}>Loading flashcards...</Text>
// // //         </View>
// // //       </SafeAreaView>
// // //     );
// // //   }

// // //   // ── Summary screen ────────────────────────────────────────────
// // //   if (showSummary) {
// // //     return (
// // //       <SafeAreaView style={styles.safe}>
// // //         <Animated.View style={[styles.summaryWrap, { opacity: entranceFade }]}>

// // //           <Text style={styles.summaryEmoji}>
// // //             {easyCount >= questions.length * 0.7 ? '🔥' : easyCount >= questions.length * 0.5 ? '💪' : '📖'}
// // //           </Text>
// // //           <Text style={styles.summaryTitle}>Session complete!</Text>
// // //           <Text style={styles.summarySubject}>{subjectName}</Text>

// // //           <View style={styles.summaryStats}>
// // //             <View style={[styles.summaryStatBox, { backgroundColor: '#D1FAE5' }]}>
// // //               <Text style={[styles.summaryStatNum, { color: '#065F46' }]}>{easyCount}</Text>
// // //               <Text style={[styles.summaryStatLabel, { color: '#047857' }]}>Mastered</Text>
// // //             </View>
// // //             <View style={[styles.summaryStatBox, { backgroundColor: '#FEF3C7' }]}>
// // //               <Text style={[styles.summaryStatNum, { color: '#92400E' }]}>{hardCount}</Text>
// // //               <Text style={[styles.summaryStatLabel, { color: '#B45309' }]}>Hard</Text>
// // //             </View>
// // //             <View style={[styles.summaryStatBox, { backgroundColor: '#FEF2F2' }]}>
// // //               <Text style={[styles.summaryStatNum, { color: '#991B1B' }]}>{missedCount}</Text>
// // //               <Text style={[styles.summaryStatLabel, { color: '#DC2626' }]}>Missed</Text>
// // //             </View>
// // //           </View>

// // //           {/* Spaced repetition info */}
// // //           <View style={styles.srInfoCard}>
// // //             <Text style={styles.srInfoTitle}>📅 Spaced repetition scheduled</Text>
// // //             {missedCount > 0 && (
// // //               <Text style={styles.srInfoRow}>• {missedCount} missed cards — show again tomorrow</Text>
// // //             )}
// // //             {hardCount > 0 && (
// // //               <Text style={styles.srInfoRow}>• {hardCount} hard cards — show again in 3 days</Text>
// // //             )}
// // //             {easyCount > 0 && (
// // //               <Text style={styles.srInfoRow}>• {easyCount} mastered cards — show again in 7 days</Text>
// // //             )}
// // //           </View>

// // //           {missedCount > 0 && (
// // //             <TouchableOpacity
// // //               style={styles.drillMissedBtn}
// // //               onPress={() => {
// // //                 setResults([]);
// // //                 setCurrentIdx(0);
// // //                 setIsFlipped(false);
// // //                 flipAnim.setValue(0);
// // //                 swipeAnim.setValue(0);
// // //                 fadeAnim.setValue(1);
// // //                 // Filter to only missed questions
// // //                 const missedIds = results.filter(r => r.rating === 'missed').map(r => r.questionId);
// // //                 setQuestions(prev => prev.filter(q => missedIds.includes(q._id)));
// // //                 setShowSummary(false);
// // //               }}
// // //             >
// // //               <Text style={styles.drillMissedBtnText}>Drill {missedCount} missed cards again</Text>
// // //             </TouchableOpacity>
// // //           )}

// // //           <TouchableOpacity
// // //             style={styles.practiceBtn}
// // //             onPress={() => navigation.navigate('DrillSession', { subjectId, subjectName, mode: 'practice' })}
// // //           >
// // //             <Text style={styles.practiceBtnText}>Practice Mode →</Text>
// // //           </TouchableOpacity>

// // //           <TouchableOpacity style={styles.backToSubjectBtn} onPress={() => navigation.pop(1)}>
// // //             <Text style={styles.backToSubjectText}>← Back to {subjectName}</Text>
// // //           </TouchableOpacity>

// // //         </Animated.View>
// // //       </SafeAreaView>
// // //     );
// // //   }

// // //   const q = questions[currentIdx];

// // //   return (
// // //     <SafeAreaView style={styles.safe}>
// // //       <Animated.View style={[styles.container, { opacity: entranceFade, transform: [{ translateY: entranceSlide }] }]}>

// // //         {/* ── Header ── */}
// // //         <View style={styles.header}>
// // //           <TouchableOpacity
// // //             onPress={() =>
// // //               Alert.alert('Exit flashcards?', 'Your progress will be saved.', [
// // //                 { text: 'Keep going', style: 'cancel' },
// // //                 { text: 'Exit', onPress: () => navigation.goBack() },
// // //               ])
// // //             }
// // //           >
// // //             <Text style={styles.exitBtn}>✕</Text>
// // //           </TouchableOpacity>
// // //           <Text style={styles.headerProgress}>{currentIdx + 1} / {questions.length}</Text>
// // //           <View style={styles.headerRight} />
// // //         </View>

// // //         {/* ── Progress bar ── */}
// // //         <View style={styles.progressTrack}>
// // //           <View style={[styles.progressFill, { width: `${((currentIdx) / questions.length) * 100}%` }]} />
// // //         </View>

// // //         {/* ── Subject label ── */}
// // //         <Text style={styles.subjectLabel}>{subjectName}</Text>

// // //         {/* ── Swipe hints ── */}
// // //         <View style={styles.swipeHints}>
// // //           <Animated.View style={[styles.swipeHint, styles.swipeHintLeft, { opacity: missedHintOpacity }]}>
// // //             <Text style={styles.swipeHintTextLeft}>❌ Missed</Text>
// // //           </Animated.View>
// // //           <Animated.View style={[styles.swipeHint, styles.swipeHintRight, { opacity: easyHintOpacity }]}>
// // //             <Text style={styles.swipeHintTextRight}>✅ Easy</Text>
// // //           </Animated.View>
// // //         </View>

// // //         {/* ── Card ── */}
// // //         <Animated.View
// // //           style={[
// // //             styles.cardContainer,
// // //             {
// // //               opacity: fadeAnim,
// // //               transform: [
// // //                 { translateX: swipeAnim },
// // //                 { rotate: swipeRotate.interpolate({ inputRange: [-20, 20], outputRange: ['-8deg', '8deg'] }) },
// // //               ],
// // //             },
// // //           ]}
// // //           {...panResponder.panHandlers}
// // //         >
// // //           {/* Front — Question */}
// // //           <Animated.View style={[styles.card, styles.cardFront, frontAnimatedStyle]}>
// // //             <View style={styles.cardLabelWrap}>
// // //               <Text style={styles.cardLabel}>QUESTION</Text>
// // //             </View>
// // //             <Text style={styles.questionText}>{q.question}</Text>
// // //             <TouchableOpacity style={styles.tapToFlip} onPress={handleFlip} activeOpacity={0.7}>
// // //               <Text style={styles.tapToFlipText}>Tap to reveal answer →</Text>
// // //             </TouchableOpacity>
// // //           </Animated.View>

// // //           {/* Back — Answer */}
// // //           <Animated.View style={[styles.card, styles.cardBack, backAnimatedStyle]}>
// // //             <View style={[styles.cardLabelWrap, { backgroundColor: '#D1FAE5' }]}>
// // //               <Text style={[styles.cardLabel, { color: '#065F46' }]}>ANSWER</Text>
// // //             </View>
// // //             <View style={styles.answerWrap}>
// // //               <View style={styles.answerCircle}>
// // //                 <Text style={styles.answerLetter}>{q.correctOption}</Text>
// // //               </View>
// // //               <Text style={styles.answerText}>
// // //                 {q.options.find(o => o.label === q.correctOption)?.text ?? ''}
// // //               </Text>
// // //             </View>
// // //             {q.explanation && (
// // //               <View style={styles.explanationBox}>
// // //                 <Text style={styles.explanationTitle}>💡 Why</Text>
// // //                 <Text style={styles.explanationText}>{q.explanation}</Text>
// // //               </View>
// // //             )}
// // //             <Text style={styles.swipeInstructions}>Swipe right = Easy · Swipe left = Missed</Text>
// // //           </Animated.View>
// // //         </Animated.View>

// // //         {/* ── Action buttons (visible after flip) ── */}
// // //         {isFlipped && (
// // //           <Animated.View style={[styles.actionRow, { opacity: fadeAnim }]}>
// // //             <TouchableOpacity
// // //               style={styles.missedBtn}
// // //               onPress={() => handleRate('missed')}
// // //               activeOpacity={0.85}
// // //             >
// // //               <Text style={styles.missedBtnText}>❌ Missed</Text>
// // //             </TouchableOpacity>

// // //             <TouchableOpacity
// // //               style={styles.hardBtn}
// // //               onPress={() => handleRate('hard')}
// // //               activeOpacity={0.85}
// // //             >
// // //               <Text style={styles.hardBtnText}>😅 Hard</Text>
// // //             </TouchableOpacity>

// // //             <TouchableOpacity
// // //               style={styles.easyBtn}
// // //               onPress={() => handleRate('easy')}
// // //               activeOpacity={0.85}
// // //             >
// // //               <Text style={styles.easyBtnText}>✅ Easy</Text>
// // //             </TouchableOpacity>
// // //           </Animated.View>
// // //         )}

// // //         {/* ── Bottom stats ── */}
// // //         <View style={styles.bottomStats}>
// // //           <View style={styles.bottomStat}>
// // //             <Text style={[styles.bottomStatNum, { color: '#065F46' }]}>{results.filter(r => r.rating === 'easy').length}</Text>
// // //             <Text style={styles.bottomStatLabel}>Easy</Text>
// // //           </View>
// // //           <View style={styles.bottomStat}>
// // //             <Text style={[styles.bottomStatNum, { color: '#92400E' }]}>{results.filter(r => r.rating === 'hard').length}</Text>
// // //             <Text style={styles.bottomStatLabel}>Hard</Text>
// // //           </View>
// // //           <View style={styles.bottomStat}>
// // //             <Text style={[styles.bottomStatNum, { color: '#991B1B' }]}>{results.filter(r => r.rating === 'missed').length}</Text>
// // //             <Text style={styles.bottomStatLabel}>Missed</Text>
// // //           </View>
// // //           <View style={styles.bottomStat}>
// // //             <Text style={[styles.bottomStatNum, { color: '#94A3B8' }]}>{questions.length - currentIdx - 1}</Text>
// // //             <Text style={styles.bottomStatLabel}>Remaining</Text>
// // //           </View>
// // //         </View>

// // //       </Animated.View>
// // //     </SafeAreaView>
// // //   );
// // // }

// // // const styles = StyleSheet.create({
// // //   safe:       { flex: 1, backgroundColor: '#F8FAFC' },
// // //   loaderWrap: { flex: 1, alignItems: 'center', justifyContent: 'center' },
// // //   loadingText:{ fontSize: 14, color: '#94A3B8' },
// // //   container:  { flex: 1, paddingHorizontal: 16 },

// // //   // ── Header ──
// // //   header: {
// // //     flexDirection: 'row',
// // //     justifyContent: 'space-between',
// // //     alignItems: 'center',
// // //     paddingTop: 12,
// // //     paddingBottom: 8,
// // //   },
// // //   exitBtn:      { fontSize: 18, color: '#94A3B8', fontWeight: '600', padding: 4 },
// // //   headerProgress:{ fontSize: 15, fontWeight: '700', color: '#0F172A' },
// // //   headerRight:  { width: 32 },

// // //   // ── Progress ──
// // //   progressTrack:{ height: 4, backgroundColor: '#E2E8F0', borderRadius: 2, marginBottom: 12 },
// // //   progressFill: { height: 4, backgroundColor: '#1D4ED8', borderRadius: 2 },

// // //   subjectLabel: {
// // //     fontSize: 11,
// // //     fontWeight: '700',
// // //     color: '#94A3B8',
// // //     letterSpacing: 1,
// // //     textTransform: 'uppercase',
// // //     textAlign: 'center',
// // //     marginBottom: 12,
// // //   },

// // //   // ── Swipe hints ──
// // //   swipeHints: {
// // //     flexDirection: 'row',
// // //     justifyContent: 'space-between',
// // //     paddingHorizontal: 8,
// // //     marginBottom: 8,
// // //     height: 28,
// // //     alignItems: 'center',
// // //   },
// // //   swipeHint:      { paddingHorizontal: 12, paddingVertical: 4, borderRadius: 9999 },
// // //   swipeHintLeft:  { backgroundColor: '#FEF2F2' },
// // //   swipeHintRight: { backgroundColor: '#D1FAE5' },
// // //   swipeHintTextLeft:  { fontSize: 11, fontWeight: '700', color: '#991B1B' },
// // //   swipeHintTextRight: { fontSize: 11, fontWeight: '700', color: '#065F46' },

// // //   // ── Card ──
// // //   cardContainer: {
// // //     flex: 1,
// // //     marginBottom: 12,
// // //   },
// // //   card: {
// // //     position: 'absolute',
// // //     width: '100%',
// // //     height: '100%',
// // //     backfaceVisibility: 'hidden',
// // //     borderRadius: 20,
// // //     padding: 24,
// // //     shadowColor: '#000',
// // //     shadowOffset: { width: 0, height: 6 },
// // //     shadowOpacity: 0.10,
// // //     shadowRadius: 16,
// // //     elevation: 6,
// // //   },
// // //   cardFront: {
// // //     backgroundColor: '#FFFFFF',
// // //     borderWidth: 1,
// // //     borderColor: '#E2E8F0',
// // //     alignItems: 'center',
// // //     justifyContent: 'center',
// // //     gap: 16,
// // //   },
// // //   cardBack: {
// // //     backgroundColor: '#FFFFFF',
// // //     borderWidth: 1.5,
// // //     borderColor: '#10B981',
// // //     justifyContent: 'center',
// // //     gap: 14,
// // //   },
// // //   cardLabelWrap: {
// // //     backgroundColor: '#EFF6FF',
// // //     borderRadius: 9999,
// // //     paddingHorizontal: 14,
// // //     paddingVertical: 5,
// // //     alignSelf: 'center',
// // //   },
// // //   cardLabel: {
// // //     fontSize: 10,
// // //     fontWeight: '700',
// // //     color: '#1D4ED8',
// // //     letterSpacing: 1,
// // //   },
// // //   questionText: {
// // //     fontSize: 16,
// // //     fontWeight: '700',
// // //     color: '#0F172A',
// // //     lineHeight: 26,
// // //     textAlign: 'center',
// // //   },
// // //   tapToFlip: {
// // //     marginTop: 8,
// // //     paddingHorizontal: 20,
// // //     paddingVertical: 10,
// // //     backgroundColor: '#F1F5F9',
// // //     borderRadius: 9999,
// // //   },
// // //   tapToFlipText: { fontSize: 13, color: '#1D4ED8', fontWeight: '600' },

// // //   // ── Answer ──
// // //   answerWrap: {
// // //     flexDirection: 'row',
// // //     alignItems: 'flex-start',
// // //     gap: 14,
// // //   },
// // //   answerCircle: {
// // //     width: 44,
// // //     height: 44,
// // //     borderRadius: 22,
// // //     backgroundColor: '#D1FAE5',
// // //     alignItems: 'center',
// // //     justifyContent: 'center',
// // //     flexShrink: 0,
// // //   },
// // //   answerLetter: { fontSize: 20, fontWeight: '800', color: '#065F46' },
// // //   answerText:   { flex: 1, fontSize: 15, fontWeight: '700', color: '#0F172A', lineHeight: 24, paddingTop: 10 },

// // //   explanationBox: {
// // //     backgroundColor: '#FFFBEB',
// // //     borderRadius: 12,
// // //     padding: 12,
// // //     borderWidth: 1,
// // //     borderColor: '#FDE68A',
// // //     gap: 4,
// // //   },
// // //   explanationTitle: { fontSize: 11, fontWeight: '700', color: '#92400E' },
// // //   explanationText:  { fontSize: 12, color: '#78350F', lineHeight: 18 },

// // //   swipeInstructions: {
// // //     fontSize: 10,
// // //     color: '#94A3B8',
// // //     textAlign: 'center',
// // //     marginTop: 4,
// // //   },

// // //   // ── Action buttons ──
// // //   actionRow: {
// // //     flexDirection: 'row',
// // //     gap: 8,
// // //     marginBottom: 12,
// // //   },
// // //   missedBtn: {
// // //     flex: 1,
// // //     backgroundColor: '#FEF2F2',
// // //     borderRadius: 9999,
// // //     paddingVertical: 13,
// // //     alignItems: 'center',
// // //     borderWidth: 1.5,
// // //     borderColor: '#FECACA',
// // //   },
// // //   hardBtn: {
// // //     flex: 1,
// // //     backgroundColor: '#FEF3C7',
// // //     borderRadius: 9999,
// // //     paddingVertical: 13,
// // //     alignItems: 'center',
// // //     borderWidth: 1.5,
// // //     borderColor: '#FDE68A',
// // //   },
// // //   easyBtn: {
// // //     flex: 1,
// // //     backgroundColor: '#D1FAE5',
// // //     borderRadius: 9999,
// // //     paddingVertical: 13,
// // //     alignItems: 'center',
// // //     borderWidth: 1.5,
// // //     borderColor: '#A7F3D0',
// // //   },
// // //   missedBtnText: { fontSize: 12, fontWeight: '700', color: '#991B1B' },
// // //   hardBtnText:   { fontSize: 12, fontWeight: '700', color: '#92400E' },
// // //   easyBtnText:   { fontSize: 12, fontWeight: '700', color: '#065F46' },

// // //   // ── Bottom stats ──
// // //   bottomStats: {
// // //     flexDirection: 'row',
// // //     backgroundColor: '#FFFFFF',
// // //     borderRadius: 14,
// // //     borderWidth: 1,
// // //     borderColor: '#E2E8F0',
// // //     padding: 12,
// // //     marginBottom: 8,
// // //     justifyContent: 'space-around',
// // //   },
// // //   bottomStat:      { alignItems: 'center', gap: 2 },
// // //   bottomStatNum:   { fontSize: 18, fontWeight: '800' },
// // //   bottomStatLabel: { fontSize: 10, color: '#94A3B8', fontWeight: '600' },

// // //   // ── Summary ──
// // //   summaryWrap: {
// // //     flex: 1,
// // //     padding: 24,
// // //     alignItems: 'center',
// // //     justifyContent: 'center',
// // //     gap: 16,
// // //   },
// // //   summaryEmoji:    { fontSize: 56 },
// // //   summaryTitle:    { fontSize: 26, fontWeight: '800', color: '#0F172A', letterSpacing: -0.5 },
// // //   summarySubject:  { fontSize: 13, color: '#94A3B8', fontWeight: '600', textTransform: 'uppercase', letterSpacing: 1 },
// // //   summaryStats:    { flexDirection: 'row', gap: 10, width: '100%' },
// // //   summaryStatBox:  { flex: 1, borderRadius: 14, padding: 14, alignItems: 'center', gap: 4 },
// // //   summaryStatNum:  { fontSize: 28, fontWeight: '800' },
// // //   summaryStatLabel:{ fontSize: 11, fontWeight: '700' },
// // //   srInfoCard: {
// // //     width: '100%',
// // //     backgroundColor: '#EFF6FF',
// // //     borderRadius: 14,
// // //     padding: 14,
// // //     gap: 6,
// // //     borderWidth: 1,
// // //     borderColor: '#BFDBFE',
// // //   },
// // //   srInfoTitle: { fontSize: 12, fontWeight: '700', color: '#1D4ED8', marginBottom: 4 },
// // //   srInfoRow:   { fontSize: 12, color: '#3B82F6', lineHeight: 18 },
// // //   drillMissedBtn: {
// // //     width: '100%',
// // //     backgroundColor: '#FEF2F2',
// // //     borderRadius: 9999,
// // //     paddingVertical: 15,
// // //     alignItems: 'center',
// // //     borderWidth: 1.5,
// // //     borderColor: '#FECACA',
// // //   },
// // //   drillMissedBtnText: { fontSize: 14, fontWeight: '700', color: '#991B1B' },
// // //   practiceBtn: {
// // //     width: '100%',
// // //     backgroundColor: '#1D4ED8',
// // //     borderRadius: 9999,
// // //     paddingVertical: 15,
// // //     alignItems: 'center',
// // //     shadowColor: '#1D4ED8',
// // //     shadowOffset: { width: 0, height: 6 },
// // //     shadowOpacity: 0.35,
// // //     shadowRadius: 14,
// // //     elevation: 6,
// // //   },
// // //   practiceBtnText:    { fontSize: 15, fontWeight: '700', color: '#fff' },
// // //   backToSubjectBtn:   { paddingVertical: 10 },
// // //   backToSubjectText:  { fontSize: 13, color: '#475569', fontWeight: '600' },
// // // });


// // // ─── FlashcardScreen.tsx ──────────────────────────────────────────
// // import React, { useState, useRef, useEffect } from 'react';
// // import {
// //   View, Text, TouchableOpacity, StyleSheet,
// //   Animated, PanResponder, Dimensions, Alert,
// // } from 'react-native';
// // import { SafeAreaView } from 'react-native-safe-area-context';
// // import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
// // import { NativeStackNavigationProp } from '@react-navigation/native-stack';
// // import { AppStackParamList } from '../../navigation/types';
// // import { getDrillQuestions, DrillQuestion } from '../../../config/client';

// // type Nav   = NativeStackNavigationProp<AppStackParamList>;
// // type Route = RouteProp<AppStackParamList, 'Flashcard'>;

// // const { width: SCREEN_WIDTH } = Dimensions.get('window');
// // const SWIPE_THRESHOLD = SCREEN_WIDTH * 0.28;

// // type Rating = 'easy' | 'hard' | 'missed';

// // interface CardResult {
// //   questionId: string;
// //   rating: Rating;
// // }

// // export default function FlashcardScreen() {
// //   const navigation = useNavigation<Nav>();
// //   const route      = useRoute<Route>();
// //   const { subjectId, subjectName } = route.params;

// //   const [questions, setQuestions]     = useState<DrillQuestion[]>([]);
// //   const [loading, setLoading]         = useState(true);
// //   const [currentIdx, setCurrentIdx]   = useState(0);
// //   const [isFlipped, setIsFlipped]     = useState(false);
// //   const [results, setResults]         = useState<CardResult[]>([]);
// //   const [showSummary, setShowSummary] = useState(false);
// //   const [swipeDir, setSwipeDir]       = useState<'left' | 'right' | null>(null);

// //   // Use ref so PanResponder always reads latest value
// //   const isFlippedRef = useRef(false);

// //   // ── Animations ────────────────────────────────────────────────
// //   const flipAnim    = useRef(new Animated.Value(0)).current;
// //   const swipeX      = useRef(new Animated.Value(0)).current;
// //   const swipeTilt   = useRef(new Animated.Value(0)).current;
// //   const cardOpacity = useRef(new Animated.Value(1)).current;

// //   const entranceFade  = useRef(new Animated.Value(0)).current;
// //   const entranceSlide = useRef(new Animated.Value(30)).current;

// //   useEffect(() => {
// //     Animated.parallel([
// //       Animated.timing(entranceFade,  { toValue: 1, duration: 400, useNativeDriver: true }),
// //       Animated.spring(entranceSlide, { toValue: 0, tension: 65, friction: 10, useNativeDriver: true }),
// //     ]).start();
// //     loadQuestions();
// //   }, []);

// //   const loadQuestions = async () => {
// //     try {
// //       const qs = await getDrillQuestions(subjectId, 'all', 20, true);
// //       if (qs.length === 0) {
// //         Alert.alert('No questions', 'Add questions first.', [
// //           { text: 'OK', onPress: () => navigation.goBack() },
// //         ]);
// //         return;
// //       }
// //       setQuestions(qs);
// //     } catch {
// //       Alert.alert('Error', 'Could not load questions.');
// //       navigation.goBack();
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   // ── 3D Flip ───────────────────────────────────────────────────
// //   const handleFlip = () => {
// //     if (isFlippedRef.current) return;
// //     isFlippedRef.current = true;
// //     setIsFlipped(true);
// //     Animated.spring(flipAnim, {
// //       toValue: 1,
// //       friction: 8,
// //       tension: 45,
// //       useNativeDriver: true,
// //     }).start();
// //   };

// //   const frontRotate = flipAnim.interpolate({
// //     inputRange: [0, 1],
// //     outputRange: ['0deg', '180deg'],
// //   });
// //   const backRotate = flipAnim.interpolate({
// //     inputRange: [0, 1],
// //     outputRange: ['180deg', '360deg'],
// //   });

// //   // ── Swipe gesture ─────────────────────────────────────────────
// //   const panResponder = useRef(
// //     PanResponder.create({
// //       onMoveShouldSetPanResponder: (_, g) => {
// //         // Only capture horizontal swipes after the card is flipped
// //         return isFlippedRef.current && Math.abs(g.dx) > 8 && Math.abs(g.dx) > Math.abs(g.dy);
// //       },
// //       onPanResponderGrant: () => {
// //         swipeX.stopAnimation();
// //       },
// //       onPanResponderMove: (_, g) => {
// //         swipeX.setValue(g.dx);
// //         swipeTilt.setValue(g.dx * 0.04);
// //         setSwipeDir(g.dx > 0 ? 'right' : 'left');
// //       },
// //       onPanResponderRelease: (_, g) => {
// //         if (g.dx > SWIPE_THRESHOLD) {
// //           triggerRate('easy');
// //         } else if (g.dx < -SWIPE_THRESHOLD) {
// //           triggerRate('missed');
// //         } else {
// //           // snap back
// //           setSwipeDir(null);
// //           Animated.parallel([
// //             Animated.spring(swipeX,    { toValue: 0, useNativeDriver: true }),
// //             Animated.spring(swipeTilt, { toValue: 0, useNativeDriver: true }),
// //           ]).start();
// //         }
// //       },
// //       onPanResponderTerminate: () => {
// //         setSwipeDir(null);
// //         Animated.parallel([
// //           Animated.spring(swipeX,    { toValue: 0, useNativeDriver: true }),
// //           Animated.spring(swipeTilt, { toValue: 0, useNativeDriver: true }),
// //         ]).start();
// //       },
// //     })
// //   ).current;

// //   // ── Rate card ─────────────────────────────────────────────────
// //   const triggerRate = (rating: Rating) => {
// //     const q = questions[currentIdx];
// //     const newResults = [...results, { questionId: q._id, rating }];
// //     const isLast = currentIdx === questions.length - 1;
// //     const exitX  = rating === 'easy' ? SCREEN_WIDTH * 1.6 : -SCREEN_WIDTH * 1.6;

// //     Animated.parallel([
// //       Animated.timing(swipeX, { toValue: exitX, duration: 260, useNativeDriver: true }),
// //       Animated.timing(cardOpacity, { toValue: 0, duration: 260, useNativeDriver: true }),
// //     ]).start(() => {
// //       setResults(newResults);
// //       if (isLast) {
// //         setShowSummary(true);
// //         return;
// //       }
// //       // Reset everything for next card
// //       flipAnim.setValue(0);
// //       swipeX.setValue(0);
// //       swipeTilt.setValue(0);
// //       cardOpacity.setValue(0);
// //       isFlippedRef.current = false;
// //       setIsFlipped(false);
// //       setSwipeDir(null);
// //       setCurrentIdx(i => i + 1);
// //       Animated.timing(cardOpacity, { toValue: 1, duration: 220, useNativeDriver: true }).start();
// //     });
// //   };

// //   // ── Swipe hint opacities ──────────────────────────────────────
// //   const easyHintOpacity = swipeX.interpolate({
// //     inputRange: [0, SCREEN_WIDTH * 0.15],
// //     outputRange: [0, 1],
// //     extrapolate: 'clamp',
// //   });
// //   const missedHintOpacity = swipeX.interpolate({
// //     inputRange: [-SCREEN_WIDTH * 0.15, 0],
// //     outputRange: [1, 0],
// //     extrapolate: 'clamp',
// //   });

// //   // ── Summary stats ─────────────────────────────────────────────
// //   const easyCount   = results.filter(r => r.rating === 'easy').length;
// //   const hardCount   = results.filter(r => r.rating === 'hard').length;
// //   const missedCount = results.filter(r => r.rating === 'missed').length;

// //   if (loading) {
// //     return (
// //       <SafeAreaView style={styles.safe}>
// //         <View style={styles.center}>
// //           <Text style={styles.loadingText}>Loading flashcards...</Text>
// //         </View>
// //       </SafeAreaView>
// //     );
// //   }

// //   // ── Summary screen ────────────────────────────────────────────
// //   if (showSummary) {
// //     const emoji = easyCount >= questions.length * 0.7 ? '🔥' : easyCount >= questions.length * 0.5 ? '💪' : '📖';
// //     return (
// //       <SafeAreaView style={styles.safe}>
// //         <Animated.View style={[styles.summaryWrap, { opacity: entranceFade }]}>
// //           <Text style={styles.summaryEmoji}>{emoji}</Text>
// //           <Text style={styles.summaryTitle}>Session complete!</Text>
// //           <Text style={styles.summarySubject}>{subjectName.toUpperCase()}</Text>

// //           <View style={styles.summaryStats}>
// //             <View style={[styles.summaryBox, { backgroundColor: '#D1FAE5' }]}>
// //               <Text style={[styles.summaryNum, { color: '#065F46' }]}>{easyCount}</Text>
// //               <Text style={[styles.summaryLbl, { color: '#047857' }]}>Mastered</Text>
// //             </View>
// //             <View style={[styles.summaryBox, { backgroundColor: '#FEF3C7' }]}>
// //               <Text style={[styles.summaryNum, { color: '#92400E' }]}>{hardCount}</Text>
// //               <Text style={[styles.summaryLbl, { color: '#B45309' }]}>Hard</Text>
// //             </View>
// //             <View style={[styles.summaryBox, { backgroundColor: '#FEF2F2' }]}>
// //               <Text style={[styles.summaryNum, { color: '#991B1B' }]}>{missedCount}</Text>
// //               <Text style={[styles.summaryLbl, { color: '#DC2626' }]}>Missed</Text>
// //             </View>
// //           </View>

// //           <View style={styles.srCard}>
// //             <Text style={styles.srTitle}>📅 Spaced repetition scheduled</Text>
// //             {missedCount > 0 && <Text style={styles.srRow}>• {missedCount} missed → show again tomorrow</Text>}
// //             {hardCount   > 0 && <Text style={styles.srRow}>• {hardCount} hard → show again in 3 days</Text>}
// //             {easyCount   > 0 && <Text style={styles.srRow}>• {easyCount} mastered → show again in 7 days</Text>}
// //           </View>

// //           {missedCount > 0 && (
// //             <TouchableOpacity
// //               style={styles.drillMissedBtn}
// //               onPress={() => {
// //                 const missedIds = results.filter(r => r.rating === 'missed').map(r => r.questionId);
// //                 setQuestions(prev => prev.filter(q => missedIds.includes(q._id)));
// //                 setResults([]);
// //                 setCurrentIdx(0);
// //                 setIsFlipped(false);
// //                 isFlippedRef.current = false;
// //                 flipAnim.setValue(0);
// //                 swipeX.setValue(0);
// //                 cardOpacity.setValue(1);
// //                 setSwipeDir(null);
// //                 setShowSummary(false);
// //               }}
// //             >
// //               <Text style={styles.drillMissedText}>Drill {missedCount} missed cards again</Text>
// //             </TouchableOpacity>
// //           )}

// //           <TouchableOpacity
// //             style={styles.practiceBtn}
// //             onPress={() => navigation.navigate('DrillSession', { subjectId, subjectName, mode: 'practice' })}
// //           >
// //             <Text style={styles.practiceBtnText}>Practice Mode →</Text>
// //           </TouchableOpacity>

// //           <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
// //             <Text style={styles.backBtnText}>← Back to {subjectName}</Text>
// //           </TouchableOpacity>
// //         </Animated.View>
// //       </SafeAreaView>
// //     );
// //   }

// //   const q = questions[currentIdx];

// //   return (
// //     <SafeAreaView style={styles.safe}>
// //       <Animated.View style={[styles.container, {
// //         opacity: entranceFade,
// //         transform: [{ translateY: entranceSlide }],
// //       }]}>

// //         {/* ── Header ── */}
// //         <View style={styles.header}>
// //           <TouchableOpacity onPress={() =>
// //             Alert.alert('Exit?', 'Progress will be saved.', [
// //               { text: 'Keep going', style: 'cancel' },
// //               { text: 'Exit', onPress: () => navigation.goBack() },
// //             ])
// //           }>
// //             <Text style={styles.exitBtn}>✕</Text>
// //           </TouchableOpacity>
// //           <Text style={styles.progress}>{currentIdx + 1} / {questions.length}</Text>
// //           <View style={{ width: 32 }} />
// //         </View>

// //         {/* ── Progress bar ── */}
// //         <View style={styles.progressTrack}>
// //           <View style={[styles.progressFill, {
// //             width: `${(currentIdx / questions.length) * 100}%`,
// //           }]} />
// //         </View>

// //         <Text style={styles.subjectLabel}>{subjectName}</Text>

// //         {/* ── Swipe hints ── */}
// //         <View style={styles.hintsRow}>
// //           <Animated.View style={[styles.hint, styles.hintLeft, { opacity: missedHintOpacity }]}>
// //             <Text style={styles.hintLeftText}>❌ Missed</Text>
// //           </Animated.View>
// //           <Animated.View style={[styles.hint, styles.hintRight, { opacity: easyHintOpacity }]}>
// //             <Text style={styles.hintRightText}>✅ Easy</Text>
// //           </Animated.View>
// //         </View>

// //         {/* ── Card ── */}
// //         <Animated.View
// //           style={[styles.cardWrap, {
// //             opacity: cardOpacity,
// //             transform: [
// //               { translateX: swipeX },
// //               { rotate: swipeTilt.interpolate({
// //                   inputRange: [-20, 20],
// //                   outputRange: ['-10deg', '10deg'],
// //                   extrapolate: 'clamp',
// //                 }),
// //               },
// //             ],
// //           }]}
// //           {...panResponder.panHandlers}
// //         >
// //           {/* Front */}
// //           <Animated.View style={[styles.card, styles.cardFront, {
// //             transform: [{ perspective: 1200 }, { rotateY: frontRotate }],
// //           }]}>
// //             <View style={styles.cardBadge}>
// //               <Text style={styles.cardBadgeText}>QUESTION</Text>
// //             </View>
// //             <Text style={styles.questionText}>{q.question}</Text>
// //             <TouchableOpacity style={styles.tapBtn} onPress={handleFlip} activeOpacity={0.75}>
// //               <Text style={styles.tapBtnText}>Tap to reveal answer →</Text>
// //             </TouchableOpacity>
// //           </Animated.View>

// //           {/* Back */}
// //           <Animated.View style={[styles.card, styles.cardBack, {
// //             transform: [{ perspective: 1200 }, { rotateY: backRotate }],
// //           }]}>
// //             <View style={[styles.cardBadge, { backgroundColor: '#D1FAE5' }]}>
// //               <Text style={[styles.cardBadgeText, { color: '#065F46' }]}>ANSWER</Text>
// //             </View>
// //             <View style={styles.answerRow}>
// //               <View style={styles.answerCircle}>
// //                 <Text style={styles.answerLetter}>{q.correctOption}</Text>
// //               </View>
// //               <Text style={styles.answerText}>
// //                 {q.options.find(o => o.label === q.correctOption)?.text ?? ''}
// //               </Text>
// //             </View>
// //             {q.explanation ? (
// //               <View style={styles.explanationBox}>
// //                 <Text style={styles.explanationTitle}>💡 Why</Text>
// //                 <Text style={styles.explanationText}>{q.explanation}</Text>
// //               </View>
// //             ) : null}
// //             <Text style={styles.swipeHint}>← Swipe left = Missed · Swipe right = Easy →</Text>
// //           </Animated.View>
// //         </Animated.View>

// //         {/* ── Buttons (shown after flip) ── */}
// //         {isFlipped && (
// //           <View style={styles.actionRow}>
// //             <TouchableOpacity style={styles.btnMissed} onPress={() => triggerRate('missed')} activeOpacity={0.85}>
// //               <Text style={styles.btnMissedText}>❌ Missed</Text>
// //             </TouchableOpacity>
// //             <TouchableOpacity style={styles.btnHard} onPress={() => triggerRate('hard')} activeOpacity={0.85}>
// //               <Text style={styles.btnHardText}>😅 Hard</Text>
// //             </TouchableOpacity>
// //             <TouchableOpacity style={styles.btnEasy} onPress={() => triggerRate('easy')} activeOpacity={0.85}>
// //               <Text style={styles.btnEasyText}>✅ Easy</Text>
// //             </TouchableOpacity>
// //           </View>
// //         )}

// //         {/* ── Bottom counts ── */}
// //         <View style={styles.bottomBar}>
// //           <View style={styles.bottomItem}>
// //             <Text style={[styles.bottomNum, { color: '#065F46' }]}>
// //               {results.filter(r => r.rating === 'easy').length}
// //             </Text>
// //             <Text style={styles.bottomLbl}>Easy</Text>
// //           </View>
// //           <View style={styles.bottomItem}>
// //             <Text style={[styles.bottomNum, { color: '#92400E' }]}>
// //               {results.filter(r => r.rating === 'hard').length}
// //             </Text>
// //             <Text style={styles.bottomLbl}>Hard</Text>
// //           </View>
// //           <View style={styles.bottomItem}>
// //             <Text style={[styles.bottomNum, { color: '#991B1B' }]}>
// //               {results.filter(r => r.rating === 'missed').length}
// //             </Text>
// //             <Text style={styles.bottomLbl}>Missed</Text>
// //           </View>
// //           <View style={styles.bottomItem}>
// //             <Text style={[styles.bottomNum, { color: '#94A3B8' }]}>
// //               {questions.length - currentIdx - 1}
// //             </Text>
// //             <Text style={styles.bottomLbl}>Left</Text>
// //           </View>
// //         </View>

// //       </Animated.View>
// //     </SafeAreaView>
// //   );
// // }

// // const styles = StyleSheet.create({
// //   safe:        { flex: 1, backgroundColor: '#F8FAFC' },
// //   center:      { flex: 1, alignItems: 'center', justifyContent: 'center' },
// //   loadingText: { fontSize: 14, color: '#94A3B8' },
// //   container:   { flex: 1, paddingHorizontal: 16 },

// //   header: {
// //     flexDirection: 'row',
// //     justifyContent: 'space-between',
// //     alignItems: 'center',
// //     paddingTop: 12,
// //     paddingBottom: 8,
// //   },
// //   exitBtn:  { fontSize: 18, color: '#94A3B8', fontWeight: '600', padding: 4 },
// //   progress: { fontSize: 15, fontWeight: '700', color: '#0F172A' },

// //   progressTrack: { height: 4, backgroundColor: '#E2E8F0', borderRadius: 2, marginBottom: 10 },
// //   progressFill:  { height: 4, backgroundColor: '#1D4ED8', borderRadius: 2 },

// //   subjectLabel: {
// //     fontSize: 11,
// //     fontWeight: '700',
// //     color: '#94A3B8',
// //     letterSpacing: 1,
// //     textTransform: 'uppercase',
// //     textAlign: 'center',
// //     marginBottom: 10,
// //   },

// //   hintsRow:    { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8, height: 26 },
// //   hint:        { paddingHorizontal: 12, paddingVertical: 4, borderRadius: 9999 },
// //   hintLeft:    { backgroundColor: '#FEF2F2' },
// //   hintRight:   { backgroundColor: '#D1FAE5' },
// //   hintLeftText:  { fontSize: 11, fontWeight: '700', color: '#991B1B' },
// //   hintRightText: { fontSize: 11, fontWeight: '700', color: '#065F46' },

// //   cardWrap: { flex: 1, marginBottom: 12 },

// //   card: {
// //     position: 'absolute',
// //     width: '100%',
// //     height: '100%',
// //     backfaceVisibility: 'hidden',
// //     borderRadius: 20,
// //     padding: 24,
// //     shadowColor: '#000',
// //     shadowOffset: { width: 0, height: 6 },
// //     shadowOpacity: 0.10,
// //     shadowRadius: 16,
// //     elevation: 5,
// //   },
// //   cardFront: {
// //     backgroundColor: '#FFFFFF',
// //     borderWidth: 1,
// //     borderColor: '#E2E8F0',
// //     alignItems: 'center',
// //     justifyContent: 'center',
// //     gap: 20,
// //   },
// //   cardBack: {
// //     backgroundColor: '#FFFFFF',
// //     borderWidth: 1.5,
// //     borderColor: '#10B981',
// //     justifyContent: 'center',
// //     gap: 16,
// //   },

// //   cardBadge: {
// //     backgroundColor: '#EFF6FF',
// //     borderRadius: 9999,
// //     paddingHorizontal: 14,
// //     paddingVertical: 5,
// //     alignSelf: 'center',
// //   },
// //   cardBadgeText: { fontSize: 10, fontWeight: '700', color: '#1D4ED8', letterSpacing: 1 },

// //   questionText: {
// //     fontSize: 17,
// //     fontWeight: '700',
// //     color: '#0F172A',
// //     lineHeight: 28,
// //     textAlign: 'center',
// //   },

// //   tapBtn: {
// //     backgroundColor: '#F1F5F9',
// //     borderRadius: 9999,
// //     paddingHorizontal: 20,
// //     paddingVertical: 10,
// //   },
// //   tapBtnText: { fontSize: 13, color: '#1D4ED8', fontWeight: '600' },

// //   answerRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 14 },
// //   answerCircle: {
// //     width: 46,
// //     height: 46,
// //     borderRadius: 23,
// //     backgroundColor: '#D1FAE5',
// //     alignItems: 'center',
// //     justifyContent: 'center',
// //     flexShrink: 0,
// //   },
// //   answerLetter: { fontSize: 22, fontWeight: '800', color: '#065F46' },
// //   answerText: {
// //     flex: 1,
// //     fontSize: 16,
// //     fontWeight: '700',
// //     color: '#0F172A',
// //     lineHeight: 24,
// //     paddingTop: 10,
// //   },

// //   explanationBox: {
// //     backgroundColor: '#FFFBEB',
// //     borderRadius: 12,
// //     padding: 12,
// //     borderWidth: 1,
// //     borderColor: '#FDE68A',
// //     gap: 4,
// //   },
// //   explanationTitle: { fontSize: 11, fontWeight: '700', color: '#92400E' },
// //   explanationText:  { fontSize: 12, color: '#78350F', lineHeight: 18 },

// //   swipeHint: { fontSize: 10, color: '#94A3B8', textAlign: 'center' },

// //   actionRow: { flexDirection: 'row', gap: 8, marginBottom: 10 },
// //   btnMissed: {
// //     flex: 1,
// //     backgroundColor: '#FEF2F2',
// //     borderRadius: 9999,
// //     paddingVertical: 13,
// //     alignItems: 'center',
// //     borderWidth: 1.5,
// //     borderColor: '#FECACA',
// //   },
// //   btnHard: {
// //     flex: 1,
// //     backgroundColor: '#FEF3C7',
// //     borderRadius: 9999,
// //     paddingVertical: 13,
// //     alignItems: 'center',
// //     borderWidth: 1.5,
// //     borderColor: '#FDE68A',
// //   },
// //   btnEasy: {
// //     flex: 1,
// //     backgroundColor: '#D1FAE5',
// //     borderRadius: 9999,
// //     paddingVertical: 13,
// //     alignItems: 'center',
// //     borderWidth: 1.5,
// //     borderColor: '#A7F3D0',
// //   },
// //   btnMissedText: { fontSize: 12, fontWeight: '700', color: '#991B1B' },
// //   btnHardText:   { fontSize: 12, fontWeight: '700', color: '#92400E' },
// //   btnEasyText:   { fontSize: 12, fontWeight: '700', color: '#065F46' },

// //   bottomBar: {
// //     flexDirection: 'row',
// //     backgroundColor: '#FFFFFF',
// //     borderRadius: 14,
// //     borderWidth: 1,
// //     borderColor: '#E2E8F0',
// //     padding: 12,
// //     marginBottom: 8,
// //     justifyContent: 'space-around',
// //   },
// //   bottomItem: { alignItems: 'center', gap: 2 },
// //   bottomNum:  { fontSize: 18, fontWeight: '800' },
// //   bottomLbl:  { fontSize: 10, color: '#94A3B8', fontWeight: '600' },

// //   // ── Summary ──
// //   summaryWrap: {
// //     flex: 1,
// //     padding: 24,
// //     alignItems: 'center',
// //     justifyContent: 'center',
// //     gap: 16,
// //   },
// //   summaryEmoji:   { fontSize: 56 },
// //   summaryTitle:   { fontSize: 26, fontWeight: '800', color: '#0F172A', letterSpacing: -0.5 },
// //   summarySubject: { fontSize: 11, color: '#94A3B8', fontWeight: '700', letterSpacing: 1 },
// //   summaryStats:   { flexDirection: 'row', gap: 10, width: '100%' },
// //   summaryBox:     { flex: 1, borderRadius: 14, padding: 14, alignItems: 'center', gap: 4 },
// //   summaryNum:     { fontSize: 28, fontWeight: '800' },
// //   summaryLbl:     { fontSize: 11, fontWeight: '700' },
// //   srCard: {
// //     width: '100%',
// //     backgroundColor: '#EFF6FF',
// //     borderRadius: 14,
// //     padding: 14,
// //     gap: 6,
// //     borderWidth: 1,
// //     borderColor: '#BFDBFE',
// //   },
// //   srTitle: { fontSize: 12, fontWeight: '700', color: '#1D4ED8', marginBottom: 4 },
// //   srRow:   { fontSize: 12, color: '#3B82F6', lineHeight: 18 },
// //   drillMissedBtn: {
// //     width: '100%',
// //     backgroundColor: '#FEF2F2',
// //     borderRadius: 9999,
// //     paddingVertical: 15,
// //     alignItems: 'center',
// //     borderWidth: 1.5,
// //     borderColor: '#FECACA',
// //   },
// //   drillMissedText: { fontSize: 14, fontWeight: '700', color: '#991B1B' },
// //   practiceBtn: {
// //     width: '100%',
// //     backgroundColor: '#1D4ED8',
// //     borderRadius: 9999,
// //     paddingVertical: 15,
// //     alignItems: 'center',
// //     shadowColor: '#1D4ED8',
// //     shadowOffset: { width: 0, height: 6 },
// //     shadowOpacity: 0.3,
// //     shadowRadius: 14,
// //     elevation: 6,
// //   },
// //   practiceBtnText: { fontSize: 15, fontWeight: '700', color: '#fff' },
// //   backBtn:         { paddingVertical: 10 },
// //   backBtnText:     { fontSize: 13, color: '#475569', fontWeight: '600' },
// // });


// // ─── FlashcardScreen.tsx ──────────────────────────────────────────
// import React, { useState, useRef, useEffect } from 'react';
// import {
//   View, Text, TouchableOpacity, StyleSheet,
//   Animated, PanResponder, Dimensions, Alert,
// } from 'react-native';
// import { SafeAreaView } from 'react-native-safe-area-context';
// import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
// import { NativeStackNavigationProp } from '@react-navigation/native-stack';
// import { AppStackParamList } from '../../navigation/types';
// import { getDrillQuestions, DrillQuestion } from '../../../config/client';

// type Nav   = NativeStackNavigationProp<AppStackParamList>;
// type Route = RouteProp<AppStackParamList, 'Flashcard'>;

// const { width: SCREEN_WIDTH } = Dimensions.get('window');
// const SWIPE_THRESHOLD = SCREEN_WIDTH * 0.28;

// type Rating = 'easy' | 'hard' | 'missed';

// interface CardResult {
//   questionId: string;
//   rating: Rating;
// }

// export default function FlashcardScreen() {
//   const navigation = useNavigation<Nav>();
//   const route      = useRoute<Route>();
//   const { subjectId, subjectName } = route.params;

//   const [questions, setQuestions]     = useState<DrillQuestion[]>([]);
//   const [loading, setLoading]         = useState(true);
//   const [currentIdx, setCurrentIdx]   = useState(0);
//   const [isFlipped, setIsFlipped]     = useState(false);
//   const [results, setResults]         = useState<CardResult[]>([]);
//   const [showSummary, setShowSummary] = useState(false);

//   // ref so PanResponder always reads latest flip state
//   const isFlippedRef = useRef(false);

//   // ── Animations ────────────────────────────────────────────────
//   const questionOpacity = useRef(new Animated.Value(1)).current;
//   const answerOpacity   = useRef(new Animated.Value(0)).current;
//   const cardOpacity     = useRef(new Animated.Value(1)).current;
//   const swipeX          = useRef(new Animated.Value(0)).current;
//   const swipeTilt       = useRef(new Animated.Value(0)).current;
//   const entranceFade    = useRef(new Animated.Value(0)).current;
//   const entranceSlide   = useRef(new Animated.Value(30)).current;

//   useEffect(() => {
//     Animated.parallel([
//       Animated.timing(entranceFade,  { toValue: 1, duration: 400, useNativeDriver: true }),
//       Animated.spring(entranceSlide, { toValue: 0, tension: 65, friction: 10, useNativeDriver: true }),
//     ]).start();
//     loadQuestions();
//   }, []);

//   const loadQuestions = async () => {
//     try {
//       const qs = await getDrillQuestions(subjectId, 'all', 20, true);
//       if (qs.length === 0) {
//         Alert.alert('No questions', 'Add questions first.', [
//           { text: 'OK', onPress: () => navigation.goBack() },
//         ]);
//         return;
//       }
//       setQuestions(qs);
//     } catch {
//       Alert.alert('Error', 'Could not load questions.');
//       navigation.goBack();
//     } finally {
//       setLoading(false);
//     }
//   };

//   // ── Fade flip ─────────────────────────────────────────────────
//   const handleFlip = () => {
//     if (isFlippedRef.current) return;
//     Animated.parallel([
//       Animated.timing(questionOpacity, { toValue: 0, duration: 180, useNativeDriver: true }),
//       Animated.timing(answerOpacity,   { toValue: 1, duration: 180, useNativeDriver: true }),
//     ]).start(() => {
//       isFlippedRef.current = true;
//       setIsFlipped(true);
//     });
//   };

//   // ── Swipe gesture ─────────────────────────────────────────────
//   const panResponder = useRef(
//     PanResponder.create({
//       onMoveShouldSetPanResponder: (_, g) =>
//         isFlippedRef.current &&
//         Math.abs(g.dx) > 8 &&
//         Math.abs(g.dx) > Math.abs(g.dy),
//       onPanResponderGrant: () => swipeX.stopAnimation(),
//       onPanResponderMove: (_, g) => {
//         swipeX.setValue(g.dx);
//         swipeTilt.setValue(g.dx * 0.04);
//       },
//       onPanResponderRelease: (_, g) => {
//         if (g.dx > SWIPE_THRESHOLD) {
//           triggerRate('easy');
//         } else if (g.dx < -SWIPE_THRESHOLD) {
//           triggerRate('missed');
//         } else {
//           Animated.parallel([
//             Animated.spring(swipeX,    { toValue: 0, useNativeDriver: true }),
//             Animated.spring(swipeTilt, { toValue: 0, useNativeDriver: true }),
//           ]).start();
//         }
//       },
//       onPanResponderTerminate: () => {
//         Animated.parallel([
//           Animated.spring(swipeX,    { toValue: 0, useNativeDriver: true }),
//           Animated.spring(swipeTilt, { toValue: 0, useNativeDriver: true }),
//         ]).start();
//       },
//     })
//   ).current;

//   // ── Rate and advance ──────────────────────────────────────────
//   const triggerRate = (rating: Rating) => {
//     const q        = questions[currentIdx];
//     const newResults = [...results, { questionId: q._id, rating }];
//     const isLast   = currentIdx === questions.length - 1;
//     const exitX    = rating === 'easy' ? SCREEN_WIDTH * 1.6 : -SCREEN_WIDTH * 1.6;

//     Animated.parallel([
//       Animated.timing(swipeX,      { toValue: exitX, duration: 260, useNativeDriver: true }),
//       Animated.timing(cardOpacity, { toValue: 0,     duration: 260, useNativeDriver: true }),
//     ]).start(() => {
//       setResults(newResults);
//       if (isLast) { setShowSummary(true); return; }

//       // Reset for next card
//       swipeX.setValue(0);
//       swipeTilt.setValue(0);
//       cardOpacity.setValue(0);
//       questionOpacity.setValue(1);
//       answerOpacity.setValue(0);
//       isFlippedRef.current = false;
//       setIsFlipped(false);
//       setCurrentIdx(i => i + 1);
//       Animated.timing(cardOpacity, { toValue: 1, duration: 220, useNativeDriver: true }).start();
//     });
//   };

//   // ── Hint opacities ────────────────────────────────────────────
//   const easyHintOpacity = swipeX.interpolate({
//     inputRange: [0, SCREEN_WIDTH * 0.15],
//     outputRange: [0, 1],
//     extrapolate: 'clamp',
//   });
//   const missedHintOpacity = swipeX.interpolate({
//     inputRange: [-SCREEN_WIDTH * 0.15, 0],
//     outputRange: [1, 0],
//     extrapolate: 'clamp',
//   });

//   // ── Summary stats ─────────────────────────────────────────────
//   const easyCount   = results.filter(r => r.rating === 'easy').length;
//   const hardCount   = results.filter(r => r.rating === 'hard').length;
//   const missedCount = results.filter(r => r.rating === 'missed').length;

//   if (loading) {
//     return (
//       <SafeAreaView style={styles.safe}>
//         <View style={styles.center}>
//           <Text style={styles.loadingText}>Loading flashcards...</Text>
//         </View>
//       </SafeAreaView>
//     );
//   }

//   // ── Summary ───────────────────────────────────────────────────
//   if (showSummary) {
//     const emoji = easyCount >= questions.length * 0.7 ? '🔥'
//                 : easyCount >= questions.length * 0.5 ? '💪' : '📖';
//     return (
//       <SafeAreaView style={styles.safe}>
//         <Animated.View style={[styles.summaryWrap, { opacity: entranceFade }]}>
//           <Text style={styles.summaryEmoji}>{emoji}</Text>
//           <Text style={styles.summaryTitle}>Session complete!</Text>
//           <Text style={styles.summarySubject}>{subjectName.toUpperCase()}</Text>

//           <View style={styles.summaryStats}>
//             <View style={[styles.summaryBox, { backgroundColor: '#D1FAE5' }]}>
//               <Text style={[styles.summaryNum, { color: '#065F46' }]}>{easyCount}</Text>
//               <Text style={[styles.summaryLbl, { color: '#047857' }]}>Mastered</Text>
//             </View>
//             <View style={[styles.summaryBox, { backgroundColor: '#FEF3C7' }]}>
//               <Text style={[styles.summaryNum, { color: '#92400E' }]}>{hardCount}</Text>
//               <Text style={[styles.summaryLbl, { color: '#B45309' }]}>Hard</Text>
//             </View>
//             <View style={[styles.summaryBox, { backgroundColor: '#FEF2F2' }]}>
//               <Text style={[styles.summaryNum, { color: '#991B1B' }]}>{missedCount}</Text>
//               <Text style={[styles.summaryLbl, { color: '#DC2626' }]}>Missed</Text>
//             </View>
//           </View>

//           <View style={styles.srCard}>
//             <Text style={styles.srTitle}>📅 Spaced repetition scheduled</Text>
//             {missedCount > 0 && <Text style={styles.srRow}>• {missedCount} missed → show again tomorrow</Text>}
//             {hardCount   > 0 && <Text style={styles.srRow}>• {hardCount} hard → show again in 3 days</Text>}
//             {easyCount   > 0 && <Text style={styles.srRow}>• {easyCount} mastered → show again in 7 days</Text>}
//           </View>

//           {missedCount > 0 && (
//             <TouchableOpacity
//               style={styles.drillMissedBtn}
//               onPress={() => {
//                 const missedIds = results
//                   .filter(r => r.rating === 'missed')
//                   .map(r => r.questionId);
//                 setQuestions(prev => prev.filter(q => missedIds.includes(q._id)));
//                 setResults([]);
//                 setCurrentIdx(0);
//                 setIsFlipped(false);
//                 isFlippedRef.current = false;
//                 swipeX.setValue(0);
//                 cardOpacity.setValue(1);
//                 questionOpacity.setValue(1);
//                 answerOpacity.setValue(0);
//                 setShowSummary(false);
//               }}
//             >
//               <Text style={styles.drillMissedText}>Drill {missedCount} missed cards again</Text>
//             </TouchableOpacity>
//           )}

//           <TouchableOpacity
//             style={styles.practiceBtn}
//             onPress={() => navigation.navigate('DrillSession', { subjectId, subjectName, mode: 'practice' })}
//           >
//             <Text style={styles.practiceBtnText}>Practice Mode →</Text>
//           </TouchableOpacity>

//           <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
//             <Text style={styles.backBtnText}>← Back to {subjectName}</Text>
//           </TouchableOpacity>
//         </Animated.View>
//       </SafeAreaView>
//     );
//   }

//   const q = questions[currentIdx];

//   return (
//     <SafeAreaView style={styles.safe}>
//       <Animated.View style={[styles.container, {
//         opacity: entranceFade,
//         transform: [{ translateY: entranceSlide }],
//       }]}>

//         {/* ── Header ── */}
//         <View style={styles.header}>
//           <TouchableOpacity onPress={() =>
//             Alert.alert('Exit?', 'Your progress will be saved.', [
//               { text: 'Keep going', style: 'cancel' },
//               { text: 'Exit', onPress: () => navigation.goBack() },
//             ])
//           }>
//             <Text style={styles.exitBtn}>✕</Text>
//           </TouchableOpacity>
//           <Text style={styles.progress}>{currentIdx + 1} / {questions.length}</Text>
//           <View style={{ width: 32 }} />
//         </View>

//         {/* ── Progress bar ── */}
//         <View style={styles.progressTrack}>
//           <View style={[styles.progressFill, {
//             width: `${(currentIdx / questions.length) * 100}%`,
//           }]} />
//         </View>

//         <Text style={styles.subjectLabel}>{subjectName}</Text>

//         {/* ── Swipe hints ── */}
//         <View style={styles.hintsRow}>
//           <Animated.View style={[styles.hint, styles.hintLeft, { opacity: missedHintOpacity }]}>
//             <Text style={styles.hintLeftText}>❌ Missed</Text>
//           </Animated.View>
//           <Animated.View style={[styles.hint, styles.hintRight, { opacity: easyHintOpacity }]}>
//             <Text style={styles.hintRightText}>✅ Easy</Text>
//           </Animated.View>
//         </View>

//         {/* ── Card ── */}
//         <Animated.View
//           style={[styles.cardWrap, {
//             opacity: cardOpacity,
//             transform: [
//               { translateX: swipeX },
//               {
//                 rotate: swipeTilt.interpolate({
//                   inputRange: [-20, 20],
//                   outputRange: ['-10deg', '10deg'],
//                   extrapolate: 'clamp',
//                 }),
//               },
//             ],
//           }]}
//           {...panResponder.panHandlers}
//         >
//           {/* ── Question side ── */}
//           <Animated.View
//             style={[StyleSheet.absoluteFill, styles.cardSide, styles.cardFront, { opacity: questionOpacity }]}
//             pointerEvents={isFlipped ? 'none' : 'auto'}
//           >
//             <View style={styles.cardBadge}>
//               <Text style={styles.cardBadgeText}>QUESTION</Text>
//             </View>
//             <Text style={styles.questionText}>{q.question}</Text>
//             <TouchableOpacity style={styles.tapBtn} onPress={handleFlip} activeOpacity={0.75}>
//               <Text style={styles.tapBtnText}>Tap to reveal answer →</Text>
//             </TouchableOpacity>
//           </Animated.View>

//           {/* ── Answer side ── */}
//           <Animated.View
//             style={[StyleSheet.absoluteFill, styles.cardSide, styles.cardBack, { opacity: answerOpacity }]}
//             pointerEvents={isFlipped ? 'auto' : 'none'}
//           >
//             <View style={[styles.cardBadge, { backgroundColor: '#D1FAE5' }]}>
//               <Text style={[styles.cardBadgeText, { color: '#065F46' }]}>ANSWER</Text>
//             </View>
//             <View style={styles.answerRow}>
//               <View style={styles.answerCircle}>
//                 <Text style={styles.answerLetter}>{q.correctOption}</Text>
//               </View>
//               <Text style={styles.answerText}>
//                 {q.options.find(o => o.label === q.correctOption)?.text ?? ''}
//               </Text>
//             </View>
//             {q.explanation ? (
//               <View style={styles.explanationBox}>
//                 <Text style={styles.explanationTitle}>💡 Why</Text>
//                 <Text style={styles.explanationText}>{q.explanation}</Text>
//               </View>
//             ) : null}
//             <Text style={styles.swipeInstruction}>← Swipe left = Missed · Swipe right = Easy →</Text>
//           </Animated.View>
//         </Animated.View>

//         {/* ── Action buttons (shown after flip) ── */}
//         {isFlipped && (
//           <View style={styles.actionRow}>
//             <TouchableOpacity style={styles.btnMissed} onPress={() => triggerRate('missed')} activeOpacity={0.85}>
//               <Text style={styles.btnMissedText}>❌ Missed</Text>
//             </TouchableOpacity>
//             <TouchableOpacity style={styles.btnHard} onPress={() => triggerRate('hard')} activeOpacity={0.85}>
//               <Text style={styles.btnHardText}>😅 Hard</Text>
//             </TouchableOpacity>
//             <TouchableOpacity style={styles.btnEasy} onPress={() => triggerRate('easy')} activeOpacity={0.85}>
//               <Text style={styles.btnEasyText}>✅ Easy</Text>
//             </TouchableOpacity>
//           </View>
//         )}

//         {/* ── Bottom counts ── */}
//         <View style={styles.bottomBar}>
//           <View style={styles.bottomItem}>
//             <Text style={[styles.bottomNum, { color: '#065F46' }]}>
//               {results.filter(r => r.rating === 'easy').length}
//             </Text>
//             <Text style={styles.bottomLbl}>Easy</Text>
//           </View>
//           <View style={styles.bottomItem}>
//             <Text style={[styles.bottomNum, { color: '#92400E' }]}>
//               {results.filter(r => r.rating === 'hard').length}
//             </Text>
//             <Text style={styles.bottomLbl}>Hard</Text>
//           </View>
//           <View style={styles.bottomItem}>
//             <Text style={[styles.bottomNum, { color: '#991B1B' }]}>
//               {results.filter(r => r.rating === 'missed').length}
//             </Text>
//             <Text style={styles.bottomLbl}>Missed</Text>
//           </View>
//           <View style={styles.bottomItem}>
//             <Text style={[styles.bottomNum, { color: '#94A3B8' }]}>
//               {questions.length - currentIdx - 1}
//             </Text>
//             <Text style={styles.bottomLbl}>Left</Text>
//           </View>
//         </View>

//       </Animated.View>
//     </SafeAreaView>
//   );
// }

// const styles = StyleSheet.create({
//   safe:        { flex: 1, backgroundColor: '#F8FAFC' },
//   center:      { flex: 1, alignItems: 'center', justifyContent: 'center' },
//   loadingText: { fontSize: 14, color: '#94A3B8' },
//   container:   { flex: 1, paddingHorizontal: 16 },

//   header: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     paddingTop: 12,
//     paddingBottom: 8,
//   },
//   exitBtn:  { fontSize: 18, color: '#94A3B8', fontWeight: '600', padding: 4 },
//   progress: { fontSize: 15, fontWeight: '700', color: '#0F172A' },

//   progressTrack: { height: 4, backgroundColor: '#E2E8F0', borderRadius: 2, marginBottom: 10 },
//   progressFill:  { height: 4, backgroundColor: '#1D4ED8', borderRadius: 2 },

//   subjectLabel: {
//     fontSize: 11,
//     fontWeight: '700',
//     color: '#94A3B8',
//     letterSpacing: 1,
//     textTransform: 'uppercase',
//     textAlign: 'center',
//     marginBottom: 10,
//   },

//   hintsRow:      { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8, height: 26 },
//   hint:          { paddingHorizontal: 12, paddingVertical: 4, borderRadius: 9999 },
//   hintLeft:      { backgroundColor: '#FEF2F2' },
//   hintRight:     { backgroundColor: '#D1FAE5' },
//   hintLeftText:  { fontSize: 11, fontWeight: '700', color: '#991B1B' },
//   hintRightText: { fontSize: 11, fontWeight: '700', color: '#065F46' },

//   cardWrap: { flex: 1, marginBottom: 12 },

//   cardSide: {
//     borderRadius: 20,
//     padding: 24,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 6 },
//     shadowOpacity: 0.08,
//     shadowRadius: 16,
//     elevation: 4,
//   },
//   cardFront: {
//     backgroundColor: '#FFFFFF',
//     borderWidth: 1,
//     borderColor: '#E2E8F0',
//     alignItems: 'center',
//     justifyContent: 'center',
//     gap: 20,
//   },
//   cardBack: {
//     backgroundColor: '#FFFFFF',
//     borderWidth: 1.5,
//     borderColor: '#10B981',
//     justifyContent: 'center',
//     gap: 16,
//   },

//   cardBadge: {
//     backgroundColor: '#EFF6FF',
//     borderRadius: 9999,
//     paddingHorizontal: 14,
//     paddingVertical: 5,
//     alignSelf: 'center',
//   },
//   cardBadgeText: { fontSize: 10, fontWeight: '700', color: '#1D4ED8', letterSpacing: 1 },

//   questionText: {
//     fontSize: 17,
//     fontWeight: '700',
//     color: '#0F172A',
//     lineHeight: 28,
//     textAlign: 'center',
//   },
//   tapBtn: {
//     backgroundColor: '#F1F5F9',
//     borderRadius: 9999,
//     paddingHorizontal: 20,
//     paddingVertical: 10,
//   },
//   tapBtnText: { fontSize: 13, color: '#1D4ED8', fontWeight: '600' },

//   answerRow:    { flexDirection: 'row', alignItems: 'flex-start', gap: 14 },
//   answerCircle: {
//     width: 46,
//     height: 46,
//     borderRadius: 23,
//     backgroundColor: '#D1FAE5',
//     alignItems: 'center',
//     justifyContent: 'center',
//     flexShrink: 0,
//   },
//   answerLetter: { fontSize: 22, fontWeight: '800', color: '#065F46' },
//   answerText:   { flex: 1, fontSize: 16, fontWeight: '700', color: '#0F172A', lineHeight: 24, paddingTop: 10 },

//   explanationBox: {
//     backgroundColor: '#FFFBEB',
//     borderRadius: 12,
//     padding: 12,
//     borderWidth: 1,
//     borderColor: '#FDE68A',
//     gap: 4,
//   },
//   explanationTitle: { fontSize: 11, fontWeight: '700', color: '#92400E' },
//   explanationText:  { fontSize: 12, color: '#78350F', lineHeight: 18 },

//   swipeInstruction: { fontSize: 10, color: '#94A3B8', textAlign: 'center' },

//   actionRow: { flexDirection: 'row', gap: 8, marginBottom: 10 },
//   btnMissed: {
//     flex: 1, backgroundColor: '#FEF2F2', borderRadius: 9999,
//     paddingVertical: 13, alignItems: 'center',
//     borderWidth: 1.5, borderColor: '#FECACA',
//   },
//   btnHard: {
//     flex: 1, backgroundColor: '#FEF3C7', borderRadius: 9999,
//     paddingVertical: 13, alignItems: 'center',
//     borderWidth: 1.5, borderColor: '#FDE68A',
//   },
//   btnEasy: {
//     flex: 1, backgroundColor: '#D1FAE5', borderRadius: 9999,
//     paddingVertical: 13, alignItems: 'center',
//     borderWidth: 1.5, borderColor: '#A7F3D0',
//   },
//   btnMissedText: { fontSize: 12, fontWeight: '700', color: '#991B1B' },
//   btnHardText:   { fontSize: 12, fontWeight: '700', color: '#92400E' },
//   btnEasyText:   { fontSize: 12, fontWeight: '700', color: '#065F46' },

//   bottomBar: {
//     flexDirection: 'row',
//     backgroundColor: '#FFFFFF',
//     borderRadius: 14,
//     borderWidth: 1,
//     borderColor: '#E2E8F0',
//     padding: 12,
//     marginBottom: 8,
//     justifyContent: 'space-around',
//   },
//   bottomItem: { alignItems: 'center', gap: 2 },
//   bottomNum:  { fontSize: 18, fontWeight: '800' },
//   bottomLbl:  { fontSize: 10, color: '#94A3B8', fontWeight: '600' },

//   // Summary
//   summaryWrap:    { flex: 1, padding: 24, alignItems: 'center', justifyContent: 'center', gap: 16 },
//   summaryEmoji:   { fontSize: 56 },
//   summaryTitle:   { fontSize: 26, fontWeight: '800', color: '#0F172A', letterSpacing: -0.5 },
//   summarySubject: { fontSize: 11, color: '#94A3B8', fontWeight: '700', letterSpacing: 1 },
//   summaryStats:   { flexDirection: 'row', gap: 10, width: '100%' },
//   summaryBox:     { flex: 1, borderRadius: 14, padding: 14, alignItems: 'center', gap: 4 },
//   summaryNum:     { fontSize: 28, fontWeight: '800' },
//   summaryLbl:     { fontSize: 11, fontWeight: '700' },
//   srCard: {
//     width: '100%', backgroundColor: '#EFF6FF', borderRadius: 14,
//     padding: 14, gap: 6, borderWidth: 1, borderColor: '#BFDBFE',
//   },
//   srTitle: { fontSize: 12, fontWeight: '700', color: '#1D4ED8', marginBottom: 4 },
//   srRow:   { fontSize: 12, color: '#3B82F6', lineHeight: 18 },
//   drillMissedBtn: {
//     width: '100%', backgroundColor: '#FEF2F2', borderRadius: 9999,
//     paddingVertical: 15, alignItems: 'center',
//     borderWidth: 1.5, borderColor: '#FECACA',
//   },
//   drillMissedText: { fontSize: 14, fontWeight: '700', color: '#991B1B' },
//   practiceBtn: {
//     width: '100%', backgroundColor: '#1D4ED8', borderRadius: 9999,
//     paddingVertical: 15, alignItems: 'center',
//     shadowColor: '#1D4ED8', shadowOffset: { width: 0, height: 6 },
//     shadowOpacity: 0.3, shadowRadius: 14, elevation: 6,
//   },
//   practiceBtnText: { fontSize: 15, fontWeight: '700', color: '#fff' },
//   backBtn:         { paddingVertical: 10 },
//   backBtnText:     { fontSize: 13, color: '#475569', fontWeight: '600' },
// });

// ─── FlashcardScreen.tsx ──────────────────────────────────────────
import React, { useState, useRef, useEffect } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet,
  Animated, PanResponder, Dimensions, Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AppStackParamList } from '../../navigation/types';
import { getDrillQuestions, flagQuestion, DrillQuestion } from '../../../config/client';

type Nav   = NativeStackNavigationProp<AppStackParamList>;
type Route = RouteProp<AppStackParamList, 'Flashcard'>;

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const SWIPE_THRESHOLD = SCREEN_WIDTH * 0.28;

type Rating = 'easy' | 'hard' | 'missed';

interface CardResult {
  questionId: string;
  rating: Rating;
}

export default function FlashcardScreen() {
  const navigation = useNavigation<Nav>();
  const route      = useRoute<Route>();
  const { subjectId, subjectName } = route.params;

  const [questions, setQuestions]     = useState<DrillQuestion[]>([]);
  const [loading, setLoading]         = useState(true);
  const [currentIdx, setCurrentIdx]   = useState(0);
  const [isFlipped, setIsFlipped]     = useState(false);
  const [results, setResults]         = useState<CardResult[]>([]);
  const [showSummary, setShowSummary] = useState(false);

  // ref so PanResponder always reads latest flip state
  const isFlippedRef = useRef(false);

  // ── Animations ────────────────────────────────────────────────
  const questionOpacity = useRef(new Animated.Value(1)).current;
  const answerOpacity   = useRef(new Animated.Value(0)).current;
  const cardOpacity     = useRef(new Animated.Value(1)).current;
  const swipeX          = useRef(new Animated.Value(0)).current;
  const swipeTilt       = useRef(new Animated.Value(0)).current;
  const entranceFade    = useRef(new Animated.Value(0)).current;
  const entranceSlide   = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(entranceFade,  { toValue: 1, duration: 400, useNativeDriver: true }),
      Animated.spring(entranceSlide, { toValue: 0, tension: 65, friction: 10, useNativeDriver: true }),
    ]).start();
    loadQuestions();
  }, []);

  const loadQuestions = async () => {
    try {
      const qs = await getDrillQuestions(subjectId, 'all', 20, true);
      if (qs.length === 0) {
        Alert.alert('No questions', 'Add questions first.', [
          { text: 'OK', onPress: () => navigation.goBack() },
        ]);
        return;
      }
      setQuestions(qs);
    } catch {
      Alert.alert('Error', 'Could not load questions.');
      navigation.goBack();
    } finally {
      setLoading(false);
    }
  };

  // ── Fade flip ─────────────────────────────────────────────────
  const handleFlip = () => {
    if (isFlippedRef.current) return;
    Animated.parallel([
      Animated.timing(questionOpacity, { toValue: 0, duration: 180, useNativeDriver: true }),
      Animated.timing(answerOpacity,   { toValue: 1, duration: 180, useNativeDriver: true }),
    ]).start(() => {
      isFlippedRef.current = true;
      setIsFlipped(true);
    });
  };

  // ── Swipe gesture ─────────────────────────────────────────────
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => isFlippedRef.current,
      onMoveShouldSetPanResponder: (_, g) =>
        isFlippedRef.current &&
        Math.abs(g.dx) > 5 &&
        Math.abs(g.dx) > Math.abs(g.dy),
      onPanResponderGrant: () => swipeX.stopAnimation(),
      onPanResponderMove: (_, g) => {
        swipeX.setValue(g.dx);
        swipeTilt.setValue(g.dx * 0.04);
      },
      onPanResponderRelease: (_, g) => {
        if (g.dx > SWIPE_THRESHOLD) {
          triggerRate('easy');
        } else if (g.dx < -SWIPE_THRESHOLD) {
          triggerRate('missed');
        } else {
          Animated.parallel([
            Animated.spring(swipeX,    { toValue: 0, useNativeDriver: true }),
            Animated.spring(swipeTilt, { toValue: 0, useNativeDriver: true }),
          ]).start();
        }
      },
      onPanResponderTerminate: () => {
        Animated.parallel([
          Animated.spring(swipeX,    { toValue: 0, useNativeDriver: true }),
          Animated.spring(swipeTilt, { toValue: 0, useNativeDriver: true }),
        ]).start();
      },
    })
  ).current;

  // ── Rate and advance ──────────────────────────────────────────
  const triggerRate = (rating: Rating) => {
    const q        = questions[currentIdx];
    const newResults = [...results, { questionId: q._id, rating }];

    // Save spaced repetition to backend
    if (rating === 'missed') {
      flagQuestion(q._id, 'isWeak', true).catch(() => {});
    } else if (rating === 'easy') {
      flagQuestion(q._id, 'isWeak', false).catch(() => {});
    }
    // hard = leave weak status unchanged
    const isLast   = currentIdx === questions.length - 1;
    const exitX    = rating === 'easy' ? SCREEN_WIDTH * 1.6 : -SCREEN_WIDTH * 1.6;

    Animated.parallel([
      Animated.timing(swipeX,      { toValue: exitX, duration: 260, useNativeDriver: true }),
      Animated.timing(cardOpacity, { toValue: 0,     duration: 260, useNativeDriver: true }),
    ]).start(() => {
      setResults(newResults);
      if (isLast) { setShowSummary(true); return; }

      // Reset for next card
      swipeX.setValue(0);
      swipeTilt.setValue(0);
      cardOpacity.setValue(0);
      questionOpacity.setValue(1);
      answerOpacity.setValue(0);
      isFlippedRef.current = false;
      setIsFlipped(false);
      setCurrentIdx(i => i + 1);
      Animated.timing(cardOpacity, { toValue: 1, duration: 220, useNativeDriver: true }).start();
    });
  };

  // ── Hint opacities ────────────────────────────────────────────
  const easyHintOpacity = swipeX.interpolate({
    inputRange: [0, SCREEN_WIDTH * 0.15],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });
  const missedHintOpacity = swipeX.interpolate({
    inputRange: [-SCREEN_WIDTH * 0.15, 0],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });

  // ── Summary stats ─────────────────────────────────────────────
  const easyCount   = results.filter(r => r.rating === 'easy').length;
  const hardCount   = results.filter(r => r.rating === 'hard').length;
  const missedCount = results.filter(r => r.rating === 'missed').length;

  if (loading) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.center}>
          <Text style={styles.loadingText}>Loading flashcards...</Text>
        </View>
      </SafeAreaView>
    );
  }

  // ── Summary ───────────────────────────────────────────────────
  if (showSummary) {
    const emoji = easyCount >= questions.length * 0.7 ? '🔥'
                : easyCount >= questions.length * 0.5 ? '💪' : '📖';
    return (
      <SafeAreaView style={styles.safe}>
        <Animated.View style={[styles.summaryWrap, { opacity: entranceFade }]}>
          <Text style={styles.summaryEmoji}>{emoji}</Text>
          <Text style={styles.summaryTitle}>Session complete!</Text>
          <Text style={styles.summarySubject}>{subjectName.toUpperCase()}</Text>

          <View style={styles.summaryStats}>
            <View style={[styles.summaryBox, { backgroundColor: '#D1FAE5' }]}>
              <Text style={[styles.summaryNum, { color: '#065F46' }]}>{easyCount}</Text>
              <Text style={[styles.summaryLbl, { color: '#047857' }]}>Mastered</Text>
            </View>
            <View style={[styles.summaryBox, { backgroundColor: '#FEF3C7' }]}>
              <Text style={[styles.summaryNum, { color: '#92400E' }]}>{hardCount}</Text>
              <Text style={[styles.summaryLbl, { color: '#B45309' }]}>Hard</Text>
            </View>
            <View style={[styles.summaryBox, { backgroundColor: '#FEF2F2' }]}>
              <Text style={[styles.summaryNum, { color: '#991B1B' }]}>{missedCount}</Text>
              <Text style={[styles.summaryLbl, { color: '#DC2626' }]}>Missed</Text>
            </View>
          </View>

          <View style={styles.srCard}>
            <Text style={styles.srTitle}>📅 Spaced repetition scheduled</Text>
            {missedCount > 0 && <Text style={styles.srRow}>• {missedCount} missed → show again tomorrow</Text>}
            {hardCount   > 0 && <Text style={styles.srRow}>• {hardCount} hard → show again in 3 days</Text>}
            {easyCount   > 0 && <Text style={styles.srRow}>• {easyCount} mastered → show again in 7 days</Text>}
          </View>

          {missedCount > 0 && (
            <TouchableOpacity
              style={styles.drillMissedBtn}
              onPress={() => {
                const missedIds = results
                  .filter(r => r.rating === 'missed')
                  .map(r => r.questionId);
                setQuestions(prev => prev.filter(q => missedIds.includes(q._id)));
                setResults([]);
                setCurrentIdx(0);
                setIsFlipped(false);
                isFlippedRef.current = false;
                swipeX.setValue(0);
                cardOpacity.setValue(1);
                questionOpacity.setValue(1);
                answerOpacity.setValue(0);
                setShowSummary(false);
              }}
            >
              <Text style={styles.drillMissedText}>Drill {missedCount} missed cards again</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity
            style={styles.practiceBtn}
            onPress={() => navigation.navigate('DrillSession', { subjectId, subjectName, mode: 'practice' })}
          >
            <Text style={styles.practiceBtnText}>Practice Mode →</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
            <Text style={styles.backBtnText}>← Back to {subjectName}</Text>
          </TouchableOpacity>
        </Animated.View>
      </SafeAreaView>
    );
  }

  const q = questions[currentIdx];

  return (
    <SafeAreaView style={styles.safe}>
      <Animated.View style={[styles.container, {
        opacity: entranceFade,
        transform: [{ translateY: entranceSlide }],
      }]}>

        {/* ── Header ── */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() =>
            Alert.alert('Exit?', 'Your progress will be saved.', [
              { text: 'Keep going', style: 'cancel' },
              { text: 'Exit', onPress: () => navigation.goBack() },
            ])
          }>
            <Text style={styles.exitBtn}>✕</Text>
          </TouchableOpacity>
          <Text style={styles.progress}>{currentIdx + 1} / {questions.length}</Text>
          <View style={{ width: 32 }} />
        </View>

        {/* ── Progress bar ── */}
        <View style={styles.progressTrack}>
          <View style={[styles.progressFill, {
            width: `${((currentIdx + 1) / questions.length) * 100}%`,
          }]} />
        </View>

        <Text style={styles.subjectLabel}>{subjectName}</Text>

        {/* ── Swipe hints ── */}
        <View style={styles.hintsRow}>
          <Animated.View style={[styles.hint, styles.hintLeft, { opacity: missedHintOpacity }]}>
            <Text style={styles.hintLeftText}>❌ Missed</Text>
          </Animated.View>
          <Animated.View style={[styles.hint, styles.hintRight, { opacity: easyHintOpacity }]}>
            <Text style={styles.hintRightText}>✅ Easy</Text>
          </Animated.View>
        </View>

        {/* ── Card ── */}
        <Animated.View
          style={[styles.cardWrap, {
            opacity: cardOpacity,
            transform: [
              { translateX: swipeX },
              {
                rotate: swipeTilt.interpolate({
                  inputRange: [-20, 20],
                  outputRange: ['-10deg', '10deg'],
                  extrapolate: 'clamp',
                }),
              },
            ],
          }]}
          {...panResponder.panHandlers}
        >
          {/* ── Question side ── */}
          <Animated.View
            style={[StyleSheet.absoluteFill, styles.cardSide, styles.cardFront, { opacity: questionOpacity }]}
            pointerEvents={isFlipped ? 'none' : 'auto'}
          >
            <View style={styles.cardBadge}>
              <Text style={styles.cardBadgeText}>QUESTION</Text>
            </View>
            <Text style={styles.questionText}>{q.question}</Text>
            <TouchableOpacity style={styles.tapBtn} onPress={handleFlip} activeOpacity={0.75}>
              <Text style={styles.tapBtnText}>Tap to reveal answer →</Text>
            </TouchableOpacity>
          </Animated.View>

          {/* ── Answer side ── */}
          <Animated.View
            style={[StyleSheet.absoluteFill, styles.cardSide, styles.cardBack, { opacity: answerOpacity }]}
            pointerEvents={isFlipped ? 'auto' : 'none'}
          >
            <View style={[styles.cardBadge, { backgroundColor: '#D1FAE5' }]}>
              <Text style={[styles.cardBadgeText, { color: '#065F46' }]}>ANSWER</Text>
            </View>
            <View style={styles.answerRow}>
              <View style={styles.answerCircle}>
                <Text style={styles.answerLetter}>{q.correctOption}</Text>
              </View>
              <Text style={styles.answerText}>
                {q.options.find(o => o.label === q.correctOption)?.text ?? ''}
              </Text>
            </View>
            {q.explanation ? (
              <View style={styles.explanationBox}>
                <Text style={styles.explanationTitle}>💡 Why</Text>
                <Text style={styles.explanationText}>{q.explanation}</Text>
              </View>
            ) : null}
            <Text style={styles.swipeInstruction}>← Swipe left = Missed · Swipe right = Easy →</Text>
          </Animated.View>
        </Animated.View>

        {/* ── Action buttons (shown after flip) ── */}
        {isFlipped && (
          <View style={styles.actionRow}>
            <TouchableOpacity style={styles.btnMissed} onPress={() => triggerRate('missed')} activeOpacity={0.85}>
              <Text style={styles.btnMissedText}>❌ Missed</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.btnHard} onPress={() => triggerRate('hard')} activeOpacity={0.85}>
              <Text style={styles.btnHardText}>😅 Hard</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.btnEasy} onPress={() => triggerRate('easy')} activeOpacity={0.85}>
              <Text style={styles.btnEasyText}>✅ Easy</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* ── Bottom counts ── */}
        <View style={styles.bottomBar}>
          <View style={styles.bottomItem}>
            <Text style={[styles.bottomNum, { color: '#065F46' }]}>
              {results.filter(r => r.rating === 'easy').length}
            </Text>
            <Text style={styles.bottomLbl}>Easy</Text>
          </View>
          <View style={styles.bottomItem}>
            <Text style={[styles.bottomNum, { color: '#92400E' }]}>
              {results.filter(r => r.rating === 'hard').length}
            </Text>
            <Text style={styles.bottomLbl}>Hard</Text>
          </View>
          <View style={styles.bottomItem}>
            <Text style={[styles.bottomNum, { color: '#991B1B' }]}>
              {results.filter(r => r.rating === 'missed').length}
            </Text>
            <Text style={styles.bottomLbl}>Missed</Text>
          </View>
          <View style={styles.bottomItem}>
            <Text style={[styles.bottomNum, { color: '#94A3B8' }]}>
              {questions.length - currentIdx - 1}
            </Text>
            <Text style={styles.bottomLbl}>Left</Text>
          </View>
        </View>

      </Animated.View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe:        { flex: 1, backgroundColor: '#F8FAFC' },
  center:      { flex: 1, alignItems: 'center', justifyContent: 'center' },
  loadingText: { fontSize: 14, color: '#94A3B8' },
  container:   { flex: 1, paddingHorizontal: 16 },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    paddingBottom: 8,
  },
  exitBtn:  { fontSize: 18, color: '#94A3B8', fontWeight: '600', padding: 4 },
  progress: { fontSize: 15, fontWeight: '700', color: '#0F172A' },

  progressTrack: { height: 4, backgroundColor: '#E2E8F0', borderRadius: 2, marginBottom: 10 },
  progressFill:  { height: 4, backgroundColor: '#1D4ED8', borderRadius: 2 },

  subjectLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#94A3B8',
    letterSpacing: 1,
    textTransform: 'uppercase',
    textAlign: 'center',
    marginBottom: 10,
  },

  hintsRow:      { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8, height: 26 },
  hint:          { paddingHorizontal: 12, paddingVertical: 4, borderRadius: 9999 },
  hintLeft:      { backgroundColor: '#FEF2F2' },
  hintRight:     { backgroundColor: '#D1FAE5' },
  hintLeftText:  { fontSize: 11, fontWeight: '700', color: '#991B1B' },
  hintRightText: { fontSize: 11, fontWeight: '700', color: '#065F46' },

  cardWrap: { flex: 1, marginBottom: 12 },

  cardSide: {
    borderRadius: 20,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 4,
  },
  cardFront: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 20,
  },
  cardBack: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#10B981',
    justifyContent: 'center',
    gap: 16,
  },

  cardBadge: {
    backgroundColor: '#EFF6FF',
    borderRadius: 9999,
    paddingHorizontal: 14,
    paddingVertical: 5,
    alignSelf: 'center',
  },
  cardBadgeText: { fontSize: 10, fontWeight: '700', color: '#1D4ED8', letterSpacing: 1 },

  questionText: {
    fontSize: 17,
    fontWeight: '700',
    color: '#0F172A',
    lineHeight: 28,
    textAlign: 'center',
  },
  tapBtn: {
    backgroundColor: '#F1F5F9',
    borderRadius: 9999,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  tapBtnText: { fontSize: 13, color: '#1D4ED8', fontWeight: '600' },

  answerRow:    { flexDirection: 'row', alignItems: 'flex-start', gap: 14 },
  answerCircle: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: '#D1FAE5',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  answerLetter: { fontSize: 22, fontWeight: '800', color: '#065F46' },
  answerText:   { flex: 1, fontSize: 16, fontWeight: '700', color: '#0F172A', lineHeight: 24, paddingTop: 10 },

  explanationBox: {
    backgroundColor: '#FFFBEB',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#FDE68A',
    gap: 4,
  },
  explanationTitle: { fontSize: 11, fontWeight: '700', color: '#92400E' },
  explanationText:  { fontSize: 12, color: '#78350F', lineHeight: 18 },

  swipeInstruction: { fontSize: 10, color: '#94A3B8', textAlign: 'center' },

  actionRow: { flexDirection: 'row', gap: 8, marginBottom: 10 },
  btnMissed: {
    flex: 1, backgroundColor: '#FEF2F2', borderRadius: 9999,
    paddingVertical: 13, alignItems: 'center',
    borderWidth: 1.5, borderColor: '#FECACA',
  },
  btnHard: {
    flex: 1, backgroundColor: '#FEF3C7', borderRadius: 9999,
    paddingVertical: 13, alignItems: 'center',
    borderWidth: 1.5, borderColor: '#FDE68A',
  },
  btnEasy: {
    flex: 1, backgroundColor: '#D1FAE5', borderRadius: 9999,
    paddingVertical: 13, alignItems: 'center',
    borderWidth: 1.5, borderColor: '#A7F3D0',
  },
  btnMissedText: { fontSize: 12, fontWeight: '700', color: '#991B1B' },
  btnHardText:   { fontSize: 12, fontWeight: '700', color: '#92400E' },
  btnEasyText:   { fontSize: 12, fontWeight: '700', color: '#065F46' },

  bottomBar: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 12,
    marginBottom: 8,
    justifyContent: 'space-around',
  },
  bottomItem: { alignItems: 'center', gap: 2 },
  bottomNum:  { fontSize: 18, fontWeight: '800' },
  bottomLbl:  { fontSize: 10, color: '#94A3B8', fontWeight: '600' },

  // Summary
  summaryWrap:    { flex: 1, padding: 24, alignItems: 'center', justifyContent: 'center', gap: 16 },
  summaryEmoji:   { fontSize: 56 },
  summaryTitle:   { fontSize: 26, fontWeight: '800', color: '#0F172A', letterSpacing: -0.5 },
  summarySubject: { fontSize: 11, color: '#94A3B8', fontWeight: '700', letterSpacing: 1 },
  summaryStats:   { flexDirection: 'row', gap: 10, width: '100%' },
  summaryBox:     { flex: 1, borderRadius: 14, padding: 14, alignItems: 'center', gap: 4 },
  summaryNum:     { fontSize: 28, fontWeight: '800' },
  summaryLbl:     { fontSize: 11, fontWeight: '700' },
  srCard: {
    width: '100%', backgroundColor: '#EFF6FF', borderRadius: 14,
    padding: 14, gap: 6, borderWidth: 1, borderColor: '#BFDBFE',
  },
  srTitle: { fontSize: 12, fontWeight: '700', color: '#1D4ED8', marginBottom: 4 },
  srRow:   { fontSize: 12, color: '#3B82F6', lineHeight: 18 },
  drillMissedBtn: {
    width: '100%', backgroundColor: '#FEF2F2', borderRadius: 9999,
    paddingVertical: 15, alignItems: 'center',
    borderWidth: 1.5, borderColor: '#FECACA',
  },
  drillMissedText: { fontSize: 14, fontWeight: '700', color: '#991B1B' },
  practiceBtn: {
    width: '100%', backgroundColor: '#1D4ED8', borderRadius: 9999,
    paddingVertical: 15, alignItems: 'center',
    shadowColor: '#1D4ED8', shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3, shadowRadius: 14, elevation: 6,
  },
  practiceBtnText: { fontSize: 15, fontWeight: '700', color: '#fff' },
  backBtn:         { paddingVertical: 10 },
  backBtnText:     { fontSize: 13, color: '#475569', fontWeight: '600' },
});