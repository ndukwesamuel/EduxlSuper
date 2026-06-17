


// // // ─── HomeScreen.tsx ───────────────────────────────────────────────
// // import React, { useEffect, useState } from "react";
// // import {
// //   View,
// //   Text,
// //   ScrollView,
// //   TouchableOpacity,
// //   StyleSheet,
// //   RefreshControl,
// // } from "react-native";
// // import { SafeAreaView } from "react-native-safe-area-context";
// // import { useSelector, useDispatch } from "react-redux";
// // import { useNavigation } from "@react-navigation/native";
// // import { NativeStackNavigationProp } from "@react-navigation/native-stack";
// // import { RootState } from "../../store/store";
// // import { clearUser } from "../../store/authSlice";
// // import { fetchProgress, UserProgress } from  "../../../config/client"  
// // import { Colors, FontSize, Radius, Spacing, Shadows } from "../../theme";
// // import { AppStackParamList } from "../../navigation/types";
// // import StreakBadge from "../../components/StreakBadge";
// // import XPBar from "../../components/XPBar";
// // import CCCard from "../../components/CCCard";

// // type Nav = NativeStackNavigationProp<AppStackParamList>;

// // const COMING_SOON = [
// //   { id: "ican",      icon: "📊", label: "ICAN Prep",       color: "#7C3AED", desc: "Foundation, Skills & Professional" },
// //   { id: "acca",      icon: "🌍", label: "ACCA Prep",       color: "#0891B2", desc: "Applied Knowledge to Strategic" },
// //   { id: "interview", icon: "🎤", label: "Interview Coach", color: "#059669", desc: "Mock interviews & feedback" },
// //   { id: "cv",        icon: "📄", label: "CV Builder",      color: "#EA580C", desc: "ATS-ready professional CVs" },
// // ];

// // function getLagosGreeting(): string {
// //   const hour = new Date(Date.now() + 3600000).getUTCHours();
// //   if (hour < 12) return "Good morning";
// //   if (hour < 17) return "Good afternoon";
// //   return "Good evening";
// // }

// // export default function HomeScreen() {
// //   const navigation = useNavigation<Nav>();
// //   const dispatch   = useDispatch();
// //   const user       = useSelector((s: RootState) => s.auth.user);
// //   const [progress, setProgress] = useState<UserProgress | null>(null);
// //   const [refreshing, setRefreshing] = useState(false);

// //   const loadProgress = async () => {
// //     if (!user?._id) return;
// //     try {
// //       setProgress(await fetchProgress());
// //     } catch {}
// //   };

// //   useEffect(() => { loadProgress(); }, [user]);

// //   const onRefresh = async () => {
// //     setRefreshing(true);
// //     await loadProgress();
// //     setRefreshing(false);
// //   };

// //   const firstName = user?.name?.split(" ")[0] ?? "there";

// //   return (
// //     <SafeAreaView style={styles.safe}>
// //       <ScrollView
// //         contentContainerStyle={styles.scroll}
// //         showsVerticalScrollIndicator={false}
// //         refreshControl={
// //           <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Colors.brand} />
// //         }
// //       >
// //         {/* Header */}
// //         <View style={styles.header}>
// //           <View>
// //             <Text style={styles.greeting}>{getLagosGreeting()},</Text>
// //             <Text style={styles.name}>{firstName} 👋</Text>
// //           </View>
// //           <TouchableOpacity style={styles.avatar} onPress={() => dispatch(clearUser())}>
// //             <Text style={styles.avatarText}>{user?.name?.charAt(0).toUpperCase()}</Text>
// //           </TouchableOpacity>
// //         </View>

// //         {/* Streak + XP */}
// //         {progress && (
// //           <CCCard style={styles.progressCard}>
// //             <StreakBadge streak={progress.streak} />
// //             <View style={styles.divider} />
// //             <XPBar xp={progress.xp} />
// //             {progress.streakFreezeAvailable && (
// //               <TouchableOpacity style={styles.freezeBtn}>
// //                 <Text style={styles.freezeText}>🧊 Streak Freeze Available</Text>
// //               </TouchableOpacity>
// //             )}
// //           </CCCard>
// //         )}

// //         {/* Active Modules */}
// //         <Text style={styles.sectionTitle}>Your Modules</Text>
// //         <TouchableOpacity
// //           style={styles.bankReadyCard}
// //           onPress={() => navigation.navigate("BankReady")}
// //           activeOpacity={0.85}
// //         >
// //           <View style={styles.bankReadyLeft}>
// //             <View style={styles.bankReadyIconWrap}>
// //               <Text style={styles.bankReadyIcon}>🏦</Text>
// //             </View>
// //             <View style={{ flex: 1 }}>
// //               <View style={styles.bankReadyHeader}>
// //                 <Text style={styles.bankReadyTitle}>BankReady</Text>
// //                 <View style={styles.activePill}>
// //                   <Text style={styles.activePillText}>ACTIVE</Text>
// //                 </View>
// //               </View>
// //               <Text style={styles.bankReadyDesc}>
// //                 Bank aptitude test prep — Numerical, Verbal, Logical & Abstract
// //               </Text>
// //               <View style={styles.bankReadyMeta}>
// //                 <Text style={styles.metaText}>📚 639+ questions</Text>
// //                 <Text style={styles.metaText}>🎯 4 modules</Text>
// //               </View>
// //             </View>
// //           </View>
// //           <Text style={styles.bankReadyArrow}>→</Text>
// //         </TouchableOpacity>

// //         {/* Coming Soon */}
// //         <Text style={styles.sectionTitle}>Coming Soon</Text>
// //         <View style={styles.comingSoonGrid}>
// //           {COMING_SOON.map((m) => (
// //             <View key={m.id} style={styles.comingSoonCard}>
// //               <View style={[styles.comingSoonIcon, { backgroundColor: m.color + "18" }]}>
// //                 <Text style={{ fontSize: 22 }}>{m.icon}</Text>
// //               </View>
// //               <Text style={styles.comingSoonLabel}>{m.label}</Text>
// //               <Text style={styles.comingSoonDesc}>{m.desc}</Text>
// //               <View style={styles.comingSoonPill}>
// //                 <Text style={styles.comingSoonPillText}>Soon</Text>
// //               </View>
// //             </View>
// //           ))}
// //         </View>

// //         {/* Badges */}
// //         {progress && progress.badges.length > 0 && (
// //           <>
// //             <Text style={styles.sectionTitle}>Recent Badges</Text>
// //             <CCCard>
// //               <View style={styles.badgeRow}>
// //                 {progress.badges.slice(0, 5).map((b) => (
// //                   <View key={b.id} style={styles.badgeItem}>
// //                     <Text style={{ fontSize: 28 }}>{b.icon}</Text>
// //                     <Text style={styles.badgeName}>{b.name}</Text>
// //                   </View>
// //                 ))}
// //               </View>
// //             </CCCard>
// //           </>
// //         )}


// //         {/* DrillPad Module */}
// // <TouchableOpacity
// //   style={styles.drillPadCard}
// //   onPress={() => navigation.navigate("DrillPad")}
// //   activeOpacity={0.85}
// // >
// //   <View style={styles.bankReadyLeft}>
// //     <View style={[styles.bankReadyIconWrap, { backgroundColor: 'rgba(124,58,237,0.15)' }]}>
// //       <Text style={styles.bankReadyIcon}>📖</Text>
// //     </View>
// //     <View style={{ flex: 1 }}>
// //       <View style={styles.bankReadyHeader}>
// //         <Text style={[styles.bankReadyTitle, { color: Colors.textPrimary }]}>DrillPad</Text>
// //         <View style={[styles.activePill, { backgroundColor: '#7C3AED' }]}>
// //           <Text style={styles.activePillText}>ACTIVE</Text>
// //         </View>
// //       </View>
// //       <Text style={[styles.bankReadyDesc, { color: Colors.textSecondary }]}>
// //         Upload your questions, practice anything — any course, any exam
// //       </Text>
// //     </View>
// //   </View>
// //   <Text style={styles.bankReadyArrow}>→</Text>
// // </TouchableOpacity>
// //       </ScrollView>
// //     </SafeAreaView>
// //   );
// // }

// // const styles = StyleSheet.create({
// //   safe:   { flex: 1, backgroundColor: Colors.background },
// //   scroll: { padding: Spacing.lg, paddingBottom: Spacing["5xl"] },
// //   header: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", marginBottom: Spacing["2xl"] },
// //   greeting: { fontSize: FontSize.body, color: Colors.textSecondary },
// //   name:     { fontSize: FontSize.displayL, fontWeight: "800", color: Colors.textPrimary, marginTop: 2 },
// //   avatar:   { width: 44, height: 44, borderRadius: Radius.full, backgroundColor: "#DBEAFE", alignItems: "center", justifyContent: "center" },
// //   avatarText: { fontSize: FontSize.bodyLarge, fontWeight: "700", color: Colors.brand },
// //   progressCard: { marginBottom: Spacing["2xl"], gap: Spacing.md },
// //   divider: { height: 1, backgroundColor: Colors.border },
// //   freezeBtn: { marginTop: 4, paddingVertical: 8, alignItems: "center", backgroundColor: "#EFF6FF", borderRadius: Radius.md, borderWidth: 1, borderColor: "#BFDBFE" },
// //   freezeText: { fontSize: FontSize.caption, fontWeight: "600", color: Colors.brand },
// //   sectionTitle: { fontSize: FontSize.heading3, fontWeight: "700", color: Colors.textPrimary, marginBottom: Spacing.md, marginTop: Spacing.sm },
// //   bankReadyCard: { backgroundColor: Colors.brand, borderRadius: Radius.xl, padding: Spacing.lg, marginBottom: Spacing["2xl"], flexDirection: "row", alignItems: "center", ...Shadows.brand },
// //   bankReadyLeft: { flex: 1, flexDirection: "row", alignItems: "flex-start", gap: Spacing.md },
// //   bankReadyIconWrap: { width: 48, height: 48, borderRadius: Radius.md, backgroundColor: "rgba(255,255,255,0.2)", alignItems: "center", justifyContent: "center" },
// //   bankReadyIcon: { fontSize: 24 },
// //   bankReadyHeader: { flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 4 },
// //   bankReadyTitle: { fontSize: FontSize.heading2, fontWeight: "700", color: "#fff" },
// //   activePill: { backgroundColor: "rgba(255,255,255,0.25)", paddingHorizontal: 8, paddingVertical: 2, borderRadius: Radius.full },
// //   activePillText: { fontSize: FontSize.micro, fontWeight: "700", color: "#fff" },
// //   bankReadyDesc: { fontSize: FontSize.bodySmall, color: "rgba(255,255,255,0.85)", lineHeight: 18, marginBottom: 8 },
// //   bankReadyMeta: { flexDirection: "row", gap: Spacing.md },
// //   metaText: { fontSize: FontSize.caption, color: "rgba(255,255,255,0.75)" },
// //   bankReadyArrow: { fontSize: 20, color: "rgba(255,255,255,0.7)", marginLeft: 8 },
// //   comingSoonGrid: { flexDirection: "row", flexWrap: "wrap", gap: Spacing.md, marginBottom: Spacing["2xl"] },
// //   comingSoonCard: { width: "47%", backgroundColor: Colors.surface, borderRadius: Radius.lg, padding: Spacing.md, borderWidth: 1, borderColor: Colors.border, ...Shadows.sm },
// //   comingSoonIcon: { width: 44, height: 44, borderRadius: Radius.md, alignItems: "center", justifyContent: "center", marginBottom: Spacing.sm },
// //   comingSoonLabel: { fontSize: FontSize.body, fontWeight: "700", color: Colors.textPrimary, marginBottom: 2 },
// //   comingSoonDesc: { fontSize: FontSize.micro, color: Colors.textMuted, lineHeight: 16, marginBottom: Spacing.sm },
// //   comingSoonPill: { backgroundColor: Colors.surface2, paddingHorizontal: 8, paddingVertical: 3, borderRadius: Radius.full, alignSelf: "flex-start" },
// //   comingSoonPillText: { fontSize: FontSize.micro, color: Colors.textMuted, fontWeight: "600" },
// //   badgeRow: { flexDirection: "row", flexWrap: "wrap", gap: Spacing.md },
// //   badgeItem: { alignItems: "center", gap: 4 },
// //   drillPadCard: { backgroundColor: Colors.surface, borderRadius: Radius.xl, padding: Spacing.lg, marginBottom: Spacing["2xl"], flexDirection: "row", alignItems: "center", borderWidth: 1, borderColor: '#7C3AED' + '40', ...Shadows.sm },
// //   badgeName: { fontSize: FontSize.micro, color: Colors.textMuted, textAlign: "center", maxWidth: 60 },
// // });


// // ─── HomeScreen.tsx ───────────────────────────────────────────────
// import React, { useEffect, useState, useRef } from "react";
// import {
//   View, Text, ScrollView, TouchableOpacity,
//   StyleSheet, RefreshControl, Animated, Dimensions,
// } from "react-native";
// import { SafeAreaView } from "react-native-safe-area-context";
// import { useSelector, useDispatch } from "react-redux";
// import { useNavigation } from "@react-navigation/native";
// import { NativeStackNavigationProp } from "@react-navigation/native-stack";
// import { RootState } from "../../store/store";
// import { clearUser } from "../../store/authSlice";
// import { fetchProgress, UserProgress } from "../../../config/client";
// import { Colors, FontSize, Radius, Spacing, Shadows } from "../../theme";
// import { AppStackParamList } from "../../navigation/types";
// import CCCard from "../../components/CCCard";

// type Nav = NativeStackNavigationProp<AppStackParamList>;
// const { width } = Dimensions.get("window");

// const COMING_SOON = [
//   { id: "ican",      icon: "📊", label: "ICAN Prep",       color: "#7C3AED" },
//   { id: "acca",      icon: "🌍", label: "ACCA Prep",       color: "#0891B2" },
//   { id: "interview", icon: "🎤", label: "Interview Coach", color: "#059669" },
//   { id: "cv",        icon: "📄", label: "CV Builder",      color: "#EA580C" },
// ];

// function getLagosGreeting(): string {
//   const hour = new Date(Date.now() + 3600000).getUTCHours();
//   if (hour < 12) return "Good morning";
//   if (hour < 17) return "Good afternoon";
//   return "Good evening";
// }

// function getLagosEmoji(): string {
//   const hour = new Date(Date.now() + 3600000).getUTCHours();
//   if (hour < 12) return "☀️";
//   if (hour < 17) return "🌤️";
//   return "🌙";
// }

// export default function HomeScreen() {
//   const navigation = useNavigation<Nav>();
//   const dispatch   = useDispatch();
//   const user       = useSelector((s: RootState) => s.auth.user);
//   const [progress, setProgress] = useState<UserProgress | null>(null);
//   const [refreshing, setRefreshing] = useState(false);

//   // Fade in animation
//   const fadeAnim  = useRef(new Animated.Value(0)).current;
//   const slideAnim = useRef(new Animated.Value(20)).current;

//   useEffect(() => {
//     Animated.parallel([
//       Animated.timing(fadeAnim,  { toValue: 1, duration: 500, useNativeDriver: true }),
//       Animated.timing(slideAnim, { toValue: 0, duration: 500, useNativeDriver: true }),
//     ]).start();
//   }, []);

//   const loadProgress = async () => {
//     if (!user?._id) return;
//     try { setProgress(await fetchProgress()); } catch {}
//   };

//   useEffect(() => { loadProgress(); }, [user]);

//   const onRefresh = async () => {
//     setRefreshing(true);
//     await loadProgress();
//     setRefreshing(false);
//   };

//   const firstName = user?.name?.split(" ")[0] ?? "there";
//   const xpLevel   = progress ? Math.floor(progress.xp / 500) + 1 : null;
//   const xpPct     = progress ? ((progress.xp % 500) / 500) * 100 : 0;

//   return (
//     <SafeAreaView style={styles.safe}>
//       <ScrollView
//         contentContainerStyle={styles.scroll}
//         showsVerticalScrollIndicator={false}
//         refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Colors.brand} />}
//       >
//         <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}>

//           {/* ── Top bar ── */}
//           <View style={styles.topBar}>
//             <View>
//               <Text style={styles.greetingLine}>
//                 {getLagosEmoji()} {getLagosGreeting()}
//               </Text>
//               <Text style={styles.nameLine}>{firstName}</Text>
//             </View>
//             <TouchableOpacity
//               style={styles.avatarBtn}
//               onPress={() => navigation.navigate("Profile" as any)}
//               activeOpacity={0.8}
//             >
//               <Text style={styles.avatarLetter}>{user?.name?.charAt(0).toUpperCase()}</Text>
//               {progress && progress.streak > 0 && (
//                 <View style={styles.streakDot}>
//                   <Text style={styles.streakDotText}>🔥</Text>
//                 </View>
//               )}
//             </TouchableOpacity>
//           </View>

//           {/* ── Hero stats bar ── */}
//           {progress ? (
//             <View style={styles.statsBar}>
//               <View style={styles.statItem}>
//                 <Text style={styles.statValue}>{progress.streak}</Text>
//                 <Text style={styles.statLabel}>day streak</Text>
//               </View>
//               <View style={styles.statDivider} />
//               <View style={styles.statItem}>
//                 <Text style={styles.statValue}>{progress.xp}</Text>
//                 <Text style={styles.statLabel}>total XP</Text>
//               </View>
//               <View style={styles.statDivider} />
//               <View style={styles.statItem}>
//                 <Text style={styles.statValue}>Lv {xpLevel}</Text>
//                 <Text style={styles.statLabel}>level</Text>
//               </View>
//               {progress.badges.length > 0 && (
//                 <>
//                   <View style={styles.statDivider} />
//                   <View style={styles.statItem}>
//                     <Text style={styles.statValue}>{progress.badges.length}</Text>
//                     <Text style={styles.statLabel}>badges</Text>
//                   </View>
//                 </>
//               )}
//             </View>
//           ) : (
//             <View style={styles.statsBarEmpty}>
//               <Text style={styles.statsBarEmptyText}>Complete a test to start tracking progress 📊</Text>
//             </View>
//           )}

//           {/* ── XP bar ── */}
//           {progress && (
//             <View style={styles.xpBarWrap}>
//               <View style={styles.xpBarTrack}>
//                 <Animated.View style={[styles.xpBarFill, { width: `${xpPct}%` }]} />
//               </View>
//               <Text style={styles.xpBarLabel}>{progress.xp % 500} / 500 XP to Level {(xpLevel ?? 1) + 1}</Text>
//             </View>
//           )}

//           {/* ── Section: Active modules ── */}
//           <Text style={styles.sectionLabel}>YOUR MODULES</Text>

//           {/* BankReady card */}
//           <TouchableOpacity
//             style={styles.bankReadyCard}
//             onPress={() => navigation.navigate("BankReady")}
//             activeOpacity={0.9}
//           >
//             <View style={styles.cardGlow} />
//             <View style={styles.bankReadyTop}>
//               <View style={styles.bankReadyIconCircle}>
//                 <Text style={{ fontSize: 26 }}>🏦</Text>
//               </View>
//               <View style={styles.activeBadge}>
//                 <View style={styles.activeDot} />
//                 <Text style={styles.activeBadgeText}>ACTIVE</Text>
//               </View>
//             </View>
//             <Text style={styles.bankReadyName}>BankReady</Text>
//             <Text style={styles.bankReadyDesc}>
//               Ace the aptitude test for GTBank, Access, Stanbic & more
//             </Text>
//             <View style={styles.bankReadyFooter}>
//               <Text style={styles.bankReadyMeta}>📚 639+ questions  ·  🎯 4 modules</Text>
//               <Text style={styles.bankReadyCta}>Start →</Text>
//             </View>
//           </TouchableOpacity>


//           <TouchableOpacity
//             style={styles.companyCard}
//             onPress={() => navigation.navigate('CompanyTracks')}
//             activeOpacity={0.9}
//           >
//             <View style={styles.companyTop}>
//               <View style={styles.companyIconCircle}>
//                 <Text style={{ fontSize: 26 }}>🏢</Text>
//               </View>
//               <View style={styles.newBadge}>
//                 <Text style={styles.newBadgeText}>NEW</Text>
//               </View>
//             </View>
//             <Text style={styles.companyName}>Company Prep Tracks</Text>
//             <Text style={styles.companyDesc}>
//               Company-specific test simulations — Shell, GTBank, KPMG, PwC and more.
//             </Text>
//             <View style={styles.companyFooter}>
//               <Text style={styles.companyMeta}>🐚 Shell live now  ·  🏦 GTBank coming</Text>
//               <Text style={styles.companyCta}>Explore →</Text>
//             </View>
//           </TouchableOpacity>

//           {/* DrillPad card */}
//           <TouchableOpacity
//             style={styles.drillPadCard}
//             onPress={() => navigation.navigate("DrillPad")}
//             activeOpacity={0.9}
//           >
//             <View style={styles.drillPadTop}>
//               <View style={styles.drillPadIconCircle}>
//                 <Text style={{ fontSize: 26 }}>📖</Text>
//               </View>
//               <View style={[styles.activeBadge, { backgroundColor: '#EDE9FE' }]}>
//                 <View style={[styles.activeDot, { backgroundColor: '#7C3AED' }]} />
//                 <Text style={[styles.activeBadgeText, { color: '#7C3AED' }]}>ACTIVE</Text>
//               </View>
//             </View>
//             <Text style={styles.drillPadName}>DrillPad</Text>
//             <Text style={styles.drillPadDesc}>
//               Upload your questions from any AI tool and drill them until you pass
//             </Text>
//             <View style={styles.bankReadyFooter}>
//               <Text style={styles.drillPadMeta}>📂 CSV upload  ·  ⚡ Any exam</Text>
//               <Text style={styles.drillPadCta}>Open →</Text>
//             </View>
//           </TouchableOpacity>

//           {/* ── Badges ── */}
//           {progress && progress.badges.length > 0 && (
//             <>
//               <Text style={styles.sectionLabel}>RECENT BADGES</Text>
//               <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.badgesScroll}>
//                 {progress.badges.slice(0, 6).map((b) => (
//                   <View key={b.id} style={styles.badgeCard}>
//                     <Text style={{ fontSize: 30 }}>{b.icon}</Text>
//                     <Text style={styles.badgeCardName}>{b.name}</Text>
//                   </View>
//                 ))}
//               </ScrollView>
//             </>
//           )}

//           {/* ── Coming soon ── */}
//           <Text style={styles.sectionLabel}>COMING SOON</Text>
//           <View style={styles.comingGrid}>
//             {COMING_SOON.map((m) => (
//               <View key={m.id} style={styles.comingCard}>
//                 <View style={[styles.comingIconWrap, { backgroundColor: m.color + '15' }]}>
//                   <Text style={{ fontSize: 20 }}>{m.icon}</Text>
//                 </View>
//                 <Text style={styles.comingLabel}>{m.label}</Text>
//                 <View style={styles.soonPill}>
//                   <Text style={styles.soonPillText}>Soon</Text>
//                 </View>
//               </View>
//             ))}
//           </View>

//           {/* ── Freeze banner ── */}
//           {progress?.streakFreezeAvailable && (
//             <View style={styles.freezeBanner}>
//               <Text style={styles.freezeEmoji}>🧊</Text>
//               <View style={{ flex: 1 }}>
//                 <Text style={styles.freezeTitle}>Streak Freeze Available</Text>
//                 <Text style={styles.freezeSub}>Use it to protect your streak on a rest day</Text>
//               </View>
//             </View>
//           )}

//         </Animated.View>
//       </ScrollView>
//     </SafeAreaView>
//   );
// }

// const styles = StyleSheet.create({
//   safe:   { flex: 1, backgroundColor: '#F8FAFC' },
//   scroll: { padding: 20, paddingBottom: 60 },

//   // Top bar
//   topBar:       { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 },
//   greetingLine: { fontSize: 13, color: '#64748B', fontWeight: '500', marginBottom: 2 },
//   nameLine:     { fontSize: 30, fontWeight: '800', color: '#0F172A', letterSpacing: -0.5 },
//   avatarBtn:    { width: 48, height: 48, borderRadius: 24, backgroundColor: '#DBEAFE', alignItems: 'center', justifyContent: 'center' },
//   avatarLetter: { fontSize: 18, fontWeight: '800', color: '#1D4ED8' },
//   streakDot:    { position: 'absolute', top: -2, right: -2, width: 18, height: 18, borderRadius: 9, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center' },
//   streakDotText:{ fontSize: 10 },

//   // Stats bar
//   statsBar:      { flexDirection: 'row', backgroundColor: '#fff', borderRadius: 16, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: '#E2E8F0', alignItems: 'center', justifyContent: 'space-around' },
//   statsBarEmpty: { backgroundColor: '#F1F5F9', borderRadius: 16, padding: 14, marginBottom: 12, alignItems: 'center' },
//   statsBarEmptyText: { fontSize: 12, color: '#94A3B8', fontWeight: '500' },
//   statItem:      { alignItems: 'center' },
//   statValue:     { fontSize: 18, fontWeight: '800', color: '#0F172A' },
//   statLabel:     { fontSize: 11, color: '#94A3B8', fontWeight: '500', marginTop: 1 },
//   statDivider:   { width: 1, height: 32, backgroundColor: '#E2E8F0' },

//   // XP bar
//   xpBarWrap:  { marginBottom: 28 },
//   xpBarTrack: { height: 6, backgroundColor: '#E2E8F0', borderRadius: 3, overflow: 'hidden', marginBottom: 5 },
//   xpBarFill:  { height: 6, backgroundColor: '#F59E0B', borderRadius: 3 },
//   xpBarLabel: { fontSize: 11, color: '#94A3B8', fontWeight: '500' },

//   // Section label
//   sectionLabel: { fontSize: 11, fontWeight: '700', color: '#94A3B8', letterSpacing: 1.2, marginBottom: 12, marginTop: 4 },

//   // BankReady card
//   bankReadyCard:       { backgroundColor: '#1D4ED8', borderRadius: 20, padding: 20, marginBottom: 12, overflow: 'hidden' },
//   cardGlow:            { position: 'absolute', top: -30, right: -30, width: 120, height: 120, borderRadius: 60, backgroundColor: 'rgba(255,255,255,0.08)' },
//   bankReadyTop:        { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 },
//   bankReadyIconCircle: { width: 52, height: 52, borderRadius: 14, backgroundColor: 'rgba(255,255,255,0.15)', alignItems: 'center', justifyContent: 'center' },
//   activeBadge:         { flexDirection: 'row', alignItems: 'center', gap: 5, backgroundColor: 'rgba(255,255,255,0.2)', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20 },
//   activeDot:           { width: 6, height: 6, borderRadius: 3, backgroundColor: '#4ADE80' },
//   activeBadgeText:     { fontSize: 10, fontWeight: '700', color: '#fff', letterSpacing: 0.5 },
//   bankReadyName:       { fontSize: 24, fontWeight: '800', color: '#fff', marginBottom: 6, letterSpacing: -0.3 },
//   bankReadyDesc:       { fontSize: 13, color: 'rgba(255,255,255,0.8)', lineHeight: 20, marginBottom: 16 },
//   bankReadyFooter:     { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
//   bankReadyMeta:       { fontSize: 12, color: 'rgba(255,255,255,0.65)' },
//   bankReadyCta:        { fontSize: 14, fontWeight: '700', color: '#fff', backgroundColor: 'rgba(255,255,255,0.2)', paddingHorizontal: 14, paddingVertical: 6, borderRadius: 20 },

//   // DrillPad card
//   drillPadCard:       { backgroundColor: '#fff', borderRadius: 20, padding: 20, marginBottom: 24, borderWidth: 1.5, borderColor: '#EDE9FE' },
//   drillPadTop:        { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 },
//   drillPadIconCircle: { width: 52, height: 52, borderRadius: 14, backgroundColor: '#EDE9FE', alignItems: 'center', justifyContent: 'center' },
//   drillPadName:       { fontSize: 24, fontWeight: '800', color: '#0F172A', marginBottom: 6, letterSpacing: -0.3 },
//   drillPadDesc:       { fontSize: 13, color: '#64748B', lineHeight: 20, marginBottom: 16 },
//   drillPadMeta:       { fontSize: 12, color: '#94A3B8' },
//   drillPadCta:        { fontSize: 14, fontWeight: '700', color: '#7C3AED', backgroundColor: '#EDE9FE', paddingHorizontal: 14, paddingVertical: 6, borderRadius: 20 },

//   // Badges
//   badgesScroll: { marginBottom: 24 },
//   badgeCard:    { alignItems: 'center', backgroundColor: '#fff', borderRadius: 14, padding: 12, marginRight: 10, borderWidth: 1, borderColor: '#E2E8F0', minWidth: 72 },
//   badgeCardName:{ fontSize: 10, color: '#64748B', fontWeight: '600', marginTop: 6, textAlign: 'center' },

//   // Coming soon
//   comingGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 24 },
//   comingCard: { width: '47.5%', backgroundColor: '#fff', borderRadius: 14, padding: 14, borderWidth: 1, borderColor: '#E2E8F0' },
//   comingIconWrap: { width: 40, height: 40, borderRadius: 10, alignItems: 'center', justifyContent: 'center', marginBottom: 8 },
//   comingLabel:{ fontSize: 13, fontWeight: '700', color: '#0F172A', marginBottom: 6 },
//   soonPill:   { backgroundColor: '#F1F5F9', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 20, alignSelf: 'flex-start' },
//   soonPillText:{ fontSize: 10, color: '#94A3B8', fontWeight: '600' },

//   // Freeze banner
//   freezeBanner: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: '#EFF6FF', borderRadius: 14, padding: 16, borderWidth: 1, borderColor: '#BFDBFE' },
//   freezeEmoji:  { fontSize: 28 },
//   freezeTitle:  { fontSize: 14, fontWeight: '700', color: '#1D4ED8', marginBottom: 2 },
//   freezeSub:    { fontSize: 12, color: '#3B82F6' },


// // const styles = StyleSheet.create({
//   companyCard: {
//     backgroundColor: '#fff',
//     borderRadius: 20,
//     padding: 20,
//     marginBottom: 24,
//     borderWidth: 1.5,
//     borderColor: '#E0E7FF',  // indigo tint
//     shadowColor: '#4F46E5',
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.06,
//     shadowRadius: 12,
//     elevation: 2,
//   },
//   companyTop: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: 14,
//   },
//   companyIconCircle: {
//     width: 52, height: 52, borderRadius: 14,
//     backgroundColor: '#EEF2FF',
//     alignItems: 'center', justifyContent: 'center',
//   },
//   newBadge: {
//     flexDirection: 'row', alignItems: 'center',
//     backgroundColor: '#FEF3C7',
//     paddingHorizontal: 10, paddingVertical: 4,
//     borderRadius: 20,
//   },
//   newBadgeText: {
//     fontSize: 10, fontWeight: '700', color: '#D97706', letterSpacing: 0.5,
//   },
//   companyName: {
//     fontSize: 22, fontWeight: '800', color: '#0F172A',
//     marginBottom: 6, letterSpacing: -0.3,
//   },
//   companyDesc: {
//     fontSize: 13, color: '#64748B', lineHeight: 20, marginBottom: 16,
//   },
//   companyFooter: {
//     flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
//   },
//   companyMeta: { fontSize: 12, color: '#94A3B8' },
//   companyCta: {
//     fontSize: 14, fontWeight: '700', color: '#4F46E5',
//     backgroundColor: '#EEF2FF',
//     paddingHorizontal: 14, paddingVertical: 6, borderRadius: 20,
//   },
// });
// });

// ─── HomeScreen.tsx ───────────────────────────────────────────────
import React, { useEffect, useState, useRef } from "react";
import {
  View, Text, ScrollView, TouchableOpacity,
  StyleSheet, RefreshControl, Animated,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useSelector } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootState } from "../../store/store";
import { fetchProgress, UserProgress } from "../../../config/client";
import { Colors } from "../../theme";
import { AppStackParamList } from "../../navigation/types";

type Nav = NativeStackNavigationProp<AppStackParamList>;

const COMING_SOON = [
  { id: "ican",      icon: "📊", label: "ICAN Prep",       color: "#7C3AED" },
  { id: "acca",      icon: "🌍", label: "ACCA Prep",       color: "#0891B2" },
  { id: "interview", icon: "🎤", label: "Interview Coach", color: "#059669" },
  { id: "cv",        icon: "📄", label: "CV Builder",      color: "#EA580C" },
];

function getLagosGreeting(): string {
  const hour = new Date(Date.now() + 3600000).getUTCHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

function getLagosEmoji(): string {
  const hour = new Date(Date.now() + 3600000).getUTCHours();
  if (hour < 12) return "☀️";
  if (hour < 17) return "🌤️";
  return "🌙";
}

export default function HomeScreen() {
  const navigation = useNavigation<Nav>();
  const user       = useSelector((s: RootState) => s.auth.user);
  const [progress, setProgress] = useState<UserProgress | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const fadeAnim  = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim,  { toValue: 1, duration: 500, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 500, useNativeDriver: true }),
    ]).start();
  }, []);

  const loadProgress = async () => {
    if (!user?._id) return;
    try { setProgress(await fetchProgress()); } catch {}
  };

  useEffect(() => { loadProgress(); }, [user]);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadProgress();
    setRefreshing(false);
  };

  const firstName = user?.name?.split(" ")[0] ?? "there";
  const xpLevel   = progress ? Math.floor(progress.xp / 500) + 1 : null;
  const xpPct     = progress ? ((progress.xp % 500) / 500) * 100 : 0;

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Colors.brand} />
        }
      >
        <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}>

          {/* ── Top bar ── */}
          <View style={styles.topBar}>
            <View>
              <Text style={styles.greetingLine}>{getLagosEmoji()} {getLagosGreeting()}</Text>
              <Text style={styles.nameLine}>{firstName}</Text>
            </View>
            <TouchableOpacity
              style={styles.avatarBtn}
              onPress={() => navigation.navigate("Profile" as any)}
              activeOpacity={0.8}
            >
              <Text style={styles.avatarLetter}>{user?.name?.charAt(0).toUpperCase()}</Text>
              {progress && progress.streak > 0 && (
                <View style={styles.streakDot}>
                  <Text style={styles.streakDotText}>🔥</Text>
                </View>
              )}
            </TouchableOpacity>
          </View>

          {/* ── Stats bar ── */}
          {progress ? (
            <View style={styles.statsBar}>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{progress.streak}</Text>
                <Text style={styles.statLabel}>day streak</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{progress.xp}</Text>
                <Text style={styles.statLabel}>total XP</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={styles.statValue}>Lv {xpLevel}</Text>
                <Text style={styles.statLabel}>level</Text>
              </View>
              {progress.badges.length > 0 && (
                <>
                  <View style={styles.statDivider} />
                  <View style={styles.statItem}>
                    <Text style={styles.statValue}>{progress.badges.length}</Text>
                    <Text style={styles.statLabel}>badges</Text>
                  </View>
                </>
              )}
            </View>
          ) : (
            <View style={styles.statsBarEmpty}>
              <Text style={styles.statsBarEmptyText}>Complete a test to start tracking progress 📊</Text>
            </View>
          )}

          {/* ── XP bar ── */}
          {progress && (
            <View style={styles.xpBarWrap}>
              <View style={styles.xpBarTrack}>
                <View style={[styles.xpBarFill, { width: `${xpPct}%` as any }]} />
              </View>
              <Text style={styles.xpBarLabel}>
                {progress.xp % 500} / 500 XP to Level {(xpLevel ?? 1) + 1}
              </Text>
            </View>
          )}

          {/* ── Section label ── */}
          <Text style={styles.sectionLabel}>YOUR MODULES</Text>

          {/* ── BankReady card ── */}
          <TouchableOpacity
            style={styles.bankReadyCard}
            onPress={() => navigation.navigate("BankReady")}
            activeOpacity={0.9}
          >
            <View style={styles.cardGlow} />
            <View style={styles.cardTopRow}>
              <View style={styles.bankReadyIconCircle}>
                <Text style={{ fontSize: 26 }}>🏦</Text>
              </View>
              <View style={styles.activeBadge}>
                <View style={styles.activeDot} />
                <Text style={styles.activeBadgeText}>ACTIVE</Text>
              </View>
            </View>
            <Text style={styles.bankReadyName}>BankReady</Text>
            <Text style={styles.bankReadyDesc}>
              Ace the aptitude test for GTBank, Access, Stanbic & more
            </Text>
            <View style={styles.cardFooterRow}>
              <Text style={styles.bankReadyMeta}>📚 639+ questions  ·  🎯 4 modules</Text>
              <Text style={styles.bankReadyCta}>Start →</Text>
            </View>
          </TouchableOpacity>

          {/* ── Company Prep Tracks card ── */}
          <TouchableOpacity
            style={styles.companyCard}
            onPress={() => navigation.navigate('CompanyTracks')}
            activeOpacity={0.9}
          >
            <View style={styles.cardTopRow}>
              <View style={styles.companyIconCircle}>
                <Text style={{ fontSize: 26 }}>🏢</Text>
              </View>
              <View style={styles.newBadge}>
                <Text style={styles.newBadgeText}>NEW</Text>
              </View>
            </View>
            <Text style={styles.companyName}>Company Prep Tracks</Text>
            <Text style={styles.companyDesc}>
              Company-specific simulations — Shell, GTBank, KPMG, PwC and more.
            </Text>
            <View style={styles.cardFooterRow}>
              <Text style={styles.companyMeta}>🐚 Shell live now  ·  🏦 GTBank coming</Text>
              <Text style={styles.companyCta}>Explore →</Text>
            </View>
          </TouchableOpacity>

          {/* ── DrillPad card ── */}
          <TouchableOpacity
            style={styles.drillPadCard}
            onPress={() => navigation.navigate("DrillPad")}
            activeOpacity={0.9}
          >
            <View style={styles.cardTopRow}>
              <View style={styles.drillPadIconCircle}>
                <Text style={{ fontSize: 26 }}>📖</Text>
              </View>
              <View style={[styles.activeBadge, { backgroundColor: '#EDE9FE' }]}>
                <View style={[styles.activeDot, { backgroundColor: '#7C3AED' }]} />
                <Text style={[styles.activeBadgeText, { color: '#7C3AED' }]}>ACTIVE</Text>
              </View>
            </View>
            <Text style={styles.drillPadName}>DrillPad</Text>
            <Text style={styles.drillPadDesc}>
              Upload your questions from any AI tool and drill them until you pass
            </Text>
            <View style={styles.cardFooterRow}>
              <Text style={styles.drillPadMeta}>📂 CSV upload  ·  ⚡ Any exam</Text>
              <Text style={styles.drillPadCta}>Open →</Text>
            </View>
          </TouchableOpacity>

          {/* ── Badges ── */}
          {progress && progress.badges.length > 0 && (
            <>
              <Text style={styles.sectionLabel}>RECENT BADGES</Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.badgesScroll}
              >
                {progress.badges.slice(0, 6).map((b) => (
                  <View key={b.id} style={styles.badgeCard}>
                    <Text style={{ fontSize: 30 }}>{b.icon}</Text>
                    <Text style={styles.badgeCardName}>{b.name}</Text>
                  </View>
                ))}
              </ScrollView>
            </>
          )}

          {/* ── Coming soon ── */}
          <Text style={styles.sectionLabel}>COMING SOON</Text>
          <View style={styles.comingGrid}>
            {COMING_SOON.map((m) => (
              <View key={m.id} style={styles.comingCard}>
                <View style={[styles.comingIconWrap, { backgroundColor: m.color + '15' }]}>
                  <Text style={{ fontSize: 20 }}>{m.icon}</Text>
                </View>
                <Text style={styles.comingLabel}>{m.label}</Text>
                <View style={styles.soonPill}>
                  <Text style={styles.soonPillText}>Soon</Text>
                </View>
              </View>
            ))}
          </View>

          {/* ── Streak freeze banner ── */}
          {progress?.streakFreezeAvailable && (
            <View style={styles.freezeBanner}>
              <Text style={styles.freezeEmoji}>🧊</Text>
              <View style={{ flex: 1 }}>
                <Text style={styles.freezeTitle}>Streak Freeze Available</Text>
                <Text style={styles.freezeSub}>Use it to protect your streak on a rest day</Text>
              </View>
            </View>
          )}

        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
}

// ─── Single StyleSheet — no duplicates ───────────────────────────
const styles = StyleSheet.create({
  safe:   { flex: 1, backgroundColor: '#F8FAFC' },
  scroll: { padding: 20, paddingBottom: 60 },

  // Top bar
  topBar:        { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 },
  greetingLine:  { fontSize: 13, color: '#64748B', fontWeight: '500', marginBottom: 2 },
  nameLine:      { fontSize: 30, fontWeight: '800', color: '#0F172A', letterSpacing: -0.5 },
  avatarBtn:     { width: 48, height: 48, borderRadius: 24, backgroundColor: '#DBEAFE', alignItems: 'center', justifyContent: 'center' },
  avatarLetter:  { fontSize: 18, fontWeight: '800', color: '#1D4ED8' },
  streakDot:     { position: 'absolute', top: -2, right: -2, width: 18, height: 18, borderRadius: 9, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center' },
  streakDotText: { fontSize: 10 },

  // Stats bar
  statsBar:          { flexDirection: 'row', backgroundColor: '#fff', borderRadius: 16, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: '#E2E8F0', alignItems: 'center', justifyContent: 'space-around' },
  statsBarEmpty:     { backgroundColor: '#F1F5F9', borderRadius: 16, padding: 14, marginBottom: 12, alignItems: 'center' },
  statsBarEmptyText: { fontSize: 12, color: '#94A3B8', fontWeight: '500' },
  statItem:          { alignItems: 'center' },
  statValue:         { fontSize: 18, fontWeight: '800', color: '#0F172A' },
  statLabel:         { fontSize: 11, color: '#94A3B8', fontWeight: '500', marginTop: 1 },
  statDivider:       { width: 1, height: 32, backgroundColor: '#E2E8F0' },

  // XP bar
  xpBarWrap:  { marginBottom: 28 },
  xpBarTrack: { height: 6, backgroundColor: '#E2E8F0', borderRadius: 3, overflow: 'hidden', marginBottom: 5 },
  xpBarFill:  { height: 6, backgroundColor: '#F59E0B', borderRadius: 3 },
  xpBarLabel: { fontSize: 11, color: '#94A3B8', fontWeight: '500' },

  // Section label
  sectionLabel: { fontSize: 11, fontWeight: '700', color: '#94A3B8', letterSpacing: 1.2, marginBottom: 12, marginTop: 4 },

  // Shared card patterns
  cardTopRow:  { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 },
  cardFooterRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  cardGlow:    { position: 'absolute', top: -30, right: -30, width: 120, height: 120, borderRadius: 60, backgroundColor: 'rgba(255,255,255,0.08)' },
  activeBadge: { flexDirection: 'row', alignItems: 'center', gap: 5, backgroundColor: 'rgba(255,255,255,0.2)', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20 },
  activeDot:   { width: 6, height: 6, borderRadius: 3, backgroundColor: '#4ADE80' },
  activeBadgeText: { fontSize: 10, fontWeight: '700', color: '#fff', letterSpacing: 0.5 },

  // BankReady card
  bankReadyCard:       { backgroundColor: '#1D4ED8', borderRadius: 20, padding: 20, marginBottom: 12, overflow: 'hidden' },
  bankReadyIconCircle: { width: 52, height: 52, borderRadius: 14, backgroundColor: 'rgba(255,255,255,0.15)', alignItems: 'center', justifyContent: 'center' },
  bankReadyName:       { fontSize: 24, fontWeight: '800', color: '#fff', marginBottom: 6, letterSpacing: -0.3 },
  bankReadyDesc:       { fontSize: 13, color: 'rgba(255,255,255,0.8)', lineHeight: 20, marginBottom: 16 },
  bankReadyMeta:       { fontSize: 12, color: 'rgba(255,255,255,0.65)' },
  bankReadyCta:        { fontSize: 14, fontWeight: '700', color: '#fff', backgroundColor: 'rgba(255,255,255,0.2)', paddingHorizontal: 14, paddingVertical: 6, borderRadius: 20 },

  // Company Tracks card
  companyCard:       { backgroundColor: '#fff', borderRadius: 20, padding: 20, marginBottom: 12, borderWidth: 1.5, borderColor: '#E0E7FF', shadowColor: '#4F46E5', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.06, shadowRadius: 12, elevation: 2 },
  companyIconCircle: { width: 52, height: 52, borderRadius: 14, backgroundColor: '#EEF2FF', alignItems: 'center', justifyContent: 'center' },
  newBadge:          { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FEF3C7', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20 },
  newBadgeText:      { fontSize: 10, fontWeight: '700', color: '#D97706', letterSpacing: 0.5 },
  companyName:       { fontSize: 22, fontWeight: '800', color: '#0F172A', marginBottom: 6, letterSpacing: -0.3 },
  companyDesc:       { fontSize: 13, color: '#64748B', lineHeight: 20, marginBottom: 16 },
  companyMeta:       { fontSize: 12, color: '#94A3B8' },
  companyCta:        { fontSize: 14, fontWeight: '700', color: '#4F46E5', backgroundColor: '#EEF2FF', paddingHorizontal: 14, paddingVertical: 6, borderRadius: 20 },

  // DrillPad card
  drillPadCard:       { backgroundColor: '#fff', borderRadius: 20, padding: 20, marginBottom: 24, borderWidth: 1.5, borderColor: '#EDE9FE' },
  drillPadIconCircle: { width: 52, height: 52, borderRadius: 14, backgroundColor: '#EDE9FE', alignItems: 'center', justifyContent: 'center' },
  drillPadName:       { fontSize: 24, fontWeight: '800', color: '#0F172A', marginBottom: 6, letterSpacing: -0.3 },
  drillPadDesc:       { fontSize: 13, color: '#64748B', lineHeight: 20, marginBottom: 16 },
  drillPadMeta:       { fontSize: 12, color: '#94A3B8' },
  drillPadCta:        { fontSize: 14, fontWeight: '700', color: '#7C3AED', backgroundColor: '#EDE9FE', paddingHorizontal: 14, paddingVertical: 6, borderRadius: 20 },

  // Badges
  badgesScroll:  { marginBottom: 24 },
  badgeCard:     { alignItems: 'center', backgroundColor: '#fff', borderRadius: 14, padding: 12, marginRight: 10, borderWidth: 1, borderColor: '#E2E8F0', minWidth: 72 },
  badgeCardName: { fontSize: 10, color: '#64748B', fontWeight: '600', marginTop: 6, textAlign: 'center' },

  // Coming soon
  comingGrid:    { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 24 },
  comingCard:    { width: '47.5%', backgroundColor: '#fff', borderRadius: 14, padding: 14, borderWidth: 1, borderColor: '#E2E8F0' },
  comingIconWrap:{ width: 40, height: 40, borderRadius: 10, alignItems: 'center', justifyContent: 'center', marginBottom: 8 },
  comingLabel:   { fontSize: 13, fontWeight: '700', color: '#0F172A', marginBottom: 6 },
  soonPill:      { backgroundColor: '#F1F5F9', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 20, alignSelf: 'flex-start' },
  soonPillText:  { fontSize: 10, color: '#94A3B8', fontWeight: '600' },

  // Freeze banner
  freezeBanner: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: '#EFF6FF', borderRadius: 14, padding: 16, borderWidth: 1, borderColor: '#BFDBFE' },
  freezeEmoji:  { fontSize: 28 },
  freezeTitle:  { fontSize: 14, fontWeight: '700', color: '#1D4ED8', marginBottom: 2 },
  freezeSub:    { fontSize: 12, color: '#3B82F6' },
});