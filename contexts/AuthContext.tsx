import React, { createContext, useState, useEffect, ReactNode } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter, useSegments } from "expo-router";

interface AuthContextType {
	userToken: string | null;
	hasBusiness: boolean;
	isLoading: boolean;
	login: () => Promise<void>;
	logout: () => Promise<void>;
	completeOnboarding: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType>({
	userToken: null,
	hasBusiness: false,
	isLoading: true,
	login: async () => { },
	logout: async () => { },
	completeOnboarding: async () => { },
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
	const [userToken, setUserToken] = useState<string | null>(null);
	const [hasBusiness, setHasBusiness] = useState(false);
	const [isLoading, setIsLoading] = useState(true);
	const segments = useSegments();
	const router = useRouter();

	useEffect(() => {
		const loadAuthData = async () => {
			try {
				const token = await AsyncStorage.getItem("userToken");
				const businessLinked = await AsyncStorage.getItem("businessLinked");

				if (token) {
					setUserToken(token);
					setHasBusiness(businessLinked === "true");
				}
			} catch (e) {
				console.error("Failed to load auth data", e);
			} finally {
				setIsLoading(false);
			}
		};
		loadAuthData();
	}, []);

	useEffect(() => {
		if (isLoading) return;

		const inAuthGroup = segments[0] === "(tabs)";
		const inBindScreen = segments[0] === "bind_account";
		const inLoginScreen =
			(segments as string[]).length === 0 ||
			(segments as string[])[0] === "index";

		if (!userToken) {
			if (!inLoginScreen) {
				router.replace("/");
			}
		} else if (userToken && !hasBusiness) {
			if (!inBindScreen) {
				router.replace("/bind_account");
			}
		} else if (userToken && hasBusiness) {
			if (inLoginScreen || inBindScreen) {
				router.replace("/(tabs)/dashboard");
			}
		}
	}, [userToken, hasBusiness, isLoading, segments]);

	const login = async () => {
		await AsyncStorage.setItem("userToken", "dummy-token");
		setUserToken("dummy-token");
	};

	const logout = async () => {
		await AsyncStorage.removeItem("userToken");
		await AsyncStorage.removeItem("businessLinked");
		setUserToken(null);
		setHasBusiness(false);
	};

	const completeOnboarding = async () => {
		await AsyncStorage.setItem("businessLinked", "true");
		setHasBusiness(true);
	};

	return (
		<AuthContext.Provider
			value={{
				userToken,
				hasBusiness,
				isLoading,
				login,
				logout,
				completeOnboarding,
			}}
		>
			{children}
		</AuthContext.Provider>
	);
};
