import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type OptionKey      = 'A' | 'B' | 'C' | 'D';
export type ModuleCategory = 'numerical' | 'verbal' | 'logical' | 'abstract';
export type Difficulty     = 'easy' | 'medium' | 'hard';
export type TestMode       = 'exam' | 'practice' | 'speed';

export interface QuestionOptions { A: string; B: string; C: string; D: string; }

export interface Question {
  _id:           string;
  questionText:  string;
  options:       QuestionOptions;
  category:      ModuleCategory;
  tags:          string[];
  difficulty:    Difficulty;
  correctAnswer?: OptionKey;
  explanation?:   string;
}

export interface TestResultSummary {
  _id:            string;
  module:         ModuleCategory;
  score:          number;
  totalQuestions: number;
  accuracy:       number;
  timeTaken:      number;
  weakAreas:      string[];
  createdAt:      string;
}

export interface WrongAnswerDetail {
  questionId:    string;
  questionText:  string;
  yourAnswer:    OptionKey;
  correctAnswer: OptionKey;
  explanation:   string;
  tags:          string[];
}

export interface ProgressUpdate {
  xpEarned:    number;
  streak:      number;
  newBadges:   string[];
  streakBonus: boolean;
}

interface TestState {
  module:             ModuleCategory;
  questions:          Question[];
  answers:            Record<string, OptionKey>;
  currentIndex:       number;
  result:             TestResultSummary | null;
  wrongAnswerDetails: WrongAnswerDetail[];
  progress:           ProgressUpdate | null;
  startTime:          number | null;
}

const initialState: TestState = {
  module:             'numerical',
  questions:          [],
  answers:            {},
  currentIndex:       0,
  result:             null,
  wrongAnswerDetails: [],
  progress:           null,
  startTime:          null,
};

const testSlice = createSlice({
  name: 'test',
  initialState,
  reducers: {
    startTest: (state, action: PayloadAction<{ questions: Question[]; module: ModuleCategory }>) => {
      state.questions    = action.payload.questions;
      state.module       = action.payload.module;
      state.answers      = {};
      state.currentIndex = 0;
      state.result       = null;
      state.wrongAnswerDetails = [];
      state.progress     = null;
      state.startTime    = Date.now();
    },
    answerQuestion: (state, action: PayloadAction<{ questionId: string; option: OptionKey }>) => {
      state.answers[action.payload.questionId] = action.payload.option;
    },
    goToQuestion: (state, action: PayloadAction<number>) => {
      state.currentIndex = Math.max(0, Math.min(action.payload, state.questions.length - 1));
    },
    nextQuestion: (state) => {
      state.currentIndex = Math.min(state.currentIndex + 1, state.questions.length - 1);
    },
    prevQuestion: (state) => {
      state.currentIndex = Math.max(state.currentIndex - 1, 0);
    },
    saveResult: (state, action: PayloadAction<{
      result: TestResultSummary;
      wrongAnswerDetails: WrongAnswerDetail[];
      progress?: ProgressUpdate;
    }>) => {
      state.result             = action.payload.result;
      state.wrongAnswerDetails = action.payload.wrongAnswerDetails;
      state.progress           = action.payload.progress ?? null;
    },
    resetTest: (state, action: PayloadAction<ModuleCategory | undefined>) => {
      state.module             = action.payload ?? 'numerical';
      state.questions          = [];
      state.answers            = {};
      state.currentIndex       = 0;
      state.result             = null;
      state.wrongAnswerDetails = [];
      state.progress           = null;
      state.startTime          = null;
    },
  },
});

export const {
  startTest, answerQuestion, goToQuestion,
  nextQuestion, prevQuestion, saveResult, resetTest,
} = testSlice.actions;

export default testSlice.reducer;
