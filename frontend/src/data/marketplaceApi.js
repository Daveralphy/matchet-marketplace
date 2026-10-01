import { getMarketplaceProducts, getMarketplaceServices, getMarketplaceProductById, getMarketplaceServiceById } from "../api/marketplace";
import { marketplaceContent } from "./marketplaceContent";

async function loadMarketplace() {
  const [products, services] = await Promise.all([
    getMarketplaceProducts(),
    getMarketplaceServices(),
  ]);
  return { products, services };
}

function withProductUiFields(product) {
  if (!product) return null;
  const gallery = Array.isArray(product.images)
    ? product.images.map((image) => typeof image === "string" ? image : image?.url).filter(Boolean)
    : [];
  return {
    ...product,
    title: product.title || product.name || "Untitled product",
    location: product.location || "",
    seller: product.seller || "Seller",
    gallery,
    reviews: Number(product.reviews ?? 0),
    rating: Number(product.rating ?? 0),
    stockCount: Number(product.inventory ?? 0),
    sellerVerified: Boolean(product.sellerVerified),
    sellerType: product.sellerType || "Seller",
    sellerInitial: product.sellerInitial || String(product.seller || "S").trim().charAt(0).toUpperCase(),
    image: product.image || gallery[0] || "",
    imageTone: product.imageTone || "bg-[#eef2ef]",
    categoryTone: product.categoryTone || "bg-[#e8f5ed] text-[#07863a]",
    avatarTone: product.avatarTone || "bg-[#dcefe5] text-[#07863a]",
    buyerProtection: product.buyerProtection || "Matchet buyer protection applies.",
    deliveryEstimate: product.deliveryEstimate || "Based on your location",
    deliveryFee: product.deliveryFee || "Calculated at checkout",
    pickupAvailable: product.pickupAvailable ?? false,
  };
}

function withServiceUiFields(service) {
  if (!service) return null;
  const gallery = Array.isArray(service.images)
    ? service.images.map((image) => typeof image === "string" ? image : image?.url).filter(Boolean)
    : [];
  return {
    ...service,
    title: service.title || service.name || "Untitled service",
    location: service.location || "",
    seller: service.seller || "Provider",
    gallery,
    reviews: Number(service.reviews ?? 0),
    rating: Number(service.rating ?? 0),
    sellerVerified: Boolean(service.sellerVerified),
    sellerInitial: service.sellerInitial || String(service.seller || "P").trim().charAt(0).toUpperCase(),
    image: service.image || gallery[0] || "",
    imageTone: service.imageTone || "bg-[#eef1ef]",
    avatarTone: service.avatarTone || "bg-[#e8f0f8] text-[#2682e9]",
    providerVerified: Boolean(service.providerVerified),
    responseTime: service.responseTime || "Provider response time available",
    bookingNotice: service.bookingNotice || "Check availability when booking",
    experience: service.experience || "Matchet service provider",
    serviceDuration: service.serviceDuration || "To be confirmed",
    cancellationPolicy: service.cancellationPolicy || "See booking terms",
  };
}

export async function getMarketplaceData() {
  const data = await loadMarketplace();
  return {
    products: data.products.map(withProductUiFields),
    services: data.services.map(withServiceUiFields),
  };
}

export async function getProductCollection() {
  const { products } = await loadMarketplace();
  return products.map(withProductUiFields);
}

export async function getMarketplaceCollection(collection) {
  const { products, services } = await loadMarketplace();
  const all = [...products.map(withProductUiFields), ...services.map(withServiceUiFields)];
  const size = Math.max(4, Math.min(8, all.length));
  switch (collection) {
    case "featured":
      return all.slice(0, size);
    case "picked":
      return all.slice(0, size);
    case "popularNearby":
      return all.filter((item) => item.location).slice(0, size);
    case "continueExploring":
      return all.slice(0, size);
    default:
      throw new Error(`Unknown marketplace collection: ${collection}`);
  }
}

export async function searchMarketplace({ type = "all", query = "", location = "" } = {}) {
  const { products, services } = await getMarketplaceData();
  let items = type === "products" ? products : type === "services" ? services : [...products, ...services];
  const normalizedQuery = query.trim().toLowerCase();
  const normalizedLocation = location.trim().toLowerCase();

  return items.filter((item) => {
    const haystack = [item.title, item.category, item.seller, item.location].filter(Boolean).join(" ").toLowerCase();
    const itemLocation = String(item.location || "").toLowerCase();
    return (!normalizedQuery || haystack.includes(normalizedQuery))
      && (!normalizedLocation || itemLocation === normalizedLocation);
  });
}

export async function getProviderCollection() {
  const { services } = await getMarketplaceData();
  const providers = new Map();
  services.forEach((service) => {
    const key = service.providerId || service.seller || service.id;
    if (!providers.has(key)) {
      providers.set(key, {
        id: key,
        name: service.seller || "Service Provider",
        category: service.category || "Services",
        rating: service.rating || 0,
        reviews: service.reviews || 0,
        location: service.location || "",
        listings: 1,
        initials: service.sellerInitial || String(service.seller || "P").trim().charAt(0).toUpperCase(),
        image: service.image || "",
        imageTone: service.imageTone || "bg-[#eef1ef]",
        logoTone: service.avatarTone || "bg-[#e8f0f8] text-[#2682e9]",
        sellerVerified: service.sellerVerified,
      });
    } else {
      providers.get(key).listings += 1;
    }
  });
  return [...providers.values()];
}

export async function getCategoryCollections() {
  return marketplaceContent.categories || {
    featured: [
      { id: "electronics", name: "Electronics", icon: "bag", tone: "green" },
      { id: "fashion", name: "Fashion", icon: "shirt", tone: "red" },
      { id: "home-living", name: "Home & Living", icon: "chair", tone: "yellow" },
      { id: "beauty-care", name: "Beauty & Care", icon: "lotus", tone: "pink" },
      { id: "computers", name: "Computers", icon: "laptop", tone: "purple" },
      { id: "automotive", name: "Automotive", icon: "car", tone: "blue" },
      { id: "services", name: "Services", icon: "tools", tone: "green" },
      { id: "more", name: "More Categories", icon: "dots", tone: "gray" },
    ],
    interests: [
      { id: "electronics", name: "Electronics", icon: "laptop", tone: "green" },
      { id: "computers", name: "Computers", icon: "monitor", tone: "purple" },
      { id: "design", name: "Design", icon: "paintbrush", tone: "orange" },
      { id: "gaming", name: "Gaming", icon: "gamepad", tone: "blue" },
    ],
    exploreMore: [
      { id: "fashion", name: "Fashion", icon: "shirt", tone: "red" },
      { id: "home-living", name: "Home & Living", icon: "chair", tone: "yellow" },
      { id: "beauty-care", name: "Beauty & Care", icon: "lotus", tone: "pink" },
      { id: "automotive", name: "Automotive", icon: "car", tone: "blue" },
    ],
  };
}

export async function getServiceCollection() {
  const { services } = await getMarketplaceData();
  return services;
}

export async function getServiceCategoryCollections() {
  return marketplaceContent.serviceCategories || {
    featured: [
      { id: "home-services", label: "Home Services", description: "Cleaning, plumbing, electrical and more.", icon: "home", tone: "green" },
      { id: "repairs-maintenance", label: "Repairs & Maintenance", description: "Phone, appliance, electronics and more.", icon: "tools", tone: "blue" },
      { id: "beauty-personal-care", label: "Beauty & Personal Care", description: "Hair, nails, skincare, spa and more.", icon: "beauty", tone: "pink" },
      { id: "professional-services", label: "Professional Services", description: "Consulting, legal, accounting and more.", icon: "briefcase", tone: "yellow" },
      { id: "events-catering", label: "Events & Catering", description: "Event planning, catering, decor and more.", icon: "calendar", tone: "purple" },
      { id: "cleaning-services", label: "Cleaning Services", description: "Home, office, deep cleaning and more.", icon: "tools", tone: "green" },
      { id: "automotive-services", label: "Automotive Services", description: "Repairs, maintenance, car care and more.", icon: "car", tone: "orange" },
      { id: "more-services", label: "More Services", description: "Explore all service categories.", icon: "more", tone: "gray" },
    ],
    interests: [
      { id: "home-services", label: "Home Services", description: "Cleaning, plumbing, electrical and more.", icon: "home", tone: "green" },
      { id: "repairs-maintenance", label: "Repairs & Maintenance", description: "Phone, appliance, electronics and more.", icon: "tools", tone: "blue" },
      { id: "beauty-personal-care", label: "Beauty & Personal Care", description: "Hair, nails, skincare, spa and more.", icon: "beauty", tone: "pink" },
      { id: "professional-services", label: "Professional Services", description: "Consulting, legal, accounting and more.", icon: "briefcase", tone: "yellow" },
    ],
    exploreMore: [
      { id: "events-catering", label: "Events & Catering", description: "Event planning, catering, decor and more.", icon: "calendar", tone: "purple" },
      { id: "cleaning-services", label: "Cleaning Services", description: "Home, office, deep cleaning and more.", icon: "tools", tone: "green" },
      { id: "automotive-services", label: "Automotive Services", description: "Repairs, maintenance, car care and more.", icon: "car", tone: "orange" },
      { id: "more-services", label: "More Services", description: "Explore all service categories.", icon: "more", tone: "gray" },
    ],
  };
}

export async function getServiceExperience() {
  return {
    experience: marketplaceContent.serviceExperience || { loggedOut: {}, loggedIn: {}, reassurance: [] },
    upcomingBooking: marketplaceContent.upcomingBooking || null,
  };
}

export async function getServiceReviews() {
  return marketplaceContent.serviceReviews || { loggedOut: { reviews: [] }, loggedIn: { reviews: [] } };
}

export async function getProductExperience() {
  return marketplaceContent.productExperience || { loggedOut: { steps: [] }, loggedIn: { steps: [] } };
}

export async function getProductById(id) {
  const product = await getMarketplaceProductById(id);
  return withProductUiFields(product);
}

export async function getRelatedProducts(productId) {
  const product = await getProductById(productId);
  if (!product) return [];
  const products = await getProductCollection();
  return products.filter((item) => item.id !== productId && item.category === product.category).slice(0, 4);
}

export async function getServiceById(id) {
  const service = await getMarketplaceServiceById(id);
  return withServiceUiFields(service);
}

export async function getRelatedServices(serviceId) {
  const service = await getServiceById(serviceId);
  if (!service) return [];
  const services = await getServiceCollection();
  return services.filter((item) => item.id !== serviceId && item.category === service.category).slice(0, 4);
}
