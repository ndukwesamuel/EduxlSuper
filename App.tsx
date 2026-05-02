// import React from "react";
// import { SafeAreaProvider } from "react-native-safe-area-context";
// // import { GestureHandlerRootView } from 'react-native-gesture-handler';
// import { StyleSheet } from "react-native";
// import RootNavigator from "./src/navigation/RootNavigator";

// export default function App() {
//   return (
//     // <GestureHandlerRootView style={styles.root}>
//     <SafeAreaProvider>
//       <RootNavigator />
//     </SafeAreaProvider>
//     // </GestureHandlerRootView>
//   );
// }

// const styles = StyleSheet.create({
//   root: { flex: 1 },
// });

// ─── App.tsx ─────────────────────────────────────────────────────
import React from "react";
import { StyleSheet } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { store, persistor } from "./src/store/store";
import RootNavigator from "./src/navigation/RootNavigator";

export default function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <SafeAreaProvider>
          <RootNavigator />
        </SafeAreaProvider>
      </PersistGate>
    </Provider>
  );
}
