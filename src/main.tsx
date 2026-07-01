import { StrictMode, type ReactNode } from "react";
import { createRoot } from "react-dom/client";
import {
  Navigate,
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/sonner";

// السياقات (Contexts) والـ Utils
import { ThemeProvider } from "@/context/theme-provider.tsx";
import { AuthProvider } from "@/context/AuthContext";
import "./utils/i18n/index.ts";
import "./index.css";

// المكونات والصفحات
import PharmacistLogin from "./pages/auth/PharmacistLogin.tsx";
import PharmacistSignUp from "./pages/auth/PharmacistSignUp.tsx";
import VerifyEmailPage from "./pages/auth/VerifyEmailPage.tsx";
import ForgotPassword from "./pages/auth/ForgotPassword.tsx";
import ResetPassword from "./pages/auth/ResetPassword.tsx";
import CompleteProfile from "./pages/auth/CompleteProfile.tsx";

import DashboardLayout from "./pages/dashboard/DashboardLayout.tsx";
import Inventory from "./pages/dashboard/Inventory.tsx";

// (Guards)
import ProtectedRoute from "./components/auth/ProtectedRoute";
import PublicRoute from "./components/auth/PublicRoute";

import { GoogleOAuthProvider } from "@react-oauth/google";
import { useTranslation } from "react-i18next";
import ProductDetailsPage from "./pages/dashboard/ProductDetailsPage.tsx";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const router = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to="/dashboard/inventory" replace />,
  },

  {
    element: <PublicRoute />,
    children: [
      { path: "/login/pharmacist", element: <PharmacistLogin /> },
      { path: "/signup/pharmacist", element: <PharmacistSignUp /> },
      { path: "/email-verify", element: <VerifyEmailPage /> },
      { path: "/forgot-password", element: <ForgotPassword /> },
      { path: "/reset-password", element: <ResetPassword /> },
    ],
  },

  {
    element: <ProtectedRoute requirePharmacy={false} />,
    children: [
      {
        path: "/complete-profile",
        element: <CompleteProfile />,
      },
    ],
  },

  {
    element: <ProtectedRoute requirePharmacy={true} />,
    children: [
      {
        path: "/dashboard",
        element: <DashboardLayout />,
        children: [
          { path: "", element: <Navigate to="inventory" replace /> },
          {
            path: "inventory",
            element: <Inventory />,
          },
          {
            path: "product-details/:id",
            element: <ProductDetailsPage />,
          },
        ],
      },
    ],
  },

  {
    path: "*",
    element: <Navigate to="/dashboard/inventory" replace />,
  },
]);

const GOOGLE_CLIENT_ID =
  "1057821413443-q895i6hfp24qgfrk384v58p36dl8bpd2.apps.googleusercontent.com";

function GoogleAuthProvider({ children }: { children: ReactNode }) {
  const { i18n } = useTranslation();
  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID} locale={i18n.language}>
      {children}
    </GoogleOAuthProvider>
  );
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <GoogleAuthProvider>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
            <RouterProvider router={router} />
            <Toaster position="top-center" />
          </ThemeProvider>
        </AuthProvider>
      </QueryClientProvider>
    </GoogleAuthProvider>
  </StrictMode>,
);
