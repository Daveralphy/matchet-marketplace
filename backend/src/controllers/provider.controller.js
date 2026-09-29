const mongoose = require("mongoose");
const Booking = require("../models/Booking");
const Service = require("../models/Service");
const Review = require("../models/Review");
const Message = require("../models/Message");
const ProviderProfile = require("../models/ProviderProfile");
const Payout = require("../models/Payout");
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
