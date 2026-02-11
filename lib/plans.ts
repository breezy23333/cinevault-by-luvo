export type Plan = "free" | "plus" | "supporter";

export const PLANS = {
  free: {
    name: "Free",
    price: 0,
    features: {
      advancedRecommendations: false,
      noAds: false,
      watchlistSync: false,
      mobileFeatures: false,
      experimental: false,
    },
  },

  plus: {
    name: "Plus",
    price: 19,
    features: {
      advancedRecommendations: true,
      noAds: true,
      watchlistSync: true,
      mobileFeatures: true,
      experimental: false,
    },
  },

  supporter: {
    name: "Supporter",
    price: 39,
    features: {
      advancedRecommendations: true,
      noAds: true,
      watchlistSync: true,
      mobileFeatures: true,
      experimental: true,
    },
  },
} as const;
