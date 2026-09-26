// Created by: Raphael Daveal
// Edited by: Raphael Daveal

// Temporary UI fixture only.
// Replace testimonials, community metrics, and avatar URLs with review/community API data.
// The Home page renders this data without embedding testimonial content in the page component.

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
        rating: 5,
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
    stats: {
      rating: "4.8 / 5",
      ratingLabel: "Average community rating",
      reviewCount: "2,400+",
      reviewLabel: "Reviews from buyers and providers",
      reviewBasis: "Based on 2,400+ reviews",
      communityLabel: "A growing community you can trust",
    },
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
        rating: 5,
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
