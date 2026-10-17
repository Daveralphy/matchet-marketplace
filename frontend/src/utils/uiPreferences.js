export const SUPPORTED_LANGUAGES = [
  { value: "English", label: "English", htmlLang: "en" },
  { value: "Spanish", label: "Español", htmlLang: "es" },
  { value: "French", label: "Français", htmlLang: "fr" },
];

const translations = {
  Spanish: {
    Home: "Inicio", Explore: "Explorar", Services: "Servicios", Products: "Productos", "Sell & Offer": "Vender y ofrecer",
    Notifications: "Notificaciones", "Mark all read": "Marcar todo como leído", View: "Ver", "Mark as Read": "Marcar como leído", Delete: "Eliminar", "No notifications yet.": "Aún no hay notificaciones.",
    "Account Settings": "Configuración de la cuenta", "Notification preferences": "Preferencias de notificación", Language: "Idioma", Appearance: "Apariencia", "Deactivate account": "Desactivar cuenta",
    "Manage the way Matchet works for you.": "Personaliza cómo funciona Matchet para ti.",
    "Choose which updates reach you by email and browser push.": "Elige qué avisos recibes por correo y notificaciones del navegador.",
    "Choose the language for the Matchet interface.": "Elige el idioma de la interfaz de Matchet.",
    "Adjust theme and text size for comfortable viewing.": "Ajusta el tema y el tamaño del texto.",
    "Review account closure requirements and deactivate your account.": "Revisa los requisitos y desactiva tu cuenta.",
    "Signed in as": "Sesión iniciada como", "Display language": "Idioma de visualización", "Save language": "Guardar idioma",
    "Choose the language used for Matchet's navigation and account settings.": "Elige el idioma de la navegación y la configuración de Matchet.",
    "Adjust the interface to suit your viewing preference.": "Ajusta la interfaz a tus preferencias de visualización.",
    Theme: "Tema", "Text size": "Tamaño del texto", Light: "Claro", Dark: "Oscuro", System: "Sistema", Small: "Pequeño", Medium: "Mediano", Large: "Grande", "Save appearance": "Guardar apariencia",
    "Bright background": "Fondo claro", "Low-light interface": "Interfaz para poca luz", "Follow your device": "Seguir tu dispositivo",
    "This is how your selected text size will feel across the interface.": "Así se verá el tamaño de texto seleccionado en la interfaz.",
    "Browser push": "Notificaciones del navegador", Orders: "Pedidos", Bookings: "Reservas", Payments: "Pagos", "Seller/provider applications": "Solicitudes de vendedores/proveedores", Messages: "Mensajes", Recommendations: "Recomendaciones", Security: "Seguridad",
    Email: "Correo electrónico", "Save preferences": "Guardar preferencias", "Essential transactional email cannot be turned off.": "Los correos esenciales de transacciones no se pueden desactivar.",
    "Order creation, fulfilment and delivery updates.": "Avisos de pedidos, preparación y entrega.",
    "Booking confirmations, changes and completion.": "Confirmaciones, cambios y finalización de reservas.",
    "Payment confirmations and payment status.": "Confirmaciones y estado de pagos.",
    "Application review and decisions.": "Revisión y decisiones de solicitudes.",
    "New message alerts. Optional email alerts can be unsubscribed.": "Avisos de mensajes nuevos. Puedes cancelar los correos opcionales.",
    "Personalized product and service suggestions.": "Sugerencias personalizadas de productos y servicios.",
    "Sign-in and account security alerts.": "Avisos de inicio de sesión y seguridad."
  },
  French: {
    Home: "Accueil", Explore: "Explorer", Services: "Services", Products: "Produits", "Sell & Offer": "Vendre et proposer",
    Notifications: "Notifications", "Mark all read": "Tout marquer comme lu", View: "Voir", "Mark as Read": "Marquer comme lu", Delete: "Supprimer", "No notifications yet.": "Aucune notification pour le moment.",
    "Account Settings": "Paramètres du compte", "Notification preferences": "Préférences de notification", Language: "Langue", Appearance: "Apparence", "Deactivate account": "Désactiver le compte",
    "Manage the way Matchet works for you.": "Personnalisez le fonctionnement de Matchet.",
    "Choose which updates reach you by email and browser push.": "Choisissez les alertes reçues par e-mail et notification du navigateur.",
    "Choose the language for the Matchet interface.": "Choisissez la langue de l’interface Matchet.",
    "Adjust theme and text size for comfortable viewing.": "Réglez le thème et la taille du texte.",
    "Review account closure requirements and deactivate your account.": "Consultez les conditions et désactivez votre compte.",
    "Signed in as": "Connecté en tant que", "Display language": "Langue d’affichage", "Save language": "Enregistrer la langue",
    "Choose the language used for Matchet's navigation and account settings.": "Choisissez la langue de navigation et des paramètres Matchet.",
    "Adjust the interface to suit your viewing preference.": "Adaptez l’interface à vos préférences d’affichage.",
    Theme: "Thème", "Text size": "Taille du texte", Light: "Clair", Dark: "Sombre", System: "Système", Small: "Petit", Medium: "Moyen", Large: "Grand", "Save appearance": "Enregistrer l’apparence",
    "Bright background": "Fond clair", "Low-light interface": "Interface en faible luminosité", "Follow your device": "Suivre votre appareil",
    "This is how your selected text size will feel across the interface.": "Voici un aperçu de la taille de texte choisie.",
    "Browser push": "Notifications du navigateur", Orders: "Commandes", Bookings: "Réservations", Payments: "Paiements", "Seller/provider applications": "Demandes de vendeur/prestataire", Messages: "Messages", Recommendations: "Recommandations", Security: "Sécurité",
    Email: "E-mail", "Save preferences": "Enregistrer les préférences", "Essential transactional email cannot be turned off.": "Les e-mails transactionnels essentiels ne peuvent pas être désactivés.",
    "Order creation, fulfilment and delivery updates.": "Alertes de commande, préparation et livraison.",
    "Booking confirmations, changes and completion.": "Confirmations, modifications et fin des réservations.",
    "Payment confirmations and payment status.": "Confirmations et état des paiements.",
    "Application review and decisions.": "Examen et décisions concernant les demandes.",
    "New message alerts. Optional email alerts can be unsubscribed.": "Alertes de nouveaux messages. Les e-mails facultatifs peuvent être désactivés.",
    "Personalized product and service suggestions.": "Suggestions personnalisées de produits et services.",
    "Sign-in and account security alerts.": "Alertes de connexion et de sécurité."
  }
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
