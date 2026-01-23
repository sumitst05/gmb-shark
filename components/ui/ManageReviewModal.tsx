import { useState, useRef, useEffect } from "react";
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Modal,
  ScrollView,
  TextInput,
  Dimensions,
  Animated,
  Alert,
} from "react-native";
import { useThemeColor } from "@/hooks/useThemeColor";
import { ThemedText } from "@/components/ui/ThemedText";
import { Ionicons } from "@expo/vector-icons";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");

interface Review {
  id: string;
  reviewerName: string;
  reviewerInitial: string;
  rating: number;
  reviewText: string;
  date: string;
  platform: "Google" | "Yelp" | "Facebook";
  hasReply: boolean;
  replyText?: string;
  isRecent: boolean;
}

interface ReviewManagementModalProps {
  visible: boolean;
  review: Review | null;
  onClose: () => void;
  onUpdateReply?: (reviewId: string, replyText: string) => void;
}

export default function ReviewManagementModal({
  visible,
  review,
  onClose,
  onUpdateReply,
}: ReviewManagementModalProps) {
  const [replyText, setReplyText] = useState("");
  const [isReplying, setIsReplying] = useState(false);

  const slideAnim = useRef(new Animated.Value(SCREEN_HEIGHT)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  const cardColor = useThemeColor(
    { light: "#ffffff", dark: "#1c1c1e" },
    "background"
  );
  const backgroundColor = useThemeColor({}, "background");
  const textColor = useThemeColor({}, "text");
  const mutedColor = useThemeColor(
    { light: "#8e8e93", dark: "#8e8e93" },
    "text"
  );

  useEffect(() => {
    if (visible && review) {
      setReplyText(review.replyText || "");
      setIsReplying(!review.hasReply);
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    } else if (!visible) {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: SCREEN_HEIGHT,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 0,
          duration: 250,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible, review]);

  // Sync with review prop changes even when modal is open
  useEffect(() => {
    if (visible && review) {
      setReplyText(review.replyText || "");
      setIsReplying(!review.hasReply);
    }
  }, [review?.hasReply, review?.replyText]);

  const handleClose = () => {
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: SCREEN_HEIGHT,
        duration: 250,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
      }),
    ]).start(() => {
      onClose();
      setIsReplying(false);
      setReplyText("");
    });
  };

  const handleSendReply = () => {
    if (replyText.trim() && review) {
      onUpdateReply?.(review.id, replyText.trim());
      Alert.alert("Success", "Your reply has been sent!");
      setIsReplying(false);
    }
  };

  const handleDeleteReply = () => {
    Alert.alert("Delete Reply", "Are you sure you want to delete this reply?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => {
          if (review) {
            onUpdateReply?.(review.id, "");
            setReplyText("");
            setIsReplying(true);
          }
        },
      },
    ]);
  };

  const getPlatformColor = (platform: string) => {
    switch (platform) {
      case "Google":
        return "#4285f4";
      case "Yelp":
        return "#ff1744";
      case "Facebook":
        return "#1877f2";
      default:
        return "#8e8e93";
    }
  };

  const getRatingColor = (rating: number) => {
    if (rating >= 4) return "#10b981";
    if (rating >= 3) return "#f59e0b";
    return "#ef4444";
  };

  if (!review) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={handleClose}
    >
      {/* Backdrop */}
      <Animated.View style={[styles.backdrop, { opacity: opacityAnim }]}>
        <TouchableOpacity
          style={styles.backdropTouchable}
          onPress={handleClose}
          activeOpacity={1}
        />
      </Animated.View>

      {/* Modal Content */}
      <Animated.View
        style={[
          styles.modalContainer,
          { transform: [{ translateY: slideAnim }] },
        ]}
      >
        <View style={[styles.modalContent, { backgroundColor: cardColor }]}>
          {/* Handle Bar */}
          <View style={styles.handleBar} />

          {/* Header */}
          <View style={styles.header}>
            <ThemedText style={styles.headerTitle}>Review Details</ThemedText>
            <TouchableOpacity style={styles.closeButton} onPress={handleClose}>
              <Ionicons name="close" size={24} color={mutedColor} />
            </TouchableOpacity>
          </View>

          <ScrollView
            showsVerticalScrollIndicator={false}
            style={styles.scrollContent}
          >
            {/* Review Card */}
            <View style={[styles.reviewCard, { backgroundColor }]}>
              <View style={styles.reviewHeader}>
                <View style={styles.reviewerInfo}>
                  <View
                    style={[
                      styles.reviewerAvatar,
                      { backgroundColor: getPlatformColor(review.platform) },
                    ]}
                  >
                    <ThemedText style={styles.reviewerInitial}>
                      {review.reviewerInitial}
                    </ThemedText>
                  </View>
                  <View style={styles.reviewerDetails}>
                    <ThemedText style={styles.reviewerName}>
                      {review.reviewerName}
                    </ThemedText>
                    <View style={styles.reviewMeta}>
                      <View style={styles.ratingContainer}>
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Ionicons
                            key={star}
                            name="star"
                            size={16}
                            color={
                              star <= review.rating ? "#fbbf24" : "#e5e7eb"
                            }
                          />
                        ))}
                        <ThemedText
                          style={[
                            styles.ratingText,
                            { color: getRatingColor(review.rating) },
                          ]}
                        >
                          {review.rating}/5
                        </ThemedText>
                      </View>
                    </View>
                  </View>
                </View>
                <ThemedText style={[styles.reviewDate, { color: mutedColor }]}>
                  {review.date}
                </ThemedText>
              </View>

              <ThemedText style={[styles.reviewText, { color: textColor }]}>
                {review.reviewText}
              </ThemedText>
            </View>

            {/* Management Actions */}
            <View style={styles.actionsSection}>
              <ThemedText style={styles.sectionTitle}>Quick Actions</ThemedText>
              <View style={styles.quickActions}>
                <TouchableOpacity
                  style={[styles.actionButton, { backgroundColor: "#3b82f6" }]}
                >
                  <Ionicons name="flag" size={16} color="#ffffff" />
                  <ThemedText style={styles.actionButtonText}>
                    Report
                  </ThemedText>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.actionButton, { backgroundColor: "#8b5cf6" }]}
                >
                  <Ionicons name="share" size={16} color="#ffffff" />
                  <ThemedText style={styles.actionButtonText}>Share</ThemedText>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.actionButton, { backgroundColor: "#10b981" }]}
                >
                  <Ionicons name="analytics" size={16} color="#ffffff" />
                  <ThemedText style={styles.actionButtonText}>
                    Insights
                  </ThemedText>
                </TouchableOpacity>
              </View>
            </View>

            {/* Reply Section */}
            <View style={styles.replySection}>
              <View style={styles.replySectionHeader}>
                <ThemedText style={styles.sectionTitle}>
                  {review.hasReply ? "Your Reply" : "Reply to Review"}
                </ThemedText>
                {review.hasReply && !isReplying && (
                  <TouchableOpacity onPress={() => setIsReplying(true)}>
                    <ThemedText style={[styles.editText, { color: "#3b82f6" }]}>
                      Edit
                    </ThemedText>
                  </TouchableOpacity>
                )}
              </View>

              {review.hasReply && !isReplying ? (
                <View style={[styles.existingReply, { backgroundColor }]}>
                  <ThemedText style={[styles.replyText, { color: textColor }]}>
                    {review.replyText}
                  </ThemedText>
                  <View style={styles.replyActions}>
                    <TouchableOpacity
                      onPress={() => setIsReplying(true)}
                      style={styles.replyActionButton}
                    >
                      <Ionicons name="create" size={16} color="#3b82f6" />
                      <ThemedText
                        style={[styles.replyActionText, { color: "#3b82f6" }]}
                      >
                        Edit
                      </ThemedText>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={handleDeleteReply}
                      style={styles.replyActionButton}
                    >
                      <Ionicons name="trash" size={16} color="#ef4444" />
                      <ThemedText
                        style={[styles.replyActionText, { color: "#ef4444" }]}
                      >
                        Delete
                      </ThemedText>
                    </TouchableOpacity>
                  </View>
                </View>
              ) : (
                <View style={styles.replyInput}>
                  <TextInput
                    style={[
                      styles.textInput,
                      { backgroundColor, color: textColor },
                    ]}
                    placeholder="Write your reply here..."
                    placeholderTextColor={mutedColor}
                    value={replyText}
                    onChangeText={setReplyText}
                    multiline
                    numberOfLines={4}
                    textAlignVertical="top"
                  />
                  <View style={styles.replyButtons}>
                    {isReplying && review.hasReply && (
                      <TouchableOpacity
                        style={[
                          styles.replyButton,
                          { backgroundColor: mutedColor + "30" },
                        ]}
                        onPress={() => {
                          setIsReplying(false);
                          setReplyText(review.replyText || "");
                        }}
                      >
                        <ThemedText
                          style={[styles.replyButtonText, { color: textColor }]}
                        >
                          Cancel
                        </ThemedText>
                      </TouchableOpacity>
                    )}
                    <TouchableOpacity
                      style={[
                        styles.replyButton,
                        {
                          backgroundColor: replyText.trim()
                            ? "#3b82f6"
                            : "#8e8e93",
                          opacity: replyText.trim() ? 1 : 0.5,
                        },
                      ]}
                      onPress={handleSendReply}
                      disabled={!replyText.trim()}
                    >
                      <ThemedText style={styles.replyButtonText}>
                        {review.hasReply ? "Update Reply" : "Send Reply"}
                      </ThemedText>
                    </TouchableOpacity>
                  </View>
                </View>
              )}
            </View>

            {/* Reply Templates */}
            <View style={styles.templatesSection}>
              <ThemedText style={styles.sectionTitle}>
                Quick Templates
              </ThemedText>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {[
                  "Thank you for your feedback!",
                  "We appreciate your review and will work to improve.",
                  "Thanks for choosing us! We're glad you had a great experience.",
                  "We're sorry to hear about your experience. Please contact us to discuss.",
                ].map((template, index) => (
                  <TouchableOpacity
                    key={index}
                    style={[styles.templateButton, { backgroundColor }]}
                    onPress={() => {
                      setReplyText(template);
                      setIsReplying(true);
                    }}
                  >
                    <ThemedText
                      style={[styles.templateText, { color: textColor }]}
                      numberOfLines={2}
                    >
                      {template}
                    </ThemedText>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          </ScrollView>
        </View>
      </Animated.View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  backdropTouchable: {
    flex: 1,
  },
  modalContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: SCREEN_HEIGHT * 0.9,
  },
  modalContent: {
    flex: 1,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 12,
  },
  handleBar: {
    width: 40,
    height: 4,
    backgroundColor: "#d1d5db",
    borderRadius: 2,
    alignSelf: "center",
    marginBottom: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "700",
  },
  closeButton: {
    padding: 8,
  },
  scrollContent: {
    flex: 1,
  },
  reviewCard: {
    marginHorizontal: 24,
    padding: 20,
    borderRadius: 16,
    marginBottom: 24,
  },
  reviewHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 16,
  },
  reviewerInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  reviewerAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16,
  },
  reviewerInitial: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "600",
  },
  reviewerDetails: {
    flex: 1,
  },
  reviewerName: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 6,
  },
  reviewMeta: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  ratingText: {
    fontSize: 14,
    fontWeight: "600",
    marginLeft: 8,
  },
  platformBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  platformText: {
    fontSize: 12,
    fontWeight: "600",
  },
  reviewDate: {
    fontSize: 14,
  },
  reviewText: {
    fontSize: 16,
    lineHeight: 24,
  },
  actionsSection: {
    paddingHorizontal: 24,
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 16,
  },
  quickActions: {
    flexDirection: "row",
    gap: 12,
  },
  actionButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    borderRadius: 12,
    gap: 6,
  },
  actionButtonText: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "600",
  },
  replySection: {
    paddingHorizontal: 24,
    marginBottom: 32,
  },
  replySectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  editText: {
    fontSize: 14,
    fontWeight: "600",
  },
  existingReply: {
    padding: 16,
    borderRadius: 12,
  },
  replyText: {
    fontSize: 16,
    lineHeight: 22,
    marginBottom: 12,
  },
  replyActions: {
    flexDirection: "row",
    gap: 16,
  },
  replyActionButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  replyActionText: {
    fontSize: 14,
    fontWeight: "600",
  },
  replyInput: {
    gap: 16,
  },
  textInput: {
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    minHeight: 100,
    textAlignVertical: "top",
  },
  replyButtons: {
    flexDirection: "row",
    gap: 12,
    justifyContent: "flex-end",
  },
  replyButton: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 12,
  },
  replyButtonText: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "600",
  },
  templatesSection: {
    paddingHorizontal: 24,
    marginBottom: 32,
  },
  templateButton: {
    width: 200,
    padding: 12,
    borderRadius: 12,
    marginRight: 12,
  },
  templateText: {
    fontSize: 14,
    lineHeight: 18,
  },
});
