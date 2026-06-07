import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

export default function PublicRoute() {
  const { isAuthenticated, isLoading, pharmacy } = useAuth();
  const location = useLocation();
  const isCompleteProfileRoute =
    location.pathname === "/complete-profile" ||
    location.pathname === "/complete-setup";

  if (isLoading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-background">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  if (!isAuthenticated && isCompleteProfileRoute) {
    return <Navigate to="/login/pharmacist" replace />;
  }

  if (isAuthenticated) {
    const hasNoPharmacy = !pharmacy;

    if (hasNoPharmacy) {
      if (!isCompleteProfileRoute) {
        return <Navigate to="/complete-profile" replace />;
      }

      return <Outlet />;
    }

    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
}
