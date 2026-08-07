import { BrowserRouter, Route, Routes } from "react-router-dom"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import Dashboard from "../pages/Dashboard"
import LoginPage from "../pages/LoginPage"
import Salas from "../pages/Salas"
import { PrivateRoute } from "./private"
import { PublicRoute } from "./public"
import { Navigate } from 'react-router-dom';
import { PrivateLayout } from "../layouts/PrivateLayout";
import RegisterPage from "../pages/RegisterPage"


// Crie o cliente fora do componente
const queryClient = new QueryClient()

function Router(){
    return(
        <QueryClientProvider client={queryClient}>
            <BrowserRouter>
                <Routes>
                    {/* Rota de Login: Só acessa se NÃO estiver logado */}
                    <Route 
                        path="/" 
                        element={
                            <PublicRoute>
                                <LoginPage />
                            </PublicRoute>
                        } 
                    />

                    <Route 
                        path="/register" 
                        element={
                            <PublicRoute>
                                <RegisterPage  />
                            </PublicRoute>
                        } 
                    />

                    {/* ROTAS PRIVADAS AGRUPADAS NO LAYOUT */}
                    <Route 
                        element={
                            <PrivateRoute>
                                <PrivateLayout />
                            </PrivateRoute>
                        }
                    >
                        {/* Todas as rotas colocadas aqui dentro terão o Aside e o Header automaticamente */}
                        <Route path="/dashboard" element={<Dashboard />} />
                        <Route path="/salas" element={<Salas />} /> 
                    </Route>

                    <Route path="*" element={<Navigate to="/" />} />
                </Routes>
            </BrowserRouter>
        </QueryClientProvider>
    )
}

export default Router