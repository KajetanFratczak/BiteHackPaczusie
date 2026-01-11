import api from './api';

export const reviewService = {
    async getAll() {
        const response = await api.get('/reviews');
        return response.data;
    },

    async getById(reviewId) {
        const response = await api.get(`/reviews/${reviewId}`);
        return response.data;
    },

    async create(reviewData) {
        const response = await api.post('/reviews', reviewData);
        return response.data;
    },

    async update(reviewId, reviewData) {
        const response = await api.put(`/reviews/${reviewId}`, reviewData);
        return response.data;
    },

    async delete(reviewId) {
        const response = await api.delete(`/reviews/${reviewId}`);
        return response.data;
    },

    async getByAdId(adId) {
        try {
            const response = await api.get(`/reviews/ad/${adId}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching reviews for ad:', error);
            return [];
        }
    },

    async getAverageRating(adId) {
        try {
            const response = await api.get(`/reviews/ad/${adId}/average`);
            return response.data;
        } catch (error) {
            console.error('Error fetching average rating:', error);
            return { average: 0, count: 0 };
        }
    }
};

export default reviewService;