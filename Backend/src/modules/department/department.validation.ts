import {z} from 'zod';

const DepartmentSchema = z.object({
  name: z.string().min(1, 'Department name is required'),
});

export const createDepartmentSchema = DepartmentSchema;
export const updateDepartmentSchema = DepartmentSchema.partial();

export  type CreateDepartmentDTO = z.infer<typeof createDepartmentSchema>;
export  type UpdateDepartmentDTO = z.infer<typeof updateDepartmentSchema>;