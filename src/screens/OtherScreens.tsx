// ─── AccountInfo ────────────────────────────────────────────────────────────
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  StatusBar,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { AppHeader, AmberBtn, BottomNav } from '../components';
import { COLORS, FONTS, RADIUS, SPACING } from '../theme';

type AccountInfoProps = NativeStackScreenProps<RootStackParamList, 'AccountInfo'>;

export function AccountInfoScreen({ navigation }: AccountInfoProps) {
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState<'Info' | 'Privacy'>('Info');

  const fields = [
    { icon: 'person-outline', value: 'Esther', key: 'firstName' },
    { icon: 'person-outline', value: 'Babatunde', key: 'lastName' },
    { icon: 'call-outline', value: '+234 7038591500', key: 'phone' },
    { icon: 'mail-outline', value: 'kaluesther28@gmail.com', key: 'email' },
  ];

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.navy} />
      <AppHeader title="Account" onBack={() => navigation.goBack()} />

      <View style={styles.body}>
        <View style={styles.dragHandle} />
        <ScrollView showsVerticalScrollIndicator={false}>

          {/* Tab Toggle */}
          <View style={styles.tabToggle}>
            {(['Info', 'Privacy'] as const).map((t) => (
              <TouchableOpacity
                key={t}
                style={[styles.toggleBtn, activeTab === t && styles.toggleBtnActive]}
                onPress={() => setActiveTab(t)}
              >
                <Text style={[styles.toggleText, activeTab === t && styles.toggleTextActive]}>
                  {t}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Avatar */}
          <View style={styles.avatarSection}>
            <View style={styles.avatarWrap}>
              <View style={styles.avatarCircle}>
                <Ionicons name="person" size={44} color={COLORS.grayText} />
              </View>
              <TouchableOpacity style={styles.cameraBtn}>
                <Ionicons name="camera" size={16} color={COLORS.white} />
              </TouchableOpacity>
            </View>
          </View>

          {/* Fields */}
          {fields.map((f) => (
            <View key={f.key} style={styles.fieldRow}>
              <Ionicons name={f.icon as any} size={20} color={COLORS.navy} style={styles.fieldIcon} />
              <TextInput
                defaultValue={f.value}
                style={styles.fieldInput}
                placeholderTextColor={COLORS.grayText}
              />
            </View>
          ))}

          <AmberBtn label="Update" style={{ marginTop: 16, marginBottom: 20 }} />
        </ScrollView>
      </View>

      <BottomNav
        active="Account"
        onPress={(tab) => {
          if (tab === 'Home') navigation.navigate('MainTabs', { tab: 'Home' });
          else if (tab === 'Wallet') navigation.navigate('Wallet');
        }}
      />
    </View>
  );
}

// ─── Activity ───────────────────────────────────────────────────────────────
type ActivityProps = NativeStackScreenProps<RootStackParamList, 'Activity'>;

export function ActivityScreen({ navigation }: ActivityProps) {
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.navy} />
      <AppHeader title="Activity" onBack={() => navigation.goBack()} />
      <View style={styles.body}>
        <View style={styles.dragHandle} />
        <View style={styles.activityRow}>
          <View style={styles.activityIcon}>
            <Ionicons name="calendar-outline" size={22} color={COLORS.navy} />
          </View>
          <View>
            <Text style={styles.activityTitle}>Account Created</Text>
            <Text style={styles.activityDate}>20-10-2014</Text>
          </View>
        </View>
      </View>
      <BottomNav active="Account" onPress={(tab) => {
        if (tab === 'Home') navigation.navigate('MainTabs', { tab: 'Home' });
        else if (tab === 'Wallet') navigation.navigate('Wallet');
      }} />
    </View>
  );
}

// ─── Settings ────────────────────────────────────────────────────────────────
type SettingsProps = NativeStackScreenProps<RootStackParamList, 'Settings'>;

export function SettingsScreen({ navigation }: SettingsProps) {
  const insets = useSafeAreaInsets();
  const items = [
    { label: 'Notifications', icon: 'notifications-outline' },
    { label: 'Location', icon: 'location-outline' },
  ];
  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.navy} />
      <AppHeader title="Settings" onBack={() => navigation.goBack()} />
      <View style={styles.body}>
        <View style={styles.dragHandle} />
        {items.map((item) => (
          <TouchableOpacity key={item.label} style={styles.settingRow} activeOpacity={0.75}>
            <View style={styles.settingLeft}>
              <Ionicons name={item.icon as any} size={22} color={COLORS.navy} />
              <Text style={styles.settingLabel}>{item.label}</Text>
            </View>
            <View style={styles.settingChevron}>
              <Ionicons name="chevron-forward" size={14} color={COLORS.white} />
            </View>
          </TouchableOpacity>
        ))}
      </View>
      <BottomNav active="Account" onPress={(tab) => {
        if (tab === 'Home') navigation.navigate('MainTabs', { tab: 'Home' });
        else if (tab === 'Wallet') navigation.navigate('Wallet');
      }} />
    </View>
  );
}

// ─── Messages ────────────────────────────────────────────────────────────────
type MessagesProps = NativeStackScreenProps<RootStackParamList, 'Messages'>;

export function MessagesScreen({ navigation }: MessagesProps) {
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.navy} />
      <AppHeader title="Messages" onBack={() => navigation.goBack()} />
      <View style={[styles.body, styles.centerBody]}>
        <View style={styles.dragHandle} />
        <View style={styles.emptyState}>
          <Ionicons name="mail-open-outline" size={80} color={COLORS.amber} />
          <Text style={styles.emptyText}>No Conversation found</Text>
        </View>
      </View>
      <BottomNav active="Account" onPress={(tab) => {
        if (tab === 'Home') navigation.navigate('MainTabs', { tab: 'Home' });
        else if (tab === 'Wallet') navigation.navigate('Wallet');
      }} />
    </View>
  );
}

// ─── Bank Details ─────────────────────────────────────────────────────────────
type BankDetailsProps = NativeStackScreenProps<RootStackParamList, 'BankDetails'>;

export function BankDetailsScreen({ navigation }: BankDetailsProps) {
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.navy} />
      <AppHeader title="Bank Details" onBack={() => navigation.goBack()} />
      <View style={styles.body}>
        <View style={styles.dragHandle} />
        <TouchableOpacity style={styles.selectRow}>
          <Text style={styles.selectPlaceholder}>Select Bank</Text>
          <Ionicons name="chevron-down" size={18} color={COLORS.grayText} />
        </TouchableOpacity>
        <View style={styles.fieldRow}>
          <Ionicons name="card-outline" size={20} color={COLORS.navy} style={styles.fieldIcon} />
          <TextInput
            placeholder="Account Number"
            placeholderTextColor={COLORS.grayText}
            style={styles.fieldInput}
            keyboardType="numeric"
          />
        </View>
        <AmberBtn label="Save" style={{ marginTop: 24 }} />
      </View>
      <BottomNav active="Account" onPress={(tab) => {
        if (tab === 'Home') navigation.navigate('MainTabs', { tab: 'Home' });
        else if (tab === 'Wallet') navigation.navigate('Wallet');
      }} />
    </View>
  );
}

// ─── Withdraw History ────────────────────────────────────────────────────────
type WithdrawHistoryProps = NativeStackScreenProps<RootStackParamList, 'WithdrawHistory'>;

export function WithdrawHistoryScreen({ navigation }: WithdrawHistoryProps) {
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.navy} />
      <AppHeader title="Withdrawal History" onBack={() => navigation.goBack()} />
      <View style={[styles.body, styles.centerBody]}>
        <View style={styles.dragHandle} />
        <View style={styles.emptyState}>
          <Ionicons name="receipt-outline" size={80} color={COLORS.amber} />
          <Text style={styles.emptyText}>No transaction found</Text>
        </View>
      </View>
      <BottomNav active="Account" onPress={(tab) => {
        if (tab === 'Home') navigation.navigate('MainTabs', { tab: 'Home' });
        else if (tab === 'Wallet') navigation.navigate('Wallet');
      }} />
    </View>
  );
}

// ─── Contact Us ──────────────────────────────────────────────────────────────
type ContactUsProps = NativeStackScreenProps<RootStackParamList, 'ContactUs'>;

export function ContactUsScreen({ navigation }: ContactUsProps) {
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState<'Call Us' | 'Email Us'>('Call Us');

  const contactItems = [
    { icon: 'call-outline', value: '+2348039989997' },
    { icon: 'logo-whatsapp', value: '+2348039989997' },
    {
      icon: 'location-outline',
      value: 'PLOT 8, PROFESSOR GABRIEL OLUSANYA STREET, OFF QMB BUILDERS MART ROAD, ELF BUS-STOP, LEKKI, LAGOS STATE, NIGERIA',
    },
  ];

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.navy} />
      <AppHeader title="Contact us" onBack={() => navigation.goBack()} />
      <View style={styles.body}>
        <View style={styles.dragHandle} />
        <Text style={styles.contactHeading}>Let us know your issue & feedback</Text>

        {/* Toggle */}
        <View style={styles.tabToggle}>
          {(['Call Us', 'Email Us'] as const).map((t) => (
            <TouchableOpacity
              key={t}
              style={[styles.toggleBtn, activeTab === t && styles.toggleBtnActive]}
              onPress={() => setActiveTab(t)}
            >
              <Text style={[styles.toggleText, activeTab === t && styles.toggleTextActive]}>{t}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {contactItems.map((item, i) => (
          <View key={i} style={styles.contactRow}>
            <View style={styles.contactIconWrap}>
              <Ionicons name={item.icon as any} size={22} color={COLORS.navy} />
            </View>
            <Text style={styles.contactValue}>{item.value}</Text>
          </View>
        ))}
      </View>
      <BottomNav active="Account" onPress={(tab) => {
        if (tab === 'Home') navigation.navigate('MainTabs', { tab: 'Home' });
        else if (tab === 'Wallet') navigation.navigate('Wallet');
      }} />
    </View>
  );
}

// ─── About ───────────────────────────────────────────────────────────────────
type AboutProps = NativeStackScreenProps<RootStackParamList, 'About'>;

export function AboutScreen({ navigation }: AboutProps) {
  const insets = useSafeAreaInsets();
  const items = [
    { label: 'Rate the app', icon: 'phone-portrait-outline' },
    { label: "FAQ's", icon: 'help-circle-outline' },
    { label: 'Privacy Policy', icon: 'shield-outline' },
    { label: 'Terms of use', icon: 'document-text-outline' },
  ];
  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.navy} />
      <AppHeader title="About" onBack={() => navigation.goBack()} />
      <View style={styles.body}>
        <View style={styles.dragHandle} />
        {items.map((item) => (
          <TouchableOpacity key={item.label} style={styles.aboutRow} activeOpacity={0.75}>
            <View style={styles.aboutLeft}>
              <Ionicons name={item.icon as any} size={22} color={COLORS.navy} />
              <Text style={styles.aboutLabel}>{item.label}</Text>
            </View>
            <View style={styles.settingChevron}>
              <Ionicons name="chevron-forward" size={14} color={COLORS.white} />
            </View>
          </TouchableOpacity>
        ))}
        <Text style={styles.version}>Version: 1.6.0 (45)</Text>
      </View>
      <BottomNav active="Account" onPress={(tab) => {
        if (tab === 'Home') navigation.navigate('MainTabs', { tab: 'Home' });
        else if (tab === 'Wallet') navigation.navigate('Wallet');
      }} />
    </View>
  );
}

// ─── Bookings ────────────────────────────────────────────────────────────────
type BookingsProps = NativeStackScreenProps<RootStackParamList, 'Bookings'>;

export function BookingsScreen({ navigation }: BookingsProps) {
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.navy} />
      <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
        <View style={styles.bookingHeaderRow}>
          <Text style={styles.bookingHeaderTitle}>Bookings</Text>
        </View>
      </View>
      <View style={[styles.body, styles.centerBody]}>
        <View style={styles.dragHandle} />
        <View style={styles.emptyState}>
          <Ionicons name="calendar-outline" size={80} color={COLORS.amber} />
          <Text style={styles.emptyText}>No bookings yet</Text>
        </View>
      </View>
      <BottomNav active="Bookings" onPress={(tab) => {
        if (tab === 'Home') navigation.navigate('MainTabs', { tab: 'Home' });
        else if (tab === 'Wallet') navigation.navigate('Wallet');
        else if (tab === 'Account') navigation.navigate('Account');
      }} />
    </View>
  );
}

// ─── Shared Styles ───────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.navy },
  header: {
    backgroundColor: COLORS.navy,
    paddingHorizontal: SPACING.xl,
    paddingBottom: SPACING.xl,
  },
  bookingHeaderRow: { alignItems: 'center' },
  bookingHeaderTitle: {
    color: COLORS.white,
    fontSize: 18,
    fontWeight: FONTS.bold,
  },
  body: {
    flex: 1,
    backgroundColor: COLORS.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.md,
  },
  centerBody: { alignItems: undefined },
  dragHandle: {
    width: 40,
    height: 4,
    backgroundColor: COLORS.grayLight,
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: SPACING.lg,
  },
  // Tab Toggle
  tabToggle: {
    flexDirection: 'row',
    backgroundColor: COLORS.grayBg,
    borderRadius: RADIUS.full,
    padding: 4,
    marginBottom: SPACING.xl,
  },
  toggleBtn: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: RADIUS.full,
  },
  toggleBtnActive: { backgroundColor: COLORS.amber },
  toggleText: {
    fontSize: 14,
    fontWeight: FONTS.semiBold,
    color: COLORS.grayText,
  },
  toggleTextActive: { color: COLORS.white },
  // Avatar
  avatarSection: { alignItems: 'center', marginBottom: SPACING.xl },
  avatarWrap: { position: 'relative' },
  avatarCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#e0e0e0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cameraBtn: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: COLORS.amber,
    alignItems: 'center',
    justifyContent: 'center',
  },
  // Fields
  fieldRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: COLORS.grayBorder,
    borderRadius: RADIUS.lg,
    paddingHorizontal: SPACING.md,
    paddingVertical: 4,
    marginBottom: SPACING.md,
  },
  fieldIcon: { marginRight: 10 },
  fieldInput: {
    flex: 1,
    fontSize: 15,
    color: COLORS.textPrimary,
    paddingVertical: 12,
  },
  // Select Row
  selectRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1.5,
    borderColor: COLORS.grayBorder,
    borderRadius: RADIUS.lg,
    paddingHorizontal: SPACING.lg,
    paddingVertical: 16,
    marginBottom: SPACING.md,
  },
  selectPlaceholder: {
    fontSize: 15,
    color: COLORS.grayText,
  },
  // Activity
  activityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: COLORS.grayBorder,
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
    gap: 12,
  },
  activityIcon: {
    width: 40,
    height: 40,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.grayBg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activityTitle: {
    fontSize: 15,
    fontWeight: FONTS.bold,
    color: COLORS.navy,
  },
  activityDate: {
    fontSize: 13,
    color: COLORS.grayText,
    marginTop: 2,
  },
  // Settings
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1.5,
    borderColor: COLORS.grayBorder,
    borderRadius: RADIUS.lg,
    paddingVertical: 16,
    paddingHorizontal: SPACING.lg,
    marginBottom: SPACING.md,
  },
  settingLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  settingLabel: {
    fontSize: 15,
    fontWeight: FONTS.semiBold,
    color: COLORS.navy,
  },
  settingChevron: {
    width: 28,
    height: 28,
    borderRadius: RADIUS.sm,
    backgroundColor: COLORS.navy,
    alignItems: 'center',
    justifyContent: 'center',
  },
  // Empty
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 40,
    gap: 16,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: FONTS.bold,
    color: COLORS.navy,
    textAlign: 'center',
  },
  // Contact
  contactHeading: {
    fontSize: 20,
    fontWeight: FONTS.bold,
    color: COLORS.navy,
    marginBottom: SPACING.xl,
  },
  contactRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    borderWidth: 1.5,
    borderColor: COLORS.grayBorder,
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
    marginBottom: SPACING.md,
    gap: 14,
  },
  contactIconWrap: { marginTop: 2 },
  contactValue: {
    flex: 1,
    fontSize: 14,
    fontWeight: FONTS.semiBold,
    color: COLORS.navy,
  },
  // About
  aboutRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1.5,
    borderColor: COLORS.grayBorder,
    borderRadius: RADIUS.lg,
    paddingVertical: 16,
    paddingHorizontal: SPACING.lg,
    marginBottom: SPACING.md,
  },
  aboutLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  aboutLabel: {
    fontSize: 15,
    fontWeight: FONTS.semiBold,
    color: COLORS.navy,
  },
  version: {
    fontSize: 13,
    color: COLORS.grayText,
    marginTop: SPACING.md,
  },
});
