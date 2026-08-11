import z from "zod";
import { MeetingStatus } from "../generated/prisma";


class MeetingValidation{
    meetingData = z.object({
        title:z.string(),
        category:z.string(),
        room:z.string(),
        n_participants:z.number(),
        responsible:z.string(),
        date_start:z.string().datetime(),
        date_end:z.string().datetime(),
        status:z.enum(MeetingStatus),
         
    })
}

export const meetingValidation = new MeetingValidation()