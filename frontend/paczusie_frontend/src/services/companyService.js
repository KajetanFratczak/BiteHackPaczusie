import api from './api';

export const companyService = {
    async getAll() {
        const response = await api.get('/businesses');
        return response.data;
    },

    async getById(businessId) {
        const response = await api.get(`/businesses/${businessId}`);
        return response.data;
    },

    async create(businessData) {
        const response = await api.post('/businesess', businessData);
        return response.data;
    },

    async update(businessId, businessData) {
        const response = await api.put(`/businesses/${businessId}`, businessData);
        return response.data;
    },

    async delete(businessId) {
        const response = await api.delete(`/businesses/${businessId}`);
        return response.data;
    },

    async getByUserId(userId) {
    const response = await api.get(`/businesses/user/${userId}`);
    return response.data;
}
};

export default companyService;