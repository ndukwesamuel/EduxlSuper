import React, { useEffect, useState } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { store, persistor } from "./src/store/store";
import RootNavigator from "./src/navigation/RootNavigator";
import UpdateModal from "./src/updateApp/UpdateModal";

import { useUpdateChecker } from "./src/updateApp/useUpdateChecker";
import { requestUserPermissionAndGetToken, getFcm } from "./src/utils/fcm";
import { displayIncomingNotification, setupNotifeeForegroundListener } from "./src/utils/notifee";

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
  const [phoneToken, setPhoneToken] = useState<any>(null);

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
    let unsubscribeFCM: (() => void) | undefined;
    let unsubscribeNotifee: (() => void) | undefined;

    const setupMessaging = async () => {
      try {
        await getNewFCMToken();

        // 1. Foreground FCM Message listener -> Display Notifee local banner
        unsubscribeFCM = getFcm().onMessage(async (remoteMessage: any) => {
          console.log("📱 Foreground FCM Message received:", remoteMessage);
          await displayIncomingNotification(remoteMessage);
        });

        // 2. Notifee Foreground interaction listener
        unsubscribeNotifee = setupNotifeeForegroundListener();

        // 3. Handle Notification opened when app was running in background
        getFcm().onNotificationOpenedApp((remoteMessage: any) => {
          if (remoteMessage) {
            console.log("📱 App opened from background notification:", remoteMessage);
          }
        });

        // 4. Handle Notification opened when app was killed / quit
        const initialNotification = await getFcm().getInitialNotification();
        if (initialNotification) {
          console.log("📱 App opened from quit state notification:", initialNotification);
        }
      } catch (error) {
        console.error("Error setting up FCM/Notifee:", error);
      }
    };

    setupMessaging();

    // Clean up listeners on unmount
    return () => {
      unsubscribeFCM?.();
      unsubscribeNotifee?.();
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