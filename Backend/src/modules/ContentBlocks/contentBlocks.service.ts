import { Prisma } from "../../../generated/prisma/client";
import prisma from "../../DB/prisma";
import { ApiError } from "../../utils/apiError";
import type { createContentBlockDTO,UpdatecontentBlockDTO } from "./contentBlocks.validation";

export class ContentBlocksService {
	async createContentBlock(sectionID: number, data: createContentBlockDTO) {
		const section = await prisma.pageSection.findUnique({
			where: { id: sectionID },
		});

		if (!section) {
			throw new ApiError(404, "Page section not found");
		}

		const contentBlock = await prisma.contentBlock.create({
			data: {
				blockType: data.blockType,
				content: data.content,
				position: data.position,
				isVisible: data.isVisible ?? true,
				section: { connect: { id: sectionID } },
			},
		});

		return contentBlock;
	}

	async getBlockBySectionId(sectionID: number) {
		const contentBlocks = await prisma.contentBlock.findMany({
			where: { sectionId: sectionID },
			orderBy: { position: "asc" },
		});

		return contentBlocks;
	}

	async updateContentBlock(blockID: number, data: UpdatecontentBlockDTO) {
		const contentBlock = await prisma.contentBlock.findUnique({
			where: { id: blockID },
		});

		if (!contentBlock) {
			throw new ApiError(404, "Content block not found");
		}

		const updatedBlock = await prisma.contentBlock.update({
			where: { id: blockID },
			data: {
				blockType: (data.blockType !== undefined) ? data.blockType : contentBlock.blockType,
				content: (data.content !== undefined) ? data.content : Prisma.JsonNull,
				position: (data.position !== undefined) ? data.position : contentBlock.position,
				isVisible: (data.isVisible !== undefined) ? data.isVisible : contentBlock.isVisible,
			}
		});

		return updatedBlock;
	}

	async deleteContentBlock(blockID: number) {
		const contentBlock = await prisma.contentBlock.findUnique({
			where: { id: blockID },
		});

		if (!contentBlock) {
			throw new ApiError(404, "Content block not found");
		}

		const deletedBlock = await prisma.contentBlock.delete({
			where: { id: blockID },
		});

		return deletedBlock;
	}

	async reorderContentBlocks(order: { id: number; position: number }[]) {
		return prisma.$transaction(
			order.map((item) =>
				prisma.contentBlock.update({
					where: { id: item.id },
                    data: { position: item.position },
                    select: { id: true, position: true }
				})
			)
		);
	}
}