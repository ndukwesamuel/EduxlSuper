import React, { useState, useRef, useEffect } from "react";
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
  Animated,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDispatch } from "react-redux";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { AuthStackParamList } from "../../navigation/types";
import { setUser } from "../../store/authSlice";
import { loginUser, registerUser } from "../../../config/client";

type Props = {
  navigation: NativeStackNavigationProp<AuthStackParamList, "Login">;
};

type Mode = "login" | "register";

export default function LoginScreen({ navigation }: Props) {
  const dispatch = useDispatch();
  const [mode, setMode]         = useState<Mode>("login");
  const [name, setName]         = useState("");
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState("");
  const [emailFocused, setEmailFocused]       = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [nameFocused, setNameFocused]         = useState(false);

  // ── Entrance animation ───────────────────────────────────────
  const fadeAnim  = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(40)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1, duration: 400, useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0, tension: 65, friction: 10, useNativeDriver: true,
      }),
    ]).start();
  }, []);

  // ── Icon bounce on mount ─────────────────────────────────────
  const iconBounce = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.spring(iconBounce, {
      toValue: 1, tension: 50, friction: 7, delay: 200, useNativeDriver: true,
    }).start();
  }, []);

  // ── Button press animation ───────────────────────────────────
  const btnScale = useRef(new Animated.Value(1)).current;
  const pressIn  = () => Animated.spring(btnScale, { toValue: 0.96, tension: 300, friction: 10, useNativeDriver: true }).start();
  const pressOut = () => Animated.spring(btnScale, { toValue: 1,    tension: 300, friction: 10, useNativeDriver: true }).start();

  // ── Shake animation for errors ───────────────────────────────
  const shakeAnim = useRef(new Animated.Value(0)).current;
  const shake = () => {
    Animated.sequence([
      Animated.timing(shakeAnim, { toValue: 8,  duration: 60, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -8, duration: 60, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 6,  duration: 60, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -6, duration: 60, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 0,  duration: 60, useNativeDriver: true }),
    ]).start();
  };

  // ── Input focus animations ───────────────────────────────────
  const emailBorder    = useRef(new Animated.Value(0)).current;
  const passwordBorder = useRef(new Animated.Value(0)).current;
  const nameBorder     = useRef(new Animated.Value(0)).current;

  const animateBorder = (anim: Animated.Value, toValue: number) => {
    Animated.spring(anim, { toValue, tension: 200, friction: 10, useNativeDriver: false }).start();
  };

  const handleSubmit = async () => {
    setError("");
    if (!email.trim() || !password.trim()) {
      setError("Email and password are required.");
      shake();
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      shake();
      return;
    }
    if (mode === "register" && !name.trim()) {
      setError("Please enter your full name.");
      shake();
      return;
    }
    setLoading(true);
    try {
      const data =
        mode === "login"
          ? await loginUser(email.trim(), password)
          : await registerUser(name.trim(), email.trim(), password);
      dispatch(setUser({ user: data.user, token: data.token }));
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response
          ?.data?.message ?? "Request failed. Check your connection.";
      setError(msg);
      shake();
    } finally {
      setLoading(false);
    }
  };

  const getEmailBorderColor  = () => emailBorder.interpolate({ inputRange: [0, 1], outputRange: ['#E2E8F0', '#1D4ED8'] });
  const getPasswordBorderColor = () => passwordBorder.interpolate({ inputRange: [0, 1], outputRange: ['#E2E8F0', '#1D4ED8'] });
  const getNameBorderColor   = () => nameBorder.interpolate({ inputRange: [0, 1], outputRange: ['#E2E8F0', '#1D4ED8'] });

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
          <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}>

            {/* ── Hero ── */}
            <View style={styles.hero}>
              <Animated.View style={[styles.iconWrap, {
                transform: [{ scale: iconBounce.interpolate({ inputRange: [0, 1], outputRange: [0.5, 1] }) }],
                opacity: iconBounce,
              }]}>
                {/* Glow ring behind icon */}
                <View style={styles.iconGlow} />
                <Text style={styles.iconEmoji}>🎓</Text>
              </Animated.View>
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
                activeOpacity={0.8}
              >
                <Text style={[styles.tabText, mode === "login" && styles.tabTextActive]}>
                  Sign In
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.tab, mode === "register" && styles.tabActive]}
                onPress={() => { setMode("register"); setError(""); }}
                activeOpacity={0.8}
              >
                <Text style={[styles.tabText, mode === "register" && styles.tabTextActive]}>
                  Register
                </Text>
              </TouchableOpacity>
            </View>

            {/* ── Form card ── */}
            <Animated.View style={[styles.card, { transform: [{ translateX: shakeAnim }] }]}>

              {/* Name — register only */}
              {mode === "register" && (
                <View style={styles.fieldGroup}>
                  <Text style={styles.label}>Full Name</Text>
                  <Animated.View style={[styles.inputWrap, { borderColor: getNameBorderColor() }]}>
                    <TextInput
                      style={styles.input}
                      placeholder="Your full name"
                      placeholderTextColor="#94A3B8"
                      value={name}
                      onChangeText={setName}
                      autoCapitalize="words"
                      editable={!loading}
                      onFocus={() => { setNameFocused(true);  animateBorder(nameBorder, 1); }}
                      onBlur={()  => { setNameFocused(false); animateBorder(nameBorder, 0); }}
                    />
                  </Animated.View>
                </View>
              )}

              {/* Email */}
              <View style={styles.fieldGroup}>
                <Text style={styles.label}>Email Address</Text>
                <Animated.View style={[styles.inputWrap, { borderColor: getEmailBorderColor() }]}>
                  <TextInput
                    style={styles.input}
                    placeholder="you@example.com"
                    placeholderTextColor="#94A3B8"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                    editable={!loading}
                    onFocus={() => { setEmailFocused(true);  animateBorder(emailBorder, 1); }}
                    onBlur={()  => { setEmailFocused(false); animateBorder(emailBorder, 0); }}
                  />
                </Animated.View>
              </View>

              {/* Password */}
              <View style={styles.fieldGroup}>
                <Text style={styles.label}>Password</Text>
                <Animated.View style={[styles.inputWrap, { borderColor: getPasswordBorderColor() }]}>
                  <TextInput
                    style={styles.input}
                    placeholder="Min. 6 characters"
                    placeholderTextColor="#94A3B8"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                    editable={!loading}
                    onFocus={() => { setPasswordFocused(true);  animateBorder(passwordBorder, 1); }}
                    onBlur={()  => { setPasswordFocused(false); animateBorder(passwordBorder, 0); }}
                  />
                </Animated.View>
              </View>

              {/* Error */}
              {error !== "" && (
                <Animated.View style={[styles.errorBox, { opacity: fadeAnim }]}>
                  <Text style={styles.errorIcon}>⚠️</Text>
                  <Text style={styles.errorText}>{error}</Text>
                </Animated.View>
              )}

              {/* Submit */}
              <Animated.View style={{ transform: [{ scale: btnScale }] }}>
                <TouchableOpacity
                  style={[styles.btnPrimary, loading && styles.btnDisabled]}
                  onPressIn={pressIn}
                  onPressOut={pressOut}
                  onPress={handleSubmit}
                  disabled={loading}
                  activeOpacity={1}
                >
                  {loading ? (
                    <ActivityIndicator color="#fff" />
                  ) : (
                    <Text style={styles.btnPrimaryText}>
                      {mode === "login" ? "Sign In →" : "Create Account →"}
                    </Text>
                  )}
                </TouchableOpacity>
              </Animated.View>

            </Animated.View>

          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe:   { flex: 1, backgroundColor: '#F8FAFC' },
  scroll: { padding: 16, paddingBottom: 48 },

  // ── Hero ──────────────────────────────────────────────────────
  hero: {
    alignItems: 'center',
    marginBottom: 28,
    marginTop: 28,
  },
  iconWrap: {
    width: 84,
    height: 84,
    borderRadius: 24,
    backgroundColor: '#DBEAFE',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 18,
    shadowColor: '#1D4ED8',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.30,
    shadowRadius: 16,
    elevation: 8,
  },
  iconGlow: {
    position: 'absolute',
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(29,78,216,0.08)',
  },
  iconEmoji: { fontSize: 40 },
  appName: {
    fontSize: 30,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: -0.5,
  },
  tagline: {
    fontSize: 15,
    color: '#475569',
    marginTop: 6,
    textAlign: 'center',
    lineHeight: 22,
  },
  pill: {
    marginTop: 14,
    paddingHorizontal: 16,
    paddingVertical: 7,
    backgroundColor: '#DBEAFE',
    borderRadius: 9999,
    borderWidth: 1,
    borderColor: '#BFDBFE',
  },
  pillText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#1D4ED8',
  },

  // ── Tabs ──────────────────────────────────────────────────────
  tabRow: {
    flexDirection: 'row',
    backgroundColor: '#F1F5F9',
    borderRadius: 14,
    padding: 4,
    marginBottom: 16,
  },
  tab: {
    flex: 1,
    paddingVertical: 11,
    alignItems: 'center',
    borderRadius: 10,
  },
  tabActive: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
  },
  tabText:       { fontSize: 15, color: '#94A3B8', fontWeight: '500' },
  tabTextActive: { color: '#0F172A', fontWeight: '700' },

  // ── Form Card ─────────────────────────────────────────────────
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 24,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 4,
  },

  // ── Inputs ────────────────────────────────────────────────────
  fieldGroup: { marginBottom: 16 },
  label: {
    fontSize: 13,
    color: '#475569',
    marginBottom: 8,
    fontWeight: '600',
  },
  inputWrap: {
    backgroundColor: '#F1F5F9',
    borderWidth: 1.5,
    borderRadius: 12,
    overflow: 'hidden',
  },
  input: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 15,
    color: '#0F172A',
    fontWeight: '500',
  },

  // ── Error ─────────────────────────────────────────────────────
  errorBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FECACA',
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
  },
  errorIcon: { fontSize: 14 },
  errorText: { fontSize: 13, color: '#EF4444', fontWeight: '500', flex: 1 },

  // ── Button ────────────────────────────────────────────────────
  btnPrimary: {
    backgroundColor: '#1D4ED8',
    height: 54,
    borderRadius: 9999,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#1D4ED8',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 14,
    elevation: 6,
  },
  btnDisabled:    { opacity: 0.5 },
  btnPrimaryText: { color: '#fff', fontSize: 16, fontWeight: '700', letterSpacing: 0.2 },
});