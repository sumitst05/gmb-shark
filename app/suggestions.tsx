import {
  View,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  FlatList,
} from "react-native";
import { useThemeColor } from "@/hooks/useThemeColor";
import { ThemedText } from "@/components/ui/ThemedText";
import { ThemedView } from "@/components/ui/ThemedView";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

interface Suggestion {
  id: string;
  text: string;
  isGood: boolean;
}

const suggestions: Suggestion[] = [
  { id: "1", text: "Professional photos", isGood: true },
  { id: "2", text: "Complete business info", isGood: true },
  { id: "3", text: "Regular posts", isGood: false },
  { id: "4", text: "Respond to reviews", isGood: false },
  { id: "5", text: "Add opening hours", isGood: true },
  { id: "6", text: "Add menu link", isGood: false },
];

const SuggestionItem = ({ item }: { item: Suggestion }) => {
  const isGood = item.isGood;

  return (
    <View
      style={[
        styles.suggestionItem,
        isGood ? styles.suggestionGood : styles.suggestionBad,
      ]}
    >
      <View
        style={[
          styles.iconWrapper,
          isGood ? styles.iconWrapperGood : styles.iconWrapperBad,
        ]}
      >
        <Ionicons
          name={isGood ? "checkmark" : "close"}
          size={14}
          color={isGood ? "#10b981" : "#ef4444"}
        />
      </View>
      <ThemedText
        style={[
          styles.suggestionText,
          isGood ? styles.textGood : styles.textBad,
        ]}
      >
        {item.text}
      </ThemedText>
      {!isGood && (
        <Ionicons
          name="chevron-forward"
          size={16}
          color="rgba(239, 68, 68, 0.4)"
        />
      )}
    </View>
  );
};

export default function SuggestionsScreen() {
  const cardColor = useThemeColor(
    { light: "#ffffff", dark: "#1c1c1e" },
    "background"
  );
  const mutedColor = useThemeColor(
    { light: "#8e8e93", dark: "#8e8e93" },
    "text"
  );

  const goodCount = suggestions.filter((s) => s.isGood).length;
  const badCount = suggestions.filter((s) => !s.isGood).length;

  return (
    <ThemedView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={styles.scrollView}
      >
        {/* Completed section */}
        <ThemedText style={[styles.sectionLabel, { color: mutedColor }]}>
          Completed
        </ThemedText>
        {suggestions
          .filter((s) => s.isGood)
          .map((item) => (
            <SuggestionItem key={item.id} item={item} />
          ))}

        {/* Pending section */}
        <ThemedText
          style={[styles.sectionLabel, { color: mutedColor, marginTop: 20 }]}
        >
          Needs Attention
        </ThemedText>
        {suggestions
          .filter((s) => !s.isGood)
          .map((item) => (
            <SuggestionItem key={item.id} item={item} />
          ))}
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 14,
    paddingTop: 56,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(128, 128, 128, 0.1)",
  },
  backBtn: {
    padding: 2,
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: "600",
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 16,
  },
  summaryRow: {
    flexDirection: "row",
    gap: 10,
    marginTop: 20,
    marginBottom: 24,
  },
  summaryPillGood: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    backgroundColor: "rgba(16, 185, 129, 0.08)",
    borderWidth: 1,
    borderColor: "rgba(16, 185, 129, 0.18)",
    borderRadius: 10,
    paddingVertical: 10,
  },
  summaryTextGood: {
    fontSize: 13,
    fontWeight: "600",
    color: "#10b981",
  },
  summaryPillBad: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    backgroundColor: "rgba(239, 68, 68, 0.08)",
    borderWidth: 1,
    borderColor: "rgba(239, 68, 68, 0.18)",
    borderRadius: 10,
    paddingVertical: 10,
  },
  summaryTextBad: {
    fontSize: 13,
    fontWeight: "600",
    color: "#ef4444",
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 0.8,
    marginBottom: 10,
  },
  suggestionItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 14,
    marginBottom: 8,
  },
  suggestionGood: {
    backgroundColor: "rgba(16, 185, 129, 0.07)",
    borderWidth: 1,
    borderColor: "rgba(16, 185, 129, 0.15)",
  },
  suggestionBad: {
    backgroundColor: "rgba(239, 68, 68, 0.07)",
    borderWidth: 1,
    borderColor: "rgba(239, 68, 68, 0.15)",
  },
  iconWrapper: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  iconWrapperGood: {
    backgroundColor: "rgba(16, 185, 129, 0.15)",
  },
  iconWrapperBad: {
    backgroundColor: "rgba(239, 68, 68, 0.15)",
  },
  suggestionText: {
    fontSize: 14,
    fontWeight: "500",
    flex: 1,
  },
  textGood: {
    color: "#10b981",
  },
  textBad: {
    color: "#ef4444",
  },
});
