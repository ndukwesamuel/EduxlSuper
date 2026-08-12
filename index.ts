import { registerRootComponent } from "expo";
import messagingModule, { getMessaging } from "@react-native-firebase/messaging";

import App from "./App";

// Helper function to safely retrieve messaging instance in v26+
const getFcm = () => {
  if (typeof messagingModule === "function") {
    return (messagingModule as any)();
  }
  return getMessaging();
};

// Register Firebase background handler
try {
  getFcm().setBackgroundMessageHandler(async (remoteMessage: any) => {
    console.log("Message handled in the background:", remoteMessage);
  });
} catch (e) {
  console.warn("Failed to set background message handler:", e);
}

registerRootComponent(App);
