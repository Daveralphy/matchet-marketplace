// Created by: Raphael Daveal
// Edited by: Raphael Daveal

// Temporary UI fixture only.
// Review people, quotes, ratings, and roles should be replaced by Review/User API data.
// Aggregate values are intentionally derived from the review records instead of being
// manually entered, so the UI stays consistent when the backend data changes.

export const COMMUNITY_REVIEW_SECTION = {
  loggedOut: {
    eyebrow: "TRUSTED BY THE COMMUNITY",
    title: "People are finding",
    accent: "their match.",
    subtitle: "See what buyers and providers are saying about their experience with Matchet.",
    cta: "Read more reviews",
    reviews: [
      {
        id: "review-1",
        quote: "Matchet made it so much easier to find exactly what I needed. I did not have to spend hours searching through different places. The process was simple and fast.",
        name: "Amara Okafor",
        role: "Buyer",
        location: "Lagos",
        rating: 5,
        initials: "AO",
        avatarUrl: "",
        avatarTone: "bg-[#dcefe5]",
      },
      {
        id: "review-2",
        quote: "I found a reliable provider quickly and the whole process felt simple from start to finish. Matchet helped me find what I needed without the usual back and forth.",
        name: "Chiamaka Nwosu",
        role: "Buyer",
        location: "Lagos",
        rating: 4,
        initials: "CN",
        avatarUrl: "",
        avatarTone: "bg-[#f2dfd5]",
      },
      {
        id: "review-3",
        quote: "Getting discovered by people who actually needed my service made the experience much easier. Matchet gives providers a better way to connect with customers.",
        name: "Daniel Adebayo",
        role: "Provider",
        location: "Lagos",
        rating: 5,
        initials: "DA",
        avatarUrl: "",
        avatarTone: "bg-[#dce6f6]",
      },
    ],
  },
  loggedIn: {
    eyebrow: "FROM THE MATCHET COMMUNITY",
    title: "You are part of",
    accent: "the community.",
    subtitle: "See how people are using Matchet to buy, book, sell, and grow.",
    cta: "See more stories",
    reviews: [
      {
        id: "story-1",
        quote: "I found a service provider within minutes and the whole booking process was surprisingly simple. Matchet has really made my life easier.",
        name: "Daniel Adebayo",
        role: "Customer",
        location: "Lagos",
        rating: 5,
        initials: "DA",
        avatarUrl: "",
        avatarTone: "bg-[#dce6f6]",
      },
      {
        id: "story-2",
        quote: "I was able to find exactly what I was looking for and connect with the right person without spending all day searching.",
        name: "Amara Okafor",
        role: "Customer",
        location: "Lagos",
        rating: 5,
        initials: "AO",
        avatarUrl: "",
        avatarTone: "bg-[#dcefe5]",
      },
      {
        id: "story-3",
        quote: "The community makes it easier to discover opportunities and connect with people who are looking for what I offer.",
        name: "Chiamaka Nwosu",
        role: "Provider",
        location: "Lagos",
        rating: 4,
        initials: "CN",
        avatarUrl: "",
        avatarTone: "bg-[#f2dfd5]",
      },
    ],
    communityPoints: [
      {
        title: "Real people",
        description: "Verified buyers and providers",
        icon: "users",
        tone: "green",
      },
      {
        title: "Honest reviews",
        description: "From the Matchet community",
        icon: "shield",
        tone: "green",
      },
      {
        title: "Better experiences",
        description: "People find what they need, faster",
        icon: "heart",
        tone: "green",
      },
      {
        title: "A growing platform",
        description: "More people, more opportunities",
        icon: "star",
        tone: "green",
      },
    ],
  },
};

export function calculateReviewStats(reviews = []) {
  const validRatings = reviews
    .map((review) => Number(review.rating))
    .filter((rating) => Number.isFinite(rating) && rating >= 1 && rating <= 5);

  const reviewCount = reviews.length;
  const averageRating = validRatings.length
    ? validRatings.reduce((total, rating) => total + rating, 0) / validRatings.length
    : 0;

  return {
    averageRating: Number(averageRating.toFixed(1)),
    reviewCount,
  };
}

export function formatReviewCount(count) {
  return new Intl.NumberFormat("en-NG").format(count);
}
