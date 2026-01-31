import { useEffect, useState, useContext } from "react";
import {
  View,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useThemeColor } from "@/hooks/useThemeColor";
import { ThemedText } from "@/components/ui/ThemedText";
import { ThemedView } from "@/components/ui/ThemedView";
import { Ionicons } from "@expo/vector-icons";
import { Svg, Circle } from "react-native-svg";
import { router } from "expo-router";
import { AuthContext } from "@/contexts/AuthContext";
import { MockAPI } from "@/src/api/mockClient";

interface StatItemProps {
  icon: keyof typeof Ionicons.glyphMap;
  value: string;
  label: string;
}

interface ActionButtonProps {
  title: string;
  onPress: () => void;
}

interface ChecklistItemProps {
  text: string;
  isGood: boolean;
}

const StatItem = ({ icon, value, label }: StatItemProps) => {
  const mutedColor = useThemeColor(
    { light: "#8e8e93", dark: "#8e8e93" },
    "text"
  );

  return (
    <View style={styles.statItem}>
      <View>
        <Ionicons name={icon} size={20} color={mutedColor} />
      </View>
      <ThemedText style={styles.statValue}>{value}</ThemedText>
      <ThemedText style={[styles.statLabel, { color: mutedColor }]}>
        {label}
      </ThemedText>
    </View>
  );
};

const ActionButton = ({ title, onPress }: ActionButtonProps) => {
  const cardColor = useThemeColor(
    { light: "#ffffff", dark: "#1c1c1e" },
    "background"
  );
  const textColor = useThemeColor({}, "text");
  const mutedColor = useThemeColor(
    { light: "#8e8e93", dark: "#8e8e93" },
    "text"
  );

  return (
    <TouchableOpacity
      style={[styles.actionButton, { backgroundColor: cardColor }]}
      onPress={onPress}
    >
      <ThemedText style={[styles.actionButtonText, { color: textColor }]}>
        {title}
      </ThemedText>
      <Ionicons name="chevron-forward" size={20} color={mutedColor} />
    </TouchableOpacity>
  );
};

const ChecklistItem = ({ text, isGood }: ChecklistItemProps) => {
  const color = isGood ? "#10b981" : "#ef4444";
  const icon = isGood ? "checkmark-circle" : "close-circle";

  return (
    <View style={styles.checklistItem}>
      <Ionicons
        name={icon}
        size={18}
        color={color}
        style={styles.checklistIcon}
      />
      <ThemedText style={[styles.checklistText, { color }]}>{text}</ThemedText>
    </View>
  );
};

const CircularProgress = ({ percentage }: { percentage: number }) => {
  const size = 120;
  const strokeWidth = 8;
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <View style={styles.progressContainer}>
      <Svg width={size} height={size} style={styles.progressSvg}>
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#e5e7eb"
          strokeWidth={strokeWidth}
          fill="transparent"
        />
        {/* Progress circle */}
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#10b981"
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={strokeDasharray}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </Svg>
      <View style={styles.progressTextContainer}>
        <ThemedText style={styles.progressText}>{percentage}%</ThemedText>
      </View>
    </View>
  );
};

export default function DashboardScreen() {
  const [loading, setLoading] = useState(true);
  const [businessData, setBusinessData] = useState<any>(null); // State for our data

  const cardColor = useThemeColor(
    { light: "#ffffff", dark: "#1c1c1e" },
    "background"
  );
  const mutedColor = useThemeColor(
    { light: "#8e8e93", dark: "#8e8e93" },
    "text"
  );

  const { userToken } = useContext(AuthContext);

  useEffect(() => {
    const loadData = async () => {
      if (!userToken) return;

      const data = await MockAPI.getDashboardData();
      setBusinessData(data);
      setLoading(false);
    };

    loadData();
  }, [userToken]);

  if (loading) {
    return (
      <ThemedView
        style={[
          styles.container,
          { justifyContent: "center", alignItems: "center" },
        ]}
      >
        <ActivityIndicator size="large" color="#8b5cf6" />
        <ThemedText style={{ marginTop: 20, color: mutedColor }}>
          Syncing with Google Business Profile...
        </ThemedText>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={[styles.header, { backgroundColor: cardColor }]}>
          <View style={styles.headerTop}>
            <View>
              <ThemedText style={styles.greeting}>
                Hello, {businessData?.name || "Business Owner"}!
              </ThemedText>
            </View>
            <TouchableOpacity
              onPress={() => router.push("/subscription")}
              style={styles.upgradeButton}
            >
              <LinearGradient
                colors={["#8b5cf6", "#a855f7"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.upgradeGradient}
              >
                <Ionicons name="diamond" size={16} color="#ffffff" />
                <ThemedText style={styles.upgradeText}>Upgrade</ThemedText>
              </LinearGradient>
            </TouchableOpacity>
          </View>

          <View style={styles.progressSection}>
            <CircularProgress
              percentage={businessData?.profileCompletion || 0}
            />
            <ThemedText style={[styles.progressLabel, { color: mutedColor }]}>
              Profile Completion
            </ThemedText>
          </View>

          <View style={styles.checklistContainer}>
            <View style={styles.checklistColumn}>
              {businessData?.checklist
                ?.slice(0, 3)
                .map((item: any, index: number) => (
                  <ChecklistItem
                    key={index}
                    text={item.text}
                    isGood={item.isGood}
                  />
                ))}
            </View>
            <View style={styles.checklistColumn}>
              {businessData?.checklist
                ?.slice(3, 6)
                .map((item: any, index: number) => (
                  <ChecklistItem
                    key={index}
                    text={item.text}
                    isGood={item.isGood}
                  />
                ))}
            </View>
          </View>

          <TouchableOpacity style={styles.takeActionButton}>
            <LinearGradient
              colors={["#6366f1", "#8b5cf6"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.takeActionGradient}
            >
              <ThemedText style={styles.takeActionText}>
                Take Action!
              </ThemedText>
            </LinearGradient>
          </TouchableOpacity>

          <View style={styles.statsContainer}>
            <StatItem
              icon="eye"
              value={businessData?.views.toString()}
              label="Views"
            />
            <StatItem
              icon="people"
              value={businessData?.customers.toString()}
              label="Customers"
            />
            <StatItem
              icon="star"
              value={businessData?.rating.toString()}
              label="Rating"
            />
          </View>
        </View>

        <View style={styles.actionsContainer}>
          <ActionButton
            title="Manage Reviews"
            onPress={() => router.push("/reviews")}
          />
          <ActionButton
            title="Schedule Posts"
            onPress={() => console.log("Schedule Posts")}
          />
        </View>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    margin: 14,
    borderRadius: 24,
    padding: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 24,
    elevation: 12,
    marginTop: 30,
  },
  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 40,
  },
  greeting: {
    marginTop: 0,
    fontSize: 24,
    fontWeight: "700",
  },
  upgradeButton: {
    position: "absolute",
    top: 45,
    right: -15,
    borderRadius: 20,
    shadowColor: "#8b5cf6",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  upgradeGradient: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  upgradeText: {
    color: "#ffffff",
    fontWeight: "600",
    marginLeft: 6,
    fontSize: 12,
  },
  progressSection: {
    alignItems: "center",
    marginBottom: 24,
  },
  progressContainer: {
    position: "relative",
    marginBottom: 8,
  },
  progressSvg: {
    transform: [{ rotate: "0deg" }],
  },
  progressTextContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
  },
  progressText: {
    fontSize: 28,
    fontWeight: "700",
    color: "#10b981",
  },
  progressLabel: {
    fontSize: 14,
    fontWeight: "500",
  },
  checklistContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  checklistColumn: {
    flex: 1,
    paddingHorizontal: 8,
  },
  checklistItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  checklistIcon: {
    marginRight: 8,
  },
  checklistText: {
    fontSize: 12,
    fontWeight: "500",
    lineHeight: 14,
    flex: 1,
  },
  takeActionButton: {
    borderRadius: 16,
    marginBottom: 24,
    shadowColor: "#3b82f6",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  takeActionGradient: {
    paddingVertical: 10,
    borderRadius: 16,
    alignItems: "center",
  },
  takeActionText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "700",
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingTop: 10,
    borderTopWidth: 1,
    marginBottom: -10,
    borderTopColor: "rgba(142, 142, 147, 0.2)",
  },
  statItem: {
    alignItems: "center",
  },
  statValue: {
    fontSize: 20,
    fontWeight: "700",
  },
  statLabel: {
    fontSize: 12,
    fontWeight: "500",
  },
  actionsContainer: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  actionButton: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    borderRadius: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 4,
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: "600",
  },
  bottomNav: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 16,
    marginHorizontal: 16,
    marginBottom: 32,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
  navItem: {
    padding: 8,
  },
});
