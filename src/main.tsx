import { StrictMode, useEffect } from "react";
import { createRoot } from "react-dom/client";
import { ThemeProvider } from "@/context/theme-provider.tsx";
import "./index.css";
import App from "./App.tsx";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import AdminLogin from "./pages/auth/AdminLogin.tsx";
import "./utils/i18n/index.ts";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "login/admin",
    element: <AdminLogin />,
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <RouterProvider router={router} />
    </ThemeProvider>
  </StrictMode>,
);
