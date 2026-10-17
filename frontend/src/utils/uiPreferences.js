export const SUPPORTED_LANGUAGES = [
  { value: "English", label: "English", htmlLang: "en" },
  { value: "Spanish", label: "Español", htmlLang: "es" },
  { value: "French", label: "Français", htmlLang: "fr" },
];

const translations = {
  Spanish: {
    Home: "Inicio", Explore: "Explorar", Services: "Servicios", Products: "Productos",
    "Sell & Offer": "Vender y ofrecer", Notifications: "Notificaciones", "Mark all read": "Marcar todo como leído",
    View: "Ver", "Mark as Read": "Marcar como leído", Delete: "Eliminar", "No notifications yet.": "Aún no hay notificaciones.",
    "Account Settings": "Configuración de la cuenta", "Notification preferences": "Preferencias de notificación",
    Language: "Idioma", Appearance: "Apariencia", "Deactivate account": "Desactivar cuenta",
    "Choose the language used across your account.": "Elige el idioma de tu cuenta.",
    "Save language": "Guardar idioma", "Save appearance": "Guardar apariencia", Theme: "Tema",
    "Text size": "Tamaño del texto", Light: "Claro", Dark: "Oscuro", System: "Sistema",
    Small: "Pequeño", Medium: "Mediano", Large: "Grande",
  },
  French: {
    Home: "Accueil", Explore: "Explorer", Services: "Services", Products: "Produits",
    "Sell & Offer": "Vendre et proposer", Notifications: "Notifications", "Mark all read": "Tout marquer comme lu",
    View: "Voir", "Mark as Read": "Marquer comme lu", Delete: "Supprimer", "No notifications yet.": "Aucune notification pour le moment.",
    "Account Settings": "Paramètres du compte", "Notification preferences": "Préférences de notification",
    Language: "Langue", Appearance: "Apparence", "Deactivate account": "Désactiver le compte",
    "Choose the language used across your account.": "Choisissez la langue de votre compte.",
    "Save language": "Enregistrer la langue", "Save appearance": "Enregistrer l’apparence", Theme: "Thème",
    "Text size": "Taille du texte", Light: "Clair", Dark: "Sombre", System: "Système",
    Small: "Petit", Medium: "Moyen", Large: "Grand",
  },
};

export function translate(text, language = "English") {
  return translations[language]?.[text] || text;
}

export function applyAppearance(preferences = {}) {
  const theme = ["light", "dark", "system"].includes(preferences.theme) ? preferences.theme : "system";
  const textSize = ["small", "medium", "large"].includes(preferences.textSize) ? preferences.textSize : "medium";
  const resolvedTheme = theme === "system"
    ? (typeof window !== "undefined" && window.matchMedia?.("(prefers-color-scheme: dark)").matches ? "dark" : "light")
    : theme;
  if (typeof document !== "undefined") {
    document.documentElement.dataset.theme = resolvedTheme;
    document.documentElement.dataset.textSize = textSize;
  }
}

export function applyLanguage(language = "English") {
  const item = SUPPORTED_LANGUAGES.find((entry) => entry.value === language) || SUPPORTED_LANGUAGES[0];
  if (typeof document !== "undefined") document.documentElement.lang = item.htmlLang;
}
