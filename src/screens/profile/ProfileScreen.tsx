// ─── ProfileScreen.tsx ────────────────────────────────────────────
import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../store/store";
import { clearUser } from "../../store/authSlice";
import { Colors, FontSize, Radius, Spacing, Shadows } from "../../theme";
import CCCard from "../../components/CCCard";
import { deleteAccount } from "../../../config/client";
// import { CCCard } from '../../components';
export default function ProfileScreen() {
  const user = useSelector((s: RootState) => s.auth.user);
  const dispatch = useDispatch();
  const [deleting, setDeleting] = useState(false);

  const handleDeleteAccount = () => {
    Alert.alert(
      "Delete Account",
      "This permanently deletes your account and all your progress. This cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            setDeleting(true);
            try {
              await deleteAccount();
              dispatch(clearUser());
            } catch (e: any) {
              setDeleting(false);
              Alert.alert(
                "Couldn't delete account",
                e?.response?.data?.message ?? "Please try again."
              );
            }
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Profile</Text>
      </View>
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        {/* Avatar */}
        <View style={styles.avatarSection}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {user?.name?.charAt(0).toUpperCase()}
            </Text>
          </View>
          <Text style={styles.name}>{user?.name}</Text>
          <Text style={styles.email}>{user?.email}</Text>
        </View>

        {/* App info */}
        <CCCard style={styles.infoCard}>
          <Text style={styles.infoTitle}>CareerClarity</Text>
          <Text style={styles.infoText}>
            Africa's Career Readiness Platform
          </Text>
          <View style={styles.divider} />
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Version</Text>
            <Text style={styles.infoValue}>1.0.0</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Active Module</Text>
            <Text style={styles.infoValue}>🏦 BankReady</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Coming Soon</Text>
            <Text style={styles.infoValue}>ICAN, ACCA, Interview Prep</Text>
          </View>
        </CCCard>

        {/* Logout */}
        <TouchableOpacity
          style={styles.logoutBtn}
          onPress={() => dispatch(clearUser())}
          activeOpacity={0.8}
        >
          <Text style={styles.logoutText}>Sign Out</Text>
        </TouchableOpacity>

        {/* Delete account */}
        <TouchableOpacity
          style={[styles.deleteBtn, deleting && styles.deleteBtnDisabled]}
          onPress={handleDeleteAccount}
          activeOpacity={0.8}
          disabled={deleting}
        >
          <Text style={styles.deleteText}>
            {deleting ? "Deleting…" : "Delete Account"}
          </Text>
        </TouchableOpacity>
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

  avatarSection: { alignItems: "center", paddingVertical: Spacing["3xl"] },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: Radius.full,
    backgroundColor: "#DBEAFE",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: Spacing.md,
    ...Shadows.brand,
  },
  avatarText: {
    fontSize: FontSize.displayL,
    fontWeight: "800",
    color: Colors.brand,
  },
  name: {
    fontSize: FontSize.heading1,
    fontWeight: "700",
    color: Colors.textPrimary,
  },
  email: { fontSize: FontSize.body, color: Colors.textSecondary, marginTop: 4 },

  infoCard: { marginBottom: Spacing.lg, gap: Spacing.sm },
  infoTitle: {
    fontSize: FontSize.heading3,
    fontWeight: "700",
    color: Colors.textPrimary,
  },
  infoText: { fontSize: FontSize.bodySmall, color: Colors.textSecondary },
  divider: { height: 1, backgroundColor: Colors.border, marginVertical: 4 },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 6,
  },
  infoLabel: { fontSize: FontSize.body, color: Colors.textSecondary },
  infoValue: {
    fontSize: FontSize.body,
    color: Colors.textPrimary,
    fontWeight: "500",
  },

  logoutBtn: {
    backgroundColor: "#FEF2F2",
    height: 52,
    borderRadius: Radius.md,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#FECACA",
  },
  logoutText: {
    color: Colors.danger,
    fontWeight: "600",
    fontSize: FontSize.body,
  },

  deleteBtn: {
    marginTop: Spacing.sm,
    height: 52,
    borderRadius: Radius.md,
    alignItems: "center",
    justifyContent: "center",
  },
  deleteBtnDisabled: { opacity: 0.5 },
  deleteText: {
    color: Colors.textSecondary,
    fontWeight: "600",
    fontSize: FontSize.bodySmall,
    textDecorationLine: "underline",
  },
});
