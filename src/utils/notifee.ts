import notifee, { AndroidImportance, EventType } from "@notifee/react-native";
import { Platform } from "react-native";

/**
 * Creates the default notification channel for Android.
 */
export const createNotificationChannel = async () => {
  if (Platform.OS === 'android') {
    const channelId = await notifee.createChannel({
      id: 'default',
      name: 'Default Channel',
      importance: AndroidImportance.HIGH,
      sound: 'default',
      vibration: true,
    });
    return channelId;
  }
  return 'default';
};

/**
 * Displays a local notification using Notifee from an FCM remote message payload.
 */
export const displayIncomingNotification = async (remoteMessage: any) => {
  try {
    const channelId = await createNotificationChannel();

    const title = remoteMessage?.notification?.title || remoteMessage?.data?.title || "EduXL Notification";
    const body = remoteMessage?.notification?.body || remoteMessage?.data?.body || "";

    console.log("🔔 Displaying Notifee Notification:", { title, body, data: remoteMessage?.data });

    await notifee.displayNotification({
      title,
      body,
      data: remoteMessage?.data || {},
      android: {
        channelId,
        importance: AndroidImportance.HIGH,
        pressAction: {
          id: 'default',
        },
        timestamp: Date.now(),
        showTimestamp: true,
      },
      ios: {
        sound: 'default',
      },
    });
  } catch (error) {
    console.error("❌ Error displaying Notifee notification:", error);
  }
};

/**
 * Set up Notifee foreground event listener for user interactions (tapping notification banners).
 */
export const setupNotifeeForegroundListener = () => {
  return notifee.onForegroundEvent(({ type, detail }) => {
    switch (type) {
      case EventType.DISMISSED:
        console.log("Notification dismissed:", detail.notification?.id);
        break;
      case EventType.PRESS:
        console.log("Notification pressed:", detail.notification?.id, detail.notification?.data);
        break;
    }
  });
};
