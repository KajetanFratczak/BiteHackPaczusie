import api from './api';

export const userService = {
    async getAll() {
        const response = await api.get('/users');
        return response.data;
    },

    async getById(userId) {
        const response = await api.get(`/users/${userId}`);
        return response.data;
    },

    async update(userId, userData) {
        const response = await api.put(`/users/${userId}`, userData);
        return response.data;
    },

    async delete(userId) {
        const response = await api.delete(`/users/${userId}`);
        return response.data;
    },

    async getCurrentUser() {
        const response = await api.get('/user/me');
        return response.data;
    }
};

export default userService;