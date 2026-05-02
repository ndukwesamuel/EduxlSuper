// ─── ResultsScreen.tsx ────────────────────────────────────────────
import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../store/store";
import { resetTest } from "../../store/testSlice";
import { AppStackParamList } from "../../navigation/types";
import {
  Colors,
  FontSize,
  Radius,
  Spacing,
  Shadows,
  ModuleConfig,
} from "../../theme";

import CCCard from "../../components/CCCard";
import CCTag from "../../components/CCTag";
import CCLoader from "../../components/CCLoader";

type Nav = NativeStackNavigationProp<AppStackParamList>;

function AccuracyRing({ accuracy }: { accuracy: number }) {
  const size = 140;
  const stroke = 10;
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ * (1 - accuracy / 100);
  const color =
    accuracy >= 80
      ? Colors.success
      : accuracy >= 60
        ? Colors.brand
        : accuracy >= 40
          ? Colors.gold
          : Colors.danger;

  return (
    <View
      style={{
        alignItems: "center",
        justifyContent: "center",
        width: size,
        height: size,
      }}
    >
      <View
        style={[
          StyleSheet.absoluteFill,
          { alignItems: "center", justifyContent: "center" },
        ]}
      >
        <Text
          style={{
            fontSize: FontSize.displayXL,
            fontWeight: "800",
            color: Colors.textPrimary,
          }}
        >
          {accuracy}%
        </Text>
        <Text style={{ fontSize: FontSize.caption, color: Colors.textMuted }}>
          Accuracy
        </Text>
      </View>
    </View>
  );
}

export default function ResultsScreen() {
  const navigation = useNavigation<Nav>();
  const dispatch = useDispatch();
  const { result, wrongAnswerDetails, module, progress } = useSelector(
    (s: RootState) => s.test,
  );
  const [reviewOpen, setReviewOpen] = useState(false);

  if (!result)
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.empty}>
          <Text style={{ fontSize: 48 }}>😕</Text>
          <Text style={styles.emptyText}>No results found.</Text>
          <TouchableOpacity
            style={styles.primaryBtn}
            onPress={() => navigation.navigate("BankReady")}
          >
            <Text style={styles.primaryBtnText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );

  const cfg = ModuleConfig[module];
  const { score, totalQuestions, accuracy, timeTaken, weakAreas } = result;
  const mins = Math.floor(timeTaken / 60);
  const secs = String(timeTaken % 60).padStart(2, "0");
  const grade =
    accuracy >= 80
      ? "Excellent! 🎉"
      : accuracy >= 60
        ? "Good Job! 👍"
        : accuracy >= 40
          ? "Fair 💪"
          : "Keep Practising 📚";
  const gradeColor =
    accuracy >= 80
      ? Colors.success
      : accuracy >= 60
        ? Colors.brand
        : accuracy >= 40
          ? Colors.gold
          : Colors.danger;

  return (
    <SafeAreaView style={styles.safe}>
      {/* ── Header ── */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.navigate("BankReady")}>
          <Text style={styles.backText}>← Home</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{cfg.icon} Results</Text>
        <TouchableOpacity
          onPress={() =>
            navigation.navigate("History", { module: module as any })
          }
        >
          <Text style={styles.historyText}>History</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Score ring ── */}
        <View style={styles.scoreSection}>
          <AccuracyRing accuracy={accuracy} />
          <Text style={[styles.grade, { color: gradeColor }]}>{grade}</Text>
          <Text style={styles.scoreSub}>
            You scored{" "}
            <Text style={styles.scoreHighlight}>
              {score} out of {totalQuestions}
            </Text>
          </Text>
          <Text style={styles.moduleLabel}>
            {cfg.icon} {cfg.label}
          </Text>
        </View>

        {/* ── XP earned (D5) ── */}
        {progress && progress.xpEarned > 0 && (
          <View style={styles.xpBanner}>
            <Text style={styles.xpBannerText}>
              ⭐ +{progress.xpEarned} XP earned!
            </Text>
            {progress.streakBonus && (
              <Text style={styles.xpBonusText}>
                🔥 7-day streak bonus included
              </Text>
            )}
            {progress.newBadges.length > 0 && (
              <Text style={styles.xpBonusText}>
                🏅 New badge{progress.newBadges.length > 1 ? "s" : ""} unlocked!
              </Text>
            )}
          </View>
        )}

        {/* ── Stats grid ── */}
        <View style={styles.statsGrid}>
          {[
            { label: "Score", value: `${score}/${totalQuestions}`, icon: "🎯" },
            { label: "Accuracy", value: `${accuracy}%`, icon: "📊" },
            { label: "Time", value: `${mins}m ${secs}s`, icon: "⏱️" },
          ].map((s) => (
            <CCCard key={s.label} style={styles.statCard} padding={12}>
              <Text style={{ fontSize: 20, textAlign: "center" }}>
                {s.icon}
              </Text>
              <Text style={styles.statValue}>{s.value}</Text>
              <Text style={styles.statLabel}>{s.label}</Text>
            </CCCard>
          ))}
        </View>

        {/* ── Weak areas ── */}
        {weakAreas.length > 0 && (
          <CCCard style={styles.weakCard}>
            <Text style={styles.weakTitle}>⚠️ Areas to Improve</Text>
            <Text style={styles.weakSub}>
              You missed the most questions in:
            </Text>
            <View style={styles.weakTags}>
              {weakAreas.map((a) => (
                <CCTag key={a} label={a} variant="medium" />
              ))}
            </View>
          </CCCard>
        )}

        {/* ── Wrong answer review ── */}
        {wrongAnswerDetails.length > 0 && (
          <TouchableOpacity
            style={styles.reviewToggle}
            onPress={() => setReviewOpen((o) => !o)}
            activeOpacity={0.7}
          >
            <View style={styles.reviewToggleLeft}>
              <Text style={{ fontSize: 20 }}>📖</Text>
              <View>
                <Text style={styles.reviewToggleTitle}>
                  Review Wrong Answers
                </Text>
                <Text style={styles.reviewToggleSub}>
                  {wrongAnswerDetails.length} question
                  {wrongAnswerDetails.length > 1 ? "s" : ""} with explanations
                </Text>
              </View>
            </View>
            <Text style={styles.reviewChevron}>{reviewOpen ? "▲" : "▼"}</Text>
          </TouchableOpacity>
        )}

        {reviewOpen &&
          wrongAnswerDetails.map((item, i) => (
            <CCCard key={item.questionId} style={styles.wrongCard}>
              <Text style={styles.wrongQuestion}>
                {i + 1}. {item.questionText}
              </Text>
              <View style={styles.wrongAnswerRow}>
                <CCTag label={`Yours: ${item.yourAnswer}`} variant="hard" />
                <CCTag
                  label={`Correct: ${item.correctAnswer}`}
                  variant="easy"
                />
              </View>
              <View style={styles.explanationBox}>
                <Text style={styles.explanationLabel}>Explanation</Text>
                <Text style={styles.explanationText}>{item.explanation}</Text>
              </View>
              {item.tags.length > 0 && (
                <View style={styles.wrongTags}>
                  {item.tags.map((t) => (
                    <CCTag key={t} label={t} variant="blue" />
                  ))}
                </View>
              )}
            </CCCard>
          ))}

        {/* ── CTAs ── */}
        <View style={styles.ctaRow}>
          <TouchableOpacity
            style={[styles.primaryBtn, { flex: 1 }]}
            onPress={() => {
              dispatch(resetTest(module as any));
              navigation.navigate("Test", {
                module: module as any,
                mode: "exam",
              });
            }}
            activeOpacity={0.85}
          >
            <Text style={styles.primaryBtnText}>Retake →</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.secondaryBtn, { flex: 1 }]}
            onPress={() => navigation.navigate("BankReady")}
            activeOpacity={0.85}
          >
            <Text style={styles.secondaryBtnText}>Other Modules</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.ghostBtn}
          onPress={() =>
            navigation.navigate("History", { module: module as any })
          }
        >
          <Text style={styles.ghostBtnText}>View My Progress</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  scroll: { padding: Spacing.lg, paddingBottom: Spacing["5xl"] },
  empty: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing.md,
  },
  emptyText: { fontSize: FontSize.body, color: Colors.textSecondary },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    backgroundColor: Colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  backText: { fontSize: FontSize.body, color: Colors.brand, fontWeight: "500" },
  headerTitle: {
    fontSize: FontSize.heading3,
    fontWeight: "700",
    color: Colors.textPrimary,
  },
  historyText: { fontSize: FontSize.body, color: Colors.textSecondary },

  scoreSection: { alignItems: "center", paddingVertical: Spacing["3xl"] },
  grade: {
    fontSize: FontSize.heading1,
    fontWeight: "700",
    marginTop: Spacing.md,
  },
  scoreSub: {
    fontSize: FontSize.body,
    color: Colors.textSecondary,
    marginTop: 6,
  },
  scoreHighlight: { fontWeight: "700", color: Colors.textPrimary },
  moduleLabel: {
    fontSize: FontSize.caption,
    color: Colors.textMuted,
    marginTop: 4,
  },

  xpBanner: {
    backgroundColor: "#FFFBEB",
    borderRadius: Radius.lg,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: "#FDE68A",
    marginBottom: Spacing.lg,
    alignItems: "center",
    gap: 4,
  },
  xpBannerText: {
    fontSize: FontSize.heading3,
    fontWeight: "700",
    color: Colors.gold,
  },
  xpBonusText: { fontSize: FontSize.bodySmall, color: Colors.textSecondary },

  statsGrid: {
    flexDirection: "row",
    gap: Spacing.md,
    marginBottom: Spacing.lg,
  },
  statCard: { flex: 1, alignItems: "center", gap: 4 },
  statValue: {
    fontSize: FontSize.heading2,
    fontWeight: "700",
    color: Colors.textPrimary,
    textAlign: "center",
  },
  statLabel: {
    fontSize: FontSize.caption,
    color: Colors.textMuted,
    textAlign: "center",
  },

  weakCard: {
    marginBottom: Spacing.lg,
    borderLeftWidth: 3,
    borderLeftColor: Colors.gold,
  },
  weakTitle: {
    fontSize: FontSize.body,
    fontWeight: "700",
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  weakSub: {
    fontSize: FontSize.bodySmall,
    color: Colors.textSecondary,
    marginBottom: Spacing.md,
  },
  weakTags: { flexDirection: "row", flexWrap: "wrap", gap: 6 },

  reviewToggle: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    padding: Spacing.lg,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: Spacing.sm,
    ...Shadows.sm,
  },
  reviewToggleLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
  },
  reviewToggleTitle: {
    fontSize: FontSize.body,
    fontWeight: "600",
    color: Colors.textPrimary,
  },
  reviewToggleSub: {
    fontSize: FontSize.caption,
    color: Colors.textMuted,
    marginTop: 2,
  },
  reviewChevron: { fontSize: FontSize.bodySmall, color: Colors.textMuted },

  wrongCard: {
    marginBottom: Spacing.sm,
    borderLeftWidth: 3,
    borderLeftColor: Colors.danger,
  },
  wrongQuestion: {
    fontSize: FontSize.bodySmall,
    color: Colors.textPrimary,
    fontWeight: "500",
    lineHeight: 20,
    marginBottom: Spacing.md,
  },
  wrongAnswerRow: { flexDirection: "row", gap: 8, marginBottom: Spacing.md },
  explanationBox: {
    backgroundColor: Colors.surface2,
    borderRadius: Radius.md,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
  },
  explanationLabel: {
    fontSize: FontSize.caption,
    fontWeight: "700",
    color: Colors.textMuted,
    marginBottom: 4,
    textTransform: "uppercase",
  },
  explanationText: {
    fontSize: FontSize.bodySmall,
    color: Colors.textSecondary,
    lineHeight: 20,
  },
  wrongTags: { flexDirection: "row", flexWrap: "wrap", gap: 6 },

  ctaRow: { flexDirection: "row", gap: Spacing.md, marginBottom: Spacing.md },
  primaryBtn: {
    backgroundColor: Colors.brand,
    height: 52,
    borderRadius: Radius.md,
    alignItems: "center",
    justifyContent: "center",
    ...Shadows.brand,
  },
  primaryBtnText: { color: "#fff", fontWeight: "600", fontSize: FontSize.body },
  secondaryBtn: {
    backgroundColor: Colors.surface2,
    height: 52,
    borderRadius: Radius.md,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: Colors.border,
  },
  secondaryBtnText: {
    color: Colors.textPrimary,
    fontWeight: "600",
    fontSize: FontSize.body,
  },
  ghostBtn: { alignItems: "center", paddingVertical: Spacing.md },
  ghostBtnText: {
    color: Colors.textSecondary,
    fontWeight: "500",
    fontSize: FontSize.body,
  },
});
