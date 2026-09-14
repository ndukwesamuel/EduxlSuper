import notifee, { AndroidImportance, EventType, TriggerType } from "@notifee/react-native";
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
 * Schedule 20-minute and 5-minute pre-due reminders using Notifee timestamp triggers.
 */
export const scheduleTaskReminders = async (taskId: string, title: string, dueTimestampMs: number) => {
  try {
    const channelId = await createNotificationChannel();
    const now = Date.now();

    // 1. Schedule 20-minute prior reminder
    const trigger20mTime = dueTimestampMs - 20 * 60 * 1000;
    if (trigger20mTime > now) {
      await notifee.createTriggerNotification(
        {
          id: `task_${taskId}_20m`,
          title: `⏰ Task Reminder (20 mins left)`,
          body: `"${title}" is due in 20 minutes!`,
          data: { taskId, type: '20m_reminder' },
          android: { channelId, importance: AndroidImportance.HIGH, pressAction: { id: 'default' } },
          ios: { sound: 'default' },
        },
        {
          type: TriggerType.TIMESTAMP,
          timestamp: trigger20mTime,
        }
      );
      console.log(`⏰ Scheduled 20-min reminder for "${title}" at ${new Date(trigger20mTime).toLocaleTimeString()}`);
    }

    // 2. Schedule 5-minute prior reminder
    const trigger5mTime = dueTimestampMs - 5 * 60 * 1000;
    if (trigger5mTime > now) {
      await notifee.createTriggerNotification(
        {
          id: `task_${taskId}_5m`,
          title: `🚨 Task Reminder (5 mins left)`,
          body: `"${title}" is due in 5 minutes!`,
          data: { taskId, type: '5m_reminder' },
          android: { channelId, importance: AndroidImportance.HIGH, pressAction: { id: 'default' } },
          ios: { sound: 'default' },
        },
        {
          type: TriggerType.TIMESTAMP,
          timestamp: trigger5mTime,
        }
      );
      console.log(`🚨 Scheduled 5-min reminder for "${title}" at ${new Date(trigger5mTime).toLocaleTimeString()}`);
    }
  } catch (error) {
    console.error("❌ Error scheduling Notifee task reminders:", error);
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
