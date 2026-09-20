// Created by: Raphael Daveal
// Edited by: Raphael Daveal

import { createBrowserRouter } from "react-router-dom";
import SellerSignupPageOne from "./pages/SellerSignupPage1";
import SellerSignupPageTwo from "./pages/SellerSignupPage2";
import SellerSignupPageThree from "./pages/SellerSignupPage3";
import SellerSignupPageFour from "./pages/SellerSignupPage4";
import SellerSignupPageFive from "./pages/SellerSignupPage5";
import SellerSignupPageSix from "./pages/SellerSignupPage6";
import SellerSignupPageSeven from "./pages/SellerSignupPage7";
import Login from "./pages/Login";
import MarketplaceLayout from "./components/layout/MarketplaceLayout";
import Home from "./pages/Home";

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
        <Placeholder name="Explore" />
      </MarketplaceLayout>
    ),
  },
  {
    path: "/products",
    element: (
      <MarketplaceLayout>
        <Placeholder name="Products" />
      </MarketplaceLayout>
    ),
  },
  {
    path: "/services",
    element: (
      <MarketplaceLayout>
        <Placeholder name="Services" />
      </MarketplaceLayout>
    ),
  },
  {
    path: "/for-providers",
    element: (
      <MarketplaceLayout>
        <Placeholder name="For Providers" />
      </MarketplaceLayout>
    ),
  },
  {
    path: "/login",
    element: <Login />,
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
    path: "/products/:id",
    element: (
      <MarketplaceLayout>
        <Placeholder name="Product Details" />
      </MarketplaceLayout>
    ),
  },
  {
    path: "/services/:id",
    element: (
      <MarketplaceLayout>
        <Placeholder name="Service Details" />
      </MarketplaceLayout>
    ),
  },
  {
    path: "/provider/dashboard",
    element: <Placeholder name="Provider Dashboard" />,
  },
  {
    path: "/provider/onboarding",
    element: <Placeholder name="Provider Onboarding" />,
  },
  {
    path: "/provider/listings",
    element: <Placeholder name="Provider Listings" />,
  },
]);

export default router;
