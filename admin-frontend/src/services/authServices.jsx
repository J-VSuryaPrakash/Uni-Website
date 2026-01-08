import api from "./api";

export const loginAdmin = async (loginData) => {
  const response = await api.post("/api/v1/admin/adminLogin", loginData);
  return response.data;
};
