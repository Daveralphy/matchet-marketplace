// Created by: Raphael Daveal
// Edited by: Brima

import { createBrowserRouter, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import SavedItems from "./pages/SavedItems";
import SellerSignupPageOne from "./pages/SellerSignupPage1";
import SellerSignupPageTwo from "./pages/SellerSignupPage2";
import SellerSignupPageThree from "./pages/SellerSignupPage3";
import SellerSignupPageFour from "./pages/SellerSignupPage4";
import SellerSignupPageFive from "./pages/SellerSignupPage5";
import SellerSignupPageSix from "./pages/SellerSignupPage6";
import SellerSignupPageSeven from "./pages/SellerSignupPage7";
import SellerSignupPageEight from "./pages/SellerSignupPage8";
import ProviderSignupPageOne from "./pages/ProvderSignupPage1";
import ProviderSignupPageTwo from "./pages/ProviderSignupPage2";
import ProviderSignupPageThree from "./pages/ProviderSignupPage3";
import ProviderSignupPageFour from "./pages/ProviderSignupPage4";
import ProviderSignupPageFive from "./pages/ProviderSignupPage5";
import ProviderSignupPageSix from "./pages/ProviderSignupPage6";
import ProviderSignupPageSeven from "./pages/ProviderSignupPage7";
import ProviderSignupPageEight from "./pages/ProviderSignupPage8";
import ProviderDashboard from "./pages/ProviderDashboard";
import SellerDashboard from "./pages/SellerDashboard";
import SellerOrders from "./pages/SellerOrders";
import SellerMessages from "./pages/SellerMessages";
import SellerProducts from "./pages/SellerProducts";
import SellerEarnings from "./pages/SellerEarnings";
import SellerReviews from "./pages/SellerReviews";
import ProviderDataPage from "./pages/ProviderDataPage";
import ProviderBookings from "./pages/ProviderBookings";
import ProviderApplicationStatus from "./pages/ProviderApplicationStatus";
import ProviderMessages from "./pages/ProviderMessages";
import ProviderServices from "./pages/ProviderServices";
import ProviderEarnings from "./pages/ProviderEarnings";
import ProviderReviews from "./pages/ProviderReviews";
import ProviderProfile from "./pages/ProviderProfile";
import ProviderSettings from "./pages/ProviderSettings";
import Login from "./pages/Login";
import CreateAccount from "./pages/CreateAccount";
import MarketplaceLayout from "./components/layout/MarketplaceLayout";
import Home from "./pages/Home";
import Products from "./pages/Products";
import ProductDetailsPage from "./pages/ProductDetails";
import ServiceDetailsPage from "./pages/ServiceDetails";
import Explore from "./pages/Explore";
import Services from "./pages/Services";
import ForProviders from "./pages/ForProviders";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";

function Placeholder({ name }) {
  return <h1>{name}</h1>;
}

function BlankPage() {
  return <main className="min-h-[60vh] w-full" aria-label="Blank page" />;
}

function RequireAuth({ children }) {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return <main className="min-h-[60vh] w-full" />;
  return isAuthenticated ? children : <Navigate to="/login" replace />;
}

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <MarketplaceLayout>
        <Home />
      </MarketplaceLayout>
    ),
  },
  {
    path: "/explore",
    element: (
      <MarketplaceLayout>
        <Explore />
      </MarketplaceLayout>
    ),
  },
  {
    path: "/products",
    element: (
      <MarketplaceLayout>
        <Products />
      </MarketplaceLayout>
    ),
  },
  {
    path: "/services",
    element: (
      <MarketplaceLayout>
        <Services />
      </MarketplaceLayout>
    ),
  },
  {
    path: "/for-providers",
    element: (
      <MarketplaceLayout>
        <ForProviders />
      </MarketplaceLayout>
    ),
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/create-account",
    element: <CreateAccount />,
  },
  {
    path: "/register",
    element: <SellerSignupPageOne />,
  },
  {
    path: "/register/page2",
    element: <SellerSignupPageTwo />,
  },
  {
    path: "/register/page3",
    element: <SellerSignupPageThree />,
  },
  {
    path: "/register/page4",
    element: <SellerSignupPageFour />,
  },
  {
    path: "/register/page5",
    element: <SellerSignupPageFive />,
  },
  {
    path: "/register/page6",
    element: <SellerSignupPageSix />,
  },
  {
    path: "/register/page7",
    element: <SellerSignupPageSeven />,
  },
  {
    path: "/register/page8",
    element: <SellerSignupPageEight />,
  },
  {
    path: "/account/saved-items",
    element: <RequireAuth><MarketplaceLayout><SavedItems /></MarketplaceLayout></RequireAuth>,
  },
  {
    path: "/products/:id",
    element: (
      <MarketplaceLayout>
        <ProductDetailsPage />
      </MarketplaceLayout>
    ),
  },
  {
    path: "/services/:id",
    element: (
      <MarketplaceLayout>
        <ServiceDetailsPage />
      </MarketplaceLayout>
    ),
  },
  {
    path: "/cart",
    element: (
      <MarketplaceLayout>
        <Cart />
      </MarketplaceLayout>
    ),
  },
  {
    path: "/checkout",
    element: (
      <MarketplaceLayout>
        <Checkout />
      </MarketplaceLayout>
    ),
  },
  {
    path: "/checkout/:id",
    element: (
      <MarketplaceLayout>
        <Checkout />
      </MarketplaceLayout>
    ),
  },

  {
    path: "/provider/profile",
    element: <RequireAuth><ProviderProfile /></RequireAuth>,
  },
  {
    path: "/orders",
    element: <RequireAuth><MarketplaceLayout><BlankPage /></MarketplaceLayout></RequireAuth>,
  },
  {
    path: "/provider/bookings",
    element: <RequireAuth><ProviderBookings /></RequireAuth>,
  },
  {
    path: "/provider/settings",
    element: <RequireAuth><ProviderSettings /></RequireAuth>,
  },
  {
    path: "/help",
    element: <MarketplaceLayout><BlankPage /></MarketplaceLayout>,
  },
  {
    path: "/provider/reviews",
    element: <RequireAuth><ProviderReviews /></RequireAuth>,
  },
  {
    path: "/categories",
    element: <MarketplaceLayout><BlankPage /></MarketplaceLayout>,
  },
  {
    path: "/how-it-works",
    element: <MarketplaceLayout><BlankPage /></MarketplaceLayout>,
  },
  {
    path: "/provider-resources",
    element: <MarketplaceLayout><BlankPage /></MarketplaceLayout>,
  },
  {
    path: "/provider/services",
    element: <RequireAuth><ProviderServices /></RequireAuth>,
  },
  {
    path: "/provider/messages",
    element: <RequireAuth><ProviderMessages /></RequireAuth>,
  },
  {
    path: "/saved-items",
    element: <RequireAuth><MarketplaceLayout><SavedItems /></MarketplaceLayout></RequireAuth>,
  },
  {
    path: "/safety",
    element: <MarketplaceLayout><BlankPage /></MarketplaceLayout>,
  },
  {
    path: "/report-problem",
    element: <MarketplaceLayout><BlankPage /></MarketplaceLayout>,
  },
  {
    path: "/contact",
    element: <MarketplaceLayout><BlankPage /></MarketplaceLayout>,
  },
  {
    path: "/terms",
    element: <MarketplaceLayout><BlankPage /></MarketplaceLayout>,
  },
  {
    path: "/privacy",
    element: <MarketplaceLayout><BlankPage /></MarketplaceLayout>,
  },
  {
    path: "/cookies",
    element: <MarketplaceLayout><BlankPage /></MarketplaceLayout>,
  },
  {
    path: "/sitemap",
    element: <MarketplaceLayout><BlankPage /></MarketplaceLayout>,
  },
  {
    path: "/provider/services-legacy",
    element: <MarketplaceLayout><BlankPage /></MarketplaceLayout>,
  },
  {
    path: "/provider-resources",
    element: <MarketplaceLayout><BlankPage /></MarketplaceLayout>,
  },
  {
    path: "/provider/dashboard",
    element: <RequireAuth><ProviderDashboard /></RequireAuth>,
  },
  {
    path: "/seller/dashboard",
    element: <RequireAuth><SellerDashboard /> </RequireAuth>,
  },
  {
    path: "/seller/orders",
    element: <RequireAuth><SellerOrders /></RequireAuth>,
  },
  {
    path: "/seller/messages",
    element: <RequireAuth><SellerMessages /></RequireAuth>,
  },
  {
    path: "/seller/products",
    element: <RequireAuth><SellerProducts /></RequireAuth>,
  },
  {
    path: "/seller/earnings",
    element: <RequireAuth><SellerEarnings /></RequireAuth>,
  },
  {
    path: "/seller/reviews",
    element: <RequireAuth><SellerReviews /></RequireAuth>,
  },
  {
    path: "/provider/earnings",
    element: <RequireAuth><ProviderEarnings /></RequireAuth>,
  },
  {
    path: "/provider/application-status",
    element: <RequireAuth><ProviderApplicationStatus /></RequireAuth>,
  },
  {
    path: "/provider/onboarding",
    element: <ProviderSignupPageOne />,
  },
  {
    path: "/provider/onboarding/page2",
    element: <ProviderSignupPageTwo />,
  },
  {
    path: "/provider/onboarding/page3",
    element: <ProviderSignupPageThree />,
  },
  {
    path: "/provider/onboarding/page4",
    element: <ProviderSignupPageFour />,
  },
  {
    path: "/provider/onboarding/page5",
    element: <ProviderSignupPageFive />,
  },
  {
    path: "/provider/onboarding/page6",
    element: <ProviderSignupPageSix />,
  },
  {
    path: "/provider/onboarding/page7",
    element: <ProviderSignupPageSeven />,
  },
  {
    path: "/provider/onboarding/success",
    element: <ProviderSignupPageEight />,
  },
  {
    path: "/provider/application-status",
    element: <RequireAuth><ProviderApplicationStatus /></RequireAuth>,
  },
  {
    path: "/provider/earnings",
    element: <RequireAuth><ProviderDataPage type="earnings" /></RequireAuth>,
  },
  {
    path: "/provider/reviews",
    element: <RequireAuth><ProviderDataPage type="reviews" /></RequireAuth>,
  },
  {
    path: "/provider/profile",
    element: <RequireAuth><ProviderDataPage type="profile" /></RequireAuth>,
  },
  {
    path: "/provider/settings",
    element: <RequireAuth><ProviderDataPage type="settings" /></RequireAuth>,
  },
  {
    path: "/provider/bookings",
    element: <RequireAuth><ProviderBookings /></RequireAuth>,
  },
  {
    path: "/provider/listings",
    element: <RequireAuth><MarketplaceLayout><Placeholder name="Provider Listings" /></MarketplaceLayout></RequireAuth>,
  },
]);

export default router;
