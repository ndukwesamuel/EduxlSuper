// // // ─── WhiteboardLibraryScreen.tsx ──────────────────────────────────
// // import React from 'react';
// // import {
// //   View, Text, ScrollView, TouchableOpacity, StyleSheet, FlatList,
// // } from 'react-native';
// // import { SafeAreaView } from 'react-native-safe-area-context';
// // import { useNavigation, useRoute } from '@react-navigation/native';
// // import { NativeStackNavigationProp } from '@react-navigation/native-stack';
// // import { AppStackParamList } from '../../navigation/types';

// // type Nav = NativeStackNavigationProp<AppStackParamList>;

// // // ── Dummy data — matches the API response shape ────────────────────
// // const STYLE_META: Record<string, { emoji: string; color: string; bg: string }> = {
// //   notebook: { emoji: '📓', color: '#D97706', bg: '#FEF3C7' },
// //   card:     { emoji: '🃏', color: '#1D4ED8', bg: '#EFF6FF' },
// //   sketch:   { emoji: '✏️', color: '#475569', bg: '#F1F5F9' },
// //   chalk:    { emoji: '🖍️', color: '#059669', bg: '#D1FAE5' },
// //   minimal:  { emoji: '⬜', color: '#7C3AED', bg: '#EDE9FE' },
// // };

// // const VIDEOS = [
// //   {
// //     id: '6a37f7e73ca71d92e4ea3581',
// //     topic: 'eduxl',
// //     style: 'notebook',
// //     duration: 26,
// //     scenes: 6,
// //     createdAt: '2026-06-21',
// //     thumbnail: '🌟',
// //   },
// //   {
// //     id: '6a37f7e73ca71d92e4ea3582',
// //     topic: 'Photosynthesis',
// //     style: 'card',
// //     duration: 32,
// //     scenes: 7,
// //     createdAt: '2026-06-19',
// //     thumbnail: '🌱',
// //   },
// //   {
// //     id: '6a37f7e73ca71d92e4ea3583',
// //     topic: 'Newton\'s Laws of Motion',
// //     style: 'chalk',
// //     duration: 41,
// //     scenes: 8,
// //     createdAt: '2026-06-15',
// //     thumbnail: '🍎',
// //   },
// // ];

// // function formatDuration(s: number) {
// //   const m = Math.floor(s / 60);
// //   const sec = s % 60;
// //   return m > 0 ? `${m}m ${sec}s` : `${sec}s`;
// // }

// // export default function WhiteboardLibraryScreen() {
// //   const navigation = useNavigation<Nav>();
// //   const route      = useRoute<any>();
// //   const subjectId   = route.params?.subjectId   ?? '6a1a7b340b4ec6f198c5c362';
// //   const subjectName = route.params?.subjectName ?? 'Biology';

// //   const hasVideos = VIDEOS.length > 0;

// //   return (
// //     <SafeAreaView style={styles.safe}>
// //       <View style={styles.header}>
// //         <TouchableOpacity onPress={() => navigation.goBack()}>
// //           <Text style={styles.backBtn}>← {subjectName}</Text>
// //         </TouchableOpacity>
// //       </View>

// //       {hasVideos ? (
// //         <FlatList
// //           data={VIDEOS}
// //           keyExtractor={(item) => item.id}
// //           contentContainerStyle={styles.list}
// //           showsVerticalScrollIndicator={false}
// //           ListHeaderComponent={
// //             <>
// //               <Text style={styles.title}>Whiteboard{'\n'}Videos</Text>
// //               <Text style={styles.sub}>AI-animated explainer videos for {subjectName} topics.</Text>
// //             </>
// //           }
// //           renderItem={({ item }) => {
// //             const meta = STYLE_META[item.style] ?? STYLE_META.notebook;
// //             return (
// //               <TouchableOpacity
// //                 style={styles.card}
// //                 activeOpacity={0.85}
// //                 onPress={() => navigation.navigate('WhiteboardPlayer' as any, { videoId: item.id })}
// //               >
// //                 <View style={[styles.thumbBox, { backgroundColor: meta.bg }]}>
// //                   <Text style={styles.thumbEmoji}>{item.thumbnail}</Text>
// //                   <View style={styles.playOverlay}>
// //                     <Text style={styles.playIcon}>▶</Text>
// //                   </View>
// //                 </View>
// //                 <View style={styles.cardInfo}>
// //                   <Text style={styles.cardTopic} numberOfLines={1}>{item.topic}</Text>
// //                   <View style={styles.cardMetaRow}>
// //                     <View style={[styles.styleBadge, { backgroundColor: meta.bg }]}>
// //                       <Text style={[styles.styleBadgeText, { color: meta.color }]}>{meta.emoji} {item.style}</Text>
// //                     </View>
// //                     <Text style={styles.cardMeta}>{item.scenes} scenes · {formatDuration(item.duration)}</Text>
// //                   </View>
// //                   <Text style={styles.cardDate}>{item.createdAt}</Text>
// //                 </View>
// //               </TouchableOpacity>
// //             );
// //           }}
// //         />
// //       ) : (
// //         <View style={styles.emptyState}>
// //           <Text style={styles.emptyEmoji}>🎬</Text>
// //           <Text style={styles.emptyTitle}>No videos yet</Text>
// //           <Text style={styles.emptyDesc}>Generate your first AI whiteboard video to explain a topic visually.</Text>
// //         </View>
// //       )}

// //       <View style={styles.footer}>
// //         <TouchableOpacity
// //           style={styles.btnPrimary}
// //           onPress={() => navigation.navigate('WhiteboardCreate' as any, { subjectId, subjectName })}
// //           activeOpacity={0.85}
// //         >
// //           <Text style={styles.btnText}>+ Generate New Video</Text>
// //         </TouchableOpacity>
// //       </View>
// //     </SafeAreaView>
// //   );
// // }

// // const styles = StyleSheet.create({
// //   safe:   { flex: 1, backgroundColor: '#F8FAFC' },
// //   header: { paddingHorizontal: 20, paddingTop: 12, paddingBottom: 4 },
// //   backBtn:{ fontSize: 14, fontWeight: '600', color: '#1D4ED8' },

// //   list:  { padding: 20, paddingBottom: 100 },
// //   title: { fontSize: 26, fontWeight: '800', color: '#0F172A', lineHeight: 32, letterSpacing: -0.5, marginTop: 8, marginBottom: 6 },
// //   sub:   { fontSize: 13, color: '#475569', lineHeight: 20, marginBottom: 20 },

// //   card:     { backgroundColor: '#fff', borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 16, marginBottom: 12, flexDirection: 'row', overflow: 'hidden' },
// //   thumbBox: { width: 90, height: 90, alignItems: 'center', justifyContent: 'center', position: 'relative' },
// //   thumbEmoji:{ fontSize: 32 },
// //   playOverlay:{ position: 'absolute', bottom: 6, right: 6, width: 22, height: 22, borderRadius: 11, backgroundColor: 'rgba(0,0,0,0.55)', alignItems: 'center', justifyContent: 'center' },
// //   playIcon: { fontSize: 9, color: '#fff' },
// //   cardInfo: { flex: 1, padding: 12, justifyContent: 'center' },
// //   cardTopic:{ fontSize: 14, fontWeight: '700', color: '#0F172A', marginBottom: 6, textTransform: 'capitalize' },
// //   cardMetaRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 4 },
// //   styleBadge:  { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 999 },
// //   styleBadgeText: { fontSize: 10, fontWeight: '700', textTransform: 'capitalize' },
// //   cardMeta: { fontSize: 11, color: '#64748B' },
// //   cardDate: { fontSize: 10, color: '#94A3B8' },

// //   emptyState: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 40 },
// //   emptyEmoji: { fontSize: 48, marginBottom: 16 },
// //   emptyTitle: { fontSize: 18, fontWeight: '700', color: '#0F172A', marginBottom: 6 },
// //   emptyDesc:  { fontSize: 13, color: '#64748B', textAlign: 'center', lineHeight: 20 },

// //   footer:     { padding: 20, paddingBottom: 28, backgroundColor: '#F8FAFC', borderTopWidth: 1, borderTopColor: '#E2E8F0' },
// //   btnPrimary: { backgroundColor: '#1D4ED8', borderRadius: 999, paddingVertical: 15, alignItems: 'center', shadowColor: '#1D4ED8', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.28, shadowRadius: 12, elevation: 6 },
// //   btnText:    { fontSize: 15, fontWeight: '700', color: '#fff' },
// // });


// // ─── WhiteboardLibraryScreen.tsx ──────────────────────────────────
// import React, { useCallback, useState } from 'react';
// import {
//   View, Text, TouchableOpacity, StyleSheet, FlatList, ActivityIndicator,
// } from 'react-native';
// import { SafeAreaView } from 'react-native-safe-area-context';
// import { useNavigation, useRoute, useFocusEffect } from '@react-navigation/native';
// import { NativeStackNavigationProp } from '@react-navigation/native-stack';
// import { AppStackParamList } from '../../navigation/types';
// // ⚠️ adjust this import path to wherever client.ts actually lives in your project
// import { getWhiteboardVideos, WhiteboardVideo } from "../../../config/client"

// type Nav = NativeStackNavigationProp<AppStackParamList>;

// const STYLE_META: Record<string, { emoji: string; color: string; bg: string }> = {
//   notebook: { emoji: '📓', color: '#D97706', bg: '#FEF3C7' },
//   card:     { emoji: '🃏', color: '#1D4ED8', bg: '#EFF6FF' },
//   sketch:   { emoji: '✏️', color: '#475569', bg: '#F1F5F9' },
//   chalk:    { emoji: '🖍️', color: '#059669', bg: '#D1FAE5' },
//   minimal:  { emoji: '⬜', color: '#7C3AED', bg: '#EDE9FE' },
// };

// function formatDuration(s: number) {
//   const m = Math.floor(s / 60);
//   const sec = s % 60;
//   return m > 0 ? `${m}m ${sec}s` : `${sec}s`;
// }

// // The API doesn't return a dedicated thumbnail field — pull the icon
// // off the TITLE scene if there is one, otherwise fall back to the style emoji.
// function getThumbnail(video: WhiteboardVideo): string {
//   const titleScene = video.scenes?.find((sc) => sc.layout_type === 'TITLE');
//   return titleScene?.layout_data?.scene_icon ?? STYLE_META[video.style]?.emoji ?? '🎬';
// }

// export default function WhiteboardLibraryScreen() {
//   const navigation = useNavigation<Nav>();
//   const route      = useRoute<any>();
//   const subjectId   = route.params?.subjectId  
//   const subjectName = route.params?.subjectName 

// console.log('WhiteboardLibraryScreen mounted with subjectId:', subjectId, 'and subjectName:', subjectName);
//   const [videos, setVideos]   = useState<WhiteboardVideo[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError]     = useState<string | null>(null);

//   const loadVideos = useCallback(async () => {
//     try {
//       setError(null);
//       const data = await getWhiteboardVideos(subjectId);
//       console.log('Fetched videos:', data);
//       setVideos(data);
//     } catch (e: any) {
//       setError(e?.response?.data?.message ?? 'Could not load videos. Please try again.');
//     } finally {
//       setLoading(false);
//     }
//   }, [subjectId]);

//   // Refetch every time the screen comes into focus, so a freshly
//   // generated video (from WhiteboardCreate) shows up on return.
//   useFocusEffect(
//     useCallback(() => {
//       loadVideos();
//     }, [loadVideos]),
//   );

//   const hasVideos = videos.length > 0;

//   return (
//     <SafeAreaView style={styles.safe}>
//       <View style={styles.header}>
//         <TouchableOpacity onPress={() => navigation.goBack()}>
//           <Text style={styles.backBtn}>← {subjectName}</Text>
//         </TouchableOpacity>
//       </View>

//       {loading ? (
//         <View style={styles.centerState}>
//           <ActivityIndicator size="large" color="#1D4ED8" />
//         </View>
//       ) : error ? (
//         <View style={styles.centerState}>
//           <Text style={styles.emptyEmoji}>⚠️</Text>
//           <Text style={styles.emptyTitle}>Something went wrong</Text>
//           <Text style={styles.emptyDesc}>{error}</Text>
//           <TouchableOpacity style={styles.retryBtn} onPress={loadVideos} activeOpacity={0.85}>
//             <Text style={styles.retryBtnText}>Try Again</Text>
//           </TouchableOpacity>
//         </View>
//       ) : hasVideos ? (
//         <FlatList
//           data={videos}
//           keyExtractor={(item) => item._id}
//           contentContainerStyle={styles.list}
//           showsVerticalScrollIndicator={false}
//           ListHeaderComponent={
//             <>
//               <Text style={styles.title}>Whiteboard{'\n'}Videos</Text>
//               <Text style={styles.sub}>AI-animated explainer videos for {subjectName} topics.</Text>
//             </>
//           }
//           renderItem={({ item }) => {
//             const meta = STYLE_META[item.style] ?? STYLE_META.notebook;
//             return (
//               <TouchableOpacity
//                 style={styles.card}
//                 activeOpacity={0.85}
//                 onPress={() =>
//                   navigation.navigate('WhiteboardPlayer' as any, {
//                     videoId: item._id,
//                     videoUrl: item.video_url,
//                   })
//                 }
//               >
//                 <View style={[styles.thumbBox, { backgroundColor: meta.bg }]}>
//                   <Text style={styles.thumbEmoji}>{getThumbnail(item)}</Text>
//                   <View style={styles.playOverlay}>
//                     <Text style={styles.playIcon}>▶</Text>
//                   </View>
//                 </View>
//                 <View style={styles.cardInfo}>
//                   <Text style={styles.cardTopic} numberOfLines={1}>{item.topic}</Text>
//                   <View style={styles.cardMetaRow}>
//                     <View style={[styles.styleBadge, { backgroundColor: meta.bg }]}>
//                       <Text style={[styles.styleBadgeText, { color: meta.color }]}>{meta.emoji} {item.style}</Text>
//                     </View>
//                     <Text style={styles.cardMeta}>
//                       {item.total_scenes} scenes · {formatDuration(item.total_duration_seconds)}
//                     </Text>
//                   </View>
//                   <Text style={styles.cardDate}>{new Date(item.createdAt).toLocaleDateString()}</Text>
//                 </View>
//               </TouchableOpacity>
//             );
//           }}
//         />
//       ) : (
//         <View style={styles.emptyState}>
//           <Text style={styles.emptyEmoji}>🎬</Text>
//           <Text style={styles.emptyTitle}>No videos yet</Text>
//           <Text style={styles.emptyDesc}>Generate your first AI whiteboard video to explain a topic visually.</Text>
//         </View>
//       )}

//       <View style={styles.footer}>
//         <TouchableOpacity
//           style={styles.btnPrimary}
//           onPress={() => navigation.navigate('WhiteboardCreate' as any, { subjectId, subjectName })}
//           activeOpacity={0.85}
//         >
//           <Text style={styles.btnText}>+ Generate New Video</Text>
//         </TouchableOpacity>
//       </View>
//     </SafeAreaView>
//   );
// }

// const styles = StyleSheet.create({
//   safe:   { flex: 1, backgroundColor: '#F8FAFC' },
//   header: { paddingHorizontal: 20, paddingTop: 12, paddingBottom: 4 },
//   backBtn:{ fontSize: 14, fontWeight: '600', color: '#1D4ED8' },

//   list:  { padding: 20, paddingBottom: 100 },
//   title: { fontSize: 26, fontWeight: '800', color: '#0F172A', lineHeight: 32, letterSpacing: -0.5, marginTop: 8, marginBottom: 6 },
//   sub:   { fontSize: 13, color: '#475569', lineHeight: 20, marginBottom: 20 },

//   card:     { backgroundColor: '#fff', borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 16, marginBottom: 12, flexDirection: 'row', overflow: 'hidden' },
//   thumbBox: { width: 90, height: 90, alignItems: 'center', justifyContent: 'center', position: 'relative' },
//   thumbEmoji:{ fontSize: 32 },
//   playOverlay:{ position: 'absolute', bottom: 6, right: 6, width: 22, height: 22, borderRadius: 11, backgroundColor: 'rgba(0,0,0,0.55)', alignItems: 'center', justifyContent: 'center' },
//   playIcon: { fontSize: 9, color: '#fff' },
//   cardInfo: { flex: 1, padding: 12, justifyContent: 'center' },
//   cardTopic:{ fontSize: 14, fontWeight: '700', color: '#0F172A', marginBottom: 6, textTransform: 'capitalize' },
//   cardMetaRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 4 },
//   styleBadge:  { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 999 },
//   styleBadgeText: { fontSize: 10, fontWeight: '700', textTransform: 'capitalize' },
//   cardMeta: { fontSize: 11, color: '#64748B' },
//   cardDate: { fontSize: 10, color: '#94A3B8' },

//   centerState:{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 40 },

//   emptyState: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 40 },
//   emptyEmoji: { fontSize: 48, marginBottom: 16 },
//   emptyTitle: { fontSize: 18, fontWeight: '700', color: '#0F172A', marginBottom: 6 },
//   emptyDesc:  { fontSize: 13, color: '#64748B', textAlign: 'center', lineHeight: 20 },

//   retryBtn:     { marginTop: 16, backgroundColor: '#1D4ED8', borderRadius: 999, paddingHorizontal: 20, paddingVertical: 10 },
//   retryBtnText: { color: '#fff', fontWeight: '700', fontSize: 13 },

//   footer:     { padding: 20, paddingBottom: 28, backgroundColor: '#F8FAFC', borderTopWidth: 1, borderTopColor: '#E2E8F0' },
//   btnPrimary: { backgroundColor: '#1D4ED8', borderRadius: 999, paddingVertical: 15, alignItems: 'center', shadowColor: '#1D4ED8', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.28, shadowRadius: 12, elevation: 6 },
//   btnText:    { fontSize: 15, fontWeight: '700', color: '#fff' },
// });


// ─── WhiteboardLibraryScreen.tsx ──────────────────────────────────
import React, { useCallback, useState } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, FlatList, ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute, useFocusEffect } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AppStackParamList } from '../../navigation/types';
// ⚠️ adjust this import path to wherever client.ts actually lives in your project
import { getWhiteboardVideos, WhiteboardVideo } from  "../../../config/client" //'../../config/client';

type Nav = NativeStackNavigationProp<AppStackParamList>;

const STYLE_META: Record<string, { emoji: string; color: string; bg: string }> = {
  notebook: { emoji: '📓', color: '#D97706', bg: '#FEF3C7' },
  card:     { emoji: '🃏', color: '#1D4ED8', bg: '#EFF6FF' },
  sketch:   { emoji: '✏️', color: '#475569', bg: '#F1F5F9' },
  chalk:    { emoji: '🖍️', color: '#059669', bg: '#D1FAE5' },
  minimal:  { emoji: '⬜', color: '#7C3AED', bg: '#EDE9FE' },
};

function formatDuration(s: number) {
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return m > 0 ? `${m}m ${sec}s` : `${sec}s`;
}

// The API doesn't return a dedicated thumbnail field — pull the icon
// off the TITLE scene if there is one, otherwise fall back to the style emoji.
function getThumbnail(video: WhiteboardVideo): string {
  const titleScene = video.scenes?.find((sc) => sc.layout_type === 'TITLE');
  return titleScene?.layout_data?.scene_icon ?? STYLE_META[video.style]?.emoji ?? '🎬';
}

export default function WhiteboardLibraryScreen() {
  const navigation = useNavigation<Nav>();
  const route      = useRoute<any>();
  const subjectId   = route.params?.subjectId   ?? '6a1a7b340b4ec6f198c5c362';
  const subjectName = route.params?.subjectName ?? 'Biology';

  const [videos, setVideos]   = useState<WhiteboardVideo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState<string | null>(null);

  const loadVideos = useCallback(async () => {
    try {
      setError(null);
      const data = await getWhiteboardVideos(subjectId);
      setVideos(data);
    } catch (e: any) {
      setError(e?.response?.data?.message ?? 'Could not load videos. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [subjectId]);

  // Refetch every time the screen comes into focus, so a freshly
  // generated video (from WhiteboardCreate) shows up on return.
  useFocusEffect(
    useCallback(() => {
      loadVideos();
    }, [loadVideos]),
  );

  const hasVideos = videos.length > 0;

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backBtn}>← {subjectName}</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={styles.centerState}>
          <ActivityIndicator size="large" color="#1D4ED8" />
        </View>
      ) : error ? (
        <View style={styles.centerState}>
          <Text style={styles.emptyEmoji}>⚠️</Text>
          <Text style={styles.emptyTitle}>Something went wrong</Text>
          <Text style={styles.emptyDesc}>{error}</Text>
          <TouchableOpacity style={styles.retryBtn} onPress={loadVideos} activeOpacity={0.85}>
            <Text style={styles.retryBtnText}>Try Again</Text>
          </TouchableOpacity>
        </View>
      ) : hasVideos ? (
        <FlatList
          data={videos}
          keyExtractor={(item) => item._id}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={
            <>
              <Text style={styles.title}>Whiteboard{'\n'}Videos</Text>
              <Text style={styles.sub}>AI-animated explainer videos for {subjectName} topics.</Text>
            </>
          }
          renderItem={({ item }) => {
            const meta = STYLE_META[item.style] ?? STYLE_META.notebook;
            return (
              <TouchableOpacity
                style={styles.card}
                activeOpacity={0.85}
                onPress={() =>
                  // pass the whole video object — Player has no dummy
                  // fallback and no single-fetch-by-id endpoint to lean on
                  navigation.navigate('WhiteboardPlayer' as any, { video: item })
                }
              >
                <View style={[styles.thumbBox, { backgroundColor: meta.bg }]}>
                  <Text style={styles.thumbEmoji}>{getThumbnail(item)}</Text>
                  <View style={styles.playOverlay}>
                    <Text style={styles.playIcon}>▶</Text>
                  </View>
                </View>
                <View style={styles.cardInfo}>
                  <Text style={styles.cardTopic} numberOfLines={1}>{item.topic}</Text>
                  <View style={styles.cardMetaRow}>
                    <View style={[styles.styleBadge, { backgroundColor: meta.bg }]}>
                      <Text style={[styles.styleBadgeText, { color: meta.color }]}>{meta.emoji} {item.style}</Text>
                    </View>
                    <Text style={styles.cardMeta}>
                      {item.total_scenes} scenes · {formatDuration(item.total_duration_seconds)}
                    </Text>
                  </View>
                  <Text style={styles.cardDate}>{new Date(item.createdAt).toLocaleDateString()}</Text>
                </View>
              </TouchableOpacity>
            );
          }}
        />
      ) : (
        <View style={styles.emptyState}>
          <Text style={styles.emptyEmoji}>🎬</Text>
          <Text style={styles.emptyTitle}>No videos yet</Text>
          <Text style={styles.emptyDesc}>Generate your first AI whiteboard video to explain a topic visually.</Text>
        </View>
      )}

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.btnPrimary}
          onPress={() => navigation.navigate('WhiteboardCreate' as any, { subjectId, subjectName })}
          activeOpacity={0.85}
        >
          <Text style={styles.btnText}>+ Generate New Video</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe:   { flex: 1, backgroundColor: '#F8FAFC' },
  header: { paddingHorizontal: 20, paddingTop: 12, paddingBottom: 4 },
  backBtn:{ fontSize: 14, fontWeight: '600', color: '#1D4ED8' },

  list:  { padding: 20, paddingBottom: 100 },
  title: { fontSize: 26, fontWeight: '800', color: '#0F172A', lineHeight: 32, letterSpacing: -0.5, marginTop: 8, marginBottom: 6 },
  sub:   { fontSize: 13, color: '#475569', lineHeight: 20, marginBottom: 20 },

  card:     { backgroundColor: '#fff', borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 16, marginBottom: 12, flexDirection: 'row', overflow: 'hidden' },
  thumbBox: { width: 90, height: 90, alignItems: 'center', justifyContent: 'center', position: 'relative' },
  thumbEmoji:{ fontSize: 32 },
  playOverlay:{ position: 'absolute', bottom: 6, right: 6, width: 22, height: 22, borderRadius: 11, backgroundColor: 'rgba(0,0,0,0.55)', alignItems: 'center', justifyContent: 'center' },
  playIcon: { fontSize: 9, color: '#fff' },
  cardInfo: { flex: 1, padding: 12, justifyContent: 'center' },
  cardTopic:{ fontSize: 14, fontWeight: '700', color: '#0F172A', marginBottom: 6, textTransform: 'capitalize' },
  cardMetaRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 4 },
  styleBadge:  { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 999 },
  styleBadgeText: { fontSize: 10, fontWeight: '700', textTransform: 'capitalize' },
  cardMeta: { fontSize: 11, color: '#64748B' },
  cardDate: { fontSize: 10, color: '#94A3B8' },

  centerState:{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 40 },

  emptyState: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 40 },
  emptyEmoji: { fontSize: 48, marginBottom: 16 },
  emptyTitle: { fontSize: 18, fontWeight: '700', color: '#0F172A', marginBottom: 6 },
  emptyDesc:  { fontSize: 13, color: '#64748B', textAlign: 'center', lineHeight: 20 },

  retryBtn:     { marginTop: 16, backgroundColor: '#1D4ED8', borderRadius: 999, paddingHorizontal: 20, paddingVertical: 10 },
  retryBtnText: { color: '#fff', fontWeight: '700', fontSize: 13 },

  footer:     { padding: 20, paddingBottom: 28, backgroundColor: '#F8FAFC', borderTopWidth: 1, borderTopColor: '#E2E8F0' },
  btnPrimary: { backgroundColor: '#1D4ED8', borderRadius: 999, paddingVertical: 15, alignItems: 'center', shadowColor: '#1D4ED8', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.28, shadowRadius: 12, elevation: 6 },
  btnText:    { fontSize: 15, fontWeight: '700', color: '#fff' },
});