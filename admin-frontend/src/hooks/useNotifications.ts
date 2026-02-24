import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as notifApi from "../api/notifications.api";

export const useNotifications = () => {
	const qc = useQueryClient();

	const query = useQuery({
		queryKey: ["notifications"],
		queryFn: notifApi.getAllNotifications,
	});

	const create = useMutation({
		mutationFn: notifApi.createNotification,
		onSuccess: () => qc.invalidateQueries({ queryKey: ["notifications"] }),
	});

	const update = useMutation({
		mutationFn: ({ id, data }: { id: number; data: any }) =>
			notifApi.updateNotification(id, data),
		onSuccess: () => qc.invalidateQueries({ queryKey: ["notifications"] }),
	});

	const toggle = useMutation({
		mutationFn: (id: number) => notifApi.toggleNotificationActive(id),
		onSuccess: () => qc.invalidateQueries({ queryKey: ["notifications"] }),
	});

	return { ...query, create, update, toggle };
};

export const useNotificationAttachments = (notificationId: number | null) => {
	const qc = useQueryClient();
	const key = ["notification-attachments", notificationId];

	const query = useQuery({
		queryKey: key,
		queryFn: () => notifApi.getAttachmentsByNotification(notificationId!),
		enabled: !!notificationId,
	});

	const addAttachment = useMutation({
		mutationFn: notifApi.createAttachmentWithMedia,
		onSuccess: () => qc.invalidateQueries({ queryKey: key }),
	});

	const removeAttachment = useMutation({
		mutationFn: notifApi.deleteAttachmentWithMedia,
		onSuccess: () => qc.invalidateQueries({ queryKey: key }),
	});

	return { ...query, addAttachment, removeAttachment };
};
