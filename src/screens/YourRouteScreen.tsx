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
import { AppHeader } from '../components';
import { COLORS, FONTS, RADIUS, SPACING } from '../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'YourRoute'>;

const POPULAR_PLACES = [
  {
    id: '1',
    name: 'Gifted City Ventures',
    address: '2 Isa Omotunde Alapere Lagos Ketu Agboyi, Lagos',
    icon: 'storefront-outline' as const,
  },
  {
    id: '2',
    name: 'Davland Global Ventures',
    address: '24 Demurin Street, Lagos',
    icon: 'bag-handle-outline' as const,
  },
  {
    id: '3',
    name: '2 Clean Car Wash',
    address: '34 Julius Elebiju Street, Lagos',
    icon: 'storefront-outline' as const,
  },
  {
    id: '4',
    name: 'Mr Basiru Battery Charger Shop',
    address: '42 Julius Elebiju Street, Lagos',
    icon: 'storefront-outline' as const,
  },
  {
    id: '5',
    name: 'Ekene Investment',
    address: '41 Julius Elebiju Street, Lagos',
    icon: 'storefront-outline' as const,
  },
];

export default function YourRouteScreen({ navigation }: Props) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.navy} />
      <AppHeader
        title="Your Route"
        onBack={() => navigation.goBack()}
        rightElement={
          <TouchableOpacity style={styles.locationBtn}>
            <Ionicons name="location" size={20} color={COLORS.white} />
          </TouchableOpacity>
        }
      />

      <View style={styles.body}>
        <View style={styles.dragHandle} />
        <ScrollView showsVerticalScrollIndicator={false}>

          {/* Route Card */}
          <View style={styles.routeCard}>
            {/* Pickup */}
            <View style={styles.routeRow}>
              <Ionicons name="location" size={18} color="#E74C3C" style={styles.pinIcon} />
              <View style={styles.routeTextWrap}>
                <Text style={styles.routeSmallLabel}>Pickup</Text>
                <Text style={styles.routeAddress}>
                  6 Visa, Yisa Omotunde St, Ketu, Lagos 105102, Lagos
                </Text>
              </View>
            </View>

            {/* Swap */}
            <TouchableOpacity style={styles.swapBtn}>
              <Ionicons name="swap-vertical" size={18} color={COLORS.white} />
            </TouchableOpacity>

            {/* Destination */}
            <View style={[styles.routeRow, { marginTop: 8 }]}>
              <Ionicons name="location" size={18} color={COLORS.success} style={styles.pinIcon} />
              <View style={styles.routeTextWrap}>
                <Text style={styles.routeSmallLabel}>Destination</Text>
                <Text style={styles.routeAddress}>Ketu, Lagos, Nigeria</Text>
              </View>
            </View>
          </View>

          {/* Popular Places */}
          <Text style={styles.sectionTitle}>Popular places</Text>
          {POPULAR_PLACES.map((place) => (
            <TouchableOpacity key={place.id} style={styles.placeRow} activeOpacity={0.75}>
              <View style={styles.placeIconWrap}>
                <Ionicons name={place.icon} size={20} color={COLORS.navy} />
              </View>
              <View style={styles.placeText}>
                <Text style={styles.placeName}>{place.name}</Text>
                <Text style={styles.placeAddress}>{place.address}</Text>
              </View>
            </TouchableOpacity>
          ))}

          <View style={{ height: 20 }} />
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
  locationBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.success,
    alignItems: 'center',
    justifyContent: 'center',
  },
  // Route card
  routeCard: {
    borderWidth: 1.5,
    borderColor: COLORS.grayBorder,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    marginBottom: SPACING.xl,
    position: 'relative',
  },
  routeRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: COLORS.grayBg,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
  },
  pinIcon: { marginTop: 2, marginRight: 10 },
  routeTextWrap: { flex: 1 },
  routeSmallLabel: { fontSize: 12, color: COLORS.grayText, marginBottom: 2 },
  routeAddress: {
    fontSize: 14,
    color: COLORS.textPrimary,
    fontWeight: FONTS.medium,
  },
  swapBtn: {
    position: 'absolute',
    right: 16,
    top: '50%',
    marginTop: -18,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.amber,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  // Section
  sectionTitle: {
    color: COLORS.navy,
    fontSize: 17,
    fontWeight: FONTS.bold,
    marginBottom: 12,
  },
  // Place row
  placeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: COLORS.grayBorder,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    marginBottom: SPACING.sm,
    gap: 12,
  },
  placeIconWrap: {
    width: 40,
    height: 40,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.grayBg,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: COLORS.grayBorder,
  },
  placeText: { flex: 1 },
  placeName: {
    fontSize: 14,
    fontWeight: FONTS.bold,
    color: COLORS.navy,
    marginBottom: 3,
  },
  placeAddress: { fontSize: 12, color: COLORS.grayText },
});
