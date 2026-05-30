import React, { useEffect } from 'react';
import { View, Text, StyleSheet, StatusBar } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { COLORS } from '../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'Splash'>;

export default function SplashScreen({ navigation }: Props) {
  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.navigate('MainTabs', { tab: 'Home' });
    }, 2200);
    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.navy} />
      <View style={styles.logoWrapper}>
        {/* T */}
        <Text style={styles.logoAmber}>T</Text>
        {/* o with pin */}
        <View style={styles.oWrap}>
          <Text style={styles.logoWhite}>o</Text>
          <View style={styles.pin}>
            <View style={styles.pinCircle} />
            <View style={styles.pinTail} />
          </View>
        </View>
        {/* wmi */}
        <Text style={styles.logoAmber}>w</Text>
        <Text style={styles.logoWhite}>mi</Text>
      </View>
      {/* smile */}
      <View style={styles.smileWrapper}>
        <View style={styles.smile} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.navy,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoAmber: {
    fontSize: 64,
    fontWeight: '800',
    color: COLORS.amber,
    letterSpacing: -1,
  },
  logoWhite: {
    fontSize: 64,
    fontWeight: '800',
    color: COLORS.white,
    letterSpacing: -1,
  },
  oWrap: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pin: {
    position: 'absolute',
    top: 10,
    alignItems: 'center',
  },
  pinCircle: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: COLORS.amber,
  },
  pinTail: {
    width: 3,
    height: 6,
    backgroundColor: COLORS.amber,
    borderBottomLeftRadius: 2,
    borderBottomRightRadius: 2,
  },
  smileWrapper: {
    marginTop: -8,
    marginLeft: 120,
  },
  smile: {
    width: 36,
    height: 18,
    borderBottomLeftRadius: 18,
    borderBottomRightRadius: 18,
    borderWidth: 3,
    borderColor: COLORS.white,
    borderTopWidth: 0,
  },
});
