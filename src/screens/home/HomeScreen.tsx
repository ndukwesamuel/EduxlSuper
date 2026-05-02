// ─── HomeScreen.tsx ───────────────────────────────────────────────
// CareerClarity home — personalised greeting, streak, XP,
// active modules (BankReady), coming soon modules.

import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  RefreshControl,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useSelector, useDispatch } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootState } from "../../store/store";
import { clearUser } from "../../store/authSlice";
import { fetchProgress, UserProgress } from "../../api/client";
import { Colors, FontSize, Radius, Spacing, Shadows } from "../../theme";
// import { CCCard, XPBar, StreakBadge } from "../../components";
import { AppStackParamList } from "../../navigation/types";
import StreakBadge from "../../components/StreakBadge";
import XPBar from "../../components/XPBar";
import CCCard from "../../components/CCCard";

type Nav = NativeStackNavigationProp<AppStackParamList>;

// ── Coming Soon modules ──────────────────────────────────────────
const COMING_SOON = [
  {
    id: "ican",
    icon: "📊",
    label: "ICAN Prep",
    color: "#7C3AED",
    desc: "Foundation, Skills & Professional",
  },
  {
    id: "acca",
    icon: "🌍",
    label: "ACCA Prep",
    color: "#0891B2",
    desc: "Applied Knowledge to Strategic",
  },
  {
    id: "interview",
    icon: "🎤",
    label: "Interview Coach",
    color: "#059669",
    desc: "Mock interviews & feedback",
  },
  {
    id: "cv",
    icon: "📄",
    label: "CV Builder",
    color: "#EA580C",
    desc: "ATS-ready professional CVs",
  },
];

function getLagosGreeting(): string {
  const hour = new Date(Date.now() + 3600000).getUTCHours(); // UTC+1
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

export default function HomeScreen() {
  const navigation = useNavigation<Nav>();
  const dispatch = useDispatch();
  const user = useSelector((s: RootState) => s.auth.user);
  const [progress, setProgress] = useState<UserProgress | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const loadProgress = async () => {
    if (!user?._id) return;
    try {
      setProgress(await fetchProgress(user._id));
    } catch {}
  };

  useEffect(() => {
    loadProgress();
  }, [user]);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadProgress();
    setRefreshing(false);
  };

  const firstName = user?.name?.split(" ")[0] ?? "there";

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={Colors.brand}
          />
        }
      >
        {/* ── Header ── */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>{getLagosGreeting()},</Text>
            <Text style={styles.name}>{firstName} 👋</Text>
          </View>
          <TouchableOpacity
            style={styles.avatar}
            onPress={() => dispatch(clearUser())}
          >
            <Text style={styles.avatarText}>
              {user?.name?.charAt(0).toUpperCase()}
            </Text>
          </TouchableOpacity>
        </View>

        {/* ── Streak + XP Widget ── */}
        {progress && (
          <CCCard style={styles.progressCard}>
            <StreakBadge streak={progress.streak} />
            <View style={styles.divider} />
            <XPBar xp={progress.xp} />
            {progress.streakFreezeAvailable && (
              <TouchableOpacity style={styles.freezeBtn}>
                <Text style={styles.freezeText}>
                  🧊 Streak Freeze Available
                </Text>
              </TouchableOpacity>
            )}
          </CCCard>
        )}

        {/* ── Active Modules ── */}
        <Text style={styles.sectionTitle}>Your Modules</Text>

        <TouchableOpacity
          style={styles.bankReadyCard}
          onPress={() => navigation.navigate("BankReady")}
          activeOpacity={0.85}
        >
          <View style={styles.bankReadyLeft}>
            <View style={styles.bankReadyIconWrap}>
              <Text style={styles.bankReadyIcon}>🏦</Text>
            </View>
            <View style={{ flex: 1 }}>
              <View style={styles.bankReadyHeader}>
                <Text style={styles.bankReadyTitle}>BankReady</Text>
                <View style={styles.activePill}>
                  <Text style={styles.activePillText}>ACTIVE</Text>
                </View>
              </View>
              <Text style={styles.bankReadyDesc}>
                Bank aptitude test prep — Numerical, Verbal, Logical & Abstract
              </Text>
              <View style={styles.bankReadyMeta}>
                <Text style={styles.metaText}>📚 639+ questions</Text>
                <Text style={styles.metaText}>🎯 4 modules</Text>
              </View>
            </View>
          </View>
          <Text style={styles.bankReadyArrow}>→</Text>
        </TouchableOpacity>

        {/* ── Coming Soon ── */}
        <Text style={styles.sectionTitle}>Coming Soon</Text>
        <View style={styles.comingSoonGrid}>
          {COMING_SOON.map((m) => (
            <View key={m.id} style={styles.comingSoonCard}>
              <View
                style={[
                  styles.comingSoonIcon,
                  { backgroundColor: m.color + "18" },
                ]}
              >
                <Text style={{ fontSize: 22 }}>{m.icon}</Text>
              </View>
              <Text style={styles.comingSoonLabel}>{m.label}</Text>
              <Text style={styles.comingSoonDesc}>{m.desc}</Text>
              <View style={styles.comingSoonPill}>
                <Text style={styles.comingSoonPillText}>Soon</Text>
              </View>
            </View>
          ))}
        </View>

        {/* ── Badges quick view ── */}
        {progress && progress.badges.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>Recent Badges</Text>
            <CCCard>
              <View style={styles.badgeRow}>
                {progress.badges.slice(0, 5).map((b) => (
                  <View key={b.id} style={styles.badgeItem}>
                    <Text style={{ fontSize: 28 }}>{b.icon}</Text>
                    <Text style={styles.badgeName}>{b.name}</Text>
                  </View>
                ))}
              </View>
            </CCCard>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  scroll: { padding: Spacing.lg, paddingBottom: Spacing["5xl"] },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: Spacing["2xl"],
  },
  greeting: { fontSize: FontSize.body, color: Colors.textSecondary },
  name: {
    fontSize: FontSize.displayL,
    fontWeight: "800",
    color: Colors.textPrimary,
    marginTop: 2,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: Radius.full,
    backgroundColor: "#DBEAFE",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    fontSize: FontSize.bodyLarge,
    fontWeight: "700",
    color: Colors.brand,
  },

  progressCard: { marginBottom: Spacing["2xl"], gap: Spacing.md },
  divider: { height: 1, backgroundColor: Colors.border },
  freezeBtn: {
    marginTop: 4,
    paddingVertical: 8,
    alignItems: "center",
    backgroundColor: "#EFF6FF",
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: "#BFDBFE",
  },
  freezeText: {
    fontSize: FontSize.caption,
    fontWeight: "600",
    color: Colors.brand,
  },

  sectionTitle: {
    fontSize: FontSize.heading3,
    fontWeight: "700",
    color: Colors.textPrimary,
    marginBottom: Spacing.md,
    marginTop: Spacing.sm,
  },

  bankReadyCard: {
    backgroundColor: Colors.brand,
    borderRadius: Radius.xl,
    padding: Spacing.lg,
    marginBottom: Spacing["2xl"],
    flexDirection: "row",
    alignItems: "center",
    ...Shadows.brand,
  },
  bankReadyLeft: {
    flex: 1,
    flexDirection: "row",
    alignItems: "flex-start",
    gap: Spacing.md,
  },
  bankReadyIconWrap: {
    width: 48,
    height: 48,
    borderRadius: Radius.md,
    backgroundColor: "rgba(255,255,255,0.2)",
    alignItems: "center",
    justifyContent: "center",
  },
  bankReadyIcon: { fontSize: 24 },
  bankReadyHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 4,
  },
  bankReadyTitle: {
    fontSize: FontSize.heading2,
    fontWeight: "700",
    color: "#fff",
  },
  activePill: {
    backgroundColor: "rgba(255,255,255,0.25)",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: Radius.full,
  },
  activePillText: {
    fontSize: FontSize.micro,
    fontWeight: "700",
    color: "#fff",
  },
  bankReadyDesc: {
    fontSize: FontSize.bodySmall,
    color: "rgba(255,255,255,0.85)",
    lineHeight: 18,
    marginBottom: 8,
  },
  bankReadyMeta: { flexDirection: "row", gap: Spacing.md },
  metaText: { fontSize: FontSize.caption, color: "rgba(255,255,255,0.75)" },
  bankReadyArrow: {
    fontSize: 20,
    color: "rgba(255,255,255,0.7)",
    marginLeft: 8,
  },

  comingSoonGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.md,
    marginBottom: Spacing["2xl"],
  },
  comingSoonCard: {
    width: "47%",
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
    ...Shadows.sm,
  },
  comingSoonIcon: {
    width: 44,
    height: 44,
    borderRadius: Radius.md,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: Spacing.sm,
  },
  comingSoonLabel: {
    fontSize: FontSize.body,
    fontWeight: "700",
    color: Colors.textPrimary,
    marginBottom: 2,
  },
  comingSoonDesc: {
    fontSize: FontSize.micro,
    color: Colors.textMuted,
    lineHeight: 16,
    marginBottom: Spacing.sm,
  },
  comingSoonPill: {
    backgroundColor: Colors.surface2,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: Radius.full,
    alignSelf: "flex-start",
  },
  comingSoonPillText: {
    fontSize: FontSize.micro,
    color: Colors.textMuted,
    fontWeight: "600",
  },

  badgeRow: { flexDirection: "row", flexWrap: "wrap", gap: Spacing.md },
  badgeItem: { alignItems: "center", gap: 4 },
  badgeName: {
    fontSize: FontSize.micro,
    color: Colors.textMuted,
    textAlign: "center",
    maxWidth: 60,
  },
});
