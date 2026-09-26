import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { getProductById } from "../data/marketplaceApi";

const CartContext = createContext(null);
const STORAGE_KEY = "matchet-cart";

function readStoredCart() {
  try {
    const value = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    return Array.isArray(value) ? value : [];
  } catch {
    return [];
  }
}

export function CartProvider({ children }) {
  const [items, setItems] = useState(readStoredCart);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const addItem = (product, quantity = 1) => {
    setItems((current) => {
      const existing = current.find((item) => item.id === product.id);
      if (existing) {
        return current.map((item) =>
          item.id === product.id
            ? { ...item, quantity: Math.min(item.quantity + quantity, product.stockCount || 99) }
            : item,
        );
      }
      return [...current, { ...product, quantity: Math.max(1, quantity) }];
    });
  };

  const updateQuantity = (id, quantity) => {
    setItems((current) =>
      current
        .map((item) => item.id === id ? { ...item, quantity: Math.max(1, Math.min(quantity, item.stockCount || 99)) } : item)
        .filter((item) => item.quantity > 0),
    );
  };

  const removeItem = (id) => setItems((current) => current.filter((item) => item.id !== id));
  const clearCart = () => setItems([]);

  const cartCount = useMemo(() => items.reduce((sum, item) => sum + item.quantity, 0), [items]);
  const subtotal = useMemo(() => items.reduce((sum, item) => sum + parsePrice(item.price) * item.quantity, 0), [items]);

  return (
    <CartContext.Provider value={{ items, cartCount, subtotal, addItem, updateQuantity, removeItem, clearCart }}>
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

export function formatNaira(value) {
  return new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN", maximumFractionDigits: 0 }).format(value).replace("NGN", "₦");
}

export async function getCheckoutProduct(id) {
  return getProductById(id);
}
