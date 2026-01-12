import prisma from "../../DB/prisma";
import { ApiError } from "../../utils/apiError";
import type {
	CreatePageDTO,
	UpdatePageDTO,
	MovePageDTO,
} from "./page.validation";

export default class PageService {
	async Createpage(data: CreatePageDTO) {
		const existingPage = await prisma.page.findFirst({
			where: { slug: data.slug! },
		});

		if (existingPage) {
			throw new ApiError(
				400,
				"Page with this slug is already exists in the database"
			);
		}

		const page = await prisma.page.create({
			data: {
				title: data.title,
				slug: data.slug,
				position: data.position,
				status: data.status,
				seoMeta: data.seoMeta ?? {},
				...(data.menuId && { menu: { connect: { id: data.menuId } } }),
				...(data.parentId && {
					parent: { connect: { id: data.parentId } },
				}),
			},
		});

		return page;
	}

	async getAllpages() {
		const pages = await prisma.page.findMany();

		return pages;
	}

	async getPageById(id: number) {
		const page = await prisma.page.findUnique({
			where: { id },
		});

		if (!page) {
			throw new ApiError(404, "Page not found");
		}

		return page;
	}

	async updatePage(id: number, data: UpdatePageDTO) {
		const page = await prisma.page.findUnique({
			where: { id },
		});

		if (!page) {
			throw new ApiError(404, "Page not found");
		}

		const { menuId, parentId, ...rest } = data;

		const updateData: Record<string, any> = {};

		for (const [key, value] of Object.entries(rest)) {
			if (value !== undefined) {
				updateData[key] = value;
			}
		}

		if (menuId !== undefined) {
			updateData.menu =
				menuId === null
					? { disconnect: true }
					: { connect: { id: menuId } };
		}

		if (parentId !== undefined) {
			updateData.parent =
				parentId === null
					? { disconnect: true }
					: { connect: { id: parentId } };
		}

		const updatedPage = await prisma.page.update({
			where: { id },
			data: updateData,
		});

		return updatedPage;
	}

	async deletePage(id: number) {
		const page = await prisma.page.findUnique({
			where: { id },
		});

		if (!page) {
			throw new ApiError(404, "Page not found");
		}

		const deletedPage = await prisma.page.delete({
			where: { id },
		});

		return deletedPage;
	}

	async movePage(id: number, data: MovePageDTO) {
		const page = await prisma.page.findUnique({
			where: { id },
		});

		if (!page) {
			throw new ApiError(404, "Page not found");
		}

		const movedPage = await prisma.page.update({
			where: { id },
			data: {
				position: data.position,
				menu: { connect: { id: data.menuId } },
				parent:
					data.parentId === null
						? { disconnect: true }
						: { connect: { id: data.parentId } },
			},
		});

		return movedPage;
	}

	async reorderPages(order: { id: number; position: number }[]) {
		try {
			const updates = await prisma.$transaction(
				order.map((item) =>
					prisma.page.update({
						where: { id: item.id },
						data: { position: item.position },
						select: { id: true, position: true },
					})
				)
			);

			return updates;
		} catch (error) {
			throw new ApiError(
				500,
				"Failed to reorder pages. One or more IDs may be invalid."
			);
		}
	}

	async getPageBySlug(slug: string) {
		const page = await prisma.page.findFirst({
			where: {
				slug,
				status: "published",
			},
			include: {
				sections: {
					orderBy: { position: "asc" },
				},
				parent: {
					select: {
						title: true,
						slug: true,
					},
				},
				children: {
					where: { status: "published" },
					orderBy: { position: "asc" },
					select: {
						title: true,
						slug: true,
						position: true,
					},
				},
			},
		});

		if (!page) {
			throw new ApiError(404, "Page not found");
		}

		return page;
	}
}
