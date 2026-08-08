// context/AuthContext.tsx — CORRIGIDO
import { createContext, useCallback, useEffect, useState, type ReactNode } from "react";
import { userServices } from "@/services/user.services";

interface AuthContextData {
  user: UserType | null;
  loading: boolean;
  refreshUserData: () => Promise<void>; // <- exposto
}

export const AuthContext = createContext<AuthContextData | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<UserType | null>(null);
  const [loading, setLoading] = useState(false); // <- true por padrão, evita redirect prematuro

  const refreshUserData = useCallback(async () => {
    try {
      setLoading(true);
      const response = await userServices.getMe();
      setUser(response.data);
    } catch (error) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshUserData();
  }, [refreshUserData]);

  return (
    <AuthContext.Provider value={{ user, loading, refreshUserData }}>
      {children}
    </AuthContext.Provider>
  );
}