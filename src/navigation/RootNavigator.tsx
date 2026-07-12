

// import React from 'react';
// import { NavigationContainer } from '@react-navigation/native';
// import { createNativeStackNavigator } from '@react-navigation/native-stack';
// import { useSelector } from 'react-redux';
// import { RootState } from '../store/store';




// import type {
//   RootStackParamList,
//   AppStackParamList,
//   AuthStackParamList,
// } from './types';

// // ── Auth ──────────────────────────────────────────────────────────
// import LoginScreen from '../screens/auth/LoginScreen';

// // ── Core tabs ─────────────────────────────────────────────────────
// import BottomTabNavigator from './BottomTabNavigator';

// // ── BankReady ─────────────────────────────────────────────────────
// import BankReadyHomeScreen from '../screens/bankready/BankReadyHomeScreen';
// import TestScreen          from '../screens/bankready/TestScreen';
// import ResultsScreen       from '../screens/bankready/ResultsScreen';
// import HistoryScreen       from '../screens/bankready/HistoryScreen';

// // ── DrillPad ──────────────────────────────────────────────────────
// import DrillPadHomeScreen      from '../screens/drillpad/DrillPadHomeScreen';
// import DrillSubjectScreen      from '../screens/drillpad/DrillSubjectScreen';
// import DrillAddQuestionsScreen from '../screens/drillpad/DrillAddQuestionsScreen';
// import DrillSessionScreen      from '../screens/drillpad/DrillSessionScreen';
// import DrillResultsScreen      from '../screens/drillpad/DrillResultsScreen';
// import FlashcardScreen         from '../screens/drillpad/FlashcardScreen';
// import AILessonScreen          from '../screens/drillpad/AILessonScreen';
// import PodcastPlayerScreen     from '../screens/drillpad/Podcastplayerscreen';

// // ── Company Tracks hub ────────────────────────────────────────────
// // import CompanyTracksScreen from '../screens/tracks/CompanyTracksScreen';

// // ── Shell Track ───────────────────────────────────────────────────
// import ShellTrackHomeScreen          from '../screens/shell/ShellTrackHomeScreen';
// import ShellModeSelectorScreen       from '../screens/shell/ShellModeSelectorScreen';
// import ShellCVGateScreen             from '../screens/shell/ShellCVGateScreen';

// // Practice
// import ShellPracticeNumericalScreen  from '../screens/shell/ShellPracticeNumericalScreen';
// import ShellPracticeVerbalScreen     from '../screens/shell/ShellPracticeVerbalScreen';
// import ShellPracticeAbstractScreen   from '../screens/shell/ShellPracticeAbstractScreen';
// import CompanyTracksScreen from '../screens/home/Companytracksscreen';
// import ShellPracticeBehavioralScreen from '../screens/shell/ShellPracticeBehavioralScreen';
// import ShellPracticeVideoScreen      from '../screens/shell/ShellPracticeVideoScreen';

// // Exam simulation
// import ShellExamHubScreen            from '../screens/shell/ShellExamHubScreen';
// import ShellExamCognitiveScreen      from '../screens/shell/ShellExamCognitiveScreen';
// import ShellExamBehavioralScreen     from '../screens/shell/ShellExamBehavioralScreen';
// import ShellExamVideoScreen          from '../screens/shell/ShellExamVideoScreen';

// // Results + later stages
// import ShellResultsScreen            from '../screens/shell/ShellResultsScreen';
// import ShellCaseStudyScreen          from '../screens/shell/ShellCaseStudyScreen';
// import ShellConnectScreen            from '../screens/shell/ShellConnectScreen';
// import ShellProgressScreen           from '../screens/shell/ShellProgressScreen';
// import WhiteboardLibraryScreen from '../screens/drillpad/WhiteboardLibraryScreen';
// import WhiteboardCreateScreen from '../screens/drillpad/WhiteboardCreateScreen';
// import WhiteboardPlayerScreen from '../screens/drillpad/WhiteboardPlayerScreen';
// import WhiteboardGeneratingScreen from '../screens/drillpad/WhiteboardGeneratingScreen';

// // ─────────────────────────────────────────────────────────────────
// const RootStack = createNativeStackNavigator<RootStackParamList>();
// const AuthStack = createNativeStackNavigator<AuthStackParamList>();
// const AppStack  = createNativeStackNavigator<AppStackParamList>();

// function AuthNavigator() {
//   return (
//     <AuthStack.Navigator screenOptions={{ headerShown: false }}>
//       <AuthStack.Screen name="Login" component={LoginScreen} />
//     </AuthStack.Navigator>
//   );
// }

// function AppNavigator() {
//   return (
//     <AppStack.Navigator screenOptions={{ headerShown: false }}>

//       {/* ── Core ── */}
//       <AppStack.Screen name="MainTabs" component={BottomTabNavigator} />

//       {/* ── BankReady ── */}
//       <AppStack.Screen name="BankReady" component={BankReadyHomeScreen} />
//       <AppStack.Screen name="Test"      component={TestScreen} />
//       <AppStack.Screen name="Results"   component={ResultsScreen} />
//       <AppStack.Screen name="History"   component={HistoryScreen} />

//       {/* ── DrillPad ── */}
//       <AppStack.Screen name="DrillPad"          component={DrillPadHomeScreen} />
//       <AppStack.Screen name="DrillSubject"      component={DrillSubjectScreen} />
//       <AppStack.Screen name="DrillAddQuestions" component={DrillAddQuestionsScreen} />
//       <AppStack.Screen name="DrillSession"      component={DrillSessionScreen}  options={{ gestureEnabled: false }} />
//       <AppStack.Screen name="DrillResults"      component={DrillResultsScreen}  options={{ gestureEnabled: false }} />
//       <AppStack.Screen name="Flashcard"         component={FlashcardScreen}     options={{ gestureEnabled: false }} />
//       <AppStack.Screen name="AILesson"          component={AILessonScreen}      options={{ gestureEnabled: false }} />
//       <AppStack.Screen name="PodcastPlayer"     component={PodcastPlayerScreen} options={{ gestureEnabled: false }} />

//       {/* ── Company Tracks hub ── */}
//       <AppStack.Screen name="CompanyTracks" component={CompanyTracksScreen} />

//       {/* ── Shell Track overview ── */}
//       <AppStack.Screen name="ShellTrackHome"    component={ShellTrackHomeScreen} />
//       <AppStack.Screen name="ShellModeSelector" component={ShellModeSelectorScreen} />
//       <AppStack.Screen name="ShellCVGate"       component={ShellCVGateScreen} />

//       {/* ── Shell Practice ── */}
//       <AppStack.Screen name="ShellPracticeNumerical"  component={ShellPracticeNumericalScreen}  options={{ gestureEnabled: false }} />
//       <AppStack.Screen name="ShellPracticeVerbal"     component={ShellPracticeVerbalScreen}     options={{ gestureEnabled: false }} />
//       <AppStack.Screen name="ShellPracticeAbstract"   component={ShellPracticeAbstractScreen}   options={{ gestureEnabled: false }} />
//       <AppStack.Screen name="ShellPracticeBehavioral" component={ShellPracticeBehavioralScreen} options={{ gestureEnabled: false }} />
//       <AppStack.Screen name="ShellPracticeVideo"      component={ShellPracticeVideoScreen}      options={{ gestureEnabled: false }} />

//       {/* ── Shell Exam Simulation ── */}
//       <AppStack.Screen name="ShellExamHub"       component={ShellExamHubScreen}       />
//       <AppStack.Screen name="ShellExamCognitive" component={ShellExamCognitiveScreen} options={{ gestureEnabled: false }} />
//       <AppStack.Screen name="ShellExamBehavioral"component={ShellExamBehavioralScreen}options={{ gestureEnabled: false }} />
//       <AppStack.Screen name="ShellExamVideo"     component={ShellExamVideoScreen}     options={{ gestureEnabled: false }} />

//       {/* ── Shell Results + later stages ── */}
//       <AppStack.Screen name="ShellResults"   component={ShellResultsScreen}   options={{ gestureEnabled: false }} />
//       <AppStack.Screen name="ShellCaseStudy" component={ShellCaseStudyScreen} />
//       <AppStack.Screen name="ShellConnect"   component={ShellConnectScreen}   />
//       <AppStack.Screen name="ShellProgress"  component={ShellProgressScreen}  />


// <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
// <Stack.Screen name="ResetPassword"  component={ResetPasswordScreen}  />


//       {/* ── Whiteboard Video ── */}
//       <AppStack.Screen name="WhiteboardLibrary"    component={WhiteboardLibraryScreen} />
//       <AppStack.Screen name="WhiteboardCreate"     component={WhiteboardCreateScreen} />
//       <AppStack.Screen name="WhiteboardGenerating" component={WhiteboardGeneratingScreen} options={{ gestureEnabled: false }} />
//       <AppStack.Screen name="WhiteboardPlayer"     component={WhiteboardPlayerScreen} />

//     </AppStack.Navigator>
//   );
// }

// export default function RootNavigator() {
//   const user = useSelector((s: RootState) => s.auth.user);
//   return (
//     <NavigationContainer>
//       <RootStack.Navigator screenOptions={{ headerShown: false, animation: 'fade' }}>
//         {user ? (
//           <RootStack.Screen name="App"  component={AppNavigator}  />
//         ) : (
//           <RootStack.Screen name="Auth" component={AuthNavigator} />
//         )}
//       </RootStack.Navigator>
//     </NavigationContainer>
//   );
// }

// ─── RootNavigator.tsx ───────────────────────────────────────────
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
import LoginScreen          from '../screens/auth/LoginScreen';
import ForgotPasswordScreen from '../screens/auth/ForgotPasswordScreen';
import ResetPasswordScreen  from '../screens/auth/ResetPasswordScreen';

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

// ── Company Tracks ────────────────────────────────────────────────
import CompanyTracksScreen from '../screens/home/Companytracksscreen';

// ── Shell Track ───────────────────────────────────────────────────
import ShellTrackHomeScreen          from '../screens/shell/ShellTrackHomeScreen';
import ShellModeSelectorScreen       from '../screens/shell/ShellModeSelectorScreen';
import ShellCVGateScreen             from '../screens/shell/ShellCVGateScreen';
import ShellPracticeNumericalScreen  from '../screens/shell/ShellPracticeNumericalScreen';
import ShellPracticeVerbalScreen     from '../screens/shell/ShellPracticeVerbalScreen';
import ShellPracticeAbstractScreen   from '../screens/shell/ShellPracticeAbstractScreen';
import ShellPracticeBehavioralScreen from '../screens/shell/ShellPracticeBehavioralScreen';
import ShellPracticeVideoScreen      from '../screens/shell/ShellPracticeVideoScreen';
import ShellExamHubScreen            from '../screens/shell/ShellExamHubScreen';
import ShellExamCognitiveScreen      from '../screens/shell/ShellExamCognitiveScreen';
import ShellExamBehavioralScreen     from '../screens/shell/ShellExamBehavioralScreen';
import ShellExamVideoScreen          from '../screens/shell/ShellExamVideoScreen';
import ShellResultsScreen            from '../screens/shell/ShellResultsScreen';
import ShellCaseStudyScreen          from '../screens/shell/ShellCaseStudyScreen';
import ShellConnectScreen            from '../screens/shell/ShellConnectScreen';
import ShellProgressScreen           from '../screens/shell/ShellProgressScreen';

// ── Whiteboard ────────────────────────────────────────────────────
import WhiteboardLibraryScreen    from '../screens/drillpad/WhiteboardLibraryScreen';
import WhiteboardCreateScreen     from '../screens/drillpad/WhiteboardCreateScreen';
import WhiteboardPlayerScreen     from '../screens/drillpad/WhiteboardPlayerScreen';
import WhiteboardGeneratingScreen from '../screens/drillpad/WhiteboardGeneratingScreen';
import SubjectMaterialsScreen from '../screens/drillpad/SubjectMaterialsScreen';
import SubjectChatScreen from '../screens/drillpad/SubjectChatScreen';
import CompanyTrackHomeScreen from '../screens/companytrack/CompanyTrackHomeScreen';
import AptitudeTestStageScreen from '../screens/companytrack/Aptitudeteststagescreen';
import CompanyTestResultsScreen from '../screens/companytrack/CompanyTestResultsScreen';
import CompanyHistoryScreen from '../screens/companytrack/CompanyHistoryScreen';

// ─────────────────────────────────────────────────────────────────
const RootStack = createNativeStackNavigator<RootStackParamList>();
const AuthStack = createNativeStackNavigator<AuthStackParamList>();
const AppStack  = createNativeStackNavigator<AppStackParamList>();

// ── Auth Navigator ────────────────────────────────────────────────
function AuthNavigator() {
  return (
    <AuthStack.Navigator screenOptions={{ headerShown: false }}>
      <AuthStack.Screen name="Login"          component={LoginScreen} />
      <AuthStack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
      <AuthStack.Screen name="ResetPassword"  component={ResetPasswordScreen} />
    </AuthStack.Navigator>
  );
}

// ── App Navigator ─────────────────────────────────────────────────
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

<AppStack.Screen name="SubjectChat" component={SubjectChatScreen} />
      {/* ── DrillPad ── */}
      <AppStack.Screen name="DrillPad"          component={DrillPadHomeScreen} />
      <AppStack.Screen name="DrillSubject"      component={DrillSubjectScreen} />
      <AppStack.Screen name="DrillAddQuestions" component={DrillAddQuestionsScreen} />
      <AppStack.Screen name="DrillSession"      component={DrillSessionScreen}  options={{ gestureEnabled: false }} />
      <AppStack.Screen name="DrillResults"      component={DrillResultsScreen}  options={{ gestureEnabled: false }} />
      <AppStack.Screen name="Flashcard"         component={FlashcardScreen}     options={{ gestureEnabled: false }} />
      <AppStack.Screen name="AILesson"          component={AILessonScreen}      options={{ gestureEnabled: false }} />
      <AppStack.Screen name="PodcastPlayer"     component={PodcastPlayerScreen} options={{ gestureEnabled: false }} />

      {/* ── Company Tracks ── */}
      <AppStack.Screen name="CompanyTracks" component={CompanyTracksScreen} />
      {/* ── Company Tracks ── */}
<AppStack.Screen name="CompanyTrackHome" component={CompanyTrackHomeScreen} />


<AppStack.Screen name="AptitudeTestStage" component={AptitudeTestStageScreen} />
<AppStack.Screen name="CompanyTestResults" component={CompanyTestResultsScreen} />
<AppStack.Screen name="CompanyHistory" component={CompanyHistoryScreen} />

      {/* ── Shell Track ── */}
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
      <AppStack.Screen name="ShellExamHub"        component={ShellExamHubScreen} />
      <AppStack.Screen name="ShellExamCognitive"  component={ShellExamCognitiveScreen}  options={{ gestureEnabled: false }} />
      <AppStack.Screen name="ShellExamBehavioral" component={ShellExamBehavioralScreen} options={{ gestureEnabled: false }} />
      <AppStack.Screen name="ShellExamVideo"      component={ShellExamVideoScreen}      options={{ gestureEnabled: false }} />

      {/* ── Shell Results + later stages ── */}
      <AppStack.Screen name="ShellResults"   component={ShellResultsScreen}   options={{ gestureEnabled: false }} />
      <AppStack.Screen name="ShellCaseStudy" component={ShellCaseStudyScreen} />
      <AppStack.Screen name="ShellConnect"   component={ShellConnectScreen} />
      <AppStack.Screen name="ShellProgress"  component={ShellProgressScreen} />
      {/* import SubjectMaterialsScreen from '../screens/drillpad/SubjectMaterialsScreen'; */}
{/* // ... */}
<AppStack.Screen name="SubjectMaterials" component={SubjectMaterialsScreen} />

      {/* ── Whiteboard Video ── */}
      <AppStack.Screen name="WhiteboardLibrary"    component={WhiteboardLibraryScreen} />
      <AppStack.Screen name="WhiteboardCreate"     component={WhiteboardCreateScreen} />
      <AppStack.Screen name="WhiteboardGenerating" component={WhiteboardGeneratingScreen} options={{ gestureEnabled: false }} />
      <AppStack.Screen name="WhiteboardPlayer"     component={WhiteboardPlayerScreen} />

    </AppStack.Navigator>
  );
}

// ── Root Navigator ────────────────────────────────────────────────
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