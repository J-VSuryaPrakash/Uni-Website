export type DesignationCategory = 'ADMINISTRATION' | 'DIRECTORATES' | 'PRINCIPALS' | 'EXAMINATION';

export interface DirectorateDesignationEntry {
	designation: {
		id: number;
		title: string;
		category: DesignationCategory;
		priority: number;
	};
}

export interface DirectoratePhoto {
	id: number;
	url: string;
	type?: string;
}

export interface DirectorateProfile {
	title?: string;
	qualifications?: string[];
	address?: {
		college: string;
		university: string;
		pincode: string;
		state: string;
	};
	contact?: {
		email?: string;
		phone?: string;
		website?: string;
	};
}

export interface Directorate {
	id: number;
	name: string;
	isActive: boolean;
	photoMediaId?: number | null;
	photo?: DirectoratePhoto | null;
	profile?: DirectorateProfile | null;
	designations: DirectorateDesignationEntry[];
	department?: { id: number; name: string } | null;
}

export interface CreateDirectorateDTO {
	name: string;
	isActive: boolean;
	designationIds: number[];
	departmentId?: number | null;
	photoMediaId?: number | null;
	profile?: DirectorateProfile | null;
}

export type UpdateDirectorateDTO = Partial<CreateDirectorateDTO>;
