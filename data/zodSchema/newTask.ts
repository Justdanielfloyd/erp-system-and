import z from 'zod'

export const newTaskFormSchema = z.object({
    client: z.string({
        message: 'Seleccioneu un client.',
    }),
    location: z.string().optional(),
    apparel: z
        .string({
            message: 'Selecciona un aparell',
        })
        .optional(),
    type: z.string().optional(),
    priority: z.string().optional(),
    date: z.date({
        message: 'Es requereix una data.',
    }),
    specialty: z.string().optional(),
    description: z
        .string({
            message: 'Cal introduir el treball realitzat',
        })
        .max(160, { message: 'La descripció no pot superar 160 caràcters' })
        .min(1, { message: 'Cal introduir el treball realitzat' }),
})

export type TNewTaskFormSchema = z.infer<typeof newTaskFormSchema>

export type TNewTaskFormWithAttachments = TNewTaskFormSchema & {
    attachments?: File[]
}
