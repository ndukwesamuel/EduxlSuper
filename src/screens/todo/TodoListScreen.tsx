import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  ActivityIndicator,
  Modal,
  ScrollView
} from "react-native";
import { useNavigation, useRoute, useFocusEffect } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { AppStackParamList } from "../../navigation/types";
import {
  fetchTodos,
  addTodo,
  toggleTodoComplete,
  updateTodoItem,
  TodoItem
} from "../../services/todoService";

type Nav = NativeStackNavigationProp<AppStackParamList>;

// Helper to compute target Date and exact reminder times (20m and 5m before)
function getTargetSchedule(dateChoice: string, customDateStr: string, timeChoice: string, customTimeStr: string) {
  const now = new Date();
  let target = new Date();

  // 1. Resolve Date
  if (dateChoice === "tomorrow") {
    target.setDate(target.getDate() + 1);
  } else if (dateChoice === "in2days") {
    target.setDate(target.getDate() + 2);
  } else if (dateChoice === "custom" && customDateStr) {
    const parsed = new Date(customDateStr);
    if (!isNaN(parsed.getTime())) target = parsed;
  }

  // 2. Resolve Time
  let timeText = timeChoice !== "custom" ? timeChoice : customTimeStr;
  if (!timeText) timeText = "3:00 PM";

  // Parse time format e.g. "3:00 PM", "15:00", "2:35pm"
  const match = timeText.match(/(\d{1,2}):(\d{2})\s*(AM|PM)?/i);
  let dueMinutesOffset = 60; // default 1 hour if unparseable

  if (match) {
    let hours = parseInt(match[1], 10);
    const minutes = parseInt(match[2], 10);
    const ampm = match[3] ? match[3].toUpperCase() : null;

    if (ampm === "PM" && hours < 12) hours += 12;
    if (ampm === "AM" && hours === 12) hours = 0;

    target.setHours(hours, minutes, 0, 0);

    // If selected time is in the past for today, advance to tomorrow
    if (target.getTime() < now.getTime() && dateChoice === "today") {
      target.setDate(target.getDate() + 1);
    }

    dueMinutesOffset = Math.max(1, Math.floor((target.getTime() - now.getTime()) / (1000 * 60)));
  }

  const targetTimestamp = target.getTime();
  const time20m = new Date(targetTimestamp - 20 * 60 * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const time5m = new Date(targetTimestamp - 5 * 60 * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const formattedTargetTime = target.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return {
    targetDate: target,
    dueMinutesOffset,
    formattedTargetTime: timeText || formattedTargetTime,
    time20m,
    time5m
  };
}

export default function TodoListScreen() {
  const navigation = useNavigation<Nav>();
  const route = useRoute<any>();

  const [todos, setTodos] = useState<TodoItem[]>([]);
  const [listTitle, setListTitle] = useState(route.params?.category || "Groceries");
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [taskDescription, setTaskDescription] = useState("");

  // Date & Time Picker selection states
  const [dateChoice, setDateChoice] = useState<"today" | "tomorrow" | "in2days">("today");
  const [selectedTime, setSelectedTime] = useState<string>("3:00 PM");
  const [customTimeInput, setCustomTimeInput] = useState<string>("");

  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);

  const loadData = async () => {
    setLoading(true);
    const data = await fetchTodos();
    setTodos(data);
    setLoading(false);
  };

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [])
  );

  const completedCount = todos.filter(t => t.completed).length;
  const totalCount = todos.length;

  const scheduleInfo = getTargetSchedule(dateChoice, "", selectedTime, customTimeInput);

  const handleCreateTask = async () => {
    if (!newTaskTitle.trim()) return;
    setAdding(true);

    const { dueMinutesOffset, formattedTargetTime } = getTargetSchedule(
      dateChoice,
      "",
      selectedTime,
      customTimeInput
    );

    await addTodo(
      newTaskTitle.trim(),
      taskDescription.trim(),
      listTitle,
      dueMinutesOffset,
      formattedTargetTime
    );

    setNewTaskTitle("");
    setTaskDescription("");
    setCustomTimeInput("");
    setShowAddModal(false);
    setAdding(false);
    await loadData();
  };

  const handleToggle = async (id: string) => {
    setTodos(prev =>
      prev.map(t => (t._id === id ? { ...t, completed: !t.completed } : t))
    );
    await toggleTodoComplete(id);
  };

  const handleStarToggle = async (id: string, currentStarred?: boolean, currentNotified?: boolean) => {
    const nextState = !(currentStarred || currentNotified);
    setTodos(prev =>
      prev.map(t => (t._id === id ? { ...t, isStarred: nextState, isNotified: nextState } : t))
    );
    await updateTodoItem(id, { isStarred: nextState, isNotified: nextState });
  };

  const renderTaskItem = ({ item }: { item: TodoItem }) => {
    const isNotifiedOrStarred = item.isNotified || item.isStarred;

    return (
      <TouchableOpacity
        style={styles.card}
        activeOpacity={0.8}
        onPress={() => navigation.navigate("TaskDetail", { taskId: item._id, title: item.title, category: item.category })}
      >
        {/* Checkbox */}
        <TouchableOpacity
          style={styles.checkboxTouch}
          activeOpacity={0.7}
          onPress={() => handleToggle(item._id)}
        >
          {item.completed ? (
            <View style={styles.checkboxFilled}>
              <Text style={styles.checkMark}>✓</Text>
            </View>
          ) : (
            <View style={styles.checkboxHollow} />
          )}
        </TouchableOpacity>

        {/* Task Title & Details */}
        <View style={styles.taskTextContainer}>
          <Text style={[styles.taskTitle, item.completed && styles.taskTitleCompleted]}>
            {item.title}
          </Text>
          {item.description ? (
            <Text style={styles.taskDescSub} numberOfLines={1}>
              {item.description}
            </Text>
          ) : null}
          {item.dueTimeString ? (
            <Text style={styles.taskTimeSub}>
              ⏰ {item.dueTimeString}
            </Text>
          ) : null}
        </View>

        {/* Star Icon (push notified / starred indicator) */}
        <TouchableOpacity
          style={styles.starTouch}
          activeOpacity={0.6}
          onPress={() => handleStarToggle(item._id, item.isStarred, item.isNotified)}
        >
          <Text style={[styles.starIcon, isNotifiedOrStarred && styles.starIconActive]}>
            {isNotifiedOrStarred ? "★" : "☆"}
          </Text>
        </TouchableOpacity>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8FAFC" />

      {/* Header Bar */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Text style={styles.backArrow}>←</Text>
        </TouchableOpacity>

        <View style={styles.titleRow}>
          <Text style={styles.headerTitle}>{listTitle}</Text>
          <Text style={styles.counterText}>
            {completedCount}/{totalCount}
          </Text>
        </View>

        <View style={styles.headerRightActions}>
          <TouchableOpacity style={styles.iconBtn} onPress={() => setShowAddModal(true)}>
            <Text style={styles.headerActionIcon}>✏️</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconBtn}>
            <Text style={styles.headerActionIcon}>•••</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Add Task Input Bar */}
      <TouchableOpacity
        style={styles.inputContainer}
        activeOpacity={0.9}
        onPress={() => setShowAddModal(true)}
      >
        <Text style={styles.plusIcon}>+</Text>
        <TextInput
          style={styles.input}
          placeholder="Add a task.."
          placeholderTextColor="#94A3B8"
          value={newTaskTitle}
          onChangeText={text => {
            setNewTaskTitle(text);
            setShowAddModal(true);
          }}
          onFocus={() => setShowAddModal(true)}
        />
        <TouchableOpacity style={styles.addBtnSmall} onPress={() => setShowAddModal(true)}>
          <Text style={styles.addBtnText}>+ Add</Text>
        </TouchableOpacity>
      </TouchableOpacity>

      {/* Task List */}
      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#7C3AED" />
        </View>
      ) : (
        <FlatList
          data={todos}
          keyExtractor={item => item._id}
          renderItem={renderTaskItem}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      )}

      {/* Add Task Modal with Calendar & Time Picker */}
      <Modal visible={showAddModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeaderRow}>
              <Text style={styles.modalTitle}>New Task & Reminder</Text>
              <TouchableOpacity onPress={() => setShowAddModal(false)}>
                <Text style={styles.closeBtn}>✕</Text>
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} style={{ maxHeight: 460 }}>
              {/* Task Name */}
              <Text style={styles.fieldLabel}>Task Name *</Text>
              <TextInput
                style={styles.modalInput}
                placeholder="e.g. Pay credit card bill"
                placeholderTextColor="#94A3B8"
                value={newTaskTitle}
                onChangeText={setNewTaskTitle}
              />

              {/* Description */}
              <Text style={styles.fieldLabel}>Description / Notes</Text>
              <TextInput
                style={[styles.modalInput, { height: 68, textAlignVertical: "top" }]}
                placeholder="e.g. Amount $450 due today"
                placeholderTextColor="#94A3B8"
                multiline
                value={taskDescription}
                onChangeText={setTaskDescription}
              />

              {/* Date Selection */}
              <Text style={styles.fieldLabel}>📅 Select Date</Text>
              <View style={styles.chipRow}>
                <TouchableOpacity
                  style={[styles.timeChip, dateChoice === "today" && styles.timeChipActive]}
                  onPress={() => setDateChoice("today")}
                >
                  <Text style={[styles.timeChipText, dateChoice === "today" && styles.timeChipTextActive]}>Today</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.timeChip, dateChoice === "tomorrow" && styles.timeChipActive]}
                  onPress={() => setDateChoice("tomorrow")}
                >
                  <Text style={[styles.timeChipText, dateChoice === "tomorrow" && styles.timeChipTextActive]}>Tomorrow</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.timeChip, dateChoice === "in2days" && styles.timeChipActive]}
                  onPress={() => setDateChoice("in2days")}
                >
                  <Text style={[styles.timeChipText, dateChoice === "in2days" && styles.timeChipTextActive]}>In 2 Days</Text>
                </TouchableOpacity>
              </View>

              {/* Time Selector */}
              <Text style={styles.fieldLabel}>⏰ Select Target Push Notification Time</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipRow}>
                {["9:00 AM", "12:00 PM", "2:35 PM", "3:00 PM", "5:00 PM", "8:00 PM"].map(time => (
                  <TouchableOpacity
                    key={time}
                    style={[styles.timeChip, selectedTime === time && styles.timeChipActive]}
                    onPress={() => {
                      setSelectedTime(time);
                      setCustomTimeInput("");
                    }}
                  >
                    <Text style={[styles.timeChipText, selectedTime === time && styles.timeChipTextActive]}>
                      {time}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>

              {/* Custom Time Picker Input */}
              <Text style={styles.subFieldLabel}>Or Type Specific Time (e.g. 3:00 PM)</Text>
              <TextInput
                style={styles.modalInput}
                placeholder="e.g. 3:00 PM"
                placeholderTextColor="#94A3B8"
                value={customTimeInput}
                onChangeText={text => {
                  setCustomTimeInput(text);
                  setSelectedTime("custom");
                }}
              />

              {/* Live Reminder Calculation Banner */}
              <View style={styles.reminderCard}>
                <Text style={styles.reminderIcon}>🔔</Text>
                <View style={{ flex: 1 }}>
                  <Text style={styles.reminderTitle}>
                    Push Scheduled for {scheduleInfo.formattedTargetTime}
                  </Text>
                  <Text style={styles.reminderSub}>
                    • 20-min notification: {scheduleInfo.time20m}{"\n"}
                    • 5-min notification: {scheduleInfo.time5m}
                  </Text>
                </View>
              </View>
            </ScrollView>

            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.cancelBtn} onPress={() => setShowAddModal(false)}>
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.saveBtn} onPress={handleCreateTask} disabled={adding || !newTaskTitle.trim()}>
                {adding ? <ActivityIndicator color="#fff" /> : <Text style={styles.saveText}>Save Task</Text>}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#F8FAFC" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 14,
  },
  backBtn: { padding: 4, marginRight: 8 },
  backArrow: { fontSize: 22, color: "#1E293B", fontWeight: "600" },
  titleRow: { flexDirection: "row", alignItems: "baseline", flex: 1 },
  headerTitle: { fontSize: 32, fontWeight: "800", color: "#1E293B", marginRight: 10, letterSpacing: -0.5 },
  counterText: { fontSize: 15, fontWeight: "600", color: "#94A3B8" },
  headerRightActions: { flexDirection: "row", alignItems: "center", gap: 12 },
  iconBtn: { padding: 6 },
  headerActionIcon: { fontSize: 18, color: "#64748B" },

  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F1F5F9",
    borderRadius: 16,
    marginHorizontal: 20,
    marginTop: 6,
    marginBottom: 16,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  plusIcon: { fontSize: 20, color: "#94A3B8", marginRight: 10, fontWeight: "300" },
  input: { flex: 1, fontSize: 16, color: "#1E293B", padding: 0 },
  addBtnSmall: { backgroundColor: "#7C3AED", borderRadius: 10, paddingHorizontal: 14, paddingVertical: 6, marginLeft: 8 },
  addBtnText: { color: "#fff", fontWeight: "700", fontSize: 13 },

  listContent: { paddingHorizontal: 20, paddingBottom: 40 },
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#F1F5F9",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 1,
  },
  checkboxTouch: { paddingRight: 14 },
  checkboxHollow: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: "#A78BFA",
    backgroundColor: "transparent",
  },
  checkboxFilled: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: "#7C3AED",
    alignItems: "center",
    justifyContent: "center",
  },
  checkMark: { color: "#FFFFFF", fontSize: 12, fontWeight: "900" },

  taskTextContainer: { flex: 1 },
  taskTitle: { fontSize: 16, fontWeight: "600", color: "#1E293B" },
  taskTitleCompleted: { color: "#94A3B8", textDecorationLine: "line-through" },
  taskDescSub: { fontSize: 12, color: "#64748B", marginTop: 2 },
  taskTimeSub: { fontSize: 11, color: "#7C3AED", fontWeight: "600", marginTop: 2 },

  starTouch: { paddingLeft: 12 },
  starIcon: { fontSize: 20, color: "#E2E8F0" },
  starIconActive: { color: "#8B5CF6" },

  center: { flex: 1, alignItems: "center", justifyContent: "center" },

  modalOverlay: { flex: 1, backgroundColor: "rgba(15, 23, 42, 0.4)", justifyContent: "flex-end" },
  modalContent: { backgroundColor: "#FFFFFF", borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24 },
  modalHeaderRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 14 },
  modalTitle: { fontSize: 20, fontWeight: "800", color: "#0F172A" },
  closeBtn: { fontSize: 18, color: "#64748B", padding: 4 },

  fieldLabel: { fontSize: 13, fontWeight: "700", color: "#475569", marginTop: 12, marginBottom: 6 },
  subFieldLabel: { fontSize: 11, fontWeight: "600", color: "#94A3B8", marginTop: 8, marginBottom: 4 },
  modalInput: { backgroundColor: "#F8FAFC", borderWidth: 1, borderColor: "#E2E8F0", borderRadius: 12, paddingHorizontal: 14, paddingVertical: 12, fontSize: 15, color: "#0F172A" },

  chipRow: { flexDirection: "row", marginVertical: 4 },
  timeChip: { backgroundColor: "#F1F5F9", paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, marginRight: 8 },
  timeChipActive: { backgroundColor: "#7C3AED" },
  timeChipText: { fontSize: 13, fontWeight: "600", color: "#475569" },
  timeChipTextActive: { color: "#FFFFFF", fontWeight: "700" },

  reminderCard: { flexDirection: "row", alignItems: "center", backgroundColor: "#F5F3FF", borderRadius: 12, padding: 12, marginTop: 14, borderWidth: 1, borderColor: "#DDD6FE" },
  reminderIcon: { fontSize: 20, marginRight: 10 },
  reminderTitle: { fontSize: 13, fontWeight: "700", color: "#6D28D9" },
  reminderSub: { fontSize: 11, color: "#7C3AED", marginTop: 2, lineHeight: 16 },

  modalActions: { flexDirection: "row", gap: 12, marginTop: 20 },
  cancelBtn: { flex: 1, paddingVertical: 14, borderRadius: 14, backgroundColor: "#F1F5F9", alignItems: "center" },
  cancelText: { color: "#64748B", fontWeight: "700", fontSize: 15 },
  saveBtn: { flex: 1, paddingVertical: 14, borderRadius: 14, backgroundColor: "#7C3AED", alignItems: "center" },
  saveText: { color: "#FFFFFF", fontWeight: "800", fontSize: 15 },
});
