// ─── BankReadyStackNavigator.tsx ───────────────────────────────────
// The whole BankReady flow (home → test → results → history) lives in
// its own nested stack instead of as four separate screens flat in
// AppStack. That means back-navigation inside this flow pops within
// this stack's own history — it can't accidentally pop past BankReady
// and out of the app the way a flat sibling screen could.
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { BankReadyStackParamList } from './types';

import BankReadyHomeScreen from '../screens/bankready/BankReadyHomeScreen';
import TestScreen          from '../screens/bankready/TestScreen';
import ResultsScreen       from '../screens/bankready/ResultsScreen';
import HistoryScreen       from '../screens/bankready/HistoryScreen';

const Stack = createNativeStackNavigator<BankReadyStackParamList>();

export default function BankReadyStackNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="BankReady" component={BankReadyHomeScreen} />
      <Stack.Screen name="Test"      component={TestScreen} />
      <Stack.Screen name="Results"   component={ResultsScreen} />
      <Stack.Screen name="History"   component={HistoryScreen} />
    </Stack.Navigator>
  );
}
