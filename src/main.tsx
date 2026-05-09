import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import {
  Navigate,
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import { ThemeProvider } from "@/context/theme-provider.tsx";
import "./index.css";
import App from "./App.tsx";
import AdminLogin from "./pages/auth/AdminLogin.tsx";
import PharmacistLogin from "./pages/auth/PharmacistLogin.tsx";
import PharmacistSignUp from "./pages/auth/PharmacistSignUp.tsx";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import "./utils/i18n/index.ts";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to="/login/pharmacist" replace />,
  },
  {
    path: "/login/pharmacist",
    element: <PharmacistLogin />,
  },
  {
    path: "/signup/pharmacist",
    element: <PharmacistSignUp />,
  },
  {
    path: "/login/admin",
    element: <AdminLogin />,
  },
  {
    path: "/dashboard",
    element: (
      <ProtectedRoute>
        <App />
      </ProtectedRoute>
    ),
  },
  {
    path: "/app",
    element: <Navigate to="/dashboard" replace />,
  },
  {
    path: "*",
    element: <Navigate to="/login/pharmacist" replace />,
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <RouterProvider router={router} />
    </ThemeProvider>
  </StrictMode>,
);
