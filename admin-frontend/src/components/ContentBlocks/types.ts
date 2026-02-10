import type { BlockType } from "@/types/ContentBlocks.types";

export interface BlockFormState {
	blockType: BlockType;
	position: number;
	isVisible: boolean;
	textValue: string;
	imageUrl: string;
	imageAlt: string;
	htmlValue: string;
	listItems: string;
}

export const blockTypeOptions: BlockType[] = ["text", "image", "list", "html"];
