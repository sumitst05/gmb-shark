import React, { useState, useEffect } from "react";
import {
  View,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
  Text,
  StyleSheet,
  FlatList,
} from "react-native";
import { useRouter } from "expo-router";
import { ThemedView } from "@/components/ui/ThemedView";
import { ThemedText } from "@/components/ui/ThemedText";
import { Check, Clock, Trash } from "lucide-react-native";

interface Post {
  id: string;
  title: string;
  description: string;
  type: "announcement" | "offer" | "event" | "update";
  cta?: string;
  ctaUrl?: string;
  scheduledTime: Date;
  isPosted: boolean;
}

export default function SchedulePostsScreen() {
  const router = useRouter();
  const [posts, setPosts] = useState<Post[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [form, setForm] = useState({
    title: "",
    description: "",
    type: "announcement" as const,
    cta: "",
    ctaUrl: "",
    date: new Date().toISOString().split("T")[0],
    time: "12:00",
  });

  // Check every 30s if scheduled time arrived
  useEffect(() => {
    const interval = setInterval(() => {
      setPosts((prev) =>
        prev.map((post) => {
          if (!post.isPosted && post.scheduledTime <= new Date()) {
            return { ...post, isPosted: true };
          }
          return post;
        })
      );
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const addPost = () => {
    if (!form.title.trim() || !form.description.trim()) {
      alert("Fill in title and description");
      return;
    }

    const [year, month, day] = form.date.split("-");
    const [hours, minutes] = form.time.split(":");
    const scheduledTime = new Date(
      parseInt(year),
      parseInt(month) - 1,
      parseInt(day),
      parseInt(hours),
      parseInt(minutes)
    );

    if (scheduledTime <= new Date()) {
      alert("Select a future date/time");
      return;
    }

    const newPost: Post = {
      id: Date.now().toString(),
      title: form.title,
      description: form.description,
      type: form.type,
      cta: form.cta || undefined,
      ctaUrl: form.ctaUrl || undefined,
      scheduledTime,
      isPosted: false,
    };

    setPosts([newPost, ...posts]);
    resetForm();
    setModalVisible(false);
  };

  const resetForm = () => {
    setForm({
      title: "",
      description: "",
      type: "announcement",
      cta: "",
      ctaUrl: "",
      date: new Date().toISOString().split("T")[0],
      time: "12:00",
    });
  };

  const deletePost = (id: string) => {
    setPosts(posts.filter((p) => p.id !== id));
  };

  const getTimeString = (scheduledTime: Date, isPosted: boolean) => {
    if (isPosted) return "Posted";
    const diff = scheduledTime.getTime() - Date.now();
    if (diff < 0) return "Ready";
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${mins}m`;
  };

  return (
    <ThemedView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <ThemedText style={styles.title}>Schedule Posts</ThemedText>
        <TouchableOpacity
          onPress={() => setModalVisible(true)}
          style={styles.addBtn}
        >
          <Text style={styles.addBtnText}>+ New</Text>
        </TouchableOpacity>
      </View>

      {/* Posts List */}
      {posts.length === 0 ? (
        <View style={styles.empty}>
          <ThemedText style={styles.emptyText}>No posts scheduled</ThemedText>
          <TouchableOpacity
            onPress={() => setModalVisible(true)}
            style={styles.emptyBtn}
          >
            <Text style={styles.emptyBtnText}>Create First Post</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={posts}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.postItem}>
              <View style={styles.postContent}>
                <ThemedText style={styles.postTitle}>{item.title}</ThemedText>
                <ThemedText style={styles.postDesc}>
                  {item.description}
                </ThemedText>
                <View style={styles.postMeta}>
                  <ThemedText style={styles.postType}>{item.type}</ThemedText>
                  {item.cta && (
                    <ThemedText style={styles.ctaLabel}>
                      CTA: {item.cta}
                    </ThemedText>
                  )}
                </View>
              </View>

              <View style={styles.postRight}>
                <View style={styles.statusBadge}>
                  <Text>
                    {item.isPosted ? (
                      <Check color="#57e389" size={16} />
                    ) : (
                      <Clock color="#f6d32d" size={16} />
                    )}
                  </Text>
                </View>
                <ThemedText style={styles.timeText}>
                  {getTimeString(item.scheduledTime, item.isPosted)}
                </ThemedText>
                <TouchableOpacity onPress={() => deletePost(item.id)}>
                  <Text style={styles.deleteBtnText}>
                    <Trash color="#e01b24" size={15} />
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
          contentContainerStyle={styles.list}
          scrollEnabled={true}
        />
      )}

      {/* Modal */}
      <Modal visible={modalVisible} animationType="slide" transparent>
        <ThemedView style={styles.modal}>
          <View style={styles.modalHeader}>
            <TouchableOpacity
              onPress={() => {
                resetForm();
                setModalVisible(false);
              }}
            >
              <ThemedText style={styles.closeBtn}>✕ Close</ThemedText>
            </TouchableOpacity>
            <ThemedText style={styles.modalTitle}>New Post</ThemedText>
            <View style={{ width: 40 }} />
          </View>

          <ScrollView
            style={styles.modalContent}
            showsVerticalScrollIndicator={false}
          >
            {/* Title */}
            <View style={styles.formGroup}>
              <ThemedText style={styles.label}>Title (60 chars)</ThemedText>
              <TextInput
                style={styles.input}
                placeholder="Post title"
                placeholderTextColor="gray"
                value={form.title}
                onChangeText={(text) =>
                  setForm({ ...form, title: text.slice(0, 60) })
                }
              />
              <ThemedText style={styles.charCount}>
                {form.title.length}/60
              </ThemedText>
            </View>

            {/* Description */}
            <View style={styles.formGroup}>
              <ThemedText style={styles.label}>
                Description (500 chars)
              </ThemedText>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Post description"
                placeholderTextColor="gray"
                value={form.description}
                onChangeText={(text) =>
                  setForm({ ...form, description: text.slice(0, 500) })
                }
                multiline
                numberOfLines={4}
              />
              <ThemedText style={styles.charCount}>
                {form.description.length}/500
              </ThemedText>
            </View>

            {/* Type */}
            <View style={styles.formGroup}>
              <ThemedText style={styles.label}>Post Type</ThemedText>
              <View style={styles.typeRow}>
                {["announcement", "offer", "event", "update"].map((t) => (
                  <TouchableOpacity
                    key={t}
                    onPress={() => setForm({ ...form, type: t as any })}
                    style={[
                      styles.typeBtn,
                      form.type === t && styles.typeBtnActive,
                    ]}
                  >
                    <Text style={styles.typeBtnText}>{t}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* CTA */}
            <View style={styles.formGroup}>
              <ThemedText style={styles.label}>
                CTA Button Text (optional)
              </ThemedText>
              <TextInput
                style={styles.input}
                placeholder="e.g. Learn More"
                placeholderTextColor="gray"
                value={form.cta}
                onChangeText={(text) => setForm({ ...form, cta: text })}
              />
            </View>

            <View style={styles.formGroup}>
              <ThemedText style={styles.label}>CTA URL</ThemedText>
              <TextInput
                style={styles.input}
                placeholder="https://example.com"
                placeholderTextColor="gray"
                value={form.ctaUrl}
                onChangeText={(text) => setForm({ ...form, ctaUrl: text })}
                keyboardType="url"
              />
            </View>

            {/* Schedule Date */}
            <View style={styles.formGroup}>
              <ThemedText style={styles.label}>Date (YYYY-MM-DD)</ThemedText>
              <TextInput
                style={styles.input}
                placeholder={new Date().toISOString().split("T")[0]}
                placeholderTextColor="gray"
                value={form.date}
                onChangeText={(text) => setForm({ ...form, date: text })}
              />
            </View>

            {/* Schedule Time */}
            <View style={styles.formGroup}>
              <ThemedText style={styles.label}>Time (HH:MM)</ThemedText>
              <TextInput
                style={styles.input}
                placeholder="12:00"
                placeholderTextColor="gray"
                value={form.time}
                onChangeText={(text) => setForm({ ...form, time: text })}
              />
            </View>

            {/* Action Buttons */}
            <View style={styles.modalActions}>
              <TouchableOpacity
                onPress={() => {
                  resetForm();
                  setModalVisible(false);
                }}
                style={styles.cancelBtn}
              >
                <Text style={styles.cancelBtnText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={addPost} style={styles.scheduleBtn}>
                <Text style={styles.scheduleBtnText}>Schedule Post</Text>
              </TouchableOpacity>
            </View>

            <View style={{ height: 40 }} />
          </ScrollView>
        </ThemedView>
      </Modal>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(128, 128, 128, 0.1)",
  },
  backBtn: {
    fontSize: 14,
    fontWeight: "600",
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
  },
  addBtn: {
    backgroundColor: "#8b5cf6",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  addBtnText: {
    color: "white",
    fontWeight: "600",
    fontSize: 14,
  },
  empty: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 16,
  },
  emptyBtn: {
    backgroundColor: "#8b5cf6",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  emptyBtnText: {
    color: "white",
    fontWeight: "600",
  },
  list: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  postItem: {
    flexDirection: "row",
    backgroundColor: "#1e1b2e",
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: "rgba(139, 92, 246, 0.25)",
  },
  postContent: {
    flex: 1,
    marginRight: 12,
  },
  postTitle: {
    fontSize: 14,
    fontWeight: "700",
    marginBottom: 4,
  },
  postDesc: {
    fontSize: 12,
    color: "#a89bc2",
    marginBottom: 8,
  },
  postMeta: {
    flexDirection: "row",
    gap: 8,
  },
  postType: {
    fontSize: 11,
    backgroundColor: "rgba(139, 92, 246, 0.2)",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    color: "#c4b5fd",
  },
  ctaLabel: {
    fontSize: 11,
    backgroundColor: "rgba(211, 47, 47, 0.2)",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    color: "#f87171",
  },
  postRight: {
    alignItems: "flex-end",
    gap: 8,
  },
  statusBadge: {
    width: 32,
    height: 32,
    justifyContent: "center",
    alignItems: "center",
  },
  timeText: {
    fontSize: 11,
    fontWeight: "600",
  },
  deleteBtnText: {
    fontSize: 16,
    color: "#d32f2f",
  },
  modal: {
    flex: 1,
    backgroundColor: "#2b2b2b",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 255, 255, 0.1)",
  },
  closeBtn: {
    fontSize: 14,
    fontWeight: "600",
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: "700",
  },
  modalContent: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  formGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 13,
    fontWeight: "600",
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: "#c4b5fd",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    backgroundColor: "#2b2b2b",
    color: "white",
  },
  textArea: {
    height: 100,
    textAlignVertical: "top",
  },
  charCount: {
    fontSize: 11,
    color: "#999",
    marginTop: 4,
  },
  typeRow: {
    flexDirection: "row",
    gap: 8,
    flexWrap: "wrap",
  },
  typeBtn: {
    borderWidth: 1,
    borderColor: "#8b5cf6",
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    backgroundColor: "#2b2b2b",
  },
  typeBtnActive: {
    backgroundColor: "#8b5cf6",
    borderColor: "#8b5cf6",
  },
  typeBtnText: {
    fontSize: 12,
    fontWeight: "600",
    color: "white",
  },
  modalActions: {
    flexDirection: "row",
    gap: 8,
    marginTop: 20,
  },
  cancelBtn: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#8b5cf6",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  cancelBtnText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#c4b5fd",
  },
  scheduleBtn: {
    flex: 1,
    backgroundColor: "#8b5cf6",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  scheduleBtnText: {
    fontSize: 14,
    fontWeight: "600",
    color: "white",
  },
});
