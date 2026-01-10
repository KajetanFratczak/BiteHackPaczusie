import React from 'react';

const AdCard = ({ title, description, price, location }) => {
  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-[0_2px_8px_rgba(0,0,0,0.1)] transition-transform duration-200 flex flex-col hover:-translate-y-[5px]">
      
      <div className="h-[150px] bg-[#ddd] flex items-center justify-center text-[#888] font-bold">IMG</div>

      <div className="p-[15px] text-left flex flex-col flex-grow">
        
        <h3 className="font-bold text-lg mb-1">{title}</h3>
        <div className="font-bold text-[#282c34] text-[1.2rem] my-[5px]">{price} zł</div>
        <div className="text-[#666] text-[0.9rem] mb-[10px]">{location}</div>
        <p className="text-gray-600 text-sm line-clamp-3">{description}</p>

      </div>
    </div>
  );
};

export default AdCard;