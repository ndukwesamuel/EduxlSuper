

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';

import type {
  RootStackParamList,
  AppStackParamList,
  AuthStackParamList,
} from './types';

// ── Auth ──────────────────────────────────────────────────────────
import LoginScreen from '../screens/auth/LoginScreen';

// ── Core tabs ─────────────────────────────────────────────────────
import BottomTabNavigator from './BottomTabNavigator';

// ── BankReady ─────────────────────────────────────────────────────
import BankReadyHomeScreen from '../screens/bankready/BankReadyHomeScreen';
import TestScreen          from '../screens/bankready/TestScreen';
import ResultsScreen       from '../screens/bankready/ResultsScreen';
import HistoryScreen       from '../screens/bankready/HistoryScreen';

// ── DrillPad ──────────────────────────────────────────────────────
import DrillPadHomeScreen      from '../screens/drillpad/DrillPadHomeScreen';
import DrillSubjectScreen      from '../screens/drillpad/DrillSubjectScreen';
import DrillAddQuestionsScreen from '../screens/drillpad/DrillAddQuestionsScreen';
import DrillSessionScreen      from '../screens/drillpad/DrillSessionScreen';
import DrillResultsScreen      from '../screens/drillpad/DrillResultsScreen';
import FlashcardScreen         from '../screens/drillpad/FlashcardScreen';
import AILessonScreen          from '../screens/drillpad/AILessonScreen';
import PodcastPlayerScreen     from '../screens/drillpad/Podcastplayerscreen';

// ── Company Tracks hub ────────────────────────────────────────────
// import CompanyTracksScreen from '../screens/tracks/CompanyTracksScreen';

// ── Shell Track ───────────────────────────────────────────────────
import ShellTrackHomeScreen          from '../screens/shell/ShellTrackHomeScreen';
import ShellModeSelectorScreen       from '../screens/shell/ShellModeSelectorScreen';
import ShellCVGateScreen             from '../screens/shell/ShellCVGateScreen';

// Practice
import ShellPracticeNumericalScreen  from '../screens/shell/ShellPracticeNumericalScreen';
import ShellPracticeVerbalScreen     from '../screens/shell/ShellPracticeVerbalScreen';
import ShellPracticeAbstractScreen   from '../screens/shell/ShellPracticeAbstractScreen';
import CompanyTracksScreen from '../screens/home/Companytracksscreen';
import ShellPracticeBehavioralScreen from '../screens/shell/ShellPracticeBehavioralScreen';
import ShellPracticeVideoScreen      from '../screens/shell/ShellPracticeVideoScreen';

// Exam simulation
import ShellExamHubScreen            from '../screens/shell/ShellExamHubScreen';
import ShellExamCognitiveScreen      from '../screens/shell/ShellExamCognitiveScreen';
import ShellExamBehavioralScreen     from '../screens/shell/ShellExamBehavioralScreen';
import ShellExamVideoScreen          from '../screens/shell/ShellExamVideoScreen';

// Results + later stages
import ShellResultsScreen            from '../screens/shell/ShellResultsScreen';
import ShellCaseStudyScreen          from '../screens/shell/ShellCaseStudyScreen';
import ShellConnectScreen            from '../screens/shell/ShellConnectScreen';
import ShellProgressScreen           from '../screens/shell/ShellProgressScreen';

// ─────────────────────────────────────────────────────────────────
const RootStack = createNativeStackNavigator<RootStackParamList>();
const AuthStack = createNativeStackNavigator<AuthStackParamList>();
const AppStack  = createNativeStackNavigator<AppStackParamList>();

function AuthNavigator() {
  return (
    <AuthStack.Navigator screenOptions={{ headerShown: false }}>
      <AuthStack.Screen name="Login" component={LoginScreen} />
    </AuthStack.Navigator>
  );
}

function AppNavigator() {
  return (
    <AppStack.Navigator screenOptions={{ headerShown: false }}>

      {/* ── Core ── */}
      <AppStack.Screen name="MainTabs" component={BottomTabNavigator} />

      {/* ── BankReady ── */}
      <AppStack.Screen name="BankReady" component={BankReadyHomeScreen} />
      <AppStack.Screen name="Test"      component={TestScreen} />
      <AppStack.Screen name="Results"   component={ResultsScreen} />
      <AppStack.Screen name="History"   component={HistoryScreen} />

      {/* ── DrillPad ── */}
      <AppStack.Screen name="DrillPad"          component={DrillPadHomeScreen} />
      <AppStack.Screen name="DrillSubject"      component={DrillSubjectScreen} />
      <AppStack.Screen name="DrillAddQuestions" component={DrillAddQuestionsScreen} />
      <AppStack.Screen name="DrillSession"      component={DrillSessionScreen}  options={{ gestureEnabled: false }} />
      <AppStack.Screen name="DrillResults"      component={DrillResultsScreen}  options={{ gestureEnabled: false }} />
      <AppStack.Screen name="Flashcard"         component={FlashcardScreen}     options={{ gestureEnabled: false }} />
      <AppStack.Screen name="AILesson"          component={AILessonScreen}      options={{ gestureEnabled: false }} />
      <AppStack.Screen name="PodcastPlayer"     component={PodcastPlayerScreen} options={{ gestureEnabled: false }} />

      {/* ── Company Tracks hub ── */}
      <AppStack.Screen name="CompanyTracks" component={CompanyTracksScreen} />

      {/* ── Shell Track overview ── */}
      <AppStack.Screen name="ShellTrackHome"    component={ShellTrackHomeScreen} />
      <AppStack.Screen name="ShellModeSelector" component={ShellModeSelectorScreen} />
      <AppStack.Screen name="ShellCVGate"       component={ShellCVGateScreen} />

      {/* ── Shell Practice ── */}
      <AppStack.Screen name="ShellPracticeNumerical"  component={ShellPracticeNumericalScreen}  options={{ gestureEnabled: false }} />
      <AppStack.Screen name="ShellPracticeVerbal"     component={ShellPracticeVerbalScreen}     options={{ gestureEnabled: false }} />
      <AppStack.Screen name="ShellPracticeAbstract"   component={ShellPracticeAbstractScreen}   options={{ gestureEnabled: false }} />
      <AppStack.Screen name="ShellPracticeBehavioral" component={ShellPracticeBehavioralScreen} options={{ gestureEnabled: false }} />
      <AppStack.Screen name="ShellPracticeVideo"      component={ShellPracticeVideoScreen}      options={{ gestureEnabled: false }} />

      {/* ── Shell Exam Simulation ── */}
      <AppStack.Screen name="ShellExamHub"       component={ShellExamHubScreen}       />
      <AppStack.Screen name="ShellExamCognitive" component={ShellExamCognitiveScreen} options={{ gestureEnabled: false }} />
      <AppStack.Screen name="ShellExamBehavioral"component={ShellExamBehavioralScreen}options={{ gestureEnabled: false }} />
      <AppStack.Screen name="ShellExamVideo"     component={ShellExamVideoScreen}     options={{ gestureEnabled: false }} />

      {/* ── Shell Results + later stages ── */}
      <AppStack.Screen name="ShellResults"   component={ShellResultsScreen}   options={{ gestureEnabled: false }} />
      <AppStack.Screen name="ShellCaseStudy" component={ShellCaseStudyScreen} />
      <AppStack.Screen name="ShellConnect"   component={ShellConnectScreen}   />
      <AppStack.Screen name="ShellProgress"  component={ShellProgressScreen}  />

    </AppStack.Navigator>
  );
}

export default function RootNavigator() {
  const user = useSelector((s: RootState) => s.auth.user);
  return (
    <NavigationContainer>
      <RootStack.Navigator screenOptions={{ headerShown: false, animation: 'fade' }}>
        {user ? (
          <RootStack.Screen name="App"  component={AppNavigator}  />
        ) : (
          <RootStack.Screen name="Auth" component={AuthNavigator} />
        )}
      </RootStack.Navigator>
    </NavigationContainer>
  );
}