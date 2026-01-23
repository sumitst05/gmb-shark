import {
  View,
  TouchableOpacity,
  StyleSheet,
  Modal,
  ScrollView,
  Dimensions,
  Animated,
} from "react-native";
import { useEffect, useRef } from "react";
import { useThemeColor } from "@/hooks/useThemeColor";
import { ThemedText } from "@/components/ui/ThemedText";
import { Ionicons } from "@expo/vector-icons";

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get("window");

interface BusinessItem {
  id: string;
  name: string;
  category: string;
  rating: number;
  reviews: number;
  address: string;
  distance: string;
  isOpen: boolean;
}

interface BusinessDetailModalProps {
  visible: boolean;
  business: BusinessItem | null;
  onClose: () => void;
}

interface InfoRowProps {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: string;
  color?: string;
}

interface ActionButtonProps {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  onPress: () => void;
  color: string;
}

const InfoRow = ({ icon, label, value, color }: InfoRowProps) => {
  const textColor = useThemeColor({}, "text");
  const mutedColor = useThemeColor(
    { light: "#8e8e93", dark: "#8e8e93" },
    "text"
  );

  return (
    <View style={styles.infoRow}>
      <View style={styles.infoIcon}>
        <Ionicons name={icon} size={20} color={color || mutedColor} />
      </View>
      <View style={styles.infoContent}>
        <ThemedText style={[styles.infoLabel, { color: mutedColor }]}>
          {label}
        </ThemedText>
        <ThemedText style={[styles.infoValue, { color: textColor }]}>
          {value}
        </ThemedText>
      </View>
    </View>
  );
};

const ActionButton = ({ icon, label, onPress, color }: ActionButtonProps) => {
  return (
    <TouchableOpacity
      style={[styles.actionButton, { backgroundColor: color }]}
      onPress={onPress}
    >
      <Ionicons name={icon} size={20} color="#ffffff" />
      <ThemedText style={styles.actionButtonText}>{label}</ThemedText>
    </TouchableOpacity>
  );
};

export default function BusinessDetailModal({
  visible,
  business,
  onClose,
}: BusinessDetailModalProps) {
  const slideAnim = useRef(new Animated.Value(SCREEN_HEIGHT)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  const cardColor = useThemeColor(
    { light: "#ffffff", dark: "#1c1c1e" },
    "background"
  );
  const textColor = useThemeColor({}, "text");
  const mutedColor = useThemeColor(
    { light: "#8e8e93", dark: "#8e8e93" },
    "text"
  );

  useEffect(() => {
    if (visible) {
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
    } else {
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
  }, [visible]);

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
    });
  };

  if (!business) return null;

  // Mock additional business data
  const businessDetails = {
    phone: "+1 (555) 123-4567",
    website: "www.example.com",
    hours: "9:00 AM - 10:00 PM",
    description:
      "A wonderful place to visit with excellent service and great atmosphere. Perfect for families and friends.",
    amenities: ["WiFi", "Parking", "Wheelchair Accessible", "Outdoor Seating"],
    photos: 12,
  };

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
          {
            transform: [{ translateY: slideAnim }],
          },
        ]}
      >
        <View style={[styles.modalContent, { backgroundColor: cardColor }]}>
          {/* Handle Bar */}
          <View style={styles.handleBar} />

          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <ThemedText style={styles.businessName}>
                {business.name}
              </ThemedText>
              <ThemedText
                style={[styles.businessCategory, { color: mutedColor }]}
              >
                {business.category}
              </ThemedText>
            </View>
            <TouchableOpacity style={styles.closeButton} onPress={handleClose}>
              <Ionicons name="close" size={24} color={mutedColor} />
            </TouchableOpacity>
          </View>

          {/* Rating and Status */}
          <View style={styles.ratingSection}>
            <View style={styles.ratingContainer}>
              <View style={styles.starsContainer}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <Ionicons
                    key={star}
                    name="star"
                    size={16}
                    color={
                      star <= Math.floor(business.rating)
                        ? "#fbbf24"
                        : "#e5e7eb"
                    }
                  />
                ))}
              </View>
              <ThemedText style={styles.ratingText}>
                {business.rating}
              </ThemedText>
              <ThemedText style={[styles.reviewsText, { color: mutedColor }]}>
                ({business.reviews} reviews)
              </ThemedText>
            </View>
            <View
              style={[
                styles.statusBadge,
                { backgroundColor: business.isOpen ? "#10b981" : "#ef4444" },
              ]}
            >
              <ThemedText style={styles.statusText}>
                {business.isOpen ? "Open Now" : "Closed"}
              </ThemedText>
            </View>
          </View>

          <ScrollView
            showsVerticalScrollIndicator={false}
            style={styles.scrollContent}
          >
            {/* Quick Actions */}
            <View style={styles.actionsContainer}>
              <ActionButton
                icon="call"
                label="Call"
                onPress={() => console.log("Call")}
                color="#10b981"
              />
              <ActionButton
                icon="navigate"
                label="Directions"
                onPress={() => console.log("Directions")}
                color="#3b82f6"
              />
              <ActionButton
                icon="globe"
                label="Website"
                onPress={() => console.log("Website")}
                color="#8b5cf6"
              />
            </View>

            {/* Business Info */}
            <View style={styles.infoSection}>
              <ThemedText style={styles.sectionTitle}>Information</ThemedText>
              <InfoRow
                icon="location"
                label="Address"
                value={business.address}
              />
              <InfoRow
                icon="call"
                label="Phone"
                value={businessDetails.phone}
              />
              <InfoRow
                icon="time"
                label="Hours"
                value={businessDetails.hours}
              />
              <InfoRow icon="car" label="Distance" value={business.distance} />
            </View>

            {/* Description */}
            <View style={styles.descriptionSection}>
              <ThemedText style={styles.sectionTitle}>About</ThemedText>
              <ThemedText style={[styles.description, { color: textColor }]}>
                {businessDetails.description}
              </ThemedText>
            </View>

            {/* Amenities */}
            <View style={styles.amenitiesSection}>
              <ThemedText style={styles.sectionTitle}>Amenities</ThemedText>
              <View style={styles.amenitiesContainer}>
                {businessDetails.amenities.map((amenity, index) => (
                  <View
                    key={index}
                    style={[
                      styles.amenityTag,
                      { backgroundColor: mutedColor + "20" },
                    ]}
                  >
                    <ThemedText
                      style={[styles.amenityText, { color: textColor }]}
                    >
                      {amenity}
                    </ThemedText>
                  </View>
                ))}
              </View>
            </View>

            {/* Photos Section */}
            <View style={styles.photosSection}>
              <View style={styles.photosSectionHeader}>
                <ThemedText style={styles.sectionTitle}>Photos</ThemedText>
                <TouchableOpacity>
                  <ThemedText
                    style={[styles.viewAllText, { color: "#3b82f6" }]}
                  >
                    View all ({businessDetails.photos})
                  </ThemedText>
                </TouchableOpacity>
              </View>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.photosScroll}
              >
                {[1, 2, 3, 4].map((photo) => (
                  <View
                    key={photo}
                    style={[
                      styles.photoPlaceholder,
                      { backgroundColor: mutedColor + "30" },
                    ]}
                  >
                    <Ionicons name="image" size={24} color={mutedColor} />
                  </View>
                ))}
              </ScrollView>
            </View>

            {/* Reviews Preview */}
            <View style={styles.reviewsSection}>
              <View style={styles.reviewsSectionHeader}>
                <ThemedText style={styles.sectionTitle}>Reviews</ThemedText>
                <TouchableOpacity>
                  <ThemedText
                    style={[styles.viewAllText, { color: "#3b82f6" }]}
                  >
                    View all
                  </ThemedText>
                </TouchableOpacity>
              </View>
              <View
                style={[
                  styles.reviewCard,
                  { backgroundColor: mutedColor + "10" },
                ]}
              >
                <View style={styles.reviewHeader}>
                  <View style={styles.reviewerInfo}>
                    <View
                      style={[
                        styles.reviewerAvatar,
                        { backgroundColor: "#3b82f6" },
                      ]}
                    >
                      <ThemedText style={styles.reviewerInitial}>J</ThemedText>
                    </View>
                    <View>
                      <ThemedText style={styles.reviewerName}>
                        John D.
                      </ThemedText>
                      <View style={styles.reviewStars}>
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Ionicons
                            key={star}
                            name="star"
                            size={12}
                            color="#fbbf24"
                          />
                        ))}
                      </View>
                    </View>
                  </View>
                  <ThemedText
                    style={[styles.reviewDate, { color: mutedColor }]}
                  >
                    2 days ago
                  </ThemedText>
                </View>
                <ThemedText style={[styles.reviewText, { color: textColor }]}>
                  Great service and friendly staff. Highly recommend this place!
                </ThemedText>
              </View>
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
    alignItems: "flex-start",
    paddingHorizontal: 24,
    marginBottom: 16,
  },
  headerLeft: {
    flex: 1,
  },
  businessName: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 4,
  },
  businessCategory: {
    fontSize: 16,
    fontWeight: "500",
  },
  closeButton: {
    padding: 8,
    marginTop: -8,
  },
  ratingSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  starsContainer: {
    flexDirection: "row",
    marginRight: 8,
  },
  ratingText: {
    fontSize: 16,
    fontWeight: "600",
    marginRight: 8,
  },
  reviewsText: {
    fontSize: 14,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  statusText: {
    color: "#ffffff",
    fontSize: 12,
    fontWeight: "600",
  },
  scrollContent: {
    flex: 1,
  },
  actionsContainer: {
    flexDirection: "row",
    paddingHorizontal: 24,
    marginBottom: 32,
    gap: 12,
  },
  actionButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 8,
    borderRadius: 12,
    gap: 6,
  },
  actionButtonText: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "600",
  },
  infoSection: {
    paddingHorizontal: 24,
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  infoIcon: {
    width: 40,
    alignItems: "center",
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 12,
    fontWeight: "500",
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: "500",
  },
  descriptionSection: {
    paddingHorizontal: 24,
    marginBottom: 32,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
  },
  amenitiesSection: {
    paddingHorizontal: 24,
    marginBottom: 32,
  },
  amenitiesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  amenityTag: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  amenityText: {
    fontSize: 14,
    fontWeight: "500",
  },
  photosSection: {
    marginBottom: 32,
  },
  photosSectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 24,
    marginBottom: 16,
  },
  viewAllText: {
    fontSize: 14,
    fontWeight: "600",
  },
  photosScroll: {
    paddingLeft: 24,
  },
  photoPlaceholder: {
    width: 120,
    height: 80,
    borderRadius: 12,
    marginRight: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  reviewsSection: {
    paddingHorizontal: 24,
    marginBottom: 32,
  },
  reviewsSectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  reviewCard: {
    padding: 16,
    borderRadius: 12,
  },
  reviewHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  reviewerInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  reviewerAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  reviewerInitial: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "600",
  },
  reviewerName: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 2,
  },
  reviewStars: {
    flexDirection: "row",
  },
  reviewDate: {
    fontSize: 12,
  },
  reviewText: {
    fontSize: 14,
    lineHeight: 20,
  },
});
