import type { BaseEntity } from "./Common.types";

export interface Designation {
	id: number;
	title: string;
	priority: number;
}

export interface Department {
	id: number;
	name: string;
}

export interface Faculty extends BaseEntity {
	name: string;
	photoUrl?: string;
	profile?: Record<string, any>;
	isActive: boolean;
	designation?: Designation;
	department?: Department;
}
