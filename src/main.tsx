import { type ReactNode } from "react";
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
import { AuthProvider, useAuth } from "@/context/AuthContext";
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

import Suppliers from "./pages/dashboard/Suppliers.tsx";
import Cashbox from "./pages/dashboard/Cashbox.tsx";
import PurchaseInvoiceList from "./pages/dashboard/PurchaseInvoiceList.tsx";
import CreatePurchaseInvoice from "./pages/dashboard/CreatePurchaseInvoice.tsx";
import PurchaseInvoiceDetails from "./pages/dashboard/PurchaseInvoiceDetails.tsx";
import SupplierDebt from "./pages/dashboard/SupplierDebt.tsx";
import SupplierDebtDetails from "./pages/dashboard/SupplierDebtDetails.tsx";
import SupplierReturn from "./pages/dashboard/SupplierReturn.tsx";
import CreateSupplierReturn from "./pages/dashboard/CreateSupplierReturn.tsx";
import SupplierReturnDetails from "./pages/dashboard/SupplierReturnDetails.tsx";
import Customers from "./pages/dashboard/Customers.tsx";
import CustomerDebt from "./pages/dashboard/CustomerDebt.tsx";
import SalesInvoicesPage from "./pages/dashboard/SalesInvoices.tsx";
import CreateSalesInvoice from "./pages/dashboard/CreateSalesInvoice.tsx";
import SalesInvoiceDetails from "./pages/dashboard/SalesInvoiceDetails.tsx";
import CustomerDebtDetails from "./pages/dashboard/CustomerDebtDetails.tsx";
import CustomerReturn from "./pages/dashboard/CustomerReturn.tsx";
import CreateCustomerReturn from "./pages/dashboard/CreateCustomerReturn.tsx";
import CustomerReturnDetails from "./pages/dashboard/CustomerReturnDetails.tsx";
import Dashboard from "./pages/dashboard/Dashboard.tsx";
import Reports from "./pages/dashboard/Reports.tsx";
import Notifications from "./pages/dashboard/Notifications.tsx";
import Unauthorized from "./components/Layout/UnAuthorized.tsx";
import ProfileSettings from "./pages/dashboard/ProfileSettings.tsx";
import ManagePharmacist from "./pages/dashboard/ManagePharmacist.tsx";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 0,
      refetchOnWindowFocus: false,
    },
  },
});

function DashboardHome() {
  const { user } = useAuth();

  if (user?.role === "pharmacist") {
    return <Navigate to="/dashboard/inventory" replace />;
  }

  return <Dashboard />;
}

const router = createBrowserRouter([
  {
    path: "/",
    element: <DashboardHome />,
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
      {
        path: "/unauthorized",
        element: <Unauthorized />,
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
          { path: "", element: <Dashboard /> },
          {
            path: "inventory",
            element: <Inventory />,
          },
          {
            path: "profile-settings",
            element: <ProfileSettings />,
          },
          {
            path: "reports",
            element: <Reports />,
          },
          {
            path: "product-details/:id",
            element: <ProductDetailsPage />,
          },
          {
            path: "suppliers",
            element: <Suppliers />,
          },
          {
            path: "cashbox",
            element: <Cashbox />,
          },
          {
            path: "purchases",
            element: <PurchaseInvoiceList />,
          },
          {
            path: "purchases/new",
            element: <CreatePurchaseInvoice />,
          },
          {
            path: "purchase-details/:id",
            element: <PurchaseInvoiceDetails />,
          },
          {
            path: "supplier-debt",
            element: <SupplierDebt />,
          },
          {
            path: "supplier-debt/:id",
            element: <SupplierDebtDetails />,
          },
          {
            path: "supplier-return",
            element: <SupplierReturn />,
          },
          {
            path: "supplier-return/create",
            element: <CreateSupplierReturn />,
          },
          {
            path: "supplier-return/:id",
            element: <SupplierReturnDetails />,
          },
          {
            path: "customers",
            element: <Customers />,
          },
          {
            path: "customer-debt",
            element: <CustomerDebt />,
          },
          {
            path: "customer-debt/:id",
            element: <CustomerDebtDetails />,
          },
          {
            path: "customer-return",
            element: <CustomerReturn />,
          },
          {
            path: "customer-return/create",
            element: <CreateCustomerReturn />,
          },
          {
            path: "customer-return/:id",
            element: <CustomerReturnDetails />,
          },
          {
            path: "sales-invoice",
            element: <SalesInvoicesPage />,
          },
          {
            path: "sales-invoice/new",
            element: <CreateSalesInvoice />,
          },
          {
            path: "sales-details/:id",
            element: <SalesInvoiceDetails />,
          },
          {
            path: "notifications",
            element: <Notifications />,
          },
          {
            path: "pharmacists/new",
            element: <ManagePharmacist />,
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
  <GoogleAuthProvider>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
          <RouterProvider router={router} />
          <Toaster position="top-center" />
        </ThemeProvider>
      </AuthProvider>
    </QueryClientProvider>
  </GoogleAuthProvider>,
);
