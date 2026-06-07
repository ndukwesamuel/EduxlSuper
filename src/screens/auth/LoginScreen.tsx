

// import React, { useState } from "react";
// import {
//   View,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   ScrollView,
//   StyleSheet,
//   KeyboardAvoidingView,
//   Platform,
//   ActivityIndicator,
// } from "react-native";
// import { SafeAreaView } from "react-native-safe-area-context";
// import { useDispatch } from "react-redux";
// import { NativeStackNavigationProp } from "@react-navigation/native-stack";
// import { AuthStackParamList } from "../../navigation/types";
// import { Colors, FontSize, Radius, Spacing, Shadows } from "../../theme";
// import { setUser } from "../../store/authSlice";
// import { loginUser, registerUser } from "../../../config/client";
// // loginUser
// // registerUser
// type Props = {
//   navigation: NativeStackNavigationProp<AuthStackParamList, "Login">;
// };

// type Mode = "login" | "register";

// export default function LoginScreen({ navigation }: Props) {
//   const dispatch = useDispatch();
//   const [mode, setMode]       = useState<Mode>("login");
//   const [name, setName]       = useState("");
//   const [email, setEmail]     = useState("");
//   const [password, setPassword] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [error, setError]     = useState("");

//   const handleSubmit = async () => {
//     setError("");

//     // Validation
//     if (!email.trim() || !password.trim()) {
//       setError("Email and password are required.");
//       return;
//     }
//     if (password.length < 6) {
//       setError("Password must be at least 6 characters.");
//       return;
//     }
//     if (mode === "register" && !name.trim()) {
//       setError("Please enter your full name.");
//       return;
//     }

//     setLoading(true);
//     try {
//       const data =
//         mode === "login"
//           ? await loginUser(email.trim(), password)
//           : await registerUser(name.trim(), email.trim(), password);


//         console.log("Auth response:", data);

//       dispatch(setUser({ user: data.user, token: data.token }));
//     } catch (err: unknown) {
//       const msg =
//         (err as { response?: { data?: { message?: string } } })?.response
//           ?.data?.message ?? "Request failed. Check your connection.";
//       setError(msg);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <SafeAreaView style={styles.safe}>
//       <KeyboardAvoidingView
//         behavior={Platform.OS === "ios" ? "padding" : undefined}
//         style={{ flex: 1 }}
//       >
//         <ScrollView
//           contentContainerStyle={styles.scroll}
//           keyboardShouldPersistTaps="handled"
//           showsVerticalScrollIndicator={false}
//         >
//           {/* ── Hero ── */}
//           <View style={styles.hero}>
//             <View style={styles.iconWrap}>
//               <Text style={styles.iconEmoji}>🎓</Text>
//             </View>
//             <Text style={styles.appName}>CareerClarity</Text>
//             <Text style={styles.tagline}>
//               Africa's Career Readiness Platform
//             </Text>
//             <View style={styles.pill}>
//               <Text style={styles.pillText}>🏦 BankReady Module</Text>
//             </View>
//           </View>

//           {/* ── Tab switcher ── */}
//           <View style={styles.tabRow}>
//             <TouchableOpacity
//               style={[styles.tab, mode === "login" && styles.tabActive]}
//               onPress={() => { setMode("login"); setError(""); }}
//             >
//               <Text style={[styles.tabText, mode === "login" && styles.tabTextActive]}>
//                 Sign In
//               </Text>
//             </TouchableOpacity>
//             <TouchableOpacity
//               style={[styles.tab, mode === "register" && styles.tabActive]}
//               onPress={() => { setMode("register"); setError(""); }}
//             >
//               <Text style={[styles.tabText, mode === "register" && styles.tabTextActive]}>
//                 Register
//               </Text>
//             </TouchableOpacity>
//           </View>

//           {/* ── Form card ── */}
//           <View style={styles.card}>

//             {/* Name — register only */}
//             {mode === "register" && (
//               <View style={styles.fieldGroup}>
//                 <Text style={styles.label}>Full Name</Text>
//                 <TextInput
//                   style={styles.input}
//                   placeholder="Your full name"
//                   placeholderTextColor={Colors.textMuted}
//                   value={name}
//                   onChangeText={setName}
//                   autoCapitalize="words"
//                   editable={!loading}
//                 />
//               </View>
//             )}

//             {/* Email */}
//             <View style={styles.fieldGroup}>
//               <Text style={styles.label}>Email Address</Text>
//               <TextInput
//                 style={styles.input}
//                 placeholder="you@example.com"
//                 placeholderTextColor={Colors.textMuted}
//                 value={email}
//                 onChangeText={setEmail}
//                 keyboardType="email-address"
//                 autoCapitalize="none"
//                 autoCorrect={false}
//                 editable={!loading}
//               />
//             </View>

//             {/* Password */}
//             <View style={styles.fieldGroup}>
//               <Text style={styles.label}>Password</Text>
//               <TextInput
//                 style={styles.input}
//                 placeholder="Min. 6 characters"
//                 placeholderTextColor={Colors.textMuted}
//                 value={password}
//                 onChangeText={setPassword}
//                 secureTextEntry
//                 editable={!loading}
//               />
//             </View>

//             {/* Error */}
//             {error !== "" && (
//               <View style={styles.errorBox}>
//                 <Text style={styles.errorText}>{error}</Text>
//               </View>
//             )}

//             {/* Submit */}
//             <TouchableOpacity
//               style={[styles.btnPrimary, loading && styles.btnDisabled]}
//               onPress={handleSubmit}
//               disabled={loading}
//               activeOpacity={0.8}
//             >
//               {loading ? (
//                 <ActivityIndicator color="#fff" />
//               ) : (
//                 <Text style={styles.btnPrimaryText}>
//                   {mode === "login" ? "Sign In →" : "Create Account →"}
//                 </Text>
//               )}
//             </TouchableOpacity>
//           </View>
//         </ScrollView>
//       </KeyboardAvoidingView>
//     </SafeAreaView>
//   );
// }

// const styles = StyleSheet.create({
//   safe:   { flex: 1, backgroundColor: Colors.background },
//   scroll: { padding: Spacing.lg, paddingBottom: Spacing["4xl"] },

//   hero: {
//     alignItems: "center",
//     marginBottom: Spacing["2xl"],
//     marginTop: Spacing["2xl"],
//   },
//   iconWrap: {
//     width: 72,
//     height: 72,
//     borderRadius: Radius.xl,
//     backgroundColor: "#DBEAFE",
//     alignItems: "center",
//     justifyContent: "center",
//     marginBottom: Spacing.md,
//     ...Shadows.brand,
//   },
//   iconEmoji: { fontSize: 36 },
//   appName: {
//     fontSize: FontSize.displayL,
//     fontWeight: "800",
//     color: Colors.textPrimary,
//     letterSpacing: -0.5,
//   },
//   tagline: {
//     fontSize: FontSize.body,
//     color: Colors.textSecondary,
//     marginTop: 6,
//     textAlign: "center",
//   },
//   pill: {
//     marginTop: Spacing.md,
//     paddingHorizontal: 14,
//     paddingVertical: 6,
//     backgroundColor: "#DBEAFE",
//     borderRadius: Radius.full,
//     borderWidth: 1,
//     borderColor: "#BFDBFE",
//   },
//   pillText: { fontSize: FontSize.caption, fontWeight: "700", color: Colors.brand },

//   tabRow: {
//     flexDirection: "row",
//     backgroundColor: Colors.surface2,
//     borderRadius: Radius.lg,
//     padding: 4,
//     marginBottom: Spacing.lg,
//   },
//   tab: {
//     flex: 1,
//     paddingVertical: 10,
//     alignItems: "center",
//     borderRadius: Radius.md,
//   },
//   tabActive: { backgroundColor: Colors.surface, ...Shadows.sm },
//   tabText: { fontSize: FontSize.body, color: Colors.textMuted, fontWeight: "500" },
//   tabTextActive: { color: Colors.textPrimary, fontWeight: "700" },

//   card: {
//     backgroundColor: Colors.surface,
//     borderRadius: Radius.xl,
//     padding: Spacing["2xl"],
//     borderWidth: 1,
//     borderColor: Colors.border,
//     ...Shadows.sm,
//   },

//   fieldGroup: { marginBottom: Spacing.md },
//   label: {
//     fontSize: FontSize.bodySmall,
//     color: Colors.textSecondary,
//     marginBottom: 6,
//     fontWeight: "500",
//   },
//   input: {
//     backgroundColor: Colors.surface2,
//     borderWidth: 1,
//     borderColor: Colors.border,
//     borderRadius: Radius.md,
//     paddingHorizontal: Spacing.lg,
//     paddingVertical: 14,
//     fontSize: FontSize.body,
//     color: Colors.textPrimary,
//   },

//   errorBox: {
//     backgroundColor: "#FEF2F2",
//     borderWidth: 1,
//     borderColor: "#FECACA",
//     borderRadius: Radius.md,
//     padding: Spacing.md,
//     marginBottom: Spacing.md,
//   },
//   errorText: { fontSize: FontSize.bodySmall, color: Colors.danger },

//   btnPrimary: {
//     backgroundColor: Colors.brand,
//     height: 52,
//     borderRadius: Radius.md,
//     alignItems: "center",
//     justifyContent: "center",
//     ...Shadows.brand,
//   },
//   btnDisabled: { opacity: 0.6 },
//   btnPrimaryText: { color: "#fff", fontSize: FontSize.bodyLarge, fontWeight: "600" },
// });

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

  const handleSubmit = async () => {
    setError("");
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
          <View style={styles.card}>

            {/* Name — register only */}
            {mode === "register" && (
              <View style={styles.fieldGroup}>
                <Text style={styles.label}>Full Name</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Your full name"
                  placeholderTextColor="#94A3B8"
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
                placeholderTextColor="#94A3B8"
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
                placeholderTextColor="#94A3B8"
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
              activeOpacity={0.85}
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
  safe:   { flex: 1, backgroundColor: '#F8FAFC' },
  scroll: { padding: 16, paddingBottom: 40 },

  // ── Hero ──────────────────────────────────────────────────────
  hero: {
    alignItems: 'center',
    marginBottom: 24,
    marginTop: 24,
  },
  iconWrap: {
    width: 80,
    height: 80,
    borderRadius: 18,
    backgroundColor: '#DBEAFE',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    shadowColor: '#1D4ED8',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 5,
  },
  iconEmoji: { fontSize: 38 },
  appName: {
    fontSize: 28,
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
    marginTop: 12,
    paddingHorizontal: 14,
    paddingVertical: 6,
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
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 10,
  },
  tabActive: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  tabText: {
    fontSize: 15,
    color: '#94A3B8',
    fontWeight: '500',
  },
  tabTextActive: {
    color: '#0F172A',
    fontWeight: '700',
  },

  // ── Form Card ─────────────────────────────────────────────────
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 24,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },

  fieldGroup: { marginBottom: 16 },
  label: {
    fontSize: 13,
    color: '#475569',
    marginBottom: 6,
    fontWeight: '600',
  },
  input: {
    backgroundColor: '#F1F5F9',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 15,
    color: '#0F172A',
    fontWeight: '500',
  },

  // ── Error ─────────────────────────────────────────────────────
  errorBox: {
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FECACA',
    borderRadius: 10,
    padding: 12,
    marginBottom: 16,
  },
  errorText: {
    fontSize: 13,
    color: '#EF4444',
    fontWeight: '500',
  },

  // ── Button ────────────────────────────────────────────────────
  btnPrimary: {
    backgroundColor: '#1D4ED8',
    height: 52,
    borderRadius: 9999,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#1D4ED8',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 5,
  },
  btnDisabled:    { opacity: 0.6 },
  btnPrimaryText: { color: '#fff', fontSize: 16, fontWeight: '700' },
});