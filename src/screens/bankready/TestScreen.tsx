

import React, { useEffect, useState, useCallback, useRef } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Animated,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useDispatch, useSelector } from "react-redux";
import { AppStackParamList } from "../../navigation/types";
import { RootState } from "../../store/store";
import {
  startTest,
  answerQuestion,
  nextQuestion,
  prevQuestion,
  goToQuestion,
  saveResult,
} from "../../store/testSlice";
import { fetchQuestions, submitTest } from "../../../config/client"  //"../../api/client";
import {
  Colors,
  FontSize,
  Radius,
  Spacing,
  Shadows,
  ModuleConfig,
} from "../../theme";
import CCCard from "../../components/CCCard";
import CCTag from "../../components/CCTag";
import CCLoader from "../../components/CCLoader";
import type {
  Question,
  OptionKey,
  ModuleCategory,
} from "../../store/testSlice";

type Nav = NativeStackNavigationProp<AppStackParamList>;
type Route = RouteProp<AppStackParamList, "Test">;

const OPTION_KEYS: OptionKey[] = ["A", "B", "C", "D"];

const FORMULA_SHEETS: Record<
  ModuleCategory,
  { title: string; tips: string[] }
> = {
  numerical: {
    title: "🔢 Numerical Quick Tips",
    tips: [
      "% change = (new - old) / old × 100",
      "Reverse %: original = value / (1 ± rate)",
      "Simple interest: I = PRT  |  Compound: A = P(1+r)ⁿ",
      "Ratio a:b share = a/(a+b) × total",
      "Average speed = 2ab / (a+b)",
      "Work rate: 1/A + 1/B = 1/T",
      "Break-even = Fixed costs / Contribution per unit",
    ],
  },
  verbal: {
    title: "📖 Verbal Quick Tips",
    tips: [
      "True → directly stated in passage",
      "False → contradicted by passage",
      "Cannot Say → not enough info to decide",
      '"Sole/all/never" → likely False',
      '"Some/may/could" → likely Cannot Say',
      "Collective nouns (team, board) → singular verb",
      "Neither...nor → verb agrees with nearer subject",
    ],
  },
  logical: {
    title: "🧠 Logical Quick Tips",
    tips: [
      "Differences increasing? → add that increment",
      "×2+1 or ×2-1 patterns are common",
      "Squares: 1,4,9,16,25,36,49,64,81,100",
      "Cubes: 1,8,27,64,125,216",
      "Fibonacci: each = sum of previous two",
      "Contrapositive: P→Q means ¬Q→¬P",
      "Odd one out: find the rule others share",
    ],
  },
  abstract: {
    title: "🔷 Abstract Quick Tips",
    tips: [
      "Check BOTH rows AND columns for rules",
      "Common rules: +, -, ×, ÷, squares, cubes",
      "col3 = col1 + col2  OR  col1 × col2",
      "Letters: A=1, B=2, C=3…",
      "Check differences then differences of differences",
      "Mirror (vertical): reverses left-right",
      "90° clockwise: right→down, up→right",
    ],
  },
};

export default function TestScreen() {
  const navigation = useNavigation<Nav>();
  const route = useRoute<Route>();
  const dispatch = useDispatch();
  const { module, mode, difficulty, tag } = route.params;
  const cfg = ModuleConfig[module];

  const testState = useSelector((s: RootState) => s.test);
  const user = useSelector((s: RootState) => s.auth.user);
  const { questions, answers, currentIndex } = testState;

  const isPractice = mode === "practice";
  const isSpeed = mode === "speed";
  const isExam = mode === "exam";
  const limit = isSpeed ? 20 : 10;

  const [pageState, setPageState] = useState<
    "formula" | "loading" | "ready" | "error"
  >(isPractice ? "formula" : "loading");
  const [submitting, setSubmitting] = useState(false);
  const [feedbackShown, setFeedbackShown] = useState(false);
  const [practiceScore, setPracticeScore] = useState({ correct: 0, total: 0 });
  const [correctStreak, setCorrectStreak] = useState(0);

  // Timers
  const [examTimeLeft, setExamTimeLeft] = useState(
    module === "numerical" ? 720 : 600,
  );
  const [speedTimeLeft, setSpeedTimeLeft] = useState(15);
  const examTimerRef = useRef<NodeJS.Timeout | null>(null);
  const speedTimerRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number>(Date.now());

  // Toast
  const [toast, setToast] = useState<{ text: string; color: string } | null>(
    null,
  );
  const toastOpacity = useRef(new Animated.Value(0)).current;

  // Refs to avoid stale closures in speed timer
  const currentIndexRef = useRef(currentIndex);
  const questionsLenRef = useRef(questions.length);
  useEffect(() => {
    currentIndexRef.current = currentIndex;
  }, [currentIndex]);
  useEffect(() => {
    questionsLenRef.current = questions.length;
  }, [questions.length]);

  const showToast = useCallback(
    (text: string, color: string) => {
      setToast({ text, color });
      Animated.sequence([
        Animated.timing(toastOpacity, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.delay(1500),
        Animated.timing(toastOpacity, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start(() => setToast(null));
    },
    [toastOpacity],
  );

  const loadQuestions = useCallback(async () => {
    setPageState("loading");
    try {
      const data = await fetchQuestions(
        module as ModuleCategory,
        limit,
        difficulty,
        tag,
        mode,
      );
      dispatch(
        startTest({
          questions: data.questions,
          module: module as ModuleCategory,
        }),
      );
      startTimeRef.current = Date.now();
      setPageState("ready");
    } catch {
      setPageState("error");
    }
  }, [module, limit, difficulty, tag, mode, dispatch]);

  useEffect(() => {
    if (!isPractice) loadQuestions();
  }, []); // eslint-disable-line

  // Exam timer
  useEffect(() => {
    if (pageState !== "ready" || !isExam) return;
    examTimerRef.current = setInterval(() => {
      setExamTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(examTimerRef.current!);
          handleSubmit(true);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(examTimerRef.current!);
  }, [pageState, isExam]); // eslint-disable-line

  // Speed timer
  useEffect(() => {
    if (pageState !== "ready" || !isSpeed) return;
    speedTimerRef.current = setInterval(() => {
      setSpeedTimeLeft((t) => {
        if (t <= 1) {
          if (currentIndexRef.current < questionsLenRef.current - 1)
            dispatch(nextQuestion());
          else handleSubmit(true);
          return 15;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(speedTimerRef.current!);
  }, [pageState, isSpeed]); // eslint-disable-line

  useEffect(() => {
    if (isSpeed && pageState === "ready") setSpeedTimeLeft(15);
  }, [currentIndex]); // eslint-disable-line

  const handleSubmit = useCallback(
    async (force = false) => {
      if (!force && Object.keys(answers).length < questions.length) {
        Alert.alert(
          "Submit Test?",
          `${questions.length - Object.keys(answers).length} questions unanswered. They will be marked incorrect.`,
          [
            { text: "Go Back", style: "cancel" },
            {
              text: "Submit",
              style: "destructive",
              onPress: () => handleSubmit(true),
            },
          ],
        );
        return;
      }
      clearInterval(examTimerRef.current!);
      clearInterval(speedTimerRef.current!);
      setSubmitting(true);
      try {
        const timeTaken = Math.floor(
          (Date.now() - startTimeRef.current) / 1000,
        );
        const answersArray = questions.map((q) => ({
          questionId: q._id,
          selectedOption: answers[q._id] ?? ("A" as OptionKey),
        }));

        // Server reads userId from JWT token — no need to pass it
        const data = await submitTest(
          answersArray,
          timeTaken,
          module as ModuleCategory,
          mode,
        );

        dispatch(
          saveResult({
            result: data.result,
            wrongAnswerDetails: data.wrongAnswerDetails,
          }),
        );
        navigation.navigate("Results");
      } catch {
        Alert.alert("Error", "Submission failed. Please try again.");
        setSubmitting(false);
      }
    },
    [answers, questions, user, module, mode, dispatch, navigation],
  );

  const handleAnswer = (questionId: string, key: OptionKey) => {
    const q = questions[currentIndex];
    dispatch(answerQuestion({ questionId, option: key }));
    const isCorrect = key === q.correctAnswer;
    if (isCorrect) {
      const ns = correctStreak + 1;
      setCorrectStreak(ns);
      if (q.difficulty === "hard")
        showToast("💪 Hard one! +15 XP", Colors.purple);
      else if (ns === 3) showToast("🔥 3 in a row!", Colors.warning);
      else if (ns === 5) showToast("🔥🔥 5 in a row!", Colors.warning);
    } else {
      setCorrectStreak(0);
    }
  };

  const handlePracticeAnswer = (questionId: string, key: OptionKey) => {
    if (feedbackShown) return;
    handleAnswer(questionId, key);
    setFeedbackShown(true);
    const isCorrect = key === questions[currentIndex].correctAnswer;
    setPracticeScore((p) => ({
      correct: p.correct + (isCorrect ? 1 : 0),
      total: p.total + 1,
    }));
  };

  const handlePracticeNext = () => {
    setFeedbackShown(false);
    if (currentIndex < questions.length - 1) dispatch(nextQuestion());
    else handleSubmit(true);
  };

  // ── Render states ─────────────────────────────────────────────
  if (pageState === "formula") {
    const sheet = FORMULA_SHEETS[module as ModuleCategory];
    return (
      <SafeAreaView style={styles.safe}>
        <ScrollView contentContainerStyle={styles.scroll}>
          <View style={styles.formulaHeader}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Text style={styles.backText}>← Back</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.formulaCard}>
            <Text style={styles.formulaTitle}>{sheet.title}</Text>
            <Text style={styles.formulaSubtitle}>Review before you start</Text>
            {sheet.tips.map((tip, i) => (
              <View key={i} style={styles.tipRow}>
                <Text style={styles.tipArrow}>→</Text>
                <Text style={styles.tipText}>{tip}</Text>
              </View>
            ))}
          </View>
          <TouchableOpacity
            style={styles.startBtn}
            onPress={loadQuestions}
            activeOpacity={0.85}
          >
            <Text style={styles.startBtnText}>Start Practice →</Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    );
  }

  if (pageState === "loading")
    return <CCLoader message={`Loading ${cfg.label} questions...`} />;

  if (pageState === "error")
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.errorState}>
          <Text style={{ fontSize: 48 }}>🔌</Text>
          <Text style={styles.errorTitle}>Connection Error</Text>
          <Text style={styles.errorSub}>
            Could not load questions. Check your connection.
          </Text>
          <TouchableOpacity
            style={styles.startBtn}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.startBtnText}>← Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );

  if (questions.length === 0) return null;

  const question = questions[currentIndex];
  const selected = answers[question._id] as OptionKey | undefined;
  const answered = Object.keys(answers).length;
  const progressPct = ((currentIndex + 1) / questions.length) * 100;
  const isLastQ = currentIndex === questions.length - 1;

  const examMins = Math.floor(examTimeLeft / 60);
  const examSecs = String(examTimeLeft % 60).padStart(2, "0");
  const examPct = examTimeLeft / (module === "numerical" ? 720 : 600);
  const timerColor =
    examPct > 0.5 ? cfg.color : examPct > 0.2 ? Colors.warning : Colors.danger;

  const diffVariant =
    question.difficulty === "easy"
      ? "easy"
      : question.difficulty === "hard"
        ? "hard"
        : "medium";

  return (
    <SafeAreaView style={styles.safe}>
      {/* ── Toast ── */}
      {toast && (
        <Animated.View
          style={[
            styles.toast,
            { backgroundColor: toast.color, opacity: toastOpacity },
          ]}
        >
          <Text style={styles.toastText}>{toast.text}</Text>
        </Animated.View>
      )}

      {/* ── Streak banner ── */}
      {correctStreak >= 3 && (
        <View style={styles.streakBanner}>
          <Text style={styles.streakBannerText}>
            🔥 {correctStreak} correct in a row!
          </Text>
        </View>
      )}

      {/* ── Header ── */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.exitBtn}
        >
          <Text style={styles.exitText}>✕ Exit</Text>
        </TouchableOpacity>

        <View style={styles.progressTrack}>
          <View
            style={[
              styles.progressFill,
              { width: `${progressPct}%`, backgroundColor: cfg.color },
            ]}
          />
        </View>

        <Text style={styles.qCount}>
          {currentIndex + 1}/{questions.length}
        </Text>

        {isExam && (
          <Text style={[styles.timer, { color: timerColor }]}>
            {examMins}:{examSecs}
          </Text>
        )}
        {isSpeed && (
          <Text
            style={[
              styles.timer,
              { color: speedTimeLeft <= 5 ? Colors.danger : cfg.color },
            ]}
          >
            {speedTimeLeft}s
          </Text>
        )}
        {isPractice && (
          <Text style={styles.practiceScore}>
            {practiceScore.correct}/{practiceScore.total}
          </Text>
        )}
      </View>

      {/* Speed bar */}
      {isSpeed && (
        <View style={styles.speedTrack}>
          <View
            style={[
              styles.speedFill,
              {
                width: `${(speedTimeLeft / 15) * 100}%`,
                backgroundColor: speedTimeLeft <= 5 ? Colors.danger : cfg.color,
              },
            ]}
          />
        </View>
      )}

      <ScrollView
        contentContainerStyle={styles.main}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Question card ── */}
        <View style={styles.questionCard}>
          <View style={styles.tagsRow}>
            <CCTag label={question.difficulty} variant={diffVariant} />
            {question.tags.slice(0, 2).map((t) => (
              <CCTag key={t} label={t} variant="blue" />
            ))}
          </View>
          <Text style={styles.questionText}>{question.questionText}</Text>
        </View>

        {/* ── Options ── */}
        {OPTION_KEYS.map((key) => {
          const isSel = selected === key;
          const isCorrect = key === question.correctAnswer;
          let optStyle = styles.optionDefault;
          let textStyle = styles.optionTextDefault;
          let keyStyle = styles.optionKeyDefault;

          if (isPractice && feedbackShown) {
            if (isCorrect) {
              optStyle = styles.optionCorrect;
              textStyle = styles.optionTextCorrect;
              keyStyle = styles.optionKeyCorrect;
            } else if (isSel) {
              optStyle = styles.optionWrong;
              textStyle = styles.optionTextWrong;
              keyStyle = styles.optionKeyWrong;
            } else {
              optStyle = styles.optionFaded;
            }
          } else if (isSel) {
            optStyle = {
              ...styles.optionDefault,
              borderColor: cfg.color,
              backgroundColor: cfg.color + "12",
            };
            keyStyle = {
              ...styles.optionKeyDefault,
              backgroundColor: cfg.color,
              borderColor: cfg.color,
            };
            textStyle = {
              ...styles.optionTextDefault,
              color: Colors.textPrimary,
            };
          }

          return (
            <TouchableOpacity
              key={key}
              style={[styles.option, optStyle]}
              onPress={() =>
                isPractice
                  ? handlePracticeAnswer(question._id, key)
                  : handleAnswer(question._id, key)
              }
              disabled={isPractice && feedbackShown}
              activeOpacity={0.75}
            >
              <View style={[styles.optionKey, keyStyle]}>
                <Text
                  style={[
                    styles.optionKeyText,
                    isSel && !feedbackShown && { color: "#fff" },
                  ]}
                >
                  {key}
                </Text>
              </View>
              <Text style={[styles.optionText, textStyle]}>
                {question.options[key]}
              </Text>
              {isPractice && feedbackShown && isCorrect && (
                <Text style={{ color: Colors.success, fontSize: 18 }}>✓</Text>
              )}
              {isPractice && feedbackShown && isSel && !isCorrect && (
                <Text style={{ color: Colors.danger, fontSize: 18 }}>✗</Text>
              )}
            </TouchableOpacity>
          );
        })}

        {/* ── Practice feedback ── */}
        {isPractice && feedbackShown && (
          <View
            style={[
              styles.feedbackCard,
              {
                borderLeftColor:
                  selected === question.correctAnswer
                    ? Colors.success
                    : Colors.danger,
              },
            ]}
          >
            <Text style={styles.feedbackTitle}>
              {selected === question.correctAnswer
                ? "✅ Correct!"
                : `❌ Correct answer: ${question.correctAnswer}`}
            </Text>
            {question.explanation ? (
              <Text style={styles.feedbackText}>{question.explanation}</Text>
            ) : (
              <Text style={styles.feedbackTextMuted}>
                No explanation available.
              </Text>
            )}
          </View>
        )}

        {/* ── Navigation ── */}
        {isPractice ? (
          <TouchableOpacity
            style={[
              styles.navBtn,
              styles.navBtnPrimary,
              !feedbackShown && styles.navBtnDisabled,
            ]}
            onPress={handlePracticeNext}
            disabled={!feedbackShown}
          >
            <Text style={styles.navBtnText}>
              {isLastQ ? "Finish →" : "Next Question →"}
            </Text>
          </TouchableOpacity>
        ) : isSpeed ? (
          <View style={styles.speedHint}>
            <Text style={styles.speedHintText}>
              ⚡ Auto-advancing in {speedTimeLeft}s
            </Text>
          </View>
        ) : (
          <View style={styles.examNav}>
            <TouchableOpacity
              style={[
                styles.navBtn,
                styles.navBtnSecondary,
                currentIndex === 0 && styles.navBtnDisabled,
              ]}
              onPress={() => dispatch(prevQuestion())}
              disabled={currentIndex === 0}
            >
              <Text style={[styles.navBtnText, { color: Colors.textPrimary }]}>
                ← Prev
              </Text>
            </TouchableOpacity>

            <Text style={styles.answeredText}>
              {answered}/{questions.length} answered
            </Text>

            {isLastQ ? (
              <TouchableOpacity
                style={[
                  styles.navBtn,
                  styles.navBtnPrimary,
                  submitting && styles.navBtnDisabled,
                ]}
                onPress={() => handleSubmit(false)}
                disabled={submitting}
              >
                <Text style={styles.navBtnText}>
                  {submitting ? "Submitting..." : "Submit ✓"}
                </Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={[styles.navBtn, styles.navBtnPrimary]}
                onPress={() => dispatch(nextQuestion())}
              >
                <Text style={styles.navBtnText}>Next →</Text>
              </TouchableOpacity>
            )}
          </View>
        )}

        {/* ── Question dots (exam mode) ── */}
        {isExam && (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.dotsScroll}
          >
            {questions.map((q, i) => {
              const isActive = i === currentIndex;
              const isAnswered = q._id in answers;
              return (
                <TouchableOpacity
                  key={q._id}
                  onPress={() => dispatch(goToQuestion(i))}
                  style={[
                    styles.dot,
                    isActive && { backgroundColor: cfg.color },
                    isAnswered &&
                      !isActive && { backgroundColor: cfg.color + "40" },
                  ]}
                >
                  <Text
                    style={[
                      styles.dotText,
                      (isActive || isAnswered) && {
                        color: isActive ? "#fff" : cfg.color,
                      },
                    ]}
                  >
                    {i + 1}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  scroll: { padding: Spacing.lg, paddingBottom: Spacing["4xl"] },
  main: { padding: Spacing.lg, paddingBottom: Spacing["5xl"] },

  // Formula sheet
  formulaHeader: { marginBottom: Spacing.lg },
  backText: { fontSize: FontSize.body, color: Colors.brand, fontWeight: "500" },
  formulaCard: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.xl,
    padding: Spacing["2xl"],
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: Spacing.lg,
    ...Shadows.sm,
  },
  formulaTitle: {
    fontSize: FontSize.heading2,
    fontWeight: "700",
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  formulaSubtitle: {
    fontSize: FontSize.bodySmall,
    color: Colors.textMuted,
    marginBottom: Spacing.lg,
  },
  tipRow: { flexDirection: "row", gap: 10, marginBottom: 10 },
  tipArrow: { fontSize: FontSize.body, color: Colors.brand, fontWeight: "700" },
  tipText: {
    fontSize: FontSize.caption,
    color: Colors.textSecondary,
    fontFamily: "monospace",
    flex: 1,
    lineHeight: 18,
  },

  startBtn: {
    backgroundColor: Colors.brand,
    height: 52,
    borderRadius: Radius.md,
    alignItems: "center",
    justifyContent: "center",
    ...Shadows.brand,
  },
  startBtnText: {
    color: "#fff",
    fontSize: FontSize.bodyLarge,
    fontWeight: "600",
  },

  // Error state
  errorState: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: Spacing["3xl"],
    gap: Spacing.md,
  },
  errorTitle: {
    fontSize: FontSize.heading2,
    fontWeight: "700",
    color: Colors.textPrimary,
  },
  errorSub: {
    fontSize: FontSize.body,
    color: Colors.textSecondary,
    textAlign: "center",
  },

  // Toast
  toast: {
    position: "absolute",
    top: 80,
    right: 16,
    zIndex: 100,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: Radius.lg,
    ...Shadows.lg,
  },
  toastText: { color: "#fff", fontWeight: "700", fontSize: FontSize.bodySmall },

  // Streak banner
  streakBanner: {
    backgroundColor: Colors.warning,
    paddingVertical: 8,
    alignItems: "center",
  },
  streakBannerText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: FontSize.bodySmall,
  },

  // Header
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    gap: 10,
    backgroundColor: Colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  exitBtn: { paddingVertical: 4, paddingHorizontal: 2 },
  exitText: {
    fontSize: FontSize.bodySmall,
    color: Colors.textSecondary,
    fontWeight: "500",
  },
  progressTrack: {
    flex: 1,
    height: 6,
    backgroundColor: Colors.surface2,
    borderRadius: Radius.full,
    overflow: "hidden",
  },
  progressFill: { height: "100%", borderRadius: Radius.full },
  qCount: { fontSize: FontSize.bodySmall, color: Colors.textSecondary },
  timer: {
    fontSize: FontSize.heading3,
    fontWeight: "700",
    fontVariant: ["tabular-nums"],
  },
  practiceScore: {
    fontSize: FontSize.bodySmall,
    color: Colors.textSecondary,
    fontWeight: "600",
  },

  speedTrack: { height: 4, backgroundColor: Colors.surface2 },
  speedFill: { height: "100%" },

  // Question
  questionCard: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.xl,
    padding: Spacing["2xl"],
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: Spacing.lg,
    ...Shadows.sm,
  },
  tagsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
    marginBottom: Spacing.md,
  },
  questionText: {
    fontSize: FontSize.bodyLarge,
    color: Colors.textPrimary,
    fontWeight: "500",
    lineHeight: 26,
  },

  // Options
  option: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
    padding: Spacing.lg,
    borderRadius: Radius.lg,
    borderWidth: 1.5,
    marginBottom: Spacing.sm,
  },
  optionDefault: {
    backgroundColor: Colors.surface,
    borderColor: Colors.border,
  },
  optionCorrect: { backgroundColor: "#D1FAE5", borderColor: Colors.success },
  optionWrong: { backgroundColor: "#FEE2E2", borderColor: Colors.danger },
  optionFaded: {
    backgroundColor: Colors.surface2,
    borderColor: Colors.border,
    opacity: 0.5,
  },
  optionKey: {
    width: 36,
    height: 36,
    borderRadius: Radius.md,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1.5,
  },
  optionKeyDefault: {
    borderColor: Colors.border,
    backgroundColor: Colors.surface2,
  },
  optionKeyCorrect: {
    borderColor: Colors.success,
    backgroundColor: Colors.success,
  },
  optionKeyWrong: {
    borderColor: Colors.danger,
    backgroundColor: Colors.danger,
  },
  optionKeyText: {
    fontSize: FontSize.body,
    fontWeight: "700",
    color: Colors.textSecondary,
  },
  optionText: { flex: 1, fontSize: FontSize.body, lineHeight: 22 },
  optionTextDefault: { color: Colors.textPrimary },
  optionTextCorrect: { color: "#065F46", fontWeight: "600" },
  optionTextWrong: { color: "#991B1B" },

  // Feedback
  feedbackCard: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    padding: Spacing.lg,
    borderLeftWidth: 4,
    marginBottom: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  feedbackTitle: {
    fontSize: FontSize.body,
    fontWeight: "700",
    color: Colors.textPrimary,
    marginBottom: 6,
  },
  feedbackText: {
    fontSize: FontSize.bodySmall,
    color: Colors.textSecondary,
    lineHeight: 20,
  },
  feedbackTextMuted: {
    fontSize: FontSize.bodySmall,
    color: Colors.textMuted,
    fontStyle: "italic",
  },

  // Navigation
  examNav: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: Spacing.lg,
  },
  navBtn: {
    height: 48,
    borderRadius: Radius.md,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  navBtnPrimary: { backgroundColor: Colors.brand, ...Shadows.brand },
  navBtnSecondary: {
    backgroundColor: Colors.surface2,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  navBtnDisabled: { opacity: 0.4 },
  navBtnText: { color: "#fff", fontWeight: "600", fontSize: FontSize.body },
  answeredText: { fontSize: FontSize.caption, color: Colors.textMuted },

  speedHint: { alignItems: "center", paddingVertical: Spacing.lg },
  speedHintText: { fontSize: FontSize.bodySmall, color: Colors.textMuted },

  // Dots
  dotsScroll: { marginTop: Spacing.md },
  dot: {
    width: 32,
    height: 32,
    borderRadius: Radius.sm,
    backgroundColor: Colors.surface2,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 6,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  dotText: {
    fontSize: FontSize.caption,
    fontWeight: "700",
    color: Colors.textMuted,
  },
});