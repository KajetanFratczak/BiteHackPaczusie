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
        // Status jest ustawiany na false w backendzie
        // Nie musimy go wysyłać, backend zignoruje jeśli wyślemy
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
    },

    async getPendingAds() {
        const response = await api.get('/ads/pending');
        return response.data;
    },

    async approveAd(adId) {
        const response = await api.patch(`/ads/${adId}/approve`);
        return response.data;
    },

    async getAdsByStatus(status) {
        const response = await api.get(`/ads/status/${status}`);
        return response.data;
    },

    async getByUserId(userId) {
    const response = await api.get(`/ads/user/${userId}`);
    return response.data;
}
};

export default adService;