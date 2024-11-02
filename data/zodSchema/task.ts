import { Attachment } from '@/lib/types'
import { z } from 'zod'

export const taskSchema = z.object({
    task_id: z.number(),
    task_num: z.string(),
    apparel_name: z.string(),
    type: z.string(),
    description: z.string(),
    priority: z.string(),
    solicited_date: z.string(),
    specialty: z.string(),
    state: z.string(),
    attachment: z.array(z.custom<Attachment>()).nullable().optional(),
    client_code: z.string(),
    client_name: z.string(),
    IsHistoric: z.boolean(),
    total: z.number().optional(),
})
