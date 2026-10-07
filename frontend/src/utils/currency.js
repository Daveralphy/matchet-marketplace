const COUNTRY_CURRENCY = {
  Nigeria: "NGN",
  "United States": "USD",
  "United States of America": "USD",
  Canada: "CAD",
  "United Kingdom": "GBP",
  England: "GBP",
  Scotland: "GBP",
  Wales: "GBP",
  Ireland: "EUR",
  Ghana: "GHS",
  Kenya: "KES",
  South Africa: "ZAR",
  Australia: "AUD",
  "New Zealand": "NZD",
  India: "INR",
  Germany: "EUR",
  France: "EUR",
  Italy: "EUR",
  Spain: "EUR",
  Netherlands: "EUR",
  Portugal: "EUR",
  Belgium: "EUR",
  Switzerland: "CHF",
};

export function currencyForCountry(country, fallback = "NGN") {
  return COUNTRY_CURRENCY[String(country || "").trim()] || fallback;
}

export function currencyForLocation(location, fallback = "NGN") {
  if (!location) return fallback;
  if (typeof location === "string") {
    const country = location.split(",").map((part) => part.trim()).filter(Boolean).at(-1);
    return currencyForCountry(country, fallback);
  }
  return currencyForCountry(location.country, fallback);
}

export const SUPPORTED_CURRENCIES = ["NGN","USD","GBP","EUR","CAD","AUD","GHS","KES","ZAR","INR","NZD","CHF"];
