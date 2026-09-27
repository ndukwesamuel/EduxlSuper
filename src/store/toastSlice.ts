// ─── toastSlice.ts ──────────────────────────────────────────────────
// Session-only (not persisted) toast/snackbar state, shown by ToastHost
// mounted once at the app root.
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type ToastVariant = 'success' | 'error' | 'info';

interface ToastState {
  visible: boolean;
  message: string;
  variant: ToastVariant;
  key: number; // bumped on every show, so re-showing the same message still re-triggers the animation/timer
}

const initialState: ToastState = {
  visible: false,
  message: '',
  variant: 'info',
  key: 0,
};

const toastSlice = createSlice({
  name: 'toast',
  initialState,
  reducers: {
    showToast: (state, action: PayloadAction<{ message: string; variant?: ToastVariant }>) => {
      state.visible = true;
      state.message = action.payload.message;
      state.variant = action.payload.variant ?? 'info';
      state.key += 1;
    },
    hideToast: (state) => {
      state.visible = false;
    },
  },
});

export const { showToast, hideToast } = toastSlice.actions;
export default toastSlice.reducer;
