import { registerRootComponent } from "expo";
import * as messagingPkg from "@react-native-firebase/messaging";

import App from "./App";

// Helper function to safely retrieve messaging instance in v26+
const getFcm = () => {
  const messagingModule = (messagingPkg as any).default || messagingPkg;
  if (typeof messagingModule === "function") {
    return messagingModule();
  }
  return messagingPkg.getMessaging();
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
