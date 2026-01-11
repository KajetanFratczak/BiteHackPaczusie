import api from './api';

export const reviewService = {
    async create(reviewData) {
        const response = await api.post('/reviews', reviewData);
        return response.data;
    },

    async update(reviewId, reviewData) {
        const response = await api.put(`/reviews/${reviewId}`, reviewData);
        return response.data;
    },

};

export default reviewService;