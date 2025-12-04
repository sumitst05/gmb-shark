import { useState, useEffect } from "react";
import {
  View,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  TextInput,
  ActivityIndicator,
} from "react-native";
import { useThemeColor } from "@/hooks/useThemeColor";
import { ThemedText } from "@/components/ui/ThemedText";
import { ThemedView } from "@/components/ui/ThemedView";
import { Ionicons } from "@expo/vector-icons";
import BusinessDetailModal from "@/components/ui/BuisnessDetailsModal";
import { MockAPI } from "@/src/api/mockClient";

interface BusinessItem {
  id: string;
  name: string;
  category: string;
  rating: number;
  reviews: number;
  address: string;
  distance: string;
  isOpen: boolean;
  phone?: string;
  website?: string;
  email?: string;
  attributes?: {
    hasWebsite: boolean;
    hasMenu: boolean;
    hasOnlineOrdering: boolean;
  };
}

interface SearchResultProps {
  item: BusinessItem;
  onPress: (item: BusinessItem) => void;
}

const SearchResultItem = ({ item, onPress }: SearchResultProps) => {
  const cardColor = useThemeColor(
    { light: "#ffffff", dark: "#1c1c1e" },
    "background",
  );
  const mutedColor = useThemeColor(
    { light: "#8e8e93", dark: "#8e8e93" },
    "text",
  );

  return (
    <TouchableOpacity
      style={[styles.resultItem, { backgroundColor: cardColor }]}
      onPress={() => onPress(item)}
      activeOpacity={0.7}
    >
      <View style={styles.resultHeader}>
        <View style={styles.resultInfo}>
          <ThemedText style={styles.resultName}>{item.name}</ThemedText>
          <ThemedText style={[styles.resultCategory, { color: mutedColor }]}>
            {item.category}
          </ThemedText>
        </View>
        <View style={styles.resultMeta}>
          <View style={styles.ratingContainer}>
            <Ionicons name="star" size={14} color="#fbbf24" />
            <ThemedText style={styles.rating}>{item.rating}</ThemedText>
            <ThemedText style={[styles.reviews, { color: mutedColor }]}>
              ({item.reviews})
            </ThemedText>
          </View>
          <View
            style={[
              styles.statusBadge,
              { backgroundColor: item.isOpen ? "#10b981" : "#ef4444" },
            ]}
          >
            <ThemedText style={styles.statusText}>
              {item.isOpen ? "Open" : "Closed"}
            </ThemedText>
          </View>
        </View>
      </View>

      <View style={styles.resultFooter}>
        <View style={styles.addressContainer}>
          <Ionicons name="location-outline" size={14} color={mutedColor} />
          <ThemedText
            style={[styles.address, { color: mutedColor }]}
            numberOfLines={1}
          >
            {item.address}
          </ThemedText>
        </View>
        <ThemedText style={[styles.distance, { color: mutedColor }]}>
          {item.distance}
        </ThemedText>
      </View>

      <View style={styles.attributesRow}>
        <View style={styles.attrTag}>
          <Ionicons
            name={
              item.attributes?.hasWebsite ? "checkmark-circle" : "close-circle"
            }
            size={14}
            color={item.attributes?.hasWebsite ? "#10b981" : "#ef4444"}
          />
          <ThemedText style={styles.attrText}>Website</ThemedText>
        </View>
        <View style={styles.attrTag}>
          <Ionicons
            name={
              item.attributes?.hasMenu ? "checkmark-circle" : "close-circle"
            }
            size={14}
            color={item.attributes?.hasMenu ? "#10b981" : "#ef4444"}
          />
          <ThemedText style={styles.attrText}>Menu</ThemedText>
        </View>
        <View style={styles.attrTag}>
          <Ionicons
            name={
              item.attributes?.hasOnlineOrdering
                ? "checkmark-circle"
                : "close-circle"
            }
            size={14}
            color={item.attributes?.hasOnlineOrdering ? "#10b981" : "#ef4444"}
          />
          <ThemedText style={styles.attrText}>Orders</ThemedText>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const NoResultsState = ({ searchQuery }: { searchQuery: string }) => {
  const mutedColor = useThemeColor(
    { light: "#8e8e93", dark: "#8e8e93" },
    "text",
  );
  return (
    <View style={styles.emptyState}>
      <Ionicons name="sad-outline" size={48} color={mutedColor} />
      <ThemedText style={[styles.emptyStateText, { color: mutedColor }]}>
        No results found for "{searchQuery}"
      </ThemedText>
      <ThemedText style={[styles.emptyStateSubtext, { color: mutedColor }]}>
        Try adjusting your search terms
      </ThemedText>
    </View>
  );
};

export default function SearchScreen() {
  const [searchQuery, setSearchQuery] = useState("");
  const [allCompetitors, setAllCompetitors] = useState<BusinessItem[]>([]);
  const [filteredResults, setFilteredResults] = useState<BusinessItem[]>([]);
  const [loading, setLoading] = useState(true);

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedBusiness, setSelectedBusiness] = useState<BusinessItem | null>(
    null,
  );

  const cardColor = useThemeColor(
    { light: "#ffffff", dark: "#1c1c1e" },
    "background",
  );
  const textColor = useThemeColor({}, "text");
  const mutedColor = useThemeColor(
    { light: "#8e8e93", dark: "#8e8e93" },
    "text",
  );

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const rawData = await MockAPI.getCompetitors();

        const mappedData = rawData.map((item: any) => ({
          id: item.placeId,
          name: item.title,
          category: item.category,
          rating: item.rating,
          reviews: item.reviewCount,
          address: item.address,
          distance: (Math.random() * 3 + 0.2).toFixed(1) + " km", // Random distance for realism
          isOpen: item.isOpen,
          phone: item.phone,
          website: item.website,
          email: item.email,
          attributes: item.attributes,
        }));

        setAllCompetitors(mappedData);
        setFilteredResults(mappedData);
      } catch (error) {
        console.error("Failed to load competitors", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredResults(allCompetitors);
    } else {
      const results = allCompetitors.filter(
        (item) =>
          item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.category.toLowerCase().includes(searchQuery.toLowerCase()),
      );
      setFilteredResults(results);
    }
  }, [searchQuery, allCompetitors]);

  const handleItemPress = (item: BusinessItem) => {
    setSelectedBusiness(item);
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    setSelectedBusiness(null);
  };

  const renderItem = ({ item }: { item: BusinessItem }) => (
    <SearchResultItem item={item} onPress={handleItemPress} />
  );

  return (
    <ThemedView style={styles.container}>
      <View style={styles.header}>
        <ThemedText style={styles.headerTitle}>Search Business</ThemedText>
        <ThemedText style={[styles.headerSubtitle, { color: mutedColor }]}>
          {allCompetitors.length} competitors tracked in your area
        </ThemedText>
      </View>

      <View style={[styles.searchContainer, { backgroundColor: cardColor }]}>
        <Ionicons
          name="search"
          size={20}
          color={mutedColor}
          style={styles.searchIcon}
        />
        <TextInput
          style={[styles.searchInput, { color: textColor }]}
          placeholder="Filter by name, category..."
          placeholderTextColor={mutedColor}
          value={searchQuery}
          onChangeText={setSearchQuery}
          autoCapitalize="none"
          autoCorrect={false}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity
            onPress={() => setSearchQuery("")}
            style={styles.clearButton}
          >
            <Ionicons name="close-circle" size={20} color={mutedColor} />
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.content}>
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#3b82f6" />
            <ThemedText style={{ marginTop: 10, color: mutedColor }}>
              Syncing market data...
            </ThemedText>
          </View>
        ) : (
          <FlatList
            data={filteredResults}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContainer}
            ListEmptyComponent={<NoResultsState searchQuery={searchQuery} />}
          />
        )}
      </View>

      <BusinessDetailModal
        visible={modalVisible}
        business={selectedBusiness as any}
        onClose={handleCloseModal}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingHorizontal: 24, paddingTop: 60, paddingBottom: 16 },
  headerTitle: { fontSize: 32, fontWeight: "700" },
  headerSubtitle: { fontSize: 14, marginTop: 4 },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 24,
    marginBottom: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 4,
  },
  searchIcon: { marginRight: 12 },
  searchInput: { flex: 1, fontSize: 16, paddingVertical: 4 },
  clearButton: { padding: 4 },
  content: { flex: 1, paddingHorizontal: 24 },
  listContainer: { paddingBottom: 24 },
  resultItem: {
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  resultHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  resultInfo: { flex: 1, marginRight: 12 },
  resultName: { fontSize: 16, fontWeight: "700", marginBottom: 2 },
  resultCategory: { fontSize: 12, fontWeight: "500" },
  resultMeta: { alignItems: "flex-end" },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  rating: { fontSize: 14, fontWeight: "700", marginLeft: 4, marginRight: 2 },
  reviews: { fontSize: 12 },
  statusBadge: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 8 },
  statusText: { color: "#ffffff", fontSize: 10, fontWeight: "700" },
  resultFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 4,
  },
  addressContainer: { flexDirection: "row", alignItems: "center", flex: 1 },
  address: { fontSize: 12, marginLeft: 6, flex: 1 },
  distance: { fontSize: 14, fontWeight: "500" },
  attributesRow: {
    flexDirection: "row",
    gap: 12,
    marginTop: 12,
    paddingTop: 10,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: "rgba(150,150,150,0.2)",
  },
  attrTag: { flexDirection: "row", alignItems: "center", gap: 4 },
  attrText: { fontSize: 11, fontWeight: "500", opacity: 0.8 },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 60,
  },
  emptyStateText: {
    fontSize: 16,
    fontWeight: "500",
    marginTop: 16,
    textAlign: "center",
  },
  emptyStateSubtext: { fontSize: 14, marginTop: 8, textAlign: "center" },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 60,
  },
});
