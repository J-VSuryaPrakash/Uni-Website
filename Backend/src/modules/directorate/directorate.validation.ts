import { z } from 'zod';

const ProfileSchema = z.object({
    title: z.string().min(2).max(200).trim().optional(),

    qualifications: z.array(
        z.string().min(2).max(200).trim()
    ).optional(),

    address: z.object({
        college: z.string().min(2).max(200).trim(),
        university: z.string().min(2).max(200).trim(),
        pincode: z.string().min(2).max(20).trim(),
        state: z.string().min(2).max(100).trim(),
    }).optional(),

    contact: z.object({
        email: z.string().optional(),
        website: z.string().optional(),
        phone: z.string().optional(),
    }).optional(),
})
.optional()
.nullable();


const DirectorateSchema = z.object({
    name: z.string().min(2).max(100).trim(),
    designationId: z.number().int().optional(),
    departmentId: z.number().int().optional(),
    photoUrl: z.string().optional().nullable(),
    profile: ProfileSchema,
    isActive: z.boolean().default(true)
})


export const createDirectorateSchema = DirectorateSchema;
export const updateDirectorateSchema = DirectorateSchema.partial();

export type createDirectorateDTO = z.infer<typeof createDirectorateSchema>;
export type updateDirectorateDTO = z.infer<typeof updateDirectorateSchema>;