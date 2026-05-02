import React from 'react';
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

type Props = NativeStackScreenProps<RootStackParamList, 'Account'>;

const MENU_GROUPS = [
  {
    items: [
      { label: 'Account Information', icon: 'person-outline', screen: 'AccountInfo' },
      { label: 'Activity', icon: 'list-outline', screen: 'Activity' },
      { label: 'Settings', icon: 'settings-outline', screen: 'Settings' },
      { label: 'Messages', icon: 'mail-outline', screen: 'Messages' },
    ],
  },
  {
    items: [
      { label: 'Bank Details', icon: 'business-outline', screen: 'BankDetails' },
      { label: 'Withdraw History', icon: 'card-outline', screen: 'WithdrawHistory' },
    ],
  },
  {
    items: [
      { label: 'Help', icon: 'people-outline', screen: 'ContactUs' },
      { label: 'About', icon: 'car-outline', screen: 'About' },
    ],
  },
];

export default function AccountScreen({ navigation }: Props) {
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.navy} />
      <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
        <TouchableOpacity style={styles.headerIconBtn}>
          <Ionicons name="person-outline" size={20} color={COLORS.white} />
        </TouchableOpacity>
      </View>

      <View style={styles.body}>
        <View style={styles.dragHandle} />
        <ScrollView showsVerticalScrollIndicator={false}>

          {/* Avatar & Name */}
          <View style={styles.profileSection}>
            <View style={styles.avatarWrap}>
              <View style={styles.avatarCircle}>
                <Ionicons name="person" size={44} color={COLORS.grayText} />
              </View>
            </View>
            <Text style={styles.profileName}>Esther Babatunde</Text>
            <View style={styles.ratingRow}>
              <Ionicons name="star" size={16} color={COLORS.amber} />
              <Text style={styles.ratingText}>0.0</Text>
            </View>
          </View>

          {/* Menu Groups */}
          {MENU_GROUPS.map((group, gi) => (
            <View key={gi} style={styles.menuGroup}>
              {group.items.map((item, ii) => (
                <TouchableOpacity
                  key={item.label}
                  style={[
                    styles.menuRow,
                    ii < group.items.length - 1 && styles.menuRowBorder,
                  ]}
                  onPress={() => navigation.navigate(item.screen as any)}
                  activeOpacity={0.75}
                >
                  <View style={styles.menuLeft}>
                    <Ionicons name={item.icon as any} size={20} color={COLORS.white} />
                    <Text style={styles.menuLabel}>{item.label}</Text>
                  </View>
                  <View style={styles.menuChevron}>
                    <Ionicons name="chevron-forward" size={14} color={COLORS.white} />
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          ))}

          <View style={{ height: 20 }} />
        </ScrollView>
      </View>

      <BottomNav
        active="Account"
        onPress={(tab) => {
          if (tab === 'Home') navigation.navigate('MainTabs', { tab: 'Home' });
          else if (tab === 'Wallet') navigation.navigate('Wallet');
          else if (tab === 'Bookings') navigation.navigate('Bookings');
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.navy },
  header: {
    paddingHorizontal: SPACING.xl,
    paddingBottom: SPACING.lg,
  },
  headerIconBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.18)',
    alignItems: 'center',
    justifyContent: 'center',
  },
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
  // Profile
  profileSection: { alignItems: 'center', marginBottom: SPACING.xl },
  avatarWrap: { position: 'relative', marginBottom: 12 },
  avatarCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#e0e0e0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileName: {
    fontSize: 18,
    fontWeight: FONTS.bold,
    color: COLORS.navy,
    marginBottom: 6,
  },
  ratingRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  ratingText: {
    fontSize: 14,
    fontWeight: FONTS.semiBold,
    color: COLORS.navy,
  },
  // Menu
  menuGroup: {
    backgroundColor: COLORS.navy,
    borderRadius: RADIUS.lg,
    marginBottom: SPACING.md,
    overflow: 'hidden',
  },
  menuRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: SPACING.lg,
  },
  menuRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  menuLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  menuLabel: {
    color: COLORS.white,
    fontSize: 15,
    fontWeight: FONTS.semiBold,
  },
  menuChevron: {
    width: 28,
    height: 28,
    borderRadius: RADIUS.sm,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
