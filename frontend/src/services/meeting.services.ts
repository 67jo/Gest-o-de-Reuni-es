import type { MeetingPayload, ModalMeetingData } from "@/types/meetings";
import api from "../api/axios";
import type { AxiosResponse } from "axios";

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
}

export const meetingServices = new MeetingServices("/meeting");