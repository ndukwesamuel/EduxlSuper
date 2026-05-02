// ─── CareerClarity API Client ─────────────────────────────────────
// React Native version — no import.meta.env, uses a direct base URL.
// Replace BASE_URL with your Render deployment URL.

import axios from "axios";
import type {
  ModuleCategory,
  Difficulty,
  TestMode,
  Question,
  TestResultSummary,
  WrongAnswerDetail,
  ProgressUpdate,
  OptionKey,
} from "../store/testSlice";

// ── Set your backend URL here ─────────────────────────────────────
const BASE_URL = "https://foreverlove-mroh.onrender.com/api"; //"https://your-backend.onrender.com/api";
// const BASE_URL = 'http://192.168.x.x:7070/api'; // local dev on same WiFi

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 15_000,
  headers: { "Content-Type": "application/json" },
});

// ── Auth ─────────────────────────────────────────────────────────
export interface LoginResponse {
  message: string;
  user: { _id: string; name: string; email: string };
}
export interface UsersResponse {
  users: { _id: string; name: string; email: string }[];
}

export const loginUser = (
  email: string,
  name?: string,
): Promise<LoginResponse> =>
  api.post<LoginResponse>("/auth/login", { email, name }).then((r) => r.data);

export const listUsers = (): Promise<UsersResponse> =>
  api.get<UsersResponse>("/auth/users").then((r) => r.data);

// ── Questions ─────────────────────────────────────────────────────
export interface QuestionsResponse {
  questions: Question[];
  total: number;
}

export const fetchQuestions = (
  module: ModuleCategory = "numerical",
  limit = 10,
  difficulty?: Difficulty | "mixed",
  tag?: string,
  mode?: TestMode,
): Promise<QuestionsResponse> => {
  const params: Record<string, string | number> = { type: module, limit };
  if (difficulty && difficulty !== "mixed") params.difficulty = difficulty;
  if (tag) params.tag = tag;
  if (mode) params.mode = mode;
  return api
    .get<QuestionsResponse>("/questions", { params })
    .then((r) => r.data);
};

// ── Submit test ───────────────────────────────────────────────────
export interface SubmitTestResponse {
  message: string;
  result: TestResultSummary;
  wrongAnswerDetails: WrongAnswerDetail[];
  progress: ProgressUpdate;
}

export const submitTest = (
  userId: string,
  answers: { questionId: string; selectedOption: OptionKey }[],
  timeTaken: number,
  module: ModuleCategory = "numerical",
  mode: TestMode = "exam",
): Promise<SubmitTestResponse> =>
  api
    .post<SubmitTestResponse>("/submit-test", {
      userId,
      answers,
      timeTaken,
      module,
      mode,
    })
    .then((r) => r.data);

// ── History ───────────────────────────────────────────────────────
export interface HistoryAttempt {
  attemptNumber: number;
  _id: string;
  module: ModuleCategory;
  score: number;
  totalQuestions: number;
  accuracy: number;
  timeTaken: number;
  weakAreas: string[];
  createdAt: string;
}
export interface HistoryResponse {
  userId: string;
  module: string;
  totalAttempts: number;
  trend: {
    firstAttemptAccuracy: number;
    latestAttemptAccuracy: number;
    change: number;
    improving: boolean;
  } | null;
  history: HistoryAttempt[];
}

export const fetchHistory = (
  userId: string,
  module: ModuleCategory | null = null,
): Promise<HistoryResponse> =>
  api
    .get<HistoryResponse>(`/history/${userId}`, {
      params: module ? { module } : {},
    })
    .then((r) => r.data);

// ── Progress / XP / Streak ────────────────────────────────────────
export interface Badge {
  id: string;
  name: string;
  icon: string;
  desc: string;
}
export interface UserProgress {
  userId: string;
  xp: number;
  streak: number;
  streakFreezeAvailable: boolean;
  badges: Badge[];
  lastPracticeDate: string;
  allBadges: Badge[];
}

export const fetchProgress = (userId: string): Promise<UserProgress> =>
  api.get<UserProgress>(`/progress/${userId}`).then((r) => r.data);

export const applyStreakFreeze = (
  userId: string,
): Promise<{ message: string; streak: number }> =>
  api.post("/progress/freeze", { userId }).then((r) => r.data);

export default api;
