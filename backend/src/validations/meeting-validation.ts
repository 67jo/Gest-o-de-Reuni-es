import z from "zod";
import { MeetingStatus } from "../generated/prisma";


class MeetingValidation{
    meetingData = z.object({
        title: z.string().min(1),
        category: z.string(),
        room: z.string(),
        responsible: z.string(),
        n_participants: z.number(),
        date_start: z.string().datetime(),
        date_end: z.string().datetime(),
        status: z.enum(['PENDENTE', 'DECORRENDO', 'CANCELADA', 'TERMINADA']),
        participant_ids: z.array(z.string()).min(1) // ← novo
    })

      meetingListQuery = z.object({
        year: z.coerce.number().int().optional(),
        month: z.coerce.number().int().min(1).max(12).optional()
    })
}

export const meetingValidation = new MeetingValidation()