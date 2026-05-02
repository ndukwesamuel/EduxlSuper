// ─── CareerClarity Design System ─────────────────────────────────
// Source of truth for all visual tokens.
// Every screen and component imports from here — never hardcode values.

export const Colors = {
  // ── Brand ──────────────────────────────────────────────────────
  brand:       '#1D4ED8',   // Royal Blue — primary CTA, links
  brandLight:  '#3B82F6',   // Electric Blue — hover, highlights
  brandDark:   '#1E3A8A',   // Navy — headers, heavy emphasis

  // ── Gold / XP ──────────────────────────────────────────────────
  gold:        '#F59E0B',   // Amber — XP, achievements, premium
  goldLight:   '#FCD34D',   // Light Amber — XP bar fill, badge glow

  // ── Semantic ───────────────────────────────────────────────────
  success:     '#10B981',   // Correct answers, streak active
  danger:      '#EF4444',   // Wrong answers, timer critical
  warning:     '#F97316',   // Speed mode, medium difficulty
  purple:      '#7C3AED',   // Logical module
  cyan:        '#0891B2',   // Verbal module

  // ── Backgrounds ────────────────────────────────────────────────
  background:  '#F8FAFC',   // App background — off-white
  surface:     '#FFFFFF',   // Cards, modals
  surface2:    '#F1F5F9',   // Secondary cards, inputs
  border:      '#E2E8F0',   // Dividers, card borders
  borderDark:  '#CBD5E1',   // Active borders

  // ── Text ───────────────────────────────────────────────────────
  textPrimary:   '#0F172A', // Near-black
  textSecondary: '#475569', // Slate grey
  textMuted:     '#94A3B8', // Light grey
  textInverse:   '#FFFFFF', // White — on dark backgrounds

  // ── Module colours ─────────────────────────────────────────────
  numerical: '#1D4ED8',     // Blue
  verbal:    '#0891B2',     // Cyan
  logical:   '#7C3AED',     // Purple
  abstract:  '#EA580C',     // Orange

  // ── Module light backgrounds ───────────────────────────────────
  numericalBg: '#EFF6FF',
  verbalBg:    '#ECFEFF',
  logicalBg:   '#F5F3FF',
  abstractBg:  '#FFF7ED',

  // ── Overlay ────────────────────────────────────────────────────
  overlay:     'rgba(15, 23, 42, 0.6)',
};

export const Spacing = {
  xs:   4,
  sm:   8,
  md:   12,
  lg:   16,
  xl:   20,
  '2xl': 24,
  '3xl': 32,
  '4xl': 40,
  '5xl': 48,
  '6xl': 64,
};

export const Radius = {
  sm:   6,
  md:   10,
  lg:   14,
  xl:   18,
  '2xl': 24,
  full: 9999,
};

export const FontSize = {
  micro:      11,
  caption:    12,
  bodySmall:  13,
  body:       15,
  bodyLarge:  16,
  heading3:   17,
  heading2:   20,
  heading1:   24,
  displayL:   28,
  displayXL:  32,
};

export const FontWeight = {
  regular:   '400' as const,
  medium:    '500' as const,
  semibold:  '600' as const,
  bold:      '700' as const,
  extrabold: '800' as const,
};

export const FontFamily = {
  display:  'PlusJakartaSans_700Bold',
  heading:  'PlusJakartaSans_600SemiBold',
  bodyBold: 'Inter_600SemiBold',
  body:     'Inter_400Regular',
  mono:     'JetBrainsMono_500Medium',
};

// ── Shadow helpers ────────────────────────────────────────────────
export const Shadows = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 6,
  },
  brand: {
    shadowColor: '#1D4ED8',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 5,
  },
  gold: {
    shadowColor: '#F59E0B',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.30,
    shadowRadius: 12,
    elevation: 5,
  },
};

// ── Animation durations ───────────────────────────────────────────
export const Duration = {
  fast:   150,
  normal: 250,
  slow:   400,
  bounce: 600,
};

// ── Module config helper ──────────────────────────────────────────
export type ModuleId = 'numerical' | 'verbal' | 'logical' | 'abstract';

export const ModuleConfig: Record<ModuleId, {
  label: string; icon: string; color: string; bgColor: string;
  description: string; topics: string[];
}> = {
  numerical: {
    label: 'Numerical Reasoning',
    icon: '🔢',
    color: Colors.numerical,
    bgColor: Colors.numericalBg,
    description: 'Percentages, ratios, data tables, profit & loss.',
    topics: ['Percentages', 'Ratios', 'Data Interpretation', 'Profit & Loss', 'Interest'],
  },
  verbal: {
    label: 'Verbal Reasoning',
    icon: '📖',
    color: Colors.verbal,
    bgColor: Colors.verbalBg,
    description: 'Reading comprehension, True/False/Cannot Say, vocabulary.',
    topics: ['Comprehension', 'True/False/Cannot Say', 'Vocabulary', 'Grammar'],
  },
  logical: {
    label: 'Logical Reasoning',
    icon: '🧠',
    color: Colors.logical,
    bgColor: Colors.logicalBg,
    description: 'Number sequences, deductive logic, pattern recognition.',
    topics: ['Number Sequences', 'Deductive Logic', 'Odd One Out', 'Syllogisms'],
  },
  abstract: {
    label: 'Abstract Reasoning',
    icon: '🔷',
    color: Colors.abstract,
    bgColor: Colors.abstractBg,
    description: 'Pattern matrices, shape sequences, rule identification.',
    topics: ['Number Matrices', 'Pattern Recognition', 'Series Completion', 'Rule Identification'],
  },
};
