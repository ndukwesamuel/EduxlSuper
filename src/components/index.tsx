import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons, Feather } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS, FONTS, RADIUS, SPACING } from '../theme';

// ─── Header ────────────────────────────────────────────────────────────────
interface HeaderProps {
  title: string;
  onBack?: () => void;
  rightElement?: React.ReactNode;
}
export const AppHeader: React.FC<HeaderProps> = ({ title, onBack, rightElement }) => {
  return (
    <View style={styles.header}>
      <View style={styles.headerLeft}>
        {onBack ? (
          <TouchableOpacity style={styles.iconCircle} onPress={onBack} activeOpacity={0.7}>
            <Ionicons name="chevron-back" size={20} color={COLORS.white} />
          </TouchableOpacity>
        ) : (
          <View style={styles.iconCirclePlaceholder} />
        )}
      </View>
      <Text style={styles.headerTitle}>{title}</Text>
      <View style={styles.headerRight}>
        {rightElement ?? <View style={styles.iconCirclePlaceholder} />}
      </View>
    </View>
  );
};

// ─── Bottom Nav ─────────────────────────────────────────────────────────────
type TabName = 'Home' | 'Bookings' | 'Wallet' | 'Account';
interface BottomNavProps {
  active: TabName;
  onPress: (tab: TabName) => void;
}
export const BottomNav: React.FC<BottomNavProps> = ({ active, onPress }) => {
  const insets = useSafeAreaInsets();
  const tabs: { name: TabName; icon: string }[] = [
    { name: 'Home', icon: 'home-outline' },
    { name: 'Bookings', icon: 'calendar-outline' },
    { name: 'Wallet', icon: 'wallet-outline' },
    { name: 'Account', icon: 'person-outline' },
  ];
  return (
    <View style={[styles.bottomNav, { paddingBottom: insets.bottom || 8 }]}>
      {tabs.map((tab) => {
        const isActive = active === tab.name;
        return (
          <TouchableOpacity
            key={tab.name}
            style={styles.navItem}
            onPress={() => onPress(tab.name)}
            activeOpacity={0.7}
          >
            <Ionicons
              name={tab.icon as any}
              size={22}
              color={isActive ? COLORS.navy : COLORS.grayText}
            />
            <Text style={[styles.navLabel, isActive && styles.navLabelActive]}>
              {tab.name}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

// ─── White Body Panel ────────────────────────────────────────────────────────
interface BodyPanelProps {
  children: React.ReactNode;
  style?: ViewStyle;
}
export const BodyPanel: React.FC<BodyPanelProps> = ({ children, style }) => (
  <View style={[styles.bodyPanel, style]}>
    <View style={styles.dragHandle} />
    {children}
  </View>
);

// ─── Menu Row ───────────────────────────────────────────────────────────────
interface MenuRowProps {
  icon: string;
  iconLib?: 'Ionicons' | 'MaterialCommunityIcons' | 'Feather';
  label: string;
  onPress?: () => void;
  isLast?: boolean;
}
export const MenuRow: React.FC<MenuRowProps> = ({
  icon,
  iconLib = 'Ionicons',
  label,
  onPress,
  isLast,
}) => {
  const IconComp = iconLib === 'MaterialCommunityIcons' ? MaterialCommunityIcons : iconLib === 'Feather' ? Feather : Ionicons;
  return (
    <TouchableOpacity
      style={[styles.menuRow, !isLast && styles.menuRowBorder]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.menuRowLeft}>
        <IconComp name={icon as any} size={20} color={COLORS.navy} />
        <Text style={styles.menuRowLabel}>{label}</Text>
      </View>
      <View style={styles.menuChevron}>
        <Ionicons name="chevron-forward" size={14} color={COLORS.white} />
      </View>
    </TouchableOpacity>
  );
};

// ─── Amber Button ────────────────────────────────────────────────────────────
interface AmberBtnProps {
  label: string;
  onPress?: () => void;
  style?: ViewStyle;
}
export const AmberBtn: React.FC<AmberBtnProps> = ({ label, onPress, style }) => (
  <TouchableOpacity style={[styles.amberBtn, style]} onPress={onPress} activeOpacity={0.85}>
    <Text style={styles.amberBtnText}>{label}</Text>
  </TouchableOpacity>
);

// ─── Outlined Card Row ───────────────────────────────────────────────────────
interface OutlineRowProps {
  children: React.ReactNode;
  onPress?: () => void;
  style?: ViewStyle;
}
export const OutlineRow: React.FC<OutlineRowProps> = ({ children, onPress, style }) => (
  <TouchableOpacity
    style={[styles.outlineRow, style]}
    onPress={onPress}
    activeOpacity={0.7}
  >
    {children}
  </TouchableOpacity>
);

// ─── Section Title ───────────────────────────────────────────────────────────
export const SectionTitle: React.FC<{ label: string; style?: TextStyle }> = ({ label, style }) => (
  <Text style={[styles.sectionTitle, style]}>{label}</Text>
);

// ─── Empty State ─────────────────────────────────────────────────────────────
export const EmptyState: React.FC<{ message: string }> = ({ message }) => (
  <View style={styles.emptyState}>
    <Text style={styles.emptyText}>{message}</Text>
  </View>
);

const styles = StyleSheet.create({
  // Header
  header: {
    backgroundColor: COLORS.navy,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.lg,
    paddingBottom: SPACING.xl,
  },
  headerLeft: { width: 40, alignItems: 'flex-start' },
  headerRight: { width: 40, alignItems: 'flex-end' },
  headerTitle: {
    flex: 1,
    color: COLORS.white,
    fontSize: 18,
    fontWeight: FONTS.bold,
    textAlign: 'center',
  },
  iconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.18)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconCirclePlaceholder: { width: 36, height: 36 },
  // Bottom Nav
  bottomNav: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    borderTopWidth: 1,
    borderTopColor: COLORS.grayBorder,
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 10,
  },
  navLabel: {
    fontSize: 10,
    color: COLORS.grayText,
    marginTop: 3,
  },
  navLabelActive: {
    color: COLORS.navy,
    fontWeight: FONTS.semiBold,
  },
  // Body Panel
  bodyPanel: {
    backgroundColor: COLORS.white,
    borderTopLeftRadius: RADIUS.xl,
    borderTopRightRadius: RADIUS.xl,
    flex: 1,
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.md,
    paddingBottom: SPACING.lg,
  },
  dragHandle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: COLORS.grayLight,
    alignSelf: 'center',
    marginBottom: SPACING.lg,
  },
  // Menu Row
  menuRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: SPACING.md,
  },
  menuRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  menuRowLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  menuRowLabel: {
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
  // Amber Button
  amberBtn: {
    backgroundColor: COLORS.amber,
    borderRadius: RADIUS.lg,
    paddingVertical: 16,
    alignItems: 'center',
  },
  amberBtnText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: FONTS.bold,
  },
  // Outline Row
  outlineRow: {
    borderWidth: 1.5,
    borderColor: COLORS.grayBorder,
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
    marginBottom: SPACING.md,
  },
  // Section title
  sectionTitle: {
    color: COLORS.navy,
    fontSize: 17,
    fontWeight: FONTS.bold,
    marginBottom: SPACING.md,
  },
  // Empty State
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    color: COLORS.navy,
    fontSize: 16,
    fontWeight: FONTS.bold,
    textAlign: 'center',
  },
});
