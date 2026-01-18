import {z} from "zod";

const pageDirectorate = z.object({
    pageId: z.number().int().positive(),
    directorateId: z.number().int().positive(),
    position: z.number().int().nonnegative().optional().default(0)
})

export const createPageDirectorate = pageDirectorate
export const updatePageDirectorate = pageDirectorate.optional()


export type CreatePageDirectorateDTO = z.infer<typeof createPageDirectorate>;
export type UpdatePageDirectorateDTO = z.infer<typeof updatePageDirectorate>;