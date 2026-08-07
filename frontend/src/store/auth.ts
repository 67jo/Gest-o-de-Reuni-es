import {  create } from 'zustand'
import api from '@/api/axios'


interface AuthStore{
    authUser: []
    refresh:() => void
}

export const useAuth = create<AuthStore>((set)=>({
    authUser:[],
    refresh:async ()=>
        set((state)=>({
            
        }))
}))