import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import AdCard from '../components/AdCard';
import FloatingLogger from '../components/FloatingLogger';

const HomePage = () => {
  const [ads, setAds] = useState([
    { id: 1, title: "Domowe dżemy truskawkowe", price: 15, location: "Kraków", description: "Pyszne, bez konserwantów." },
    { id: 2, title: "Naprawa rowerów", price: 50, location: "Warszawa", description: "Szybko i tanio, dojazd do klienta." },
    { id: 3, title: "Korepetycje z matematyki", price: 40, location: "Online", description: "Szkoła podstawowa i liceum." },
    { id: 4, title: "Sprzedam miód lipowy", price: 35, location: "Poznań", description: "Z własnej pasieki, rocznik 2025." },
    { id: 5, title: "Usługi hydrauliczne", price: 100, location: "Gdańsk", description: "Awaryjne otwieranie rur." },
    { id: 6, title: "Usługi fryzjerskie", price: 200, location: "Gdańsk", description: "..." },
  ]);

  return (

    <div className="pb-80 bg-[#f4f4f4] min-h-screen">
      <Navbar />
      
      <div className="p-12 text-center text-3xl font-bold">
        <h2>Gorące biznesy w Twojej okolicy!!!!</h2>
      </div>

      <div className="grid grid-cols-2 max-[800px]:grid-cols-1 gap-[20px] p-[20px] max-w-[1500px] mx-auto">
        {ads.map((ad) => (
          <AdCard 
            key={ad.id}
            title={ad.title}
            price={ad.price}
            location={ad.location}
            description={ad.description}
          />
        ))}
      </div>

      <FloatingLogger />
    </div>
  );
};

export default HomePage;