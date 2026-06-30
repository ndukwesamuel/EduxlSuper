

// ─── LoginScreen.tsx ──────────────────────────────────────────────
import React, { useState, useRef, useEffect } from "react";
import {
  View, Text, TextInput, TouchableOpacity, ScrollView,
  StyleSheet, KeyboardAvoidingView, Platform,
  ActivityIndicator, Animated, Easing, Dimensions,
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

const { width } = Dimensions.get("window");

// ── Rotating hook phrases ─────────────────────────────────────────
const PHRASES = [
  "Study smarter.\nScore higher.",
  "Exam coming.\nNot ready?",
  "Your notes.\nYour coach.\nYour results.",
  "From notes to\nexam-ready  fast.",
];

export default function LoginScreen({ navigation }: Props) {
  const dispatch = useDispatch();
  const [mode, setMode]         = useState<Mode>("login");
  const [name, setName]         = useState("");
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState("");
  const [phraseIdx, setPhraseIdx] = useState(0);
  const [showPassword, setShowPassword] = useState(false);

  // ── Animations ───────────────────────────────────────────────
  const fadeIn    = useRef(new Animated.Value(0)).current;
  const slideUp   = useRef(new Animated.Value(50)).current;
  const shakeAnim = useRef(new Animated.Value(0)).current;
  const btnScale  = useRef(new Animated.Value(1)).current;
  const phraseOpacity = useRef(new Animated.Value(1)).current;
  const tabSlide  = useRef(new Animated.Value(0)).current;
  const formOpacity = useRef(new Animated.Value(1)).current;

  // Input border anims
  const emailBorder    = useRef(new Animated.Value(0)).current;
  const passwordBorder = useRef(new Animated.Value(0)).current;
  const nameBorder     = useRef(new Animated.Value(0)).current;

  // Floating dots animation
  const dot1Y = useRef(new Animated.Value(0)).current;
  const dot2Y = useRef(new Animated.Value(0)).current;
  const dot3Y = useRef(new Animated.Value(0)).current;

  // Mount entrance
  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeIn, { toValue: 1, duration: 600, useNativeDriver: true, easing: Easing.out(Easing.ease) }),
      Animated.spring(slideUp, { toValue: 0, tension: 60, friction: 10, useNativeDriver: true }),
    ]).start();

    // Floating dots loop
    const floatDot = (anim: Animated.Value, delay: number) => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(anim, { toValue: -12, duration: 2000, delay, useNativeDriver: true, easing: Easing.inOut(Easing.sin) }),
          Animated.timing(anim, { toValue: 0, duration: 2000, useNativeDriver: true, easing: Easing.inOut(Easing.sin) }),
        ])
      ).start();
    };
    floatDot(dot1Y, 0);
    floatDot(dot2Y, 600);
    floatDot(dot3Y, 1200);
  }, []);

  // Phrase cycling
  useEffect(() => {
    const interval = setInterval(() => {
      Animated.timing(phraseOpacity, { toValue: 0, duration: 300, useNativeDriver: true }).start(() => {
        setPhraseIdx((i) => (i + 1) % PHRASES.length);
        Animated.timing(phraseOpacity, { toValue: 1, duration: 400, useNativeDriver: true }).start();
      });
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const shake = () => {
    Animated.sequence([
      Animated.timing(shakeAnim, { toValue: 10,  duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -10, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 8,   duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -8,  duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 0,   duration: 50, useNativeDriver: true }),
    ]).start();
  };

  const pressIn  = () => Animated.spring(btnScale, { toValue: 0.95, tension: 300, friction: 10, useNativeDriver: true }).start();
  const pressOut = () => Animated.spring(btnScale, { toValue: 1, tension: 300, friction: 10, useNativeDriver: true }).start();

  const animateBorder = (anim: Animated.Value, val: number) =>
    Animated.spring(anim, { toValue: val, tension: 200, friction: 10, useNativeDriver: false }).start();

  const switchMode = (newMode: Mode) => {
    if (newMode === mode) return;
    Animated.sequence([
      Animated.timing(formOpacity, { toValue: 0, duration: 120, useNativeDriver: true }),
      Animated.timing(formOpacity, { toValue: 1, duration: 200, useNativeDriver: true }),
    ]).start();
    setMode(newMode);
    setError("");
  };

  const handleSubmit = async () => {
    setError("");
    if (!email.trim() || !password.trim()) { setError("Email and password are required."); shake(); return; }
    if (password.length < 6) { setError("Password must be at least 6 characters."); shake(); return; }
    if (mode === "register" && !name.trim()) { setError("Please enter your full name."); shake(); return; }
    setLoading(true);
    try {
      const data = mode === "login"
        ? await loginUser(email.trim(), password)
        : await registerUser(name.trim(), email.trim(), password);
      dispatch(setUser({ user: data.user, token: data.token }));
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message ?? "Request failed. Check your connection.";
      setError(msg);
      shake();
    } finally {
      setLoading(false);
    }
  };

  const emailBorderColor    = emailBorder.interpolate({ inputRange: [0, 1], outputRange: ['rgba(255,255,255,0.15)', '#60A5FA'] });
  const passwordBorderColor = passwordBorder.interpolate({ inputRange: [0, 1], outputRange: ['rgba(255,255,255,0.15)', '#60A5FA'] });
  const nameBorderColor     = nameBorder.interpolate({ inputRange: [0, 1], outputRange: ['rgba(255,255,255,0.15)', '#60A5FA'] });

  return (
    <SafeAreaView style={s.safe}>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={s.scroll} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
          <Animated.View style={{ opacity: fadeIn, transform: [{ translateY: slideUp }] }}>

            {/* ── DARK HERO ──────────────────────────────────── */}
            <View style={s.hero}>
              {/* Floating accent dots */}
              <Animated.View style={[s.dot, s.dot1, { transform: [{ translateY: dot1Y }] }]} />
              <Animated.View style={[s.dot, s.dot2, { transform: [{ translateY: dot2Y }] }]} />
              <Animated.View style={[s.dot, s.dot3, { transform: [{ translateY: dot3Y }] }]} />

              {/* App identity */}
              <View style={s.logoRow}>
                <View style={s.logoBox}>
                  <Text style={s.logoEmoji}>⚡</Text>
                </View>
                <View>
                  <Text style={s.appName}>EduXL</Text>
                  <Text style={s.appSub}>Your Personal Study Coach</Text>
                </View>
              </View>

              {/* Cycling headline */}
              <Animated.Text style={[s.headline, { opacity: phraseOpacity }]}>
                {PHRASES[phraseIdx]}
              </Animated.Text>

              {/* Social proof */}
              <View style={s.proofRow}>
                <View style={s.proofAvatars}>
                  {['🧑🏾', '👩🏽', '🧑🏿', '👩🏾'].map((e, i) => (
                    <View key={i} style={[s.proofAvatar, { marginLeft: i === 0 ? 0 : -10 }]}>
                      <Text style={{ fontSize: 16 }}>{e}</Text>
                    </View>
                  ))}
                </View>
                <Text style={s.proofText}>Join 30+ students studying smarter 🇳🇬</Text>
              </View>
            </View>

            {/* ── FORM CARD ──────────────────────────────────── */}
            <View style={s.card}>

              {/* Tab switcher */}
              <View style={s.tabRow}>
                {(['login', 'register'] as Mode[]).map((m) => (
                  <TouchableOpacity
                    key={m}
                    style={[s.tab, mode === m && s.tabActive]}
                    onPress={() => switchMode(m)}
                    activeOpacity={0.8}
                  >
                    <Text style={[s.tabText, mode === m && s.tabTextActive]}>
                      {m === 'login' ? 'Sign In' : 'Create Account'}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Animated.View style={{ opacity: formOpacity }}>

                {/* Welcome copy */}
                <View style={s.welcomeRow}>
                  <Text style={s.welcomeTitle}>
                    {mode === 'login' ? 'Welcome back 👋' : "Let's get you started 🚀"}
                  </Text>
                  <Text style={s.welcomeSub}>
                    {mode === 'login'
                      ? 'Sign in to continue your prep journey'
                      : 'Create your account in under a minute'}
                  </Text>
                </View>

                {/* Name — register only */}
                {mode === 'register' && (
                  <View style={s.fieldGroup}>
                    <Text style={s.label}>Full Name</Text>
                    <Animated.View style={[s.inputWrap, { borderColor: nameBorderColor }]}>
                      <Text style={s.inputIcon}>👤</Text>
                      <TextInput
                        style={s.input}
                        placeholder="e.g. Chukwuemeka Obi"
                        placeholderTextColor="#9CA3AF"
                        value={name}
                        onChangeText={setName}
                        autoCapitalize="words"
                        editable={!loading}
                        onFocus={() => animateBorder(nameBorder, 1)}
                        onBlur={() => animateBorder(nameBorder, 0)}
                      />
                    </Animated.View>
                  </View>
                )}

                {/* Email */}
                <View style={s.fieldGroup}>
                  <Text style={s.label}>Email Address</Text>
                  <Animated.View style={[s.inputWrap, { borderColor: emailBorderColor }]}>
                    <Text style={s.inputIcon}>✉️</Text>
                    <TextInput
                      style={s.input}
                      placeholder="you@example.com"
                      placeholderTextColor="#9CA3AF"
                      value={email}
                      onChangeText={setEmail}
                      keyboardType="email-address"
                      autoCapitalize="none"
                      autoCorrect={false}
                      editable={!loading}
                      onFocus={() => animateBorder(emailBorder, 1)}
                      onBlur={() => animateBorder(emailBorder, 0)}
                    />
                  </Animated.View>
                </View>

                {/* Password */}
                <View style={s.fieldGroup}>
                  <Text style={s.label}>Password</Text>
                  <Animated.View style={[s.inputWrap, { borderColor: passwordBorderColor }]}>
                    <Text style={s.inputIcon}>🔒</Text>
                    <TextInput
                      style={[s.input, { flex: 1 }]}
                      placeholder="Min. 6 characters"
                      placeholderTextColor="#9CA3AF"
                      value={password}
                      onChangeText={setPassword}
                      secureTextEntry={!showPassword}
                      editable={!loading}
                      onFocus={() => animateBorder(passwordBorder, 1)}
                      onBlur={() => animateBorder(passwordBorder, 0)}
                    />
                    <TouchableOpacity
                      onPress={() => setShowPassword((v) => !v)}
                      style={s.eyeBtn}
                      activeOpacity={0.7}
                    >
                      <Text style={s.eyeIcon}>{showPassword ? '🙈' : '👁️'}</Text>
                    </TouchableOpacity>
                  </Animated.View>
                </View>


                <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')}>
  <Text style={{ color: '#1D4ED8', fontSize: 13, fontWeight: '600' }}>
    Forgot password?
  </Text>
</TouchableOpacity>

                {/* Error */}
                {error !== "" && (
                  <Animated.View style={[s.errorBox, { transform: [{ translateX: shakeAnim }] }]}>
                    <Text style={s.errorIcon}>⚠️</Text>
                    <Text style={s.errorText}>{error}</Text>
                  </Animated.View>
                )}

                {/* Submit button */}
                <Animated.View style={{ transform: [{ scale: btnScale }] }}>
                  <TouchableOpacity
                    style={[s.btnPrimary, loading && s.btnDisabled]}
                    onPressIn={pressIn}
                    onPressOut={pressOut}
                    onPress={handleSubmit}
                    disabled={loading}
                    activeOpacity={1}
                  >
                    {loading ? (
                      <ActivityIndicator color="#fff" />
                    ) : (
                      <Text style={s.btnText}>
                        {mode === 'login' ? 'Sign In →' : 'Create Account →'}
                      </Text>
                    )}
                  </TouchableOpacity>
                </Animated.View>

                {/* Divider */}
                <View style={s.divider}>
                  <View style={s.dividerLine} />
                  <Text style={s.dividerText}>
                    {mode === 'login' ? "New here?" : "Already have an account?"}
                  </Text>
                  <View style={s.dividerLine} />
                </View>

                {/* Switch mode link */}
                <TouchableOpacity
                  style={s.switchBtn}
                  onPress={() => switchMode(mode === 'login' ? 'register' : 'login')}
                  activeOpacity={0.7}
                >
                  <Text style={s.switchText}>
                    {mode === 'login' ? 'Create a free account' : 'Sign into existing account'}
                  </Text>
                </TouchableOpacity>

              </Animated.View>
            </View>

            {/* ── TRUST STRIP ────────────────────────────────── */}
            <View style={s.trustStrip}>
              {[
                { icon: '🎯', label: 'DrillPad' },
                { icon: '🏦', label: 'BankReady' },
                { icon: '🏢', label: 'Shell Track' },
              ].map((t) => (
                <View key={t.label} style={s.trustItem}>
                  <Text style={s.trustIcon}>{t.icon}</Text>
                  <Text style={s.trustLabel}>{t.label}</Text>
                </View>
              ))}
            </View>

            <Text style={s.footer}>By continuing you agree to our Terms & Privacy Policy</Text>

          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe:   { flex: 1, backgroundColor: '#0F172A' },
  scroll: { paddingBottom: 48 },

  // ── Hero ──────────────────────────────────────────────────────
  hero: {
    backgroundColor: '#0F172A',
    paddingHorizontal: 24,
    paddingTop: 32,
    paddingBottom: 36,
    overflow: 'hidden',
  },
  dot:  { position: 'absolute', borderRadius: 999 },
  dot1: { width: 80, height: 80, backgroundColor: 'rgba(96,165,250,0.08)', top: 10, right: -10 },
  dot2: { width: 50, height: 50, backgroundColor: 'rgba(167,139,250,0.1)', top: 60, left: 20 },
  dot3: { width: 120, height: 120, backgroundColor: 'rgba(52,211,153,0.06)', bottom: -20, right: 30 },

  logoRow:   { flexDirection: 'row', alignItems: 'center', gap: 14, marginBottom: 28 },
  logoBox:   { width: 52, height: 52, borderRadius: 16, backgroundColor: '#1D4ED8', alignItems: 'center', justifyContent: 'center', shadowColor: '#1D4ED8', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.5, shadowRadius: 12, elevation: 8 },
  logoEmoji: { fontSize: 26 },
  appName:   { fontSize: 26, fontWeight: '800', color: '#fff', letterSpacing: -0.5 },
  appSub:    { fontSize: 12, color: 'rgba(255,255,255,0.5)', fontWeight: '500', marginTop: 2 },

  headline: { fontSize: 38, fontWeight: '800', color: '#fff', lineHeight: 46, letterSpacing: -1.2, marginBottom: 24 },

  proofRow:     { flexDirection: 'row', alignItems: 'center', gap: 10 },
  proofAvatars: { flexDirection: 'row' },
  proofAvatar:  { width: 32, height: 32, borderRadius: 16, backgroundColor: '#1E293B', borderWidth: 2, borderColor: '#0F172A', alignItems: 'center', justifyContent: 'center' },
  proofText:    { fontSize: 12, color: 'rgba(255,255,255,0.55)', fontWeight: '500', flex: 1 },

  // ── Card ──────────────────────────────────────────────────────
  card: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    paddingHorizontal: 24,
    paddingTop: 28,
    paddingBottom: 8,
    minHeight: 500,
  },

  // Tab switcher
  tabRow:        { flexDirection: 'row', backgroundColor: '#F1F5F9', borderRadius: 14, padding: 4, marginBottom: 24 },
  tab:           { flex: 1, paddingVertical: 11, alignItems: 'center', borderRadius: 10 },
  tabActive:     { backgroundColor: '#0F172A', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.12, shadowRadius: 6, elevation: 3 },
  tabText:       { fontSize: 14, color: '#94A3B8', fontWeight: '600' },
  tabTextActive: { color: '#fff', fontWeight: '700' },

  // Welcome copy
  welcomeRow:   { marginBottom: 22 },
  welcomeTitle: { fontSize: 22, fontWeight: '800', color: '#0F172A', letterSpacing: -0.3, marginBottom: 4 },
  welcomeSub:   { fontSize: 13, color: '#64748B', lineHeight: 20 },

  // Fields
  fieldGroup: { marginBottom: 16 },
  label:      { fontSize: 12, fontWeight: '700', color: '#374151', marginBottom: 7, letterSpacing: 0.2 },
  inputWrap:  { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F8FAFC', borderWidth: 1.5, borderRadius: 14, paddingHorizontal: 14, overflow: 'hidden' },
  inputIcon:  { fontSize: 16, marginRight: 10 },
  input:      { flex: 1, paddingVertical: 14, fontSize: 15, color: '#0F172A', fontWeight: '500' },
  eyeBtn:     { padding: 8 },
  eyeIcon:    { fontSize: 16 },

  // Error
  errorBox:  { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: '#FEF2F2', borderWidth: 1, borderColor: '#FECACA', borderRadius: 12, padding: 12, marginBottom: 16 },
  errorIcon: { fontSize: 14 },
  errorText: { fontSize: 13, color: '#EF4444', fontWeight: '500', flex: 1 },

  // Button
  btnPrimary:  { backgroundColor: '#0F172A', height: 56, borderRadius: 999, alignItems: 'center', justifyContent: 'center', shadowColor: '#0F172A', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.3, shadowRadius: 14, elevation: 6 },
  btnDisabled: { opacity: 0.5 },
  btnText:     { color: '#fff', fontSize: 16, fontWeight: '800', letterSpacing: 0.3 },

  // Divider
  divider:     { flexDirection: 'row', alignItems: 'center', gap: 10, marginVertical: 20 },
  dividerLine: { flex: 1, height: 1, backgroundColor: '#E2E8F0' },
  dividerText: { fontSize: 12, color: '#94A3B8', fontWeight: '500' },

  // Switch mode
  switchBtn:  { alignItems: 'center', paddingVertical: 12 },
  switchText: { fontSize: 14, fontWeight: '700', color: '#1D4ED8' },

  // Trust strip
  trustStrip: { flexDirection: 'row', justifyContent: 'center', gap: 24, paddingVertical: 24, backgroundColor: '#fff', borderTopWidth: 1, borderTopColor: '#F1F5F9' },
  trustItem:  { alignItems: 'center', gap: 4 },
  trustIcon:  { fontSize: 20 },
  trustLabel: { fontSize: 11, color: '#94A3B8', fontWeight: '600' },

  // Footer
  footer: { textAlign: 'center', fontSize: 11, color: 'rgba(255,255,255,0.25)', paddingVertical: 20, backgroundColor: '#0F172A' },
});