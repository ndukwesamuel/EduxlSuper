// ─── drillpad.client.ts ───────────────────────────────────────────
// Add these to your existing src/api/client.ts

// ── Types ─────────────────────────────────────────────────────────

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

// ── Subject APIs ───────────────────────────────────────────────────

export const createSubject = (name: string, description?: string): Promise<DrillSubject> =>
  api.post<{ success: boolean; data: DrillSubject }>('/drillpad/subjects', { name, description }).then(unwrap);

export const getSubjects = (): Promise<DrillSubject[]> =>
  api.get<{ success: boolean; data: DrillSubject[] }>('/drillpad/subjects').then(unwrap);

export const getSubject = (subjectId: string): Promise<DrillSubject & { sessions: DrillSessionHistory[]; avgScore: number; bestScore: number; weakCount: number }> =>
  api.get<{ success: boolean; data: any }>(`/drillpad/subjects/${subjectId}`).then(unwrap);

export const updateSubject = (subjectId: string, name: string, description?: string): Promise<DrillSubject> =>
  api.put<{ success: boolean; data: DrillSubject }>(`/drillpad/subjects/${subjectId}`, { name, description }).then(unwrap);

export const deleteSubject = (subjectId: string): Promise<void> =>
  api.delete(`/drillpad/subjects/${subjectId}`).then(() => undefined);

// ── Question APIs ─────────────────────────────────────────────────

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

export const deleteQuestion = (questionId: string): Promise<void> =>
  api.delete(`/drillpad/questions/${questionId}`).then(() => undefined);

// ── Session APIs ──────────────────────────────────────────────────

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
