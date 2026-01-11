import React, { use } from 'react';
import { useNavigate } from 'react-router';

const AdCard = ({ id, title, description, images }) => {
  const navigate = useNavigate();
  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-[0_2px_8px_rgba(0,0,0,0.1)] transition-transform duration-200 flex flex-col hover:-translate-y-[5px]"
         onClick={() => navigate(`/ads/${id}`)}>
      
      <div className="h-[150px] bg-[#ddd] flex items-center justify-center text-[#888] font-bold">
        {images && images.length > 0 ? (
            <img 
                src={images[0]}
                alt="Ad"
                className="object-cover w-full h-full"
            />
        ) : (
            <span>Brak zdjęcia</span>
        )}
      </div>

      <div className="p-[15px] text-left flex flex-col flex-grow">
        
        <h3 className="font-bold text-lg mb-1">{title}</h3>
        <p className="text-gray-600 text-sm line-clamp-3">{description}</p>

      </div>
    </div>
  );
};

export default AdCard;