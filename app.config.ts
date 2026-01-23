import "dotenv/config";

export default {
	expo: {
		name: "gmb-shark",
		slug: "gmbshark",
		version: "1.0.0",
		orientation: "portrait",
		icon: "./assets/images/icon.png",
		scheme: "gmbshark",
		userInterfaceStyle: "automatic",
		newArchEnabled: true,
		extra: {
			firebaseApiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
			firebaseAuthDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
			firebaseProjectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
			firebaseAppId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
			firebaseStorageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
			firebaseMessagingSenderId:
				process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
			googleAndroidClientId: process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID,
			googleWebClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
			razorpayKeyId: process.env.RAZORPAY_KEY_ID || "rzp_test_S7IOIDmE2RXVAg",
      razorpayKeySecret: process.env.RAZORPAY_KEY_SECRET || "KW7UcQMDgNu1f6KVMHdKYQTS"
		},
		ios: {
			supportsTablet: true,
			bundleIdentifier: "com.sumitst05.gmbshark",
		},
		android: {
			adaptiveIcon: {
				foregroundImage: "./assets/images/adaptive-icon.png",
				backgroundColor: "#ffffff",
			},
			edgeToEdgeEnabled: true,
			package: "com.sumitst05.gmbshark",
		},
		web: {
			bundler: "metro",
			output: "static",
			favicon: "./assets/images/favicon.png",
		},
		plugins: [
			"expo-router",
			[
				"expo-splash-screen",
				{
					image: "./assets/images/splash-icon.png",
					imageWidth: 200,
					resizeMode: "contain",
					backgroundColor: "#ffffff",
				},
			],
			"expo-web-browser",
		],
		experiments: {
			typedRoutes: true,
		},
	},
};
