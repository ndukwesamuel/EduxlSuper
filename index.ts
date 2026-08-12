import { registerRootComponent } from "expo";
import * as messagingPkg from "@react-native-firebase/messaging";
import notifee, { EventType } from "@notifee/react-native";
import App from "./App";
import { displayIncomingNotification } from "./src/utils/notifee";

// Helper function to safely retrieve messaging instance in v26+
const getFcm = () => {
  const messagingModule = (messagingPkg as any).default || messagingPkg;
  if (typeof messagingModule === "function") {
    return messagingModule();
  }
  return messagingPkg.getMessaging();
};

// Register Notifee background event listener
notifee.onBackgroundEvent(async ({ type, detail }) => {
  const { notification, pressAction } = detail;
  if (type === EventType.PRESS) {
    console.log("User pressed notification in background:", notification?.id, pressAction?.id);
  }
});

// Register Firebase background message handler
try {
  getFcm().setBackgroundMessageHandler(async (remoteMessage: any) => {
    console.log("📱 Background FCM Message received:", remoteMessage);
    await displayIncomingNotification(remoteMessage);
  });
} catch (e) {
  console.warn("Failed to set background message handler:", e);
}

registerRootComponent(App);
