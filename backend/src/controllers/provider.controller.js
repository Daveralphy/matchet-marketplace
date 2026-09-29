const mongoose = require("mongoose");
const Booking = require("../models/Booking");
const Service = require("../models/Service");
const Review = require("../models/Review");
const Message = require("../models/Message");
const ProviderProfile = require("../models/ProviderProfile");
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
    const [reviews, upcomingBookings, incomingMessages] = await Promise.all([
      serviceIds.length
        ? Review.find({
            serviceId: { $in: serviceIds },
            status: "published",
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
            change: null,
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