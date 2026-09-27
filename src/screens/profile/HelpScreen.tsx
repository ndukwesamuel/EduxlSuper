// ─── HelpScreen.tsx ────────────────────────────────────────────────
import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { AppStackParamList } from "../../navigation/types";
import { Colors, FontSize, Radius, Spacing } from "../../theme";
import CCCard from "../../components/CCCard";

type Nav = NativeStackNavigationProp<AppStackParamList>;

const FAQS: { q: string; a: string }[] = [
  {
    q: "How is my score calculated?",
    a: "Accuracy is your correct answers divided by total questions, shown as a percentage. In Practice mode you get instant feedback with a worked explanation right after each answer, so you can see exactly why it was right or wrong.",
  },
  {
    q: "How do XP and levels work?",
    a: "Every completed practice or exam session adds XP. You need 500 XP to reach the next level — your current XP and level show at the top of Home.",
  },
  {
    q: "What is a streak?",
    a: "Complete at least one practice session in a day to keep your streak going, shown on Home with a 🔥. Missing a day resets it.",
  },
  {
    q: "What's the difference between DrillPad and Company Tracks?",
    a: "DrillPad is for your own material — upload notes or a PDF and EduXL turns them into quizzes, audio lessons, and flashcards for any subject. Company Tracks holds test simulations for specific employers, including Banking Exams (GTBank, Zenith, Access, First Bank, UBA-style questions) and other company-specific tracks as they go live.",
  },
  {
    q: "Can I switch between University Student and Graduate/Professional later?",
    a: "Not yet from inside the app — that's set once during sign-up. We're working on adding a way to change it from Profile.",
  },
];

export default function HelpScreen() {
  const navigation = useNavigation<Nav>();

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} hitSlop={12}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Help & FAQ</Text>
        <View style={{ width: 44 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {FAQS.map((item) => (
          <CCCard key={item.q} style={styles.faqCard}>
            <Text style={styles.question}>{item.q}</Text>
            <Text style={styles.answer}>{item.a}</Text>
          </CCCard>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.lg,
    backgroundColor: Colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  backText: { fontSize: FontSize.body, color: Colors.brand, fontWeight: "600" },
  headerTitle: { fontSize: FontSize.heading3, fontWeight: "700", color: Colors.textPrimary },

  scroll: { padding: Spacing.lg, gap: Spacing.md, paddingBottom: Spacing["5xl"] },
  faqCard: { gap: Spacing.xs, marginBottom: Spacing.sm },
  question: { fontSize: FontSize.body, fontWeight: "700", color: Colors.textPrimary },
  answer: { fontSize: FontSize.bodySmall, color: Colors.textSecondary, lineHeight: 20 },
});
