

import React, { useState } from "react";
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
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDispatch } from "react-redux";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { AuthStackParamList } from "../../navigation/types";
import { Colors, FontSize, Radius, Spacing, Shadows } from "../../theme";
import { setUser } from "../../store/authSlice";
import { loginUser, registerUser } from "../../../config/client";
// loginUser
// registerUser
type Props = {
  navigation: NativeStackNavigationProp<AuthStackParamList, "Login">;
};

type Mode = "login" | "register";

export default function LoginScreen({ navigation }: Props) {
  const dispatch = useDispatch();
  const [mode, setMode]       = useState<Mode>("login");
  const [name, setName]       = useState("");
  const [email, setEmail]     = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState("");

  const handleSubmit = async () => {
    setError("");

    // Validation
    if (!email.trim() || !password.trim()) {
      setError("Email and password are required.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    if (mode === "register" && !name.trim()) {
      setError("Please enter your full name.");
      return;
    }

    setLoading(true);
    try {
      const data =
        mode === "login"
          ? await loginUser(email.trim(), password)
          : await registerUser(name.trim(), email.trim(), password);


        console.log("Auth response:", data);

      dispatch(setUser({ user: data.user, token: data.token }));
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response
          ?.data?.message ?? "Request failed. Check your connection.";
      setError(msg);
    } finally {
      setLoading(false);
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

          {/* ── Tab switcher ── */}
          <View style={styles.tabRow}>
            <TouchableOpacity
              style={[styles.tab, mode === "login" && styles.tabActive]}
              onPress={() => { setMode("login"); setError(""); }}
            >
              <Text style={[styles.tabText, mode === "login" && styles.tabTextActive]}>
                Sign In
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.tab, mode === "register" && styles.tabActive]}
              onPress={() => { setMode("register"); setError(""); }}
            >
              <Text style={[styles.tabText, mode === "register" && styles.tabTextActive]}>
                Register
              </Text>
            </TouchableOpacity>
          </View>

          {/* ── Form card ── */}
          <View style={styles.card}>

            {/* Name — register only */}
            {mode === "register" && (
              <View style={styles.fieldGroup}>
                <Text style={styles.label}>Full Name</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Your full name"
                  placeholderTextColor={Colors.textMuted}
                  value={name}
                  onChangeText={setName}
                  autoCapitalize="words"
                  editable={!loading}
                />
              </View>
            )}

            {/* Email */}
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

            {/* Password */}
            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Password</Text>
              <TextInput
                style={styles.input}
                placeholder="Min. 6 characters"
                placeholderTextColor={Colors.textMuted}
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                editable={!loading}
              />
            </View>

            {/* Error */}
            {error !== "" && (
              <View style={styles.errorBox}>
                <Text style={styles.errorText}>{error}</Text>
              </View>
            )}

            {/* Submit */}
            <TouchableOpacity
              style={[styles.btnPrimary, loading && styles.btnDisabled]}
              onPress={handleSubmit}
              disabled={loading}
              activeOpacity={0.8}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.btnPrimaryText}>
                  {mode === "login" ? "Sign In →" : "Create Account →"}
                </Text>
              )}
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe:   { flex: 1, backgroundColor: Colors.background },
  scroll: { padding: Spacing.lg, paddingBottom: Spacing["4xl"] },

  hero: {
    alignItems: "center",
    marginBottom: Spacing["2xl"],
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
  pillText: { fontSize: FontSize.caption, fontWeight: "700", color: Colors.brand },

  tabRow: {
    flexDirection: "row",
    backgroundColor: Colors.surface2,
    borderRadius: Radius.lg,
    padding: 4,
    marginBottom: Spacing.lg,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: "center",
    borderRadius: Radius.md,
  },
  tabActive: { backgroundColor: Colors.surface, ...Shadows.sm },
  tabText: { fontSize: FontSize.body, color: Colors.textMuted, fontWeight: "500" },
  tabTextActive: { color: Colors.textPrimary, fontWeight: "700" },

  card: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.xl,
    padding: Spacing["2xl"],
    borderWidth: 1,
    borderColor: Colors.border,
    ...Shadows.sm,
  },

  fieldGroup: { marginBottom: Spacing.md },
  label: {
    fontSize: FontSize.bodySmall,
    color: Colors.textSecondary,
    marginBottom: 6,
    fontWeight: "500",
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
  btnPrimaryText: { color: "#fff", fontSize: FontSize.bodyLarge, fontWeight: "600" },
});