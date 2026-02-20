import api from "./axios";

export const getActiveEvents = async () => {
  const { data } = await api.get("/events/active");
  return data.data;
};
