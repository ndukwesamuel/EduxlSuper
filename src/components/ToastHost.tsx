// ─── ToastHost.tsx ──────────────────────────────────────────────────
// Mount once at the app root (see App.tsx). Screens trigger a toast with
// `dispatch(showToast({ message, variant }))` — no per-screen wiring needed.
import React, { useEffect, useRef } from 'react';
import { Animated, Text, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/store';
import { hideToast } from '../store/toastSlice';
import { Colors, FontSize, Radius, Spacing, Shadows } from '../theme';

const DURATION = 2500;

const VARIANT_BG: Record<string, string> = {
  success: Colors.success,
  error:   Colors.danger,
  info:    Colors.textPrimary,
};

export default function ToastHost() {
  const insets   = useSafeAreaInsets();
  const dispatch = useDispatch();
  const { visible, message, variant, key } = useSelector((s: RootState) => s.toast);
  const translateY = useRef(new Animated.Value(80)).current;
  const opacity     = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!visible) return;

    Animated.parallel([
      Animated.spring(translateY, { toValue: 0, useNativeDriver: true, friction: 8 }),
      Animated.timing(opacity,    { toValue: 1, duration: 200, useNativeDriver: true }),
    ]).start();

    const timer = setTimeout(() => {
      Animated.parallel([
        Animated.timing(translateY, { toValue: 80, duration: 200, useNativeDriver: true }),
        Animated.timing(opacity,    { toValue: 0,  duration: 200, useNativeDriver: true }),
      ]).start(() => dispatch(hideToast()));
    }, DURATION);

    return () => clearTimeout(timer);
    // `key` changes every time showToast fires, even with the same message —
    // that's what makes a repeat toast re-trigger the animation/timer.
  }, [visible, key]);

  if (!visible) return null;

  return (
    <Animated.View
      pointerEvents="none"
      style={[
        styles.toast,
        {
          bottom: insets.bottom + Spacing.xl,
          backgroundColor: VARIANT_BG[variant] ?? VARIANT_BG.info,
          transform: [{ translateY }],
          opacity,
        },
      ]}
    >
      <Text style={styles.text}>{message}</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  toast: {
    position: 'absolute',
    left: Spacing.lg,
    right: Spacing.lg,
    borderRadius: Radius.md,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    ...Shadows.lg,
  },
  text: {
    color: Colors.textInverse,
    fontSize: FontSize.body,
    fontWeight: '600',
    textAlign: 'center',
  },
});
