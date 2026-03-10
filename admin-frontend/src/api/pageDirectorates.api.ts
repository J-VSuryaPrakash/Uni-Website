import apiClient from "./axios";

export interface PageDirectorateRecord {
	pageId: number;
	directorateId: number;
	position?: number | null;
}

/** Returns all page-directorate links, or [] if none exist. */
export const getAllPageDirectorates = async (): Promise<PageDirectorateRecord[]> => {
	const res = await apiClient.get("/admin/page-directorates");
	// Backend throws ApiError(200, ...) when empty, which comes back with success:false
	if (!res.data.success) return [];
	return res.data.data ?? [];
};

export const linkDirectorateToPage = async (
	pageId: number,
	directorateId: number,
): Promise<void> => {
	await apiClient.post("/admin/page-directorates", { pageId, directorateId });
};

export const unlinkDirectorateFromPage = async (
	pageId: number,
	directorateId: number,
): Promise<void> => {
	await apiClient.delete(`/admin/page-directorates/${pageId}/${directorateId}`);
};
