import api from "./api";

export const authService = {
    async login(email, password) {
        const response = await api.post("/auth/login", {username: email, password});
        if (response.data.token){
            localStorage.setItem("token", response.data.token);
        }
        return response.data;
    },
    
    async register(userData) {
        const response = await api.post("/auth/register", userData);
        if (response.data.token){
            localStorage.setItem("token", response.data.token);
        }
        return response.data;
    },

    async getCurrentUser() {
        try {
            const response = await api.get("/user/me");
            return response.data;
        } catch (err) {
            console.error(err);
            return null;
        }
    },

    logout(){
        localStorage.removeItem("token");
        localStorage.removeItem("user");
    }
};