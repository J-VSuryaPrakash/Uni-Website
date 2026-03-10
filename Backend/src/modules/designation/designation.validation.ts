import { z } from "zod";
import { DesignationCategory } from "../../../generated/prisma/client";

const DesignationBase = z.object({
    title: z.string().min(2).max(100).trim(),
    priority: z.number().int().nonnegative(),
    category: z.nativeEnum(DesignationCategory).default(DesignationCategory.ADMINISTRATION),
});

export const CreateDesignationSchema = DesignationBase;

export const UpdateDesignationSchema = DesignationBase.partial();

export type CreateDesignationDTO = z.infer<typeof CreateDesignationSchema>;
export type UpdateDesignationDTO = z.infer<typeof UpdateDesignationSchema>;
