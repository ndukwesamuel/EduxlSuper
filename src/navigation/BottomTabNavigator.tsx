// ─── BottomTabNavigator.tsx ───────────────────────────────────────
import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Text, View, StyleSheet } from "react-native";
import { AppTabParamList } from "./types";
// import HomeScreen     from '../screens/home/HomeScreen';
// import ProgressScreen from '../screens/progress/ProgressScreen';
// import ProfileScreen  from '../screens/profile/ProfileScreen';
import { Colors, FontSize, Radius, Shadows } from "../theme";
import HomeScreen from "../screens/home/HomeScreen";
import ProgressScreen from "../screens/progress/ProgressScreen";
import ProfileScreen from "../screens/profile/ProfileScreen";

const Tab = createBottomTabNavigator<AppTabParamList>();

const TAB_ICONS: Record<string, { active: string; inactive: string }> = {
  Home: { active: "🏠", inactive: "🏠" },
  Learn: { active: "📚", inactive: "📚" },
  Progress: { active: "📊", inactive: "📊" },
  Profile: { active: "👤", inactive: "👤" },
};

// Learn tab is a placeholder — taps navigate to BankReady
function LearnPlaceholder() {
  return <View style={{ flex: 1, backgroundColor: Colors.background }} />;
}

export default function BottomTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarShowLabel: true,
        tabBarActiveTintColor: Colors.brand,
        tabBarInactiveTintColor: Colors.textMuted,
        tabBarLabelStyle: styles.tabLabel,
        tabBarIcon: ({ focused }) => (
          <Text style={{ fontSize: 20, opacity: focused ? 1 : 0.5 }}>
            {TAB_ICONS[route.name]?.active ?? "●"}
          </Text>
        ),
      })}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{ title: "Home" }}
      />
      <Tab.Screen
        name="Learn"
        component={LearnPlaceholder}
        options={{ title: "Learn" }}
      />
      <Tab.Screen
        name="Progress"
        component={ProgressScreen}
        options={{ title: "Progress" }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{ title: "Profile" }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: Colors.surface,
    borderTopColor: Colors.border,
    borderTopWidth: 1,
    height: 64,
    paddingBottom: 8,
    paddingTop: 8,
    ...Shadows.sm,
  },
  tabLabel: {
    fontSize: FontSize.micro,
    fontWeight: "600",
    marginTop: 2,
  },
});
