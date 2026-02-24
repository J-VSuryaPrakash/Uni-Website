import api from "./axios";

export const getNotificationsByCategory = async (category) => {
  const { data } = await api.get(`/notifications/public/${encodeURIComponent(category)}`);
  return data.data;
};

export const getAllActiveNotifications = async () => {
  const { data } = await api.get("/notifications/public");
  return (data.data ?? []).filter((n) => n.isActive);
};

export const getLiveScrollingNotifications = async () => {
  const { data } = await api.get("/notifications/live-scrolling");
  return data.data;
};
