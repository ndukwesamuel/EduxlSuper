

// ─── BottomTabNavigator.tsx ───────────────────────────────────────
import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { StyleSheet } from "react-native";
import Svg, { Path, Circle } from "react-native-svg";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { AppTabParamList } from "./types";
import { Colors, FontSize, Shadows } from "../theme";
import HomeScreen from "../screens/home/HomeScreen";
import ProgressScreen from "../screens/progress/ProgressScreen";
import ProfileScreen from "../screens/profile/ProfileScreen";
import DrillPadHomeScreen from "../screens/drillpad/DrillPadHomeScreen";
import GraduateScreen from "../screens/home/GraduateScreen";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";

const Tab = createBottomTabNavigator<AppTabParamList>();

// ── SVG Icon Components ───────────────────────────────────────────

function HomeIcon({ color, size = 24 }: { color: string; size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <Path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8" />
      <Path d="M3 10a2 2 0 0 1 .709-1.528l7-6a2 2 0 0 1 2.582 0l7 6A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    </Svg>
  );
}

function LearnIcon({ color, size = 24 }: { color: string; size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <Path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
      <Path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
    </Svg>
  );
}

function ProgressIcon({ color, size = 24 }: { color: string; size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <Path d="M3 3v16a2 2 0 0 0 2 2h16" />
      <Path d="M7 16h2V8H7z" fill={color} stroke="none" />
      <Path d="M11 16h2V11h-2z" fill={color} stroke="none" />
      <Path d="M15 16h2V5h-2z" fill={color} stroke="none" />
    </Svg>
  );
}

function ProfileIcon({ color, size = 24 }: { color: string; size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <Circle cx="12" cy="8" r="4" />
      <Path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
    </Svg>
  );
}

function GraduateIcon({ color, size = 24 }: { color: string; size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <Path d="M22 10 12 5 2 10l10 5 10-5Z" />
      <Path d="M6 12v5c0 1.5 2.5 3 6 3s6-1.5 6-3v-5" />
    </Svg>
  );
}

// ── Navigator ────────────────────────────────────────────────────
export default function BottomTabNavigator() {
  const insets = useSafeAreaInsets();
  const profileStatus = useSelector((s: RootState) => s.profile.status);
  const isGraduate = profileStatus?.persona === "graduate";

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: {
          ...styles.tabBar,
          height: 64 + insets.bottom,
          paddingBottom: 8 + insets.bottom,
        },
        tabBarShowLabel: true,
        tabBarActiveTintColor: Colors.brand,
        tabBarInactiveTintColor: Colors.textMuted,
        tabBarLabelStyle: styles.tabLabel,
        tabBarIcon: ({ color }) => {
          const size = 22;
          switch (route.name) {
            case "Home":     return <HomeIcon     color={color} size={size} />;
            case "LearnPad": return <LearnIcon    color={color} size={size} />;
            case "Graduate": return <GraduateIcon color={color} size={size} />;
            case "Progress": return <ProgressIcon color={color} size={size} />;
            case "Profile":  return <ProfileIcon  color={color} size={size} />;
            default:         return null;
          }
        },
      })}
    >
      <Tab.Screen name="Home"     component={HomeScreen}       options={{ title: "Home" }} />
      <Tab.Screen name="LearnPad" component={DrillPadHomeScreen} options={{ title: "LearnPad" }} />

      {isGraduate ? (
        <Tab.Screen name="Graduate" component={GraduateScreen} options={{ title: "Graduate" }} />
      ) : (
        <Tab.Screen name="Progress" component={ProgressScreen} options={{ title: "Progress" }} />
      )}

      <Tab.Screen name="Profile" component={ProfileScreen} options={{ title: "Profile" }} />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: Colors.surface,
    borderTopColor: Colors.border,
    borderTopWidth: 1,
    paddingTop: 8,
    ...Shadows.sm,
  },
  tabLabel: {
    fontSize: FontSize.micro,
    fontWeight: "600",
    marginTop: 2,
  },
});