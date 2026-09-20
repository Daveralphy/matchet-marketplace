// Created by: Raphael Daveal
// Edited by: Raphael Daveal

import Header from "./Header";

export default function MarketplaceLayout({ children }) {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main>{children}</main>
    </div>
  );
}
