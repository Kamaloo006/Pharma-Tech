export type AuthRole = "pharmacist" | "admin";

export type AuthSession = {
  role: AuthRole;
  identifier: string;
  signedInAt: string;
};

const AUTH_SESSION_KEY = "pharma-tech-auth-session";

const isAuthRole = (value: unknown): value is AuthRole =>
  value === "pharmacist" || value === "admin";

export const getAuthSession = (): AuthSession | null => {
  const storedSession = window.sessionStorage.getItem(AUTH_SESSION_KEY);

  if (!storedSession) {
    return null;
  }

  try {
    const parsedSession = JSON.parse(storedSession) as Partial<AuthSession>;

    if (
      !parsedSession ||
      !isAuthRole(parsedSession.role) ||
      typeof parsedSession.identifier !== "string" ||
      typeof parsedSession.signedInAt !== "string"
    ) {
      return null;
    }

    return parsedSession as AuthSession;
  } catch {
    return null;
  }
};

export const setAuthSession = (session: {
  role: AuthRole;
  identifier: string; // email 
}) => {
  const authSession: AuthSession = {
    ...session,
    signedInAt: new Date().toISOString(),
  };

  window.sessionStorage.setItem(AUTH_SESSION_KEY, JSON.stringify(authSession));
};

export const clearAuthSession = () => {
  window.sessionStorage.removeItem(AUTH_SESSION_KEY);
};