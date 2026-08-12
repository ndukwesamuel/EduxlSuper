

import { DrillSessionResult } from  "../../config/client"  //'../api/client';

export type RootStackParamList = {
  Auth: undefined;
  App:  undefined;
};

export type AuthStackParamList = {
  Login: undefined;
  ForgotPassword: undefined;
ResetPassword:  { email: string };
SubjectMaterials: { subjectId: string; subjectName: string };
};

export type AppTabParamList = {
  Home:     undefined;
  LearnPad:    undefined;
  Progress: undefined;
  Profile:  undefined;
  Graduate:  undefined;
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
  CompanyTrackHome:undefined;  // ← add this line

  // CompanyTrackHome: { companyId: string };
AptitudeTestStage: { companyId: string; stageType: string; stageName: string };
CompanyTestResults: {
  result: any;
  wrongAnswerDetails: any[];
  progress?: any;
  companyId: string;
  stageName: string;
};
CompanyHistory: { companyId: string };

  SubjectChat: { subjectId: string; subjectName: string; documentCount?: number; fileCount?: number; linkCount?: number };
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

  SubjectMaterials: { subjectId: string; subjectName: string };

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

  // ── AI File/Link Quiz ─────────────────────────────────────────────
  AiQuizSetup: undefined;
  AiQuizSession: { questions: any[] };
  AiQuizResults: { score: number; results: any[]; total: number };
};




