


// // ─── DrillResultsScreen.tsx ───────────────────────────────────────
// import React from 'react';
// import {
//   View, Text, ScrollView, TouchableOpacity,
//   StyleSheet, Share,
// } from 'react-native';
// import { SafeAreaView } from 'react-native-safe-area-context';
// import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
// import { NativeStackNavigationProp } from '@react-navigation/native-stack';
// import { AppStackParamList } from '../../navigation/types';
// import { Colors, FontSize, Radius, Spacing, Shadows } from '../../theme';
// import CCCard from '../../components/CCCard';

// type Nav   = NativeStackNavigationProp<AppStackParamList>;
// type Route = RouteProp<AppStackParamList, 'DrillResults'>;

// export default function DrillResultsScreen() {
//   const navigation = useNavigation<Nav>();
//   const route      = useRoute<Route>();
//   const { result, subjectId, subjectName, mode } = route.params;

//   const { score, correctCount, totalQuestions, durationSeconds, wrongQuestions } = result;

//   const percentage   = Math.round((correctCount / totalQuestions) * 100);
//   const scoreColor   = score >= 8 ? '#059669' : score >= 5 ? Colors.brand : '#DC2626';
//   const scoreEmoji   = score >= 8 ? '🔥' : score >= 5 ? '💪' : '📖';
//   const scoreMessage = score >= 8
//     ? "Excellent! You're ready for this."
//     : score >= 5
//     ? 'Good progress. Keep drilling.'
//     : "Keep going — you'll get there.";

//   const handleShare = async () => {
//     try {
//       await Share.share({
//         message: `I just scored ${score}/10 on ${subjectName} on EduXL! 📚 Study smart, pass the test.`,
//       });
//     } catch {}
//   };

//   const formatDuration = (secs: number) => {
//     if (secs < 60) return `${secs}s`;
//     return `${Math.floor(secs / 60)}m ${secs % 60}s`;
//   };

//   return (
//     <SafeAreaView style={styles.safe}>
//       <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

//         {/* Score hero */}
//         <View style={styles.hero}>
//           <Text style={styles.heroEmoji}>{scoreEmoji}</Text>
//           <Text style={[styles.scoreText, { color: scoreColor }]}>{score}/10</Text>
//           <Text style={styles.scorePercent}>{percentage}% correct</Text>
//           <Text style={styles.scoreMessage}>{scoreMessage}</Text>
//           <Text style={styles.subjectLabel}>{subjectName} · {mode} mode</Text>
//         </View>

//         {/* Stats row */}
//         <View style={styles.statsRow}>
//           <View style={styles.statBox}>
//             <Text style={[styles.statNum, { color: '#059669' }]}>{correctCount}</Text>
//             <Text style={styles.statLabel}>Correct</Text>
//           </View>
//           <View style={styles.statBox}>
//             <Text style={[styles.statNum, { color: '#DC2626' }]}>{totalQuestions - correctCount}</Text>
//             <Text style={styles.statLabel}>Wrong</Text>
//           </View>
//           <View style={styles.statBox}>
//             <Text style={styles.statNum}>{formatDuration(durationSeconds)}</Text>
//             <Text style={styles.statLabel}>Time</Text>
//           </View>
//         </View>

//         {/* Wrong questions breakdown */}
//         {wrongQuestions.length > 0 && (
//           <>
//             <Text style={styles.sectionTitle}>Questions to review</Text>
//             {wrongQuestions.map((wq, i) => (
//               <CCCard key={i} style={styles.wrongCard}>
//                 <Text style={styles.wrongQ}>{wq.question}</Text>
//                 <View style={styles.wrongAnswers}>
//                   <View style={styles.wrongRow}>
//                     <Text style={styles.wrongLabel}>Your answer:</Text>
//                     <Text style={styles.wrongSelected}>{wq.selectedOption}</Text>
//                   </View>
//                   <View style={styles.wrongRow}>
//                     <Text style={styles.wrongLabel}>Correct:</Text>
//                     <Text style={styles.wrongCorrect}>{wq.correctOption}</Text>
//                   </View>
//                 </View>
//                 {wq.explanation && (
//                   <View style={styles.explanationBox}>
//                     <Text style={styles.explanationText}>💡 {wq.explanation}</Text>
//                   </View>
//                 )}
//               </CCCard>
//             ))}
//           </>
//         )}

//         {/* Action buttons */}
//         <TouchableOpacity
//           style={styles.primaryBtn}
//           onPress={() => navigation.navigate('DrillSession', { subjectId, subjectName, mode })}
//         >
//           <Text style={styles.primaryBtnText}>Try again</Text>
//         </TouchableOpacity>

//         {wrongQuestions.length > 0 && (
//           <TouchableOpacity
//             style={[styles.primaryBtn, styles.weakBtn]}
//             onPress={() => navigation.navigate('DrillSession', { subjectId, subjectName, mode: 'weak' })}
//           >
//             <Text style={styles.primaryBtnText}>Drill weak questions ⚠️</Text>
//           </TouchableOpacity>
//         )}

//         <TouchableOpacity style={styles.secondaryBtn} onPress={handleShare}>
//           <Text style={styles.secondaryBtnText}>Share score 📤</Text>
//         </TouchableOpacity>

//         <TouchableOpacity
//           style={styles.backBtn}
//           onPress={() => navigation.navigate('DrillSubject', { subjectId, subjectName })}
//         >
//           <Text style={styles.backBtnText}>← Back to {subjectName}</Text>
//         </TouchableOpacity>

//       </ScrollView>
//     </SafeAreaView>
//   );
// }

// const styles = StyleSheet.create({
//   safe:   { flex: 1, backgroundColor: Colors.background },
//   scroll: { padding: Spacing.lg, paddingBottom: Spacing['5xl'] },
//   hero:   { alignItems: 'center', paddingVertical: Spacing['2xl'], marginBottom: Spacing['2xl'] },
//   heroEmoji: { fontSize: 52, marginBottom: 8 },
//   scoreText: { fontSize: 64, fontWeight: '800', lineHeight: 72 },
//   scorePercent: { fontSize: FontSize.heading3, fontWeight: '700', color: Colors.textSecondary, marginTop: 4 },
//   scoreMessage: { fontSize: FontSize.bodyLarge, color: Colors.textSecondary, marginTop: 8, textAlign: 'center' },
//   subjectLabel: { fontSize: FontSize.caption, color: Colors.textMuted, marginTop: 8, textTransform: 'capitalize' },
//   statsRow: { flexDirection: 'row', gap: 8, marginBottom: Spacing['2xl'] },
//   statBox: { flex: 1, backgroundColor: Colors.surface, borderRadius: Radius.md, padding: 12, alignItems: 'center', borderWidth: 1, borderColor: Colors.border },
//   statNum: { fontSize: FontSize.heading2, fontWeight: '800', color: Colors.textPrimary },
//   statLabel: { fontSize: FontSize.micro, color: Colors.textMuted, marginTop: 2 },
//   sectionTitle: { fontSize: FontSize.heading3, fontWeight: '700', color: Colors.textPrimary, marginBottom: Spacing.md },
//   wrongCard: { marginBottom: Spacing.md },
//   wrongQ: { fontSize: FontSize.body, fontWeight: '600', color: Colors.textPrimary, marginBottom: 8, lineHeight: 22 },
//   wrongAnswers: { gap: 4, marginBottom: 6 },
//   wrongRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
//   wrongLabel: { fontSize: FontSize.bodySmall, color: Colors.textMuted, width: 90 },
//   wrongSelected: { fontSize: FontSize.bodySmall, fontWeight: '700', color: '#DC2626', backgroundColor: '#FEF2F2', paddingHorizontal: 10, paddingVertical: 2, borderRadius: Radius.full },
//   wrongCorrect: { fontSize: FontSize.bodySmall, fontWeight: '700', color: '#059669', backgroundColor: '#F0FDF4', paddingHorizontal: 10, paddingVertical: 2, borderRadius: Radius.full },
//   explanationBox: { backgroundColor: '#FFFBEB', borderRadius: Radius.sm, padding: 8, marginTop: 4 },
//   explanationText: { fontSize: FontSize.caption, color: '#78350F', lineHeight: 18 },
//   primaryBtn: { backgroundColor: Colors.brand, borderRadius: Radius.full, paddingVertical: 16, alignItems: 'center', marginBottom: 12 },
//   weakBtn: { backgroundColor: '#D97706' },
//   primaryBtnText: { fontSize: FontSize.bodyLarge, fontWeight: '700', color: '#fff' },
//   secondaryBtn: { borderWidth: 1.5, borderColor: Colors.brand, borderRadius: Radius.full, paddingVertical: 14, alignItems: 'center', marginBottom: 12 },
//   secondaryBtnText: { fontSize: FontSize.bodyLarge, fontWeight: '700', color: Colors.brand },
//   backBtn: { alignItems: 'center', paddingVertical: 12 },
//   backBtnText: { fontSize: FontSize.body, color: Colors.textSecondary, fontWeight: '600' },
// });

// ─── DrillResultsScreen.tsx ───────────────────────────────────────
import React from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  StyleSheet, Share,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AppStackParamList } from '../../navigation/types';
import { Colors, FontSize, Radius, Spacing, Shadows } from '../../theme';
import CCCard from '../../components/CCCard';

type Nav   = NativeStackNavigationProp<AppStackParamList>;
type Route = RouteProp<AppStackParamList, 'DrillResults'>;

export default function DrillResultsScreen() {
  const navigation = useNavigation<Nav>();
  const route      = useRoute<Route>();
  const { result, subjectId, subjectName, mode } = route.params;

  const { score, correctCount, totalQuestions, durationSeconds, wrongQuestions } = result;

  const percentage   = Math.round((correctCount / totalQuestions) * 100);
  const scoreColor   = score >= 8 ? '#059669' : score >= 5 ? Colors.brand : '#DC2626';
  const scoreEmoji   = score >= 8 ? '🔥' : score >= 5 ? '💪' : '📖';
  const scoreMessage = score >= 8
    ? "Excellent! You're ready for this."
    : score >= 5
    ? 'Good progress. Keep drilling.'
    : "Keep going — you'll get there.";

  const handleShare = async () => {
    try {
      await Share.share({
        message: `I just scored ${score}/10 on ${subjectName} on EduXL! 📚 Study smart, pass the test.`,
      });
    } catch {}
  };

  const formatDuration = (secs: number) => {
    if (secs < 60) return `${secs}s`;
    return `${Math.floor(secs / 60)}m ${secs % 60}s`;
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

        {/* Score hero */}
        <View style={styles.hero}>
          <Text style={styles.heroEmoji}>{scoreEmoji}</Text>
          <Text style={[styles.scoreText, { color: scoreColor }]}>{score}/10</Text>
          <Text style={styles.scorePercent}>{percentage}% correct</Text>
          <Text style={styles.scoreMessage}>{scoreMessage}</Text>
          <Text style={styles.subjectLabel}>{subjectName} · {mode} mode</Text>
        </View>

        {/* Stats row */}
        <View style={styles.statsRow}>
          <View style={styles.statBox}>
            <Text style={[styles.statNum, { color: '#059669' }]}>{correctCount}</Text>
            <Text style={styles.statLabel}>Correct</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={[styles.statNum, { color: '#DC2626' }]}>{totalQuestions - correctCount}</Text>
            <Text style={styles.statLabel}>Wrong</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statNum}>{formatDuration(durationSeconds)}</Text>
            <Text style={styles.statLabel}>Time</Text>
          </View>
        </View>

        {/* Wrong questions breakdown */}
        {wrongQuestions.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>Questions to review</Text>
            {wrongQuestions.map((wq, i) => (
              <CCCard key={i} style={styles.wrongCard}>
                <Text style={styles.wrongQ}>{wq.question}</Text>
                <View style={styles.wrongAnswers}>
                  <View style={styles.wrongRow}>
                    <Text style={styles.wrongLabel}>Your answer:</Text>
                    <Text style={styles.wrongSelected}>{wq.selectedOption}</Text>
                  </View>
                  <View style={styles.wrongRow}>
                    <Text style={styles.wrongLabel}>Correct:</Text>
                    <Text style={styles.wrongCorrect}>{wq.correctOption}</Text>
                  </View>
                </View>
                {wq.explanation && (
                  <View style={styles.explanationBox}>
                    <Text style={styles.explanationText}>💡 {wq.explanation}</Text>
                  </View>
                )}
              </CCCard>
            ))}
          </>
        )}

        {/* Action buttons */}
        <TouchableOpacity
          style={styles.primaryBtn}
          onPress={() => navigation.navigate('DrillSession', { subjectId, subjectName, mode })}
        >
          <Text style={styles.primaryBtnText}>Try again</Text>
        </TouchableOpacity>

        {wrongQuestions.length > 0 && (
          <TouchableOpacity
            style={[styles.primaryBtn, styles.weakBtn]}
            onPress={() => navigation.navigate('DrillSession', { subjectId, subjectName, mode: 'weak' })}
          >
            <Text style={styles.primaryBtnText}>Drill weak questions ⚠️</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity style={styles.secondaryBtn} onPress={handleShare}>
          <Text style={styles.secondaryBtnText}>Share score 📤</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => navigation.pop(2)}
        >
          <Text style={styles.backBtnText}>← Back to {subjectName}</Text>
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe:   { flex: 1, backgroundColor: Colors.background },
  scroll: { padding: Spacing.lg, paddingBottom: Spacing['5xl'] },
  hero:   { alignItems: 'center', paddingVertical: Spacing['2xl'], marginBottom: Spacing['2xl'] },
  heroEmoji: { fontSize: 52, marginBottom: 8 },
  scoreText: { fontSize: 64, fontWeight: '800', lineHeight: 72 },
  scorePercent: { fontSize: FontSize.heading3, fontWeight: '700', color: Colors.textSecondary, marginTop: 4 },
  scoreMessage: { fontSize: FontSize.bodyLarge, color: Colors.textSecondary, marginTop: 8, textAlign: 'center' },
  subjectLabel: { fontSize: FontSize.caption, color: Colors.textMuted, marginTop: 8, textTransform: 'capitalize' },
  statsRow: { flexDirection: 'row', gap: 8, marginBottom: Spacing['2xl'] },
  statBox: { flex: 1, backgroundColor: Colors.surface, borderRadius: Radius.md, padding: 12, alignItems: 'center', borderWidth: 1, borderColor: Colors.border },
  statNum: { fontSize: FontSize.heading2, fontWeight: '800', color: Colors.textPrimary },
  statLabel: { fontSize: FontSize.micro, color: Colors.textMuted, marginTop: 2 },
  sectionTitle: { fontSize: FontSize.heading3, fontWeight: '700', color: Colors.textPrimary, marginBottom: Spacing.md },
  wrongCard: { marginBottom: Spacing.md },
  wrongQ: { fontSize: FontSize.body, fontWeight: '600', color: Colors.textPrimary, marginBottom: 8, lineHeight: 22 },
  wrongAnswers: { gap: 4, marginBottom: 6 },
  wrongRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  wrongLabel: { fontSize: FontSize.bodySmall, color: Colors.textMuted, width: 90 },
  wrongSelected: { fontSize: FontSize.bodySmall, fontWeight: '700', color: '#DC2626', backgroundColor: '#FEF2F2', paddingHorizontal: 10, paddingVertical: 2, borderRadius: Radius.full },
  wrongCorrect: { fontSize: FontSize.bodySmall, fontWeight: '700', color: '#059669', backgroundColor: '#F0FDF4', paddingHorizontal: 10, paddingVertical: 2, borderRadius: Radius.full },
  explanationBox: { backgroundColor: '#FFFBEB', borderRadius: Radius.sm, padding: 8, marginTop: 4 },
  explanationText: { fontSize: FontSize.caption, color: '#78350F', lineHeight: 18 },
  primaryBtn: { backgroundColor: Colors.brand, borderRadius: Radius.full, paddingVertical: 16, alignItems: 'center', marginBottom: 12 },
  weakBtn: { backgroundColor: '#D97706' },
  primaryBtnText: { fontSize: FontSize.bodyLarge, fontWeight: '700', color: '#fff' },
  secondaryBtn: { borderWidth: 1.5, borderColor: Colors.brand, borderRadius: Radius.full, paddingVertical: 14, alignItems: 'center', marginBottom: 12 },
  secondaryBtnText: { fontSize: FontSize.bodyLarge, fontWeight: '700', color: Colors.brand },
  backBtn: { alignItems: 'center', paddingVertical: 12 },
  backBtnText: { fontSize: FontSize.body, color: Colors.textSecondary, fontWeight: '600' },
});