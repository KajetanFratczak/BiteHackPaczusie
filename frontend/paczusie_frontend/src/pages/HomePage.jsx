import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import AdCard from '../components/AdCard';
import FloatingLogger from '../components/FloatingLogger';
import api from '../services/api';

const HomePage = () => {
  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    const fetchAds = async () => {
      try {
        const response = await api.get('/ads');
        const formattedAds = response.data.map(ad => ({
          id: ad.ad_id,
          title: ad.ad_title,
          description: ad.description,
        }));
        setAds(formattedAds);
      } catch (error) {
        console.error('Błąd pobierania ogłoszeń: ', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAds(); 
  }, []);

  return (

    <div className="pb-80 bg-[#F5FBE6] min-h-screen">
      <Navbar />
      
      <div className="p-12 text-center text-3xl font-bold text-[#233D4D]">
        <h2>Nowości</h2>
      </div>

      {loading ? (
          <p className="text-center mt-10">Ładowanie ofert...</p>
      ) : (
          <div className="grid grid-cols-2 max-[800px]:grid-cols-1 gap-[20px] p-[20px] max-w-[1500px] mx-auto">
            {ads.length > 0 ? (
                ads.map((ad) => (
                <AdCard 
                    key={ad.id}
                    id={ad.id}
                    title={ad.title}
                    description={ad.description}
                />
                ))
            ) : (
                <p className="text-center col-span-2">Brak ogłoszeń. Dodaj pierwsze!</p>
            )}
          </div>
      )}
      <FloatingLogger />
    </div>
  );
};

export default HomePage;