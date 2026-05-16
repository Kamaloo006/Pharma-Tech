import { setGlobalAccessToken } from "@/lib/api";
import * as authApi from "@/services/api/auth";
import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import { toast } from "sonner";

export interface User {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  setAuthData: (accessToken: string, refreshToken: string, user: User) => void;
  setAccessTokenOnly: (token: string) => void; // سنحتاجها عند تجديد التوكن تلقائياً
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null); // يُحفظ في الذاكرة فقط للأمان
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = () => {
      const storedUser = localStorage.getItem("user");
      const storedRefreshToken = localStorage.getItem("refresh_token");

      // إذا كان هناك ريفريش توكن ومستخدم، نعتبره مسجلاً مبدئياً ونطلب له Access Token جديد
      if (storedUser && storedRefreshToken) {
        setUser(JSON.parse(storedUser));
        // ملاحظة: الـ Interceptor في ملف الـ api.ts سيتولى جلب الـ access_token الأول تلقائياً
      }
      setIsLoading(false);
    };

    initializeAuth();
  }, []);

  // دالة ضخ البيانات بالكامل عند النجاح (Verification أو Login)
  const setAuthData = (
    accessToken: string,
    refreshToken: string,
    newUser: User,
  ) => {
    setAccessToken(accessToken);
    setUser(newUser);
    localStorage.setItem("refresh_token", refreshToken);
    localStorage.setItem("user", JSON.stringify(newUser));
    setGlobalAccessToken(accessToken);
  };

  const login = async (email: string, password: string) => {
    const response = await authApi.login({ email, password });
    const payload = response?.data?.data ?? response?.data ?? response;
    const userData = payload.user;
    const accessTokenValue = payload.access_token ?? payload.token;
    const refreshTokenValue = payload.refresh_token;

    if (!userData || !accessTokenValue || !refreshTokenValue) {
      throw new Error("Invalid login response");
    }

    setAuthData(accessTokenValue, refreshTokenValue, userData);
  };

  const setAccessTokenOnly = (token: string) => {
    setAccessToken(token);
    setGlobalAccessToken(token);
  };

  const logout = () => {
    setAccessToken(null);
    setUser(null);
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("user");

    toast.info("تم تسجيل الخروج بنجاح");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        accessToken,
        // يعتبر محمي طالما لديه طريقة لتجديد التوكن (refresh_token موجود)
        isAuthenticated: !!localStorage.getItem("refresh_token"),
        isLoading,
        login,
        setAuthData,
        setAccessTokenOnly,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined)
    throw new Error("useAuth must be used within an AuthProvider");
  return context;
}
