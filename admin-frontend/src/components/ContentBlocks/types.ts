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
	galleryImages: string[];
	htmlValue: string;
	listItems: string;
	membersValue: MemberEntry[];
	tableHeaders: string[];
	tableRows: string[][];
	tableHeading: string;
	pdfUrl: string;
	pdfTitle: string;
	directorateTitle: string;
	directorateIds: number[];
}

export const blockTypeOptions: BlockType[] = ["text", "image", "gallery", "list", "html", "members", "table", "pdf", "directorate"];
