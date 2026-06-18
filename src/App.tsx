import { useNavigate } from "react-router-dom";

import { useAuth } from "@/context/AuthContext";
import { googleLogout } from "@react-oauth/google";
import Dashboard from "./pages/dashboard/DashboardLayout";

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
      <Dashboard />
    </main>
  );
};

export default App;
