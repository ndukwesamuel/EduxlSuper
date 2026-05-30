import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface User {
  _id:   string;
  name:  string;
  email: string;
}

interface AuthState {
  user:  User | null;
  token: string | null;
}

const initialState: AuthState = {
  user:  null,
  token: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (
      state,
      action: PayloadAction<{ user: User; token: string }>,
    ) => {
      state.user  = action.payload.user;
      state.token = action.payload.token;
    },
    clearUser: (state) => {
      state.user  = null;
      state.token = null;
    },
  },
});

export const { setUser, clearUser } = authSlice.actions;
export default authSlice.reducer;