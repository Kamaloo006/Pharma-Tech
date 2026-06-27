import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

export default function PublicRoute() {
  const { isAuthenticated, isLoading, pharmacy } = useAuth();

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        Loading...
      </div>
    );
  }

  if (isAuthenticated) {
    if (!pharmacy) {
      return <Navigate to="/complete-profile" replace />;
    }
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
}
