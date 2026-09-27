/**
 * Todo Service for EduXL App
 * Communicates directly with Eduxl2 Backend API for Todo tasks & Push Notification Reminders.
 */
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  fetchTodosApi,
  createTodoApi,
  updateTodoApi,
  deleteTodoApi
} from "../../config/client";
import { scheduleTaskReminders } from "../utils/notifee";
import { store } from "../store/store";
import { showToast } from "../store/toastSlice";

export interface TodoItem {
  _id: string;
  userId?: string;
  title: string;
  description?: string;
  category?: string; // e.g. "Study", "Assignment", "Exam", "Personal"
  dueDate: string;   // ISO string or date
  dueTimeString?: string; // e.g. "2:35pm"
  completed: boolean;
  isStarred?: boolean;
  isNotified?: boolean; // When push notification triggers, star beside task lights up!
  notifiedAt20m?: boolean;
  notifiedAt5m?: boolean;
  priority?: "high" | "medium" | "low";
  createdAt?: string;
}

const STORAGE_KEY = "@eduxl_todos_v1";

/**
 * Fetch all todo items directly from Eduxl2 backend API.
 */
export async function fetchTodos(): Promise<TodoItem[]> {
  try {
    const apiTodos = await fetchTodosApi();
    if (Array.isArray(apiTodos)) {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(apiTodos));
      return checkAndAutoNotify(apiTodos);
    }
  } catch (error) {
    console.warn("⚠️ Eduxl2 backend fetch warning, using cached items:", error);
  }

  // AsyncStorage cache fallback if offline — read-only fallback is fine here,
  // it's just showing what we already know, not pretending a write succeeded.
  try {
    const cached = await getCachedTodos();
    return checkAndAutoNotify(cached);
  } catch {}

  return [];
}

/** Read the local cache directly, no network — for cheap local-state lookups. */
async function getCachedTodos(): Promise<TodoItem[]> {
  const raw = await AsyncStorage.getItem(STORAGE_KEY);
  return raw ? JSON.parse(raw) : [];
}

/**
 * Create a new todo item on Eduxl2 backend API.
 * Throws on failure — callers should catch and keep the user's input rather
 * than have this silently fabricate a local-only item that never syncs.
 */
export async function addTodo(
  title: string,
  description: string = "",
  category: string = "General",
  dueMinutes: number = 30,
  customDueTimeString?: string
): Promise<TodoItem> {
  const targetDate = new Date(Date.now() + dueMinutes * 60 * 1000);
  const timeStr = customDueTimeString && customDueTimeString.trim().length > 0
    ? customDueTimeString
    : targetDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  const newTodoPayload = {
    title: title.trim(),
    description: description.trim(),
    category,
    dueDate: targetDate.toISOString(),
    dueTimeString: timeStr,
    completed: false,
    isStarred: false,
    isNotified: false,
    priority: (dueMinutes <= 30 ? "high" : "medium") as "high" | "medium" | "low"
  };

  try {
    const created = await createTodoApi(newTodoPayload);
    await scheduleTaskReminders(created._id, created.title, targetDate.getTime());
    await updateCacheWithItem(created);
    return created;
  } catch (error) {
    console.error("❌ Error creating todo on Eduxl2 backend:", error);
    store.dispatch(showToast({ message: "Couldn't create task. Check your connection and try again.", variant: "error" }));
    throw error;
  }
}

/**
 * Update todo item on Eduxl2 backend API.
 * Throws on failure — see addTodo's note on why this no longer fabricates a
 * fake local success.
 */
export async function updateTodoItem(id: string, updates: Partial<TodoItem>): Promise<TodoItem> {
  try {
    const updated = await updateTodoApi(id, updates);
    await updateCacheWithItem(updated);
    if (updates.dueDate && updates.title) {
      const timestamp = new Date(updates.dueDate).getTime();
      await scheduleTaskReminders(id, updates.title, timestamp);
    }
    return updated;
  } catch (error) {
    console.error("❌ Error updating todo on Eduxl2 backend:", error);
    store.dispatch(showToast({ message: "Couldn't update task. Check your connection and try again.", variant: "error" }));
    throw error;
  }
}

/**
 * Toggle completion status on Eduxl2 backend API.
 */
export async function toggleTodoComplete(id: string): Promise<TodoItem | null> {
  const cached = await getCachedTodos();
  const target = cached.find(t => t._id === id);
  if (!target) return null;

  return updateTodoItem(id, { completed: !target.completed });
}

/**
 * Delete a todo item on Eduxl2 backend API.
 */
export async function deleteTodoItem(id: string): Promise<boolean> {
  try {
    await deleteTodoApi(id);
  } catch (error) {
    console.error("❌ Error deleting todo on Eduxl2 backend:", error);
    store.dispatch(showToast({ message: "Couldn't delete task. Check your connection and try again.", variant: "error" }));
    throw error;
  }

  const cached = await getCachedTodos();
  const filtered = cached.filter(t => t._id !== id);
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  return true;
}

function checkAndAutoNotify(todos: TodoItem[]): TodoItem[] {
  const now = Date.now();
  return todos.map(t => {
    if (t.dueDate && !t.completed) {
      const due = new Date(t.dueDate).getTime();
      const diffMinutes = (due - now) / (1000 * 60);

      if (diffMinutes <= 20 && !t.isNotified) {
        return { ...t, isNotified: true, isStarred: true };
      }
    }
    return t;
  });
}

/** Merge one item into the local cache without hitting the network. */
async function updateCacheWithItem(todo: TodoItem) {
  const cached = await getCachedTodos();
  const updated = [todo, ...cached.filter(t => t._id !== todo._id)];
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
}
