import api from "../api/axios";
import type { AxiosResponse } from "axios";

interface GetAllParams {
    year?: number;
    month?: number; // 1-12
}

class RoomServices {
    protected basePath:string
    constructor(basePath:string){
        this.basePath = basePath
    }
   
    public getAll = async (params?: GetAllParams) =>{
        const response: AxiosResponse<Room> = await api.get(`${this.basePath}/list`, {
            params
        });
        return response.data;
    }
}

export const roomServices = new RoomServices("/room");