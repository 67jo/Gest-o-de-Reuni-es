import { Navigate } from 'react-router-dom';

// Este componente verifica se o usuário está autenticado
export const PrivateRoute = ({ children }: { children: JSX.Element }) => {
  const token = localStorage.getItem('@ExecutiveLens:token');
  
  // Se não tem token, redireciona para o login (/)
  return token ? children : <Navigate to="/" replace />;
};