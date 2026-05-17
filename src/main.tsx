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
import DevelopmentVerify from "./pages/auth/DevelopmentVerify.tsx";

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
        path: "/verify-email",
        element: <VerifyEmailPage />,
      },
      {
        path: "/verify-email-dev",
        element: <DevelopmentVerify />,
      },
    ],
  },

  // ================= 2. المسارات المحمية (ممنوع دخول الغرباء إليها) =================
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
    {/* 1. طبقة الـ TanStack Query */}
    <QueryClientProvider client={queryClient}>
      {/* 2. طبقة الـ Auth لإدارة التوكن والـ Refresh */}
      <AuthProvider>
        {/* 3. طبقة الـ الثيم المتوافقة مع تعديلاتك */}
        <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
          {/* تشغيل الموجه */}
          <RouterProvider router={router} />

          {/* توستر التنبيهات من Shadcn يوضع هنا في الجذر ليعمل بكل الشاشات */}
          <Toaster position="top-center" richColors />
        </ThemeProvider>
      </AuthProvider>
    </QueryClientProvider>
  </StrictMode>,
);
