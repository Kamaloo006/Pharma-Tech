import { setGlobalAccessToken } from "@/lib/api";
import * as authApi from "@/services/api/auth";
import type { Pharmacy } from "@/types/Pharmacy";
import type { User } from "@/types/User";
import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

interface AuthContextType {
  user: User | null;
  pharmacy: Pharmacy | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  setAuthData: (
    accessToken: string,
    refreshToken: string,
    user: User,
    pharmacy: Pharmacy | null,
  ) => void; // 👈 أضفنا الصيدلية هنا
  setAccessTokenOnly: (token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [pharmacy, setPharmacy] = useState<Pharmacy | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { t } = useTranslation();

  useEffect(() => {
    const initializeAuth = () => {
      const storedUser = localStorage.getItem("user");
      const storedPharmacy = localStorage.getItem("pharmacy");
      const storedRefreshToken = localStorage.getItem("refresh_token");

      if (storedUser && storedRefreshToken) {
        setUser(JSON.parse(storedUser));

        if (storedPharmacy) {
          setPharmacy(JSON.parse(storedPharmacy));
        }
      }
      setIsLoading(false);
    };

    initializeAuth();
  }, []);

  // 2. تحديث دالة ضخ البيانات لتستقبل وتخزن الـ pharmacy
  const setAuthData = (
    accessToken: string,
    refreshToken: string,
    newUser: User,
    newPharmacy: Pharmacy | null, // 👈 استقبال الصيدلية قادمة من الـ Login أو الـ Setup
  ) => {
    setAccessToken(accessToken);
    setUser(newUser);
    setPharmacy(newPharmacy); // 👈 تحديث الـ State

    localStorage.setItem("refresh_token", refreshToken);
    localStorage.setItem("user", JSON.stringify(newUser));

    // حفظ الصيدلية محلياً أو مسحها إذا كانت null
    if (newPharmacy) {
      localStorage.setItem("pharmacy", JSON.stringify(newPharmacy));
    } else {
      localStorage.removeItem("pharmacy");
    }

    setGlobalAccessToken(accessToken);
  };

  const login = async (email: string, password: string) => {
    const response = await authApi.login({ email, password });
    const payload = response?.data?.data ?? response?.data ?? response;

    const userData = payload.user;
    const pharmacyData = payload.pharmacy ?? null; // 👈 استخراج الصيدلية من نفس مستوى الـ user كما يرسلها الباكيند
    const accessTokenValue =
      userData?.access_token ?? payload?.access_token ?? payload?.token;
    const refreshTokenValue = userData?.refresh_token ?? payload?.refresh_token;

    if (!userData || !accessTokenValue || !refreshTokenValue) {
      throw new Error("Invalid login response");
    }

    // تمرير الصيدلية للدالة المخزِنة
    setAuthData(accessTokenValue, refreshTokenValue, userData, pharmacyData);
  };

  const setAccessTokenOnly = (token: string) => {
    setAccessToken(token);
    setGlobalAccessToken(token);
  };

  const logout = () => {
    setAccessToken(null);
    setUser(null);
    setPharmacy(null); // 👈 تصفير الصيدلية عند الخروج
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("user");
    localStorage.removeItem("pharmacy"); // 👈 مسح كاش الصيدلية

    toast.success(t("auth.logoutSuccessful"), {
      description: t("auth.logoutSuccessDesc"),
    });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        accessToken,
        pharmacy, // 👈 تمرير الـ State النظيفة والآمنة بدون كاستنج عشوائي
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
