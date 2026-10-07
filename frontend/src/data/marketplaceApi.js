import { getMarketplaceProducts as fetchMarketplaceProducts, getMarketplaceServices, getMarketplaceProviders, getMarketplaceProductById, getMarketplaceServiceById } from "../api/marketplace";
import { marketplaceContent } from "./marketplaceContent";

async function loadMarketplace(location = "") {
  const results = await Promise.allSettled([
    fetchMarketplaceProducts({ location }),
    getMarketplaceServices({ location }),
    getMarketplaceProviders({ location }),
  ]);

  const products = results[0].status === "fulfilled" ? results[0].value : [];
  const services = results[1].status === "fulfilled" ? results[1].value : [];
  const providers = results[2].status === "fulfilled" ? results[2].value : [];

  if (results[0].status === "rejected") {
    console.error("Marketplace products loading failed:", results[0].reason);
  }
  if (results[1].status === "rejected") {
    console.error("Marketplace services loading failed:", results[1].reason);
  }
  if (results[2].status === "rejected") {
    console.error("Marketplace providers loading failed:", results[2].reason);
  }

  return {
    products: Array.isArray(products) ? products : [],
    services: Array.isArray(services) ? services : [],
    providers: Array.isArray(providers) ? providers : [],
  };
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
    image: gallery[0] || "",
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
    image: gallery[0] || "",
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

function withProviderUiFields(provider) {
  if (!provider) return null;
  const name = provider.name || "Provider";
  return {
    ...provider,
    type: "provider",
    name,
    title: name,
    businessName: provider.businessName || "",
    categories: Array.isArray(provider.categories) ? provider.categories : [],
    category: provider.category || provider.categories?.[0] || "Service provider",
    bio: provider.bio || "",
    experience: provider.experience || "",
    location: provider.location || "",
    rating: Number(provider.rating ?? 0),
    reviews: Number(provider.reviews ?? 0),
    listings: Number(provider.listings ?? 0),
    image: provider.image || "",
    verified: Boolean(provider.verified),
    initials: name.trim().split(/\\s+/).map((part) => part[0]).join("").slice(0, 2).toUpperCase() || "P",
    imageTone: provider.image ? "" : "bg-[#eef1ef]",
    logoTone: "bg-[#e8f0f8] text-[#2682e9]",
  };
}

export async function getMarketplaceData(location = "") {
  const data = await loadMarketplace(location);
  return {
    products: data.products.map(withProductUiFields).filter(Boolean),
    services: data.services.map(withServiceUiFields).filter(Boolean),
    providers: data.providers.map(withProviderUiFields).filter(Boolean),
  };
}

export async function getMarketplaceProducts({ sellerType = "", location = "" } = {}) {
  const products = await fetchMarketplaceProducts({ location });
  const normalized = Array.isArray(products) ? products.map(withProductUiFields).filter(Boolean) : [];
  if (!sellerType || sellerType === "Verified sellers") return normalized;
  const selected = String(sellerType).toLowerCase();
  return normalized.filter((product) => {
    const type = String(product.sellerType || "").toLowerCase();
    if (selected === "businesses") return type.includes("business");
    if (selected === "individuals") return type.includes("individual");
    return type === selected.replace(/s$/, "");
  });
}

export async function getProductCollection(location = "") {
  const { products } = await loadMarketplace(location);
  return products.map(withProductUiFields);
}

export async function getMarketplaceCollection(collection) {
  const { products, services } = await loadMarketplace();
  const productItems = products.map(withProductUiFields);
  const serviceItems = services.map(withServiceUiFields);
  const all = [...productItems, ...serviceItems];
  const size = Math.max(4, Math.min(8, all.length));
  switch (collection) {
    case "products":
      return productItems.slice(0, 8);
    case "services":
      return serviceItems.slice(0, 8);
    case "featured":
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
  const { products, services, providers } = await getMarketplaceData(location);
  let items = type === "products"
    ? products
    : type === "services"
      ? services
      : type === "providers"
        ? providers
        : [...products, ...services, ...providers];
  const normalizedQuery = query.trim().toLowerCase();
  const normalizedLocation = location.trim().toLowerCase();

  return items.filter((item) => {
    const haystack = [
      item.title,
      item.name,
      item.businessName,
      item.category,
      ...(item.categories || []),
      item.seller,
      item.location,
      item.bio,
      item.experience,
    ].filter(Boolean).join(" ").toLowerCase();
    const itemLocation = String(item.location || "").toLowerCase();
    const locationMatches = !normalizedLocation
      || itemLocation.includes(normalizedLocation)
      || normalizedLocation.includes(itemLocation)
      || normalizedLocation.split(",").map((part) => part.trim()).filter(Boolean).some((part) => itemLocation.includes(part));
    return (!normalizedQuery || haystack.includes(normalizedQuery))
      && locationMatches;
  });
}

export async function getProviderCollection(location = "") {
  const providers = await getMarketplaceProviders({ location });
  return providers.map((provider) => ({
    ...provider,
    initials: provider.name?.trim()?.charAt(0)?.toUpperCase() || "P",
    imageTone: provider.image ? "" : "bg-[#eef1ef]",
    logoTone: "bg-[#e8f0f8] text-[#2682e9]",
    sellerVerified: Boolean(provider.verified),
  }));
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

export async function getServiceCollection(location = "") {
  const { services } = await getMarketplaceData(location);
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
