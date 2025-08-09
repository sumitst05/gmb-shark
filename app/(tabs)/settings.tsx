import { View, TouchableOpacity, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { ThemedText } from "@/components/ui/ThemedText";
import { ThemedView } from "@/components/ui/ThemedView";
import { useThemeColor } from "@/hooks/useThemeColor";
import { useThemeContext } from "@/contexts/ThemeContext";
import { useContext } from "react";
import { AuthContext } from "@/contexts/AuthContext";
import { navigate } from "expo-router/build/global-state/routing";

const SettingButton = ({
  icon,
  label,
  onPress,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  onPress: () => void;
}) => {
  const bgColor = useThemeColor(
    { light: "#fff", dark: "#1c1c1e" },
    "background"
  );
  const borderColor = useThemeColor(
    { light: "#e5e7eb", dark: "#3a3a3c" },
    "background"
  );
  const textColor = useThemeColor({}, "text");

  return (
    <TouchableOpacity
      style={[styles.settingButton, { backgroundColor: bgColor, borderColor }]}
      onPress={onPress}
    >
      <Ionicons
        name={icon}
        size={20}
        color={textColor}
        style={styles.settingIcon}
      />
      <ThemedText style={[styles.settingLabel, { color: textColor }]}>
        {label}
      </ThemedText>
    </TouchableOpacity>
  );
};

export default function SettingsScreen() {
  const navigation = useNavigation();
  const { theme, toggleTheme } = useThemeContext();
  const { signOut } = useContext(AuthContext);

  const borderColor = useThemeColor(
    { light: "#e5e7eb", dark: "#3a3a3c" },
    "background"
  );
  const bgColor = useThemeColor(
    { light: "#fff", dark: "#1c1c1e" },
    "background"
  );
  const textColor = useThemeColor({}, "text");

  const handleToggleTheme = () => {
    toggleTheme();
  };

  const handleLogout = async () => {
    try {
      await signOut();
      console.log("Successfully signed out");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <ThemedView style={styles.container}>
      <View style={styles.buttonGroup}>
        <SettingButton icon="person" label="GMB Profile" onPress={() => {}} />
        <SettingButton
          icon={theme === "dark" ? "sunny" : "moon"} // Dynamic icon based on current theme
          label={`Theme (${theme === "dark" ? "Dark" : "Light"})`} // Show current theme
          onPress={handleToggleTheme}
        />
        <SettingButton
          icon="list"
          label="Manage Subscription"
          onPress={() => navigate("/subscription")}
        />
        <SettingButton
          icon="construct"
          label="Manage Permissions"
          onPress={() => {}}
        />
      </View>

      <TouchableOpacity
        style={[styles.logoutButton, { backgroundColor: bgColor, borderColor }]}
        onPress={handleLogout}
      >
        <Ionicons
          name="log-out-outline"
          size={20}
          color={textColor}
          style={styles.settingIcon}
        />
        <ThemedText style={[styles.logoutText, { color: textColor }]}>
          Log Out
        </ThemedText>
      </TouchableOpacity>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 48,
    padding: 16,
  },
  buttonGroup: {
    flexGrow: 1,
  },
  settingButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 14,
  },
  settingIcon: {
    marginRight: 12,
  },
  settingLabel: {
    fontSize: 16,
    fontWeight: "600",
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    alignSelf: "center",
    width: "100%",
    marginTop: 32,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: "600",
  },
});
