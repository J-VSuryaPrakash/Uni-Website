import prisma from "../../DB/prisma";
import { ApiError } from "../../utils/apiError";
import type { CreateMenuDTO } from "./menu.validation";

export default class MenuService {
	async CreateMenu(data: CreateMenuDTO) {
		const existingMenu = await prisma.menu.findFirst({
			where: { slug: data.slug },
		});

		if (existingMenu) {
			throw new ApiError(
				400,
				"Menu with this slug is already exsits in the database"
			);
		}

		return prisma.menu.create({
			data: {
				name: data.name,
				slug: data.slug,
				position: data.position,
				isActive: data.isActive ?? true,
			},
		});
	}

	async UpdateMenu(id: number, data: Partial<CreateMenuDTO>) {
		const Menu = await prisma.menu.findUnique({
			where: { id },
		});

		if (!Menu) {
			throw new ApiError(404, "Menu not found");
		}

		return prisma.menu.update({
			where: { id },
			data,
		});
	}

	async DeleteMenu(id: number) {
		const Menu = await prisma.menu.findUnique({
			where: { id },
		});

		if (!Menu) {
			throw new ApiError(404, "Menu not found");
		}

		return prisma.menu.delete({
			where: { id },
		});
	}

	async getAllMenus() {
		return prisma.menu.findMany({
			orderBy: { position: "asc" },
		});
	}

	async getMenuById(id: number) {
		const Menu = await prisma.menu.findUnique({
			where: { id },
		});

		if (!Menu) {
			throw new ApiError(404, "Menu not found");
		}

		return Menu;
	}

	async reorderMenus(order: { id: number; position: number }[]) {
		return prisma.$transaction(
			order.map((item) =>
				prisma.menu.update({
					where: { id: item.id },
					data: { position: item.position },
				})
			)
		);
	}

	async getPublicMenus() {
		return prisma.menu.findMany({
			where: { isActive: true },
			orderBy: { position: "asc" },
		});
	}
}
