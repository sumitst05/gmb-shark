import { useState } from "react";
import {
	View,
	TouchableOpacity,
	StyleSheet,
	ScrollView,
	Dimensions,
	Alert,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useThemeColor } from "@/hooks/useThemeColor";
import { ThemedText } from "@/components/ui/ThemedText";
import { ThemedView } from "@/components/ui/ThemedView";
import { Ionicons } from "@expo/vector-icons";
import { SuccessResponse } from "react-native-razorpay";
import * as WebBrowser from "expo-web-browser";

const { width } = Dimensions.get("window");

interface SubscriptionPlan {
	id: string;
	name: string;
	description: string;
	price: number;
	billingPeriod: "month" | "year";
	originalPrice?: number;
	discount?: string;
	isPopular?: boolean;
	features: string[];
	limitations?: string[];
	buttonText: string;
	buttonColor: [string, string];
}

interface PlanCardProps {
	plan: SubscriptionPlan;
	isSelected: boolean;
	onSelect: (plan: SubscriptionPlan) => void;
	onSubmit: (plan: SubscriptionPlan) => void;
}

// Mock subscription plans
const subscriptionPlans: SubscriptionPlan[] = [
	{
		id: "free",
		name: "Free",
		description: "Perfect for getting started",
		price: 0,
		billingPeriod: "month",
		features: [
			"Basic business profile",
			"Up to 5 reviews monitoring",
			"Basic Business search",
			// "Basic analytics",
			// // "Email support",
			// "1 social media account",
		],
		limitations: [
			"Limited to 5 reviews per month",
			"No post scheduling",
			"No competition survey",
		],
		buttonText: "Current Plan",
		buttonColor: ["#8e8e93", "#8e8e93"] as [string, string],
	},
	{
		id: "plan_S7HdsSRgZsui6i",
		name: "Starter",
		description: "Great for small businesses",
		price: 19,
		billingPeriod: "month",
		originalPrice: 29,
		discount: "34% OFF",
		features: [
			"Everything in Free",
			"Up to 50 reviews monitoring",
			"Review response templates",
			"Competition survey",
			"Advanced analytics",
			"Priority email support",
		],
		buttonText: "Subscribe to Starter Plan",
		buttonColor: ["#3b82f6", "#1d4ed8"] as [string, string],
	},
	{
		id: "plan_S7HeN07PwFeXvE",
		name: "Professional",
		description: "Best for growing businesses",
		price: 49,
		billingPeriod: "month",
		originalPrice: 69,
		discount: "29% OFF",
		isPopular: true,
		features: [
			"Everything in Starter",
			"Unlimited reviews monitoring",
			"Post Scheduling",
			"Advanced AI insights",
			"Custom review responses",
		],
		buttonText: "Subscribe to Professional Plan",
		buttonColor: ["#8b5cf6", "#7c3aed"] as [string, string],
	},
];

const PlanCard = ({ plan, isSelected, onSelect, onSubmit }: PlanCardProps) => {
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
		style={[
			styles.planCard,
			{ backgroundColor: cardColor },
			isSelected && styles.selectedCard,
			plan.isPopular && styles.popularCard,
		]}
		onPress={() => onSelect(plan)}
		activeOpacity={0.8}
		>
		{plan.isPopular && (
			<View style={styles.popularBadge}>
			<LinearGradient
			colors={["#8b5cf6", "#7c3aed"]}
			style={styles.popularGradient}
			>
			<Ionicons name="star" size={14} color="#ffffff" />
			<ThemedText style={styles.popularText}>Most Popular</ThemedText>
			</LinearGradient>
			</View>
		)}

		{plan.discount && (
			<View style={styles.discountBadge}>
			<ThemedText style={styles.discountText}>{plan.discount}</ThemedText>
			</View>
		)}

		<View style={styles.planHeader}>
		<ThemedText style={styles.planName}>{plan.name}</ThemedText>
		<ThemedText style={[styles.planDescription, { color: mutedColor }]}>
		{plan.description}
		</ThemedText>
		</View>

		<View style={styles.pricingSection}>
		<View style={styles.priceContainer}>
		<ThemedText style={styles.currency}>$</ThemedText>
		<ThemedText style={styles.price}>{plan.price}</ThemedText>
		<ThemedText style={[styles.period, { color: mutedColor }]}>
		/{plan.billingPeriod}
		</ThemedText>
		</View>
		{plan.originalPrice && (
			<View style={styles.originalPriceContainer}>
			<ThemedText style={[styles.originalPrice, { color: mutedColor }]}>
			${plan.originalPrice}/{plan.billingPeriod}
			</ThemedText>
			</View>
		)}
		</View>

		<TouchableOpacity
		style={styles.selectButton}
		onPress={() => onSelect(plan)}
		>
		<LinearGradient colors={plan.buttonColor} style={styles.buttonGradient}>
		<ThemedText onPress={() => onSubmit(plan)} style={styles.buttonText}>
		{plan.buttonText}
		</ThemedText>
		</LinearGradient>
		</TouchableOpacity>

		<View style={styles.featuresSection}>
		<ThemedText style={styles.featuresTitle}>What's included:</ThemedText>
		{plan.features.map((feature, index) => (
			<View key={index} style={styles.featureItem}>
			<Ionicons name="checkmark-circle" size={16} color="#10b981" />
			<ThemedText style={[styles.featureText, { color: textColor }]}>
			{feature}
			</ThemedText>
			</View>
		))}
		{plan.limitations && plan.limitations.length > 0 && (
			<>
			<ThemedText
			style={[styles.limitationsTitle, { color: mutedColor }]}
			>
			Limitations:
				</ThemedText>
			{plan.limitations.map((limitation, index) => (
				<View key={index} style={styles.featureItem}>
				<Ionicons name="close-circle" size={16} color="#ef4444" />
				<ThemedText style={[styles.featureText, { color: mutedColor }]}>
				{limitation}
				</ThemedText>
				</View>
			))}
			</>
		)}
		</View>
		</TouchableOpacity>
	);
};

const BillingToggle = ({
	billingPeriod,
	onToggle,
}: {
	billingPeriod: "month" | "year";
	onToggle: (period: "month" | "year") => void;
}) => {
	const cardColor = useThemeColor(
		{ light: "#ffffff", dark: "#1c1c1e" },
		"background"
	);
	const mutedColor = useThemeColor(
		{ light: "#8e8e93", dark: "#8e8e93" },
		"text"
	);

	return (
		<View style={[styles.billingToggle, { backgroundColor: cardColor }]}>
		<TouchableOpacity
		style={[
			styles.toggleOption,
			billingPeriod === "month" && styles.toggleOptionActive,
		]}
		onPress={() => onToggle("month")}
		>
		<ThemedText
		style={[
			styles.toggleText,
			billingPeriod === "month" && styles.toggleTextActive,
		]}
		>
		Monthly
		</ThemedText>
		</TouchableOpacity>
		<TouchableOpacity
		style={[
			styles.toggleOption,
			billingPeriod === "year" && styles.toggleOptionActive,
		]}
		onPress={() => onToggle("year")}
		>
		<ThemedText
		style={[
			styles.toggleText,
			billingPeriod === "year" && styles.toggleTextActive,
		]}
		>
		Yearly
		</ThemedText>
		<View style={styles.saveBadge}>
		<ThemedText style={styles.saveText}>Save 20%</ThemedText>
		</View>
		</TouchableOpacity>
		</View>
	);
};

// const FeatureComparison = () => {
//   const cardColor = useThemeColor(
//     { light: "#ffffff", dark: "#1c1c1e" },
//     "background"
//   );
//   const textColor = useThemeColor({}, "text");
//   const mutedColor = useThemeColor(
//     { light: "#8e8e93", dark: "#8e8e93" },
//     "text"
//   );

//   const comparisonFeatures = [
//     {
//       feature: "Reviews Monitoring",
//       free: "5",
//       starter: "50",
//       pro: "Unlimited",
//       enterprise: "Unlimited",
//     },
//     {
//       feature: "Social Media Accounts",
//       free: "1",
//       starter: "3",
//       pro: "10",
//       enterprise: "Unlimited",
//     },
//     {
//       feature: "Team Members",
//       free: "1",
//       starter: "1",
//       pro: "5",
//       enterprise: "Unlimited",
//     },
//     {
//       feature: "AI Insights",
//       free: "❌",
//       starter: "Basic",
//       pro: "Advanced",
//       enterprise: "Custom",
//     },
//     {
//       feature: "API Access",
//       free: "❌",
//       starter: "❌",
//       pro: "❌",
//       enterprise: "✅",
//     },
//     {
//       feature: "Priority Support",
//       free: "❌",
//       starter: "Email",
//       pro: "Phone & Chat",
//       enterprise: "Dedicated",
//     },
//   ];

//   return (
//     <View style={[styles.comparisonTable, { backgroundColor: cardColor }]}>
//       <ThemedText style={styles.comparisonTitle}>Feature Comparison</ThemedText>
//       <View style={styles.tableHeader}>
//         <ThemedText style={[styles.tableHeaderText, { color: mutedColor }]}>
//           Feature
//         </ThemedText>
//         <ThemedText style={[styles.tableHeaderText, { color: mutedColor }]}>
//           Free
//         </ThemedText>
//         <ThemedText style={[styles.tableHeaderText, { color: mutedColor }]}>
//           Starter
//         </ThemedText>
//         <ThemedText style={[styles.tableHeaderText, { color: mutedColor }]}>
//           Pro
//         </ThemedText>
//         <ThemedText style={[styles.tableHeaderText, { color: mutedColor }]}>
//           Enterprise
//         </ThemedText>
//       </View>
//       {comparisonFeatures.map((item, index) => (
//         <View key={index} style={styles.tableRow}>
//           <ThemedText
//             style={[styles.tableCell, styles.featureCell, { color: textColor }]}
//           >
//             {item.feature}
//           </ThemedText>
//           <ThemedText style={[styles.tableCell, { color: textColor }]}>
//             {item.free}
//           </ThemedText>
//           <ThemedText style={[styles.tableCell, { color: textColor }]}>
//             {item.starter}
//           </ThemedText>
//           <ThemedText style={[styles.tableCell, { color: textColor }]}>
//             {item.pro}
//           </ThemedText>
//           <ThemedText style={[styles.tableCell, { color: textColor }]}>
//             {item.enterprise}
//           </ThemedText>
//         </View>
//       ))}
//     </View>
//   );
// };

const FAQ = () => {
	const cardColor = useThemeColor(
		{ light: "#ffffff", dark: "#1c1c1e" },
		"background"
	);
	const textColor = useThemeColor({}, "text");
	const mutedColor = useThemeColor(
		{ light: "#8e8e93", dark: "#8e8e93" },
		"text"
	);

	const faqItems = [
		{
			question: "Can I change my plan anytime?",
			answer:
				"Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately.",
		},
		{
			question: "What payment methods do you accept?",
			answer:
				"We accept all major credit cards, PayPal, and bank transfers for enterprise customers.",
		},
		{
			question: "Can I cancel anytime?",
			answer:
				"You can cancel your subscription at any time with no cancellation fees.",
		},
	];

	return (
		<View style={[styles.faqSection, { backgroundColor: cardColor }]}>
		<ThemedText style={styles.faqTitle}>
		Frequently Asked Questions
		</ThemedText>
		{faqItems.map((item, index) => (
			<View key={index} style={styles.faqItem}>
			<ThemedText style={styles.faqQuestion}>{item.question}</ThemedText>
			<ThemedText style={[styles.faqAnswer, { color: mutedColor }]}>
			{item.answer}
			</ThemedText>
			</View>
		))}
		</View>
	);
};

export default function SubscriptionPage() {
	const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan | null>(
		null
	);
	const [billingPeriod, setBillingPeriod] = useState<"month" | "year">("month");

	const backgroundColor = useThemeColor({}, "background");
	const mutedColor = useThemeColor(
		{ light: "#8e8e93", dark: "#8e8e93" },
		"text"
	);

	const handlePlanSelect = (plan: SubscriptionPlan) => {
		setSelectedPlan(plan);
		console.log("Selected plan:", plan.name);
		// TODO: Navigate to payment or handle subscription
	};

	const PAYMENT_LINKS: Record<string, string> = {
		"Starter-month": "https://rzp.io/rzp/aLD83Dqx",
		"Professional-month": "https://rzp.io/rzp/1uhnVSGa",
		"Starter-year": "https://rzp.io/rzp/KmekvB3g",
		"Professional-year": "https://rzp.io/rzp/18MA4QR",
	};

	const handlePlanSubmit = async (plan: SubscriptionPlan) => {
		console.log("Subscribing to:", plan.name);

		try {
			const planKey = `${plan.name}-${plan.billingPeriod}`;
			const paymentLink = PAYMENT_LINKS[planKey];

			if (!paymentLink) {
				Alert.alert("Error", "Payment link not configured for this plan");
				return;
			}

			const result = await WebBrowser.openBrowserAsync(paymentLink);

		} catch (error) {
			console.error("Payment error:", error);
			Alert.alert("Error", "Unable to open payment gateway.");
		}
	};

	const handleSuccessfulPayment = (data: SuccessResponse) => {
		// Here you would typically:
		// 1. Verify payment signature on backend
		// 2. Update user's subscription status in your database
		// 3. Grant access to premium features

		console.log("Payment Data:", {
			paymentId: data.razorpay_payment_id,
			subscriptionId: data.razorpay_order_id,
			signature: data.razorpay_signature,
		});
	};

	const displayedPlans = subscriptionPlans.map((plan) => ({
		...plan,
		price:
			billingPeriod === "year" ? Math.round(plan.price * 12 * 0.8) : plan.price,
		originalPrice:
			billingPeriod === "year" && plan.originalPrice
				? Math.round(plan.originalPrice * 12)
				: plan.originalPrice,
				billingPeriod:
					billingPeriod === "year" ? ("year" as const) : ("month" as const),
	}));

	return (
		<ThemedView style={styles.container}>
		<ScrollView showsVerticalScrollIndicator={false}>
		{/* Header */}
		<View style={styles.header}>
		<ThemedText style={styles.headerTitle}>Choose Your Plan</ThemedText>
		<ThemedText style={[styles.headerSubtitle, { color: mutedColor }]}>
		Unlock powerful features to grow your business
		</ThemedText>
		</View>

		{/* Billing Toggle */}
		<BillingToggle
		billingPeriod={billingPeriod}
		onToggle={setBillingPeriod}
		/>

		{/* Plans */}
		<View style={styles.plansContainer}>
		{displayedPlans.map((plan) => (
			<PlanCard
			key={plan.id}
			plan={plan}
			isSelected={selectedPlan?.id === plan.id}
			onSelect={handlePlanSelect}
			onSubmit={handlePlanSubmit}
			/>
		))}
		</View>

		{/* Feature Comparison */}
		{/* <FeatureComparison /> */}

		{/* FAQ */}
		<FAQ />

		{/* Trust Indicators */}
		<View style={styles.trustSection}>
		<View style={styles.trustItem}>
		<Ionicons name="shield-checkmark" size={24} color="#10b981" />
		<ThemedText style={styles.trustText}>Secure Payment</ThemedText>
		</View>
		<View style={styles.trustItem}>
		<Ionicons name="close-circle" size={24} color="#f59e0b" />
		<ThemedText style={styles.trustText}>Cancel Anytime</ThemedText>
		</View>
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
		paddingHorizontal: 24,
		paddingTop: 60,
		paddingBottom: 24,
		alignItems: "center",
	},
	headerTitle: {
		fontSize: 32,
		fontWeight: "700",
		marginBottom: 8,
		textAlign: "center",
	},
	headerSubtitle: {
		fontSize: 16,
		textAlign: "center",
		lineHeight: 22,
	},
	billingToggle: {
		flexDirection: "row",
		marginHorizontal: 24,
		marginBottom: 24,
		borderRadius: 12,
		padding: 4,
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.05,
		shadowRadius: 8,
		elevation: 4,
	},
	toggleOption: {
		flex: 1,
		paddingVertical: 12,
		paddingHorizontal: 16,
		borderRadius: 8,
		alignItems: "center",
		position: "relative",
	},
	toggleOptionActive: {
		backgroundColor: "#3b82f6",
	},
	toggleText: {
		fontSize: 16,
		fontWeight: "600",
		color: "#8e8e93",
	},
	toggleTextActive: {
		color: "#ffffff",
	},
	saveBadge: {
		position: "absolute",
		top: -8,
		right: -8,
		backgroundColor: "#10b981",
		paddingHorizontal: 6,
		paddingVertical: 2,
		borderRadius: 8,
	},
	saveText: {
		color: "#ffffff",
		fontSize: 10,
		fontWeight: "600",
	},
	plansContainer: {
		paddingHorizontal: 24,
		gap: 16,
		marginBottom: 32,
	},
	planCard: {
		padding: 24,
		borderRadius: 20,
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 4 },
		shadowOpacity: 0.1,
		shadowRadius: 12,
		elevation: 8,
		position: "relative",
	},
	selectedCard: {
		borderWidth: 2,
		borderColor: "#3b82f6",
	},
	popularCard: {
		borderWidth: 2,
		borderColor: "#8b5cf6",
	},
	popularBadge: {
		position: "absolute",
		top: -16,
		left: 20,
		width: 130,
		right: 20,
		zIndex: 1,
	},
	popularGradient: {
		flexDirection: "row",
		alignItems: "center",
		paddingVertical: 4,
		paddingHorizontal: 16,
		borderRadius: 12,
		gap: 6,
	},
	popularText: {
		color: "#ffffff",
		fontSize: 12,
		fontWeight: "700",
	},
	discountBadge: {
		position: "absolute",
		top: 16,
		right: 16,
		backgroundColor: "#ef4444",
		paddingHorizontal: 8,
		paddingVertical: 4,
		borderRadius: 8,
	},
	discountText: {
		color: "#ffffff",
		fontSize: 12,
		fontWeight: "700",
	},
	planHeader: {
		marginBottom: 20,
	},
	planName: {
		fontSize: 24,
		fontWeight: "700",
		marginBottom: 4,
	},
	planDescription: {
		fontSize: 16,
	},
	pricingSection: {
		alignItems: "center",
		marginBottom: 16,
	},
	priceContainer: {
		flexDirection: "row",
		alignItems: "baseline",
		marginBottom: 2,
	},
	currency: {
		fontSize: 24,
		fontWeight: "600",
	},
	price: {
		fontSize: 33,
		fontWeight: "700",
	},
	period: {
		fontSize: 18,
		fontWeight: "500",
	},
	originalPriceContainer: {
		flexDirection: "row",
		alignItems: "center",
	},
	originalPrice: {
		fontSize: 16,
		textDecorationLine: "line-through",
	},
	selectButton: {
		marginBottom: 24,
		borderRadius: 16,
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 4 },
		shadowOpacity: 0.2,
		shadowRadius: 8,
		elevation: 6,
	},
	buttonGradient: {
		paddingVertical: 12,
		borderRadius: 16,
		alignItems: "center",
	},
	buttonText: {
		color: "#ffffff",
		fontSize: 16,
		fontWeight: "700",
	},
	featuresSection: {
		gap: 6,
	},
	featuresTitle: {
		fontSize: 16,
		fontWeight: "600",
		marginBottom: 8,
	},
	limitationsTitle: {
		fontSize: 16,
		fontWeight: "600",
		marginBottom: 8,
		marginTop: 12,
	},
	featureItem: {
		flexDirection: "row",
		alignItems: "center",
		gap: 12,
	},
	featureText: {
		fontSize: 14,
		flex: 1,
		lineHeight: 20,
	},
	comparisonTable: {
		marginHorizontal: 24,
		marginBottom: 32,
		padding: 20,
		borderRadius: 16,
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.05,
		shadowRadius: 8,
		elevation: 4,
	},
	comparisonTitle: {
		fontSize: 20,
		fontWeight: "700",
		marginBottom: 16,
		textAlign: "center",
	},
	tableHeader: {
		flexDirection: "row",
		borderBottomWidth: 1,
		borderBottomColor: "rgba(142, 142, 147, 0.2)",
		paddingBottom: 12,
		marginBottom: 12,
	},
	tableHeaderText: {
		flex: 1,
		fontSize: 12,
		fontWeight: "600",
		textAlign: "center",
	},
	tableRow: {
		flexDirection: "row",
		paddingVertical: 8,
	},
	tableCell: {
		flex: 1,
		fontSize: 12,
		textAlign: "center",
	},
	featureCell: {
		textAlign: "left",
		fontWeight: "500",
	},
	faqSection: {
		marginHorizontal: 24,
		marginBottom: 32,
		padding: 20,
		borderRadius: 16,
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.05,
		shadowRadius: 8,
		elevation: 4,
	},
	faqTitle: {
		fontSize: 20,
		fontWeight: "700",
		marginBottom: 20,
		textAlign: "center",
	},
	faqItem: {
		marginBottom: 16,
	},
	faqQuestion: {
		fontSize: 16,
		fontWeight: "600",
		marginBottom: 6,
	},
	faqAnswer: {
		fontSize: 14,
		lineHeight: 20,
	},
	trustSection: {
		flexDirection: "row",
		justifyContent: "space-around",
		paddingHorizontal: 24,
		paddingVertical: 32,
	},
	trustItem: {
		alignItems: "center",
		flex: 1,
	},
	trustText: {
		fontSize: 12,
		fontWeight: "500",
		marginTop: 8,
		textAlign: "center",
	},
});
