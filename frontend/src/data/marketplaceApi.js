import marketplaceData from "./marketplaceMock.json";

const COLLECTION_KEYS = {
  featured: "featured",
  picked: "picked",
  popularNearby: "popularNearby",
  continueExploring: "continueExploring",
};

const byId = new Map(
  [...marketplaceData.products, ...marketplaceData.services].map((item) => [
    item.id,
    item,
  ]),
);

function resolveItems(ids = []) {
  return ids.map((id) => byId.get(id)).filter(Boolean);
}

function simulateApiResponse(value) {
  return new Promise((resolve) => {
    window.setTimeout(() => resolve(value), 150);
  });
}

export async function getMarketplaceData() {
  return simulateApiResponse({
    products: [...marketplaceData.products],
    services: [...marketplaceData.services],
  });
}

export async function getProductCollection() {
  return simulateApiResponse([...(marketplaceData.products ?? [])]);
}

export async function getMarketplaceCollection(collection) {
  const key = COLLECTION_KEYS[collection];

  if (!key) {
    throw new Error(`Unknown marketplace collection: ${collection}`);
  }

  return simulateApiResponse(
    resolveItems(marketplaceData.collections[key]),
  );
}

export async function searchMarketplace({
  type = "all",
  query = "",
  location = "",
} = {}) {
  const normalizedQuery = query.trim().toLowerCase();
  const normalizedLocation = location.trim().toLowerCase();

  let items = [...marketplaceData.products, ...marketplaceData.services];

  if (type === "products") {
    items = marketplaceData.products;
  }

  if (type === "services") {
    items = marketplaceData.services;
  }

  items = items.filter((item) => {
    const matchesQuery =
      !normalizedQuery ||
      [item.title, item.category, item.seller, item.location]
        .join(" ")
        .toLowerCase()
        .includes(normalizedQuery);

    const matchesLocation =
      !normalizedLocation ||
      item.location.toLowerCase() === normalizedLocation;

    return matchesQuery && matchesLocation;
  });

  return simulateApiResponse(items);
}


export async function getProviderCollection(collection = "featured") {
  const ids = marketplaceData.providerCollections?.[collection] ?? [];
  const providers = new Map(
    (marketplaceData.providers ?? []).map((provider) => [provider.id, provider]),
  );

  return simulateApiResponse(
    ids.map((id) => providers.get(id)).filter(Boolean),
  );
}


export async function getCategoryCollections() {
  return simulateApiResponse(marketplaceData.categories ?? {
    featured: [],
    interests: [],
    exploreMore: [],
  });
}


export async function getServiceCollection(collection = "featured") {
  const ids = marketplaceData.serviceCollections?.[collection] ?? [];
  const services = new Map(
    (marketplaceData.services ?? []).map((service) => [service.id, service]),
  );

  return simulateApiResponse(ids.map((id) => services.get(id)).filter(Boolean));
}


export async function getServiceCategoryCollections() {
  return simulateApiResponse(marketplaceData.serviceCategories ?? {
    featured: [],
    interests: [],
    exploreMore: [],
  });
}


export async function getServiceExperience() {
  const experience = marketplaceData.serviceExperience ?? {
    loggedOut: { eyebrow: "", title: "", subtitle: "", steps: [] },
    loggedIn: { eyebrow: "", title: "", subtitle: "", steps: [] },
    reassurance: [],
  };

  const upcomingBooking = marketplaceData.upcomingBooking ?? null;

  return simulateApiResponse({ experience, upcomingBooking });
}


export async function getServiceReviews() {
  return simulateApiResponse(marketplaceData.serviceReviews ?? {
    loggedOut: { eyebrow: "", title: "", accent: "", subtitle: "", reviews: [] },
    loggedIn: { eyebrow: "", title: "", accent: "", subtitle: "", reviews: [] },
  });
}


export async function getProductExperience() {
  return simulateApiResponse(marketplaceData.productExperience ?? {
    loggedOut: { eyebrow: "", title: "", accent: "", subtitle: "", steps: [] },
    loggedIn: { eyebrow: "", title: "", accent: "", subtitle: "", steps: [] },
  });
}
