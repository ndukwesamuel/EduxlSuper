// ─── BankReadyHomeScreen.tsx ──────────────────────────────────────
// Equivalent of web WelcomePage.tsx
// Module selection + mode/difficulty/topic drill config

import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Modal,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { AppStackParamList } from "../../navigation/types";
import {
  Colors,
  FontSize,
  Radius,
  Spacing,
  Shadows,
  ModuleConfig,
  ModuleId,
} from "../../theme";
import CCCard from "../../components/CCCard";
import CCTag from "../../components/CCTag";
// import { CCCard, CCTag } from '../../components';

type Nav = NativeStackNavigationProp<AppStackParamList>;
type TestMode = "exam" | "practice" | "speed";
type Difficulty = "easy" | "medium" | "hard" | "mixed";

const MODULES: ModuleId[] = ["numerical", "verbal", "logical", "abstract"];

const MODE_INFO: Record<
  TestMode,
  { label: string; icon: string; desc: string }
> = {
  exam: { label: "Exam", icon: "⏱️", desc: "Timed, results at end" },
  practice: {
    label: "Practice",
    icon: "📚",
    desc: "No timer, instant feedback",
  },
  speed: { label: "Speed", icon: "⚡", desc: "15 sec per question" },
};

const DIFFICULTIES: { value: Difficulty; label: string }[] = [
  { value: "mixed", label: "Mixed" },
  { value: "easy", label: "Easy" },
  { value: "medium", label: "Medium" },
  { value: "hard", label: "Hard" },
];

const MODULE_TAGS: Record<ModuleId, string[]> = {
  numerical: [
    "percentages",
    "ratios",
    "data interpretation",
    "profit & loss",
    "simple interest",
    "compound interest",
    "averages",
    "fractions",
    "VAT",
    "break-even",
  ],
  verbal: [
    "comprehension",
    "true/false/cannot say",
    "vocabulary",
    "grammar",
    "inference",
    "critical reasoning",
    "sentence correction",
  ],
  logical: [
    "number sequences",
    "letter sequences",
    "analogies",
    "odd one out",
    "syllogism",
    "deductive reasoning",
    "fibonacci",
    "perfect squares",
  ],
  abstract: [
    "number matrices",
    "rule identification",
    "series completion",
    "pattern recognition",
    "rotation transformation",
    "mirror symmetry",
  ],
};

export default function BankReadyHomeScreen() {
  const navigation = useNavigation<Nav>();
  const [selectedMode, setSelectedMode] = useState<Record<ModuleId, TestMode>>({
    numerical: "exam",
    verbal: "exam",
    logical: "exam",
    abstract: "exam",
  });
  const [selectedDiff, setSelectedDiff] = useState<
    Record<ModuleId, Difficulty>
  >({
    numerical: "mixed",
    verbal: "mixed",
    logical: "mixed",
    abstract: "mixed",
  });
  const [selectedTag, setSelectedTag] = useState<Record<ModuleId, string>>({
    numerical: "",
    verbal: "",
    logical: "",
    abstract: "",
  });
  const [configModal, setConfigModal] = useState<ModuleId | null>(null);

  const handleStart = (modId: ModuleId) => {
    navigation.navigate("Test", {
      module: modId,
      mode: selectedMode[modId],
      difficulty: selectedDiff[modId],
      tag: selectedTag[modId] || undefined,
    });
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Header ── */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backBtn}
          >
            <Text style={styles.backText}>← Home</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>BankReady</Text>
          <View style={{ width: 70 }} />
        </View>

        {/* ── Hero ── */}
        <View style={styles.hero}>
          <Text style={styles.heroTitle}>Bank Aptitude{"\n"}Test Prep</Text>
          <Text style={styles.heroSub}>
            Practice the exact questions used at GTBank, Zenith, Access, First
            Bank and UBA.
          </Text>
        </View>

        {/* ── Module cards ── */}
        {MODULES.map((modId) => {
          const mod = ModuleConfig[modId];
          const curMode = selectedMode[modId];
          const curDiff = selectedDiff[modId];
          const curTag = selectedTag[modId];

          return (
            <CCCard key={modId} style={styles.moduleCard}>
              {/* Module header */}
              <View style={styles.moduleHeader}>
                <View
                  style={[
                    styles.moduleIconWrap,
                    { backgroundColor: mod.bgColor },
                  ]}
                >
                  <Text style={{ fontSize: 24 }}>{mod.icon}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.moduleTitle}>{mod.label}</Text>
                  <Text style={styles.moduleDesc}>{mod.description}</Text>
                </View>
              </View>

              {/* Topics */}
              <View style={styles.topicsRow}>
                {mod.topics.slice(0, 3).map((t) => (
                  <CCTag key={t} label={t} variant="blue" />
                ))}
              </View>

              {/* Mode selector */}
              <Text style={styles.sectionLabel}>Mode</Text>
              <View style={styles.modeRow}>
                {(Object.keys(MODE_INFO) as TestMode[]).map((m) => (
                  <TouchableOpacity
                    key={m}
                    style={[
                      styles.modeBtn,
                      curMode === m && {
                        backgroundColor: mod.color + "18",
                        borderColor: mod.color,
                      },
                    ]}
                    onPress={() =>
                      setSelectedMode((p) => ({ ...p, [modId]: m }))
                    }
                    activeOpacity={0.7}
                  >
                    <Text style={{ fontSize: 16 }}>{MODE_INFO[m].icon}</Text>
                    <Text
                      style={[
                        styles.modeBtnText,
                        curMode === m && { color: mod.color },
                      ]}
                    >
                      {MODE_INFO[m].label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* Config summary + Advanced button */}
              <View style={styles.configRow}>
                <TouchableOpacity
                  style={styles.advancedBtn}
                  onPress={() => setConfigModal(modId)}
                >
                  <Text style={styles.advancedText}>
                    ⚙️ {curDiff !== "mixed" ? curDiff : "Mixed"}
                    {curTag ? ` · ${curTag}` : ""}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.startBtn, { backgroundColor: mod.color }]}
                  onPress={() => handleStart(modId)}
                  activeOpacity={0.85}
                >
                  <Text style={styles.startBtnText}>Start →</Text>
                </TouchableOpacity>
              </View>
            </CCCard>
          );
        })}
      </ScrollView>

      {/* ── Advanced config modal ── */}
      {configModal && (
        <Modal
          visible
          transparent
          animationType="slide"
          onRequestClose={() => setConfigModal(null)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalSheet}>
              <View style={styles.modalHandle} />
              <Text style={styles.modalTitle}>
                {ModuleConfig[configModal].icon} Advanced Options
              </Text>

              {/* Difficulty */}
              <Text style={styles.modalLabel}>Difficulty</Text>
              <View style={styles.diffRow}>
                {DIFFICULTIES.map((d) => (
                  <TouchableOpacity
                    key={d.value}
                    style={[
                      styles.diffBtn,
                      selectedDiff[configModal] === d.value && {
                        backgroundColor: ModuleConfig[configModal].color + "18",
                        borderColor: ModuleConfig[configModal].color,
                      },
                    ]}
                    onPress={() =>
                      setSelectedDiff((p) => ({ ...p, [configModal]: d.value }))
                    }
                  >
                    <Text
                      style={[
                        styles.diffBtnText,
                        selectedDiff[configModal] === d.value && {
                          color: ModuleConfig[configModal].color,
                        },
                      ]}
                    >
                      {d.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* Topic drill */}
              <Text style={styles.modalLabel}>Topic Drill</Text>
              <ScrollView
                style={styles.tagScroll}
                showsVerticalScrollIndicator={false}
              >
                <TouchableOpacity
                  style={[
                    styles.tagItem,
                    selectedTag[configModal] === "" && styles.tagItemActive,
                  ]}
                  onPress={() =>
                    setSelectedTag((p) => ({ ...p, [configModal]: "" }))
                  }
                >
                  <Text
                    style={[
                      styles.tagItemText,
                      selectedTag[configModal] === "" && {
                        color: Colors.brand,
                      },
                    ]}
                  >
                    All topics (random mix)
                  </Text>
                </TouchableOpacity>
                {MODULE_TAGS[configModal].map((tag) => (
                  <TouchableOpacity
                    key={tag}
                    style={[
                      styles.tagItem,
                      selectedTag[configModal] === tag && styles.tagItemActive,
                    ]}
                    onPress={() =>
                      setSelectedTag((p) => ({ ...p, [configModal]: tag }))
                    }
                  >
                    <Text
                      style={[
                        styles.tagItemText,
                        selectedTag[configModal] === tag && {
                          color: Colors.brand,
                        },
                      ]}
                    >
                      {tag}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>

              <TouchableOpacity
                style={styles.modalDone}
                onPress={() => setConfigModal(null)}
              >
                <Text style={styles.modalDoneText}>Done</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  scroll: { padding: Spacing.lg, paddingBottom: Spacing["5xl"] },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: Spacing["2xl"],
  },
  backBtn: { padding: 4 },
  backText: { fontSize: FontSize.body, color: Colors.brand, fontWeight: "500" },
  headerTitle: {
    fontSize: FontSize.heading3,
    fontWeight: "700",
    color: Colors.textPrimary,
  },

  hero: { marginBottom: Spacing["2xl"] },
  heroTitle: {
    fontSize: FontSize.displayXL,
    fontWeight: "800",
    color: Colors.textPrimary,
    lineHeight: 38,
    marginBottom: 10,
  },
  heroSub: {
    fontSize: FontSize.body,
    color: Colors.textSecondary,
    lineHeight: 22,
  },

  moduleCard: { marginBottom: Spacing.lg, gap: Spacing.md },
  moduleHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: Spacing.md,
  },
  moduleIconWrap: {
    width: 48,
    height: 48,
    borderRadius: Radius.md,
    alignItems: "center",
    justifyContent: "center",
  },
  moduleTitle: {
    fontSize: FontSize.heading3,
    fontWeight: "700",
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  moduleDesc: {
    fontSize: FontSize.bodySmall,
    color: Colors.textSecondary,
    lineHeight: 18,
  },

  topicsRow: { flexDirection: "row", flexWrap: "wrap", gap: 6 },

  sectionLabel: {
    fontSize: FontSize.caption,
    fontWeight: "700",
    color: Colors.textMuted,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  modeRow: { flexDirection: "row", gap: 8 },
  modeBtn: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 10,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.surface2,
    gap: 4,
  },
  modeBtnText: {
    fontSize: FontSize.caption,
    fontWeight: "600",
    color: Colors.textSecondary,
  },

  configRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
  },
  advancedBtn: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 12,
    backgroundColor: Colors.surface2,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  advancedText: { fontSize: FontSize.caption, color: Colors.textSecondary },
  startBtn: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: Radius.md,
    ...Shadows.sm,
  },
  startBtnText: { fontSize: FontSize.body, fontWeight: "700", color: "#fff" },

  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: Colors.overlay,
    justifyContent: "flex-end",
  },
  modalSheet: {
    backgroundColor: Colors.surface,
    borderTopLeftRadius: Radius["2xl"],
    borderTopRightRadius: Radius["2xl"],
    padding: Spacing["2xl"],
    paddingBottom: Spacing["4xl"],
    maxHeight: "80%",
  },
  modalHandle: {
    width: 40,
    height: 4,
    backgroundColor: Colors.border,
    borderRadius: 2,
    alignSelf: "center",
    marginBottom: Spacing.lg,
  },
  modalTitle: {
    fontSize: FontSize.heading2,
    fontWeight: "700",
    color: Colors.textPrimary,
    marginBottom: Spacing.lg,
  },
  modalLabel: {
    fontSize: FontSize.caption,
    fontWeight: "700",
    color: Colors.textMuted,
    textTransform: "uppercase",
    marginBottom: 8,
    marginTop: Spacing.md,
  },

  diffRow: { flexDirection: "row", gap: 8, marginBottom: Spacing.md },
  diffBtn: {
    flex: 1,
    paddingVertical: 10,
    alignItems: "center",
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.surface2,
  },
  diffBtnText: {
    fontSize: FontSize.bodySmall,
    fontWeight: "600",
    color: Colors.textSecondary,
  },

  tagScroll: { maxHeight: 200, marginBottom: Spacing.lg },
  tagItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  tagItemActive: { backgroundColor: "#EFF6FF" },
  tagItemText: { fontSize: FontSize.body, color: Colors.textSecondary },

  modalDone: {
    backgroundColor: Colors.brand,
    height: 52,
    borderRadius: Radius.md,
    alignItems: "center",
    justifyContent: "center",
    ...Shadows.brand,
  },
  modalDoneText: {
    color: "#fff",
    fontSize: FontSize.bodyLarge,
    fontWeight: "600",
  },
});
