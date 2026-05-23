import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import {
  Navigate,
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/sonner"; // التنبيهات الفخمة لـ Shadcn

// السياقات (Contexts) والـ Utils
import { ThemeProvider } from "@/context/theme-provider.tsx";
import { AuthProvider } from "@/context/AuthContext";
import "./utils/i18n/index.ts";
import "./index.css";

// المكونات والصفحات
import App from "./App.tsx";
import PharmacistLogin from "./pages/auth/PharmacistLogin.tsx";
import PharmacistSignUp from "./pages/auth/PharmacistSignUp.tsx";
import VerifyEmailPage from "./pages/auth/VerifyEmailPage.tsx";
// import RegisterSuccess from "./pages/auth/RegisterSuccess.tsx"; // شاشة نجاح التسجيل (انتظار التفعيل)

// الحراس (Guards)
import ProtectedRoute from "./components/auth/ProtectedRoute";
import PublicRoute from "./components/auth/PublicRoute";
import ForgotPassword from "./pages/auth/ForgotPassword.tsx";
import ResetPassword from "./pages/auth/ResetPassword.tsx";

// تهيئة الـ TanStack Query Client لجميع طلبات الـ API
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const router = createBrowserRouter([
  // تحويل جذر الموقع تلقائياً للـ Dashboard (والحارس سيتولى الباقي)
  {
    path: "/",
    element: <Navigate to="/dashboard" replace />,
  },

  // ================= 1. مسارات الضيوف (ممنوع دخول المسجلين إليها) =================
  {
    element: <PublicRoute />,
    children: [
      {
        path: "/login/pharmacist",
        element: <PharmacistLogin />,
      },

      {
        path: "/signup/pharmacist",
        element: <PharmacistSignUp />,
      },
      {
        path: "/email-verify",
        element: <VerifyEmailPage />,
      },
      {
        path: "/forgot-password",
        element: <ForgotPassword />,
      },
      {
        path: "/reset-password",
        element: <ResetPassword />,
      },
    ],
  },

  {
    element: <ProtectedRoute />,
    children: [
      {
        path: "/dashboard",
        element: <App />, // تطبيقك الأساسي أو الـ Layout للوحة التحكم
      },
    ],
  },

  // مسار الـ App القديم الخاص بك (تحويل احتياطي)
  {
    path: "/app",
    element: <Navigate to="/dashboard" replace />,
  },

  // ================= 3. حارس الروابط العشوائية والخاطئة =================
  {
    path: "*",
    element: <Navigate to="/dashboard" replace />,
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
          <RouterProvider router={router} />
          <Toaster position="top-center" richColors />
        </ThemeProvider>
      </AuthProvider>
    </QueryClientProvider>
  </StrictMode>,
);
