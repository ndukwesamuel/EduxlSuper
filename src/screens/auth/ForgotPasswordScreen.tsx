// ─── ForgotPasswordScreen.tsx ────────────────────────────────────
import React, { useState, useRef, useEffect } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  KeyboardAvoidingView, Platform, ActivityIndicator, Animated, ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../../navigation/types';
import { forgotPassword } from '../../../config/client';

type Props = {
  navigation: NativeStackNavigationProp<AuthStackParamList, 'ForgotPassword'>;
};

export default function ForgotPasswordScreen({ navigation }: Props) {
  const [email, setEmail]     = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState('');
  const [focused, setFocused] = useState(false);

  // ── Animations ───────────────────────────────────────────────
  const fadeAnim  = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(40)).current;
  const iconBounce = useRef(new Animated.Value(0)).current;
  const btnScale  = useRef(new Animated.Value(1)).current;
  const shakeAnim = useRef(new Animated.Value(0)).current;
  const emailBorder = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim,  { toValue: 1, duration: 400, useNativeDriver: true }),
      Animated.spring(slideAnim, { toValue: 0, tension: 65, friction: 10, useNativeDriver: true }),
    ]).start();
    Animated.spring(iconBounce, { toValue: 1, tension: 50, friction: 7, delay: 200, useNativeDriver: true }).start();
  }, []);

  const pressIn  = () => Animated.spring(btnScale, { toValue: 0.96, tension: 300, friction: 10, useNativeDriver: true }).start();
  const pressOut = () => Animated.spring(btnScale, { toValue: 1,    tension: 300, friction: 10, useNativeDriver: true }).start();

  const shake = () => {
    Animated.sequence([
      Animated.timing(shakeAnim, { toValue: 8,  duration: 60, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -8, duration: 60, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 6,  duration: 60, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -6, duration: 60, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 0,  duration: 60, useNativeDriver: true }),
    ]).start();
  };

  const borderColor = emailBorder.interpolate({ inputRange: [0, 1], outputRange: ['#E2E8F0', '#1D4ED8'] });

  const handleSubmit = async () => {
    setError('');
    if (!email.trim()) {
      setError('Please enter your email address.');
      shake();
      return;
    }
    setLoading(true);
    try {
      await forgotPassword(email.trim().toLowerCase());
      // Navigate to reset screen, passing email along
      navigation.navigate('ResetPassword', { email: email.trim().toLowerCase() });
    } catch (err: any) {
      const msg = err?.response?.data?.message ?? 'Something went wrong. Try again.';
      setError(msg);
      shake();
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
          <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}>

            {/* ── Back ── */}
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
              <Text style={styles.backText}>← Back to Sign In</Text>
            </TouchableOpacity>

            {/* ── Hero ── */}
            <View style={styles.hero}>
              <Animated.View style={[styles.iconWrap, {
                transform: [{ scale: iconBounce.interpolate({ inputRange: [0, 1], outputRange: [0.5, 1] }) }],
                opacity: iconBounce,
              }]}>
                <View style={styles.iconGlow} />
                <Text style={styles.iconEmoji}>🔐</Text>
              </Animated.View>
              <Text style={styles.title}>Forgot Password?</Text>
              <Text style={styles.subtitle}>
                Enter your email and we'll send you a code to reset your password.
              </Text>
            </View>

            {/* ── Form card ── */}
            <Animated.View style={[styles.card, { transform: [{ translateX: shakeAnim }] }]}>
              <View style={styles.fieldGroup}>
                <Text style={styles.label}>Email Address</Text>
                <Animated.View style={[styles.inputWrap, { borderColor }]}>
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
                    onFocus={() => Animated.spring(emailBorder, { toValue: 1, tension: 200, friction: 10, useNativeDriver: false }).start()}
                    onBlur={()  => Animated.spring(emailBorder, { toValue: 0, tension: 200, friction: 10, useNativeDriver: false }).start()}
                  />
                </Animated.View>
              </View>

              {/* Error */}
              {error !== '' && (
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
                  {loading
                    ? <ActivityIndicator color="#fff" />
                    : <Text style={styles.btnPrimaryText}>Send Reset Code →</Text>
                  }
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

  backBtn:  { marginTop: 8, marginBottom: 8 },
  backText: { fontSize: 14, color: '#1D4ED8', fontWeight: '600' },

  hero:      { alignItems: 'center', marginBottom: 28, marginTop: 20 },
  iconWrap:  { width: 84, height: 84, borderRadius: 24, backgroundColor: '#DBEAFE', alignItems: 'center', justifyContent: 'center', marginBottom: 18, shadowColor: '#1D4ED8', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.30, shadowRadius: 16, elevation: 8 },
  iconGlow:  { position: 'absolute', width: 100, height: 100, borderRadius: 50, backgroundColor: 'rgba(29,78,216,0.08)' },
  iconEmoji: { fontSize: 40 },
  title:     { fontSize: 26, fontWeight: '800', color: '#0F172A', letterSpacing: -0.5, marginBottom: 10 },
  subtitle:  { fontSize: 14, color: '#475569', textAlign: 'center', lineHeight: 22, paddingHorizontal: 16 },

  card:       { backgroundColor: '#fff', borderRadius: 20, padding: 24, borderWidth: 1, borderColor: '#E2E8F0', shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.08, shadowRadius: 16, elevation: 4 },
  fieldGroup: { marginBottom: 16 },
  label:      { fontSize: 13, color: '#475569', marginBottom: 8, fontWeight: '600' },
  inputWrap:  { backgroundColor: '#F1F5F9', borderWidth: 1.5, borderRadius: 12, overflow: 'hidden' },
  input:      { paddingHorizontal: 16, paddingVertical: 14, fontSize: 15, color: '#0F172A', fontWeight: '500' },

  errorBox:  { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: '#FEF2F2', borderWidth: 1, borderColor: '#FECACA', borderRadius: 12, padding: 12, marginBottom: 16 },
  errorIcon: { fontSize: 14 },
  errorText: { fontSize: 13, color: '#EF4444', fontWeight: '500', flex: 1 },

  btnPrimary:     { backgroundColor: '#1D4ED8', height: 54, borderRadius: 9999, alignItems: 'center', justifyContent: 'center', shadowColor: '#1D4ED8', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.35, shadowRadius: 14, elevation: 6 },
  btnDisabled:    { opacity: 0.5 },
  btnPrimaryText: { color: '#fff', fontSize: 16, fontWeight: '700', letterSpacing: 0.2 },
});
