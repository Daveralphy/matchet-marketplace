// Created by: Raphael Daveal
// Edited by: Raphael Daveal

import { cloneElement, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import Header from "./Header";
import Footer from "./Footer";

export default function MarketplaceLayout({ children }) {
  useEffect(() => {
    const key = `matchet_scroll:${window.location.pathname}${window.location.search}`;
    const restore = () => {
      const saved = sessionStorage.getItem(key);
      if (saved) {
        window.scrollTo({ top: Number(saved), behavior: "auto" });
      }
    };

    requestAnimationFrame(restore);

    const save = () => {
      sessionStorage.setItem(key, String(window.scrollY));
    };

    window.addEventListener("scroll", save, { passive: true });

    return () => {
      save();
      window.removeEventListener("scroll", save);
    };
  }, [window.location.pathname, window.location.search]);

  const { isAuthenticated, user, logout } = useAuth();
  const userName = user?.firstName || user?.username || "Daveralphy";

  const content = cloneElement(children, {
    isAuthenticated,
    userName,
  });

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Header
        isAuthenticated={isAuthenticated}
        username={userName}
        onLogout={logout}
      />

      <main className="flex-1">
        {content}
      </main>

      <Footer isAuthenticated={isAuthenticated} />
    </div>
  );
}
