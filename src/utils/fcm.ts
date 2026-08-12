import { PermissionsAndroid, Platform } from "react-native";
import * as messagingPkg from "@react-native-firebase/messaging";
import { registerNotificationToken } from "../../config/client";
import { store } from "../store/store";

export const getFcm = () => {
  const messagingModule = (messagingPkg as any).default || messagingPkg;
  if (typeof messagingModule === "function") {
    return messagingModule();
  }
  return messagingPkg.getMessaging();
};

export const requestUserPermissionAndGetToken = async () => {
  try {
    let hasPermission = false;

    if (Platform.OS === 'android') {
      if (Platform.Version >= 33) {
        const status = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
        );
        hasPermission = status === PermissionsAndroid.RESULTS.GRANTED;
      } else {
        hasPermission = true;
      }
    } else if (Platform.OS === 'ios') {
      await getFcm().registerDeviceForRemoteMessages();
      const authStatus = await getFcm().requestPermission();
      hasPermission =
        authStatus === messagingPkg.AuthorizationStatus.AUTHORIZED ||
        authStatus === messagingPkg.AuthorizationStatus.PROVISIONAL;
    }

    if (hasPermission) {
      const fetchedToken = await getFcm().getToken();
      console.log("FCM Token retrieved successfully:", fetchedToken);

      // If user is logged in, register token with backend
      const authToken = store.getState().auth?.token;
      if (authToken && fetchedToken) {
        registerNotificationToken(fetchedToken)
          .then(() => console.log("📱 FCM token registered to backend"))
          .catch((e) => console.log("⚠️ Backend token registration error:", e?.message || e));
      }

      return fetchedToken;
    } else {
      console.warn("Notification permission was not granted.");
      return null;
    }
  } catch (error: any) {
    console.error('Error requesting FCM permission/token:', error?.message || error);
    return null;
  }
};

export const registerFcmTokenToBackend = async (customToken?: string) => {
  try {
    const token = customToken || (await getFcm().getToken());
    console.log("\n==========================================");
    console.log("📤 REGISTER FCM TOKEN PAYLOAD:");
    console.log(JSON.stringify({ token }, null, 2));
    console.log("==========================================\n");

    if (token) {
      const res = await registerNotificationToken(token);
      console.log("\n==========================================");
      console.log("📥 REGISTER FCM TOKEN BACKEND RESPONSE:");
      console.log(JSON.stringify(res, null, 2));
      console.log("==========================================\n");
      return res;
    }
  } catch (error: any) {
    console.log("\n==========================================");
    console.error("❌ FAILED TO REGISTER TOKEN TO BACKEND:");
    console.error(error?.response?.data || error?.message || error);
    console.log("==========================================\n");
  }
};
