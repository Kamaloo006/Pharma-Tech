import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

interface ProtectedRouteProps {
  requirePharmacy?: boolean;
  allowedRoles?: Array<"pharmacy_owner">;
}

export default function ProtectedRoute({
  requirePharmacy = true,
  allowedRoles,
}: ProtectedRouteProps) {
  const { isAuthenticated, isLoading, pharmacy, user } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-background">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <Navigate to="/login/pharmacist" state={{ from: location }} replace />
    );
  }

  if (requirePharmacy && !pharmacy) {
    return <Navigate to="/complete-profile" replace />;
  }

  if (
    !requirePharmacy &&
    pharmacy &&
    location.pathname === "/complete-profile"
  ) {
    const targetPath =
      user?.role === "pharmacy_owner" ? "/dashboard" : "/dashboard/inventory";
    return <Navigate to={targetPath} replace />;
  }

  if (allowedRoles && user && !allowedRoles.includes(user.role as any)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
}
