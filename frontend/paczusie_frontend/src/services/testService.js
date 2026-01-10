import api from "./api";

export const runTest = async () => {
    const response = await api.get("/");
    return response.data;
};