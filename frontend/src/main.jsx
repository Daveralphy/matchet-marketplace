// Created by: Raphael Daveal
// Edited by: Raphael Daveal

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import router from "./routes";
import { FormProvider } from "./context/FormContext";
import { CartProvider } from "./context/CartContext";
import { SavedItemsProvider } from "./context/SavedItemsContext";
import { AuthProvider } from "./context/AuthContext";
import "./styles/globals.css";
import CartFlyAnimation from "./components/cart/CartFlyAnimation";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      <FormProvider>
        <CartProvider>
          <SavedItemsProvider>
            <><RouterProvider router={router} /><CartFlyAnimation /></>
          </SavedItemsProvider>
        </CartProvider>
      </FormProvider>
    </AuthProvider>
  </StrictMode>,
);