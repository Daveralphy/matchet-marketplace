// Created by: Raphael Daveal
// Edited by: Raphael Daveal

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import router from "./routes";
import { FormProvider } from "./context/FormContext";
import { CartProvider } from "./context/CartContext";
import { AuthProvider } from "./context/AuthContext";
import "./styles/globals.css";
import ToastViewport from "./components/common/ToastViewport";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      <FormProvider>
        <CartProvider>
          <RouterProvider router={router} />
          <ToastViewport />
        </CartProvider>
      </FormProvider>
    </AuthProvider>
  </StrictMode>,
);