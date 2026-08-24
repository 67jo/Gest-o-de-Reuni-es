import api from "../api/axios";

class UserServices {
    protected basePath:string
    constructor(basePath:string){
        this.basePath = basePath
    }
    public register = async (data:RegisterData) =>{
       const response = await api.post(`${this.basePath}/register`, data);
       return response.data;
    }
    public login = async (data:SessionType):Promise<SessionResponseType> =>{
       const response = await api.post(`${this.basePath}/session`, data);
       return response.data;
    }
    public getMe = async () =>{
        const response = await api.get(`${this.basePath}/me`)
        return response.data
    }
    public logout = async ():Promise<SessionResponseType> =>{
        const response = await api.delete(`${this.basePath}/logout`)
        return response.data
    }
    public findAll = async () =>{
        const response = await api.get(`${this.basePath}/user-list`)
        return response.data
    }
}

export const userServices = new UserServices("/user");