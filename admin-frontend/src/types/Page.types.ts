import type { BaseEntity, Status } from "./Common.types";
import type { PageSection } from "./PageSection.types";
import type { Faculty } from "./Faculty.types";

export interface Breadcrumb {
	title: string;
	slug: string;
}

export interface Page extends BaseEntity {
	title: string;
	slug: string;
	position: number;
	status: Status;

	menuId?: number | null;
	parentId?: number | null;

	children?: Page[];
	sections?: PageSection[];
	breadcrumbs?: Breadcrumb[];
	faculty?: Faculty[];
}

export interface CreatePageDTO {
	title: string;
	slug: string;
	menuId?: number;
	parentId?: number | null;
	position: number;
	status?: Status;
	seoMeta?: Record<string, any>;
}

export interface MovePageDTO {
	menuId?: number;
	parentId?: number | null;
	position: number;
}
