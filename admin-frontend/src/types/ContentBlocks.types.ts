import type { BaseEntity } from "./Common.types";

export type BlockType = "text" | "image" | "list" | "html";

export interface ContentBlock extends BaseEntity {
	sectionId: number;
	blockType: BlockType;
	content: Record<string, any>;
	position: number;
	isVisible: boolean;
}

export interface CreateBlockDTO {
	blockType: BlockType;
	content: Record<string, any>;
	position: number;
	isVisible?: boolean;
}

export interface UpdateBlockDTO extends Partial<CreateBlockDTO> {}
