import {z} from 'zod';

export const RegisterDTOSchema = z.object({
    name: z.string().min(1, "Name is required"),
    email: z.string(),
    password: z.string().min(6, "Password must be at least 6 characters long")
});

export const LoginDTOSchema = z.object({
    email: z.string(),
    password: z.string().min(6, "Password must be at least 6 characters long")
});

export const JWTPayloadSchema = z.object({
    id: z.number(),
    name: z.string(),
    email: z.string()
});

export type RegisterDTO = z.infer<typeof RegisterDTOSchema>;
export type LoginDTO = z.infer<typeof LoginDTOSchema>;
export type JWTPayload = z.infer<typeof JWTPayloadSchema>;