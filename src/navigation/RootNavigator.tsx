// ─── RootNavigator.tsx ───────────────────────────────────────────
// CareerClarity root navigation.
// AuthStack → LoginScreen
// AppStack  → BottomTabs + BankReady flow

import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";

// import LoginScreen from "../screens/auth/LoginScreen";
// import BottomTabNavigator   from './BottomTabNavigator';
// import BankReadyHomeScreen from "../screens/bankready/BankReadyHomeScreen";
// import TestScreen           from '../screens/bankready/TestScreen';
// import ResultsScreen        from '../screens/bankready/ResultsScreen';
// import HistoryScreen        from '../screens/bankready/HistoryScreen';

import type {
  RootStackParamList,
  AppStackParamList,
  AuthStackParamList,
} from "./types";
import { Text } from "react-native";
import LoginScreen from "../screens/auth/LoginScreen";
import BottomTabNavigator from "./BottomTabNavigator";
import BankReadyHomeScreen from "../screens/bankready/BankReadyHomeScreen";
import TestScreen from "../screens/bankready/TestScreen";
import ResultsScreen from "../screens/bankready/ResultsScreen";
import HistoryScreen from "../screens/bankready/HistoryScreen";
// import BottomTabNavigator from "./Bottomtabnavigator";

const RootStack = createNativeStackNavigator<RootStackParamList>();
const AuthStack = createNativeStackNavigator<AuthStackParamList>();
const AppStack = createNativeStackNavigator<AppStackParamList>();

function AuthNavigator() {
  return (
    <AuthStack.Navigator screenOptions={{ headerShown: false }}>
      <AuthStack.Screen name="Login" component={LoginScreen} />
    </AuthStack.Navigator>
  );
}

function AppNavigator() {
  return (
    <AppStack.Navigator screenOptions={{ headerShown: false }}>
      <AppStack.Screen name="MainTabs" component={BottomTabNavigator} />
      <AppStack.Screen name="BankReady" component={BankReadyHomeScreen} />
      <AppStack.Screen name="Test" component={TestScreen} />
      <AppStack.Screen name="Results" component={ResultsScreen} />
      <AppStack.Screen name="History" component={HistoryScreen} />
    </AppStack.Navigator>
  );
}

export default function RootNavigator() {
  const user = useSelector((s: RootState) => s.auth.user);

  return (
    <NavigationContainer>
      <RootStack.Navigator
        screenOptions={{ headerShown: false, animation: "fade" }}
      >
        {user ? (
          <RootStack.Screen name="App" component={AppNavigator} />
        ) : (
          <RootStack.Screen name="Auth" component={AuthNavigator} />
        )}
      </RootStack.Navigator>
    </NavigationContainer>
  );
}
