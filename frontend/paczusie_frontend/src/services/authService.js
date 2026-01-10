import api from "./api";

export const authService = {
    async login(email, password) {
        const response = await api.post("/auth/login", {username: email, password});
        if (response.data.token){
            localStorage.setItem("token", response.data.token);
        }
        return response.data;
    },
};