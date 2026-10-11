import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { getSavedItems, removeSavedItem, saveItem } from "../api/marketplace";
import { useAuth } from "./AuthContext";

const SavedItemsContext = createContext(null);

export function SavedItemsProvider({ children }) {
  const { user, loading: authLoading } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadSavedItems = useCallback(async () => {
    if (!user) {
      setItems([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      setItems(await getSavedItems());
    } catch (error) {
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (!authLoading) loadSavedItems();
  }, [authLoading, loadSavedItems]);

  const getReferenceId = (value) => {
    if (value && typeof value === "object") return String(value._id || value.id || "");
    return String(value ?? "");
  };

  const isSaved = useCallback(
    (itemType, itemId) => items.some((item) => {
      const ref = itemType === "product" ? item.productId : item.serviceId;
      return item.itemType === itemType && getReferenceId(ref) === getReferenceId(itemId);
    }),
    [items],
  );

  const toggleSaved = useCallback(
    async (itemType, itemId) => {
      if (!user) return { requiresAuth: true };

      const existing = items.find((item) => {
        const ref = itemType === "product" ? item.productId : item.serviceId;
        return item.itemType === itemType && getReferenceId(ref) === getReferenceId(itemId);
      });

      try {
        if (existing) {
          await removeSavedItem(existing._id);
          setItems((current) => current.filter((item) => item._id !== existing._id));
          return { saved: false };
        }

        const item = await saveItem(
          itemType === "product"
            ? { itemType, productId: getReferenceId(itemId) }
            : { itemType, serviceId: getReferenceId(itemId) },
        );
        setItems((current) => {
          const exists = current.some((entry) => entry._id === item?._id)
            || current.some((entry) => {
              const ref = itemType === "product" ? entry.productId : entry.serviceId;
              return entry.itemType === itemType && getReferenceId(ref) === getReferenceId(itemId);
            });
          return exists ? current : [...current, item];
        });
        return { saved: true };
      } catch (error) {
        if (error?.status === 401) {
          return { requiresAuth: true };
        }
        throw error;
      }
    },
    [items, user],
  );

  const value = useMemo(
    () => ({ items, loading, isSaved, toggleSaved, refreshSavedItems: loadSavedItems, isAuthenticated: Boolean(user) }),
    [items, loading, isSaved, toggleSaved, loadSavedItems],
  );

  return <SavedItemsContext.Provider value={value}>{children}</SavedItemsContext.Provider>;
}

export function useSavedItems() {
  const value = useContext(SavedItemsContext);
  if (!value) throw new Error("useSavedItems must be used inside SavedItemsProvider");
  return value;
}
