

// ─── CareerClarity API Client ─────────────────────────────────────
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
} from "../src/store/testSlice" //"../store/testSlice";

const BASE_URL =  "https://eduxl2-production.up.railway.app/api/v1"  //"https://foreverlove-mroh.onrender.com/api/v1";
// const BASE_URL = "http://localhost:7070/api/v1";

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 15_000,
  headers: { "Content-Type": "application/json" },
});

// ── Token injection ───────────────────────────────────────────────
let _getToken: (() => string | null) | null = null;
export const setTokenGetter = (fn: () => string | null) => {
  _getToken = fn;
};

api.interceptors.request.use((config) => {
  const token = _getToken?.();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// ── Logger ────────────────────────────────────────────────────────
api.interceptors.request.use(
  (config) => {
    const method = config.method?.toUpperCase() ?? "?";
    const url    = (config.baseURL ?? "") + (config.url ?? "");
    const params = config.params ? "?" + new URLSearchParams(config.params).toString() : "";
    console.log(`\n╔══ 📤 REQUEST\n║  ${method} ${url}${params}`);
    if (config.data) console.log("║  Body:", JSON.stringify(config.data, null, 2));
    console.log("╚════════════════════════════════════════\n");
    return config;
  },
  (error) => { console.error("REQUEST ERROR", error.message); return Promise.reject(error); },
);

api.interceptors.response.use(
  (response) => {
    const method = response.config.method?.toUpperCase() ?? "?";
    const url    = (response.config.baseURL ?? "") + (response.config.url ?? "");
    console.log(`\n╔══ 📥 RESPONSE\n║  ${method} ${url}\n║  Status: ${response.status}`);
    console.log("║  Body:", JSON.stringify(response.data, null, 2));
    console.log("╚════════════════════════════════════════\n");
    return response;
  },
  // (error) => {
  //   const method = error.config?.method?.toUpperCase() ?? "?";
  //   const url    = (error.config?.baseURL ?? "") + (error.config?.url ?? "");
  //   console.error(`\n╔══ ❌ RESPONSE ERROR\n║  ${method} ${url}`);
  //   if (error.response) {
  //     console.error(`║  Status: ${error.response.status}`);
  //     console.error("║  Body:", JSON.stringify(error.response.data, null, 2));
  //   } else {
  //     console.error(`║  Message: ${error.message}`);
  //   }
  //   console.error("╚════════════════════════════════════════\n");
  //   return Promise.reject(error);
  // },

  (error) => {
    const method = error.config?.method?.toUpperCase() ?? "?";
    const url    = (error.config?.baseURL ?? "") + (error.config?.url ?? "");
    console.error(`\n╔══ ❌ RESPONSE ERROR\n║  ${method} ${url}`);
    if (error.response) {
      console.error(`║  Status: ${error.response.status}`);
      console.error("║  Body:", JSON.stringify(error.response.data, null, 2));
    } else {
      console.error(`║  Message: ${error.message}`);
    }
    console.error("╚════════════════════════════════════════\n");

    // Auto-logout on 401
    if (error.response?.status === 401) {
      // const { store } = require("./src/store/store");
      // const { clearUser } = require("./src/store/authSlice");

      const { store } = require("../src/store/store");
const { clearUser } = require("../src/store/authSlice");
      store.dispatch(clearUser());
    }

    return Promise.reject(error);
  },
);

// ── Unwrapper ─────────────────────────────────────────────────────
function unwrap<T>(r: { data: { success: boolean; data: T } }): T {
  return r.data.data;
}

// ── Auth  →  /api/v1/auth/* ───────────────────────────────────────
export interface AuthResponse {
  token: string;
  user: { _id: string; name: string; email: string };
}

export const loginUser = (email: string, password: string): Promise<AuthResponse> =>
  api.post<{ success: boolean; data: AuthResponse }>("/auth/login", { email, password }).then(unwrap);

export const registerUser = (name: string, email: string, password: string): Promise<AuthResponse> =>
  api.post<{ success: boolean; data: AuthResponse }>("/auth/register", { name, email, password }).then(unwrap);

// ── Questions  →  /api/v1/bankready/questions ─────────────────────
export interface QuestionsResponse {
  questions: Question[];
  total:     number;
}

export const fetchQuestions = (
  module:     ModuleCategory = "numerical",
  limit       = 10,
  difficulty?: Difficulty | "mixed",
  tag?:        string,
  mode?:       TestMode,
): Promise<QuestionsResponse> => {
  const params: Record<string, string | number> = { type: module, limit };
  if (difficulty && difficulty !== "mixed") params.difficulty = difficulty;
  if (tag)  params.tag  = tag;
  if (mode) params.mode = mode;
  return api
    .get<{ success: boolean; data: QuestionsResponse }>("/bankready/questions", { params })
    .then(unwrap);
};

// ── Submit test  →  /api/v1/bankready/submit ──────────────────────
export interface SubmitTestResponse {
  result:             TestResultSummary;
  wrongAnswerDetails: WrongAnswerDetail[];
  progress?:          ProgressUpdate;
}

export const submitTest = (
  answers:   { questionId: string; selectedOption: OptionKey }[],
  timeTaken: number,
  module:    ModuleCategory = "numerical",
  mode:      TestMode = "exam",
): Promise<SubmitTestResponse> =>
  api
    .post<{ success: boolean; data: SubmitTestResponse }>("/bankready/submit", {
      answers, timeTaken, module, mode,
    })
    .then(unwrap);

// ── History  →  /api/v1/bankready/history ────────────────────────
export interface HistoryAttempt {
  attemptNumber: number;
  _id:           string;
  module:        ModuleCategory;
  score:         number;
  totalQuestions:number;
  accuracy:      number;
  timeTaken:     number;
  weakAreas:     string[];
  createdAt:     string;
}
export interface HistoryResponse {
  userId:        string;
  module:        string;
  totalAttempts: number;
  trend: {
    firstAttemptAccuracy:  number;
    latestAttemptAccuracy: number;
    change:                number;
    improving:             boolean;
  } | null;
  history: HistoryAttempt[];
}

export const fetchHistory = (module: ModuleCategory | null = null): Promise<HistoryResponse> =>
  api
    .get<{ success: boolean; data: HistoryResponse }>("/bankready/history", {
      params: module ? { module } : {},
    })
    .then(unwrap);

// ── Progress  →  /api/v1/progress ────────────────────────────────
export interface Badge {
  id:   string;
  name: string;
  icon: string;
  desc: string;
}
export interface UserProgress {
  userId:                string;
  xp:                    number;
  streak:                number;
  streakFreezeAvailable: boolean;
  badges:                Badge[];
  lastPracticeDate:      string;
  allBadges:             Badge[];
}

export const fetchProgress = async (): Promise<UserProgress | null> => {
  try {
    return await api
      .get<{ success: boolean; data: UserProgress }>("/progress")
      .then(unwrap);
  } catch (e: any) {
    if (e?.response?.status === 404) return null;
    throw e;
  }
};

export const applyStreakFreeze = (): Promise<{ message: string; streak: number }> =>
  api.post("/progress/freeze").then((r) => r.data);










// ── DrillPad Types ────────────────────────────────────────────────
export interface DrillSubject {
  _id: string;
  name: string;
  description?: string;
  totalQuestions: number;
  lastScore: number | null;
  bestScore: number | null;
  weakCount: number;
  updatedAt: string;
}

export interface DrillOption {
  label: string;
  text: string;
}

export interface DrillQuestion {
  _id: string;
  question: string;
  options: DrillOption[];
  correctOption: string;
  explanation?: string;
  isWeak: boolean;
  isStarred: boolean;
  isTooEasy: boolean;
}

export interface DrillSessionResult {
  sessionId: string;
  score: number;
  correctCount: number;
  totalQuestions: number;
  durationSeconds: number;
  wrongQuestions: {
    questionId: string;
    question: string;
    correctOption: string;
    selectedOption: string;
    explanation?: string;
  }[];
}

export interface DrillSessionHistory {
  _id: string;
  score: number;
  mode: string;
  totalQuestions: number;
  correctCount: number;
  completedAt: string;
}

export interface DrillStats {
  avgScore: number;
  bestScore: number;
  totalSessions: number;
  scores: { score: number; date: string; mode: string }[];
}

// ── DrillPad Subject APIs ─────────────────────────────────────────
export const createSubject = (name: string, description?: string): Promise<DrillSubject> =>
  api.post<{ success: boolean; data: DrillSubject }>('/drillpad/subjects', { name, description }).then(unwrap);

export const getSubjects = (): Promise<DrillSubject[]> =>
  api.get<{ success: boolean; data: DrillSubject[] }>('/drillpad/subjects').then(unwrap);

export const getSubject = (subjectId: string): Promise<any> =>
  api.get<{ success: boolean; data: any }>(`/drillpad/subjects/${subjectId}`).then(unwrap);

export const updateSubject = (subjectId: string, name: string, description?: string): Promise<DrillSubject> =>
  api.put<{ success: boolean; data: DrillSubject }>(`/drillpad/subjects/${subjectId}`, { name, description }).then(unwrap);

export const deleteSubject = (subjectId: string): Promise<void> =>
  api.delete(`/drillpad/subjects/${subjectId}`).then(() => undefined);

// ── DrillPad Question APIs ────────────────────────────────────────
export const addBulkQuestions = (
  subjectId: string,
  questions: { question: string; options: DrillOption[]; correctOption: string; explanation?: string }[]
): Promise<{ added: number; total: number }> =>
  api.post<{ success: boolean; data: any }>(`/drillpad/subjects/${subjectId}/questions/bulk`, { questions }).then(unwrap);

export const addSingleQuestion = (
  subjectId: string,
  question: string,
  options: DrillOption[],
  correctOption: string,
  explanation?: string
): Promise<DrillQuestion> =>
  api.post<{ success: boolean; data: DrillQuestion }>(`/drillpad/subjects/${subjectId}/questions`, {
    question, options, correctOption, explanation,
  }).then(unwrap);

export const getDrillQuestions = (
  subjectId: string,
  pool: 'all' | 'weak' | 'starred' = 'all',
  limit = 10,
  shuffle = true
): Promise<DrillQuestion[]> =>
  api.get<{ success: boolean; data: DrillQuestion[] }>(`/drillpad/subjects/${subjectId}/questions`, {
    params: { pool, limit, shuffle },
  }).then(unwrap);

export const flagQuestion = (
  questionId: string,
  flag: 'isStarred' | 'isTooEasy',
  value: boolean
): Promise<DrillQuestion> =>
  api.patch<{ success: boolean; data: DrillQuestion }>(`/drillpad/questions/${questionId}/flag`, { flag, value }).then(unwrap);

export const deleteDrillQuestion = (questionId: string): Promise<void> =>
  api.delete(`/drillpad/questions/${questionId}`).then(() => undefined);

// ── DrillPad Session APIs ─────────────────────────────────────────
export const submitDrillSession = (
  subjectId: string,
  mode: 'practice' | 'exam' | 'weak',
  answers: { questionId: string; selectedOption: string }[],
  durationSeconds: number
): Promise<DrillSessionResult> =>
  api.post<{ success: boolean; data: DrillSessionResult }>(`/drillpad/subjects/${subjectId}/sessions`, {
    mode, answers, durationSeconds,
  }).then(unwrap);

export const getDrillHistory = (subjectId: string): Promise<DrillSessionHistory[]> =>
  api.get<{ success: boolean; data: DrillSessionHistory[] }>(`/drillpad/subjects/${subjectId}/sessions`).then(unwrap);

export const getDrillStats = (subjectId: string): Promise<DrillStats> =>
  api.get<{ success: boolean; data: DrillStats }>(`/drillpad/subjects/${subjectId}/stats`).then(unwrap);


// Client.podcast.patch · TS
// ─── ADD THESE TO config/client.ts ────────────────────────────────
 
// ── Podcast / AI Lesson types ──────────────────────────────────────
export interface SubjectPodcast {
  _id: string;
  name: string;
  podcastScript?: string;
  podcastAudioUrl?: string;
  podcastAudioPublicId?: string;
  podcastDurationSeconds?: number;
  podcastGeneratedAt?: string;
}
 
// ── Get existing podcast for a subject ─────────────────────────────
export const getSubjectPodcast = (subjectId: string): Promise<SubjectPodcast> =>
  api.get<{ success: boolean; data: SubjectPodcast }>(`/drillpad/subjects/${subjectId}/podcast`).then(unwrap);
 
// ── Generate/regenerate podcast — multipart form-data ──────────────
// formData must contain: file (PDF/image), topic (optional)
export const generateSubjectPodcast = (subjectId: string, formData: FormData): Promise<SubjectPodcast> =>
  api.post<{ success: boolean; data: SubjectPodcast }>(`/drillpad/subjects/${subjectId}/podcast`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    timeout: 60_000, // podcast generation takes 20-40s
  }).then(unwrap);
 



  // ─── ADD/REPLACE THESE IN config/client.ts ─────────────────────────

export interface Podcast {
  _id: string;
  subjectId: string | { _id: string; name: string };
  userId: string;
  title: string;
  script: string;
  audioUrl: string;
  audioPublicId: string;
  durationSeconds: number;
  createdAt: string;
  updatedAt: string;
}

// ── List all podcasts for a subject ──────────────────────────────
export const getSubjectPodcasts = (subjectId: string): Promise<Podcast[]> =>
  api.get<{ success: boolean; data: Podcast[] }>(`/drillpad/subjects/${subjectId}/podcast`).then(unwrap);

// ── Create a new podcast — multipart form-data: file, title (optional) ──
export const createSubjectPodcast = (subjectId: string, formData: FormData): Promise<Podcast> =>
  api.post<{ success: boolean; data: Podcast }>(`/drillpad/subjects/${subjectId}/podcast`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    timeout: 60_000,
  }).then(unwrap);

// ── Get a single podcast ───────────────────────────────────────────
export const getPodcast = (podcastId: string): Promise<Podcast> =>
  api.get<{ success: boolean; data: Podcast }>(`/drillpad/podcast/${podcastId}`).then(unwrap);

// ── Rename a podcast ───────────────────────────────────────────────
export const renamePodcast = (podcastId: string, title: string): Promise<Podcast> =>
  api.put<{ success: boolean; data: Podcast }>(`/drillpad/podcast/${podcastId}`, { title }).then(unwrap);

// ── Delete a podcast ───────────────────────────────────────────────
export const deletePodcast = (podcastId: string): Promise<{ deleted: boolean }> =>
  api.delete<{ success: boolean; data: { deleted: boolean } }>(`/drillpad/podcast/${podcastId}`).then(unwrap);

export default api;