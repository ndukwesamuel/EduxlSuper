// ─── ShellPracticeVideoScreen.tsx ────────────────────────────────
import React, { useState, useRef, useEffect } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  StyleSheet, Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AppStackParamList } from '../../navigation/types';
import ShellHUDBar    from '../../components/shell/ShellHUDBar';
import ShellStarRow   from '../../components/shell/ShellStarRow';
import ShellViewfinder from '../../components/shell/ShellViewfinder';
import ShellInfoCard  from '../../components/shell/ShellInfoCard';

type Nav = NativeStackNavigationProp<AppStackParamList>;

// ── Dummy prompts ──────────────────────────────────────────────────
const PROMPTS = [
  {
    id: 1,
    pillar: 'Capacity',
    prompt: 'Describe a critical situation where you had to make a data-driven decision under strict constraints without full access to the information you needed.',
    tips: [
      { token: 'S', label: 'Situation', desc: 'Set the context briefly. What project? What was at stake?', active: false },
      { token: 'T', label: 'Task',      desc: 'What was your specific responsibility in this situation?', active: false },
      { token: 'A', label: 'Action',    desc: 'Say "I did" not "we did." Shell scores you, not your team.', active: true },
      { token: 'R', label: 'Result',    desc: 'Quantify the outcome. Numbers, %, time saved — anything concrete.', active: false },
    ],
    watchouts: 'Most candidates spend 90 seconds on Situation/Task and only 20 seconds on Action & Result. Flip that ratio.',
  },
  {
    id: 2,
    pillar: 'Achievement',
    prompt: 'Tell me about a time you set an ambitious personal or professional goal and the steps you took to achieve it, even when faced with setbacks.',
    tips: [
      { token: 'S', label: 'Situation', desc: 'What was the ambitious goal? Give it a clear number or target.', active: false },
      { token: 'T', label: 'Task',      desc: 'What obstacles or constraints made this hard?', active: false },
      { token: 'A', label: 'Action',    desc: 'Walk through your exact steps. What did YOU do specifically?', active: true },
      { token: 'R', label: 'Result',    desc: 'Did you achieve it? If not, what did you learn? Both are valid.', active: false },
    ],
    watchouts: 'Shell wants to see resilience and self-motivation. Mention a setback explicitly — candidates who claim everything went smoothly lose credibility.',
  },
  {
    id: 3,
    pillar: 'Relationships',
    prompt: 'Tell me about a time you worked with a difficult stakeholder or teammate who strongly disagreed with your approach. How did you handle it?',
    tips: [
      { token: 'S', label: 'Situation', desc: 'Who was the person? Why was the disagreement significant?', active: false },
      { token: 'T', label: 'Task',      desc: 'What outcome did you need from this relationship?', active: false },
      { token: 'A', label: 'Action',    desc: 'What specific steps did you take to manage the conflict?', active: true },
      { token: 'R', label: 'Result',    desc: 'What happened? Did the relationship improve? What did you both learn?', active: false },
    ],
    watchouts: 'Never make the difficult person sound incompetent or malicious. Shell evaluators watch for empathy and respect even when describing conflict.',
  },
];

type RecordState = 'prep' | 'recording' | 'done';

export default function ShellPracticeVideoScreen() {
  const navigation    = useNavigation<Nav>();
  const [idx, setIdx] = useState(0);
  const [state, setState]         = useState<RecordState>('prep');
  const [prepSeconds, setPrepSeconds]   = useState(30);
  const [recordSeconds, setRecordSeconds] = useState(120);
  const [showChecklist, setShowChecklist] = useState(false);

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const p      = PROMPTS[idx];
  const isLast = idx === PROMPTS.length - 1;

  // Countdown logic
  useEffect(() => {
    if (state === 'prep') {
      timerRef.current = setInterval(() => {
        setPrepSeconds((s) => {
          if (s <= 1) {
            clearInterval(timerRef.current!);
            setState('recording');
            return 0;
          }
          return s - 1;
        });
      }, 1000);
    }
    if (state === 'recording') {
      timerRef.current = setInterval(() => {
        setRecordSeconds((s) => {
          if (s <= 1) {
            clearInterval(timerRef.current!);
            setState('done');
            return 0;
          }
          return s - 1;
        });
      }, 1000);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [state]);

  const formatTime = (s: number) =>
    `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;

  const handleStopRecord = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setState('done');
  };

  const handleNext = () => {
    if (isLast) { navigation.goBack(); return; }
    setIdx((i) => i + 1);
    setState('prep');
    setPrepSeconds(30);
    setRecordSeconds(120);
    setShowChecklist(false);
  };

  const handleRetake = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setState('prep');
    setPrepSeconds(30);
    setRecordSeconds(120);
    setShowChecklist(false);
  };

  const pillarColor = p.pillar === 'Capacity' ? '#1D4ED8'
    : p.pillar === 'Achievement' ? '#D97706' : '#7C3AED';

  return (
    <SafeAreaView style={styles.safe}>
      <ShellHUDBar label={`Prompt ${idx + 1} / ${PROMPTS.length}`} modePill="📚 Practice" />

      {/* Progress */}
      <View style={styles.progWrap}>
        <View style={styles.progTrack}>
          <View style={[styles.progFill, { width: `${((idx + 1) / PROMPTS.length) * 100}%` as any }]} />
        </View>
        <View style={styles.progRow}>
          <Text style={styles.progLabel}>Video Interview Practice</Text>
          <Text style={[styles.progType, { color: pillarColor }]}>CAR: {p.pillar}</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

        {/* Viewfinder */}
        <ShellViewfinder
          recording={state === 'recording'}
          timer={state === 'recording' ? formatTime(recordSeconds) : undefined}
          prepTimer={state === 'prep' ? formatTime(prepSeconds) : undefined}
        />

        {/* State label */}
        <View style={styles.stateRow}>
          <View style={[styles.statePill, {
            backgroundColor: state === 'prep' ? '#EFF6FF'
              : state === 'recording' ? '#FEF2F2' : '#D1FAE5',
          }]}>
            <Text style={[styles.statePillText, {
              color: state === 'prep' ? '#1D4ED8'
                : state === 'recording' ? '#DC2626' : '#059669',
            }]}>
              {state === 'prep' ? `⏳ Prep time — ${formatTime(prepSeconds)} left`
                : state === 'recording' ? `● Recording — ${formatTime(recordSeconds)} left`
                : '✓ Recording complete'}
            </Text>
          </View>
        </View>

        {/* Prompt card */}
        <View style={styles.promptCard}>
          <View style={[styles.pillarTag, { backgroundColor: pillarColor + '15' }]}>
            <Text style={[styles.pillarTagText, { color: pillarColor }]}>CAR: {p.pillar}</Text>
          </View>
          <Text style={styles.promptText}>"{p.prompt}"</Text>
        </View>

        {/* STAR framework */}
        <Text style={styles.secLabel}>STAR Framework Anchor</Text>
        {p.tips.map((t) => (
          <ShellStarRow
            key={t.token}
            token={t.token}
            label={t.label}
            desc={t.desc}
            active={t.active}
          />
        ))}

        {/* Watch-out tip */}
        <ShellInfoCard
          title="⚠️ Common Mistake"
          text={p.watchouts}
          variant="amber"
          style={styles.watchout}
        />

        {/* Self-assessment checklist (shown after recording) */}
        {state === 'done' && (
          <>
            <TouchableOpacity
              style={styles.checklistToggle}
              onPress={() => setShowChecklist((v) => !v)}
              activeOpacity={0.8}
            >
              <Text style={styles.checklistToggleText}>
                {showChecklist ? '▲ Hide self-assessment' : '▼ Open self-assessment checklist'}
              </Text>
            </TouchableOpacity>

            {showChecklist && (
              <View style={styles.checklist}>
                {[
                  'Did you set up the Situation in under 20 seconds?',
                  'Did you focus on what YOU did (not "we")?',
                  'Did you quantify the Result with a number or metric?',
                  'Did you avoid making others sound bad?',
                  'Did you finish within 2 minutes?',
                ].map((item, i) => (
                  <View key={i} style={styles.checkRow}>
                    <Text style={styles.checkBox}>☐</Text>
                    <Text style={styles.checkText}>{item}</Text>
                  </View>
                ))}
              </View>
            )}
          </>
        )}

      </ScrollView>

      {/* Footer */}
      <View style={styles.footer}>
        {state === 'prep' && (
          <TouchableOpacity
            style={styles.btnRecord}
            onPress={() => { clearInterval(timerRef.current!); setState('recording'); }}
            activeOpacity={0.85}
          >
            <Text style={styles.btnText}>● Start Recording Now</Text>
          </TouchableOpacity>
        )}
        {state === 'recording' && (
          <TouchableOpacity style={styles.btnStop} onPress={handleStopRecord} activeOpacity={0.85}>
            <Text style={styles.btnText}>■ Stop Recording</Text>
          </TouchableOpacity>
        )}
        {state === 'done' && (
          <View style={styles.doneRow}>
            <TouchableOpacity style={styles.btnRetake} onPress={handleRetake} activeOpacity={0.85}>
              <Text style={styles.btnRetakeText}>↺ Retake</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.btnPrimary, { flex: 2 }]} onPress={handleNext} activeOpacity={0.85}>
              <Text style={styles.btnText}>{isLast ? 'Finish Session ✓' : 'Next Prompt →'}</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe:     { flex: 1, backgroundColor: '#F8FAFC' },
  scroll:   { padding: 20, paddingBottom: 32 },
  progWrap: { paddingHorizontal: 20, paddingTop: 10, paddingBottom: 4, backgroundColor: '#F8FAFC' },
  progTrack:{ height: 4, backgroundColor: '#E2E8F0', borderRadius: 999, overflow: 'hidden', marginBottom: 6 },
  progFill: { height: 4, backgroundColor: '#1D4ED8', borderRadius: 999 },
  progRow:  { flexDirection: 'row', justifyContent: 'space-between' },
  progLabel:{ fontSize: 10, color: '#94A3B8' },
  progType: { fontSize: 10, fontWeight: '700' },

  stateRow: { alignItems: 'center', marginBottom: 14 },
  statePill:{ paddingHorizontal: 14, paddingVertical: 6, borderRadius: 999 },
  statePillText: { fontSize: 12, fontWeight: '700' },

  promptCard: { backgroundColor: '#fff', borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 14, padding: 14, marginBottom: 16 },
  pillarTag:  { alignSelf: 'flex-start', paddingHorizontal: 10, paddingVertical: 3, borderRadius: 999, marginBottom: 10 },
  pillarTagText: { fontSize: 10, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5 },
  promptText: { fontSize: 13, fontWeight: '600', color: '#0F172A', lineHeight: 21, fontStyle: 'italic' },

  secLabel: { fontSize: 10, fontWeight: '700', color: '#94A3B8', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 10 },

  watchout: { marginTop: 12 },

  // Checklist
  checklistToggle:    { backgroundColor: '#F1F5F9', borderRadius: 12, padding: 12, alignItems: 'center', marginTop: 12 },
  checklistToggleText:{ fontSize: 13, fontWeight: '600', color: '#475569' },
  checklist:  { backgroundColor: '#fff', borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 14, padding: 14, marginTop: 10 },
  checkRow:   { flexDirection: 'row', gap: 10, paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
  checkBox:   { fontSize: 16, color: '#1D4ED8' },
  checkText:  { fontSize: 12, color: '#475569', flex: 1, lineHeight: 18 },

  // Footer buttons
  footer:     { padding: 20, paddingBottom: 28, backgroundColor: '#F8FAFC', borderTopWidth: 1, borderTopColor: '#E2E8F0' },
  btnRecord:  { backgroundColor: '#DC2626', borderRadius: 999, paddingVertical: 15, alignItems: 'center', shadowColor: '#DC2626', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.25, shadowRadius: 12, elevation: 6 },
  btnStop:    { backgroundColor: '#0F172A', borderRadius: 999, paddingVertical: 15, alignItems: 'center' },
  btnPrimary: { backgroundColor: '#1D4ED8', borderRadius: 999, paddingVertical: 15, alignItems: 'center', shadowColor: '#1D4ED8', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.28, shadowRadius: 12, elevation: 6 },
  btnText:    { fontSize: 15, fontWeight: '700', color: '#fff' },
  doneRow:    { flexDirection: 'row', gap: 10 },
  btnRetake:  { flex: 1, backgroundColor: '#fff', borderWidth: 1.5, borderColor: '#CBD5E1', borderRadius: 999, paddingVertical: 15, alignItems: 'center' },
  btnRetakeText: { fontSize: 15, fontWeight: '700', color: '#475569' },
});
