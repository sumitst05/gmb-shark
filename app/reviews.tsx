import { useState, useEffect } from "react";
import {
  View,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { useThemeColor } from "@/hooks/useThemeColor";
import { ThemedText } from "@/components/ui/ThemedText";
import { ThemedView } from "@/components/ui/ThemedView";
import { Ionicons } from "@expo/vector-icons";
import ReviewManagementModal from "../components/ui/ManageReviewModal";
import { MockAPI } from "@/src/api/mockClient";

interface Review {
  id: string;
  reviewerName: string;
  reviewerInitial: string;
  reviewerAvatar?: string;
  rating: number;
  reviewText: string;
  date: string;
  platform: "Google" | "Yelp" | "Facebook";
  hasReply: boolean;
  replyText?: string;
  isRecent: boolean;
}

interface ReviewCardProps {
  review: Review;
  onExpand: (review: Review) => void;
}

const ReviewCard = ({ review, onExpand }: ReviewCardProps) => {
  const cardColor = useThemeColor(
    { light: "#ffffff", dark: "#1c1c1e" },
    "background"
  );
  const textColor = useThemeColor({}, "text");
  const mutedColor = useThemeColor(
    { light: "#8e8e93", dark: "#8e8e93" },
    "text"
  );

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

  return (
    <View style={[styles.reviewCard, { backgroundColor: cardColor }]}>
      {/* Header */}
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
                    size={14}
                    color={star <= review.rating ? "#fbbf24" : "#e5e7eb"}
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
        <View style={styles.reviewActions}>
          <ThemedText style={[styles.reviewDate, { color: mutedColor }]}>
            {review.date}
          </ThemedText>
        </View>
      </View>

      {/* Review Content */}
      <View style={styles.reviewContent}>
        <ThemedText
          style={[styles.reviewText, { color: textColor }]}
          numberOfLines={3}
        >
          {review.reviewText}
        </ThemedText>
      </View>

      {/* Footer */}
      <View style={styles.reviewFooter}>
        <View style={styles.reviewStatus}>
          {review.hasReply ? (
            <View style={styles.statusContainer}>
              <Ionicons name="checkmark-circle" size={16} color="#10b981" />
              <ThemedText style={[styles.statusText, { color: "#10b981" }]}>
                Replied
              </ThemedText>
            </View>
          ) : (
            <View style={styles.statusContainer}>
              <Ionicons name="time" size={16} color="#f59e0b" />
              <ThemedText style={[styles.statusText, { color: "#f59e0b" }]}>
                Pending Reply
              </ThemedText>
            </View>
          )}
        </View>
        <TouchableOpacity
          style={styles.expandButton}
          onPress={() => onExpand(review)}
        >
          <ThemedText style={[styles.expandText, { color: "#3b82f6" }]}>
            Expand
          </ThemedText>
          <Ionicons name="chevron-forward" size={16} color="#3b82f6" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

interface StatsCardProps {
  reviews: Review[];
}

const StatsCard = ({ reviews }: StatsCardProps) => {
  const cardColor = useThemeColor(
    { light: "#ffffff", dark: "#1c1c1e" },
    "background"
  );
  const mutedColor = useThemeColor(
    { light: "#8e8e93", dark: "#8e8e93" },
    "text"
  );

  const avgRating =
    reviews.length > 0
      ? (
          reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
        ).toFixed(1)
      : "0.0";

  const pendingCount = reviews.filter((r) => !r.hasReply).length;

  return (
    <View style={[styles.statsCard, { backgroundColor: cardColor }]}>
      <View style={styles.statItem}>
        <ThemedText style={styles.statNumber}>{avgRating}</ThemedText>
        <ThemedText style={[styles.statLabel, { color: mutedColor }]}>
          Avg Rating
        </ThemedText>
      </View>
      <View style={styles.statDivider} />
      <View style={styles.statItem}>
        <ThemedText style={styles.statNumber}>{reviews.length}</ThemedText>
        <ThemedText style={[styles.statLabel, { color: mutedColor }]}>
          Total Reviews
        </ThemedText>
      </View>
      <View style={styles.statDivider} />
      <View style={styles.statItem}>
        <ThemedText style={[styles.statNumber, { color: "#f59e0b" }]}>
          {pendingCount}
        </ThemedText>
        <ThemedText style={[styles.statLabel, { color: mutedColor }]}>
          Pending
        </ThemedText>
      </View>
    </View>
  );
};

export default function ManageReviews() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [filterType, setFilterType] = useState<"all" | "pending" | "replied">(
    "all"
  );

  const backgroundColor = useThemeColor({}, "background");
  const mutedColor = useThemeColor(
    { light: "#8e8e93", dark: "#8e8e93" },
    "text"
  );

  useEffect(() => {
    const fetchReviews = async () => {
      setLoading(true);
      try {
        const data = await MockAPI.getReviews();
        setReviews(data as Review[]);
      } catch (error) {
        console.error("Failed to load reviews", error);
      } finally {
        setLoading(false);
      }
    };
    fetchReviews();
  }, []);

  const handleExpandReview = (review: Review) => {
    setSelectedReview(review);
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    setSelectedReview(null);
  };

  const handleUpdateReply = (reviewId: string, replyText: string) => {
    setReviews((prevReviews) =>
      prevReviews.map((review) =>
        review.id === reviewId
          ? {
              ...review,
              hasReply: replyText.length > 0,
              replyText: replyText.length > 0 ? replyText : undefined,
            }
          : review
      )
    );

    // Also update the selected review so the modal shows updated data
    if (selectedReview?.id === reviewId) {
      setSelectedReview((prev) =>
        prev
          ? {
              ...prev,
              hasReply: replyText.length > 0,
              replyText: replyText.length > 0 ? replyText : undefined,
            }
          : null
      );
    }
  };

  const filteredReviews = reviews.filter((review) => {
    if (filterType === "pending") return !review.hasReply;
    if (filterType === "replied") return review.hasReply;
    return true;
  });

  const renderReview = ({ item }: { item: Review }) => (
    <ReviewCard review={item} onExpand={handleExpandReview} />
  );

  if (loading) {
    return (
      <ThemedView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#3b82f6" />
          <ThemedText style={{ marginTop: 10, color: mutedColor }}>
            Loading reviews...
          </ThemedText>
        </View>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <ThemedText style={styles.headerTitle}>Manage Reviews</ThemedText>
        <ThemedText style={[styles.headerSubtitle, { color: mutedColor }]}>
          Monitor and respond to customer feedback
        </ThemedText>
      </View>

      {/* Stats Card */}
      <StatsCard reviews={reviews} />

      {/* Filter Tabs */}
      <View style={styles.filterContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterScroll}
        >
          {[
            { key: "all", label: "All Reviews", count: reviews.length },
            {
              key: "pending",
              label: "Pending Reply",
              count: reviews.filter((r) => !r.hasReply).length,
            },
            {
              key: "replied",
              label: "Replied",
              count: reviews.filter((r) => r.hasReply).length,
            },
          ].map((filter) => (
            <TouchableOpacity
              key={filter.key}
              style={[
                styles.filterTab,
                filterType === filter.key && styles.filterTabActive,
              ]}
              onPress={() => setFilterType(filter.key as any)}
            >
              <ThemedText
                style={[
                  styles.filterTabText,
                  filterType === filter.key && styles.filterTabTextActive,
                ]}
              >
                {filter.label} ({filter.count})
              </ThemedText>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Reviews List */}
      <FlatList
        data={filteredReviews}
        renderItem={renderReview}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.reviewsList}
      />

      {/* Review Management Modal */}
      <ReviewManagementModal
        visible={modalVisible}
        review={selectedReview}
        onClose={handleCloseModal}
        onUpdateReply={handleUpdateReply}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 10,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: "700",
    marginBottom: 2,
    lineHeight: 40,
  },
  headerSubtitle: {
    fontSize: 16,
  },
  statsCard: {
    flexDirection: "row",
    marginHorizontal: 24,
    marginBottom: 24,
    padding: 10,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 4,
  },
  statItem: {
    flex: 1,
    alignItems: "center",
  },
  statNumber: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    fontWeight: "500",
  },
  statDivider: {
    width: 1,
    backgroundColor: "#e5e7eb",
    marginHorizontal: 16,
  },
  filterContainer: {
    marginBottom: 16,
  },
  filterScroll: {
    paddingHorizontal: 24,
  },
  filterTab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 12,
    backgroundColor: "rgba(142, 142, 147, 0.1)",
  },
  filterTabActive: {
    backgroundColor: "#3b82f6",
  },
  filterTabText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#8e8e93",
  },
  filterTabTextActive: {
    color: "#ffffff",
  },
  reviewsList: {
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  reviewCard: {
    padding: 20,
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 4,
  },
  reviewHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  reviewerInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  reviewerAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  reviewerInitial: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
  },
  reviewerDetails: {
    flex: 1,
  },
  reviewerName: {
    fontSize: 16,
    fontWeight: "600",
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
    fontSize: 12,
    fontWeight: "600",
    marginLeft: 6,
  },
  platformBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    backgroundColor: "rgba(142, 142, 147, 0.1)",
  },
  platformText: {
    fontSize: 10,
    fontWeight: "600",
  },
  reviewActions: {
    alignItems: "flex-end",
  },
  newBadge: {
    backgroundColor: "#ef4444",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    marginBottom: 4,
  },
  newBadgeText: {
    color: "#ffffff",
    fontSize: 10,
    fontWeight: "600",
  },
  reviewDate: {
    fontSize: 12,
  },
  reviewContent: {
    marginBottom: 16,
  },
  reviewText: {
    fontSize: 14,
    lineHeight: 20,
  },
  reviewFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  reviewStatus: {
    flex: 1,
  },
  statusContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  statusText: {
    fontSize: 12,
    fontWeight: "500",
    marginLeft: 6,
  },
  expandButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  expandText: {
    fontSize: 14,
    fontWeight: "600",
    marginRight: 4,
  },
});
