

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

import React, { useEffect, useState } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { store, persistor } from "./src/store/store";
import RootNavigator from "./src/navigation/RootNavigator";
import UpdateModal from "./src/updateApp/UpdateModal"


import { useUpdateChecker } from "./src/updateApp/useUpdateChecker";
import { requestUserPermissionAndGetToken, getFcm } from "./src/utils/fcm";

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
  const [phoneToken, setPhoneToken] = useState<any>(null)
  let token: any;

  const getNewFCMToken = async () => {
    try {
      const fetchedToken = await requestUserPermissionAndGetToken();
      if (fetchedToken) {
        setPhoneToken(fetchedToken);
      }
    } catch (error: any) {
      console.error('Error getting new FCM token:', error?.message || error, error?.code ? `[code: ${error.code}]` : '');
    }
  };

  useEffect(() => {
    let unsubscribeForeground: any;

    const setupMessaging = async () => {
      try {
        await getNewFCMToken();

        // // Foreground notifications
        // unsubscribeForeground = messaging().onMessage(async remoteMessage => {
        //   const channelId = await notifee.createChannel({
        //     id: "default",
        //     name: "Default Channel",
        //     sound: "default",
        //     importance: AndroidImportance.HIGH,
        //   });

        //   await notifee.requestPermission();

        //   await notifee.displayNotification({
        //     id: "1234",
        //     title: remoteMessage?.notification?.title ?? "Notification",
        //     body: remoteMessage?.notification?.body ?? "",
        //     android: {
        //       channelId,
        //       color: "#6495ed",
        //       timestamp: Date.now() - 800,
        //       showTimestamp: true,
        //     },
        //   });
        // });

        // // Handle background and quit state notifications
        // messaging().onNotificationOpenedApp(async remoteMessage => {
        //   if (remoteMessage) {
        //     // Handle navigation or alert if needed
        //   }
        // });

        // // Handle notification when the app is opened from a quit state
        // const initialNotification = await messaging().getInitialNotification();
        // if (initialNotification) {
        // }
      } catch (error) {
        console.error("Error setting up FCM:", error);
      }
    };

    setupMessaging();

    // ✅ Clean up listeners on unmount
    return () => {
      unsubscribeForeground?.();
    };
  }, []);

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