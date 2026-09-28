// Created by: Raphael Daveal
// Edited by: Raphael Daveal

import { cloneElement } from "react";
import { useAuth } from "../../context/AuthContext";
import Header from "./Header";
import Footer from "./Footer";

export default function MarketplaceLayout({ children }) {
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
