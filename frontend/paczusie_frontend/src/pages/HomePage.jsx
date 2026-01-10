import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import AdCard from '../components/AdCard';
import FloatingLogger from '../components/FloatingLogger';
import api from '../services/api';
import { adService } from '../services/adService';
import { categoryService } from '../services/categoryService';
import { set } from 'mongoose';

const HomePage = () => {
  const [ads, setAds] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const loggged = localStorage.getItem("token");

  // filtrowanie
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  useEffect(() => {
    categoryService.getAll().then(data => { setCategories(data); });
  }, []);

  useEffect(() => {
    const fetchAds = async () => {
      setLoading(true);
      try {
        const params = {};
        if (searchTerm) {
          params.search = searchTerm;
        }
        if (selectedCategory) {
          params.category_id = selectedCategory;
        }
        const data = await adService.getAll(params);

        setAds(data.map(ad => ({
          id: ad.ad_id,
          title: ad.ad_title,
          description: ad.description,
        })));
      } finally {
        setLoading(false);
      }
    };

    fetchAds(); 
  }, [searchTerm, selectedCategory]);

  return (

    <div className="pb-80 bg-[#F5FBE6] min-h-screen">
      <Navbar />

      <div className="max-w-[1200px] mx-auto p-6">
        <div className="flex flex-col md:flex-row gap-4 mb-10 bg-white p-6 rounded-xl shadow-sm">
          <input
            type="text"
            placeholder="Wyszukaj ogłoszenie..."
            className="flex-grow p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />  
          <select
            className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="">Wszystkie kategorie</option>
            {categories.map((category) => (
              <option key={category.category_id} value={category.category_id}>
                {category.category_name}
              </option>
            ))}
          </select>
        </div>
      </div>

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
      { loggged ?
      <FloatingLogger />
      : null }
    </div>
  );
};

export default HomePage;