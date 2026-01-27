import type { BaseEntity } from "./Common.types";
import type { ContentBlock } from "./ContentBlocks.types";

export interface PageSection extends BaseEntity {
	title?: string;
	position: number;
	pageId: number;
	contentBlocks?: ContentBlock[];
}

export interface CreateSectionDTO {
	title?: string;
	position: number;
}

export interface UpdateSectionDTO extends Partial<CreateSectionDTO> {}
