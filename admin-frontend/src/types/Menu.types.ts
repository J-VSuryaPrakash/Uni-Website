import type { BaseEntity } from "./Common.types";
import type { Page } from "./Page.types";

export interface Menu extends BaseEntity {
	name: string;
	slug: string;
	position: number;
	isActive: boolean;
	pages?: Page[]; // only present in tree API
}

export interface CreateMenuDTO {
	name: string;
	slug: string;
	position: number;
	isActive?: boolean;
}

export interface UpdateMenuDTO extends Partial<CreateMenuDTO> {}
