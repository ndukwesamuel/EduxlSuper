// // ─── PersonaModal.tsx ─────────────────────────────────────────────
// // Drop in src/components/PersonaModal.tsx
// // A blocking modal that appears when user has no persona set.
// // Cannot be dismissed until a persona is selected and submitted.

// import React, { useState } from 'react';
// import {
//   Modal, View, Text, TouchableOpacity,
//   StyleSheet, ActivityIndicator, Alert,
// } from 'react-native';
// import api from "../../../config/client"   //'../../config/client';

// type Persona = 'undergraduate' | 'graduate';

// interface Props {
//   visible: boolean;
//   onComplete: (persona: Persona) => void;
// }

// export default function PersonaModal({ visible, onComplete }: Props) {
//   const [selected, setSelected]   = useState<Persona | null>(null);
//   const [loading,  setLoading]    = useState(false);

//   const handleSubmit = async () => {
//     if (!selected) return;
//     setLoading(true);
//     try {
//       await api.put('/user', { persona: selected });
//       onComplete(selected);
//     } catch (err: any) {
//       Alert.alert('Error', err?.response?.data?.message ?? 'Could not save. Try again.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <Modal
//       visible={visible}
//       transparent
//       animationType="fade"
//       statusBarTranslucent
//       // No onRequestClose — intentionally blocking
//     >
//       <View style={s.overlay}>
//         <View style={s.sheet}>

//           {/* Header */}
//           <View style={s.iconWrap}>
//             <Text style={s.icon}>🎯</Text>
//           </View>
//           <Text style={s.title}>What describes you?</Text>
//           <Text style={s.sub}>
//             This helps EduXL personalise your learning experience. You can change this later.
//           </Text>

//           {/* Options */}
//           <TouchableOpacity
//             style={[s.option, selected === 'undergraduate' && s.optionSelected]}
//             onPress={() => setSelected('undergraduate')}
//             activeOpacity={0.8}
//           >
//             <View style={[s.optionIcon, selected === 'undergraduate' && s.optionIconSelected]}>
//               <Text style={s.optionEmoji}>🎓</Text>
//             </View>
//             <View style={s.optionBody}>
//               <Text style={[s.optionTitle, selected === 'undergraduate' && s.optionTitleSelected]}>
//                 I'm a University Student
//               </Text>
//               <Text style={s.optionDesc}>
//                 Managing multiple courses this semester
//               </Text>
//             </View>
//             <View style={[s.radio, selected === 'undergraduate' && s.radioSelected]}>
//               {selected === 'undergraduate' && <View style={s.radioDot} />}
//             </View>
//           </TouchableOpacity>

//           <TouchableOpacity
//             style={[s.option, selected === 'graduate' && s.optionSelected]}
//             onPress={() => setSelected('graduate')}
//             activeOpacity={0.8}
//           >
//             <View style={[s.optionIcon, selected === 'graduate' && s.optionIconSelected]}>
//               <Text style={s.optionEmoji}>💼</Text>
//             </View>
//             <View style={s.optionBody}>
//               <Text style={[s.optionTitle, selected === 'graduate' && s.optionTitleSelected]}>
//                 I'm a Graduate / Professional
//               </Text>
//               <Text style={s.optionDesc}>
//                 Preparing for a specific exam or certification
//               </Text>
//             </View>
//             <View style={[s.radio, selected === 'graduate' && s.radioSelected]}>
//               {selected === 'graduate' && <View style={s.radioDot} />}
//             </View>
//           </TouchableOpacity>

//           {/* Submit */}
//           <TouchableOpacity
//             style={[s.btn, (!selected || loading) && s.btnDisabled]}
//             onPress={handleSubmit}
//             activeOpacity={0.85}
//             disabled={!selected || loading}
//           >
//             {loading
//               ? <ActivityIndicator color="#fff" />
//               : <Text style={s.btnText}>Continue →</Text>
//             }
//           </TouchableOpacity>

//         </View>
//       </View>
//     </Modal>
//   );
// }

// const BRAND = '#1D4ED8';

// const s = StyleSheet.create({
//   overlay: {
//     flex: 1,
//     backgroundColor: 'rgba(0,0,0,0.55)',
//     justifyContent: 'flex-end',
//   },
//   sheet: {
//     backgroundColor: '#fff',
//     borderTopLeftRadius: 28,
//     borderTopRightRadius: 28,
//     padding: 28,
//     paddingBottom: 44,
//   },
//   iconWrap: { alignItems: 'center', marginBottom: 16 },
//   icon:     { fontSize: 40 },
//   title:    { fontSize: 22, fontWeight: '800', color: '#0F172A', textAlign: 'center', letterSpacing: -0.3, marginBottom: 8 },
//   sub:      { fontSize: 13, color: '#64748B', textAlign: 'center', lineHeight: 20, marginBottom: 24 },

//   option: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 14,
//     borderWidth: 1.5,
//     borderColor: '#E2E8F0',
//     borderRadius: 16,
//     padding: 16,
//     marginBottom: 12,
//     backgroundColor: '#F8FAFC',
//   },
//   optionSelected: {
//     borderColor: BRAND,
//     backgroundColor: '#EFF6FF',
//   },
//   optionIcon: {
//     width: 48, height: 48, borderRadius: 14,
//     backgroundColor: '#F1F5F9',
//     alignItems: 'center', justifyContent: 'center',
//   },
//   optionIconSelected: { backgroundColor: '#DBEAFE' },
//   optionEmoji: { fontSize: 22 },
//   optionBody:  { flex: 1 },
//   optionTitle: { fontSize: 14, fontWeight: '700', color: '#0F172A', marginBottom: 2 },
//   optionTitleSelected: { color: BRAND },
//   optionDesc:  { fontSize: 12, color: '#64748B', lineHeight: 17 },

//   radio: {
//     width: 20, height: 20, borderRadius: 10,
//     borderWidth: 2, borderColor: '#CBD5E1',
//     alignItems: 'center', justifyContent: 'center',
//   },
//   radioSelected: { borderColor: BRAND },
//   radioDot: {
//     width: 10, height: 10, borderRadius: 5,
//     backgroundColor: BRAND,
//   },

//   btn: {
//     backgroundColor: BRAND,
//     borderRadius: 999,
//     paddingVertical: 15,
//     alignItems: 'center',
//     marginTop: 8,
//     shadowColor: BRAND,
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.28,
//     shadowRadius: 12,
//     elevation: 6,
//   },
//   btnDisabled: { backgroundColor: '#94A3B8', shadowOpacity: 0 },
//   btnText:     { fontSize: 16, fontWeight: '700', color: '#fff' },
// });


// ─── PersonaModal.tsx (updated with Redux dispatch) ───────────────
// src/components/PersonaModal.tsx
// Full replacement — adds Redux dispatch after successful persona save

import React, { useState } from 'react';
import {
  Modal, View, Text, TouchableOpacity,
  StyleSheet, ActivityIndicator, Alert,
} from 'react-native';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../store/store';
import { updatePersona } from  "../../store/profileSlice"
import api from "../../../config/client";

type Persona = 'undergraduate' | 'graduate';

interface Props {
  visible: boolean;
  onComplete: () => void;
}

export default function PersonaModal({ visible, onComplete }: Props) {
  const dispatch                    = useDispatch<AppDispatch>();
  const [selected, setSelected]     = useState<Persona | null>(null);
  const [loading,  setLoading]      = useState(false);

  const handleSubmit = async () => {
    if (!selected) return;
    setLoading(true);
    try {
      await api.put('/user', { persona: selected });
      // Update Redux immediately — all screens see the change
      dispatch(updatePersona(selected));
      onComplete();
    } catch (err: any) {
      Alert.alert('Error', err?.response?.data?.message ?? 'Could not save. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
    >
      <View style={s.overlay}>
        <View style={s.sheet}>

          <View style={s.iconWrap}>
            <Text style={s.icon}>🎯</Text>
          </View>
          <Text style={s.title}>What describes you?</Text>
          <Text style={s.sub}>
            This helps EduXL personalise your learning experience. You can change this later.
          </Text>

          <TouchableOpacity
            style={[s.option, selected === 'undergraduate' && s.optionSelected]}
            onPress={() => setSelected('undergraduate')}
            activeOpacity={0.8}
          >
            <View style={[s.optionIcon, selected === 'undergraduate' && s.optionIconSelected]}>
              <Text style={s.optionEmoji}>🎓</Text>
            </View>
            <View style={s.optionBody}>
              <Text style={[s.optionTitle, selected === 'undergraduate' && s.optionTitleSelected]}>
                I'm a University Student
              </Text>
              <Text style={s.optionDesc}>Managing multiple courses this semester</Text>
            </View>
            <View style={[s.radio, selected === 'undergraduate' && s.radioSelected]}>
              {selected === 'undergraduate' && <View style={s.radioDot} />}
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={[s.option, selected === 'graduate' && s.optionSelected]}
            onPress={() => setSelected('graduate')}
            activeOpacity={0.8}
          >
            <View style={[s.optionIcon, selected === 'graduate' && s.optionIconSelected]}>
              <Text style={s.optionEmoji}>💼</Text>
            </View>
            <View style={s.optionBody}>
              <Text style={[s.optionTitle, selected === 'graduate' && s.optionTitleSelected]}>
                I'm a Graduate / Professional
              </Text>
              <Text style={s.optionDesc}>Preparing for a specific exam or certification</Text>
            </View>
            <View style={[s.radio, selected === 'graduate' && s.radioSelected]}>
              {selected === 'graduate' && <View style={s.radioDot} />}
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={[s.btn, (!selected || loading) && s.btnDisabled]}
            onPress={handleSubmit}
            activeOpacity={0.85}
            disabled={!selected || loading}
          >
            {loading
              ? <ActivityIndicator color="#fff" />
              : <Text style={s.btnText}>Continue →</Text>
            }
          </TouchableOpacity>

        </View>
      </View>
    </Modal>
  );
}

const BRAND = '#1D4ED8';

const s = StyleSheet.create({
  overlay:     { flex: 1, backgroundColor: 'rgba(0,0,0,0.55)', justifyContent: 'flex-end' },
  sheet:       { backgroundColor: '#fff', borderTopLeftRadius: 28, borderTopRightRadius: 28, padding: 28, paddingBottom: 44 },
  iconWrap:    { alignItems: 'center', marginBottom: 16 },
  icon:        { fontSize: 40 },
  title:       { fontSize: 22, fontWeight: '800', color: '#0F172A', textAlign: 'center', letterSpacing: -0.3, marginBottom: 8 },
  sub:         { fontSize: 13, color: '#64748B', textAlign: 'center', lineHeight: 20, marginBottom: 24 },
  option:      { flexDirection: 'row', alignItems: 'center', gap: 14, borderWidth: 1.5, borderColor: '#E2E8F0', borderRadius: 16, padding: 16, marginBottom: 12, backgroundColor: '#F8FAFC' },
  optionSelected:      { borderColor: BRAND, backgroundColor: '#EFF6FF' },
  optionIcon:          { width: 48, height: 48, borderRadius: 14, backgroundColor: '#F1F5F9', alignItems: 'center', justifyContent: 'center' },
  optionIconSelected:  { backgroundColor: '#DBEAFE' },
  optionEmoji:         { fontSize: 22 },
  optionBody:          { flex: 1 },
  optionTitle:         { fontSize: 14, fontWeight: '700', color: '#0F172A', marginBottom: 2 },
  optionTitleSelected: { color: BRAND },
  optionDesc:          { fontSize: 12, color: '#64748B', lineHeight: 17 },
  radio:         { width: 20, height: 20, borderRadius: 10, borderWidth: 2, borderColor: '#CBD5E1', alignItems: 'center', justifyContent: 'center' },
  radioSelected: { borderColor: BRAND },
  radioDot:      { width: 10, height: 10, borderRadius: 5, backgroundColor: BRAND },
  btn:           { backgroundColor: BRAND, borderRadius: 999, paddingVertical: 15, alignItems: 'center', marginTop: 8, shadowColor: BRAND, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.28, shadowRadius: 12, elevation: 6 },
  btnDisabled:   { backgroundColor: '#94A3B8', shadowOpacity: 0 },
  btnText:       { fontSize: 16, fontWeight: '700', color: '#fff' },
});