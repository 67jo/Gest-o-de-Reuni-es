import type { MeetingPayload, ModalMeetingData } from "@/types/meetings";
import api from "../api/axios";
import type { AxiosResponse } from "axios";
import { type MeetingListResponse } from '@/types/meetings';

interface GetAllParams {
    year?: number;
    month?: number; // 1-12
}

class MeetingServices {
    protected basePath:string
    constructor(basePath:string){
        this.basePath = basePath
    }
    public create = async (data:MeetingPayload) =>{
       const response = await api.post(`${this.basePath}/create`, data);
       return response.data;
    } 
    public getMeetingModalData = async () =>{
        const response: AxiosResponse<ModalMeetingData> = await api.get(`${this.basePath}/modal-data`);
        return response.data;
    }
    public getAll = async (params?: GetAllParams) =>{
        const response: AxiosResponse<MeetingListResponse> = await api.get(`${this.basePath}/list-data`, {
            params
        });
        return response.data;
    }
}

export const meetingServices = new MeetingServices("/meeting");