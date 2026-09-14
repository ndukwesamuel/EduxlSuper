import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  ScrollView,
  Alert,
  ActivityIndicator
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { AppStackParamList } from "../../navigation/types";
import { fetchTodos, updateTodoItem, deleteTodoItem, TodoItem } from "../../services/todoService";

type Nav = NativeStackNavigationProp<AppStackParamList>;

export default function TaskDetailScreen() {
  const navigation = useNavigation<Nav>();
  const route = useRoute<any>();

  const taskId = route.params?.taskId;
  const initialTitle = route.params?.title || "Bill payment";

  const [todo, setTodo] = useState<TodoItem | null>(null);
  const [title, setTitle] = useState(initialTitle);
  const [description, setDescription] = useState("pay credit card bill amount $450");
  const [dueTimeString, setDueTimeString] = useState("3:00 PM");
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadTask() {
      if (taskId) {
        const all = await fetchTodos();
        const found = all.find(t => t._id === taskId);
        if (found) {
          setTodo(found);
          setTitle(found.title);
          setDescription(found.description || "");
          setDueTimeString(found.dueTimeString || "3:00 PM");
        }
      }
      setLoading(false);
    }
    loadTask();
  }, [taskId]);

  const handleSave = async () => {
    setSaving(true);
    if (taskId) {
      await updateTodoItem(taskId, {
        title,
        description,
        dueTimeString
      });
    }
    setSaving(false);
    navigation.goBack();
  };

  const handleDelete = async () => {
    Alert.alert("Delete Task", "Are you sure you want to delete this task?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          if (taskId) await deleteTodoItem(taskId);
          navigation.goBack();
        }
      }
    ]);
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#7C3AED" />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Header matching Image 2 */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Text style={styles.backArrow}>←</Text>
        </TouchableOpacity>

        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.iconBtn}>
            <Text style={styles.bellIcon}>🔔</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconBtn} onPress={handleDelete}>
            <Text style={styles.optionsIcon}>⋮</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
        {/* Title Input */}
        <TextInput
          style={styles.titleInput}
          value={title}
          onChangeText={setTitle}
          placeholder="Task title"
          placeholderTextColor="#94A3B8"
          multiline
        />

        {/* Due Time & Notification Status Banner */}
        <View style={styles.reminderBanner}>
          <Text style={styles.reminderIcon}>⏰</Text>
          <View style={styles.reminderInfo}>
            <Text style={styles.reminderTitle}>Stipulated Push Time: {dueTimeString}</Text>
            <Text style={styles.reminderSub}>
              Notifications scheduled 20 mins & 5 mins before target time
            </Text>
          </View>
        </View>

        {/* Quick Time Selector */}
        <Text style={styles.sectionLabel}>Select / Change Target Time</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipRow}>
          {["9:00 AM", "12:00 PM", "2:35 PM", "3:00 PM", "5:00 PM", "8:00 PM"].map(time => (
            <TouchableOpacity
              key={time}
              style={[styles.timeChip, dueTimeString === time && styles.timeChipActive]}
              onPress={() => setDueTimeString(time)}
            >
              <Text style={[styles.timeChipText, dueTimeString === time && styles.timeChipTextActive]}>
                {time}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <TextInput
          style={styles.customTimeInput}
          value={dueTimeString}
          onChangeText={setDueTimeString}
          placeholder="Or type custom time e.g. 3:00 PM"
          placeholderTextColor="#94A3B8"
        />

        {/* Description Body Input */}
        <Text style={styles.sectionLabel}>Details & Notes</Text>
        <TextInput
          style={[
            styles.bodyInput,
            isBold && styles.textBold,
            isItalic && styles.textItalic,
          ]}
          value={description}
          onChangeText={setDescription}
          placeholder="Add details, amounts, notes..."
          placeholderTextColor="#94A3B8"
          multiline
        />
      </ScrollView>

      {/* Save Button */}
      <View style={styles.saveContainer}>
        <TouchableOpacity style={styles.saveBtn} onPress={handleSave} disabled={saving}>
          {saving ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.saveBtnText}>Save Changes</Text>
          )}
        </TouchableOpacity>
      </View>

      {/* Bottom Formatting Toolbar matching Image 2 */}
      <View style={styles.toolbar}>
        <TouchableOpacity
          style={[styles.toolBtn, isBold && styles.toolBtnActive]}
          onPress={() => setIsBold(!isBold)}
        >
          <Text style={[styles.toolText, isBold && styles.toolTextActive]}>B</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.toolBtn, isItalic && styles.toolBtnActive]}
          onPress={() => setIsItalic(!isItalic)}
        >
          <Text style={[styles.toolText, isItalic && styles.toolTextActive]}>I</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.toolBtn}>
          <Text style={styles.toolIcon}>≡</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.toolBtn}>
          <Text style={styles.toolIcon}>☲</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#FFFFFF" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 14,
  },
  backBtn: { padding: 4 },
  backArrow: { fontSize: 24, color: "#1E293B", fontWeight: "600" },
  headerRight: { flexDirection: "row", alignItems: "center", gap: 14 },
  iconBtn: { padding: 4 },
  bellIcon: { fontSize: 20, color: "#1E293B" },
  optionsIcon: { fontSize: 22, color: "#1E293B", fontWeight: "800" },

  scroll: { flex: 1 },
  scrollContent: { paddingHorizontal: 24, paddingTop: 16, paddingBottom: 24 },

  titleInput: {
    fontSize: 28,
    fontWeight: "800",
    color: "#1E293B",
    lineHeight: 36,
    marginBottom: 16,
    padding: 0,
  },

  reminderBanner: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F5F3FF",
    borderRadius: 14,
    padding: 14,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#DDD6FE",
  },
  reminderIcon: { fontSize: 22, marginRight: 12 },
  reminderInfo: { flex: 1 },
  reminderTitle: { fontSize: 14, fontWeight: "700", color: "#6D28D9" },
  reminderSub: { fontSize: 12, color: "#7C3AED", marginTop: 2 },

  sectionLabel: { fontSize: 13, fontWeight: "700", color: "#475569", marginTop: 12, marginBottom: 8 },
  chipRow: { flexDirection: "row", marginBottom: 10 },
  timeChip: { backgroundColor: "#F1F5F9", paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, marginRight: 8 },
  timeChipActive: { backgroundColor: "#7C3AED" },
  timeChipText: { fontSize: 13, fontWeight: "600", color: "#475569" },
  timeChipTextActive: { color: "#FFFFFF", fontWeight: "700" },
  customTimeInput: { backgroundColor: "#F8FAFC", borderWidth: 1, borderColor: "#E2E8F0", borderRadius: 12, paddingHorizontal: 14, paddingVertical: 10, fontSize: 14, color: "#0F172A", marginBottom: 14 },

  bodyInput: {
    fontSize: 17,
    color: "#334155",
    lineHeight: 26,
    minHeight: 140,
    textAlignVertical: "top",
    padding: 0,
  },
  textBold: { fontWeight: "800" },
  textItalic: { fontStyle: "italic" },

  saveContainer: { paddingHorizontal: 24, paddingBottom: 10 },
  saveBtn: {
    backgroundColor: "#1E293B",
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: "center",
  },
  saveBtnText: { color: "#FFFFFF", fontWeight: "800", fontSize: 16 },

  toolbar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    backgroundColor: "#F8FAFC",
    borderTopWidth: 1,
    borderColor: "#E2E8F0",
    paddingVertical: 14,
    paddingHorizontal: 20,
  },
  toolBtn: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 8,
  },
  toolBtnActive: { backgroundColor: "#E2E8F0" },
  toolText: { fontSize: 18, fontWeight: "700", color: "#475569" },
  toolTextActive: { color: "#0F172A" },
  toolIcon: { fontSize: 20, color: "#475569" },

  center: { flex: 1, alignItems: "center", justifyContent: "center" },
});
