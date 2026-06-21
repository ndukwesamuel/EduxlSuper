// // // // ─── Navigation Types ─────────────────────────────────────────────
// // // // All param lists for type-safe navigation across the app.

// // // export type RootStackParamList = {
// // //   Auth: undefined;
// // //   App: undefined;
// // // };

// // // export type AuthStackParamList = {
// // //   Login: undefined;
// // // };

// // // export type AppTabParamList = {
// // //   Home: undefined;
// // //   Learn: undefined;
// // //   Progress: undefined;
// // //   Profile: undefined;
// // // };

// // // export type BankReadyStackParamList = {
// // //   BankReadyHome: undefined;
// // //   Test: {
// // //     module: "numerical" | "verbal" | "logical" | "abstract";
// // //     mode: "exam" | "practice" | "speed";
// // //     difficulty?: "easy" | "medium" | "hard" | "mixed";
// // //     tag?: string;
// // //   };
// // //   Results: undefined;
// // //   History: {
// // //     module?: "numerical" | "verbal" | "logical" | "abstract";
// // //   };
// // // };

// // // // Combined for useNavigation typing
// // // export type AppStackParamList = {
// // //   MainTabs: undefined;
// // //   BankReady: undefined; // entry into BankReady stack
// // //   Test: BankReadyStackParamList["Test"];
// // //   Results: undefined;
// // //   History: BankReadyStackParamList["History"];
// // // };


// // // ─── Navigation Types ─────────────────────────────────────────────
// // // All param lists for type-safe navigation across the app.

// // import { DrillSessionResult } from '../api/client';

// // export type RootStackParamList = {
// //   Auth: undefined;
// //   App:  undefined;
// // };

// // export type AuthStackParamList = {
// //   Login: undefined;
// // };

// // export type AppTabParamList = {
// //   Home:     undefined;
// //   Learn:    undefined;
// //   Progress: undefined;
// //   Profile:  undefined;
// // };

// // export type BankReadyStackParamList = {
// //   BankReadyHome: undefined;
// //   Test: {
// //     module:      "numerical" | "verbal" | "logical" | "abstract";
// //     mode:        "exam" | "practice" | "speed";
// //     difficulty?: "easy" | "medium" | "hard" | "mixed";
// //     tag?:        string;
// //   };
// //   Results: undefined;
// //   History: {
// //     module?: "numerical" | "verbal" | "logical" | "abstract";
// //   };
// // };

// // // Combined for useNavigation typing
// // export type AppStackParamList = {
// //   // ── Core ──
// //   MainTabs: undefined;

// //   // ── BankReady ──
// //   BankReady: undefined;
// //   Test:      BankReadyStackParamList["Test"];
// //   Results:   undefined;
// //   History:   BankReadyStackParamList["History"];

// //   // ── DrillPad ──
// //   DrillPad:          undefined;
// //   DrillSubject:      { subjectId: string; subjectName: string };
// //   DrillAddQuestions: { subjectId: string; subjectName: string };
// //   DrillSession:      { subjectId: string; subjectName: string; mode: 'practice' | 'exam' | 'weak' };
// //   DrillResults:      { result: DrillSessionResult; subjectId: string; subjectName: string; mode: string };
// // };

// // // ─── Navigation Types ─────────────────────────────────────────────
// // // All param lists for type-safe navigation across the app.

// // export type RootStackParamList = {
// //   Auth: undefined;
// //   App: undefined;
// // };

// // export type AuthStackParamList = {
// //   Login: undefined;
// // };

// // export type AppTabParamList = {
// //   Home: undefined;
// //   Learn: undefined;
// //   Progress: undefined;
// //   Profile: undefined;
// // };

// // export type BankReadyStackParamList = {
// //   BankReadyHome: undefined;
// //   Test: {
// //     module: "numerical" | "verbal" | "logical" | "abstract";
// //     mode: "exam" | "practice" | "speed";
// //     difficulty?: "easy" | "medium" | "hard" | "mixed";
// //     tag?: string;
// //   };
// //   Results: undefined;
// //   History: {
// //     module?: "numerical" | "verbal" | "logical" | "abstract";
// //   };
// // };

// // // Combined for useNavigation typing
// // export type AppStackParamList = {
// //   MainTabs: undefined;
// //   BankReady: undefined; // entry into BankReady stack
// //   Test: BankReadyStackParamList["Test"];
// //   Results: undefined;
// //   History: BankReadyStackParamList["History"];
// // };


// // ─── Navigation Types ─────────────────────────────────────────────
// // All param lists for type-safe navigation across the app.

// import { DrillSessionResult } from '../api/client';

// export type RootStackParamList = {
//   Auth: undefined;
//   App:  undefined;
// };

// export type AuthStackParamList = {
//   Login: undefined;
// };

// export type AppTabParamList = {
//   Home:     undefined;
//   Learn:    undefined;
//   Progress: undefined;
//   Profile:  undefined;
// };

// export type BankReadyStackParamList = {
//   BankReadyHome: undefined;
//   Test: {
//     module:      "numerical" | "verbal" | "logical" | "abstract";
//     mode:        "exam" | "practice" | "speed";
//     difficulty?: "easy" | "medium" | "hard" | "mixed";
//     tag?:        string;
//   };
//   Results: undefined;
//   History: {
//     module?: "numerical" | "verbal" | "logical" | "abstract";
//   };
// };

// // Combined for useNavigation typing
// export type AppStackParamList = {
//   // ── Core ──
//   MainTabs: undefined;

//   // ── BankReady ──
//   BankReady: undefined;
//   Test:      BankReadyStackParamList["Test"];
//   Results:   undefined;
//   History:   BankReadyStackParamList["History"];

//   // ── DrillPad ──
//   DrillPad:          undefined;
//   DrillSubject:      { subjectId: string; subjectName: string };
//   DrillAddQuestions: { subjectId: string; subjectName: string };
//   DrillSession:      { subjectId: string; subjectName: string; mode: 'practice' | 'exam' | 'weak' };
//   DrillResults:      { result: DrillSessionResult; subjectId: string; subjectName: string; mode: string };
//   Flashcard:         { subjectId: string; subjectName: string };
//   // ─── ADD THIS LINE to AppStackParamList in navigation/types.ts ─────
// // (place near the Flashcard line)

//   AILesson:          { subjectId: string; subjectName: string };
//   // ─── ADD TO AppStackParamList in navigation/types.ts ───────────────
// // (place near AILesson line)

//   PodcastPlayer:     { podcastId: string; subjectName: string };
// };


// ─── navigation/types.ts ─────────────────────────────────────────
// Full replacement — adds all Shell routes to AppStackParamList

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
    module:      'numerical' | 'verbal' | 'logical' | 'abstract';
    mode:        'exam' | 'practice' | 'speed';
    difficulty?: 'easy' | 'medium' | 'hard' | 'mixed';
    tag?:        string;
  };
  Results: undefined;
  History: { module?: 'numerical' | 'verbal' | 'logical' | 'abstract' };
};

export type AppStackParamList = {
  // ── Core ──────────────────────────────────────────────────────────
  MainTabs: undefined;

  // ── BankReady ─────────────────────────────────────────────────────
  BankReady: undefined;
  Test:      BankReadyStackParamList['Test'];
  Results:   undefined;
  History:   BankReadyStackParamList['History'];

  // ── DrillPad ──────────────────────────────────────────────────────
  DrillPad:          undefined;
  DrillSubject:      { subjectId: string; subjectName: string };
  DrillAddQuestions: { subjectId: string; subjectName: string };
  DrillSession:      { subjectId: string; subjectName: string; mode: 'practice' | 'exam' | 'weak' };
  DrillResults:      { result: DrillSessionResult; subjectId: string; subjectName: string; mode: string };
  Flashcard:         { subjectId: string; subjectName: string };
  AILesson:          { subjectId: string; subjectName: string };
  PodcastPlayer:     { podcastId: string; subjectName: string };

  // ── Company Prep Tracks ───────────────────────────────────────────
  CompanyTracks:     undefined;   // entry hub listing all company tracks

  // ── Shell Track ───────────────────────────────────────────────────
  ShellTrackHome:          undefined;
  ShellModeSelector:       undefined;
  ShellCVGate:             undefined;

  // Practice screens
  ShellPracticeNumerical:  undefined;
  ShellPracticeVerbal:     undefined;
  ShellPracticeAbstract:   undefined;
  ShellPracticeBehavioral: undefined;
  ShellPracticeVideo:      undefined;

  // Exam simulation screens
  ShellExamHub:            undefined;
  ShellExamCognitive:      undefined;
  ShellExamBehavioral:     undefined;
  ShellExamVideo:          undefined;

  // Results + later stages
  ShellResults:            { cogScore: number; behavScore: number; videoScore: number };
  ShellCaseStudy:          undefined;
  ShellConnect:            undefined;
  ShellProgress:           undefined;


  // ─── ADD to AppStackParamList in navigation/types.ts ──────────────
// Place near the AILesson / PodcastPlayer lines (DrillPad section)

  WhiteboardLibrary: { subjectId: string; subjectName: string };
  WhiteboardCreate:  { subjectId: string; subjectName: string };
  WhiteboardGenerating: {
    subjectId:   string;
    subjectName: string;
    topic:       string;
    style:       'notebook' | 'card' | 'sketch' | 'chalk' | 'minimal';
    mode:        'topic' | 'file';
  };
  WhiteboardPlayer: {
    videoId:     string;
    subjectId?:  string;
    subjectName?:string;
    topic?:      string;
    style?:      string;
  };
};

