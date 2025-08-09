import { useContext, useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Dimensions,
  Image,
} from "react-native";
import { navigate } from "expo-router/build/global-state/routing";
import { LinearGradient } from "expo-linear-gradient";
import * as WebBrowser from "expo-web-browser";
import { useThemeColor } from "@/hooks/useThemeColor";
import { ThemedText } from "@/components/ui/ThemedText";
import { ThemedView } from "@/components/ui/ThemedView";
import { ThemedTextInput } from "@/components/ui/ThemedTextInput";
import { Ionicons } from "@expo/vector-icons";
import { AuthContext } from "@/contexts/AuthContext";
import * as Google from "expo-auth-session/providers/google";
import { googleAndroidClientId, googleWebClientId } from "@/firebase/config";
import { GoogleAuthProvider, signInWithCredential } from "firebase/auth";
import { auth } from "@/firebase/config";
import { createUserIfNotExists } from "@/firebase/db/users";

WebBrowser.maybeCompleteAuthSession();

const { width } = Dimensions.get("window");

export default function AuthScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Get theme colors
  const backgroundColor = useThemeColor({}, "background");
  const cardColor = useThemeColor(
    { light: "#ffffff", dark: "#1c1c1e" },
    "background"
  );
  const textColor = useThemeColor({}, "text");
  const mutedColor = useThemeColor(
    { light: "#8e8e93", dark: "#8e8e93" },
    "text"
  );

  const { signIn, userToken } = useContext(AuthContext);

  // this causes the user to skip the bind_account page
  // useEffect(() => {
  //   if (userToken) {
  //     navigate("/(tabs)/dashboard");
  //   }
  // }, [userToken]);

  const handleLogin = async () => {
    await signIn("token");
    navigate("/bind_account");
  };

  const [request, response, promptAsync] = Google.useIdTokenAuthRequest({
    androidClientId: googleAndroidClientId,
    webClientId: googleWebClientId,
    scopes: ["email"],
  });

  useEffect(() => {
    if (response?.type === "success") {
      const { id_token } = response.params;

      if (!id_token) {
        console.error("No ID token returned from Google");
        return;
      }

      const credential = GoogleAuthProvider.credential(id_token);

      signInWithCredential(auth, credential)
        .then(async (userCredential) => {
          const user = userCredential.user;
          const token = await user.getIdToken();

          // add user to db
          await createUserIfNotExists({
            uid: user.uid,
            email: user.email,
            displayName: user.displayName,
          });

          await signIn(token);

          navigate("/(tabs)/dashboard");
        })
        .catch((error) => {
          Alert.alert("Login Failed", error.message);
        });
    }
  }, [response]);

  return (
    <ThemedView style={styles.container}>
      <LinearGradient
        colors={["rgba(99, 102, 241, 0.1)", "rgba(168, 85, 247, 0.05)"]}
        style={StyleSheet.absoluteFillObject}
      />

      <View style={styles.content}>
        <View style={styles.brandContainer}>
          <View style={[styles.logoCircle, { backgroundColor: cardColor }]}>
            <Text style={styles.logoText}>🦈</Text>
          </View>
          <ThemedText style={styles.brandTitle}>GMB Shark</ThemedText>
          <ThemedText style={[styles.brandSubtitle, { color: mutedColor }]}>
            Welcome back! Please sign in to continue
          </ThemedText>
        </View>

        <View style={[styles.formCard, { backgroundColor: cardColor }]}>
          <View style={styles.inputGroup}>
            <Text style={[styles.inputLabel, { color: mutedColor }]}>
              Email
            </Text>
            <View style={[styles.inputContainer, { backgroundColor }]}>
              <Ionicons
                name="mail-outline"
                size={20}
                color={mutedColor}
                style={styles.inputIcon}
              />
              <ThemedTextInput
                style={styles.input}
                placeholder="Enter your email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={[styles.inputLabel, { color: mutedColor }]}>
              Password
            </Text>
            <View style={[styles.inputContainer, { backgroundColor }]}>
              <Ionicons
                name="lock-closed-outline"
                size={20}
                color={mutedColor}
                style={styles.inputIcon}
              />
              <ThemedTextInput
                style={styles.input}
                placeholder="Enter your password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                autoComplete="password"
              />
              <TouchableOpacity
                onPress={() => setShowPassword(!showPassword)}
                style={styles.eyeIcon}
              >
                <Ionicons
                  name={showPassword ? "eye-outline" : "eye-off-outline"}
                  size={20}
                  color={mutedColor}
                />
              </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity style={styles.forgotPassword}>
            <Text style={[styles.forgotPasswordText, { color: "#6366f1" }]}>
              Forgot Password?
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
            <LinearGradient
              colors={["#6366f1", "#8b5cf6"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.loginButtonGradient}
            >
              <Text style={styles.loginButtonText}>Sign In</Text>
            </LinearGradient>
          </TouchableOpacity>

          <View style={styles.dividerContainer}>
            <View
              style={[styles.dividerLine, { backgroundColor: mutedColor }]}
            />
            <Text style={[styles.dividerText, { color: mutedColor }]}>
              or continue with
            </Text>
            <View
              style={[styles.dividerLine, { backgroundColor: mutedColor }]}
            />
          </View>

          <TouchableOpacity
            style={[
              styles.socialButton,
              { backgroundColor, borderColor: mutedColor },
            ]}
            onPress={() => promptAsync()}
          >
            <View style={styles.socialButtonContent}>
              <Image
                style={{ width: 24, height: 24 }}
                source={require("../assets/images/google.png")}
              />
              <Text style={[styles.socialButtonText, { color: textColor }]}>
                Continue with Google
              </Text>
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.signupContainer}>
          <Text style={[styles.signupText, { color: mutedColor }]}>
            Don't have an account?{" "}
          </Text>
          <TouchableOpacity>
            <Text style={[styles.signupLink, { color: "#6366f1" }]}>
              Sign Up
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 40,
  },
  brandContainer: {
    alignItems: "center",
    marginBottom: 40,
  },
  logoCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
  logoText: {
    fontSize: 32,
  },
  brandTitle: {
    fontSize: 32,
    fontWeight: "700",
    marginBottom: 8,
  },
  brandSubtitle: {
    fontSize: 16,
    textAlign: "center",
    lineHeight: 22,
  },
  formCard: {
    borderRadius: 24,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 24,
    elevation: 12,
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 16,
    paddingHorizontal: 12,
    minHeight: 56,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
  },
  eyeIcon: {
    padding: 4,
  },
  forgotPassword: {
    alignSelf: "flex-end",
    marginBottom: 20,
    marginTop: -10,
  },
  forgotPasswordText: {
    fontSize: 14,
    fontWeight: "600",
  },
  loginButton: {
    borderRadius: 16,
    marginBottom: 35,
    shadowColor: "#6366f1",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  loginButtonGradient: {
    paddingVertical: 14,
    borderRadius: 16,
    alignItems: "center",
  },
  loginButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "700",
  },
  dividerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    opacity: 0.3,
  },
  dividerText: {
    marginHorizontal: 16,
    fontSize: 14,
    fontWeight: "500",
  },
  socialButton: {
    borderRadius: 100,
    borderWidth: 1.5,
    paddingVertical: 14,
    paddingHorizontal: 20,
  },
  socialButtonContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
  socialButtonText: {
    fontSize: 17,
    fontWeight: "600",
  },
  signupContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 35,
  },
  signupText: {
    fontSize: 16,
  },
  signupLink: {
    fontSize: 16,
    fontWeight: "700",
  },
});
