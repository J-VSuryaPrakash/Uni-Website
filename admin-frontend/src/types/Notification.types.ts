import type { BaseEntity } from "./Common.types";

export type NotificationStatus = "open" | "closed" | "archived";
export type MediaType = "image" | "video" | "audio" | "document" | "pdf";

export interface Department {
	id: number;
	name: string;
}

export interface Media {
	id: number;
	url: string;
	type: MediaType | null;
	createdAt: string;
}

export interface NotificationAttachment {
	id: number;
	notificationId: number;
	title: string;
	mediaId: number;
	position: number;
	createdAt: string;
	media: Media;
}

export interface Notification extends BaseEntity {
	title: string;
	category: string | null;
	departmentId: number | null;
	department?: Department | null;
	status: NotificationStatus;
	priority: number;
	startsAt: string | null;
	endsAt: string | null;
	isScrolling: boolean;
	isActive: boolean;
	updatedAt: string;
	attachments?: NotificationAttachment[];
}

export interface CreateNotificationDTO {
	title: string;
	category?: string;
	departmentId?: number;
	status?: NotificationStatus;
	priority?: number;
	startsAt?: string;
	endsAt?: string;
	isScrolling?: boolean;
	isActive?: boolean;
}

export interface UpdateNotificationDTO extends Partial<CreateNotificationDTO> {}

export interface CreateAttachmentWithMediaDTO {
	notificationId: number;
	title: string;
	url: string;
	mediaType: MediaType;
	position?: number;
}
