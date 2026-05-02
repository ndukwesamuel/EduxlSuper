// ─── HistoryScreen.tsx ────────────────────────────────────────────
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
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";
import {
  fetchHistory,
  HistoryAttempt,
  HistoryResponse,
} from "../../api/client";
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
// import { CCCard, , CCLoader } from '../../components';

type Route = RouteProp<AppStackParamList, "History">;

type TabId = "all" | "numerical" | "verbal" | "logical" | "abstract";
const TABS: { id: TabId; label: string; icon: string }[] = [
  { id: "all", label: "All", icon: "📋" },
  { id: "numerical", label: "Numerical", icon: "🔢" },
  { id: "verbal", label: "Verbal", icon: "📖" },
  { id: "logical", label: "Logical", icon: "🧠" },
  { id: "abstract", label: "Abstract", icon: "🔷" },
];

function accColor(a: number) {
  return a >= 80
    ? Colors.success
    : a >= 60
      ? Colors.brand
      : a >= 40
        ? Colors.gold
        : Colors.danger;
}
function fmtTime(s: number) {
  return `${Math.floor(s / 60)}m ${String(s % 60).padStart(2, "0")}s`;
}
function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-NG", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default function HistoryScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<Route>();
  const user = useSelector((s: RootState) => s.auth.user);
  const [activeTab, setActiveTab] = useState<TabId>(
    route.params?.module ?? "all",
  );
  const [data, setData] = useState<HistoryResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  const load = async () => {
    if (!user?._id) return;
    try {
      const res = await fetchHistory(
        user._id,
        activeTab === "all" ? null : (activeTab as any),
      );
      setData(res);
    } catch {
      setError("Failed to load history.");
    }
  };

  useEffect(() => {
    setLoading(true);
    setError("");
    load().finally(() => setLoading(false));
  }, [activeTab, user]);

  const onRefresh = async () => {
    setRefreshing(true);
    await load();
    setRefreshing(false);
  };

  if (loading) return <CCLoader message="Loading your progress..." />;

  const history = data?.history ?? [];
  const trend = data?.trend;
  const totalAttempts = data?.totalAttempts ?? 0;
  const lastAttempt = history[history.length - 1];

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Progress</Text>
        <TouchableOpacity onPress={() => navigation.navigate("BankReady")}>
          <Text style={styles.newTest}>New Test</Text>
        </TouchableOpacity>
      </View>

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
        {/* User info */}
        <View style={styles.userRow}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {user?.name?.charAt(0).toUpperCase()}
            </Text>
          </View>
          <View>
            <Text style={styles.userName}>{user?.name}</Text>
            <Text style={styles.attemptCount}>
              {totalAttempts} test{totalAttempts !== 1 ? "s" : ""} completed
            </Text>
          </View>
        </View>

        {/* Tabs */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.tabsScroll}
        >
          {TABS.map((t) => (
            <TouchableOpacity
              key={t.id}
              style={[styles.tab, activeTab === t.id && styles.tabActive]}
              onPress={() => setActiveTab(t.id)}
            >
              <Text style={{ fontSize: 14 }}>{t.icon}</Text>
              <Text
                style={[
                  styles.tabText,
                  activeTab === t.id && styles.tabTextActive,
                ]}
              >
                {t.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {totalAttempts === 0 ? (
          <View style={styles.empty}>
            <Text style={{ fontSize: 48 }}>📋</Text>
            <Text style={styles.emptyTitle}>No tests yet</Text>
            <Text style={styles.emptySub}>
              Take your first test to start tracking progress.
            </Text>
            <TouchableOpacity
              style={styles.primaryBtn}
              onPress={() => navigation.navigate("BankReady")}
            >
              <Text style={styles.primaryBtnText}>Start First Test →</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            {/* Trend card */}
            {trend && (
              <CCCard
                style={[
                  styles.trendCard,
                  {
                    borderLeftColor: trend.improving
                      ? Colors.success
                      : Colors.gold,
                  },
                ]}
              >
                <Text style={{ fontSize: 28 }}>
                  {trend.improving ? "📈" : "📉"}
                </Text>
                <View style={{ flex: 1 }}>
                  <Text style={styles.trendTitle}>
                    {trend.improving
                      ? `Improving! +${trend.change}%`
                      : `Down ${Math.abs(trend.change)}% — keep practising!`}
                  </Text>
                  <Text style={styles.trendSub}>
                    First:{" "}
                    <Text style={{ fontWeight: "700" }}>
                      {trend.firstAttemptAccuracy}%
                    </Text>
                    {" → "}
                    Latest:{" "}
                    <Text
                      style={{
                        color: accColor(trend.latestAttemptAccuracy),
                        fontWeight: "700",
                      }}
                    >
                      {trend.latestAttemptAccuracy}%
                    </Text>
                  </Text>
                </View>
              </CCCard>
            )}

            {/* Attempt list */}
            <Text style={styles.sectionTitle}>All Attempts</Text>
            {[...history].reverse().map((attempt) => {
              const isLatest = attempt._id === lastAttempt?._id;
              const modCfg =
                ModuleConfig[attempt.module as keyof typeof ModuleConfig];
              return (
                <CCCard
                  key={attempt._id}
                  style={[
                    styles.attemptCard,
                    isLatest && { borderColor: Colors.brand + "40" },
                  ]}
                >
                  <View style={styles.attemptHeader}>
                    <View style={styles.attemptLeft}>
                      <Text style={{ fontSize: 18 }}>
                        {modCfg?.icon ?? "📋"}
                      </Text>
                      <Text style={styles.attemptTitle}>
                        Test {attempt.attemptNumber}
                      </Text>
                      {isLatest && <CCTag label="Latest" variant="green" />}
                    </View>
                    <Text
                      style={[
                        styles.attemptAccuracy,
                        { color: accColor(attempt.accuracy) },
                      ]}
                    >
                      {attempt.accuracy}%
                    </Text>
                  </View>

                  {/* Progress bar */}
                  <View style={styles.barTrack}>
                    <View
                      style={[
                        styles.barFill,
                        {
                          width: `${attempt.accuracy}%`,
                          backgroundColor: accColor(attempt.accuracy),
                        },
                      ]}
                    />
                  </View>

                  <View style={styles.attemptMeta}>
                    <Text style={styles.metaText}>
                      🎯 {attempt.score}/{attempt.totalQuestions}
                    </Text>
                    <Text style={styles.metaText}>
                      ⏱️ {fmtTime(attempt.timeTaken)}
                    </Text>
                    <Text style={styles.metaText}>
                      📅 {fmtDate(attempt.createdAt)}
                    </Text>
                  </View>

                  {attempt.weakAreas.length > 0 && (
                    <View style={styles.weakRow}>
                      <Text style={styles.weakLabel}>Weak areas:</Text>
                      {attempt.weakAreas.map((a) => (
                        <CCTag key={a} label={a} variant="medium" />
                      ))}
                    </View>
                  )}
                </CCCard>
              );
            })}
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
  newTest: { fontSize: FontSize.body, color: Colors.brand, fontWeight: "600" },

  userRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
    marginBottom: Spacing["2xl"],
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: Radius.xl,
    backgroundColor: "#DBEAFE",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    fontSize: FontSize.heading2,
    fontWeight: "700",
    color: Colors.brand,
  },
  userName: {
    fontSize: FontSize.heading3,
    fontWeight: "700",
    color: Colors.textPrimary,
  },
  attemptCount: {
    fontSize: FontSize.bodySmall,
    color: Colors.textMuted,
    marginTop: 2,
  },

  tabsScroll: { marginBottom: Spacing.lg },
  tab: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: Radius.xl,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.surface,
    marginRight: 8,
  },
  tabActive: {
    backgroundColor: Colors.brand + "12",
    borderColor: Colors.brand,
  },
  tabText: {
    fontSize: FontSize.bodySmall,
    color: Colors.textSecondary,
    fontWeight: "500",
  },
  tabTextActive: { color: Colors.brand, fontWeight: "700" },

  empty: {
    alignItems: "center",
    paddingVertical: Spacing["5xl"],
    gap: Spacing.md,
  },
  emptyTitle: {
    fontSize: FontSize.heading2,
    fontWeight: "700",
    color: Colors.textPrimary,
  },
  emptySub: {
    fontSize: FontSize.body,
    color: Colors.textSecondary,
    textAlign: "center",
  },
  primaryBtn: {
    backgroundColor: Colors.brand,
    height: 52,
    borderRadius: Radius.md,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
    ...Shadows.brand,
  },
  primaryBtnText: { color: "#fff", fontWeight: "600", fontSize: FontSize.body },

  trendCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
    borderLeftWidth: 4,
    marginBottom: Spacing.lg,
  },
  trendTitle: {
    fontSize: FontSize.body,
    fontWeight: "600",
    color: Colors.textPrimary,
  },
  trendSub: {
    fontSize: FontSize.bodySmall,
    color: Colors.textSecondary,
    marginTop: 4,
  },

  sectionTitle: {
    fontSize: FontSize.caption,
    fontWeight: "700",
    color: Colors.textMuted,
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: Spacing.md,
  },

  attemptCard: { marginBottom: Spacing.md, borderWidth: 1.5 },
  attemptHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Spacing.sm,
  },
  attemptLeft: { flexDirection: "row", alignItems: "center", gap: 8 },
  attemptTitle: {
    fontSize: FontSize.body,
    fontWeight: "600",
    color: Colors.textPrimary,
  },
  attemptAccuracy: { fontSize: FontSize.heading1, fontWeight: "800" },

  barTrack: {
    height: 6,
    backgroundColor: Colors.surface2,
    borderRadius: Radius.full,
    overflow: "hidden",
    marginBottom: Spacing.sm,
  },
  barFill: { height: "100%", borderRadius: Radius.full },

  attemptMeta: { flexDirection: "row", gap: Spacing.lg, flexWrap: "wrap" },
  metaText: { fontSize: FontSize.caption, color: Colors.textMuted },

  weakRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
    alignItems: "center",
    marginTop: Spacing.sm,
  },
  weakLabel: { fontSize: FontSize.caption, color: Colors.textMuted },
});
