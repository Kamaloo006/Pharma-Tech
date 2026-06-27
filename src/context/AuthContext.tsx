import { setGlobalAccessToken } from "@/lib/api";
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
    remember: boolean,
  ) => void;
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
    const initializeAuth = async () => {
      const storedUser =
        localStorage.getItem("user") || sessionStorage.getItem("user");
      const storedPharmacy =
        localStorage.getItem("pharmacy") || sessionStorage.getItem("pharmacy");
      const storedRefreshToken =
        localStorage.getItem("refresh_token") ||
        sessionStorage.getItem("refresh_token");
      const storedAccessToken =
        localStorage.getItem("access_token") ||
        sessionStorage.getItem("access_token");

      if (storedUser && storedRefreshToken && storedAccessToken) {
        try {
          // 1. شحن البيانات المبدئية في الـ State فوراً لتقليل الـ Flicker
          const parsedUser = JSON.parse(storedUser);
          setUser(parsedUser);
          setAccessToken(storedAccessToken);
          setGlobalAccessToken(storedAccessToken);

          if (storedPharmacy) {
            setPharmacy(JSON.parse(storedPharmacy));
          }
        } catch (error) {
          console.error("Auth initialization failed:", error);
          // إذا كانت البيانات تالفة في الـ Storage، نقوم بالتنظيف
          logout();
        }
      } else {
        // إذا لم يجد توكنز، يتأكد من تصفير الـ States
        setUser(null);
        setAccessToken(null);
        setPharmacy(null);
      }
      setIsLoading(false);
    };

    initializeAuth();
  }, []);

  const setAuthData = (
    accessTokenValue: string,
    refreshToken: string,
    newUser: User,
    newPharmacy: Pharmacy | null,
    remember: boolean,
  ) => {
    setAccessToken(accessTokenValue);
    setUser(newUser);
    setPharmacy(newPharmacy);

    const storage = remember ? localStorage : sessionStorage;

    storage.setItem("access_token", accessTokenValue);
    storage.setItem("refresh_token", refreshToken);
    storage.setItem("user", JSON.stringify(newUser));

    if (newPharmacy) {
      storage.setItem("pharmacy", JSON.stringify(newPharmacy));
    } else {
      storage.removeItem("pharmacy");
    }

    const alternativeStorage = remember ? sessionStorage : localStorage;
    alternativeStorage.removeItem("access_token");
    alternativeStorage.removeItem("refresh_token");
    alternativeStorage.removeItem("user");
    alternativeStorage.removeItem("pharmacy");

    setGlobalAccessToken(accessTokenValue);
  };

  const login = async (email: string, password: string) => {};

  const setAccessTokenOnly = (token: string) => {
    setAccessToken(token);
    setGlobalAccessToken(token);

    if (localStorage.getItem("access_token")) {
      localStorage.setItem("access_token", token);
    } else if (sessionStorage.getItem("access_token")) {
      sessionStorage.setItem("access_token", token);
    }
  };

  const logout = () => {
    setAccessToken(null);
    setUser(null);
    setPharmacy(null);

    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("user");
    localStorage.removeItem("pharmacy");

    sessionStorage.removeItem("access_token");
    sessionStorage.removeItem("refresh_token");
    sessionStorage.removeItem("user");
    sessionStorage.removeItem("pharmacy");

    toast.success(t("auth.logoutSuccessful"), {
      description: t("auth.logoutSuccessDesc"),
    });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        accessToken,
        pharmacy,
        // ✨ التصحيح الجوهري: نعتمد على وجود كائن المستخدم والتوكن الفعليين في الذاكرة الحية للتطبيق
        isAuthenticated: !!accessToken && !!user,
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
