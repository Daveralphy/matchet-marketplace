// Created by: Raphael Daveal
// Edited by: Brima

import { useEffect, useState } from "react";
import { createBrowserRouter, Navigate, useLocation } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import SavedItems from "./pages/SavedItems";
import BuyerOrders from "./pages/BuyerOrders";
import BuyerBookings from "./pages/BuyerBookings";
import AccountSettings from "./pages/AccountSettings";
import AccountSecurity from "./pages/AccountSecurity";
import DeleteAccount from "./pages/DeleteAccount";
import HelpSupport from "./pages/HelpSupport";
import MyProfile from "./pages/MyProfile";
import SellerSignupPageOne from "./pages/SellerSignupPage1";
import SellerSignupPageTwo from "./pages/SellerSignupPage2";
import SellerSignupPageFive from "./pages/SellerSignupPage5";
import SellerSignupPageSix from "./pages/SellerSignupPage6";
import SellerSignupPageSeven from "./pages/SellerSignupPage7";
import SellerSignupPageEight from "./pages/SellerSignupPage8";
import ProviderSignupPageOne from "./pages/ProvderSignupPage1";
import ProviderSignupPageThree from "./pages/ProviderSignupPage3";
import ProviderSignupPageFive from "./pages/ProviderSignupPage5";
import ProviderSignupPageSix from "./pages/ProviderSignupPage6";
import ProviderSignupPageSeven from "./pages/ProviderSignupPage7";
import ProviderSignupPageEight from "./pages/ProviderSignupPage8";
import ProviderDashboard from "./pages/ProviderDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import AdminProviders from "./pages/AdminProviders";
import AdminSellers from "./pages/AdminSellers";
import AdminUsers from "./pages/AdminUsers";
import AdminListings from "./pages/AdminListings";
import AdminReports from "./pages/AdminReports";
import AdminSettings from "./pages/AdminSettings";
import SellerDashboard from "./pages/SellerDashboard";
import SellerOrders from "./pages/SellerOrders";
import SellerOrderDetail from "./pages/SellerOrderDetail";
import SellerMessages from "./pages/SellerMessages";
import SellerProducts from "./pages/SellerProducts";
import SellerEarnings from "./pages/SellerEarnings";
import SellerReviews from "./pages/SellerReviews";
import SellerProfile from "./pages/SellerProfile";
import SellerSettings from "./pages/SellerSettings";
import SellerProductForm from "./pages/SellerProductForm";
import PublicSellerStore from "./pages/PublicSellerStore";
import ProviderDataPage from "./pages/ProviderDataPage";
import ProviderBookings from "./pages/ProviderBookings";
import ProviderApplicationStatus from "./pages/ProviderApplicationStatus";
import SellerApplicationStatus from "./pages/SellerApplicationStatus";
import ProviderMessages from "./pages/ProviderMessages";
import ProviderServices from "./pages/ProviderServices";
import ProviderEarnings from "./pages/ProviderEarnings";
import ProviderReviews from "./pages/ProviderReviews";
import ProviderProfile from "./pages/ProviderProfile";
import ProviderSettings from "./pages/ProviderSettings";
import { getOnboardingProgress, getProviderProfile, getSellerProfile } from "./api/provider";
import Login from "./pages/Login";
import CreateAccount from "./pages/CreateAccount";
import MarketplaceLayout from "./components/layout/MarketplaceLayout";
import Home from "./pages/Home";
import Products from "./pages/Products";
import ProductDetailsPage from "./pages/ProductDetails";
import ServiceDetailsPage from "./pages/ServiceDetails";
import Explore from "./pages/Explore";
import Services from "./pages/Services";
import PublicProviderServices from "./pages/PublicProviderServices";
import ForProviders from "./pages/ForProviders";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";

function Placeholder({ name }) {
  return <h1>{name}</h1>;
}

function BlankPage() {
  return <main className="min-h-[60vh] w-full" aria-label="Blank page" />;
}

function AccessDeniedPage({ title = "You do not have access to this page.", message = "Your account does not have the required access for this area." }) {
  return (
    <main style={{ minHeight: "100vh", display: "grid", placeItems: "center", padding: "32px", background: "#f7f8fc" }}>
      <section style={{ width: "min(520px, 100%)", padding: "32px", background: "#fff", border: "1px solid #e5e8f0", borderRadius: "16px", textAlign: "center", boxShadow: "0 16px 50px rgba(16,24,63,.08)" }}>
        <h1 style={{ margin: "0 0 10px", color: "#10183f", fontSize: "24px" }}>{title}</h1>
        <p style={{ margin: "0 0 24px", color: "#687099", lineHeight: 1.6 }}>{message}</p>
        <div style={{ display: "flex", justifyContent: "center", gap: "12px", flexWrap: "wrap" }}>
          <a href="/login" style={{ padding: "12px 20px", borderRadius: "8px", background: "#10183f", color: "#fff", textDecoration: "none", fontWeight: 600 }}>Log in</a>
          <a href="/" style={{ padding: "12px 20px", borderRadius: "8px", border: "1px solid #dfe3ec", color: "#10183f", textDecoration: "none", fontWeight: 600 }}>Back to marketplace</a>
        </div>
      </section>
    </main>
  );
}

function RequireAdmin({ children }) {
  const { user, loading, isAuthenticated } = useAuth();
  const location = useLocation();
  if (loading) return <main className="min-h-[60vh] w-full" />;
  if (!isAuthenticated) return <Navigate to={"/login?returnTo=" + encodeURIComponent(location.pathname)} replace />;
  if (user?.role !== "admin") return <AccessDeniedPage title="Admin access required" message="Your account does not have permission to access the admin area." />;
  return children;
}

function RequireOnboardingSubmitted({ flow, children }) {
  const { isAuthenticated, loading } = useAuth();
  const [checking, setChecking] = useState(true);
  const [submitted, setSubmitted] = useState(false);
  useEffect(() => {
    let active = true;
    if (loading) return undefined;
    if (!isAuthenticated) {
      setChecking(false);
      return undefined;
    }
    getOnboardingProgress(flow).then((response) => {
      if (active) setSubmitted(Boolean(response?.data?.submitted));
    }).catch(() => {
      if (active) setSubmitted(false);
    }).finally(() => active && setChecking(false));
    return () => { active = false; };
  }, [flow, isAuthenticated, loading]);
  if (loading || checking) return <main className="min-h-[60vh] w-full" />;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (!submitted) {
    const target = flow === "service" ? "/provider/onboarding" : "/register";
    return <Navigate to={target} replace />;
  }
  return children;
}

function RequireOnboardingStep({ flow, step, children }) {
  const { isAuthenticated, loading } = useAuth();
  const [checking, setChecking] = useState(true);
  const [redirectStep, setRedirectStep] = useState(null);
  useEffect(() => {
    let active = true;
    if (loading) return undefined;
    if (!isAuthenticated) {
      setChecking(false);
      return undefined;
    }
    getOnboardingProgress(flow).then((response) => {
      if (!active) return;
      const data = response?.data;
      if (data?.submitted) return;
      const firstIncomplete = Number(data?.firstIncompleteStep || 1);
      // The provider review page is the final review surface. If the backend
      // still considers Step 6 incomplete, allow Step 7 to render so the user
      // can see the saved values and correct them before final submission.
      const allowProviderReviewAfterStep6 = flow === "service" && step === 7 && firstIncomplete === 6;
      if (firstIncomplete < step && !allowProviderReviewAfterStep6) setRedirectStep(firstIncomplete);
    }).catch(() => active && setRedirectStep(1)).finally(() => active && setChecking(false));
    return () => { active = false; };
  }, [flow, step, isAuthenticated, loading]);
  if (loading || checking) return <main className="min-h-[60vh] w-full" />;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (redirectStep) {
    const target = flow === "service"
      ? (redirectStep === 1 ? "/provider/onboarding" : "/provider/onboarding/page" + redirectStep)
      : (redirectStep === 1 ? "/register" : "/register/page" + redirectStep);
    return <Navigate to={target} replace />;
  }
  return children;
}

function RequireOnboardingReview({ flow, children }) {
  const { isAuthenticated, loading } = useAuth();
  const [checking, setChecking] = useState(true);
  const [redirectStep, setRedirectStep] = useState(null);

  useEffect(() => {
    let active = true;
    if (loading) return undefined;
    if (!isAuthenticated) {
      setChecking(false);
      return undefined;
    }
    getOnboardingProgress(flow)
      .then((response) => {
        if (!active) return;
        const data = response?.data;
        if (data?.submitted) {
          setRedirectStep(0);
          return;
        }
        const firstIncomplete = Number(data?.firstIncompleteStep || 1);
        const totalSteps = Number(data?.totalSteps || 1);
        if (firstIncomplete <= totalSteps) setRedirectStep(firstIncomplete);
      })
      .catch(() => active && setRedirectStep(1))
      .finally(() => active && setChecking(false));
    return () => { active = false; };
  }, [flow, isAuthenticated, loading]);

  if (loading || checking) return <main className="min-h-[60vh] w-full" />;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (redirectStep === 0) return <Navigate to={flow === "service" ? "/provider/application-status" : "/register/page6"} replace />;
  if (redirectStep) {
    const target = flow === "service"
      ? (redirectStep === 1 ? "/provider/onboarding" : "/provider/onboarding/page" + redirectStep)
      : (redirectStep === 1 ? "/register" : "/register/page" + redirectStep);
    return <Navigate to={target} replace />;
  }
  return children;
}

function RequireAuth({ children }) {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();
  if (loading) return <main className="min-h-[60vh] w-full" />;
  if (isAuthenticated) return children;
  const returnTo = location.pathname + location.search;
  return <Navigate to={"/login?returnTo=" + encodeURIComponent(returnTo)} replace />;
}

function ProviderAccessPage({ state }) {
  const title = state === "missing"
    ? "Provider access is not available"
    : state === "incomplete"
      ? "Continue your provider application"
      : state === "rejected"
        ? "Provider application was not approved"
        : "Provider application is still being reviewed";
  const message = state === "missing"
    ? "This account has not completed provider onboarding, so provider dashboard pages are not available."
    : state === "incomplete"
      ? "You started provider onboarding but have not submitted your application yet. Continue from the step you last completed."
      : state === "rejected"
        ? "Your provider application is not currently approved. View the application status for the next steps."
        : "Your provider application has not been approved yet. You can view its current status or return to the marketplace.";
  return (
    <main style={{ minHeight: "100vh", display: "grid", placeItems: "center", padding: "32px", background: "#f7f8fc" }}>
      <section style={{ width: "min(520px, 100%)", padding: "32px", background: "#fff", border: "1px solid #e5e8f0", borderRadius: "16px", textAlign: "center", boxShadow: "0 16px 50px rgba(16,24,63,.08)" }}>
        <h1 style={{ margin: "0 0 10px", color: "#10183f", fontSize: "24px" }}>{title}</h1>
        <p style={{ margin: "0 0 24px", color: "#687099", lineHeight: 1.6 }}>{message}</p>
        <div style={{ display: "flex", justifyContent: "center", gap: "12px", flexWrap: "wrap" }}>
          {state === "missing" || state === "incomplete" ? <a href="/provider/onboarding">Continue application</a> : <a href="/provider/application-status">View application status</a>}
          <a href="/login">Log in</a>
          <a href="/">Back to marketplace</a>
        </div>
      </section>
    </main>
  );
}

function SellerAccessPage({ state }) {
  const title = state === "missing" ? "Seller access is not available" : state === "rejected" ? "Seller application was not approved" : "Seller application is still being reviewed";
  const message = state === "missing"
    ? "This account does not have an approved seller profile, so seller dashboard pages are not available."
    : state === "rejected"
      ? "Your seller application is not currently approved."
      : "Your seller application has not been approved yet.";
  return (
    <main style={{ minHeight: "100vh", display: "grid", placeItems: "center", padding: "32px", background: "#f7f8fc" }}>
      <section style={{ width: "min(520px, 100%)", padding: "32px", background: "#fff", border: "1px solid #e5e8f0", borderRadius: "16px", textAlign: "center", boxShadow: "0 16px 50px rgba(16,24,63,.08)" }}>
        <h1 style={{ margin: "0 0 10px", color: "#10183f", fontSize: "24px" }}>{title}</h1>
        <p style={{ margin: "0 0 24px", color: "#687099", lineHeight: 1.6 }}>{message}</p>
        <div style={{ display: "flex", justifyContent: "center", gap: "12px", flexWrap: "wrap" }}>
          {state === "missing" && <a href="/register">Start seller onboarding</a>}
          <a href="/login">Log in</a>
          <a href="/">Back to marketplace</a>
        </div>
      </section>
    </main>
  );
}

function RequireSeller({ children }) {
  const { isAuthenticated, loading } = useAuth();
  const [checking, setChecking] = useState(true);
  const [state, setState] = useState("missing");
  useEffect(() => {
    let active = true;
    if (loading) return undefined;
    if (!isAuthenticated) {
      setChecking(false);
      return undefined;
    }
    getSellerProfile().then((response) => {
      if (!active) return;
      const store = response?.data?.store;
      if (!store) setState("missing");
      else if (store.status === "active" && store.verificationStatus === "verified") setState("active");
      else if (store.verificationStatus === "rejected") setState("rejected");
      else setState("pending");
    }).catch(() => active && setState("missing")).finally(() => active && setChecking(false));
    return () => { active = false; };
  }, [isAuthenticated, loading]);
  if (loading) return <main className="min-h-[60vh] w-full" />;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (checking) return <main className="min-h-[60vh] w-full" />;
  if (state !== "active") return <SellerAccessPage state={state} />;
  return children;
}

function RequireProvider({ children }) {
  const { isAuthenticated, loading } = useAuth();
  const [checking, setChecking] = useState(true);
  const [state, setState] = useState("missing");
  useEffect(() => {
    let active = true;
    if (loading) return undefined;
    if (!isAuthenticated) {
      setChecking(false);
      return undefined;
    }
    getProviderProfile().then((response) => {
      if (!active) return;
      const profile = response?.data?.profile;
      if (!profile) setState("missing");
      else if (profile.status === "active" && profile.verificationStatus === "verified" && profile.applicationSubmittedAt) setState("active");
      else if (profile.verificationStatus === "rejected") setState("rejected");
      else if (!profile.applicationSubmittedAt) setState("incomplete");
      else setState("pending");
    }).catch(() => active && setState("missing")).finally(() => active && setChecking(false));
    return () => { active = false; };
  }, [isAuthenticated, loading]);
  if (loading) return <main className="min-h-[60vh] w-full" />;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (checking) return <main className="min-h-[60vh] w-full" />;
  if (state !== "active") return <ProviderAccessPage state={state} />;
  return children;
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
    element: <RequireOnboardingStep flow="seller" step={1}><SellerSignupPageOne /></RequireOnboardingStep>,
  },
  {
    path: "/register/page2",
    element: <RequireOnboardingStep flow="seller" step={2}><SellerSignupPageTwo /></RequireOnboardingStep>,
  },
  {
    path: "/register/page3",
    element: <RequireOnboardingStep flow="seller" step={3}><SellerSignupPageFive /></RequireOnboardingStep>,
  },
  {
    path: "/register/page4",
    element: <RequireOnboardingStep flow="seller" step={4}><SellerSignupPageSix /></RequireOnboardingStep>,
  },
  {
    path: "/register/page5",
    element: <RequireOnboardingReview flow="seller"><SellerSignupPageSeven /></RequireOnboardingReview>,
  },
  {
    path: "/register/page6",
    element: <RequireOnboardingSubmitted flow="seller"><SellerSignupPageEight /></RequireOnboardingSubmitted>,
  },
  {
    path: "/account/saved-items",
    element: <RequireAuth><MarketplaceLayout><SavedItems /></MarketplaceLayout></RequireAuth>,
  },
  {
    path: "/profile",
    element: <RequireAuth><MarketplaceLayout><MyProfile /></MarketplaceLayout></RequireAuth>,
  },
  {
    path: "/account/profile",
    element: <Navigate to="/profile" replace />,
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
    path: "/providers/:id",
    element: (
      <MarketplaceLayout>
        <PublicProviderServices />
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
    path: "/admin/dashboard",
    element: <RequireAdmin><AdminDashboard /></RequireAdmin>,
  },
  {
    path: "/admin/providers",
    element: <RequireAdmin><AdminProviders /></RequireAdmin>,
  },
  {
    path: "/admin/sellers",
    element: <RequireAdmin><AdminSellers /></RequireAdmin>,
  },
  {
    path: "/admin/users",
    element: <RequireAdmin><AdminUsers /></RequireAdmin>,
  },
  {
    path: "/admin/listings",
    element: <RequireAdmin><AdminListings /></RequireAdmin>,
  },
  {
    path: "/admin/reports",
    element: <RequireAdmin><AdminReports /></RequireAdmin>,
  },
  {
    path: "/admin/settings",
    element: <RequireAdmin><AdminSettings /></RequireAdmin>,
  },
  {
    path: "/provider/profile",
    element: <RequireProvider><ProviderProfile /></RequireProvider>,
  },
  {
    path: "/orders",
    element: <RequireAuth><MarketplaceLayout><BuyerOrders /></MarketplaceLayout></RequireAuth>,
  },
  {
    path: "/provider/bookings",
    element: <RequireProvider><ProviderBookings /></RequireProvider>,
  },
  {
    path: "/provider/settings",
    element: <RequireProvider><ProviderSettings /></RequireProvider>,
  },
  {
    path: "/help",
    element: <MarketplaceLayout><HelpSupport /></MarketplaceLayout>,
  },
  {
    path: "/provider/reviews",
    element: <RequireProvider><ProviderReviews /></RequireProvider>,
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
    element: <RequireProvider><ProviderServices /></RequireProvider>,
  },
  {
    path: "/provider/messages",
    element: <RequireProvider><ProviderMessages /></RequireProvider>,
  },
  {
    path: "/saved-items",
    element: <RequireAuth><MarketplaceLayout><SavedItems /></MarketplaceLayout></RequireAuth>,
  },
  {
    path: "/bookings",
    element: <RequireAuth><MarketplaceLayout><BuyerBookings /></MarketplaceLayout></RequireAuth>,
  },
  {
    path: "/account/settings",
    element: <RequireAuth><MarketplaceLayout><AccountSettings /></MarketplaceLayout></RequireAuth>,
  },
  {
    path: "/account/security",
    element: <RequireAuth><MarketplaceLayout><AccountSecurity /></MarketplaceLayout></RequireAuth>,
  },
  {
    path: "/account/delete",
    element: <RequireAuth><MarketplaceLayout><DeleteAccount /></MarketplaceLayout></RequireAuth>,
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
    element: <RequireProvider><ProviderDashboard /></RequireProvider>,
  },
  {
    path: "/seller/application-status",
    element: <RequireAuth><SellerApplicationStatus /></RequireAuth>,
  },
  {
    path: "/seller/dashboard",
    element: <RequireSeller><SellerDashboard /></RequireSeller>,
  },
  {
    path: "/seller/orders",
    element: <RequireSeller><SellerOrders /></RequireSeller>,
  },
  {
    path: "/seller/orders/:orderId",
    element: <RequireSeller><SellerOrderDetail /></RequireSeller>,
  },
  {
    path: "/seller/messages",
    element: <RequireSeller><SellerMessages /></RequireSeller>,
  },
  {
    path: "/seller/products",
    element: <RequireSeller><SellerProducts /></RequireSeller>,
  },
  {
    path: "/seller/products/new",
    element: <RequireSeller><SellerProductForm /></RequireSeller>,
  },
  {
    path: "/seller/products/:productId/edit",
    element: <RequireSeller><SellerProductForm /></RequireSeller>,
  },
  {
    path: "/seller/earnings",
    element: <RequireSeller><SellerEarnings /></RequireSeller>,
  },
  {
    path: "/seller/reviews",
    element: <RequireSeller><SellerReviews /></RequireSeller>,
  },
  {
    path: "/seller/profile",
    element: <RequireSeller><SellerProfile /></RequireSeller>,
  },
  {
    path: "/store/:slug",
    element: <PublicSellerStore />,
  },
  {
    path: "/seller/settings",
    element: <RequireSeller><SellerSettings /></RequireSeller>,
  },
  {
    path: "/provider/earnings",
    element: <RequireProvider><ProviderEarnings /></RequireProvider>,
  },
  {
    path: "/provider/application-status",
    element: <RequireAuth><ProviderApplicationStatus /></RequireAuth>,
  },
  {
    path: "/provider/onboarding",
    element: <RequireOnboardingStep flow="service" step={1}><ProviderSignupPageOne /></RequireOnboardingStep>,
  },
  {
    path: "/provider/onboarding/page2",
    element: <RequireOnboardingStep flow="service" step={2}><ProviderSignupPageThree /></RequireOnboardingStep>,
  },
  {
    path: "/provider/onboarding/page3",
    element: <RequireOnboardingStep flow="service" step={3}><ProviderSignupPageFive /></RequireOnboardingStep>,
  },
  {
    path: "/provider/onboarding/page4",
    element: <RequireOnboardingStep flow="service" step={4}><ProviderSignupPageSix /></RequireOnboardingStep>,
  },
  {
    path: "/provider/onboarding/page5",
    element: <RequireOnboardingReview flow="service"><ProviderSignupPageSeven /></RequireOnboardingReview>,
  },
  {
    path: "/provider/onboarding/page6",
    element: <RequireOnboardingSubmitted flow="service"><ProviderSignupPageEight /></RequireOnboardingSubmitted>,
  },
  {
    path: "/provider/listings",
    element: <RequireProvider><MarketplaceLayout><Placeholder name="Provider Listings" /></MarketplaceLayout></RequireProvider>,
  },
]);

export default router;