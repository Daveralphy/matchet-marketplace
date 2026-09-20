// Created by: Raphael Daveal
// Edited by: Raphael Daveal

import { Outlet } from "react-router-dom";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";

export default function BuyerLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Header isAuthenticated={true} />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer isAuthenticated={true} />
    </div>
  );
}
