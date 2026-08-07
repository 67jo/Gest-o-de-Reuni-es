import api from "@/api/axios";
import { createContext, useEffect, useState, type ReactNode } from "react";


interface AuthContextData{
    user:UserType | null
    loading:boolean
}

export const AuthContext = createContext<AuthContextData | undefined>(undefined)

interface AuthProviderProps{
    children:ReactNode
}

export function AuthProvider({children}:AuthProviderProps){
    const [user, setUser] = useState<UserType | null>(null)
    const [loading, setLoading] = useState(true)

    const refreshUserData = async () =>{
        try{
            const response = await api.get("/me")

            setUser(response.data)
        }
        catch(error){
            setUser(null)
        }
        finally{
            setLoading(false)
        }
    }

    useEffect(()=>{
        refreshUserData()
    },[])

    return(
        <AuthContext.Provider value={{user, loading}}>
            {children}
        </AuthContext.Provider>
    )


}