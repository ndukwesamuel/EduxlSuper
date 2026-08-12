// ─── src/store/profileSlice.ts ────────────────────────────────────
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// ── Types ──────────────────────────────────────────────────────────
export type UserPersona = 'undergraduate' | 'graduate';

export interface ProfileStatus {
  hasProfile: boolean;
  onboardingCompleted: boolean;
  persona: UserPersona | null;
  onboardingStep: number;
}

export interface SemesterCourse {
  name: string;
  subjectId?: string;
  testDate?: string;
  priority: 'high' | 'medium' | 'low';
}

export interface ActiveGoal {
  title: string;
  goalType: string;
  examDate: string;
  hoursPerDay: number;
  specialistTrack?: string;
}

export interface UserProfile {
  _id: string;
  userId: string;
  persona?: UserPersona;
  institution?: string;
  levelOfStudy?: string;
  semesterCourses: SemesterCourse[];
  semesterEndDate?: string;
  activeGoal?: ActiveGoal;
  completedGoals: ActiveGoal[];
  studyPattern: {
    currentStreak: number;
    longestStreak: number;
    totalSessionsCompleted: number;
    totalMinutesStudied: number;
    bestStudyHour?: number;
    avgSessionMinutes?: number;
    consistencyScore?: number;
    lastActiveDate?: string;
  };
  coachPreferences: {
    notificationsEnabled: boolean;
    dailyReminderTime?: string;
    weeklyReviewEnabled: boolean;
    tonePreference: 'direct' | 'encouraging';
  };
  onboardingCompleted: boolean;
  onboardingStep: number;
  createdAt: string;
  updatedAt: string;
}

interface ProfileState {
  status: ProfileStatus | null;   // from GET /profile/me
  profile: UserProfile | null;    // from GET /profile
  loading: boolean;
}

const initialState: ProfileState = {
  status:  null,
  profile: null,
  loading: false,
};

// ── Slice ──────────────────────────────────────────────────────────
const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    setProfileStatus: (state, action: PayloadAction<ProfileStatus>) => {
      state.status = action.payload;
    },
    setProfile: (state, action: PayloadAction<UserProfile>) => {
      state.profile = action.payload;
      // Keep status in sync when full profile is loaded
      if (state.status) {
        state.status.persona             = action.payload.persona ?? null;
        state.status.onboardingCompleted = action.payload.onboardingCompleted;
        state.status.onboardingStep      = action.payload.onboardingStep;
        state.status.hasProfile          = true;
      }
    },
    setProfileLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    // Called after persona modal submits successfully
    updatePersona: (state, action: PayloadAction<UserPersona>) => {
      if (state.status)  state.status.persona  = action.payload;
      if (state.profile) state.profile.persona = action.payload;
    },
    // Called on logout — clear everything
    clearProfile: (state) => {
      state.status  = null;
      state.profile = null;
      state.loading = false;
    },
  },
});

export const {
  setProfileStatus,
  setProfile,
  setProfileLoading,
  updatePersona,
  clearProfile,
} = profileSlice.actions;

export default profileSlice.reducer;