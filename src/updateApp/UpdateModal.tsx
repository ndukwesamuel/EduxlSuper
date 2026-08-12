// src/components/UpdateModal.tsx
import React from "react";
import { Modal, View, Text, TouchableOpacity, StyleSheet, Linking, Platform } from "react-native";

type Props = {
  visible: boolean;
  force: boolean;
  message?: string;
  onClose: () => void;
};

export default function UpdateModal({ visible, force, message, onClose }: Props) {
  const handleUpdate = () => {
    const url =
      Platform.OS === "ios"
        ? "https://apps.apple.com/ng/app/pausepoint/id6739864683" // replace with your store link
        : "https://play.google.com/store/apps/details?id=com.pause_point.PausePoint&hl=en";

    Linking.openURL(url).catch((err) =>
      console.error("Error opening store link:", err),
    );
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={() => {
        // Android hardware back — only close if not forced
        if (!force) onClose();
      }}
    >
      <View style={styles.overlay}>
        <View style={styles.card}>
          <Text style={styles.emoji}>🚀</Text>
          <Text style={styles.title}>
            {force ? "Update Required" : "New Update Available"}
          </Text>
          <Text style={styles.message}>
            {message ||
              (force
                ? "You must update the app to continue using it."
                : "A new version is available with improvements and new features.")}
          </Text>

          <TouchableOpacity style={styles.updateButton} onPress={handleUpdate} activeOpacity={0.85}>
            <Text style={styles.updateButtonText}>Update Now</Text>
          </TouchableOpacity>

          {!force && (
            <TouchableOpacity style={styles.laterButton} onPress={onClose} activeOpacity={0.7}>
              <Text style={styles.laterButtonText}>Later</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 24,
    width: "100%",
    maxWidth: 380,
    alignItems: "center",
  },
  emoji: { fontSize: 40, marginBottom: 12 },
  title: {
    fontSize: 20,
    fontWeight: "800",
    color: "#111827",
    marginBottom: 8,
    textAlign: "center",
  },
  message: {
    fontSize: 14,
    color: "#374151",
    textAlign: "center",
    lineHeight: 20,
    marginBottom: 20,
  },
  updateButton: {
    backgroundColor: "#10B981",
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 14,
    width: "100%",
    alignItems: "center",
    marginBottom: 10,
  },
  updateButtonText: { color: "#fff", fontSize: 16, fontWeight: "700" },
  laterButton: { paddingVertical: 8 },
  laterButtonText: { color: "#6B7280", fontSize: 14, fontWeight: "600" },
});