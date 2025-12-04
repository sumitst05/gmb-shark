import AsyncStorage from "@react-native-async-storage/async-storage";
import competitors from "../data/competitors.json";

const DEMO_BUSINESS = {
  id: "biz_cafe_aroma",
  name: "Cafe Aroma",
  category: "Cafe & Bistro",
  address: "12, Mira Road, Indiranagar, Thane",
  rating: 3.8,
  totalReviews: 45,
  views: "4.3k",
  customers: "400",
  profileCompletion: 65,
  checklist: [
    { text: "Professional photos", isGood: true },
    { text: "Complete business info", isGood: true },
    { text: "Regular posts", isGood: false },
    { text: "Respond to reviews", isGood: false },
    { text: "Add opening hours", isGood: true },
    { text: "Add menu link", isGood: false },
  ],
};

export const MockAPI = {
  searchBusiness: async (email: string) => {
    await new Promise((resolve) => setTimeout(resolve, 1500));

    return {
      found: true,
      businessName: DEMO_BUSINESS.name,
      address: DEMO_BUSINESS.address,
    };
  },

  getDashboardData: async () => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return DEMO_BUSINESS;
  },

  getCompetitors: async () => {
    await new Promise((resolve) => setTimeout(resolve, 1200));
    return competitors;
  },

  performAction: async (actionType: string) => {
    await new Promise((resolve) => setTimeout(resolve, 2000));
    return { success: true, message: "Action completed successfully!" };
  },
};
