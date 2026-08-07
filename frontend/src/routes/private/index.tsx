import { useAuth } from '@/hooks/useAuth';
import { Navigate } from 'react-router-dom';


// Este componente verifica se o usuário está autenticado
export const PrivateRoute = ({ children }: { children: JSX.Element }) => {
    const {user, loading} = useAuth()


    if(!loading){
      return <p>carregando...</p>
    }

    if(!user){
      return <Navigate to={"/login"} replace/>
    }

    return children
};