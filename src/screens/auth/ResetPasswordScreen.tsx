// ─── ResetPasswordScreen.tsx ─────────────────────────────────────
import React, { useState, useRef, useEffect } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  KeyboardAvoidingView, Platform, ActivityIndicator, Animated, ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { AuthStackParamList } from '../../navigation/types';
import { resetPassword } from '../../../config/client';

type Props = {
  navigation: NativeStackNavigationProp<AuthStackParamList, 'ResetPassword'>;
  route:      RouteProp<AuthStackParamList, 'ResetPassword'>;
};

export default function ResetPasswordScreen({ navigation, route }: Props) {
  const { email } = route.params;

  const [otp, setOtp]               = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [loading, setLoading]       = useState(false);
  const [error, setError]           = useState('');
  const [success, setSuccess]       = useState(false);

  // ── Animations ───────────────────────────────────────────────
  const fadeAnim   = useRef(new Animated.Value(0)).current;
  const slideAnim  = useRef(new Animated.Value(40)).current;
  const iconBounce = useRef(new Animated.Value(0)).current;
  const btnScale   = useRef(new Animated.Value(1)).current;
  const shakeAnim  = useRef(new Animated.Value(0)).current;

  const otpBorder      = useRef(new Animated.Value(0)).current;
  const passBorder     = useRef(new Animated.Value(0)).current;
  const confirmBorder  = useRef(new Animated.Value(0)).current;

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

  const animBorder = (anim: Animated.Value, val: number) =>
    Animated.spring(anim, { toValue: val, tension: 200, friction: 10, useNativeDriver: false }).start();

  const otpColor     = otpBorder.interpolate({     inputRange: [0, 1], outputRange: ['#E2E8F0', '#1D4ED8'] });
  const passColor    = passBorder.interpolate({    inputRange: [0, 1], outputRange: ['#E2E8F0', '#1D4ED8'] });
  const confirmColor = confirmBorder.interpolate({ inputRange: [0, 1], outputRange: ['#E2E8F0', '#1D4ED8'] });

  const handleSubmit = async () => {
    setError('');

    if (!otp.trim()) {
      setError('Please enter the OTP sent to your email.');
      shake(); return;
    }
    if (otp.length !== 4) {
      setError('OTP must be 4 digits.');
      shake(); return;
    }
    if (!newPassword.trim()) {
      setError('Please enter a new password.');
      shake(); return;
    }
    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters.');
      shake(); return;
    }
    if (newPassword !== confirmPass) {
      setError('Passwords do not match.');
      shake(); return;
    }

    setLoading(true);
    try {
      await resetPassword(email, otp.trim(), newPassword);
      setSuccess(true);
    } catch (err: any) {
      const msg = err?.response?.data?.message ?? 'Something went wrong. Try again.';
      setError(msg);
      shake();
    } finally {
      setLoading(false);
    }
  };

  // ── Success state ─────────────────────────────────────────────
  if (success) {
    return (
      <SafeAreaView style={styles.safe}>
        <Animated.View style={[styles.successWrap, { opacity: fadeAnim }]}>
          <View style={styles.successIconWrap}>
            <Text style={styles.successIcon}>✅</Text>
          </View>
          <Text style={styles.successTitle}>Password Reset!</Text>
          <Text style={styles.successSub}>
            Your password has been updated successfully. You can now sign in with your new password.
          </Text>
          <TouchableOpacity
            style={styles.btnPrimary}
            onPress={() => navigation.navigate('Login')}
            activeOpacity={0.85}
          >
            <Text style={styles.btnPrimaryText}>Back to Sign In →</Text>
          </TouchableOpacity>
        </Animated.View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
          <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}>

            {/* ── Back ── */}
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
              <Text style={styles.backText}>← Back</Text>
            </TouchableOpacity>

            {/* ── Hero ── */}
            <View style={styles.hero}>
              <Animated.View style={[styles.iconWrap, {
                transform: [{ scale: iconBounce.interpolate({ inputRange: [0, 1], outputRange: [0.5, 1] }) }],
                opacity: iconBounce,
              }]}>
                <View style={styles.iconGlow} />
                <Text style={styles.iconEmoji}>🔑</Text>
              </Animated.View>
              <Text style={styles.title}>Reset Password</Text>
              <Text style={styles.subtitle}>
                We sent a 4-digit code to{'\n'}
                <Text style={styles.emailHighlight}>{email}</Text>
              </Text>
            </View>

            {/* ── Form card ── */}
            <Animated.View style={[styles.card, { transform: [{ translateX: shakeAnim }] }]}>

              {/* OTP */}
              <View style={styles.fieldGroup}>
                <Text style={styles.label}>Enter OTP</Text>
                <Animated.View style={[styles.inputWrap, { borderColor: otpColor }]}>
                  <TextInput
                    style={[styles.input, styles.otpInput]}
                    placeholder="4-digit code"
                    placeholderTextColor="#94A3B8"
                    value={otp}
                    onChangeText={setOtp}
                    keyboardType="number-pad"
                    maxLength={4}
                    editable={!loading}
                    onFocus={() => animBorder(otpBorder, 1)}
                    onBlur={()  => animBorder(otpBorder, 0)}
                  />
                </Animated.View>
              </View>

              {/* Divider */}
              <View style={styles.divider} />

              {/* New Password */}
              <View style={styles.fieldGroup}>
                <Text style={styles.label}>New Password</Text>
                <Animated.View style={[styles.inputWrap, { borderColor: passColor }]}>
                  <TextInput
                    style={styles.input}
                    placeholder="Min. 6 characters"
                    placeholderTextColor="#94A3B8"
                    value={newPassword}
                    onChangeText={setNewPassword}
                    secureTextEntry
                    editable={!loading}
                    onFocus={() => animBorder(passBorder, 1)}
                    onBlur={()  => animBorder(passBorder, 0)}
                  />
                </Animated.View>
              </View>

              {/* Confirm Password */}
              <View style={styles.fieldGroup}>
                <Text style={styles.label}>Confirm Password</Text>
                <Animated.View style={[styles.inputWrap, { borderColor: confirmColor }]}>
                  <TextInput
                    style={styles.input}
                    placeholder="Re-enter your password"
                    placeholderTextColor="#94A3B8"
                    value={confirmPass}
                    onChangeText={setConfirmPass}
                    secureTextEntry
                    editable={!loading}
                    onFocus={() => animBorder(confirmBorder, 1)}
                    onBlur={()  => animBorder(confirmBorder, 0)}
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

              {/* Resend hint */}
              <TouchableOpacity
                onPress={() => navigation.goBack()}
                style={styles.resendBtn}
              >
                <Text style={styles.resendText}>Didn't get the code? <Text style={styles.resendLink}>Resend</Text></Text>
              </TouchableOpacity>

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
                    : <Text style={styles.btnPrimaryText}>Reset Password →</Text>
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

  hero:           { alignItems: 'center', marginBottom: 28, marginTop: 20 },
  iconWrap:       { width: 84, height: 84, borderRadius: 24, backgroundColor: '#DBEAFE', alignItems: 'center', justifyContent: 'center', marginBottom: 18, shadowColor: '#1D4ED8', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.30, shadowRadius: 16, elevation: 8 },
  iconGlow:       { position: 'absolute', width: 100, height: 100, borderRadius: 50, backgroundColor: 'rgba(29,78,216,0.08)' },
  iconEmoji:      { fontSize: 40 },
  title:          { fontSize: 26, fontWeight: '800', color: '#0F172A', letterSpacing: -0.5, marginBottom: 10 },
  subtitle:       { fontSize: 14, color: '#475569', textAlign: 'center', lineHeight: 22 },
  emailHighlight: { fontWeight: '700', color: '#1D4ED8' },

  card:       { backgroundColor: '#fff', borderRadius: 20, padding: 24, borderWidth: 1, borderColor: '#E2E8F0', shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.08, shadowRadius: 16, elevation: 4 },
  fieldGroup: { marginBottom: 16 },
  label:      { fontSize: 13, color: '#475569', marginBottom: 8, fontWeight: '600' },
  inputWrap:  { backgroundColor: '#F1F5F9', borderWidth: 1.5, borderRadius: 12, overflow: 'hidden' },
  input:      { paddingHorizontal: 16, paddingVertical: 14, fontSize: 15, color: '#0F172A', fontWeight: '500' },
  otpInput:   { fontSize: 22, fontWeight: '800', letterSpacing: 8, textAlign: 'center' },

  divider: { height: 1, backgroundColor: '#F1F5F9', marginBottom: 16 },

  errorBox:  { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: '#FEF2F2', borderWidth: 1, borderColor: '#FECACA', borderRadius: 12, padding: 12, marginBottom: 16 },
  errorIcon: { fontSize: 14 },
  errorText: { fontSize: 13, color: '#EF4444', fontWeight: '500', flex: 1 },

  resendBtn:  { alignItems: 'center', marginBottom: 20 },
  resendText: { fontSize: 13, color: '#94A3B8' },
  resendLink: { color: '#1D4ED8', fontWeight: '700' },

  btnPrimary:     { backgroundColor: '#1D4ED8', height: 54, borderRadius: 9999, alignItems: 'center', justifyContent: 'center', shadowColor: '#1D4ED8', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.35, shadowRadius: 14, elevation: 6 },
  btnDisabled:    { opacity: 0.5 },
  btnPrimaryText: { color: '#fff', fontSize: 16, fontWeight: '700', letterSpacing: 0.2 },

  // Success state
  successWrap:     { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 32 },
  successIconWrap: { width: 100, height: 100, borderRadius: 50, backgroundColor: '#D1FAE5', alignItems: 'center', justifyContent: 'center', marginBottom: 24 },
  successIcon:     { fontSize: 48 },
  successTitle:    { fontSize: 28, fontWeight: '800', color: '#0F172A', marginBottom: 12, letterSpacing: -0.5 },
  successSub:      { fontSize: 14, color: '#475569', textAlign: 'center', lineHeight: 22, marginBottom: 32 },
});
