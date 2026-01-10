import api from './api';

export const adService = {
    async getAll(params = {}) {
        const response = await api.get('/ads', { params });
        return response.data;
    },

    async getById(adId) {
        const response = await api.get(`/ads/${adId}`);
        return response.data;
    },

    async create(adData) {
        const response = await api.post('/ads', adData);
        return response.data;
    },

    async update(adId, adData) {
        const response = await api.put(`/ads/${adId}`, adData);
        return response.data;
    },

    async delete(adId) {
        const response = await api.delete(`/ads/${adId}`);
        return response.data;
    }
};

export default adService;