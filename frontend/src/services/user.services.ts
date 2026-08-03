import api from "../api/axios";





class UserServices {
    public register = async (data:UserType) =>{
       const response = await api.post('/register', data);
       return response;
    }
}

export const userServices = new UserServices()