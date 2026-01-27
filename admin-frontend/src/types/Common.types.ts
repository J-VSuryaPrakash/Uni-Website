export interface BaseEntity {
	id: number;
	createdAt: string;
}

export interface ReorderPayload {
	id: number;
	position: number;
}

export type Status = "draft" | "published";
