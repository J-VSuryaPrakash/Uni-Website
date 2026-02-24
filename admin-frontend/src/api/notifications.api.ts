import apiClient from "./axios";
import type { ApiResponse } from "../types/ApiResponce.types";
import type {
	CreateAttachmentWithMediaDTO,
	CreateNotificationDTO,
	Notification,
	NotificationAttachment,
	UpdateNotificationDTO,
} from "../types/Notification.types";

// ─── Notifications ────────────────────────────────────────────────────────────

export const getAllNotifications = async () => {
	const res = await apiClient.get<ApiResponse<Notification[]>>(
		"/admin/notifications",
	);
	return res.data.data;
};

export const getNotificationsByCategory = async (category: string) => {
	const res = await apiClient.get<ApiResponse<Notification[]>>(
		`/admin/notifications/${encodeURIComponent(category)}`,
	);
	return res.data.data;
};

export const createNotification = async (payload: CreateNotificationDTO) => {
	const res = await apiClient.post<ApiResponse<Notification>>(
		"/admin/notifications",
		payload,
	);
	return res.data.data;
};

export const updateNotification = async (
	id: number,
	payload: UpdateNotificationDTO,
) => {
	const res = await apiClient.patch<ApiResponse<Notification>>(
		`/admin/notifications/update/${id}`,
		payload,
	);
	return res.data.data;
};

export const toggleNotificationActive = async (id: number) => {
	const res = await apiClient.patch<ApiResponse<Notification>>(
		`/admin/notifications/${id}`,
	);
	return res.data.data;
};

// ─── Notification Attachments ─────────────────────────────────────────────────

export const getAttachmentsByNotification = async (notificationId: number) => {
	const res = await apiClient.get<ApiResponse<NotificationAttachment[]>>(
		`/admin/notification-attachments/notification/${notificationId}`,
	);
	return res.data.data;
};

// Creates Media record + Attachment in one call — no pre-existing mediaId needed
export const createAttachmentWithMedia = async (
	payload: CreateAttachmentWithMediaDTO,
) => {
	const res = await apiClient.post<ApiResponse<NotificationAttachment>>(
		"/admin/notification-attachments/with-media",
		payload,
	);
	return res.data.data;
};

// Deletes attachment AND the linked Media record together
export const deleteAttachmentWithMedia = async (id: number) => {
	await apiClient.delete(`/admin/notification-attachments/${id}/with-media`);
};
