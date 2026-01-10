import api from './api';

export const categoryService = {
    async getAll() {
        const response = await api.get('/categories');
        return response.data;
    },

    async getById(categoryId) {
        const response = await api.get(`/categories/${categoryId}`);
        return response.data;
    },

    async create(categoryData) {
        const response = await api.post('/categories', categoryData);
        return response.data;
    },

    async update(categoryId, categoryData) {
        const response = await api.put(`/categories/${categoryId}`, categoryData);
        return response.data;
    },

    async delete(categoryId) {
        const response = await api.delete(`/categories/${categoryId}`);
        return response.data;
    }
};

export default categoryService;