

// import React, { useEffect } from "react";
// import { Platform, Alert } from "react-native";
// import { SafeAreaProvider } from "react-native-safe-area-context";
// import { Provider } from "react-redux";
// import { PersistGate } from "redux-persist/integration/react";
// import { store, persistor } from "./src/store/store";
// import RootNavigator from "./src/navigation/RootNavigator";

// function useInAppUpdates() {
//   useEffect(() => {
//     if (__DEV__ || Platform.OS !== "android") return;

//     const checkForUpdates = async () => {
//       try {
//         // Import lazily, only when we actually need it, and only in prod Android
//         const ExpoInAppUpdates = require("expo-in-app-updates");

//         const { updateAvailable, storeVersion } =
//           await ExpoInAppUpdates.checkForUpdate();

//         if (!updateAvailable) return;

//         Alert.alert(
//           "🚀 New Update Available",
//           `Version ${storeVersion} is ready. Update now for the latest features and improvements.`,
//           [
//             { text: "Later", style: "cancel" },
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
//         console.log("Update check failed:", err);
//       }
//     };

//     checkForUpdates();
//   }, []);
// }

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

import React from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { store, persistor } from "./src/store/store";
import RootNavigator from "./src/navigation/RootNavigator";
import UpdateModal from "./src/updateApp/UpdateModal"


import { useUpdateChecker } from "./src/updateApp/useUpdateChecker";

function AppContent() {
  const { visible, force, message, dismiss } = useUpdateChecker();

  console.log("Update modal state:", { visible, force, message });

  return (
    <>
      <RootNavigator />
      <UpdateModal visible={visible} force={force} message={message} onClose={dismiss} />
    </>
  );
}

export default function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <SafeAreaProvider>
          <AppContent />
        </SafeAreaProvider>
      </PersistGate>
    </Provider>
  );
}