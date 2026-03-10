import api from "./axios";

export const getDirectoratesByPage = async (pageId) => {
    const { data } = await api.get(`/directorates/public/by-page/${pageId}`);
    return data.data ?? [];
};

export const getAllPublicDirectorates = async () => {
    const { data } = await api.get("/directorates/public");
    return data.data ?? [];
};
