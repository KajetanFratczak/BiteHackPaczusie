import React, { useState } from 'react';
import { Star, User } from 'lucide-react';

// Funkcja do odmiany liczebnika "recenzja"


const ReviewCard = ({ review }) => {
    const [isExpanded, setIsExpanded] = useState(false);

    const renderStars = () => {
        return Array.from({ length: 5 }, (_, index) => (
            <Star
                key={index}
                size={18}
                className={`${
                    index < review.rating 
                        ? 'fill-amber-400 text-amber-400' 
                        : 'fill-gray-200 text-gray-200'
                }`}
            />
        ));
    };

    const formatDate = (dateString) => {
        try {
            const date = new Date(dateString);
            return date.toLocaleDateString('pl-PL', {
                day: '2-digit',
                month: 'long',
                year: 'numeric'
            });
        } catch {
            return dateString;
        }
    };

    return (
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-shadow duration-300">
            {/* Nagłówek z oceną */}
            <div className="flex justify-between items-start mb-4">
                <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">
                        {review.title}
                    </h3>

                    <div className="flex items-center gap-2 mb-3">
                        <div className="flex items-center">
                            {renderStars()}
                            <span className="ml-2 text-lg font-bold text-slate-900">
                                {review.rating.toFixed(1)}
                            </span>
                        </div>
                        <span className="text-gray-400">•</span>
                        <div className="text-gray-500">
                            {review.created_at && (
                                <span className="text-sm">
                                    {formatDate(review.created_at)}
                                </span>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Informacje o użytkowniku */}
            {review.user_name && (
                <div className="flex items-center mb-4">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center mr-3">
                        <User size={20} className="text-blue-600" />
                    </div>
                    <div>
                        <p className="font-medium text-slate-900">
                            {review.user_name}
                        </p>
                        <p className="text-sm text-gray-500">
                            Recenzent
                        </p>
                    </div>
                </div>
            )}

            {/* Treść recenzji */}
            <div className="mb-4">
                <p className={`text-gray-700 leading-relaxed ${
                    !isExpanded && review.description.length > 200 
                        ? 'line-clamp-3' 
                        : ''
                }`}>
                    {review.description}
                </p>

                {review.description.length > 200 && (
                    <button
                        onClick={() => setIsExpanded(!isExpanded)}
                        className="mt-2 text-blue-600 hover:text-blue-700 font-medium text-sm transition-colors duration-200"
                    >
                        {isExpanded ? 'Pokaż mniej' : 'Czytaj więcej'}
                    </button>
                )}
            </div>
        </div>
    );
};

export default ReviewCard;