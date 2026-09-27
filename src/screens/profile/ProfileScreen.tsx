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
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../store/store";
import { clearUser } from "../../store/authSlice";
import { Colors, FontSize, Radius, Spacing, Shadows } from "../../theme";
import CCCard from "../../components/CCCard";
import { deleteAccount } from "../../../config/client";
import { AppStackParamList } from "../../navigation/types";
import PersonaModal from "../home/PersonaModal";
import { showToast } from "../../store/toastSlice";
// import { CCCard } from '../../components';

type Nav = NativeStackNavigationProp<AppStackParamList>;

const PERSONA_LABEL: Record<string, string> = {
  undergraduate: "University Student",
  graduate: "Graduate / Professional",
};

export default function ProfileScreen() {
  const user = useSelector((s: RootState) => s.auth.user);
  const persona = useSelector((s: RootState) => s.profile.status?.persona);
  const dispatch = useDispatch();
  const navigation = useNavigation<Nav>();
  const [deleting, setDeleting] = useState(false);
  const [showPersonaModal, setShowPersonaModal] = useState(false);

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
              dispatch(showToast({ message: "Account deleted", variant: "success" }));
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
          <Text style={styles.infoTitle}>EduXL</Text>
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
            <Text style={styles.infoValue}>🏦 Banking Exams</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Coming Soon</Text>
            <Text style={styles.infoValue}>ICAN, ACCA, Interview Prep</Text>
          </View>
        </CCCard>

        {/* Study focus */}
        <TouchableOpacity
          style={styles.studyFocusBtn}
          onPress={() => setShowPersonaModal(true)}
          activeOpacity={0.8}
        >
          <View>
            <Text style={styles.studyFocusLabel}>Study focus</Text>
            <Text style={styles.studyFocusValue}>
              {persona ? PERSONA_LABEL[persona] ?? persona : "Not set"}
            </Text>
          </View>
          <Text style={styles.studyFocusChange}>Change</Text>
        </TouchableOpacity>

        {/* Help */}
        <TouchableOpacity
          style={styles.helpBtn}
          onPress={() => navigation.navigate('Help' as any)}
          activeOpacity={0.8}
        >
          <Text style={styles.helpText}>Help & FAQ</Text>
        </TouchableOpacity>

        {/* Logout */}
        <TouchableOpacity
          style={styles.logoutBtn}
          onPress={() => {
            dispatch(showToast({ message: "Signed out", variant: "info" }));
            dispatch(clearUser());
          }}
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

      <PersonaModal
        visible={showPersonaModal}
        initialPersona={persona as any}
        onComplete={() => setShowPersonaModal(false)}
      />
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

  studyFocusBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: Colors.surface,
    height: 60,
    borderRadius: Radius.md,
    paddingHorizontal: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: Spacing.md,
  },
  studyFocusLabel: {
    fontSize: FontSize.caption,
    color: Colors.textMuted,
    fontWeight: "500",
  },
  studyFocusValue: {
    fontSize: FontSize.body,
    color: Colors.textPrimary,
    fontWeight: "600",
    marginTop: 2,
  },
  studyFocusChange: {
    fontSize: FontSize.bodySmall,
    color: Colors.brand,
    fontWeight: "700",
  },

  helpBtn: {
    backgroundColor: Colors.surface,
    height: 52,
    borderRadius: Radius.md,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: Spacing.md,
  },
  helpText: {
    color: Colors.textPrimary,
    fontWeight: "600",
    fontSize: FontSize.body,
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
