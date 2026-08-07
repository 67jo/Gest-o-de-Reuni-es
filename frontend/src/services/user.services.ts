import api from "../api/axios";

class UserServices {
    protected basePath:string
    constructor(basePath:string){
        this.basePath = basePath
    }
    public register = async (data:UserType) =>{
       const response = await api.post(`${this.basePath}/register`, data);
       return response.data;
    }
    public login = async (data:SessionType):Promise<SessionResponseType> =>{
       const response = await api.post(`${this.basePath}/session`, data);
       return response.data;
    }
}

export const userServices = new UserServices("/user");