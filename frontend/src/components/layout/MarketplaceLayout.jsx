// Created by: Raphael Daveal
// Edited by: Raphael Daveal

import Header from "./Header";
import Footer from "./Footer";

export default function MarketplaceLayout({
  children,
  isAuthenticated = false,
}) {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Header isAuthenticated={isAuthenticated} />

      <main className="flex-1">
        {children}
      </main>

      <Footer isAuthenticated={isAuthenticated} />
    </div>
  );
}
