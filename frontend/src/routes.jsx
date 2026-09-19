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

function Placeholder({ name }) {
  return <h1>{name}</h1>;
}

const router = createBrowserRouter([
  {
    path: "/",
    element: <Placeholder name="Home" />,
  },
  {
    path: "/explore",
    element: <Placeholder name="Explore" />,
  },
  {
    path: "/products",
    element: <Placeholder name="Products" />,
  },
  {
    path: "/services",
    element: <Placeholder name="Services" />,
  },
  {
    path: "/for-providers",
    element: <Placeholder name="For Providers" />,
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
    element: <Placeholder name="Product Details" />,
  },
  {
    path: "/services/:id",
    element: <Placeholder name="Service Details" />,
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