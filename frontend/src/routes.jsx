// Created by: Raphael Daveal
// Edited by: Brima

import { createBrowserRouter } from "react-router-dom";
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
    element: <SavedItems />,
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
    path: "/provider/dashboard",
    element: <Placeholder name="Provider Dashboard" />,
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
    path: "/provider/listings",
    element: <Placeholder name="Provider Listings" />,
  },
]);

export default router;
