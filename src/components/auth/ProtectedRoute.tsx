import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

export default function ProtectedRoute() {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  // 1. أثناء فحص التوكنات والـ Refresh في البداية، نعرض واجهة انتظار نظيفة
  if (isLoading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-background">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  // 2. إذا لم يكن المستخدم مسجلاً، نوجهه لصفحة اللوجين مع حفظ الرابط الذي كان يحاول دخوله
  if (!isAuthenticated) {
    return (
      <Navigate to="/login/pharmacist" state={{ from: location }} replace />
    );
  }

  // 3. إذا كان كل شيء تماماً، اسمح له بالعبور وعرض المسارات الداخلية
  return <Outlet />;
}
