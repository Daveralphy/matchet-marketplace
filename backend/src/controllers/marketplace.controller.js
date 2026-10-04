const mongoose = require("mongoose");
const Product = require("../models/Product");
const Service = require("../models/Service");
const ProviderProfile = require("../models/ProviderProfile");
const StoreProfile = require("../models/StoreProfile");
const Review = require("../models/Review");

const clean = (value) => String(value ?? "").trim();

function imageUrl(image) {
  if (typeof image === "string") return image;
  if (!image) return "";
  if (image.url && /^https?:\/\//i.test(String(image.url))) return image.url;
  if (image.publicId && process.env.CLOUDINARY_CLOUD_NAME) {
    const resourceType = image.resourceType || "image";
    return `https://res.cloudinary.com/${process.env.CLOUDINARY_CLOUD_NAME}/${resourceType}/upload/${image.publicId}`;
  }
  return "";
}

function locationLabel(location) {
  if (!location) return "";
  return [location.city, location.state, location.country].filter(Boolean).join(", ");
}

function primaryImage(images = []) {
  return images.find((image) => image?.isPrimary)?.url || images[0]?.url || "";
}

function formatPrice(amount, currency = "NGN") {
  if (amount === undefined || amount === null) return "";
  try {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency,
      maximumFractionDigits: 2,
    }).format(amount);
  } catch {
    return `${currency} ${amount}`;
  }
}

function productResponse(product) {
  const seller = product.sellerId || {};
  const store = product.storeProfile || {};

  return {
    id: product._id.toString(),
    type: "product",
    title: product.name,
    name: product.name,
    description: product.description,
    category: product.category,
    price: formatPrice(product.price),
    priceValue: product.price,
    currency: "NGN",
    inventory: product.inventory,
    availability: product.inventory > 0 ? "In stock" : "Out of stock",
    status: product.status,
    location: locationLabel(product.location || store.location),
    seller: store.storeName || [seller.firstName, seller.lastName].filter(Boolean).join(" ") || seller.username || "Seller",
    sellerVerified: store.verificationStatus === "verified",
    sellerType: store?.businessDetails?.sellerType || product?.details?.sellerType || store.category || "Seller",
    condition: product.details?.condition || "",
    brand: product.details?.brand || "",
    material: product.details?.material || "",
    color: product.details?.color || "",
    fastDelivery: Boolean(store?.shippingPolicies?.fastDelivery || product?.details?.fastDelivery),
    sellerId: seller._id?.toString?.() || product.sellerId?.toString?.(),
    storeId: store._id?.toString?.() || null,
    image: primaryImage(product.images),
    images: (product.images || []).map((image) => ({ ...image, url: imageUrl(image) })).filter((image) => image.url),
    reviews: Number(product.reviewCount || 0),
    rating: Number(product.ratingAverage || 0),
    createdAt: product.createdAt,
    updatedAt: product.updatedAt,
  };
}

function serviceResponse(service) {
  const provider = service.providerId || {};
  const profile = service.providerProfile || {};
  const amount = service.pricing?.amount;

  return {
    id: service._id.toString(),
    type: "service",
    title: service.title,
    name: service.title,
    description: service.description,
    category: service.category,
    price: service.pricing?.type === "customQuote"
      ? "Custom quote"
      : formatPrice(amount, service.pricing?.currency || "NGN"),
    priceValue: amount ?? null,
    pricing: service.pricing,
    availability: service.status === "active" ? "Available" : service.status,
    status: service.status,
    location: locationLabel(service.location || profile.serviceArea),
    seller: profile.businessName || [provider.firstName, provider.lastName].filter(Boolean).join(" ") || provider.username || "Provider",
    sellerVerified: profile.verificationStatus === "verified",
    providerVerified: profile.verificationStatus === "verified",
    providerId: provider._id?.toString?.() || service.providerId?.toString?.(),
    providerProfileId: profile._id?.toString?.() || null,
    image: primaryImage(service.images),
    images: (service.images || []).map((image) => ({ ...image, url: imageUrl(image) })).filter((image) => image.url),
    reviews: Number(service.reviewCount || 0),
    rating: Number(service.ratingAverage || 0),
    createdAt: service.createdAt,
    updatedAt: service.updatedAt,
  };
}

async function attachProductMarketplaceData(products) {
  if (!products.length) return products;
  const sellerIds = [...new Set(products.map((product) => String(product.sellerId?._id || product.sellerId)).filter(Boolean))];
  const stores = await StoreProfile.find({ userId: { $in: sellerIds } })
    .select("userId storeName location category verificationStatus")
    .lean();
  const storeByUser = new Map(stores.map((store) => [String(store.userId), store]));
  const reviewRows = await Review.find({ productId: { $in: products.map((product) => product._id) }, status: "published" })
    .select("productId rating")
    .lean();
  const stats = new Map();
  reviewRows.forEach((review) => {
    const key = String(review.productId);
    const current = stats.get(key) || { sum: 0, count: 0 };
    current.sum += Number(review.rating || 0);
    current.count += 1;
    stats.set(key, current);
  });
  return products.map((product) => {
    const store = storeByUser.get(String(product.sellerId?._id || product.sellerId));
    const review = stats.get(String(product._id)) || { sum: 0, count: 0 };
    return { ...product, storeProfile: store, reviewCount: review.count, ratingAverage: review.count ? Number((review.sum / review.count).toFixed(1)) : 0 };
  });
}

async function attachServiceMarketplaceData(services) {
  if (!services.length) return services;
  const providerIds = [...new Set(services.map((service) => String(service.providerId?._id || service.providerId)).filter(Boolean))];
  const profiles = await ProviderProfile.find({ userId: { $in: providerIds } })
    .select("userId businessName serviceArea verificationStatus")
    .lean();
  const profileByUser = new Map(profiles.map((profile) => [String(profile.userId), profile]));
  const reviewRows = await Review.find({ serviceId: { $in: services.map((service) => service._id) }, status: "published" })
    .select("serviceId rating")
    .lean();
  const stats = new Map();
  reviewRows.forEach((review) => {
    const key = String(review.serviceId);
    const current = stats.get(key) || { sum: 0, count: 0 };
    current.sum += Number(review.rating || 0);
    current.count += 1;
    stats.set(key, current);
  });
  return services.map((service) => {
    const profile = profileByUser.get(String(service.providerId?._id || service.providerId));
    const review = stats.get(String(service._id)) || { sum: 0, count: 0 };
    return { ...service, providerProfile: profile, reviewCount: review.count, ratingAverage: review.count ? Number((review.sum / review.count).toFixed(1)) : 0 };
  });
}

async function findProducts(query = {}) {
  const products = await Product.find(query)
    .populate({ path: "sellerId", select: "firstName lastName username" })
    .sort({ createdAt: -1 })
    .lean();
  return attachProductMarketplaceData(products);
}

async function findServices(query = {}) {
  const services = await Service.find(query)
    .populate({ path: "providerId", select: "firstName lastName username" })
    .sort({ createdAt: -1 })
    .lean();
  return attachServiceMarketplaceData(services);
}

async function getProducts(req, res) {
  try {
    const approvedStores = await StoreProfile.find({
      status: "active",
      verificationStatus: "verified",
    }).select("userId").lean();
    const approvedSellerIds = approvedStores.map((store) => store.userId).filter(Boolean);
    const filter = {
      status: "active",
      sellerId: { $in: approvedSellerIds },
    };
    if (clean(req.query.category)) filter.category = clean(req.query.category);
    const products = await findProducts(filter);
    return res.json({ success: true, products: products.map(productResponse) });
  } catch (error) {
    console.error("Get products failed:", error);
    return res.status(500).json({ success: false, message: "Unable to load products right now." });
  }
}

async function getProductById(req, res) {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(404).json({ success: false, message: "Product not found." });
    }

    const products = await findProducts({ _id: req.params.id, status: "active" });
    const product = products[0];

    if (!product) return res.status(404).json({ success: false, message: "Product not found." });

    return res.json({ success: true, product: productResponse(product) });
  } catch (error) {
    console.error("Get product failed:", error);
    return res.status(500).json({ success: false, message: "Unable to load this product right now." });
  }
}

async function getProviders(req, res) {
  try {
    const profiles = await ProviderProfile.find({
      status: "active",
      verificationStatus: "verified",
    })
      .populate({ path: "userId", select: "firstName lastName username email avatar" })
      .sort({ createdAt: -1 })
      .lean();

    const providerIds = profiles.map((profile) => profile.userId?._id).filter(Boolean);
    const serviceCounts = providerIds.length
      ? await Service.aggregate([
          { $match: { providerId: { $in: providerIds }, status: "active" } },
          { $group: { _id: "$providerId", count: { $sum: 1 } } },
        ])
      : [];
    const countsByProvider = new Map(serviceCounts.map((row) => [String(row._id), row.count]));

    return res.json({
      success: true,
      providers: profiles.map((profile) => {
        const user = profile.userId || {};
        const name = profile.businessName || [user.firstName, user.lastName].filter(Boolean).join(" ") || user.username || "Provider";
        return {
          id: profile._id.toString(),
          userId: user._id?.toString?.() || null,
          name,
          businessName: profile.businessName || name,
          category: profile.categories?.[0] || "Services",
          categories: profile.categories || [],
          bio: profile.bio || "",
          experience: profile.experience || "",
          location: locationLabel(profile.serviceArea),
          rating: Number(profile.ratingAverage || 0),
          reviews: Number(profile.reviewCount || 0),
          listings: countsByProvider.get(String(user._id)) || 0,
          image: user.avatar?.url || "",
          verified: profile.verificationStatus === "verified",
          status: profile.status,
          createdAt: profile.createdAt,
        };
      }),
    });
  } catch (error) {
    console.error("Get providers failed:", error);
    return res.status(500).json({ success: false, message: "Unable to load service providers right now." });
  }
}

async function getServices(req, res) {
  try {
    const approvedProviders = await ProviderProfile.find({
      status: "active",
      verificationStatus: "verified",
    }).select("userId").lean();
    const approvedProviderIds = approvedProviders.map((profile) => profile.userId).filter(Boolean);
    const filter = {
      status: "active",
      providerId: { $in: approvedProviderIds },
    };
    if (clean(req.query.category)) filter.category = clean(req.query.category);
    const services = await findServices(filter);
    return res.json({ success: true, services: services.map(serviceResponse) });
  } catch (error) {
    console.error("Get services failed:", error);
    return res.status(500).json({ success: false, message: "Unable to load services right now." });
  }
}

async function getServiceById(req, res) {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(404).json({ success: false, message: "Service not found." });
    }

    const services = await findServices({ _id: req.params.id, status: "active" });
    const service = services[0];

    if (!service) return res.status(404).json({ success: false, message: "Service not found." });

    return res.json({ success: true, service: serviceResponse(service) });
  } catch (error) {
    console.error("Get service failed:", error);
    return res.status(500).json({ success: false, message: "Unable to load this service right now." });
  }
}

async function getProviderProfile(req, res) {
  const profile = await ProviderProfile.findOne({ userId: req.user._id }).lean();
  return res.json({ success: true, profile: profile || null });
}

async function getStoreProfile(req, res) {
  const profile = await StoreProfile.findOne({ userId: req.user._id }).lean();
  return res.json({ success: true, profile: profile || null });
}

function parseLocation(value) {
  if (!value) return undefined;
  if (typeof value === "object") return value;

  const parts = String(value).split(",").map((part) => part.trim()).filter(Boolean);
  return {
    city: parts[0] || "",
    state: parts[1] || "",
    country: parts[2] || "",
  };
}

async function upsertProviderProfile(req, res) {
  try {
    const body = req.body || {};
    const firstName = clean(body.firstName);
    const lastName = clean(body.lastName);
    const businessName = clean(body.businessName) || `${firstName} ${lastName}`.trim();

    if (!businessName) {
      return res.status(400).json({ success: false, message: "Provider name is required." });
    }

    const categories = Array.isArray(body.categories)
      ? body.categories.map(clean).filter(Boolean)
      : [clean(body.category)].filter(Boolean);

    const profile = await ProviderProfile.findOneAndUpdate(
      { userId: req.user._id },
      {
        userId: req.user._id,
        businessName,
        bio: clean(body.bio),
        categories,
        experience: clean(body.experience),
        serviceArea: parseLocation(body.serviceArea || body.location),
        status: "draft",
        verificationStatus: "pending",
      },
      { new: true, upsert: true, runValidators: true, setDefaultsOnInsert: true },
    );

    return res.status(200).json({
      success: true,
      message: "Provider profile saved and submitted for review.",
      profile,
    });
  } catch (error) {
    console.error("Save provider profile failed:", error);
    return res.status(500).json({ success: false, message: "Unable to save your provider profile right now." });
  }
}

function slugify(value) {
  return clean(value)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 70);
}

async function uniqueStoreSlug(name, userId) {
  const base = slugify(name) || `store-${userId.toString().slice(-8)}`;
  let slug = base;
  let suffix = 2;

  while (await StoreProfile.exists({ slug, userId: { $ne: userId } })) {
    slug = `${base}-${suffix++}`;
  }

  return slug;
}

async function upsertStoreProfile(req, res) {
  try {
    const body = req.body || {};
    const storeName = clean(body.storeName || body.businessName);

    if (!storeName) {
      return res.status(400).json({ success: false, message: "Store name is required." });
    }

    const slug = await uniqueStoreSlug(storeName, req.user._id);
    const profile = await StoreProfile.findOneAndUpdate(
      { userId: req.user._id },
      {
        userId: req.user._id,
        storeName,
        slug,
        description: clean(body.description || body.businessDesc),
        location: parseLocation(body.location || body.businessAddress),
        contact: {
          phone: clean(body.phone || body.businessPhone),
          email: clean(body.email || req.user.email).toLowerCase(),
        },
        status: "draft",
      },
      { new: true, upsert: true, runValidators: true, setDefaultsOnInsert: true },
    );

    return res.status(200).json({
      success: true,
      message: "Seller profile saved and submitted for review.",
      profile,
    });
  } catch (error) {
    console.error("Save seller profile failed:", error);
    return res.status(500).json({ success: false, message: "Unable to save your seller profile right now." });
  }
}

async function createProduct(req, res) {
  try {
    const body = req.body || {};
    const name = clean(body.name);
    const description = clean(body.description);
    const category = clean(body.category);
    const price = Number(body.price);
    const inventory = Number(body.inventory);

    if (!name || !description || !category || !Number.isFinite(price) || price < 0 || !Number.isInteger(inventory) || inventory < 0) {
      return res.status(400).json({
        success: false,
        message: "Name, description, category, price, and inventory are required.",
      });
    }

    const product = await Product.create({
      sellerId: req.user._id,
      name,
      description,
      category,
      price,
      inventory,
      images: Array.isArray(body.images) ? body.images : [],
      location: parseLocation(body.location),
      status: "draft",
    });

    return res.status(201).json({ success: true, message: "Product saved as a draft.", product });
  } catch (error) {
    console.error("Create product failed:", error);
    return res.status(500).json({ success: false, message: "Unable to save your product right now." });
  }
}

async function createService(req, res) {
  try {
    const body = req.body || {};
    const title = clean(body.title || body.name);
    const description = clean(body.description);
    const category = clean(body.category);
    const pricingType = clean(body.pricing?.type || body.pricingType) || "fixed";
    const amount = body.pricing?.amount ?? body.price;
    const numericAmount = amount === undefined || amount === "" ? undefined : Number(amount);
    const currency = clean(body.pricing?.currency || body.currency) || "NGN";

    if (!title || !description || !category || !["fixed", "startingFrom", "customQuote"].includes(pricingType)) {
      return res.status(400).json({ success: false, message: "Title, description, category, and valid pricing are required." });
    }

    if (pricingType !== "customQuote" && (!Number.isFinite(numericAmount) || numericAmount < 0)) {
      return res.status(400).json({ success: false, message: "A valid service price is required." });
    }

    const service = await Service.create({
      providerId: req.user._id,
      title,
      description,
      category,
      pricing: {
        type: pricingType,
        amount: pricingType === "customQuote" ? undefined : numericAmount,
        currency,
      },
      images: Array.isArray(body.images) ? body.images : [],
      location: parseLocation(body.location),
      availability: body.availability || undefined,
      status: "draft",
    });

    return res.status(201).json({ success: true, message: "Service saved as a draft.", service });
  } catch (error) {
    console.error("Create service failed:", error);
    return res.status(500).json({ success: false, message: "Unable to save your service right now." });
  }
}

module.exports = {
  getProducts,
  getProductById,
  getProviders,
  getServices,
  getServiceById,
  getProviderProfile,
  getStoreProfile,
  upsertProviderProfile,
  upsertStoreProfile,
  createProduct,
  createService,
};
