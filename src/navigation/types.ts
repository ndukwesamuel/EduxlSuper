// // ─── Navigation Types ─────────────────────────────────────────────
// // All param lists for type-safe navigation across the app.

// export type RootStackParamList = {
//   Auth: undefined;
//   App: undefined;
// };

// export type AuthStackParamList = {
//   Login: undefined;
// };

// export type AppTabParamList = {
//   Home: undefined;
//   Learn: undefined;
//   Progress: undefined;
//   Profile: undefined;
// };

// export type BankReadyStackParamList = {
//   BankReadyHome: undefined;
//   Test: {
//     module: "numerical" | "verbal" | "logical" | "abstract";
//     mode: "exam" | "practice" | "speed";
//     difficulty?: "easy" | "medium" | "hard" | "mixed";
//     tag?: string;
//   };
//   Results: undefined;
//   History: {
//     module?: "numerical" | "verbal" | "logical" | "abstract";
//   };
// };

// // Combined for useNavigation typing
// export type AppStackParamList = {
//   MainTabs: undefined;
//   BankReady: undefined; // entry into BankReady stack
//   Test: BankReadyStackParamList["Test"];
//   Results: undefined;
//   History: BankReadyStackParamList["History"];
// };


// ─── Navigation Types ─────────────────────────────────────────────
// All param lists for type-safe navigation across the app.

import { DrillSessionResult } from '../api/client';

export type RootStackParamList = {
  Auth: undefined;
  App:  undefined;
};

export type AuthStackParamList = {
  Login: undefined;
};

export type AppTabParamList = {
  Home:     undefined;
  Learn:    undefined;
  Progress: undefined;
  Profile:  undefined;
};

export type BankReadyStackParamList = {
  BankReadyHome: undefined;
  Test: {
    module:      "numerical" | "verbal" | "logical" | "abstract";
    mode:        "exam" | "practice" | "speed";
    difficulty?: "easy" | "medium" | "hard" | "mixed";
    tag?:        string;
  };
  Results: undefined;
  History: {
    module?: "numerical" | "verbal" | "logical" | "abstract";
  };
};

// Combined for useNavigation typing
export type AppStackParamList = {
  // ── Core ──
  MainTabs: undefined;

  // ── BankReady ──
  BankReady: undefined;
  Test:      BankReadyStackParamList["Test"];
  Results:   undefined;
  History:   BankReadyStackParamList["History"];

  // ── DrillPad ──
  DrillPad:          undefined;
  DrillSubject:      { subjectId: string; subjectName: string };
  DrillAddQuestions: { subjectId: string; subjectName: string };
  DrillSession:      { subjectId: string; subjectName: string; mode: 'practice' | 'exam' | 'weak' };
  DrillResults:      { result: DrillSessionResult; subjectId: string; subjectName: string; mode: string };
};