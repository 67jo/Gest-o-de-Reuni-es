// routes/PublicRoute.tsx — CORRIGIDO (adiciona loading pra evitar flash da tela de login)
import { useAuth } from '@/hooks/useAuth';
import { Navigate } from 'react-router-dom';

export const PublicRoute = ({ children }: { children: JSX.Element }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <p>Carregando...</p>;
  }

  if (user) {
    return <Navigate to={"/dashboard"} replace />;
  }

  return children;
};