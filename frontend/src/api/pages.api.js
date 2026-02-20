import api from "./axios";

export const getPageBySlug = async (slug) => {
  const { data } = await api.get(`/pages/slug/${slug}`);
  return data.data;
};
