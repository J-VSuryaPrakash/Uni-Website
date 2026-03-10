import type { BlockType } from "@/types/ContentBlocks.types";

export interface MemberEntry {
	name: string;
	role: string;
	photo: string;
	designation: string;
	department: string;
	email: string;
	phone: string;
}

export interface BlockFormState {
	blockType: BlockType;
	position: number;
	isVisible: boolean;
	textValue: string;
	imageUrl: string;
	imageAlt: string;
	htmlValue: string;
	listItems: string;
	membersValue: MemberEntry[];
}

export const blockTypeOptions: BlockType[] = ["text", "image", "list", "html", "members"];
