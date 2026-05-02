import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  StatusBar,
  Image,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { BottomNav } from '../components';
import { COLORS, FONTS, RADIUS, SPACING } from '../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'MainTabs'>;

const SERVICE_CARDS = [
  { key: 'haulage', label: 'Vehicle Haulage', icon: 'truck' as const },
  { key: 'towing', label: 'Car Towing', icon: 'tow-truck' as const },
  { key: 'ambulance', label: 'Ambulance', icon: 'ambulance' as const },
];

export default function HomeScreen({ navigation }: Props) {
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.navy} />

      {/* Navy Header */}
      <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
        <View style={styles.headerLeft}>
          <View style={styles.avatarCircle}>
            <Ionicons name="person" size={22} color={COLORS.grayText} />
          </View>
          <View style={{ marginLeft: 10 }}>
            <Text style={styles.welcomeText}>Welcome</Text>
            <Text style={styles.nameText}>Esther</Text>
          </View>
        </View>
        <View style={styles.headerIcons}>
          <TouchableOpacity
            style={styles.iconBtn}
            onPress={() => navigation.navigate('Messages')}
          >
            <Ionicons name="mail-outline" size={20} color={COLORS.white} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconBtn}>
            <Ionicons name="notifications-outline" size={20} color={COLORS.white} />
          </TouchableOpacity>
        </View>
      </View>

      {/* White Body */}
      <View style={styles.body}>
        <View style={styles.dragHandle} />
        <ScrollView showsVerticalScrollIndicator={false}>

          {/* Track Booking */}
          <View style={styles.trackCard}>
            <View style={styles.trackTop}>
              <Text style={styles.trackTitle}>Track Your Booking</Text>
              <TouchableOpacity style={styles.recentBtn}>
                <Ionicons name="time-outline" size={14} color={COLORS.navy} />
                <Text style={styles.recentText}>Recent</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.trackInputRow}>
              <Ionicons name="search" size={18} color={COLORS.grayText} style={{ marginRight: 8 }} />
              <TextInput
                placeholder="Enter the tracking number"
                placeholderTextColor={COLORS.grayText}
                style={styles.trackInput}
              />
              <TouchableOpacity style={styles.trackSearchBtn}>
                <Ionicons name="search" size={18} color={COLORS.white} />
              </TouchableOpacity>
            </View>
          </View>

          {/* Make a booking */}
          <Text style={styles.sectionTitle}>Make a booking</Text>
          <View style={styles.serviceRow}>
            {SERVICE_CARDS.map((svc) => (
              <TouchableOpacity
                key={svc.key}
                style={styles.serviceCard}
                activeOpacity={0.75}
                onPress={() => navigation.navigate('MakeBooking', { type: svc.label })}
              >
                <MaterialCommunityIcons name={svc.icon} size={32} color={COLORS.navy} />
                <Text style={styles.serviceLabel}>{svc.label}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Notifications */}
          <Text style={styles.sectionTitle}>Notifications</Text>
          <View style={styles.emptyNotif}>
            <Text style={styles.emptyNotifText}>No notifications</Text>
          </View>

        </ScrollView>
      </View>

      <BottomNav
        active="Home"
        onPress={(tab) => {
          if (tab === 'Wallet') navigation.navigate('Wallet');
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.xl,
    paddingBottom: SPACING.xl,
  },
  headerLeft: { flexDirection: 'row', alignItems: 'center' },
  avatarCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#e0e0e0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  welcomeText: { color: 'rgba(255,255,255,0.7)', fontSize: 13 },
  nameText: { color: COLORS.white, fontSize: 17, fontWeight: FONTS.bold },
  headerIcons: { flexDirection: 'row', gap: 10 },
  iconBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  // Body
  body: {
    flex: 1,
    backgroundColor: COLORS.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  dragHandle: {
    width: 40,
    height: 4,
    backgroundColor: COLORS.grayLight,
    borderRadius: 2,
    alignSelf: 'center',
    marginTop: 12,
    marginBottom: 16,
  },
  // Track card
  trackCard: {
    borderWidth: 1.5,
    borderColor: COLORS.grayBorder,
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
    marginHorizontal: SPACING.lg,
    marginBottom: SPACING.xl,
  },
  trackTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  trackTitle: {
    color: COLORS.navy,
    fontSize: 16,
    fontWeight: FONTS.bold,
  },
  recentBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  recentText: {
    color: COLORS.navy,
    fontSize: 13,
    fontWeight: FONTS.semiBold,
  },
  trackInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.grayBg,
    borderRadius: RADIUS.md,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  trackInput: {
    flex: 1,
    fontSize: 14,
    color: COLORS.textPrimary,
    paddingVertical: 10,
  },
  trackSearchBtn: {
    width: 36,
    height: 36,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.navy,
    alignItems: 'center',
    justifyContent: 'center',
  },
  // Section
  sectionTitle: {
    color: COLORS.navy,
    fontSize: 17,
    fontWeight: FONTS.bold,
    marginHorizontal: SPACING.lg,
    marginBottom: 12,
  },
  // Service cards
  serviceRow: {
    flexDirection: 'row',
    gap: 10,
    marginHorizontal: SPACING.lg,
    marginBottom: SPACING.xl,
  },
  serviceCard: {
    flex: 1,
    borderWidth: 1.5,
    borderColor: COLORS.grayBorder,
    borderRadius: RADIUS.lg,
    paddingVertical: 16,
    alignItems: 'center',
    gap: 8,
  },
  serviceLabel: {
    color: COLORS.navy,
    fontSize: 11,
    fontWeight: FONTS.semiBold,
    textAlign: 'center',
  },
  // Empty notif
  emptyNotif: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyNotifText: {
    color: COLORS.navy,
    fontSize: 16,
    fontWeight: FONTS.bold,
  },
});
