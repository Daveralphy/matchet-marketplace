// Created by: Raphael Daveal
// Edited by: Raphael Daveal

// Static presentation content for the Home mobile-app promotion.
// Platform/user data such as the logged-in user's name is supplied by the page.

export const MOBILE_APP_SECTIONS = {
  loggedOut: {
    eyebrow: "TAKE MATCHET WITH YOU",
    title: "Find your next match,",
    accent: "wherever you are.",
    subtitle: "Discover products, book services, and connect with trusted providers from your phone.",
    primaryCta: "Download the app",
    benefits: [
      { icon: "bag", title: "Shop", description: "products", tone: "green" },
      { icon: "calendar", title: "Book", description: "services", tone: "purple" },
      { icon: "users", title: "Connect with", description: "trusted providers", tone: "blue" },
    ],
    sideBenefits: [
      { icon: "spark", title: "Fast and", description: "easy to use", tone: "green" },
      { icon: "pin", title: "Access", description: "anywhere", tone: "purple" },
      { icon: "shield", title: "Same trusted", description: "experience", tone: "blue" },
    ],
  },
  loggedIn: {
    eyebrow: "MATCHET ON THE GO",
    title: "Your marketplace,",
    accent: "wherever you are.",
    subtitle: "Keep exploring, manage your bookings, track orders, and stay connected with your matches.",
    primaryCta: "Open Matchet app",
    benefits: [
      { icon: "cart", title: "Track", description: "your orders", tone: "green" },
      { icon: "calendar", title: "Manage", description: "your bookings", tone: "purple" },
      { icon: "heart", title: "Save your", description: "favourites", tone: "blue" },
      { icon: "bell", title: "Get real-time", description: "updates", tone: "orange" },
    ],
    sideBenefits: [
      { icon: "calendar", title: "Manage", description: "your bookings", tone: "green" },
      { icon: "spark", title: "Track", description: "your orders", tone: "purple" },
      { icon: "heart", title: "Saved items", description: "on the go", tone: "blue" },
      { icon: "bell", title: "Stay", description: "updated", tone: "orange" },
    ],
  },
};
