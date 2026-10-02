const mongoose = require("mongoose");
const Booking = require("../models/Booking");
const Service = require("../models/Service");
const Product = require("../models/Product");
const Review = require("../models/Review");
const Message = require("../models/Message");
const ProviderProfile = require("../models/ProviderProfile");
const StoreProfile = require("../models/StoreProfile");
const Payout = require("../models/Payout");
const Order = require("../models/Order");
const User = require("../models/User");

function monthBounds(date = new Date()) {
  const start = new Date(date.getFullYear(), date.getMonth(), 1);
  const next = new Date(date.getFullYear(), date.getMonth() + 1, 1);
  const previous = new Date(date.getFullYear(), date.getMonth() - 1, 1);
  return { start, next, previous };
}

function initials(user) {
  return [user?.firstName, user?.lastName]
    .filter(Boolean)
    .map((value) => value[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

async function getProviderDashboard(req, res) {
  try {
    const providerId = req.user._id;
    const providerIdString = providerId.toString();
    const { start, next, previous } = monthBounds();

    const [provider, bookingsThisMonth, bookingsPreviousMonth, completedBookings, services] =
      await Promise.all([
        ProviderProfile.findOne({ userId: providerId }).lean(),
        Booking.find({
          providerId,
          scheduledDate: { $gte: start, $lt: next },
        }).lean(),
        Booking.find({
          providerId,
          scheduledDate: { $gte: previous, $lt: start },
        }).lean(),
        Booking.find({
          providerId,
          status: "completed",
        }).select("priceSnapshot buyerId scheduledDate serviceId").lean(),
        Service.find({ providerId }).select("title images").lean(),
      ]);

    const serviceIds = services.map((service) => service._id);
    const [reviews, previousReviews, upcomingBookings, incomingMessages] = await Promise.all([
      serviceIds.length
        ? Review.find({
            serviceId: { $in: serviceIds },
            status: "published",
          }).select("rating createdAt").lean()
        : [],
      serviceIds.length
        ? Review.find({
            serviceId: { $in: serviceIds },
            status: "published",
            createdAt: { $gte: previous, $lt: start },
          }).select("rating").lean()
        : [],
      Booking.find({
        providerId,
        scheduledDate: { $gte: new Date() },
        status: { $nin: ["cancelled", "declined", "completed"] },
      })
        .sort({ scheduledDate: 1, createdAt: 1 })
        .limit(3)
        .populate("buyerId", "firstName lastName avatar")
        .populate("serviceId", "title images")
        .lean(),
      Message.find({
        receiverId: providerId,
      })
        .sort({ createdAt: -1 })
        .limit(50)
        .populate("senderId", "firstName lastName avatar")
        .lean(),
    ]);

    const totalBookings = bookingsThisMonth.filter(
      (booking) => !["cancelled", "declined"].includes(booking.status),
    ).length;

    const previousBookings = bookingsPreviousMonth.filter(
      (booking) => !["cancelled", "declined"].includes(booking.status),
    ).length;

    const bookingGrowth =
      previousBookings === 0
        ? totalBookings > 0
          ? null
          : 0
        : Math.round(((totalBookings - previousBookings) / previousBookings) * 100);

    const currentCustomers = new Set(
      bookingsThisMonth
        .filter((booking) => !["cancelled", "declined"].includes(booking.status))
        .map((booking) => booking.buyerId.toString()),
    ).size;

    const previousCustomers = new Set(
      bookingsPreviousMonth
        .filter((booking) => !["cancelled", "declined"].includes(booking.status))
        .map((booking) => booking.buyerId.toString()),
    ).size;

    const customerGrowth =
      previousCustomers === 0
        ? currentCustomers > 0
          ? null
          : 0
        : Math.round(((currentCustomers - previousCustomers) / previousCustomers) * 100);

    const earningsThisMonth = completedBookings
      .filter((booking) => booking.scheduledDate >= start && booking.scheduledDate < next)
      .reduce((sum, booking) => sum + Number(booking.priceSnapshot?.amount || 0), 0);

    const earningsPreviousMonth = completedBookings
      .filter((booking) => booking.scheduledDate >= previous && booking.scheduledDate < start)
      .reduce((sum, booking) => sum + Number(booking.priceSnapshot?.amount || 0), 0);

    const earningsGrowth =
      earningsPreviousMonth === 0
        ? earningsThisMonth > 0
          ? null
          : 0
        : Math.round(((earningsThisMonth - earningsPreviousMonth) / earningsPreviousMonth) * 100);

    const averageRating = reviews.length
      ? Number((reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length).toFixed(1))
      : 0;

    const previousAverageRating = previousReviews.length
      ? Number((previousReviews.reduce((sum, review) => sum + review.rating, 0) / previousReviews.length).toFixed(1))
      : null;

    const ratingChange =
      previousAverageRating === null
        ? null
        : Number((averageRating - previousAverageRating).toFixed(1));

    const recentByConversation = new Map();
    for (const message of incomingMessages) {
      if (!recentByConversation.has(message.conversationId)) {
        recentByConversation.set(message.conversationId, message);
      }
      if (recentByConversation.size === 4) break;
    }

    const recentMessages = [...recentByConversation.values()].map((message) => ({
      id: message._id,
      conversationId: message.conversationId,
      content: message.content || "",
      createdAt: message.createdAt,
      unread: !message.readAt,
      customer: {
        id: message.senderId?._id,
        name: [message.senderId?.firstName, message.senderId?.lastName].filter(Boolean).join(" "),
        initials: initials(message.senderId),
        avatar: message.senderId?.avatar?.url || null,
      },
    }));

    const unreadMessages = await Message.countDocuments({
      receiverId: providerId,
      readAt: null,
    });

    const serializedBookings = upcomingBookings.map((booking) => ({
      id: booking._id,
      scheduledDate: booking.scheduledDate,
      scheduledTime: booking.scheduledTime,
      status: booking.status,
      amount: booking.priceSnapshot?.amount || 0,
      currency: booking.priceSnapshot?.currency || "NGN",
      customer: {
        id: booking.buyerId?._id,
        name: [booking.buyerId?.firstName, booking.buyerId?.lastName].filter(Boolean).join(" "),
        initials: initials(booking.buyerId),
        avatar: booking.buyerId?.avatar?.url || null,
      },
      service: {
        id: booking.serviceId?._id,
        title: booking.serviceId?.title || "Service",
        image: booking.serviceId?.images?.find((image) => image.isPrimary)?.url || booking.serviceId?.images?.[0]?.url || null,
      },
    }));

    const applicationState = provider
      ? {
          status: provider.status,
          verificationStatus: provider.verificationStatus,
          isUnderReview:
            provider.status === "draft" &&
            ["pending"].includes(provider.verificationStatus),
        }
      : {
          status: "not_started",
          verificationStatus: null,
          isUnderReview: false,
        };

    return res.status(200).json({
      success: true,
      data: {
        provider: {
          id: req.user._id,
          name: [req.user.firstName, req.user.lastName].filter(Boolean).join(" "),
          firstName: req.user.firstName,
          avatar: req.user.avatar?.url || null,
          location: [req.user.location?.city, req.user.location?.country].filter(Boolean).join(", "),
          profile: provider,
        },
        application: applicationState,
        kpis: {
          bookings: {
            value: totalBookings,
            change: bookingGrowth,
          },
          customers: {
            value: currentCustomers,
            change: customerGrowth,
          },
          earnings: {
            value: earningsThisMonth,
            currency: "NGN",
            change: earningsGrowth,
          },
          rating: {
            value: averageRating,
            reviewCount: reviews.length,
            change: ratingChange,
          },
        },
        upcomingBookings: serializedBookings,
        recentMessages,
        unreadMessages,
        serviceCount: services.length,
        generatedAt: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error("Provider dashboard error:", error);
    return res.status(500).json({
      success: false,
      message: "Unable to load your provider dashboard right now.",
    });
  }
}

module.exports = { getProviderDashboard };

async function getProviderEarnings(req, res) {
  try {
    const providerId = req.user._id;
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfNextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);
    const startOfPreviousMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const startOfSixMonths = new Date(now.getFullYear(), now.getMonth() - 5, 1);

    const [completedBookings, pendingBookings, payouts, services] = await Promise.all([
      Booking.find({ providerId, status: "completed" })
        .select("priceSnapshot serviceId scheduledDate createdAt")
        .populate("serviceId", "title category")
        .sort({ scheduledDate: -1 })
        .lean(),
      Booking.find({
        providerId,
        status: { $in: ["pending", "confirmed", "inProgress"] },
      })
        .select("priceSnapshot scheduledDate")
        .lean(),
      Payout.find({ providerId }).sort({ createdAt: -1 }).limit(100).lean(),
      Service.find({ providerId }).select("title category").lean(),
    ]);

    const totalEarnings = completedBookings.reduce(
      (sum, booking) => sum + Number(booking.priceSnapshot?.amount || 0), 0
    );

    const thisMonth = completedBookings
      .filter((booking) => booking.scheduledDate >= startOfMonth && booking.scheduledDate < startOfNextMonth)
      .reduce((sum, booking) => sum + Number(booking.priceSnapshot?.amount || 0), 0);

    const previousMonth = completedBookings
      .filter((booking) => booking.scheduledDate >= startOfPreviousMonth && booking.scheduledDate < startOfMonth)
      .reduce((sum, booking) => sum + Number(booking.priceSnapshot?.amount || 0), 0);

    const monthChange = previousMonth === 0 ? null : Math.round(((thisMonth - previousMonth) / previousMonth) * 100);

    const pendingPayout = payouts
      .filter((payout) => payout.status === "pending" || payout.status === "processing")
      .reduce((sum, payout) => sum + Number(payout.amount || 0), 0);

    const totalPaidOut = payouts
      .filter((payout) => payout.status === "completed")
      .reduce((sum, payout) => sum + Number(payout.amount || 0), 0);

    const monthlyMap = new Map();
    for (let i = 0; i < 6; i += 1) {
      const date = new Date(now.getFullYear(), now.getMonth() - (5 - i), 1);
      monthlyMap.set(
        date.toISOString().slice(0, 7),
        { month: date.toLocaleString("en-US", { month: "short", year: "numeric" }), amount: 0 }
      );
    }

    for (const booking of completedBookings) {
      const key = new Date(booking.scheduledDate).toISOString().slice(0, 7);
      if (monthlyMap.has(key)) monthlyMap.get(key).amount += Number(booking.priceSnapshot?.amount || 0);
    }

    const categoryMap = new Map();
    for (const booking of completedBookings) {
      const category = booking.serviceId?.category || "Other";
      categoryMap.set(category, (categoryMap.get(category) || 0) + Number(booking.priceSnapshot?.amount || 0));
    }

    const categoryTotal = [...categoryMap.values()].reduce((sum, value) => sum + value, 0);
    const breakdown = [...categoryMap.entries()]
      .sort((a, b) => b[1] - a[1])
      .map(([category, amount]) => ({
        category,
        amount,
        percentage: categoryTotal ? Math.round((amount / categoryTotal) * 100) : 0,
      }));

    const transactions = [
      ...payouts.map((payout) => ({
        id: payout._id,
        type: "payout",
        date: payout.paidAt || payout.createdAt,
        description: payout.method?.bankName
          ? "Payout to " + payout.method.bankName + " (•••• " + (payout.method.accountLast4 || "----") + ")"
          : "Payout",
        amount: payout.amount,
        currency: payout.currency,
        status: payout.status,
      })),
      ...completedBookings.map((booking) => ({
        id: booking._id,
        type: "booking",
        date: booking.scheduledDate || booking.createdAt,
        description: booking.serviceId?.title || "Service booking",
        amount: booking.priceSnapshot?.amount || 0,
        currency: booking.priceSnapshot?.currency || "NGN",
        status: "completed",
      })),
    ].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 20);

    return res.json({
      success: true,
      data: {
        summary: {
          totalEarnings,
          thisMonth,
          monthChange,
          pendingPayout,
          pendingPayoutBookings: pendingBookings.length,
          totalPaidOut,
          payoutCount: payouts.filter((payout) => payout.status === "completed").length,
          currency: completedBookings[0]?.priceSnapshot?.currency || "NGN",
        },
        monthly: [...monthlyMap.values()],
        breakdown,
        transactions,
        payoutMethod: payouts[0]?.method || null,
        serviceCount: services.length,
        generatedAt: new Date().toISOString(),
        startOfSixMonths,
      },
    });
  } catch (error) {
    console.error("Provider earnings error:", error);
    return res.status(500).json({
      success: false,
      message: "Unable to load your earnings right now.",
    });
  }
}
module.exports.getProviderEarnings = getProviderEarnings;


async function getProviderServices(req, res) {
  try {
    const providerId = req.user._id;
    const now = new Date();
    const last30Start = new Date(now);
    last30Start.setDate(last30Start.getDate() - 30);
    const previous30Start = new Date(last30Start);
    previous30Start.setDate(previous30Start.getDate() - 30);

    const [services, currentBookings, previousBookings] = await Promise.all([
      Service.find({ providerId })
        .sort({ createdAt: -1 })
        .lean(),
      Booking.find({
        providerId,
        scheduledDate: { $gte: last30Start, $lte: now },
        status: { $nin: ["cancelled", "declined"] },
      })
        .select("serviceId")
        .lean(),
      Booking.find({
        providerId,
        scheduledDate: { $gte: previous30Start, $lt: last30Start },
        status: { $nin: ["cancelled", "declined"] },
      })
        .select("serviceId")
        .lean(),
    ]);

    const bookingCounts = new Map();
    for (const booking of currentBookings) {
      const id = booking.serviceId?.toString();
      if (id) bookingCounts.set(id, (bookingCounts.get(id) || 0) + 1);
    }

    const previousBookingTotal = previousBookings.length;
    const currentBookingTotal = currentBookings.length;
    const bookingGrowth =
      previousBookingTotal === 0
        ? currentBookingTotal > 0 ? null : 0
        : Math.round(((currentBookingTotal - previousBookingTotal) / previousBookingTotal) * 100);

    const activeServices = services.filter((service) => service.status === "active").length;
    const pausedServices = services.filter((service) => service.status === "paused").length;
    const totalViews = services.reduce((sum, service) => sum + Number(service.viewCount || 0), 0);

    return res.json({
      success: true,
      data: {
        summary: {
          activeServices,
          pausedServices,
          totalViews,
          totalBookings: currentBookingTotal,
          bookingGrowth,
        },
        services: services.map((service) => ({
          id: service._id,
          title: service.title,
          description: service.description,
          category: service.category,
          price: service.pricing?.amount ?? null,
          currency: service.pricing?.currency || null,
          pricingType: service.pricing?.type || null,
          durationMinutes: service.durationMinutes || null,
          status: service.status,
          bookingsLast30Days: bookingCounts.get(service._id.toString()) || 0,
          views: Number(service.viewCount || 0),
          image:
            service.images?.find((image) => image.isPrimary)?.url ||
            service.images?.[0]?.url ||
            null,
          images: service.images || [],
          createdAt: service.createdAt,
          updatedAt: service.updatedAt,
        })),
        generatedAt: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error("Provider services error:", error);
    return res.status(500).json({
      success: false,
      message: "Unable to load your services right now.",
    });
  }
}

module.exports.getProviderServices = getProviderServices;


async function getProviderReviews(req, res) {
  try {
    const providerId = req.user._id;
    const services = await Service.find({ providerId }).select("_id title").lean();
    const serviceIds = services.map((service) => service._id);
    const serviceMap = new Map(services.map((service) => [service._id.toString(), service]));

    if (!serviceIds.length) {
      return res.json({
        success: true,
        data: {
          summary: { averageRating: 0, totalReviews: 0, commentedReviews: 0, ratingBreakdown: [5,4,3,2,1].map((rating) => ({ rating, count: 0, percentage: 0 })) },
          reviews: [],
          generatedAt: new Date().toISOString(),
        },
      });
    }

    const reviews = await Review.find({ serviceId: { $in: serviceIds }, status: "published" })
      .sort({ createdAt: -1 })
      .populate("reviewerId", "firstName lastName avatar")
      .select("reviewerId serviceId rating comment createdAt")
      .lean();

    const totalReviews = reviews.length;
    const averageRating = totalReviews
      ? Number((reviews.reduce((sum, review) => sum + Number(review.rating || 0), 0) / totalReviews).toFixed(1))
      : 0;

    const ratingBreakdown = [5, 4, 3, 2, 1].map((rating) => {
      const count = reviews.filter((review) => review.rating === rating).length;
      return { rating, count, percentage: totalReviews ? Math.round((count / totalReviews) * 100) : 0 };
    });

    const serviceQuality = totalReviews
      ? Number((reviews.reduce((sum, review) => sum + Number(review.rating || 0), 0) / totalReviews).toFixed(1))
      : 0;

    return res.json({
      success: true,
      data: {
        summary: {
          averageRating,
          totalReviews,
          commentedReviews: reviews.filter((review) => Boolean(review.comment?.trim())).length,
          serviceQuality,
          ratingBreakdown,
        },
        reviews: reviews.map((review) => ({
          id: review._id,
          rating: review.rating,
          comment: review.comment || "",
          createdAt: review.createdAt,
          customer: {
            id: review.reviewerId?._id || null,
            name: [review.reviewerId?.firstName, review.reviewerId?.lastName].filter(Boolean).join(" ") || "Customer",
            initials: initials(review.reviewerId),
            avatar: review.reviewerId?.avatar?.url || null,
          },
          service: {
            id: review.serviceId,
            title: serviceMap.get(review.serviceId.toString())?.title || "Service",
          },
        })),
        generatedAt: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error("Provider reviews error:", error);
    return res.status(500).json({ success: false, message: "Unable to load your reviews right now." });
  }
}
module.exports.getProviderReviews = getProviderReviews;


async function getProviderProfile(req, res) {
  try {
    const user = await User.findById(req.user._id).lean();
    const provider = await ProviderProfile.findOne({ userId: req.user._id }).lean();
    const services = await Service.find({ providerId: req.user._id })
      .select("_id title status")
      .sort({ createdAt: -1 })
      .lean();

    if (!user) return res.status(404).json({ success: false, message: "Account not found." });

    const profileChecks = [
      { key: "photo", label: "Add profile photo", complete: Boolean(user.avatar?.url) },
      { key: "bio", label: "Add a short bio", complete: Boolean(provider?.bio?.trim()) },
      { key: "location", label: "Add location", complete: Boolean(provider?.serviceArea?.city || user.location?.city) },
      { key: "service", label: "Add at least one service", complete: services.length > 0 },
      { key: "identity", label: "Verify your identity", complete: provider?.verificationStatus === "verified" },
    ];

    const completedChecks = profileChecks.filter((item) => item.complete).length;
    const completeness = Math.round((completedChecks / profileChecks.length) * 100);

    return res.json({
      success: true,
      data: {
        user: {
          id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          name: [user.firstName, user.lastName].filter(Boolean).join(" "),
          email: user.email,
          phone: user.phone || null,
          avatar: user.avatar?.url || null,
          location: user.location || null,
          memberSince: user.createdAt,
        },
        profile: provider
          ? {
              id: provider._id,
              businessName: provider.businessName,
              bio: provider.bio || "",
              skills: provider.skills || [],
              categories: provider.categories || [],
              experience: provider.experience || "",
              serviceArea: provider.serviceArea || null,
              verificationStatus: provider.verificationStatus,
              status: provider.status,
              ratingAverage: provider.ratingAverage || 0,
              reviewCount: provider.reviewCount || 0,
              onboarding: provider.onboardingData || {},
              applicationSubmittedAt: provider.applicationSubmittedAt || null,
              reviewedAt: provider.reviewedAt || null,
              reviewNote: provider.reviewNote || "",
            }
          : null,
        services,
        completeness: {
          percentage: completeness,
          checks: profileChecks,
        },
        generatedAt: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error("Provider profile error:", error);
    return res.status(500).json({ success: false, message: "Unable to load your profile right now." });
  }
}
module.exports.getProviderProfile = getProviderProfile;


async function getProviderSettings(req, res) {
  try {
    const [user, provider, latestPayout] = await Promise.all([
      User.findById(req.user._id).select("email phone isActive role preferences lastLoginAt createdAt").lean(),
      ProviderProfile.findOne({ userId: req.user._id }).select("verificationStatus status onboardingData applicationSubmittedAt reviewedAt reviewNote").lean(),
      Payout.findOne({ providerId: req.user._id }).sort({ createdAt: -1 }).select("method status").lean(),
    ]);

    if (!user) return res.status(404).json({ success: false, message: "Account not found." });

    const preferences = user.preferences || {};

    return res.json({
      success: true,
      data: {
        account: {
          email: user.email || null,
          phone: user.phone || null,
          isActive: Boolean(user.isActive),
          role: user.role || null,
          createdAt: user.createdAt,
        },
        notifications: preferences.notifications || null,
        payments: {
          method: latestPayout?.method || null,
          payoutStatus: latestPayout?.status || null,
        },
        security: {
          lastLoginAt: user.lastLoginAt || null,
          identityVerification: provider?.verificationStatus || null,
          providerStatus: provider?.status || null,
        },
        privacy: preferences.privacy || null,
        platform: preferences.platform || null,
        generatedAt: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error("Provider settings error:", error);
    return res.status(500).json({ success: false, message: "Unable to load your settings right now." });
  }
}
module.exports.getProviderSettings = getProviderSettings;

async function updateProviderSettingsPreferences(req, res) {
  try {
    const allowedSections = ["notifications", "privacy", "platform"];
    const updates = req.body || {};
    const user = await User.findById(req.user._id).select("preferences");
    if (!user) return res.status(404).json({ success: false, message: "Account not found." });

    const preferences = user.preferences && typeof user.preferences === "object" ? user.preferences : {};
    for (const section of allowedSections) {
      if (updates[section] && typeof updates[section] === "object" && !Array.isArray(updates[section])) {
        preferences[section] = { ...(preferences[section] || {}), ...updates[section] };
      }
    }

    user.preferences = preferences;
    await user.save();

    return res.json({
      success: true,
      data: {
        notifications: preferences.notifications || null,
        privacy: preferences.privacy || null,
        platform: preferences.platform || null,
      },
    });
  } catch (error) {
    console.error("Update provider settings error:", error);
    return res.status(500).json({ success: false, message: "Unable to save your settings right now." });
  }
}
module.exports.updateProviderSettingsPreferences = updateProviderSettingsPreferences;


async function submitProviderOnboarding(req, res) {
  try {
    const providerId = req.user._id;
    const isDraft = Boolean(req.body?.draft);
    const input = req.body?.formData || req.body || {};

    const businessName =
      input.providerBusinessName ||
      input.businessName ||
      input.providerServiceName ||
      [input.providerFirstName, input.providerLastName].filter(Boolean).join(" ") ||
      "Matchet Provider";

    const categories = Array.isArray(input.providerServiceCat)
      ? input.providerServiceCat
      : [input.providerServiceCat].filter(Boolean);

    const skills = [
      ...(typeof input.providerAreasofExpertise === "string" ? input.providerAreasofExpertise.split(",") : []),
      ...(Array.isArray(input.providerAreasServed) ? input.providerAreasServed : []),
    ].map((value) => String(value).trim()).filter(Boolean);

    const serviceArea = {
      city: input.providerLocation || "",
      state: "",
      country: input.providerCountry || "",
    };

    const provider = await ProviderProfile.findOneAndUpdate(
      { userId: providerId },
      {
        $set: {
          businessName,
          bio: input.providerBio || "",
          categories,
          skills,
          experience: input.providerYearsofExperience || "",
          serviceArea,
          verificationStatus: "pending",
          status: "draft",
          onboardingData: input,
          applicationSubmittedAt: isDraft ? (input.applicationSubmittedAt || null) : new Date(),
          reviewedAt: null,
          reviewNote: "",
        },
        $setOnInsert: {
          userId: providerId,
        },
      },
      { new: true, upsert: true, runValidators: true },
    );

    if (input.providerProfileImage?.url) {
      await User.findByIdAndUpdate(providerId, {
        $set: {
          avatar: {
            url: input.providerProfileImage.url,
            publicId: input.providerProfileImage.publicId || "",
          },
        },
      });
    }

    const parsedPrice = Number(String(input.providerServicePrice || "").replace(/[^0-9.]/g, "")) || 0;
    const pricingType = ["fixed", "startingFrom", "customQuote"].includes(input.providerServiceType)
      ? input.providerServiceType
      : "fixed";
    const durationMatch = String(input.providerServiceDuration || "").match(/[0-9]+(?:\\.[0-9]+)?/);
    const durationValue = durationMatch ? Number(durationMatch[0]) : null;
    const durationMinutes = durationValue
      ? /hour/i.test(String(input.providerServiceDuration)) ? Math.round(durationValue * 60) : Math.round(durationValue)
      : null;

    if (input.providerServiceName) {
      await Service.findOneAndUpdate(
        { providerId, title: input.providerServiceName },
        {
          $set: {
            description: input.providerServiceDesc || "Service submitted during provider onboarding.",
            category: categories[0] || "Other",
            pricing: { type: pricingType, amount: parsedPrice, currency: "NGN" },
            ...(durationMinutes ? { durationMinutes } : {}),
            location: serviceArea,
            availability: input.providerAvailability || {},
            images: Array.isArray(input.providerServiceImages) ? input.providerServiceImages : [],
            status: "draft",
          },
          $setOnInsert: { providerId, title: input.providerServiceName },
        },
        { upsert: true, new: true, runValidators: true },
      );
    }

    const userUpdates = {};
    if (input.providerPhoneNumber) {
      userUpdates.phone = [input.providerCountryCode, input.providerPhoneNumber].filter(Boolean).join(" ");
    }
    if (input.providerLocation) {
      userUpdates.location = {
        ...(req.user.location || {}),
        city: input.providerLocation,
        country: input.providerCountry || req.user.location?.country || "",
      };
    }
    if (!isDraft) userUpdates["capabilities.provider"] = true;
    if (!isDraft && req.user.role !== "admin" && req.user.role !== "provider") userUpdates.role = "provider";

    if (Object.keys(userUpdates).length) {
      await User.findByIdAndUpdate(providerId, { $set: userUpdates });
    }

    return res.status(201).json({
      success: true,
      message: isDraft ? "Your provider onboarding progress has been saved." : "Your provider application has been submitted for review.",
      data: {
        id: provider._id,
        status: provider.status,
        verificationStatus: provider.verificationStatus,
        applicationSubmittedAt: provider.applicationSubmittedAt,
        onboardingStatus: isDraft ? "in_progress" : "submitted",
        formData: provider.onboardingData || {},
      },
    });
  } catch (error) {
    console.error("Provider onboarding submission error:", error);
    return res.status(500).json({
      success: false,
      message: process.env.NODE_ENV === "production"
        ? "Unable to submit your provider application right now."
        : (error.message || "Unable to submit your provider application right now."),
    });
  }
}

module.exports.submitProviderOnboarding = submitProviderOnboarding;


async function createProviderService(req, res) {
  try {
    const provider = await ProviderProfile.findOne({ userId: req.user._id }).lean();
    const canPublish =
      provider?.status === "active" &&
      provider?.verificationStatus === "verified";

    const body = req.body || {};
    const title = String(body.title || "").trim();
    const description = String(body.description || "").trim();
    const category = String(body.category || "").trim();
    const pricingType = String(body.pricingType || body.pricing?.type || "fixed").trim();
    const amount = body.price ?? body.pricing?.amount;
    const numericAmount = amount === undefined || amount === "" ? undefined : Number(amount);

    if (!title || !description || !category) {
      return res.status(400).json({ success: false, message: "Service title, description, and category are required." });
    }
    if (!["fixed", "startingFrom", "customQuote"].includes(pricingType)) {
      return res.status(400).json({ success: false, message: "Choose a valid pricing type." });
    }
    if (pricingType !== "customQuote" && (!Number.isFinite(numericAmount) || numericAmount < 0)) {
      return res.status(400).json({ success: false, message: "Enter a valid service price." });
    }

    const service = await Service.create({
      providerId: req.user._id,
      title,
      description,
      category,
      pricing: {
        type: pricingType,
        amount: pricingType === "customQuote" ? undefined : numericAmount,
        currency: String(body.currency || "NGN").toUpperCase(),
      },
      durationMinutes: body.durationMinutes ? Number(body.durationMinutes) : undefined,
      images: Array.isArray(body.images) ? body.images.filter((image) => image?.url && image?.publicId).slice(0, 6) : [],
      location: body.location || provider?.serviceArea || undefined,
      availability: body.availability || undefined,
      status: canPublish && ["active", "paused", "draft", "archived"].includes(body.status)
        ? body.status
        : canPublish
          ? "active"
          : "draft",
    });

    return res.status(201).json({
      success: true,
      message: canPublish ? "Service published successfully." : "Service saved as a draft.",
      service,
    });
  } catch (error) {
    console.error("Create provider service error:", error);
    return res.status(500).json({ success: false, message: "Unable to create your service right now." });
  }
}

async function updateProviderService(req, res) {
  try {
    const provider = await ProviderProfile.findOne({ userId: req.user._id }).lean();
    const canPublish =
      provider?.status === "active" &&
      provider?.verificationStatus === "verified";

    const service = await Service.findOne({ _id: req.params.serviceId, providerId: req.user._id });
    if (!service) return res.status(404).json({ success: false, message: "Service not found." });

    const body = req.body || {};
    if (body.title !== undefined) service.title = String(body.title).trim();
    if (body.description !== undefined) service.description = String(body.description).trim();
    if (body.category !== undefined) service.category = String(body.category).trim();
    if (body.pricingType !== undefined || body.pricing !== undefined || body.price !== undefined) {
      const pricingType = String(body.pricingType || body.pricing?.type || service.pricing.type).trim();
      const amount = body.price ?? body.pricing?.amount ?? service.pricing.amount;
      const numericAmount = amount === undefined || amount === "" ? undefined : Number(amount);
      if (!["fixed", "startingFrom", "customQuote"].includes(pricingType)) {
        return res.status(400).json({ success: false, message: "Choose a valid pricing type." });
      }
      if (pricingType !== "customQuote" && (!Number.isFinite(numericAmount) || numericAmount < 0)) {
        return res.status(400).json({ success: false, message: "Enter a valid service price." });
      }
      service.pricing = {
        type: pricingType,
        amount: pricingType === "customQuote" ? undefined : numericAmount,
        currency: String(body.currency || service.pricing.currency || "NGN").toUpperCase(),
      };
    }
    if (body.durationMinutes !== undefined) service.durationMinutes = body.durationMinutes ? Number(body.durationMinutes) : undefined;
    if (Array.isArray(body.images)) service.images = body.images.filter((image) => image?.url && image?.publicId).slice(0, 6);
    if (body.location !== undefined) service.location = body.location;
    if (body.availability !== undefined) service.availability = body.availability;
    if (body.status !== undefined && ["active", "paused", "draft", "archived"].includes(body.status)) {
      service.status = canPublish ? body.status : "draft";
    }
    if (!canPublish) service.status = "draft";

    await service.save();
    return res.json({ success: true, message: "Service updated successfully.", service });
  } catch (error) {
    console.error("Update provider service error:", error);
    return res.status(500).json({ success: false, message: "Unable to update your service right now." });
  }
}

module.exports.createProviderService = createProviderService;
module.exports.updateProviderService = updateProviderService;

async function getProviderBookings(req, res) {
  try {
    const providerId = req.user._id;
    const bookings = await Booking.find({ providerId })
      .sort({ scheduledDate: 1, scheduledTime: 1 })
      .populate("buyerId", "firstName lastName avatar createdAt")
      .populate("serviceId", "title description images")
      .lean();

    const now = new Date();
    const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const nextMonthStart = new Date(now.getFullYear(), now.getMonth() + 1, 1);

    const active = bookings.filter((booking) => !["cancelled", "declined"].includes(booking.status));
    const upcoming = active.filter((booking) => new Date(booking.scheduledDate) >= now);
    const completed = bookings.filter((booking) => booking.status === "completed");
    const cancelled = bookings.filter((booking) => ["cancelled", "declined"].includes(booking.status));

    const inMonth = (booking) => {
      const date = new Date(booking.scheduledDate);
      return date >= currentMonthStart && date < nextMonthStart;
    };

    return res.json({
      success: true,
      data: {
        summary: {
          total: active.filter(inMonth).length,
          upcoming: upcoming.filter(inMonth).length,
          completed: completed.filter(inMonth).length,
          cancelled: cancelled.filter(inMonth).length,
        },
        bookings: bookings.map((booking) => ({
          id: booking._id,
          scheduledDate: booking.scheduledDate,
          scheduledTime: booking.scheduledTime,
          status: booking.status,
          amount: booking.priceSnapshot?.amount || 0,
          currency: booking.priceSnapshot?.currency || "NGN",
          notes: booking.notes || "",
          customer: {
            id: booking.buyerId?._id || null,
            name: [booking.buyerId?.firstName, booking.buyerId?.lastName].filter(Boolean).join(" ") || "Customer",
            initials: initials(booking.buyerId),
            avatar: booking.buyerId?.avatar?.url || null,
            memberSince: booking.buyerId?.createdAt || null,
          },
          service: {
            id: booking.serviceId?._id || null,
            title: booking.serviceId?.title || "Service",
            description: booking.serviceId?.description || "",
            image: booking.serviceId?.images?.find((image) => image.isPrimary)?.url || booking.serviceId?.images?.[0]?.url || null,
          },
        })),
        generatedAt: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error("Provider bookings error:", error);
    return res.status(500).json({ success: false, message: "Unable to load your bookings right now." });
  }
}
module.exports.getProviderBookings = getProviderBookings;



async function getProviderCapabilities(req, res) {
  try {
    const userId = req.user._id;
    const [provider, store] = await Promise.all([
      ProviderProfile.findOne({ userId }).select("status verificationStatus applicationSubmittedAt reviewedAt reviewNote").lean(),
      StoreProfile.findOne({ userId }).select("status storeName slug verificationStatus applicationSubmittedAt onboardingStatus onboardingData").lean(),
    ]);
    return res.json({
      success: true,
      data: {
        service: provider ? { exists: true, status: provider.status, verificationStatus: provider.verificationStatus, applicationSubmittedAt: provider.applicationSubmittedAt || null, reviewedAt: provider.reviewedAt || null, reviewNote: provider.reviewNote || "" } : { exists: false, status: "not_started", verificationStatus: null },
        product: store ? {
          exists: true,
          status: store.status,
          storeName: store.storeName,
          slug: store.slug,
          verificationStatus: store.verificationStatus || null,
          applicationSubmittedAt: store.applicationSubmittedAt || null,
          onboardingStatus: store.onboardingStatus || (store.applicationSubmittedAt ? "submitted" : "in_progress"),
        } : { exists: false, status: "not_started" },
      },
    });
  } catch (error) {
    console.error("Provider capability lookup error:", error);
    return res.status(500).json({ success: false, message: "Unable to check your provider setup right now." });
  }
}

module.exports.getProviderCapabilities = getProviderCapabilities;

async function getProviderOnboardingDraft(req, res) {
  try {
    const provider = await ProviderProfile.findOne({ userId: req.user._id }).lean();
    if (!provider) {
      return res.json({ success: true, data: { exists: false, formData: null } });
    }
    return res.json({
      success: true,
      data: {
        exists: true,
        status: provider.status,
        verificationStatus: provider.verificationStatus,
        applicationSubmittedAt: provider.applicationSubmittedAt || null,
        formData: provider.onboardingData || {},
      },
    });
  } catch (error) {
    console.error("Provider onboarding draft lookup error:", error);
    return res.status(500).json({ success: false, message: "Unable to load your provider onboarding progress right now." });
  }
}

module.exports.getProviderOnboardingDraft = getProviderOnboardingDraft;


async function getSellerOnboardingDraft(req, res) {
  try {
    const store = await StoreProfile.findOne({ userId: req.user._id }).lean();
    if (!store) {
      return res.json({ success: true, data: { exists: false, formData: null } });
    }
    return res.json({
      success: true,
      data: {
        exists: true,
        status: store.status,
        verificationStatus: store.verificationStatus,
        applicationSubmittedAt: store.applicationSubmittedAt || null,
        onboardingStatus: store.onboardingStatus || (store.applicationSubmittedAt ? "submitted" : "in_progress"),
        formData: store.onboardingData || {},
      },
    });
  } catch (error) {
    console.error("Seller onboarding draft lookup error:", error);
    return res.status(500).json({ success: false, message: "Unable to load your seller onboarding progress right now." });
  }
}

module.exports.getSellerOnboardingDraft = getSellerOnboardingDraft;


async function submitSellerOnboarding(req, res) {
  try {
    const userId = req.user._id;
    const isDraft = Boolean(req.body?.draft);
    const input = req.body?.formData || req.body || {};
    const storeName = input.businessName || [input.firstName, input.lastName].filter(Boolean).join(" ") || "Matchet Store";
    const baseSlug = storeName.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "matchet-store";
    const existing = await StoreProfile.findOne({ slug: { $regex: new RegExp("^" + baseSlug + "(?:-[0-9]+)?$") }, userId: { $ne: userId } }).sort({ createdAt: -1 }).lean();
    const slug = existing ? baseSlug + "-" + String(Date.now()).slice(-6) : baseSlug;
    const productName = input.productName || "";
    const hasInitialProduct = Boolean(productName && input.productPrice !== undefined && input.productPrice !== "");
    if (hasInitialProduct) {
      const productImages = (Array.isArray(input.productImages) ? input.productImages : [])
        .filter((image) => image && image.url && image.publicId)
        .slice(0, 5)
        .map((image, index) => ({
          url: image.url,
          publicId: image.publicId,
          isPrimary: index === 0,
        }));

      await Product.findOneAndUpdate(
        { sellerId: userId, "details.onboardingSource": "seller-onboarding" },
        {
          $set: {
            name: productName,
            description: input.productDesc || productName,
            shortDescription: String(input.productDesc || productName).slice(0, 200),
            category: input.productCat || input.businessCat || "Other",
            price: Number(input.productPrice) || 0,
            inventory: Number(input.productStock) || 0,
            sku: input.productSku || undefined,
            images: productImages,
            status: "draft",
            details: {
              onboardingSource: "seller-onboarding",
              condition: input.productCondition || "New",
              comparePrice: Number(input.productComparePrice) || 0,
              tags: Array.isArray(input.productTags)
                ? input.productTags
                : String(input.productTags || "").split(",").map((tag) => tag.trim()).filter(Boolean),
            },
          },
        },
        { upsert: true, new: true, runValidators: true }
      );
    }

    const normalizedLocation = String(input.location || "").toLowerCase() === "lagos-nigeria"
      ? { city: "Lagos", state: "Lagos", country: "Nigeria" }
      : {
          city: input.location || "",
          state: input.businessState || "",
          country: input.businessCountry || "",
        };

    // Do not send an empty GeoJSON coordinates array to MongoDB's 2dsphere index.
    if (!normalizedLocation.city && !normalizedLocation.state && !normalizedLocation.country) {
      delete normalizedLocation.coordinates;
    }

    const storeUpdate = {
      $set: {
        storeName,
        slug,
        description: input.businessDesc || input.sellerBio || "",
        location: normalizedLocation,
        contact: {
          phone: [input.businessPhoneCountryCode, input.businessPhoneNumber].filter(Boolean).join(" ") || [input.countryCode, input.phoneNumber].filter(Boolean).join(" "),
          email: input.email || req.user.email,
        },
        category: input.businessCat || input.businessCategory || input.category || "",
        languages: input.languages || [],
        businessDetails: {
          ...(input.businessDetails || {}),
          sellerType: input.sellerType || "",
          registrationNumber: input.businessReg || "",
          address: input.businessAddress || "",
          description: input.businessDesc || "",
        },
        shippingPolicies: input.shippingPolicies || {
          option: input.shippingOptions || "",
          regions: input.shippingRegions || "",
          fee: input.shippingFee || "",
          feeAmount: input.shippingFeeAmount || "",
          processingTime: input.processingTime || "",
          notes: input.shippingNotes || "",
        },
        socialLinks: input.socialLinks || {},
        payoutDetails: input.payoutDetails || input.bankDetails || {
          bankName: input.bankName || "",
          accountNumber: input.accountNumber || "",
          accountName: input.accountName || "",
          accountType: input.accountType || "",
          bvn: input.bvn || "",
          tin: input.tin || "",
        },
        onboardingData: input,
        onboardingStatus: isDraft ? "in_progress" : "submitted",
        logo: input.businessLogo?.url
          ? { url: input.businessLogo.url, publicId: input.businessLogo.publicId || "" }
          : undefined,
        verificationStatus: "pending",
        status: "draft",
        applicationSubmittedAt: isDraft ? null : new Date(),
        reviewedAt: isDraft ? undefined : null,
        reviewNote: isDraft ? undefined : "",
      },
      $setOnInsert: { userId },
    };

    if (!normalizedLocation.coordinates) {
      storeUpdate.$unset = { "location.coordinates": 1 };
    }

    const store = await StoreProfile.findOneAndUpdate(
      { userId },
      storeUpdate,
      { upsert: true, new: true, runValidators: true },
    );

    const userUpdates = {
      firstName: input.firstName || req.user.firstName,
      lastName: input.lastName || req.user.lastName,
      email: input.email || req.user.email,
      phone: [input.countryCode, input.phoneNumber].filter(Boolean).join(" ") || req.user.phone || "",
      location: normalizedLocation,
      ...(isDraft ? {} : { "capabilities.seller": true }),
    };
    if (input.profileImage?.url) {
      userUpdates.avatar = {
        url: input.profileImage.url,
        publicId: input.profileImage.publicId || "",
      };
    }
    await User.findByIdAndUpdate(
      userId,
      {
        $set: userUpdates,
        $unset: { "location.coordinates": 1 },
      },
    );
    return res.status(201).json({
      success: true,
      message: isDraft ? "Your seller onboarding progress has been saved." : "Your seller application has been submitted for review.",
      data: {
        id: store._id,
        status: store.status,
        verificationStatus: store.verificationStatus,
        applicationSubmittedAt: store.applicationSubmittedAt,
        onboardingStatus: store.onboardingStatus || null,
        formData: store.onboardingData || {},
      },
    });
  } catch (error) {
    console.error("Seller onboarding submission error:", error);
    return res.status(500).json({
      success: false,
      message: process.env.NODE_ENV === "production"
        ? "Unable to save your seller onboarding progress right now."
        : (error?.message || "Unable to save your seller onboarding progress right now."),
    });
  }
}

module.exports.submitSellerOnboarding = submitSellerOnboarding;
async function getSellerSettings(req,res){try{const [user,store]=await Promise.all([User.findById(req.user._id).select("email phone isActive role preferences createdAt lastLoginAt").lean(),StoreProfile.findOne({userId:req.user._id}).lean()]);if(!user)return res.status(404).json({success:false,message:"Account not found."});const p=user.preferences||{};return res.json({success:true,data:{account:{email:user.email||"",phone:user.phone||"",isActive:Boolean(user.isActive),role:user.role||"",createdAt:user.createdAt},notifications:p.notifications||{email:true,sms:false,marketing:true},payments:{method:store?.payoutDetails||{},verificationStatus:store?.verificationStatus||null},store:{name:store?.storeName||"",category:store?.category||"",description:store?.description||"",status:store?.status||"not_started",verificationStatus:store?.verificationStatus||null},shipping:store?.shippingPolicies||{},privacy:p.privacy||{profileVisible:true,dataSharing:false},platform:{...(p.platform||{}),dashboardView:"Seller dashboard",theme:"Light",language:"English"},security:{lastLoginAt:user.lastLoginAt||null}}})}catch(error){console.error("Seller settings error:",error);return res.status(500).json({success:false,message:"Unable to load your seller settings right now."})}}
async function updateSellerSettingsPreferences(req,res){try{const input=req.body||{};const user=await User.findById(req.user._id).select("preferences");if(!user)return res.status(404).json({success:false,message:"Account not found."});const allowed=["notifications","privacy","platform"];const prefs=user.preferences&&typeof user.preferences==="object"?user.preferences:{};for(const section of allowed){if(input[section]&&typeof input[section]==="object"&&!Array.isArray(input[section]))prefs[section]={...(prefs[section]||{}),...input[section]};}user.preferences=prefs;await user.save();return res.json({success:true,data:{notifications:prefs.notifications||{},privacy:prefs.privacy||{},platform:prefs.platform||{}}})}catch(error){console.error("Seller settings update error:",error);return res.status(500).json({success:false,message:"Unable to save your settings right now."})}}
async function updateSellerSettingsStore(req,res){try{const store=await StoreProfile.findOne({userId:req.user._id});if(!store)return res.status(404).json({success:false,message:"Seller store not found."});const input=req.body||{};if(input.store)Object.assign(store,{storeName:input.store.name??store.storeName,category:input.store.category??store.category,description:input.store.description??store.description});if(input.shipping!==undefined)store.shippingPolicies=input.shipping;if(input.payments!==undefined)store.payoutDetails=input.payments;await store.save();return res.json({success:true,message:"Store settings saved.",data:{store,shipping:store.shippingPolicies,payments:store.payoutDetails}})}catch(error){console.error("Seller store settings update error:",error);return res.status(400).json({success:false,message:error.message})}}

async function getPublicSellerStore(req,res){try{const key=String(req.params.slug||"").toLowerCase();const store=await StoreProfile.findOne({slug:key,status:"active",verificationStatus:"verified"}).lean();if(!store)return res.status(404).json({success:false,message:"Store not found or not publicly available."});const user=await User.findById(store.userId).select("firstName lastName avatar createdAt").lean();const products=await Product.find({sellerId:store.userId,status:"active",inventory:{$gte:0}}).sort({createdAt:-1}).lean();const ids=products.map(p=>p._id);const reviews=ids.length?await Review.find({productId:{$in:ids},status:"published"}).select("productId rating").lean():[];const productStats={};reviews.forEach(r=>{const id=String(r.productId);productStats[id]??={sum:0,count:0};productStats[id].sum+=Number(r.rating||0);productStats[id].count++});const total=reviews.length;const average=total?Number((reviews.reduce((a,r)=>a+Number(r.rating||0),0)/total).toFixed(1)):0;const mapped=products.map(p=>{const rs=productStats[String(p._id)]||{sum:0,count:0};return{id:p._id,name:p.name,description:p.description,shortDescription:p.shortDescription||"",category:p.category,price:p.price,inventory:p.inventory,image:p.images?.find(i=>i.isPrimary)?.url||p.images?.[0]?.url||null,rating:rs.count?Number((rs.sum/rs.count).toFixed(1)):0,reviewCount:rs.count}});return res.json({success:true,data:{store:{name:store.storeName,slug:store.slug,description:store.description||"",category:store.category||"",location:store.location||{},logo:store.logo||null,banner:store.banner||null,verificationStatus:store.verificationStatus},owner:{name:[user?.firstName,user?.lastName].filter(Boolean).join(" "),avatar:user?.avatar?.url||null,memberSince:user?.createdAt},stats:{products:mapped.length,rating:average,reviews:total,followers:null},products:mapped,generatedAt:new Date().toISOString()}})}catch(error){console.error("Public seller store error:",error);return res.status(500).json({success:false,message:"Unable to load this store right now."})}}
async function getSellerProfile(req,res){try{const sellerId=req.user._id;const [user,store,products]=await Promise.all([User.findById(sellerId).select("firstName lastName email phone avatar location createdAt").lean(),StoreProfile.findOne({userId:sellerId}).lean(),Product.find({sellerId}).select("_id name status").lean()]);if(!user)return res.status(404).json({success:false,message:"Account not found."});const reviews=products.length?await Review.find({productId:{$in:products.map(p=>p._id)},status:"published"}).select("rating").lean():[];const rating=reviews.length?Number((reviews.reduce((s,r)=>s+r.rating,0)/reviews.length).toFixed(1)):0;const checks=[{key:"photo",label:"Add profile photo",complete:Boolean(user.avatar?.url)},{key:"storeName",label:"Add store name",complete:Boolean(store?.storeName)},{key:"bio",label:"Add a short bio",complete:Boolean(store?.description)},{key:"location",label:"Add location",complete:Boolean(store?.location?.city)},{key:"product",label:"Add at least one product",complete:products.length>0},{key:"identity",label:"Verify your identity",complete:store?.verificationStatus==="verified"},{key:"social",label:"Add social links (optional)",complete:Boolean(store?.socialLinks&&Object.values(store.socialLinks).some(Boolean)),optional:true}];const required=checks.filter(c=>!c.optional);const complete=required.filter(c=>c.complete).length;return res.json({success:true,data:{user:{id:user._id,name:[user.firstName,user.lastName].filter(Boolean).join(" "),firstName:user.firstName,lastName:user.lastName,email:user.email,phone:user.phone||"",avatar:user.avatar?.url||null,location:user.location||null,memberSince:user.createdAt},store:store?{id:store._id,storeName:store.storeName,slug:store.slug,description:store.description||"",category:store.category||"",languages:store.languages||[],logo:store.logo||null,banner:store.banner||null,location:store.location||null,contact:store.contact||null,verificationStatus:store.verificationStatus,status:store.status,applicationSubmittedAt:store.applicationSubmittedAt,reviewedAt:store.reviewedAt,reviewNote:store.reviewNote||"",socialLinks:store.socialLinks||{},businessDetails:store.businessDetails||{},shippingPolicies:store.shippingPolicies||{},payoutDetails:store.payoutDetails||{},onboardingData:store.onboardingData||{},ratingAverage:rating,reviewCount:reviews.length}:null,productsCount:products.length,completeness:{percentage:Math.round(complete/required.length*100),checks},generatedAt:new Date().toISOString()}})}catch(error){console.error("Seller profile error:",error);return res.status(500).json({success:false,message:"Unable to load your seller profile right now."})}}
async function updateSellerProfile(req,res){try{const store=await StoreProfile.findOne({userId:req.user._id});if(!store)return res.status(404).json({success:false,message:"Seller profile not found."});const input=req.body||{};["storeName","description","category","languages","location","contact","socialLinks","businessDetails","shippingPolicies","payoutDetails","logo","banner"].forEach(k=>{if(input[k]!==undefined)store[k]=input[k]});if(input.storeName&&input.storeName!==store.storeName){const base=input.storeName.toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"")||"matchet-store";store.slug=base+"-"+String(Date.now()).slice(-6)}await store.save();return res.json({success:true,message:"Store profile updated.",data:store})}catch(error){console.error("Seller profile update error:",error);return res.status(400).json({success:false,message:error.message})}}

async function getSellerDashboard(req, res) {
  try {
    const sellerId = req.user._id;
    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const nextMonthStart = new Date(now.getFullYear(), now.getMonth() + 1, 1);
    const previousMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);

    const [store, products, orders, recentMessages] = await Promise.all([
      StoreProfile.findOne({ userId: sellerId }).lean(),
      Product.find({ sellerId }).sort({ createdAt: -1 }).lean(),
      Order.find({ "items.sellerId": sellerId }).sort({ createdAt: -1 }).limit(100).populate("buyerId", "firstName lastName avatar createdAt").lean(),
      Message.find({ $or: [{ senderId: sellerId }, { receiverId: sellerId }] }).sort({ createdAt: -1 }).limit(20).populate("senderId", "firstName lastName avatar").populate("receiverId", "firstName lastName avatar").lean(),
    ]);

    const sellerItems = (order) => order.items.filter((item) => String(item.sellerId) === String(sellerId));
    const sellerAmount = (order) => sellerItems(order).reduce((sum, item) => sum + (Number(item.priceSnapshot) || 0) * (Number(item.quantity) || 0), 0);
    const monthOrders = orders.filter((order) => order.createdAt >= monthStart && order.createdAt < nextMonthStart);
    const previousOrders = orders.filter((order) => order.createdAt >= previousMonthStart && order.createdAt < monthStart);
    const customerIds = new Set(monthOrders.map((order) => String(order.buyerId?._id || order.buyerId)).filter(Boolean));
    const previousCustomerIds = new Set(previousOrders.map((order) => String(order.buyerId?._id || order.buyerId)).filter(Boolean));
    const salesThisMonth = monthOrders.reduce((sum, order) => sum + sellerAmount(order), 0);
    const salesPreviousMonth = previousOrders.reduce((sum, order) => sum + sellerAmount(order), 0);
    const orderChange = previousOrders.length ? Math.round(((monthOrders.length - previousOrders.length) / previousOrders.length) * 100) : null;
    const customerChange = previousCustomerIds.size ? Math.round(((customerIds.size - previousCustomerIds.size) / previousCustomerIds.size) * 100) : null;
    const salesChange = salesPreviousMonth ? Math.round(((salesThisMonth - salesPreviousMonth) / salesPreviousMonth) * 100) : null;

    const productIds = products.map((product) => product._id);
    const reviews = productIds.length ? await Review.find({ productId: { $in: productIds }, status: "published" }).lean() : [];
    const averageRating = reviews.length ? Number((reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length).toFixed(1)) : 0;

    const unreadMessages = await Message.countDocuments({ receiverId: sellerId, readAt: null });
    const applicationPending = store?.verificationStatus === "pending";
    const applicationRejected = store?.verificationStatus === "rejected";

    const recentOrders = monthOrders.slice(0, 5).map((order) => {
      const items = sellerItems(order);
      const first = items[0];
      return {
        id: order._id,
        product: { name: first?.nameSnapshot || "Product", image: first?.imageSnapshot || null },
        customer: { id: order.buyerId?._id || null, name: [order.buyerId?.firstName, order.buyerId?.lastName].filter(Boolean).join(" ") || "Customer", avatar: order.buyerId?.avatar?.url || null },
        date: order.createdAt,
        quantity: items.reduce((sum, item) => sum + item.quantity, 0),
        status: order.orderStatus,
        amount: sellerAmount(order),
        currency: "NGN",
      };
    });

    const recent = recentMessages.slice(0, 5).map((message) => {
      const other = String(message.senderId?._id) === String(sellerId) ? message.receiverId : message.senderId;
      return { id: message._id, customer: { name: [other?.firstName, other?.lastName].filter(Boolean).join(" ") || "Customer", initials: [other?.firstName, other?.lastName].filter(Boolean).map((v) => v[0]).join("").slice(0,2).toUpperCase(), avatar: other?.avatar?.url || null }, content: message.content || "Attachment", createdAt: message.createdAt, unread: String(message.receiverId?._id) === String(sellerId) && !message.readAt };
    });

    return res.json({
      success: true,
      data: {
        store: store ? { name: store.storeName, status: store.status, verificationStatus: store.verificationStatus, applicationSubmittedAt: store.applicationSubmittedAt, reviewedAt: store.reviewedAt, reviewNote: store.reviewNote || "" } : null,
        application: { pending: applicationPending, rejected: applicationRejected },
        kpis: {
          orders: { value: monthOrders.length, change: orderChange },
          customers: { value: customerIds.size, change: customerChange },
          sales: { value: salesThisMonth, change: salesChange, currency: "NGN" },
          rating: { value: averageRating, reviewCount: reviews.length },
        },
        products: { total: products.length, active: products.filter((p) => p.status === "active").length, draft: products.filter((p) => p.status === "draft").length, outOfStock: products.filter((p) => p.status === "outOfStock").length },
        recentOrders,
        recentMessages: recent,
        unreadMessages,
        generatedAt: now.toISOString(),
      },
    });
  } catch (error) {
    console.error("Seller dashboard error:", error);
    return res.status(500).json({ success: false, message: process.env.NODE_ENV === "production" ? "Unable to load your seller dashboard right now." : error.message });
  }
}

module.exports.getSellerDashboard = getSellerDashboard;
module.exports.getSellerProfile = getSellerProfile;
module.exports.updateSellerProfile = updateSellerProfile;


async function getSellerOrders(req, res) {
  try {
    const sellerId = req.user._id;
    const {
      status = "all",
      product = "all",
      search = "",
      sort = "newest",
      page = 1,
      limit = 10,
      startDate,
      endDate,
    } = req.query;

    const orders = await Order.find({ "items.sellerId": sellerId })
      .sort({ createdAt: -1 })
      .populate("buyerId", "firstName lastName email phone avatar")
      .lean();

    const normalizedSearch = String(search).trim().toLowerCase();
    let filtered = orders.map((order) => {
      const sellerItems = order.items.filter((item) => String(item.sellerId) === String(sellerId));
      const amount = sellerItems.reduce((sum, item) => sum + (Number(item.priceSnapshot) || 0) * (Number(item.quantity) || 0), 0);
      return {
        ...order,
        sellerItems,
        sellerAmount: amount,
      };
    }).filter((order) => {
      if (status !== "all" && order.orderStatus !== status) return false;
      if (product !== "all" && !order.sellerItems.some((item) => String(item.productId) === String(product))) return false;
      if (startDate && new Date(order.createdAt) < new Date(startDate)) return false;
      if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        if (new Date(order.createdAt) > end) return false;
      }
      if (!normalizedSearch) return true;
      const customer = [order.buyerId?.firstName, order.buyerId?.lastName, order.buyerId?.email].filter(Boolean).join(" ").toLowerCase();
      const products = order.sellerItems.map((item) => item.nameSnapshot).join(" ").toLowerCase();
      return customer.includes(normalizedSearch) || products.includes(normalizedSearch) || String(order._id).toLowerCase().includes(normalizedSearch);
    });

    filtered.sort((a, b) => sort === "oldest"
      ? new Date(a.createdAt) - new Date(b.createdAt)
      : sort === "amountHigh"
        ? b.sellerAmount - a.sellerAmount
        : sort === "amountLow"
          ? a.sellerAmount - b.sellerAmount
          : new Date(b.createdAt) - new Date(a.createdAt));

    const stats = {
      all: filtered.length,
      processing: filtered.filter((o) => o.orderStatus === "processing").length,
      shipped: filtered.filter((o) => o.orderStatus === "shipped").length,
      delivered: filtered.filter((o) => o.orderStatus === "delivered").length,
      cancelled: filtered.filter((o) => o.orderStatus === "cancelled").length,
    };

    const pageNumber = Math.max(Number(page) || 1, 1);
    const pageSize = Math.min(Math.max(Number(limit) || 10, 1), 50);
    const total = filtered.length;
    const start = (pageNumber - 1) * pageSize;
    const paged = filtered.slice(start, start + pageSize);

    const data = paged.map((order) => ({
      id: order._id,
      orderNumber: "#" + String(order._id).slice(-6).toUpperCase(),
      items: order.sellerItems.map((item) => ({
        productId: item.productId,
        name: item.nameSnapshot,
        quantity: item.quantity,
        unitPrice: item.priceSnapshot,
        image: item.imageSnapshot || null,
        total: item.priceSnapshot * item.quantity,
      })),
      customer: {
        id: order.buyerId?._id || null,
        name: [order.buyerId?.firstName, order.buyerId?.lastName].filter(Boolean).join(" ") || "Customer",
        email: order.buyerId?.email || "",
        phone: order.buyerId?.phone || "",
        avatar: order.buyerId?.avatar?.url || null,
      },
      createdAt: order.createdAt,
      amount: order.sellerAmount,
      status: order.orderStatus,
      paymentStatus: order.paymentStatus,
      paymentReference: order.paymentReference || null,
      shippingAddress: order.shippingAddress || {},
      canShip: ["pending", "confirmed", "processing"].includes(order.orderStatus),
      canCancel: !["delivered", "cancelled"].includes(order.orderStatus),
    }));

    return res.json({
      success: true,
      data: {
        orders: data,
        stats,
        products: [...new Map(orders.flatMap((order) => order.items.filter((item) => String(item.sellerId) === String(sellerId)).map((item) => [String(item.productId), { id: item.productId, name: item.nameSnapshot }]))).values()],
        pagination: { page: pageNumber, limit: pageSize, total, pages: Math.max(Math.ceil(total / pageSize), 1) },
      },
    });
  } catch (error) {
    console.error("Seller orders error:", error);
    return res.status(500).json({ success: false, message: process.env.NODE_ENV === "production" ? "Unable to load your orders right now." : error.message });
  }
}


async function updateSellerOrderStatus(req, res) {
  try {
    const sellerId = req.user._id;
    const { status } = req.body || {};
    const allowed = ["pending", "confirmed", "processing", "shipped", "delivered", "cancelled"];
    if (!allowed.includes(status)) return res.status(400).json({ success: false, message: "Invalid order status." });
    const order = await Order.findOne({ _id: req.params.orderId, "items.sellerId": sellerId });
    if (!order) return res.status(404).json({ success: false, message: "Order not found." });
    const previous = order.orderStatus;
    order.orderStatus = status;
    if (!Array.isArray(order.statusHistory)) order.statusHistory = [];
    if (previous !== status) order.statusHistory.push({ status, note: "Updated by seller", at: new Date() });
    await order.save();
    return res.json({ success: true, data: { id: order._id, status: order.orderStatus, statusHistory: order.statusHistory } });
  } catch (error) {
    console.error("Seller order status error:", error);
    return res.status(500).json({ success: false, message: "Unable to update this order right now." });
  }
}
async function getSellerOrderDetail(req,res){try{const sellerId=req.user._id;const order=await Order.findOne({_id:req.params.orderId,"items.sellerId":sellerId}).populate("buyerId","firstName lastName email phone avatar createdAt").lean();if(!order)return res.status(404).json({success:false,message:"Order not found."});const items=order.items.filter(i=>String(i.sellerId)===String(sellerId));const amount=items.reduce((a,i)=>a+Number(i.priceSnapshot||0)*Number(i.quantity||0),0);return res.json({success:true,data:{id:order._id,orderNumber:"#"+String(order._id).slice(-6).toUpperCase(),createdAt:order.createdAt,status:order.orderStatus,paymentStatus:order.paymentStatus,paymentReference:order.paymentReference||null,items:items.map(i=>({productId:i.productId,name:i.nameSnapshot,quantity:i.quantity,unitPrice:i.priceSnapshot,total:Number(i.priceSnapshot)*Number(i.quantity),image:i.imageSnapshot||null})),amount,subtotal:amount,shippingFee:Number(order.deliveryFee||0),total:amount+Number(order.deliveryFee||0),customer:{id:order.buyerId?._id,name:[order.buyerId?.firstName,order.buyerId?.lastName].filter(Boolean).join(" ")||"Customer",email:order.buyerId?.email||"",phone:order.buyerId?.phone||"",avatar:order.buyerId?.avatar?.url||null,createdAt:order.buyerId?.createdAt},shippingAddress:order.shippingAddress||{},statusHistory:order.statusHistory||[],notes:order.sellerNotes||"",canShip:["pending","confirmed","processing"].includes(order.orderStatus),canCancel:!["delivered","cancelled"].includes(order.orderStatus)}})}catch(error){console.error("Seller order detail error:",error);return res.status(500).json({success:false,message:"Unable to load this order right now."})}}
async function addSellerOrderNote(req,res){try{const order=await Order.findOne({_id:req.params.orderId,"items.sellerId":req.user._id});if(!order)return res.status(404).json({success:false,message:"Order not found."});order.sellerNotes=String(req.body.note||"").trim();await order.save();return res.json({success:true,data:{notes:order.sellerNotes}})}catch(error){return res.status(400).json({success:false,message:error.message})}}

module.exports.getSellerOrderDetail = getSellerOrderDetail;
module.exports.updateSellerOrderStatus = updateSellerOrderStatus;
module.exports.addSellerOrderNote = addSellerOrderNote;
module.exports.getSellerOrders = getSellerOrders;
module.exports.updateSellerOrderStatus = updateSellerOrderStatus;


async function getSellerProducts(req, res) {
  try {
    const sellerId = req.user._id;
    const { status = "all", category = "all", search = "", sort = "newest" } = req.query;
    const products = await Product.find({ sellerId }).sort({ createdAt: -1 }).lean();
    const orders = await Order.find({ "items.sellerId": sellerId }).lean();
    const orderCounts = {};
    orders.forEach((order) => order.items.filter(i => String(i.sellerId) === String(sellerId)).forEach(i => {
      const id = String(i.productId);
      orderCounts[id] = (orderCounts[id] || 0) + Number(i.quantity || 0);
    }));
    let filtered = products.filter(p => {
      if (status !== "all" && p.status !== status) return false;
      if (category !== "all" && p.category !== category) return false;
      const q = String(search).trim().toLowerCase();
      return !q || p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q) || p.category.toLowerCase().includes(q);
    });
    filtered.sort((a,b) => sort === "oldest" ? new Date(a.createdAt)-new Date(b.createdAt) : sort === "priceHigh" ? b.price-a.price : sort === "priceLow" ? a.price-b.price : new Date(b.createdAt)-new Date(a.createdAt));
    const totalViews = 0;
    const mapped = filtered.map(p => ({
      id:p._id, name:p.name, description:p.description, shortDescription:p.shortDescription||"", details:p.details||{}, category:p.category, price:p.price, inventory:p.inventory,
      status:p.status, orders:orderCounts[String(p._id)] || 0, createdAt:p.createdAt, updatedAt:p.updatedAt,
      images:p.images||[], image:p.images?.find(i=>i.isPrimary)?.url || p.images?.[0]?.url || null, createdAt:p.createdAt
    }));
    return res.json({success:true,data:{
      products:mapped,
      categories:[...new Set(products.map(p=>p.category).filter(Boolean))],
      stats:{active:products.filter(p=>p.status==="active").length,outOfStock:products.filter(p=>p.status==="outOfStock"||p.inventory===0).length,drafts:products.filter(p=>p.status==="draft").length,total:products.length,totalOrders:Object.values(orderCounts).reduce((a,b)=>a+b,0),views:totalViews},
      generatedAt:new Date().toISOString()
    }});
  } catch(error){ console.error("Seller products error:",error); return res.status(500).json({success:false,message:process.env.NODE_ENV==="production"?"Unable to load your products right now.":error.message});}
}
async function createSellerProduct(req,res){
  try {
    const {name,description,shortDescription="",category,price,inventory=0,images=[],location,status="draft",details={},sku}=req.body;
    if(!name||!description||!category||price===undefined) return res.status(400).json({success:false,message:"Name, description, category and price are required."});
    const store=await StoreProfile.findOne({userId:req.user._id}).select("status verificationStatus").lean();
    const canPublish=store?.status==="active" && store?.verificationStatus==="verified";
    const safeStatus=canPublish ? status : "draft";
    const product=await Product.create({sellerId:req.user._id,name,description,shortDescription,category,price:Number(price),inventory:Number(inventory),images,status:safeStatus,location,details,sku});
    return res.status(201).json({success:true,data:product});
  } catch(error){return res.status(400).json({success:false,message:error.message});}
}
async function updateSellerProduct(req,res){
  try {
    const product=await Product.findOne({_id:req.params.productId,sellerId:req.user._id});
    if(!product)return res.status(404).json({success:false,message:"Product not found."});
    const allowed=["name","description","shortDescription","category","price","inventory","images","location","status","details"];
    const store=await StoreProfile.findOne({userId:req.user._id}).select("status verificationStatus").lean();
    const canPublish=store?.status==="active" && store?.verificationStatus==="verified";
    allowed.forEach(k=>{if(req.body[k]!==undefined)product[k]=req.body[k]});
    if (!canPublish) product.status="draft";
    await product.save();
    return res.json({success:true,data:product});
  } catch(error){return res.status(400).json({success:false,message:error.message});}
}
module.exports.getSellerProducts=getSellerProducts;
module.exports.createSellerProduct=createSellerProduct;
module.exports.updateSellerProduct=updateSellerProduct;


async function getSellerEarnings(req, res) {
  try {
    const sellerId = req.user._id;
    const now = new Date();
    const start = new Date(now.getFullYear(), now.getMonth(), 1);
    const previous = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const [orders, payouts, store] = await Promise.all([
      Order.find({ "items.sellerId": sellerId }).sort({ createdAt: -1 }).limit(500).lean(),
      Payout.find({ providerId: sellerId }).sort({ createdAt: -1 }).limit(200).lean(),
      StoreProfile.findOne({ userId: sellerId }).lean(),
    ]);
    const sellerAmount = order => order.items.filter(i => String(i.sellerId) === String(sellerId)).reduce((sum,i) => sum + (Number(i.priceSnapshot)||0)*(Number(i.quantity)||0), 0);
    const eligible = orders.filter(o => o.paymentStatus === "paid" && o.orderStatus !== "cancelled" && o.orderStatus !== "pending");
    const thisMonth = eligible.filter(o => o.createdAt >= start);
    const previousMonth = eligible.filter(o => o.createdAt >= previous && o.createdAt < start);
    const sales = thisMonth.reduce((sum,o)=>sum+sellerAmount(o),0);
    const previousSales = previousMonth.reduce((sum,o)=>sum+sellerAmount(o),0);
    const months = Array.from({length:6},(_,i)=>{ const d=new Date(now.getFullYear(),now.getMonth()-5+i,1); const n=new Date(d.getFullYear(),d.getMonth()+1,1); return {label:d.toLocaleString("en-NG",{month:"short",year:"numeric"}),amount:eligible.filter(o=>o.createdAt>=d&&o.createdAt<n).reduce((sum,o)=>sum+sellerAmount(o),0)}; });
    const paidOut=payouts.filter(p=>p.status==="completed").reduce((sum,p)=>sum+Number(p.amount||0),0);
    const pendingPayout=payouts.filter(p=>["pending","processing"].includes(p.status)).reduce((sum,p)=>sum+Number(p.amount||0),0);
    const productIds=[...new Set(eligible.flatMap(o=>o.items.filter(i=>String(i.sellerId)===String(sellerId)).map(i=>String(i.productId))))];
    const products=productIds.length?await Product.find({_id:{$in:productIds}}).select("category").lean():[];
    const categoryById={}; products.forEach(p=>categoryById[String(p._id)]=p.category||"Other");
    const categoryTotals={}; eligible.forEach(o=>o.items.filter(i=>String(i.sellerId)===String(sellerId)).forEach(i=>{const c=categoryById[String(i.productId)]||"Other";categoryTotals[c]=(categoryTotals[c]||0)+(Number(i.priceSnapshot)||0)*(Number(i.quantity)||0);}));
    const totalAll=eligible.reduce((sum,o)=>sum+sellerAmount(o),0);
    const breakdown=Object.entries(categoryTotals).sort((a,b)=>b[1]-a[1]).map(([name,amount])=>({name,amount,percent:totalAll?Math.round(amount/totalAll*100):0}));
    const orderTransactions=eligible.slice(0,8).map(o=>({id:o._id,date:o.createdAt,type:"Order",description:"Order #"+String(o._id).slice(-6).toUpperCase(),amount:sellerAmount(o),status:o.orderStatus==="delivered"?"Completed":"Pending"}));
    const payoutTransactions=payouts.slice(0,8).map(p=>({id:p._id,date:p.paidAt||p.createdAt,type:"Payout",description:"Payout to "+(p.method?.bankName||"bank")+" (•••• "+(p.method?.accountLast4||"----")+")",amount:Number(p.amount||0),status:p.status==="completed"?"Completed":p.status}));
    const bank=store?.payoutDetails||store?.onboardingData?.bankInformation||store?.onboardingData?.bankDetails||{};
    return res.json({success:true,data:{kpis:{sales,orders:thisMonth.length,paidOut,pendingPayout,pendingOrders:eligible.filter(o=>o.orderStatus!=="delivered").length,salesChange:previousSales?Math.round((sales-previousSales)/previousSales*100):null},chart:months,breakdown,transactions:[...orderTransactions,...payoutTransactions].sort((a,b)=>new Date(b.date)-new Date(a.date)).slice(0,8),payoutDetails:{bankName:bank.bankName||bank.bank||"",accountLast4:String(bank.accountNumber||bank.accountNo||"").slice(-4),verified:Boolean(bank.bankName||bank.bank)}}});
  } catch(error){ console.error("Seller earnings error:",error); return res.status(500).json({success:false,message:process.env.NODE_ENV==="production"?"Unable to load your earnings right now.":error.message}); }
}
module.exports.getSellerEarnings = getSellerEarnings;


async function getSellerReviews(req, res) {
  try {
    const sellerId = req.user._id;
    const products = await Product.find({ sellerId }).select("_id name images").lean();
    const productIds = products.map(p => p._id);
    if (!productIds.length) return res.json({ success:true, data:{ summary:{averageRating:0,totalReviews:0,ratingBreakdown:[5,4,3,2,1].map(r=>({rating:r,count:0,percentage:0})),positivePercentage:0,responseRate:null}, reviews:[], generatedAt:new Date().toISOString() } });
    const productMap = new Map(products.map(p=>[String(p._id),p]));
    const reviews = await Review.find({ productId:{ $in:productIds }, status:"published" })
      .sort({createdAt:-1}).populate("reviewerId","firstName lastName avatar").select("reviewerId productId rating comment createdAt").lean();
    const totalReviews=reviews.length;
    const averageRating=totalReviews?Number((reviews.reduce((s,r)=>s+Number(r.rating||0),0)/totalReviews).toFixed(1)):0;
    const ratingBreakdown=[5,4,3,2,1].map(r=>{const count=reviews.filter(x=>x.rating===r).length;return {rating:r,count,percentage:totalReviews?Math.round(count/totalReviews*100):0};});
    const positive=totalReviews?Math.round((reviews.filter(r=>r.rating>=4).length/totalReviews)*100):0;
    return res.json({success:true,data:{summary:{averageRating,totalReviews,positivePercentage:positive,responseRate:null,ratingBreakdown},reviews:reviews.map(r=>{const p=productMap.get(String(r.productId));return {id:r._id,rating:r.rating,comment:r.comment||"",createdAt:r.createdAt,customer:{id:r.reviewerId?._id||null,name:[r.reviewerId?.firstName,r.reviewerId?.lastName].filter(Boolean).join(" ")||"Customer",initials:initials(r.reviewerId),avatar:r.reviewerId?.avatar?.url||null},product:{id:r.productId,name:p?.name||"Product",image:p?.images?.find(i=>i.isPrimary)?.url||p?.images?.[0]?.url||null}};}) ,generatedAt:new Date().toISOString()}});
  } catch(error){ console.error("Seller reviews error:",error); return res.status(500).json({success:false,message:"Unable to load your reviews right now."}); }
}
module.exports.getSellerReviews = getSellerReviews;

module.exports.getSellerSettings=getSellerSettings;
module.exports.updateSellerSettingsPreferences=updateSellerSettingsPreferences;
module.exports.updateSellerSettingsStore=updateSellerSettingsStore;

module.exports.getPublicSellerStore=getPublicSellerStore;
