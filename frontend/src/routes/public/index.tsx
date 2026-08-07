import { Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';



export const PublicRoute = ({ children }: { children: JSX.Element }) => {
    const { user, loading } = useAuth()


    if(!loading){
        return <p>Carregando...</p>
    }

    if(user){
        return <Navigate to={"/dashboard"} replace/>
    }

    return children
};