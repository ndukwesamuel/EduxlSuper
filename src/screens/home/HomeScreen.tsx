// ─── HomeScreen.tsx ───────────────────────────────────────────────
import React, { useEffect, useState, useRef } from "react";
import {
  View, Text, ScrollView, TouchableOpacity,
  StyleSheet, RefreshControl, Animated, Easing,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useSelector, useDispatch } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootState, AppDispatch } from "../../store/store";
import { setProfile, setProfileStatus } from "../../store/profileSlice";
import {
  fetchProgress, UserProgress,
  getSubjects, DrillSubject,
  getProfileStatus, getProfile,
} from "../../../config/client";
import { Colors } from "../../theme";
import { AppStackParamList } from "../../navigation/types";
import PersonaModal from "./PersonaModal";

type Nav = NativeStackNavigationProp<AppStackParamList>;

// ── Static data ────────────────────────────────────────────────────
const GRADUATE_COMING_SOON = [
  { id: "ican",      icon: "📊", label: "ICAN Prep",       desc: "Foundation to Professional" },
  { id: "acca",      icon: "🌍", label: "ACCA Prep",       desc: "Applied Knowledge to Strategic" },
  { id: "interview", icon: "🎤", label: "Interview Coach", desc: "Mock interviews & feedback" },
  { id: "cv",        icon: "📄", label: "CV Builder",      desc: "ATS-ready professional CVs" },
];

const HOOK_PHRASES = [
  "Exam coming.\nNot ready?",
  "Your notes.\nYour coach.\nYour results.",
  "Study smarter.\nScore higher.",
  "From notes to\nexam-ready — fast.",
];

const HOOK_FEATURES = [
  { emoji: "🎯", title: "Know what to study today", desc: "Your coach tells you exactly where to focus — no guessing." },
  { emoji: "📈", title: "Track weak spots early", desc: "Find what you don't know before exam day, not during it." },
  { emoji: "🎬", title: "Notes → videos & audio", desc: "Upload anything. AI turns it into lessons you'll actually finish." },
];

const ACCENTS = [
  { fill: "#D97706", bg: "#FEF3C7" },
  { fill: "#7C3AED", bg: "#EDE9FE" },
  { fill: "#2563EB", bg: "#DBEAFE" },
  { fill: "#059669", bg: "#D1FAE5" },
  { fill: "#DB2777", bg: "#FCE7F3" },
  { fill: "#DC2626", bg: "#FEE2E2" },
];
const COURSE_EMOJIS = ["📐", "📱", "✍️", "🧬", "📓", "🔬", "📊", "🧪", "🌍", "📖"];

function accentFor(i: number) { return ACCENTS[i % ACCENTS.length]; }
function emojiFor(i: number)  { return COURSE_EMOJIS[i % COURSE_EMOJIS.length]; }

function getLagosGreeting(): string {
  const h = new Date(Date.now() + 3_600_000).getUTCHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}
function getLagosEmoji(): string {
  const h = new Date(Date.now() + 3_600_000).getUTCHours();
  if (h < 12) return "☀️";
  if (h < 17) return "🌤️";
  return "🌙";
}

// ── Animated Hook Section ──────────────────────────────────────────
function HookSection({ persona, onCTA }: { persona: string | null | undefined; onCTA: () => void }) {
  const [phraseIdx, setPhraseIdx] = useState(0);
  const fadePhrase = useRef(new Animated.Value(1)).current;

  // Feature card animations — stagger slide-up
  const cardAnims = useRef(HOOK_FEATURES.map(() => ({
    opacity:   new Animated.Value(0),
    translateY: new Animated.Value(30),
  }))).current;

  // Cycle phrases every 2.5s with fade
  useEffect(() => {
    const interval = setInterval(() => {
      Animated.timing(fadePhrase, {
        toValue: 0, duration: 250, useNativeDriver: true,
      }).start(() => {
        setPhraseIdx((i) => (i + 1) % HOOK_PHRASES.length);
        Animated.timing(fadePhrase, {
          toValue: 1, duration: 350, useNativeDriver: true,
        }).start();
      });
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  // Stagger feature cards on mount
  useEffect(() => {
    const animations = cardAnims.map((anim, i) =>
      Animated.parallel([
        Animated.timing(anim.opacity, {
          toValue: 1, duration: 500,
          delay: 300 + i * 150,
          useNativeDriver: true,
          easing: Easing.out(Easing.ease),
        }),
        Animated.timing(anim.translateY, {
          toValue: 0, duration: 500,
          delay: 300 + i * 150,
          useNativeDriver: true,
          easing: Easing.out(Easing.back(1.2)),
        }),
      ])
    );
    Animated.parallel(animations).start();
  }, []);

  return (
    <View style={h.wrap}>

      {/* Cycling headline */}
      <View style={h.headlineWrap}>
        <Animated.Text style={[h.headline, { opacity: fadePhrase }]}>
          {HOOK_PHRASES[phraseIdx]}
        </Animated.Text>
        <Text style={h.sub}>
          EduXL is your personal study coach — built for students and graduates who want real results.
        </Text>
      </View>

      {/* Feature cards — staggered */}
      {HOOK_FEATURES.map((f, i) => (
        <Animated.View
          key={f.title}
          style={[
            h.featureCard,
            {
              opacity:   cardAnims[i].opacity,
              transform: [{ translateY: cardAnims[i].translateY }],
            },
          ]}
        >
          <View style={h.featureIconWrap}>
            <Text style={h.featureIcon}>{f.emoji}</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={h.featureTitle}>{f.title}</Text>
            <Text style={h.featureDesc}>{f.desc}</Text>
          </View>
        </Animated.View>
      ))}

      {/* CTA */}
      <TouchableOpacity style={h.cta} onPress={onCTA} activeOpacity={0.85}>
        <Text style={h.ctaText}>
          {persona === 'graduate' ? 'Start Prep →' : 'Start Studying →'}
        </Text>
      </TouchableOpacity>

      <Text style={h.nudge}>Join thousands already studying smarter 🇳🇬</Text>
    </View>
  );
}

const h = StyleSheet.create({
  wrap:          { paddingHorizontal: 22, paddingTop: 8, paddingBottom: 4 },
  headlineWrap:  { marginBottom: 24 },
  headline:      { fontSize: 34, fontWeight: '800', color: '#0F172A', lineHeight: 42, letterSpacing: -1 },
  sub:           { fontSize: 13, color: '#64748B', lineHeight: 20, marginTop: 10 },
  featureCard:   { flexDirection: 'row', alignItems: 'flex-start', gap: 14, backgroundColor: '#fff', borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 18, padding: 16, marginBottom: 10 },
  featureIconWrap:{ width: 44, height: 44, borderRadius: 14, backgroundColor: '#F1F5F9', alignItems: 'center', justifyContent: 'center' },
  featureIcon:   { fontSize: 22 },
  featureTitle:  { fontSize: 14, fontWeight: '700', color: '#0F172A', marginBottom: 3 },
  featureDesc:   { fontSize: 12, color: '#64748B', lineHeight: 18 },
  cta:           { backgroundColor: '#0F172A', borderRadius: 999, paddingVertical: 16, alignItems: 'center', marginTop: 8, shadowColor: '#0F172A', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.25, shadowRadius: 14, elevation: 8 },
  ctaText:       { fontSize: 16, fontWeight: '800', color: '#fff', letterSpacing: 0.2 },
  nudge:         { fontSize: 12, color: '#94A3B8', textAlign: 'center', marginTop: 14 },
});

// ── Main Component ─────────────────────────────────────────────────
export default function HomeScreen() {
  const navigation    = useNavigation<Nav>();
  const dispatch      = useDispatch<AppDispatch>();
  const user          = useSelector((s: RootState) => s.auth.user);
  const profileStatus = useSelector((s: RootState) => s.profile.status);

  const [progress,         setProgress]         = useState<UserProgress | null>(null);
  const [subjects,         setSubjects]         = useState<DrillSubject[]>([]);
  const [refreshing,       setRefreshing]       = useState(false);
  const [showPersonaModal, setShowPersonaModal] = useState(false);

  const fadeAnim  = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim,  { toValue: 1, duration: 500, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 500, useNativeDriver: true }),
    ]).start();
  }, []);

  const loadData = async () => {
    if (!user?._id) return;
    try {
      const [prog, subs, status, prof] = await Promise.all([
        fetchProgress(),
        getSubjects(),
        getProfileStatus(),
        getProfile(),
      ]);
      setProgress(prog);
      setSubjects(subs);
      dispatch(setProfileStatus(status));
      dispatch(setProfile(prof));
      if (!status.persona) setShowPersonaModal(true);
    } catch {}
  };

  useEffect(() => { loadData(); }, [user]);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const firstName    = user?.name?.split(" ")[0] ?? "there";
  const XP_PER_LEVEL = 500;
  const totalXp      = progress?.xp ?? 0;
  const level        = Math.floor(totalXp / XP_PER_LEVEL) + 1;
  const xpInLvl      = totalXp % XP_PER_LEVEL;
  const xpPct        = (xpInLvl / XP_PER_LEVEL) * 100;
  const streak       = progress?.streak ?? 0;
  const firstSubject = subjects[0] ?? null;
  const persona      = profileStatus?.persona;

  // ── Is the user "new" — no activity yet ──────────────────────────
  const isNewUser = subjects.length === 0 && totalXp === 0 && streak === 0;

  // ── CTA navigation based on persona ──────────────────────────────
  const handleCTA = () => {
    if (persona === 'graduate') {
      navigation.navigate('BankReady');
    } else {
      navigation.navigate('MainTabs', { screen: 'LearnPad' } as any);
    }
  };

  return (
    <SafeAreaView style={s.safe}>
      <ScrollView
        contentContainerStyle={s.scroll}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Colors.brand} />
        }
      >
        <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}>

          {/* ── TOP BAR ─────────────────────────────────────────── */}
          <View style={s.topBar}>
            <View>
              <Text style={s.greeting}>{getLagosEmoji()} {getLagosGreeting()}</Text>
              <Text style={s.name}>{firstName}</Text>
            </View>
            <TouchableOpacity
              style={s.avatarWrap}
              onPress={() => navigation.navigate("Profile" as any)}
              activeOpacity={0.8}
            >
              <View style={s.avatar}>
                <Text style={s.avatarLetter}>{user?.name?.charAt(0).toUpperCase() ?? "?"}</Text>
              </View>
              {streak > 0 && (
                <View style={s.streakDot}>
                  <Text style={s.streakDotText}>🔥</Text>
                </View>
              )}
            </TouchableOpacity>
          </View>

          {/* ── STREAK HERO ─────────────────────────────────────── */}
          <View style={s.streakHero}>
            <View style={s.glow1} />
            <View style={s.glow2} />
            <View style={s.streakRow}>
              <View style={s.streakLeft}>
                <Text style={s.streakFire}>🔥</Text>
                <View>
                  <Text style={s.streakNum}>{streak}</Text>
                  <Text style={s.streakLabel}>day streak</Text>
                </View>
              </View>
              <View style={s.streakRight}>
                <Text style={s.xpLabel}>TOTAL XP</Text>
                <Text style={s.xpVal}>{totalXp}</Text>
                <Text style={s.xpSub}>Lv {level} · {XP_PER_LEVEL - xpInLvl} to next</Text>
              </View>
            </View>
            <View style={s.streakBarWrap}>
              <View style={s.streakBarTrack}>
                <View style={[s.streakBarFill, { width: `${xpPct}%` as any }]} />
              </View>
              <Text style={s.streakBarLabel}>{xpInLvl} / {XP_PER_LEVEL} XP to Level {level + 1}</Text>
            </View>
            <View style={s.streakMsgBox}>
              <Text style={s.streakMsg}>
                {streak > 0
                  ? <>{streak} {streak === 1 ? "day" : "days"} straight. <Text style={s.streakMsgAccent}>Don't break the chain</Text> — study something today.</>
                  : <>Start your first session today. <Text style={s.streakMsgAccent}>Day 1 begins now.</Text></>
                }
              </Text>
            </View>
          </View>

          {/* ── NEW USER HOOK ────────────────────────────────────── */}
          {isNewUser && (
            <HookSection persona={persona} onCTA={handleCTA} />
          )}

          {/* ── RETURNING USER — CONTINUE STUDYING ──────────────── */}
          {!isNewUser && firstSubject && (
            <>
              <Text style={s.sec}>CONTINUE STUDYING</Text>
              <TouchableOpacity
                style={s.continueCard}
                onPress={() => navigation.navigate("DrillSubject", {
                  subjectId: firstSubject._id,
                  subjectName: firstSubject.name,
                })}
                activeOpacity={0.85}
              >
                <View style={[s.continueIcon, { backgroundColor: accentFor(0).bg }]}>
                  <Text style={{ fontSize: 24 }}>{emojiFor(0)}</Text>
                </View>
                <View style={s.continueBody}>
                  <Text style={s.continueEyebrow}>DRILLPAD COURSE</Text>
                  <Text style={s.continueName} numberOfLines={1}>{firstSubject.name}</Text>
                  <Text style={s.continueMeta}>
                    {firstSubject.totalQuestions} question{firstSubject.totalQuestions !== 1 ? "s" : ""}
                    {firstSubject.weakCount > 0 ? ` · ⚠️ ${firstSubject.weakCount} weak` : ""}
                  </Text>
                </View>
                <View style={s.continueBtn}>
                  <Text style={s.continueBtnText}>Resume →</Text>
                </View>
              </TouchableOpacity>
            </>
          )}

          {/* ── MY COURSES (returning users only) ───────────────── */}
          {!isNewUser && subjects.length > 0 && (
            <>
              <Text style={s.sec}>MY COURSES</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.coursesRow}>
                {subjects.map((sub, index) => {
                  const accent = accentFor(index);
                  const emoji  = emojiFor(index);
                  const pct    = sub.bestScore !== null ? Math.round((sub.bestScore / 10) * 100) : 0;
                  return (
                    <TouchableOpacity
                      key={sub._id}
                      style={s.courseChip}
                      activeOpacity={0.8}
                      onPress={() => navigation.navigate("DrillSubject", {
                        subjectId: sub._id, subjectName: sub.name,
                      })}
                    >
                      <Text style={s.courseChipIcon}>{emoji}</Text>
                      <Text style={s.courseChipName} numberOfLines={1}>{sub.name}</Text>
                      <View style={s.courseTrack}>
                        <View style={[s.courseTrackFill, { width: `${pct}%` as any, backgroundColor: accent.fill }]} />
                      </View>
                      <Text style={s.courseChipPct}>{pct === 0 ? "not started" : `${pct}%`}</Text>
                    </TouchableOpacity>
                  );
                })}
                <TouchableOpacity style={s.seeAllChip} activeOpacity={0.8} onPress={() => navigation.navigate("LearnPad" as any)}>
                  <Text style={s.seeAllArrow}>›</Text>
                  <Text style={s.seeAllText}>See all</Text>
                </TouchableOpacity>
              </ScrollView>
            </>
          )}

          {/* ── DRILLPAD CARD — visible to ALL ──────────────────── */}
          <Text style={s.sec}>YOUR STUDY COACH</Text>
          <TouchableOpacity
            style={s.drillCard}
            onPress={() => navigation.navigate('MainTabs', { screen: 'LearnPad' } as any)}
            activeOpacity={0.9}
          >
            <View style={s.drillCardTop}>
              <View style={s.drillIconCircle}>
                <Text style={{ fontSize: 26 }}>📖</Text>
              </View>
              <View style={s.activeBadge}>
                <View style={s.activeDot} />
                <Text style={s.activeBadgeText}>ACTIVE</Text>
              </View>
            </View>
            <Text style={s.drillName}>DrillPad</Text>
            <Text style={s.drillDesc}>
              Upload your notes. AI turns them into questions, audio lessons, and whiteboard videos.
            </Text>
            <View style={s.drillFooter}>
              <Text style={s.drillMeta}>📂 Any subject  ·  ⚡ Any exam</Text>
              <Text style={s.drillCta}>Open →</Text>
            </View>
          </TouchableOpacity>

          {/* ── SPECIALIST TRACKS — graduate only ───────────────── */}
          {persona === 'graduate' && (
            <>
              <Text style={s.sec}>SPECIALIST TRACKS</Text>
              <View style={s.tracksRow}>
                <TouchableOpacity
                  style={[s.trackCard, s.trackDark]}
                  onPress={() => navigation.navigate("BankReady")}
                  activeOpacity={0.88}
                >
                  <View style={s.trackTopRow}>
                    <View style={[s.trackIcon, s.trackIconDark]}>
                      <Text style={{ fontSize: 18 }}>🏦</Text>
                    </View>
                    <View style={[s.trackBadge, s.trackBadgeActive]}>
                      <Text style={s.trackBadgeActiveText}>ACTIVE</Text>
                    </View>
                  </View>
                  <Text style={[s.trackName, { color: "#fff" }]}>BankReady</Text>
                  <Text style={[s.trackDesc, { color: "rgba(255,255,255,0.65)" }]}>GTBank, Access, Stanbic & more</Text>
                  <Text style={[s.trackCta, { color: "rgba(255,255,255,0.8)" }]}>639+ questions →</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[s.trackCard, s.trackLight]}
                  onPress={() => navigation.navigate("CompanyTracks")}
                  activeOpacity={0.88}
                >
                  <View style={s.trackTopRow}>
                    <View style={[s.trackIcon, s.trackIconLight]}>
                      <Text style={{ fontSize: 18 }}>🏢</Text>
                    </View>
                    <View style={[s.trackBadge, s.trackBadgeNew]}>
                      <Text style={s.trackBadgeNewText}>NEW</Text>
                    </View>
                  </View>
                  <Text style={[s.trackName, { color: "#0F172A" }]}>Company Tracks</Text>
                  <Text style={[s.trackDesc, { color: "#64748B" }]}>Shell, KPMG, PwC simulations</Text>
                  <Text style={[s.trackCta, { color: "#4F46E5" }]}>Explore →</Text>
                </TouchableOpacity>
              </View>
            </>
          )}

          {/* ── COMING SOON — graduate only ─────────────────────── */}
          {persona === 'graduate' && (
            <>
              <Text style={s.sec}>COMING SOON</Text>
              <View style={s.comingGrid}>
                {GRADUATE_COMING_SOON.map((m) => (
                  <View key={m.id} style={s.comingCard}>
                    <Text style={s.comingIcon}>{m.icon}</Text>
                    <Text style={s.comingName}>{m.label}</Text>
                    <Text style={s.comingDesc}>{m.desc}</Text>
                    <View style={s.soonPill}>
                      <Text style={s.soonPillText}>Soon</Text>
                    </View>
                  </View>
                ))}
              </View>
            </>
          )}

          {/* ── BADGES ──────────────────────────────────────────── */}
          {progress && progress.badges.length > 0 && (
            <>
              <Text style={s.sec}>RECENT BADGES</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.badgesRow}>
                {progress.badges.slice(0, 6).map((b) => (
                  <View key={b.id} style={s.badgeCard}>
                    <Text style={{ fontSize: 28 }}>{b.icon}</Text>
                    <Text style={s.badgeName}>{b.name}</Text>
                  </View>
                ))}
              </ScrollView>
            </>
          )}

          {/* ── STREAK FREEZE ───────────────────────────────────── */}
          {progress?.streakFreezeAvailable && (
            <View style={s.freezeBanner}>
              <Text style={{ fontSize: 26 }}>🧊</Text>
              <View style={{ flex: 1 }}>
                <Text style={s.freezeTitle}>Streak Freeze Available</Text>
                <Text style={s.freezeSub}>Use it to protect your streak on a rest day</Text>
              </View>
            </View>
          )}

          <View style={{ height: 16 }} />
        </Animated.View>
      </ScrollView>

      <PersonaModal
        visible={showPersonaModal}
        onComplete={() => setShowPersonaModal(false)}
      />
    </SafeAreaView>
  );
}

// ─── Styles ───────────────────────────────────────────────────────
const s = StyleSheet.create({
  safe:   { flex: 1, backgroundColor: "#F8FAFC" },
  scroll: { paddingBottom: 60 },

  topBar:       { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", paddingHorizontal: 22, paddingTop: 20 },
  greeting:     { fontSize: 13, color: "#64748B", fontWeight: "500", marginBottom: 3 },
  name:         { fontSize: 32, fontWeight: "800", color: "#0F172A", letterSpacing: -1, lineHeight: 34 },
  avatarWrap:   { position: "relative" },
  avatar:       { width: 48, height: 48, borderRadius: 24, backgroundColor: "#DBEAFE", alignItems: "center", justifyContent: "center" },
  avatarLetter: { fontSize: 18, fontWeight: "800", color: "#1D4ED8" },
  streakDot:    { position: "absolute", top: -3, right: -3, width: 20, height: 20, borderRadius: 10, backgroundColor: "#fff", alignItems: "center", justifyContent: "center" },
  streakDotText:{ fontSize: 11 },

  streakHero:     { margin: 22, marginTop: 20, backgroundColor: "#0F172A", borderRadius: 24, padding: 20, overflow: "hidden" },
  glow1:          { position: "absolute", top: -30, right: -30, width: 120, height: 120, borderRadius: 60, backgroundColor: "rgba(251,191,36,0.15)" },
  glow2:          { position: "absolute", bottom: -40, left: -20, width: 100, height: 100, borderRadius: 50, backgroundColor: "rgba(251,191,36,0.06)" },
  streakRow:      { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  streakLeft:     { flexDirection: "row", alignItems: "center", gap: 14 },
  streakFire:     { fontSize: 42, lineHeight: 50 },
  streakNum:      { fontSize: 48, fontWeight: "800", color: "#fff", lineHeight: 50, letterSpacing: -2 },
  streakLabel:    { fontSize: 13, color: "rgba(255,255,255,0.5)", fontWeight: "500", marginTop: 2 },
  streakRight:    { alignItems: "flex-end" },
  xpLabel:        { fontSize: 11, color: "rgba(255,255,255,0.4)", fontWeight: "600", marginBottom: 4, letterSpacing: 0.5 },
  xpVal:          { fontSize: 22, fontWeight: "800", color: "#FCD34D" },
  xpSub:          { fontSize: 11, color: "rgba(255,255,255,0.4)", fontWeight: "500" },
  streakBarWrap:  { marginTop: 14 },
  streakBarTrack: { height: 4, backgroundColor: "rgba(255,255,255,0.1)", borderRadius: 2, overflow: "hidden", marginBottom: 5 },
  streakBarFill:  { height: 4, backgroundColor: "#FCD34D", borderRadius: 2 },
  streakBarLabel: { fontSize: 11, color: "rgba(255,255,255,0.35)", fontWeight: "500" },
  streakMsgBox:   { marginTop: 12, paddingTop: 12, borderTopWidth: 1, borderTopColor: "rgba(255,255,255,0.08)" },
  streakMsg:      { fontSize: 13, color: "rgba(255,255,255,0.55)", lineHeight: 18 },
  streakMsgAccent:{ color: "#FCD34D", fontWeight: "600" },

  sec: { fontSize: 11, fontWeight: "700", color: "#94A3B8", letterSpacing: 1.2, paddingHorizontal: 22, paddingTop: 20, paddingBottom: 10 },

  continueCard:    { flexDirection: "row", alignItems: "center", marginHorizontal: 22, backgroundColor: "#fff", borderRadius: 20, padding: 16, borderWidth: 1, borderColor: "#E2E8F0", gap: 14 },
  continueIcon:    { width: 52, height: 52, borderRadius: 16, alignItems: "center", justifyContent: "center" },
  continueBody:    { flex: 1, minWidth: 0 },
  continueEyebrow: { fontSize: 10, fontWeight: "700", color: "#7C3AED", letterSpacing: 0.8, marginBottom: 3 },
  continueName:    { fontSize: 16, fontWeight: "700", color: "#0F172A", marginBottom: 4 },
  continueMeta:    { fontSize: 12, color: "#94A3B8" },
  continueBtn:     { backgroundColor: "#0F172A", borderRadius: 999, paddingVertical: 9, paddingHorizontal: 16 },
  continueBtnText: { fontSize: 13, fontWeight: "700", color: "#fff" },

  coursesRow:      { paddingHorizontal: 22, gap: 10 },
  courseChip:      { backgroundColor: "#fff", borderWidth: 1, borderColor: "#E2E8F0", borderRadius: 18, padding: 14, minWidth: 140 },
  courseChipIcon:  { fontSize: 22, marginBottom: 8 },
  courseChipName:  { fontSize: 13, fontWeight: "700", color: "#0F172A", marginBottom: 6 },
  courseTrack:     { height: 3, backgroundColor: "#F1F5F9", borderRadius: 2, overflow: "hidden", marginBottom: 4 },
  courseTrackFill: { height: 3, borderRadius: 2 },
  courseChipPct:   { fontSize: 10, fontWeight: "600", color: "#94A3B8" },
  seeAllChip:      { backgroundColor: "#F8FAFC", borderWidth: 1, borderColor: "#CBD5E1", borderStyle: "dashed", borderRadius: 18, minWidth: 80, alignItems: "center", justifyContent: "center", paddingVertical: 14, paddingHorizontal: 12, gap: 6 },
  seeAllArrow:     { fontSize: 20, color: "#94A3B8" },
  seeAllText:      { fontSize: 11, fontWeight: "600", color: "#94A3B8" },

  // DrillPad card — all users
  drillCard:       { marginHorizontal: 22, backgroundColor: "#fff", borderRadius: 20, padding: 20, borderWidth: 1.5, borderColor: "#EDE9FE" },
  drillCardTop:    { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 14 },
  drillIconCircle: { width: 52, height: 52, borderRadius: 14, backgroundColor: "#EDE9FE", alignItems: "center", justifyContent: "center" },
  activeBadge:     { flexDirection: "row", alignItems: "center", gap: 5, backgroundColor: "#EDE9FE", paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20 },
  activeDot:       { width: 6, height: 6, borderRadius: 3, backgroundColor: "#7C3AED" },
  activeBadgeText: { fontSize: 10, fontWeight: "700", color: "#7C3AED", letterSpacing: 0.5 },
  drillName:       { fontSize: 24, fontWeight: "800", color: "#0F172A", marginBottom: 6, letterSpacing: -0.3 },
  drillDesc:       { fontSize: 13, color: "#64748B", lineHeight: 20, marginBottom: 16 },
  drillFooter:     { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  drillMeta:       { fontSize: 12, color: "#94A3B8" },
  drillCta:        { fontSize: 14, fontWeight: "700", color: "#7C3AED", backgroundColor: "#EDE9FE", paddingHorizontal: 14, paddingVertical: 6, borderRadius: 20 },

  // Specialist tracks
  tracksRow:            { flexDirection: "row", gap: 10, paddingHorizontal: 22 },
  trackCard:            { flex: 1, borderRadius: 20, padding: 16 },
  trackDark:            { backgroundColor: "#1D4ED8" },
  trackLight:           { backgroundColor: "#fff", borderWidth: 1, borderColor: "#E0E7FF" },
  trackTopRow:          { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 },
  trackIcon:            { width: 40, height: 40, borderRadius: 12, alignItems: "center", justifyContent: "center" },
  trackIconDark:        { backgroundColor: "rgba(255,255,255,0.15)" },
  trackIconLight:       { backgroundColor: "#EEF2FF" },
  trackBadge:           { paddingHorizontal: 7, paddingVertical: 3, borderRadius: 10 },
  trackBadgeActive:     { backgroundColor: "rgba(255,255,255,0.2)" },
  trackBadgeActiveText: { fontSize: 9, fontWeight: "700", color: "#fff", letterSpacing: 0.4 },
  trackBadgeNew:        { backgroundColor: "#FEF3C7" },
  trackBadgeNewText:    { fontSize: 9, fontWeight: "700", color: "#D97706", letterSpacing: 0.4 },
  trackName:            { fontSize: 15, fontWeight: "800", letterSpacing: -0.3, marginBottom: 3 },
  trackDesc:            { fontSize: 11, lineHeight: 16, marginBottom: 10 },
  trackCta:             { fontSize: 12, fontWeight: "700" },

  // Coming soon
  comingGrid:   { flexDirection: "row", flexWrap: "wrap", gap: 10, paddingHorizontal: 22 },
  comingCard:   { width: "47.5%", backgroundColor: "#fff", borderRadius: 16, padding: 14, borderWidth: 1, borderColor: "#E2E8F0" },
  comingIcon:   { fontSize: 22, marginBottom: 8 },
  comingName:   { fontSize: 13, fontWeight: "700", color: "#0F172A", marginBottom: 2 },
  comingDesc:   { fontSize: 10, color: "#94A3B8", lineHeight: 14, marginBottom: 8 },
  soonPill:     { backgroundColor: "#F1F5F9", paddingHorizontal: 8, paddingVertical: 2, borderRadius: 20, alignSelf: "flex-start" },
  soonPillText: { fontSize: 10, color: "#94A3B8", fontWeight: "600" },

  badgesRow:  { paddingHorizontal: 22, paddingBottom: 4 },
  badgeCard:  { alignItems: "center", backgroundColor: "#fff", borderRadius: 14, padding: 12, marginRight: 10, borderWidth: 1, borderColor: "#E2E8F0", minWidth: 72 },
  badgeName:  { fontSize: 10, color: "#64748B", fontWeight: "600", marginTop: 6, textAlign: "center" },

  freezeBanner: { flexDirection: "row", alignItems: "center", gap: 12, backgroundColor: "#EFF6FF", borderRadius: 14, padding: 16, marginHorizontal: 22, marginTop: 20, borderWidth: 1, borderColor: "#BFDBFE" },
  freezeTitle:  { fontSize: 14, fontWeight: "700", color: "#1D4ED8", marginBottom: 2 },
  freezeSub:    { fontSize: 12, color: "#3B82F6" },
});