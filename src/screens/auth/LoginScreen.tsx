// ─── LoginScreen.tsx ──────────────────────────────────────────────
// Equivalent of web LoginPage.tsx
// Email login + quick demo accounts

import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDispatch } from "react-redux";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { AuthStackParamList } from "../../navigation/types";
// import { setUser } from '../../store/authSlice';
// import { loginUser, listUsers } from '../../api/client';
import { Colors, FontSize, Radius, Spacing, Shadows } from "../../theme";
import { setUser } from "../../store/authSlice";
import { loginUser, listUsers } from "../../api/client";

type Props = {
  navigation: NativeStackNavigationProp<AuthStackParamList, "Login">;
};

const AVATAR_COLORS = [
  { bg: "#DBEAFE", text: Colors.brand },
  { bg: "#EDE9FE", text: Colors.purple },
  { bg: "#FFEDD5", text: Colors.abstract },
  { bg: "#D1FAE5", text: Colors.success },
  { bg: "#FCE7F3", text: "#BE185D" },
];

export default function LoginScreen({ navigation }: Props) {
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [quickLoading, setQuickLoading] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [seededUsers, setSeededUsers] = useState<
    { _id: string; name: string; email: string }[]
  >([]);

  useEffect(() => {
    listUsers()
      .then((d) => setSeededUsers(d.users))
      .catch(() => {});
  }, []);

  const handleLogin = async () => {
    setError("");
    if (!email.trim()) {
      setError("Please enter your email address.");
      return;
    }
    setLoading(true);
    try {
      const data = await loginUser(email.trim(), name.trim() || undefined);
      dispatch(setUser(data.user));
    } catch (err: unknown) {
      console.log({
        err,
      });

      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message ?? "Login failed. Is the backend running?";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLogin = async (u: {
    _id: string;
    name: string;
    email: string;
  }) => {
    setError("");
    setQuickLoading(u._id);
    try {
      const data = await loginUser(u.email);
      dispatch(setUser(data.user));
    } catch {
      setError("Quick login failed.");
    } finally {
      setQuickLoading(null);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* ── Hero ── */}
          <View style={styles.hero}>
            <View style={styles.iconWrap}>
              <Text style={styles.iconEmoji}>🎓</Text>
            </View>
            <Text style={styles.appName}>CareerClarity</Text>
            <Text style={styles.tagline}>
              Africa's Career Readiness Platform
            </Text>
            <View style={styles.pill}>
              <Text style={styles.pillText}>🏦 BankReady Module</Text>
            </View>
          </View>

          {/* ── Form card ── */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Sign In</Text>

            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Email Address</Text>
              <TextInput
                style={styles.input}
                placeholder="you@example.com"
                placeholderTextColor={Colors.textMuted}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                editable={!loading}
              />
            </View>

            <View style={styles.fieldGroup}>
              <Text style={styles.label}>
                Full Name{" "}
                <Text style={styles.labelNote}>(only for new accounts)</Text>
              </Text>
              <TextInput
                style={styles.input}
                placeholder="Your full name"
                placeholderTextColor={Colors.textMuted}
                value={name}
                onChangeText={setName}
                editable={!loading}
              />
            </View>

            {error !== "" && (
              <View style={styles.errorBox}>
                <Text style={styles.errorText}>{error}</Text>
              </View>
            )}

            <TouchableOpacity
              style={[styles.btnPrimary, loading && styles.btnDisabled]}
              onPress={handleLogin}
              disabled={loading}
              activeOpacity={0.8}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.btnPrimaryText}>Continue →</Text>
              )}
            </TouchableOpacity>
          </View>

          {/* ── Demo accounts ── */}
          {seededUsers.length > 0 && (
            <View style={styles.card}>
              <View style={styles.dividerRow}>
                <View style={styles.dividerLine} />
                <Text style={styles.dividerText}>DEMO ACCOUNTS</Text>
                <View style={styles.dividerLine} />
              </View>
              <Text style={styles.demoHint}>
                Tap any account to log in instantly
              </Text>

              {seededUsers.map((u, i) => {
                const colors = AVATAR_COLORS[i % AVATAR_COLORS.length];
                const isLoading = quickLoading === u._id;
                return (
                  <TouchableOpacity
                    key={u._id}
                    style={styles.demoBtn}
                    onPress={() => handleQuickLogin(u)}
                    disabled={!!quickLoading}
                    activeOpacity={0.7}
                  >
                    <View
                      style={[styles.avatar, { backgroundColor: colors.bg }]}
                    >
                      {isLoading ? (
                        <ActivityIndicator size="small" color={colors.text} />
                      ) : (
                        <Text
                          style={[styles.avatarText, { color: colors.text }]}
                        >
                          {u.name.charAt(0).toUpperCase()}
                        </Text>
                      )}
                    </View>
                    <View style={styles.demoInfo}>
                      <Text style={styles.demoName}>{u.name}</Text>
                      <Text style={styles.demoEmail}>{u.email}</Text>
                    </View>
                    <Text style={styles.demoArrow}>→</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  scroll: { padding: Spacing.lg, paddingBottom: Spacing["4xl"] },

  hero: {
    alignItems: "center",
    marginBottom: Spacing["3xl"],
    marginTop: Spacing["2xl"],
  },
  iconWrap: {
    width: 72,
    height: 72,
    borderRadius: Radius.xl,
    backgroundColor: "#DBEAFE",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: Spacing.md,
    ...Shadows.brand,
  },
  iconEmoji: { fontSize: 36 },
  appName: {
    fontSize: FontSize.displayL,
    fontWeight: "800",
    color: Colors.textPrimary,
    letterSpacing: -0.5,
  },
  tagline: {
    fontSize: FontSize.body,
    color: Colors.textSecondary,
    marginTop: 6,
    textAlign: "center",
  },
  pill: {
    marginTop: Spacing.md,
    paddingHorizontal: 14,
    paddingVertical: 6,
    backgroundColor: "#DBEAFE",
    borderRadius: Radius.full,
    borderWidth: 1,
    borderColor: "#BFDBFE",
  },
  pillText: {
    fontSize: FontSize.caption,
    fontWeight: "700",
    color: Colors.brand,
  },

  card: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.xl,
    padding: Spacing["2xl"],
    marginBottom: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    ...Shadows.sm,
  },
  cardTitle: {
    fontSize: FontSize.heading3,
    fontWeight: "600",
    color: Colors.textPrimary,
    marginBottom: Spacing.lg,
  },

  fieldGroup: { marginBottom: Spacing.md },
  label: {
    fontSize: FontSize.bodySmall,
    color: Colors.textSecondary,
    marginBottom: 6,
    fontWeight: "500",
  },
  labelNote: {
    fontSize: FontSize.micro,
    color: Colors.textMuted,
    fontWeight: "400",
  },
  input: {
    backgroundColor: Colors.surface2,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radius.md,
    paddingHorizontal: Spacing.lg,
    paddingVertical: 14,
    fontSize: FontSize.body,
    color: Colors.textPrimary,
  },

  errorBox: {
    backgroundColor: "#FEF2F2",
    borderWidth: 1,
    borderColor: "#FECACA",
    borderRadius: Radius.md,
    padding: Spacing.md,
    marginBottom: Spacing.md,
  },
  errorText: { fontSize: FontSize.bodySmall, color: Colors.danger },

  btnPrimary: {
    backgroundColor: Colors.brand,
    height: 52,
    borderRadius: Radius.md,
    alignItems: "center",
    justifyContent: "center",
    ...Shadows.brand,
  },
  btnDisabled: { opacity: 0.6 },
  btnPrimaryText: {
    color: "#fff",
    fontSize: FontSize.bodyLarge,
    fontWeight: "600",
  },

  dividerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: Spacing.sm,
  },
  dividerLine: { flex: 1, height: 1, backgroundColor: Colors.border },
  dividerText: {
    fontSize: FontSize.micro,
    color: Colors.textMuted,
    fontWeight: "700",
    marginHorizontal: 10,
  },
  demoHint: {
    fontSize: FontSize.caption,
    color: Colors.textMuted,
    textAlign: "center",
    marginBottom: Spacing.md,
  },

  demoBtn: {
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
    backgroundColor: Colors.surface2,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: Spacing.sm,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: Radius.md,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: { fontSize: FontSize.body, fontWeight: "700" },
  demoInfo: { flex: 1, marginLeft: Spacing.md },
  demoName: {
    fontSize: FontSize.body,
    fontWeight: "600",
    color: Colors.textPrimary,
  },
  demoEmail: {
    fontSize: FontSize.caption,
    color: Colors.textMuted,
    marginTop: 2,
  },
  demoArrow: { fontSize: FontSize.body, color: Colors.textMuted },
});
