// // // import React from "react";
// // // import { SafeAreaProvider } from "react-native-safe-area-context";
// // // // import { GestureHandlerRootView } from 'react-native-gesture-handler';
// // // import { StyleSheet } from "react-native";
// // // import RootNavigator from "./src/navigation/RootNavigator";

// // // export default function App() {
// // //   return (
// // //     // <GestureHandlerRootView style={styles.root}>
// // //     <SafeAreaProvider>
// // //       <RootNavigator />
// // //     </SafeAreaProvider>
// // //     // </GestureHandlerRootView>
// // //   );
// // // }

// // // const styles = StyleSheet.create({
// // //   root: { flex: 1 },
// // // });

// // // ─── App.tsx ─────────────────────────────────────────────────────
// // import React from "react";
// // import { StyleSheet } from "react-native";
// // import { SafeAreaProvider } from "react-native-safe-area-context";
// // import { Provider } from "react-redux";
// // import { PersistGate } from "redux-persist/integration/react";
// // import { store, persistor } from "./src/store/store";
// // import RootNavigator from "./src/navigation/RootNavigator";

// // export default function App() {
// //   return (
// //     <Provider store={store}>
// //       <PersistGate loading={null} persistor={persistor}>
// //         <SafeAreaProvider>
// //           <RootNavigator />
// //         </SafeAreaProvider>
// //       </PersistGate>
// //     </Provider>
// //   );
// // }


// // ─── App.tsx ─────────────────────────────────────────────────────
// import React, { useEffect } from "react";
// import { Platform, Alert } from "react-native";
// import { SafeAreaProvider } from "react-native-safe-area-context";
// import { Provider } from "react-redux";
// import { PersistGate } from "redux-persist/integration/react";
// import * as ExpoInAppUpdates from "expo-in-app-updates";
// import { store, persistor } from "./src/store/store";
// import RootNavigator from "./src/navigation/RootNavigator";

// // ── In-app update check ───────────────────────────────────────────
// function useInAppUpdates() {
//   useEffect(() => {
//     // Only runs on Android production builds — not in dev or Expo Go
//     if (__DEV__ || Platform.OS !== "android") return;

//     const checkForUpdates = async () => {
//       try {
//         const { updateAvailable, storeVersion } =
//           await ExpoInAppUpdates.checkForUpdate();

//         if (!updateAvailable) return;

//         Alert.alert(
//           "🚀 New Update Available",
//           `Version ${storeVersion} is ready. Update now for the latest features and improvements.`,
//           [
//             {
//               text: "Later",
//               style: "cancel",
//             },
//             {
//               text: "Update Now",
//               isPreferred: true,
//               onPress: async () => {
//                 try {
//                   await ExpoInAppUpdates.startUpdate();
//                 } catch (err) {
//                   console.log("Failed to start update:", err);
//                 }
//               },
//             },
//           ]
//         );
//       } catch (err) {
//         // Silently fail — never block the app over an update check
//         console.log("Update check failed:", err);
//       }
//     };

//     checkForUpdates();
//   }, []);
// }

// // ── App ───────────────────────────────────────────────────────────
// export default function App() {
//   useInAppUpdates();

//   return (
//     <Provider store={store}>
//       <PersistGate loading={null} persistor={persistor}>
//         <SafeAreaProvider>
//           <RootNavigator />
//         </SafeAreaProvider>
//       </PersistGate>
//     </Provider>
//   );
// }

import React, { useEffect } from "react";
import { Platform, Alert } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { store, persistor } from "./src/store/store";
import RootNavigator from "./src/navigation/RootNavigator";

function useInAppUpdates() {
  useEffect(() => {
    if (__DEV__ || Platform.OS !== "android") return;

    const checkForUpdates = async () => {
      try {
        // Import lazily, only when we actually need it, and only in prod Android
        const ExpoInAppUpdates = require("expo-in-app-updates");

        const { updateAvailable, storeVersion } =
          await ExpoInAppUpdates.checkForUpdate();

        if (!updateAvailable) return;

        Alert.alert(
          "🚀 New Update Available",
          `Version ${storeVersion} is ready. Update now for the latest features and improvements.`,
          [
            { text: "Later", style: "cancel" },
            {
              text: "Update Now",
              isPreferred: true,
              onPress: async () => {
                try {
                  await ExpoInAppUpdates.startUpdate();
                } catch (err) {
                  console.log("Failed to start update:", err);
                }
              },
            },
          ]
        );
      } catch (err) {
        console.log("Update check failed:", err);
      }
    };

    checkForUpdates();
  }, []);
}

export default function App() {
  useInAppUpdates();

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