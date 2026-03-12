import prisma from "../../DB/prisma";
import { ApiError } from "../../utils/apiError";
import type {
	CreatePageDTO,
	MovePageDTO,
	UpdatePageDTO,
} from "./page.validation";

export default class PageService {
	private async getParentMenuId(parentId: number) {
		const parent = await prisma.page.findUnique({
			where: { id: parentId },
			select: { menuId: true },
		});

		if (!parent) {
			throw new ApiError(404, "Parent page not found");
		}

		return parent.menuId ?? null;
	}

	async Createpage(data: CreatePageDTO) {
		const existingPage = await prisma.page.findFirst({
			where: { slug: data.slug! },
		});

		if (existingPage) {
			throw new ApiError(
				400,
				"Page with this slug is already exists in the database",
			);
		}

		let resolvedMenuId = data.menuId ?? null;
		if (data.parentId) {
			const parentMenuId = await this.getParentMenuId(data.parentId);
			if (resolvedMenuId !== null && parentMenuId !== resolvedMenuId) {
				throw new ApiError(
					400,
					"Parent and child pages must share the same menu",
				);
			}
			resolvedMenuId = parentMenuId;
		}

		const page = await prisma.page.create({
			data: {
				title: data.title,
				slug: data.slug,
				position: data.position,
				status: data.status,
				seoMeta: data.seoMeta ?? {},
				...(resolvedMenuId && {
					menu: { connect: { id: resolvedMenuId } },
				}),
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
		const nextParentId = parentId !== undefined ? parentId : page.parentId;
		let resolvedMenuId =
			menuId !== undefined ? menuId : (page.menuId ?? null);

		if (nextParentId !== null && nextParentId !== undefined) {
			const parentMenuId = await this.getParentMenuId(nextParentId);
			if (menuId !== undefined && parentMenuId !== menuId) {
				throw new ApiError(
					400,
					"Parent and child pages must share the same menu",
				);
			}
			resolvedMenuId = parentMenuId;
		}

		const updateData: Record<string, any> = {};

		for (const [key, value] of Object.entries(rest)) {
			if (value !== undefined) {
				updateData[key] = value;
			}
		}

		if (
			menuId !== undefined ||
			(nextParentId !== null && resolvedMenuId !== page.menuId)
		) {
			updateData.menu =
				resolvedMenuId === null
					? { disconnect: true }
					: { connect: { id: resolvedMenuId } };
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

		if (data.parentId !== null) {
			const parentMenuId = await this.getParentMenuId(data.parentId);
			if (parentMenuId !== data.menuId) {
				throw new ApiError(
					400,
					"Parent and child pages must share the same menu",
				);
			}
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
					}),
				),
			);

			return updates;
		} catch (error) {
			throw new ApiError(
				500,
				"Failed to reorder pages. One or more IDs may be invalid.",
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
					include: {
						contentBlocks: {
							where: { isVisible: true },
							orderBy: { position: "asc" },
						},
					},
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

		// Resolve directorate blocks: embed full directorate data into block content
		const directorateIds = new Set<number>();
		for (const section of page.sections) {
			for (const block of section.contentBlocks) {
				if (block.blockType === "directorate") {
					const content = block.content as Record<string, any>;
					const ids: number[] = content?.directorateIds ?? [];
					for (const id of ids) directorateIds.add(id);
				}
			}
		}

		if (directorateIds.size > 0) {
			const directorates = await prisma.directorate.findMany({
				where: { id: { in: [...directorateIds] }, isActive: true },
				include: {
					designations: { include: { designation: true } },
					department: true,
					photo: true,
				},
			});

			const directorateMap = new Map(directorates.map((d) => [d.id, d]));

			for (const section of page.sections) {
				for (const block of section.contentBlocks) {
					if (block.blockType === "directorate") {
						const content = block.content as Record<string, any>;
						const ids: number[] = content?.directorateIds ?? [];
						(block.content as Record<string, any>).directorates =
							ids
								.map((id) => directorateMap.get(id))
								.filter(Boolean);
					}
				}
			}
		}

		const breadcrumbs = await this.buildBreadcrumbs(page.id);

		return { ...page, breadcrumbs };
	}

	private async buildBreadcrumbs(pageId: number) {
		const breadcrumbs = [];

		let current = await prisma.page.findUnique({
			where: { id: pageId },
			select: {
				id: true,
				title: true,
				slug: true,
				parentId: true,
			},
		});

		while (current) {
			breadcrumbs.unshift({
				title: current.title,
				slug: current.slug,
			});

			if (!current.parentId) break;

			current = await prisma.page.findUnique({
				where: { id: current.parentId },
				select: {
					id: true,
					title: true,
					slug: true,
					parentId: true,
				},
			});
		}

		return breadcrumbs;
	}
}
