// Created by: Raphael Daveal
// Edited by: Raphael Daveal

import { cloneElement, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Header from "./Header";
import Footer from "./Footer";

function MarketplaceSkeleton() {
  return (
    <main className="min-h-[65vh] w-full animate-pulse px-4 pb-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1470px] pt-2">
        <div className="h-[280px] rounded-[14px] bg-slate-100 sm:h-[360px] lg:h-[470px]" />
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="h-[180px] rounded-xl bg-slate-100" />
          ))}
        </div>
      </div>
    </main>
  );
}

export default function MarketplaceLayout({ children }) {
  const { isAuthenticated, user, logout, notifications, markNotificationsRead } = useAuth();
  const location = useLocation();
  const [pageLoading, setPageLoading] = useState(true);
  const userName = user?.firstName || user?.username || "Daveralphy";

  useEffect(() => {
    let active = true;
    setPageLoading(true);
    const timer = window.setTimeout(() => {
      if (active) setPageLoading(false);
    }, 320);
    return () => {
      active = false;
      window.clearTimeout(timer);
    };
  }, [location.key]);

  useEffect(() => {
    const key = `matchet_scroll:${location.pathname}`;
    const saved = sessionStorage.getItem(key);
    const restore = () => {
      if (saved !== null) window.scrollTo({ top: Number(saved), behavior: "auto" });
      else window.scrollTo({ top: 0, behavior: "auto" });
    };
    requestAnimationFrame(restore);
    const save = () => sessionStorage.setItem(key, String(window.scrollY));
    window.addEventListener("scroll", save, { passive: true });
    return () => {
      save();
      window.removeEventListener("scroll", save);
    };
  }, [location.pathname, location.key]);

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
        notifications={notifications}
        onNotificationsRead={markNotificationsRead}
      />

      <main className="relative flex-1">
        <div className={`transition-opacity duration-300 ease-out ${pageLoading ? "opacity-0 pointer-events-none" : "opacity-100"}`}>
          {content}
        </div>
        {pageLoading && (
          <div className="absolute inset-0 z-10 bg-white">
            <MarketplaceSkeleton />
          </div>
        )}
      </main>

      <Footer isAuthenticated={isAuthenticated} />
    </div>
  );
}
