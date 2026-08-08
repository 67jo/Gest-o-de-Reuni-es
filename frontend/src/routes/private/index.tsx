// routes/PrivateRoute.tsx — CORRIGIDO
import { useAuth } from '@/hooks/useAuth';
import { Navigate } from 'react-router-dom';

export const PrivateRoute = ({ children }: { children: JSX.Element }) => {
  const { user, loading } = useAuth();

  if (loading) {                       // <- estava "!loading"
    return <p>Carregando...</p>;
  }

  if (!user) {
    return <Navigate to={"/"} replace />;
  }

  return children;
};