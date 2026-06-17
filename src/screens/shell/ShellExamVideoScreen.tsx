// ─── ShellExamVideoScreen.tsx ─────────────────────────────────────
import React, { useState, useEffect, useRef } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AppStackParamList } from '../../navigation/types';
import ShellHUDBar    from '../../components/shell/ShellHUDBar';
import ShellStarRow   from '../../components/shell/ShellStarRow';
import ShellViewfinder from '../../components/shell/ShellViewfinder';

type Nav = NativeStackNavigationProp<AppStackParamList>;

const PROMPTS = [
  { id:1, pillar:'Capacity',      text:'Describe a critical situation where you had to make a data-driven decision under strict constraints without full access to the information you needed.' },
  { id:2, pillar:'Achievement',   text:'Tell me about a time you set an ambitious personal goal and the steps you took to achieve it, even when faced with setbacks.' },
  { id:3, pillar:'Relationships', text:'Tell me about a time you worked with a difficult stakeholder who strongly disagreed with your approach. How did you handle it?' },
];

const STAR = [
  { token:'S', label:'Situation', desc:'Set the context — max 20 seconds.' },
  { token:'T', label:'Task',      desc:'Your specific responsibility.' },
  { token:'A', label:'Action',    desc:'What YOU did — not "we". This is scored most heavily.', active: true },
  { token:'R', label:'Result',    desc:'Quantify the outcome.' },
];

const PREP_TIME   = 30;
const RECORD_TIME = 120;

type RecState = 'prep' | 'recording' | 'done';

export default function ShellExamVideoScreen() {
  const navigation = useNavigation<Nav>();
  const route      = useRoute<any>();
  const cogScore   = route.params?.cogScore  ?? 0;
  const behavScore = route.params?.behavScore ?? 0;

  const [idx, setIdx]         = useState(0);
  const [recState, setRecState] = useState<RecState>('prep');
  const [prepLeft, setPrepLeft]   = useState(PREP_TIME);
  const [recLeft,  setRecLeft]    = useState(RECORD_TIME);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const p      = PROMPTS[idx];
  const isLast = idx === PROMPTS.length - 1;

  useEffect(() => {
    if (recState === 'prep') {
      timerRef.current = setInterval(() => {
        setPrepLeft((s) => {
          if (s <= 1) { clearInterval(timerRef.current!); setRecState('recording'); return 0; }
          return s - 1;
        });
      }, 1000);
    }
    if (recState === 'recording') {
      timerRef.current = setInterval(() => {
        setRecLeft((s) => {
          if (s <= 1) { clearInterval(timerRef.current!); setRecState('done'); return 0; }
          return s - 1;
        });
      }, 1000);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [recState]);

  const fmt = (s: number) =>
    `${String(Math.floor(s / 60)).padStart(2,'0')}:${String(s % 60).padStart(2,'0')}`;

  const handleNext = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (isLast) {
      navigation.navigate('ShellResults' as any, { cogScore, behavScore, videoScore: PROMPTS.length } as any);
      return;
    }
    setIdx((i) => i + 1);
    setRecState('prep');
    setPrepLeft(PREP_TIME);
    setRecLeft(RECORD_TIME);
  };

  const pillarColor = p.pillar === 'Capacity' ? '#1D4ED8'
    : p.pillar === 'Achievement' ? '#D97706' : '#7C3AED';

  return (
    <SafeAreaView style={styles.safe}>
      <ShellHUDBar
        label={`Prompt ${idx + 1} / ${PROMPTS.length}`}
        timer={recState === 'recording' ? fmt(recLeft) : undefined}
      />

      <View style={styles.progWrap}>
        <View style={styles.progTrack}>
          <View style={[styles.progFill, { width: `${((idx + 1) / PROMPTS.length) * 100}%` as any, backgroundColor: '#7C3AED' }]} />
        </View>
        <View style={styles.progRow}>
          <Text style={styles.progLabel}>Video Interview</Text>
          <Text style={[styles.progType, { color: pillarColor }]}>CAR: {p.pillar}</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

        {/* Viewfinder */}
        <ShellViewfinder
          recording={recState === 'recording'}
          timer={recState === 'recording' ? fmt(recLeft) : undefined}
          prepTimer={recState === 'prep' ? fmt(prepLeft) : undefined}
        />

        {/* State pill */}
        <View style={styles.statePillRow}>
          <View style={[styles.statePill, {
            backgroundColor: recState === 'prep' ? '#EFF6FF'
              : recState === 'recording' ? '#FEF2F2' : '#D1FAE5',
          }]}>
            <Text style={[styles.statePillText, {
              color: recState === 'prep' ? '#1D4ED8'
                : recState === 'recording' ? '#DC2626' : '#059669',
            }]}>
              {recState === 'prep' ? `Preparing — ${fmt(prepLeft)}`
                : recState === 'recording' ? `Recording — ${fmt(recLeft)} left`
                : '✓ Done'}
            </Text>
          </View>
        </View>

        {/* Prompt */}
        <View style={styles.promptCard}>
          <View style={[styles.pillarTag, { backgroundColor: pillarColor + '15' }]}>
            <Text style={[styles.pillarTagText, { color: pillarColor }]}>{p.pillar}</Text>
          </View>
          <Text style={styles.promptText}>"{p.text}"</Text>
        </View>

        {/* STAR */}
        <Text style={styles.secLabel}>STAR Anchor</Text>
        {STAR.map((s) => (
          <ShellStarRow key={s.token} token={s.token} label={s.label} desc={s.desc} active={!!s.active} />
        ))}

        <View style={styles.examNote}>
          <Text style={styles.examNoteText}>⏱️ Exam mode — no retakes. Speak clearly and stay within 2 minutes.</Text>
        </View>

      </ScrollView>

      <View style={styles.footer}>
        {recState === 'prep' && (
          <TouchableOpacity style={styles.btnRecord} onPress={() => { clearInterval(timerRef.current!); setRecState('recording'); }} activeOpacity={0.85}>
            <Text style={styles.btnText}>● Start Recording Now</Text>
          </TouchableOpacity>
        )}
        {recState === 'recording' && (
          <TouchableOpacity style={styles.btnStop} onPress={() => { clearInterval(timerRef.current!); setRecState('done'); }} activeOpacity={0.85}>
            <Text style={styles.btnText}>■ Stop Recording</Text>
          </TouchableOpacity>
        )}
        {recState === 'done' && (
          <TouchableOpacity style={styles.btnPrimary} onPress={handleNext} activeOpacity={0.85}>
            <Text style={styles.btnText}>{isLast ? 'Submit & See Results →' : 'Next Prompt →'}</Text>
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe:      { flex: 1, backgroundColor: '#F8FAFC' },
  scroll:    { padding: 20, paddingBottom: 32 },
  progWrap:  { paddingHorizontal: 20, paddingTop: 8, paddingBottom: 8, backgroundColor: '#F8FAFC', borderBottomWidth: 1, borderBottomColor: '#E2E8F0' },
  progTrack: { height: 4, backgroundColor: '#E2E8F0', borderRadius: 999, overflow: 'hidden', marginBottom: 6 },
  progFill:  { height: 4, borderRadius: 999 },
  progRow:   { flexDirection: 'row', justifyContent: 'space-between' },
  progLabel: { fontSize: 10, color: '#94A3B8' },
  progType:  { fontSize: 10, fontWeight: '700' },
  statePillRow: { alignItems: 'center', marginBottom: 14 },
  statePill:    { paddingHorizontal: 14, paddingVertical: 6, borderRadius: 999 },
  statePillText:{ fontSize: 12, fontWeight: '700' },
  promptCard:   { backgroundColor: '#fff', borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 14, padding: 14, marginBottom: 16 },
  pillarTag:    { alignSelf: 'flex-start', paddingHorizontal: 10, paddingVertical: 3, borderRadius: 999, marginBottom: 10 },
  pillarTagText:{ fontSize: 10, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5 },
  promptText:   { fontSize: 13, fontWeight: '600', color: '#0F172A', lineHeight: 21, fontStyle: 'italic' },
  secLabel:     { fontSize: 10, fontWeight: '700', color: '#94A3B8', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 10 },
  examNote:     { backgroundColor: '#F8FAFC', borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 12, padding: 12, marginTop: 12 },
  examNoteText: { fontSize: 12, color: '#94A3B8', textAlign: 'center' },
  footer:       { padding: 20, paddingBottom: 28, backgroundColor: '#F8FAFC', borderTopWidth: 1, borderTopColor: '#E2E8F0' },
  btnRecord:    { backgroundColor: '#DC2626', borderRadius: 999, paddingVertical: 15, alignItems: 'center', shadowColor: '#DC2626', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.25, shadowRadius: 12, elevation: 6 },
  btnStop:      { backgroundColor: '#0F172A', borderRadius: 999, paddingVertical: 15, alignItems: 'center' },
  btnPrimary:   { backgroundColor: '#1D4ED8', borderRadius: 999, paddingVertical: 15, alignItems: 'center', shadowColor: '#1D4ED8', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.28, shadowRadius: 12, elevation: 6 },
  btnText:      { fontSize: 15, fontWeight: '700', color: '#fff' },
});
