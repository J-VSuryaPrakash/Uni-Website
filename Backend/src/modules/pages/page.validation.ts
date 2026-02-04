import { z } from "zod";
import slugify from "slugify";

const PageStatus = z.enum(["draft", "published", "archived"]);

const SeoMetaSchema = z
	.object({
		title: z.string().max(70).optional(),
		description: z.string().max(160).optional(),
		keywords: z.array(z.string()).optional(),
	})
	.optional()
	.nullable();

const PageBase = z.object({
	title: z.string().min(2).max(200).trim(),
	slug: z.string().max(200).trim().optional(),
	menuId: z.number().int().positive().optional().nullable(),
	parentId: z.number().int().positive().optional().nullable(),
	position: z.number().int().nonnegative().default(0),
	status: PageStatus.default("draft"),
	seoMeta: SeoMetaSchema,
});

const handleSlugAndPosition = (data: any) => ({
	...data,
	slug: data.slug || slugify(data.title, { lower: true, strict: true }),
	position: data.position ?? 0,
});

export const CreatePageSchema = PageBase.transform(handleSlugAndPosition);

export const UpdatePageSchema = PageBase.partial().transform((data) => {
	if (data.title && !data.slug) {
		return {
			...data,
			slug: slugify(data.title, { lower: true, strict: true }),
		};
	}
	return data;
});

export const movePageSchema = z.object({

	menuId: z.number().int().positive("A valid Menu ID is required"),

	parentId: z.number().int().positive().nullable(),

	position: z.number().int().nonnegative(),
});

export type CreatePageDTO = z.infer<typeof CreatePageSchema>;
export type UpdatePageDTO = z.infer<typeof UpdatePageSchema>;
export type MovePageDTO = z.infer<typeof movePageSchema>;