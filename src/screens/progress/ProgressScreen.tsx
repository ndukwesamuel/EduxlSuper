


// ─── ProgressScreen.tsx ───────────────────────────────────────────
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
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";
import {
  fetchProgress,
  UserProgress,
  applyStreakFreeze,
} from   "../../../config/client" 
import { Colors, FontSize, Radius, Spacing, Shadows } from "../../theme";
import StreakBadge from "../../components/StreakBadge";
import XPBar from "../../components/XPBar";
import CCLoader from "../../components/CCLoader";
import CCCard from "../../components/CCCard";
// import { CCCard, CCLoader, XPBar, StreakBadge } from '../../components';

export default function ProgressScreen() {
  const user = useSelector((s: RootState) => s.auth.user);
  const [progress, setProgress] = useState<UserProgress | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [freezeMsg, setFreezeMsg] = useState("");

  const load = async () => {
    try {
      setProgress(await fetchProgress());
    } catch {}
  };

  useEffect(() => {
    load().finally(() => setLoading(false));
  }, [user]);
  const onRefresh = async () => {
    setRefreshing(true);
    await load();
    setRefreshing(false);
  };

  const handleFreeze = async () => {
    if (!progress?.streakFreezeAvailable) return;
    try {
      await applyStreakFreeze();
      setFreezeMsg("🧊 Streak freeze applied! Your streak is safe today.");
      setProgress((p) => (p ? { ...p, streakFreezeAvailable: false } : p));
      setTimeout(() => setFreezeMsg(""), 4000);
    } catch {
      setFreezeMsg("Failed to apply freeze.");
    }
  };

  if (loading) return <CCLoader message="Loading your progress..." />;

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Progress</Text>
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
        {progress ? (
          <>
            {/* Streak */}
            <CCCard style={styles.section}>
              <StreakBadge streak={progress.streak} />
              {progress.streakFreezeAvailable && (
                <TouchableOpacity
                  style={styles.freezeBtn}
                  onPress={handleFreeze}
                >
                  <Text style={styles.freezeBtnText}>🧊 Use Streak Freeze</Text>
                </TouchableOpacity>
              )}
              {freezeMsg !== "" && (
                <View style={styles.freezeMsg}>
                  <Text style={styles.freezeMsgText}>{freezeMsg}</Text>
                </View>
              )}
            </CCCard>

            {/* XP */}
            <CCCard style={styles.section}>
              <Text style={styles.sectionTitle}>Experience Points</Text>
              <XPBar xp={progress.xp} />
            </CCCard>

            {/* Badges */}
            <CCCard style={styles.section}>
              <Text style={styles.sectionTitle}>
                Badges ({progress.badges.length}/{progress.allBadges.length})
              </Text>
              <View style={styles.badgeGrid}>
                {progress.allBadges.map((badge) => {
                  const earned = progress.badges.some((b) => b.id === badge.id);
                  return (
                    <View
                      key={badge.id}
                      style={[
                        styles.badgeItem,
                        !earned && styles.badgeItemLocked,
                      ]}
                    >
                      <Text style={styles.badgeIcon}>{badge.icon}</Text>
                      <Text
                        style={[
                          styles.badgeName,
                          !earned && styles.badgeNameLocked,
                        ]}
                      >
                        {badge.name}
                      </Text>
                      <Text style={styles.badgeDesc}>{badge.desc}</Text>
                    </View>
                  );
                })}
              </View>
            </CCCard>
          </>
        ) : (
          <View style={styles.empty}>
            <Text style={{ fontSize: 48 }}>📊</Text>
            <Text style={styles.emptyText}>
              No progress data yet. Take a test to get started!
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  scroll: { padding: Spacing.lg, paddingBottom: Spacing["5xl"] },
  header: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.lg,
    backgroundColor: Colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  headerTitle: {
    fontSize: FontSize.heading2,
    fontWeight: "800",
    color: Colors.textPrimary,
  },

  section: { marginBottom: Spacing.lg, gap: Spacing.md },
  sectionTitle: {
    fontSize: FontSize.heading3,
    fontWeight: "700",
    color: Colors.textPrimary,
  },

  freezeBtn: {
    backgroundColor: "#EFF6FF",
    borderRadius: Radius.md,
    paddingVertical: 10,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#BFDBFE",
  },
  freezeBtnText: {
    fontSize: FontSize.body,
    fontWeight: "600",
    color: Colors.brand,
  },
  freezeMsg: {
    backgroundColor: "#EFF6FF",
    borderRadius: Radius.md,
    padding: Spacing.md,
  },
  freezeMsgText: { fontSize: FontSize.bodySmall, color: Colors.brand },

  badgeGrid: { flexDirection: "row", flexWrap: "wrap", gap: Spacing.md },
  badgeItem: {
    width: "30%",
    alignItems: "center",
    backgroundColor: Colors.surface2,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    gap: 4,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  badgeItemLocked: { opacity: 0.35 },
  badgeIcon: { fontSize: 28 },
  badgeName: {
    fontSize: FontSize.caption,
    fontWeight: "700",
    color: Colors.textPrimary,
    textAlign: "center",
  },
  badgeNameLocked: { color: Colors.textMuted },
  badgeDesc: {
    fontSize: FontSize.micro,
    color: Colors.textMuted,
    textAlign: "center",
    lineHeight: 14,
  },

  empty: {
    alignItems: "center",
    paddingVertical: Spacing["5xl"],
    gap: Spacing.md,
  },
  emptyText: {
    fontSize: FontSize.body,
    color: Colors.textSecondary,
    textAlign: "center",
  },
});