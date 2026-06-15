import { Moon, Pill, ShieldCheck, Sun } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { useTheme } from "./context/theme-provider";
import { Separator } from "./components/ui/separator";
import { useTranslation } from "react-i18next";
import { useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { googleLogout } from "@react-oauth/google";
import DashboardHeader from "./components/dashboard/DashboardHeader";

const App = () => {
  // const { setTheme, theme } = useTheme();
  const navigate = useNavigate();
  const { logout, user, isAuthenticated } = useAuth();

  const handleLogout = async () => {
    await logout();
    googleLogout();
    navigate("/login/pharmacist", { replace: true });
  };

  return (
    <main>
      <DashboardHeader />
    </main>
  );
};

export default App;
