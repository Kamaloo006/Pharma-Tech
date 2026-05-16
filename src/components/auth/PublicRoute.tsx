import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

export default function PublicRoute() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-background">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  // إذا كان مسجلاً بالفعل، نمنعه من دخول صفحات الـ Auth ونطرده للداشبورد
  return isAuthenticated ? <Navigate to="/dashboard" replace /> : <Outlet />;
}
