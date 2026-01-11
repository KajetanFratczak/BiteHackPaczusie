import React from 'react';
import { useNavigate } from 'react-router';

const AdCard = ({ id, title, description, price, address, images, categories }) => {
  const navigate = useNavigate();

  const formatPrice = (price) => {
    return parseFloat(price).toLocaleString('pl-PL', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  };

  return (
    <div
      onClick={() => navigate(`/ads/${id}`)}
      className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer overflow-hidden border border-gray-100 hover:border-[#FE7F2D]/30 group transform hover:-translate-y-1"
    >
      {/* Obrazek */}
      <div className="h-48 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center overflow-hidden relative">
        {images && images.length > 0 ? (
          <img
            src={images[0]}
            alt="Ad"
            className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="flex flex-col items-center">
            <span className="text-4xl text-gray-400 mb-2">🏢</span>
            <span className="text-gray-500 font-medium">Brak zdjęcia</span>
          </div>
        )}
        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full">
          <span className="text-sm font-bold text-[#FE7F2D]">
            {formatPrice(price)} PLN
          </span>
        </div>
      </div>

      {/* Zawartość karty */}
      <div className="p-5">
        <div className="mb-3">
          <h3 className="text-lg font-bold text-slate-900 group-hover:text-[#FE7F2D] transition-colors line-clamp-2 leading-tight mb-2">
            {title}
          </h3>

          <div className="flex items-center text-gray-600 mb-3">
            <span className="mr-2 text-orange-500">📍</span>
            <span className="text-sm font-medium">{address}</span>
          </div>

          <p className="text-gray-600 text-sm line-clamp-2 leading-relaxed mb-4">
            {description}
          </p>
        </div>

        {/* Kategorie */}
        <div className="flex flex-wrap gap-2 mb-4">
          {categories && categories.slice(0, 3).map((cat, index) => (
            <span
              key={index}
              className="bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 text-xs font-semibold px-3 py-1.5 rounded-full border border-blue-100"
            >
              {cat}
            </span>
          ))}
          {categories && categories.length > 3 && (
            <span className="bg-gray-100 text-gray-500 text-xs font-semibold px-3 py-1.5 rounded-full">
              +{categories.length - 3}
            </span>
          )}
        </div>

        {/* Przycisk */}
        <button className="w-full bg-gradient-to-r from-gray-50 to-gray-100 hover:from-[#FE7F2D] hover:to-orange-500 text-gray-700 hover:text-white font-bold py-3 rounded-xl transition-all duration-300 border border-gray-200 hover:border-[#FE7F2D] flex items-center justify-center gap-2 group/btn">
          <span>🔍</span>
          Zobacz szczegóły
          <span className="group-hover/btn:translate-x-1 transition-transform">→</span>
        </button>
      </div>
    </div>
  );
};

export default AdCard;