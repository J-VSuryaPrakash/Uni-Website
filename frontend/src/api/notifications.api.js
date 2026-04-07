import api from "./axios";

export const getNotifications = async ({ page, limit = 5, category, search }) => {
  const { data } = await api.get("/notifications/public", {
    params: {
      page,
      limit,
      category,
      search,
    },
  });

  return data.data;
};

export const getLiveScrollingNotifications = async () => {
  const { data } = await api.get("/notifications/live-scrolling");
  return data.data;
};