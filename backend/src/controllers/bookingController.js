const mongoose = require("mongoose");
const Booking = require("../models/Booking");
const Review = require("../models/Review");

async function listBuyerBookings(req, res) {
  try {
    const bookings = await Booking.find({ buyerId: req.user._id }).sort({ scheduledDate: 1, createdAt: -1 }).lean();
    return res.json({ success: true, bookings });
  } catch (error) {
    console.error("List buyer bookings failed:", error);
    return res.status(500).json({ success: false, message: "Unable to load your bookings." });
  }
}

async function getBuyerBooking(req, res) {
  try {
    const booking = await Booking.findOne({ _id: req.params.id, buyerId: req.user._id }).lean();
    if (!booking) return res.status(404).json({ success: false, message: "Booking not found." });
    return res.json({ success: true, booking });
  } catch (error) {
    return res.status(400).json({ success: false, message: "Invalid booking." });
  }
}

async function listBuyerBookingReviews(req, res) {
  try {
    const booking = await Booking.findOne({ _id: req.params.id, buyerId: req.user._id }).select("serviceId status").lean();
    if (!booking) return res.status(404).json({ success: false, message: "Booking not found." });
    const review = await Review.findOne({ reviewerId: req.user._id, serviceId: booking.serviceId }).select("serviceId rating comment createdAt").lean();
    return res.json({ success: true, review: review || null, eligible: booking.status === "completed" });
  } catch (error) {
    return res.status(400).json({ success: false, message: "Unable to load this booking review." });
  }
}

async function createBuyerBookingReview(req, res) {
  try {
    const booking = await Booking.findOne({ _id: req.params.id, buyerId: req.user._id }).lean();
    if (!booking) return res.status(404).json({ success: false, message: "Booking not found." });
    if (booking.status !== "completed") {
      return res.status(409).json({ success: false, message: "You can review this service after the booking is marked completed." });
    }
    const rating = Number(req.body?.rating);
    const comment = String(req.body?.comment || "").trim();
    if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
      return res.status(400).json({ success: false, message: "Choose a star rating from 1 to 5." });
    }
    if (comment.length > 2000) return res.status(400).json({ success: false, message: "Your review must be 2,000 characters or fewer." });
    const existing = await Review.findOne({ reviewerId: req.user._id, serviceId: booking.serviceId }).select("_id").lean();
    if (existing) return res.status(409).json({ success: false, message: "You have already reviewed this service." });
    const review = await Review.create({ reviewerId: req.user._id, serviceId: booking.serviceId, rating, comment, status: "published" });
    return res.status(201).json({ success: true, review: { id: review._id, serviceId: String(review.serviceId), rating: review.rating, comment: review.comment, createdAt: review.createdAt } });
  } catch (error) {
    if (error?.code === 11000) return res.status(409).json({ success: false, message: "You have already reviewed this service." });
    console.error("Buyer booking review failed:", error);
    return res.status(500).json({ success: false, message: "Unable to save your review right now." });
  }
}

module.exports = { listBuyerBookings, getBuyerBooking, listBuyerBookingReviews, createBuyerBookingReview };
