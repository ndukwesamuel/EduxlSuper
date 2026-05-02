// ─── Navigation Types ─────────────────────────────────────────────
// All param lists for type-safe navigation across the app.

export type RootStackParamList = {
  Auth: undefined;
  App: undefined;
};

export type AuthStackParamList = {
  Login: undefined;
};

export type AppTabParamList = {
  Home: undefined;
  Learn: undefined;
  Progress: undefined;
  Profile: undefined;
};

export type BankReadyStackParamList = {
  BankReadyHome: undefined;
  Test: {
    module: "numerical" | "verbal" | "logical" | "abstract";
    mode: "exam" | "practice" | "speed";
    difficulty?: "easy" | "medium" | "hard" | "mixed";
    tag?: string;
  };
  Results: undefined;
  History: {
    module?: "numerical" | "verbal" | "logical" | "abstract";
  };
};

// Combined for useNavigation typing
export type AppStackParamList = {
  MainTabs: undefined;
  BankReady: undefined; // entry into BankReady stack
  Test: BankReadyStackParamList["Test"];
  Results: undefined;
  History: BankReadyStackParamList["History"];
};
