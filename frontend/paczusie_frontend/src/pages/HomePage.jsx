import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import AdCard from '../components/AdCard';
import FloatingLogger from '../components/FloatingLogger';
import api from '../services/api';
import { adService } from '../services/adService';
import { categoryService } from '../services/categoryService';

const HomePage = () => {
  const [ads, setAds] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
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

        const [adsData, categoriesData, linksData] = await Promise.all([
          adService.getAll(params),
          categoryService.getAll(),
          api.get('/ad_categories').then(res => res.data)
        ]);

        // tylko wyświetlamy zatwierdzone ogłoszenia
        const approvedAds = adsData.filter(ad => ad.status === true);

        const mergedAds = approvedAds.map(ad => {
          const relatedCategoryIds = linksData
            .filter(link => link.ad_id === ad.ad_id)
            .map(link => link.category_id);

          const adCategoryNames = categoriesData
            .filter(cat => relatedCategoryIds.includes(cat.category_id))
            .map(cat => cat.category_name);

          return {
            id: ad.ad_id,
            title: ad.ad_title,
            description: ad.description,
            price: ad.price,
            address: ad.address,
            categories: adCategoryNames,
            images: ad.images || [],
            status: ad.status
          };
        });
        setAds(mergedAds);
      } catch (error) {
        console.error('Błąd pobierania ogłoszeń:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAds();
  }, [searchTerm, selectedCategory]);

  return (
    <div className="bg-gradient-to-b from-[#F5FBE6] to-gray-50 min-h-screen pb-32">
      <Navbar />

      {/* Hero section */}
      <div className="relative overflow-hidden">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 lg:py-16">
          <div className="text-center mb-10">
            <h1 className="text-4xl lg:text-5xl font-bold text-slate-900 mb-4">
              Znajdź idealną <span className="text-[#FE7F2D]">okazję biznesową</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Przeglądaj tysiące ogłoszeń od sprawdzonych firm i przedsiębiorców
            </p>
          </div>

          {/* Filtry wyszukiwania */}
          <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl p-6 lg:p-8 mb-10 border border-gray-200">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1 relative">
                <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                  🔍
                </div>
                <input
                  type="text"
                  placeholder="Czego szukasz? Wpisz nazwę, słowa kluczowe..."
                  className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:border-[#FE7F2D] focus:outline-none focus:ring-2 focus:ring-[#FE7F2D]/30 text-lg"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <div className="relative lg:w-64">
                <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                  📂
                </div>
                <select
                  className="w-full pl-12 pr-10 py-4 border-2 border-gray-200 rounded-xl focus:border-[#FE7F2D] focus:outline-none focus:ring-2 focus:ring-[#FE7F2D]/30 text-lg appearance-none bg-white"
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
                <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
                  <span className="text-gray-400">▼</span>
                </div>
              </div>
            </div>

            <div className="mt-6 flex items-center justify-between">
              <div className="text-gray-600">
                <span className="font-bold text-[#FE7F2D]">{ads.length}</span> aktywnych ogłoszeń
              </div>
              <button
                onClick={() => {setSearchTerm(""); setSelectedCategory("");}}
                className="text-[#FE7F2D] hover:text-[#E76F1F] font-medium"
              >
                Wyczyść filtry
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Sekcja z ogłoszeniami */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="relative">
              <div className="absolute inset-0 animate-ping rounded-full h-16 w-16 bg-[#FE7F2D]/20"></div>
              <div className="relative animate-spin rounded-full h-16 w-16 border-t-3 border-b-3 border-[#FE7F2D]"></div>
            </div>
            <p className="mt-6 text-gray-600 font-medium">Ładowanie ofert...</p>
          </div>
        ) : (
          <>
            {ads.length > 0 ? (
              <div className="mb-8">
                <h2 className="text-2xl lg:text-3xl font-bold text-slate-900 mb-6">
                  Najnowsze oferty
                  <span className="ml-3 bg-[#FE7F2D]/10 text-[#FE7F2D] text-sm font-bold px-3 py-1.5 rounded-full">
                    {ads.length} ogłoszeń
                  </span>
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {ads.map((ad) => (
                    <AdCard
                      key={ad.id}
                      id={ad.id}
                      title={ad.title}
                      description={ad.description}
                      price={ad.price}
                      address={ad.address}
                      images={ad.images}
                      categories={ad.categories}
                      status={ad.status}
                    />
                  ))}
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-2xl shadow-lg p-12 text-center border border-gray-100">
                <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full mb-6">
                  <span className="text-5xl">📭</span>
                </div>
                <h3 className="text-2xl font-bold text-slate-800 mb-3">Brak znalezionych ogłoszeń</h3>
                <p className="text-gray-600 max-w-md mx-auto text-lg mb-8">
                  {searchTerm || selectedCategory
                    ? "Spróbuj zmienić kryteria wyszukiwania"
                    : "Brak aktywnych ogłoszeń. Sprawdź ponownie później!"}
                </p>
                <button
                  onClick={() => {setSearchTerm(""); setSelectedCategory("");}}
                  className="bg-gradient-to-r from-[#FE7F2D] to-orange-500 hover:from-[#E76F1F] hover:to-orange-600 text-white px-8 py-3 rounded-xl font-bold transition-all duration-300 hover:shadow-lg"
                >
                  Wyczyść filtry
                </button>
              </div>
            )}
          </>
        )}
      </div>

      <FloatingLogger />
    </div>
  );
};

export default HomePage;