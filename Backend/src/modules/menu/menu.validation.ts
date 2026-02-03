import { z } from "zod";
import slugify from "slugify";

const MenuBase = z.object({
	name: z.string().min(2).max(100).trim(),
	slug: z.string().max(100).trim().optional(),
	position: z.number().int().nonnegative(),
	isActive: z.boolean().default(true),
});

const handleSlug = (data: any) => ({
	...data,
	slug: data.slug || slugify(data.name, { lower: true, strict: true }),
});

export const CreateMenuSchema = MenuBase.transform(handleSlug);

export const UpdateMenuSchema = MenuBase.partial().transform((data) => {
	if (data.name && !data.slug) {
		return {
			...data,
			slug: slugify(data.name, { lower: true, strict: true }),
		};
	}
	return data;
});

export type CreateMenuDTO = z.infer<typeof CreateMenuSchema>;
