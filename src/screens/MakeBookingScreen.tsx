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
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { AppHeader, AmberBtn } from '../components';
import { COLORS, FONTS, RADIUS, SPACING } from '../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'MakeBooking'>;

type ServiceType = 'Vehicle Haulage' | 'Car Towing' | 'Ambulance';

const SERVICE_TABS: { label: ServiceType; icon: string }[] = [
  { label: 'Vehicle Haulage', icon: 'truck' },
  { label: 'Car Towing', icon: 'tow-truck' },
  { label: 'Ambulance', icon: 'ambulance' },
];

export default function MakeBookingScreen({ navigation, route }: Props) {
  const insets = useSafeAreaInsets();
  const initialType = (route.params?.type as ServiceType) || 'Car Towing';
  const [activeService, setActiveService] = useState<ServiceType>(initialType);
  const [note, setNote] = useState('');

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.navy} />
      <AppHeader title="Make a booking" onBack={() => navigation.goBack()} />

      <View style={styles.body}>
        <View style={styles.dragHandle} />
        <ScrollView showsVerticalScrollIndicator={false}>

          {/* Service Type Tabs */}
          <View style={styles.tabRow}>
            {SERVICE_TABS.map((svc) => {
              const isActive = activeService === svc.label;
              return (
                <TouchableOpacity
                  key={svc.label}
                  style={[styles.tabCard, isActive && styles.tabCardActive]}
                  onPress={() => setActiveService(svc.label)}
                  activeOpacity={0.8}
                >
                  <MaterialCommunityIcons
                    name={svc.icon as any}
                    size={28}
                    color={isActive ? COLORS.white : COLORS.navy}
                  />
                  <Text style={[styles.tabLabel, isActive && styles.tabLabelActive]}>
                    {svc.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Location Card */}
          <View style={styles.locationCard}>
            {/* Pickup */}
            <View style={styles.locationRow}>
              <Ionicons name="location" size={18} color="#E74C3C" style={styles.locationIcon} />
              <View style={styles.locationTextWrap}>
                <Text style={styles.locationLabel}>Pickup location</Text>
                <Text style={styles.locationValue}>
                  6 Visa, Yisa Omotunde St, Ketu, Lagos 105102, Lagos
                </Text>
              </View>
            </View>

            {/* Swap button */}
            <TouchableOpacity style={styles.swapBtn}>
              <Ionicons name="swap-vertical" size={18} color={COLORS.white} />
            </TouchableOpacity>

            {/* Destination */}
            <View style={[styles.locationRow, { marginTop: 8 }]}>
              <Ionicons name="location" size={18} color={COLORS.success} style={styles.locationIcon} />
              <View style={styles.locationTextWrap}>
                <Text style={styles.locationLabel}>Where to</Text>
                <TouchableOpacity onPress={() => navigation.navigate('YourRoute')}>
                  <Text style={[styles.locationValue, styles.locationPlaceholder]}>
                    Where to
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {/* Vehicle Type & Time Row */}
          <View style={styles.optionRow}>
            <TouchableOpacity
              style={styles.optionBtn}
              onPress={() => navigation.navigate('VehicleType')}
            >
              <Ionicons name="car-outline" size={18} color={COLORS.navy} />
              <Text style={styles.optionBtnText}>Vehicle Type</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.optionBtn}>
              <Ionicons name="time-outline" size={18} color={COLORS.navy} />
              <Text style={styles.optionBtnText}>Now</Text>
            </TouchableOpacity>
          </View>

          {/* Upload Images */}
          <TouchableOpacity style={styles.uploadRow}>
            <Ionicons name="image-outline" size={20} color={COLORS.navy} />
            <Text style={styles.uploadText}>Upload Images</Text>
          </TouchableOpacity>

          {/* Note */}
          <View style={styles.noteBox}>
            <TextInput
              placeholder="Enter Note"
              placeholderTextColor={COLORS.grayText}
              multiline
              numberOfLines={4}
              value={note}
              onChangeText={setNote}
              style={styles.noteInput}
            />
          </View>

          <AmberBtn
            label="Continue"
            onPress={() => navigation.navigate('YourRoute')}
            style={{ marginBottom: 20 }}
          />

        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.navy },
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
  // Tabs
  tabRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: SPACING.lg,
  },
  tabCard: {
    flex: 1,
    borderWidth: 1.5,
    borderColor: COLORS.grayBorder,
    borderRadius: RADIUS.lg,
    paddingVertical: 14,
    alignItems: 'center',
    gap: 6,
    backgroundColor: COLORS.white,
  },
  tabCardActive: {
    backgroundColor: COLORS.navy,
    borderColor: COLORS.navy,
  },
  tabLabel: {
    fontSize: 11,
    fontWeight: FONTS.semiBold,
    color: COLORS.navy,
    textAlign: 'center',
  },
  tabLabelActive: { color: COLORS.white },
  // Location
  locationCard: {
    borderWidth: 1.5,
    borderColor: COLORS.grayBorder,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    position: 'relative',
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: COLORS.grayBg,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
  },
  locationIcon: { marginTop: 2, marginRight: 10 },
  locationTextWrap: { flex: 1 },
  locationLabel: { fontSize: 12, color: COLORS.grayText, marginBottom: 2 },
  locationValue: {
    fontSize: 14,
    color: COLORS.textPrimary,
    fontWeight: FONTS.medium,
  },
  locationPlaceholder: { color: COLORS.grayText },
  swapBtn: {
    position: 'absolute',
    right: 20,
    top: '50%',
    marginTop: -20,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.amber,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  // Options row
  optionRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: SPACING.md,
  },
  optionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderWidth: 1.5,
    borderColor: COLORS.grayBorder,
    borderRadius: RADIUS.lg,
    paddingVertical: 14,
    paddingHorizontal: 14,
  },
  optionBtnText: {
    fontSize: 14,
    fontWeight: FONTS.semiBold,
    color: COLORS.navy,
  },
  // Upload
  uploadRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    borderWidth: 1.5,
    borderColor: COLORS.grayBorder,
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
    marginBottom: SPACING.md,
  },
  uploadText: {
    fontSize: 14,
    fontWeight: FONTS.semiBold,
    color: COLORS.navy,
  },
  // Note
  noteBox: {
    borderWidth: 1.5,
    borderColor: COLORS.grayBorder,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    minHeight: 100,
  },
  noteInput: {
    fontSize: 14,
    color: COLORS.textPrimary,
    textAlignVertical: 'top',
  },
});
