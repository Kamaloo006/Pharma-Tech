import { type ReactNode } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";

import { type AuthRole, getAuthSession } from "@/lib/auth";

type ProtectedRouteProps = {
  children?: ReactNode;
  allowedRole?: AuthRole;
};

const ProtectedRoute = ({ children, allowedRole }: ProtectedRouteProps) => {
  const location = useLocation();
  const authSession = getAuthSession();

  if (!authSession) {
    return (
      <Navigate to="/login/pharmacist" replace state={{ from: location }} />
    );
  }

  if (allowedRole && authSession.role !== allowedRole) {
    return (
      <Navigate to="/login/pharmacist" replace state={{ from: location }} />
    );
  }

  if (children) {
    return <>{children}</>;
  }

  return <Outlet />;
};

export default ProtectedRoute;
