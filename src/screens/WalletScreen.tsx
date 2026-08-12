import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  StatusBar,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { BottomNav } from '../components';
import { COLORS, FONTS, RADIUS, SPACING } from '../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'Wallet'>;

export default function WalletScreen({ navigation }: Props) {
  const insets = useSafeAreaInsets();
  const [balanceVisible, setBalanceVisible] = useState(false);


  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.navy} />

      {/* Navy Header */}
      <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
        <View style={styles.headerRow}>
          <TouchableOpacity style={styles.headerIconBtn}>
            <Ionicons name="wallet-outline" size={20} color={COLORS.white} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Wallet</Text>
          <TouchableOpacity style={styles.headerIconBtn}>
            <Ionicons name="refresh-outline" size={20} color={COLORS.white} />
          </TouchableOpacity>
        </View>

        {/* Balance */}
        <View style={styles.balanceSection}>
          <Text style={styles.balanceLabel}>Balance</Text>
          <View style={styles.balanceRow}>
            <Text style={styles.balanceValue}>
              {balanceVisible ? '₦ 24,500.00' : '**********'}
            </Text>
            <TouchableOpacity onPress={() => setBalanceVisible(!balanceVisible)}>
              <Ionicons
                name={balanceVisible ? 'eye-outline' : 'eye-off-outline'}
                size={22}
                color={COLORS.white}
                style={{ marginLeft: 10 }}
              />
            </TouchableOpacity>
          </View>
          <Text style={styles.onHoldText}>
            OnHold Balance: {balanceVisible ? '₦ 0.00' : '*********'}
          </Text>
        </View>

        {/* Action Buttons */}
        <View style={styles.walletBtns}>
          <TouchableOpacity style={styles.walletBtn}>
            <Ionicons name="arrow-down-outline" size={16} color={COLORS.white} />
            <Text style={styles.walletBtnText}>Add fund</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.walletBtn}>
            <Ionicons name="arrow-up-outline" size={16} color={COLORS.white} />
            <Text style={styles.walletBtnText}>Withdraw</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* White Body */}
      <View style={styles.body}>
        <View style={styles.dragHandle} />
        <Text style={styles.sectionTitle}>Transaction History</Text>

        {/* Empty State */}
        <View style={styles.emptyState}>
          {/* Illustration placeholder */}
          <View style={styles.illustrationBox}>
            <MaterialCommunityIcons name="account-cowboy-hat" size={80} color={COLORS.amber} />
            <View style={styles.illustrationDecor} />
          </View>
          <Text style={styles.emptyText}>No transaction{'\n'}found</Text>
        </View>
      </View>

      <BottomNav
        active="Wallet"
        onPress={(tab) => {
          if (tab === 'Home') navigation.navigate('MainTabs', { tab: 'Home' });
          else if (tab === 'Account') navigation.navigate('Account');
          else if (tab === 'Bookings') navigation.navigate('Bookings');
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.navy },
  header: {
    backgroundColor: COLORS.navy,
    paddingHorizontal: SPACING.xl,
    paddingBottom: SPACING.xl,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: SPACING.xl,
  },
  headerTitle: {
    color: COLORS.white,
    fontSize: 18,
    fontWeight: FONTS.bold,
  },
  headerIconBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  // Balance
  balanceSection: { marginBottom: SPACING.xl },
  balanceLabel: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 14,
    marginBottom: 4,
  },
  balanceRow: { flexDirection: 'row', alignItems: 'center' },
  balanceValue: {
    color: COLORS.white,
    fontSize: 28,
    fontWeight: FONTS.bold,
    letterSpacing: 2,
  },
  onHoldText: {
    color: 'rgba(255,255,255,0.65)',
    fontSize: 13,
    marginTop: 6,
  },
  // Wallet action buttons
  walletBtns: { flexDirection: 'row', gap: 12 },
  walletBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: COLORS.amber,
    borderRadius: RADIUS.full,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  walletBtnText: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: FONTS.bold,
  },
  // Body
  body: {
    flex: 1,
    backgroundColor: COLORS.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.md,
  },
  dragHandle: {
    width: 40,
    height: 4,
    backgroundColor: COLORS.grayLight,
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: SPACING.lg,
  },
  sectionTitle: {
    color: COLORS.navy,
    fontSize: 17,
    fontWeight: FONTS.bold,
    marginBottom: SPACING.lg,
  },
  // Empty
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 40,
  },
  illustrationBox: {
    alignItems: 'center',
    marginBottom: 16,
  },
  illustrationDecor: {
    width: 120,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.grayLight,
    marginTop: 8,
  },
  emptyText: {
    color: COLORS.navy,
    fontSize: 16,
    fontWeight: FONTS.bold,
    textAlign: 'center',
  },
});
