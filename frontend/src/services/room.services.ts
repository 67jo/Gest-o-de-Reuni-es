import api from "../api/axios";
import type { AxiosResponse } from "axios";

class RoomServices {
    protected basePath: string
    constructor(basePath: string) {
        this.basePath = basePath
    }

    public getAll = async () => {
        const response: AxiosResponse<Room[]> = await api.get(`${this.basePath}/list`);
        return response.data;
    }

    public create = async (data: RoomPayload) => {
        const response: AxiosResponse<Room> = await api.post(`${this.basePath}/create`, data);
        return response.data;
    }

    public remove = async (id: string) => {
        await api.delete(`${this.basePath}/${id}`);
    }
}

export const roomServices = new RoomServices("/room");