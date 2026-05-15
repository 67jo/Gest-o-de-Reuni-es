import { Navigate } from 'react-router-dom';


export const PublicRoute = ({ children }: { children: JSX.Element }) => {
    const token = localStorage.getItem('@ExecutiveLens:token');
    return !token ? children : <Navigate to="/dashboard" replace />;
};