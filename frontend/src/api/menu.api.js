import api from "./axios";

export const getMenuTree = async () => {
  const { data } = await api.get("/menus/tree");
  return data.data;
};

export const getMenuTreeById = async (id) => {
  const { data } = await api.get(`/menus/tree/${id}`);
  return data.data;
};
