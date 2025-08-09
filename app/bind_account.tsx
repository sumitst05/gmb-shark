import { useState } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import * as WebBrowser from "expo-web-browser";
import * as Haptics from "expo-haptics";
import { Ionicons } from "@expo/vector-icons";
import { navigate } from "expo-router/build/global-state/routing";
import { Stack } from "expo-router";
import { ScrollView } from "react-native";

import { useThemeColor } from "@/hooks/useThemeColor";
import { ThemedView } from "@/components/ui/ThemedView";
import { ThemedText } from "@/components/ui/ThemedText";
import { ThemedTextInput } from "@/components/ui/ThemedTextInput";
import { LinearGradient } from "expo-linear-gradient";

async function checkHasGoogleBusiness(email: string): Promise<boolean> {
  // await new Promise((r) => setTimeout(r, 900));
  // const normalized = email.toLowerCase();
  // return (
  //   /@.+\..+/.test(normalized) &&
  //   (normalized.includes("biz") || normalized.includes("gmb"))
  // );
  return true;
}

const GOOGLE_BUSINESS_URL = "https://www.google.com/business/";

export default function LinkGmbScreen() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const cardColor = useThemeColor(
    { light: "#ffffff", dark: "#1c1c1e" },
    "background"
  );
  const textColor = useThemeColor({}, "text");
  const mutedColor = useThemeColor(
    { light: "#8e8e93", dark: "#8e8e93" },
    "text"
  );

  const isEmailValid = (val: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);

  const handleOpenGMB = async () => {
    await WebBrowser.openBrowserAsync(GOOGLE_BUSINESS_URL);
  };

  const handleSubmit = async () => {
    setError(null);
    if (!isEmailValid(email)) {
      setError("Invalid email address.");
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      return;
    }

    try {
      setIsLoading(true);
      const hasAccount = await checkHasGoogleBusiness(email);
      if (hasAccount) {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        // we can have a toast message here!
        navigate("/(tabs)/dashboard");
      } else {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
        setError(
          "We couldn’t find a Google Business Profile for this email. Create one first, then come back to link it."
        );
      }
    } catch (e) {
      setError("Something went wrong. Please try again.");
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ThemedView style={styles.container}>
      <Stack.Screen options={{ headerShown: false, title: "" }} />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.brandRow}>
            <View style={[styles.brandIcon, { backgroundColor: cardColor }]}>
              <Ionicons name="business" size={22} color="#3b82f6" />
            </View>
            <ThemedText style={styles.title}>Link Your GMB Profile</ThemedText>
          </View>
          <ThemedText style={[styles.subtitle, { color: mutedColor }]}>
            Connect your Google Business Profile so we can surface insights,
            reviews, and growth opportunities.
          </ThemedText>
        </View>

        {/* Connect Card */}
        <View style={[styles.card, { backgroundColor: cardColor }]}>
          <ThemedText style={styles.cardTitle}>
            Use your Google account email
          </ThemedText>

          <View style={styles.inputRow}>
            <View style={styles.inputIcon}>
              <Ionicons name="mail-outline" size={18} color={mutedColor} />
            </View>
            <ThemedTextInput
              value={email}
              onChangeText={setEmail}
              placeholder="your-email@gmail.com"
              autoCapitalize="none"
              autoCorrect={false}
              keyboardType="email-address"
              style={styles.input}
            />
          </View>

          {!!error && (
            <View style={[styles.notice, { backgroundColor: "#ef444420" }]}>
              <Ionicons name="alert-circle" size={18} color="#ef4444" />
              <ThemedText style={[styles.noticeText, { color: textColor }]}>
                {error}
              </ThemedText>
              <TouchableOpacity onPress={handleOpenGMB}>
                <ThemedText style={[styles.noticeCta, { color: "#3b82f6" }]}>
                  Create a profile
                </ThemedText>
              </TouchableOpacity>
            </View>
          )}

          <TouchableOpacity
            style={styles.connectBtn}
            onPress={handleSubmit}
            activeOpacity={0.9}
            disabled={isLoading}
          >
            <LinearGradient
              colors={["#6366f1", "#8b5cf6"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.connectGradient}
            >
              {isLoading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <>
                  <Ionicons name="link" size={18} color="#ffffff" />
                  <ThemedText style={styles.connectText}>Connect</ThemedText>
                </>
              )}
            </LinearGradient>
          </TouchableOpacity>

          <View style={styles.helperRow}>
            <Ionicons
              name="information-circle-outline"
              size={16}
              color={mutedColor}
            />
            <ThemedText style={[styles.helperText, { color: mutedColor }]}>
              Use the email that manages your Google Business Profile.
            </ThemedText>
          </View>
        </View>

        {/* Divider */}
        <View style={styles.dividerRow}>
          <View style={styles.divider} />
          <ThemedText style={[styles.dividerText, { color: mutedColor }]}>
            or
          </ThemedText>
          <View style={styles.divider} />
        </View>

        {/* Create Profile Card */}
        <View style={[styles.card, { backgroundColor: cardColor }]}>
          <ThemedText style={styles.cardTitle}>
            Don’t have a profile yet?
          </ThemedText>
          <ThemedText style={[styles.cardSub, { color: mutedColor }]}>
            Create a Google Business Profile — it’s free and only takes a few
            minutes.
          </ThemedText>

          <TouchableOpacity
            style={styles.createBtn}
            onPress={handleOpenGMB}
            activeOpacity={0.9}
          >
            <LinearGradient
              colors={["#10b981", "#059669"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.createGradient}
            >
              <Ionicons name="open-outline" size={18} color="#ffffff" />
              <ThemedText style={styles.createText}>
                Create Google Business Profile
              </ThemedText>
            </LinearGradient>
          </TouchableOpacity>

          <View style={styles.perks}>
            {[
              "Show up in local searches",
              "Manage reviews and messages",
              "Share updates, hours, and more",
            ].map((p, i) => (
              <View key={i} style={styles.perkRow}>
                <Ionicons name="checkmark-circle" size={16} color="#10b981" />
                <ThemedText style={[styles.perkText, { color: textColor }]}>
                  {p}
                </ThemedText>
              </View>
            ))}
          </View>
        </View>

        {/* Privacy */}
        <View style={styles.privacyRow}>
          <Ionicons name="shield-checkmark" size={16} color="#10b981" />
          <ThemedText style={[styles.privacyText, { color: mutedColor }]}>
            We never post without your permission.
          </ThemedText>
        </View>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 24,
    flexGrow: 1,
  },
  header: { marginBottom: 16 },
  brandRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    gap: 10,
  },
  brandIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  title: { fontSize: 24, fontWeight: "800" },
  subtitle: { fontSize: 14, lineHeight: 20 },
  card: {
    borderRadius: 16,
    padding: 18,
    marginTop: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 5,
  },
  cardTitle: { fontSize: 16, fontWeight: "700", marginBottom: 12 },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 2,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "rgba(142, 142, 147, 0.6)",
  },
  inputIcon: { paddingRight: 8 },
  input: { flex: 1, fontSize: 16, paddingVertical: 12, borderColor: "#ffffff" },
  notice: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    borderRadius: 12,
    padding: 10,
    marginTop: 10,
  },
  noticeText: { flex: 1, fontSize: 13 },
  noticeCta: { fontSize: 13, fontWeight: "700" },
  connectBtn: { marginTop: 14, borderRadius: 14, overflow: "hidden" },
  connectGradient: {
    paddingVertical: 12,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 8,
  },
  connectText: { color: "#ffffff", fontSize: 15, fontWeight: "700" },
  helperRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 11,
    gap: 2,
  },
  helperText: { fontSize: 10 },

  dividerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 10,
  },
  divider: { flex: 1, height: 1, backgroundColor: "rgba(142,142,147,0.25)" },
  dividerText: { fontSize: 12, fontWeight: "600" },

  cardSub: { fontSize: 14, marginBottom: 12 },
  createBtn: { marginTop: 4, borderRadius: 14, overflow: "hidden" },
  createGradient: {
    paddingVertical: 12,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 8,
  },
  createText: { color: "#ffffff", fontSize: 15, fontWeight: "700" },

  perks: { marginTop: 12, gap: 4 },
  perkRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  perkText: { fontSize: 13 },

  privacyRow: {
    alignItems: "center",
    flexDirection: "row",
    gap: 8,
    marginTop: 24,
    justifyContent: "center",
  },
  privacyText: { fontSize: 12 },
});
