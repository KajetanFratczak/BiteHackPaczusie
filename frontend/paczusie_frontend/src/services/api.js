// Zestaw funkcji API, które służą do komunikacji z backendem aplikacji,
import axios from 'axios';

// adres serwera do podmianki, jeśli się zmieni
export const API_URL = "http://localhost:8080/api";

const api = axios.create({
    baseURL: API_URL,
    headers: {
        "Content-Type": "application/json",
    }
});

// interceptors - mogę dzięki temu przechwycić zapytanie lub odpowiedź przed then oraz catch
// request interceptor
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    }, (error) => {
        return Promise.reject(error);
    }
);

export default api;