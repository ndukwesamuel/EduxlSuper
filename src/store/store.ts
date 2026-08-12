

// import { configureStore } from '@reduxjs/toolkit';
// import {
//   persistStore,
//   persistReducer,
//   FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER,
// } from 'redux-persist';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { combineReducers } from '@reduxjs/toolkit';
// import authReducer from './authSlice';
// import testReducer  from './testSlice';
// import { setTokenGetter } from  "../../config/client" 

// // '../api/client';

// const persistConfig = {
//   key:       'root',
//   storage:   AsyncStorage,
//   whitelist: ['auth'], // only persist auth — test state is session-only
// };

// const rootReducer = combineReducers({
//   auth: authReducer,
//   test: testReducer,
// });

// const persistedReducer = persistReducer(persistConfig, rootReducer);

// export const store = configureStore({
//   reducer: persistedReducer,
//   middleware: (getDefaultMiddleware) =>
//     getDefaultMiddleware({
//       serializableCheck: {
//         ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
//       },
//     }),
// });

// // ── Wire token into API client automatically ──────────────────────
// // Every API call will now include the JWT token if logged in
// setTokenGetter(() => store.getState().auth?.token ?? null);

// export const persistor   = persistStore(store);
// export type RootState    = ReturnType<typeof store.getState>;
// export type AppDispatch  = typeof store.dispatch;

// ─── src/store/store.ts ───────────────────────────────────────────
import { configureStore } from '@reduxjs/toolkit';
import {
  persistStore,
  persistReducer,
  FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER,
} from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { combineReducers } from '@reduxjs/toolkit';
import authReducer    from './authSlice';
import testReducer    from './testSlice';
import profileReducer from './profileSlice'; // ← NEW
import { setTokenGetter } from '../../config/client';

const persistConfig = {
  key:      'root',
  storage:  AsyncStorage,
  whitelist: ['auth', 'profile'], // ← ADD 'profile' to persist it
};

const rootReducer = combineReducers({
  auth:    authReducer,
  test:    testReducer,
  profile: profileReducer, // ← NEW
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

setTokenGetter(() => store.getState().auth?.token ?? null);

export const persistor  = persistStore(store);
export type RootState   = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;