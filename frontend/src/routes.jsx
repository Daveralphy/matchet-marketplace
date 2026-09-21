// Created by: Raphael Daveal
// Edited by: Brima

import { createBrowserRouter } from "react-router-dom";
import SavedItems from "./pages/SavedItems";

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
    element: <Placeholder name="Login" />,
  },
  {
    path: "/register",
    element: <Placeholder name="Register" />,
  },
  {
    path: "/account/saved-items",
    element: <SavedItems />,
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
