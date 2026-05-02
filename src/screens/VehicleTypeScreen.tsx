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
import { Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { AppHeader, AmberBtn } from '../components';
import { COLORS, FONTS, RADIUS, SPACING } from '../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'VehicleType'>;

const VEHICLE_TYPES = ['SUV', 'Saloon', 'Crossover', 'Mini Bus', 'Bus', 'Truck'];

export default function VehicleTypeScreen({ navigation }: Props) {
  const insets = useSafeAreaInsets();
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.navy} />
      <AppHeader title="Vehicle type" onBack={() => navigation.goBack()} />

      <View style={styles.body}>
        <View style={styles.dragHandle} />
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ flex: 1 }}>

          {VEHICLE_TYPES.map((type) => {
            const isSelected = selected === type;
            return (
              <TouchableOpacity
                key={type}
                style={[styles.vehicleRow, isSelected && styles.vehicleRowSelected]}
                onPress={() => setSelected(type)}
                activeOpacity={0.75}
              >
                <Text style={[styles.vehicleLabel, isSelected && styles.vehicleLabelSelected]}>
                  {type}
                </Text>
                <View style={[styles.radio, isSelected && styles.radioSelected]}>
                  {isSelected && <View style={styles.radioInner} />}
                </View>
              </TouchableOpacity>
            );
          })}

          <View style={{ flex: 1 }} />
        </ScrollView>

        <AmberBtn
          label="Continue"
          onPress={() => navigation.goBack()}
          style={{ marginBottom: insets.bottom || 12 }}
        />
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
  vehicleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1.5,
    borderColor: COLORS.grayBorder,
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
    marginBottom: SPACING.md,
  },
  vehicleRowSelected: {
    borderColor: COLORS.navy,
    backgroundColor: '#f0f4ff',
  },
  vehicleLabel: {
    fontSize: 15,
    fontWeight: FONTS.semiBold,
    color: COLORS.navy,
  },
  vehicleLabelSelected: {
    fontWeight: FONTS.bold,
  },
  radio: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: COLORS.grayBorder,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioSelected: {
    borderColor: COLORS.navy,
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: COLORS.navy,
  },
});
