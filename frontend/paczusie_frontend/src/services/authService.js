import api from "./api";

export const authService = {
    async login(email, password) {
        const response = await api.post("/login", { email, password });
        if (response.data.access_token){
            localStorage.setItem("token", response.data.access_token);
        }
        return response.data;
    },
    
    async register(userData) {
        const response = await api.post("/register", userData);
        return response.data;
    },

    async getCurrentUser() {
        try {
            const response = await api.get("/me");
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