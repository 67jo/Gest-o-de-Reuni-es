// context/AuthContext.tsx
import { createContext, useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { userServices } from "@/services/user.services";

interface AuthContextData {
  user: UserType | null;
  loading: boolean;
  refreshUserData: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextData | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<UserType | null>(null);
  const [loading, setLoading] = useState(true);
  const requestIdRef = useRef(0);

  const refreshUserData = useCallback(async () => {
    const currentRequestId = ++requestIdRef.current;
    try {
      setLoading(true);
      const response = await userServices.getMe();
      if (currentRequestId === requestIdRef.current) {
        setUser(response);
      }
    } catch (error) {
      if (currentRequestId === requestIdRef.current) {
        setUser(null);
      }
    } finally {
      if (currentRequestId === requestIdRef.current) {
        setLoading(false);
      }
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