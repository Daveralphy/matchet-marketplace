import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { addCartItem, clearCart as clearCartRequest, getCart, removeCartItem, updateCartItem } from "../api/marketplace";
import { getProductById } from "../data/marketplaceApi";
import { useAuth } from "./AuthContext";

const CartContext = createContext(null);

function normalizeItems(items) {
  return Array.isArray(items) ? items : [];
}

export function CartProvider({ children }) {
  const { user, loading: authLoading } = useAuth();
  const [items, setItems] = useState([]);
  const [cartLoading, setCartLoading] = useState(true);

  const loadCart = useCallback(async () => {
    if (!user) {
      setItems([]);
      setCartLoading(false);
      return;
    }
    setCartLoading(true);
    try {
      const serverItems = await getCart();
      setItems(normalizeItems(serverItems));
    } catch (error) {
      setItems([]);
    } finally {
      setCartLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (!authLoading) loadCart();
  }, [authLoading, loadCart]);

  const addItem = useCallback(async (product, quantity = 1, sourceElement = null) => {
    if (!user) return { requiresAuth: true };
    const next = await addCartItem(product.id, quantity);
    setItems(normalizeItems(next));
    const image = product.image || product.images?.[0]?.url || product.images?.[0] || product.gallery?.[0] || "";
    if (sourceElement && image && typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("matchet:cart-add", { detail: { image, sourceRect: sourceElement.getBoundingClientRect() } }));
    }
    return { items: next };
  }, [user]);

  const updateQuantity = useCallback(async (id, quantity) => {
    if (!user) return;
    const next = await updateCartItem(id, quantity);
    setItems(normalizeItems(next));
  }, [user]);

  const removeItem = useCallback(async (id) => {
    if (!user) return;
    const next = await removeCartItem(id);
    setItems(normalizeItems(next));
  }, [user]);

  const clearCart = useCallback(async () => {
    if (!user) {
      setItems([]);
      return;
    }
    const next = await clearCartRequest();
    setItems(normalizeItems(next));
  }, [user]);

  const cartCount = useMemo(() => items.reduce((sum, item) => sum + Number(item.quantity || 0), 0), [items]);
  const subtotal = useMemo(() => items.reduce((sum, item) => sum + Number(item.priceValue ?? parsePrice(item.price)) * Number(item.quantity || 0), 0), [items]);

  return (
    <CartContext.Provider value={{ items, cartCount, subtotal, addItem, updateQuantity, removeItem, clearCart, cartLoading, refreshCart: loadCart }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const value = useContext(CartContext);
  if (!value) throw new Error("useCart must be used inside CartProvider");
  return value;
}

export function parsePrice(value) {
  return Number(String(value || "").replace(/[^0-9]/g, "")) || 0;
}

export function formatCurrency(value, currency = "NGN") {
  return new Intl.NumberFormat(undefined, { style: "currency", currency, maximumFractionDigits: 0 }).format(value);
}

export function formatNaira(value) {
  return formatCurrency(value, "NGN");
}

export async function getCheckoutProduct(id) {
  return getProductById(id);
}
