import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import FloatingLogger from '../components/FloatingLogger';
import Navbar from '../components/Navbar';
import api from '../services/api';
import { adService } from '../services/adService';
import { companyService } from '../services/companyService';

const BusinessProfilePage = () => {
    const { bp_id } = useParams();
    const navigate = useNavigate();
    const [business, setBusiness] = useState(null);
    const [ads, setAds] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchBusinessData = async () => {
            try {
                setLoading(true);
                // Pobierz dane firmy
                const businessResponse = await companyService.getById(bp_id);
                setBusiness(businessResponse);

                // Pobierz ogłoszenia firmy
                const adsResponse = await api.get(`/businesses/${bp_id}/ads`);
                setAds(adsResponse.data);
            } catch (err) {
                console.error('Błąd pobierania danych firmy: ', err);
                setError('Nie udało się pobrać danych firmy');
            } finally {
                setLoading(false);
            }
        };

        fetchBusinessData();
    }, [bp_id]);

    const handleAdClick = (adId) => {
        navigate(`/ads/${adId}`);
    };

    const handleContactBusiness = () => {
        if (business?.phone) {
            window.location.href = `tel:${business.phone}`;
        }
    };

    if (loading) return (
        <div className="bg-[#F5FBE6] min-h-screen">
            <Navbar />
            <div className="max-w-6xl mx-auto px-4 py-8">
                <div className="text-center mt-10">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#FE7F2D]"></div>
                    <p className="mt-4 text-gray-600">Ładowanie danych firmy...</p>
                </div>
            </div>
            <FloatingLogger />
        </div>
    );

    if (error || !business) return (
        <div className="bg-[#F5FBE6] min-h-screen">
            <Navbar />
            <div className="max-w-6xl mx-auto px-4 py-8">
                <div className="text-center mt-10 text-red-600">
                    <p className="text-xl font-bold">{error || 'Firma nie istnieje'}</p>
                    <button
                        onClick={() => navigate(-1)}
                        className="mt-4 bg-[#FE7F2D] hover:bg-[#E76F1F] text-white px-6 py-2 rounded font-bold transition-colors"
                    >
                        Wróć
                    </button>
                </div>
            </div>
            <FloatingLogger />
        </div>
    );

    return (
        <div className="bg-[#F5FBE6] min-h-screen pb-12">
            <Navbar />

            {/* Główny kontener */}
            <div className="max-w-6xl mx-auto px-4 py-8">
                {/* Nagłówek profilu firmy */}
                <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-8">
                    <div className="p-8">
                        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                            {/* Logo i nazwa firmy */}
                            <div className="flex items-center gap-6">
                                <div className="w-24 h-24 bg-gradient-to-br from-orange-100 to-amber-100 rounded-full flex items-center justify-center shadow-md">
                                    <span className="text-3xl font-bold text-[#FE7F2D]">
                                        {business.bp_name.charAt(0).toUpperCase()}
                                    </span>
                                </div>
                                <div>
                                    <h1 className="text-3xl font-bold text-slate-800">
                                        {business.bp_name}
                                    </h1>
                                    <div className="flex items-center mt-2 text-gray-600">
                                        <span className="flex items-center">
                                            <span className="mr-1">📍</span>
                                            {business.address}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Statystyki */}
                            <div className="flex gap-4">
                                <div className="text-center bg-gray-50 p-4 rounded-lg min-w-[120px]">
                                    <div className="text-2xl font-bold text-slate-800">{ads.length}</div>
                                    <div className="text-sm text-gray-500 mt-1">Ogłoszeń</div>
                                </div>
                                <div className="text-center bg-gray-50 p-4 rounded-lg min-w-[120px]">
                                    <div className="text-2xl font-bold text-slate-800">
                                        {new Date(business.created_at).toLocaleDateString('pl-PL')}
                                    </div>
                                    <div className="text-sm text-gray-500 mt-1">Od</div>
                                </div>
                            </div>
                        </div>

                        {/* Opis firmy */}
                        {business.description && (
                            <div className="mt-8 pt-8 border-t border-gray-100">
                                <h3 className="text-lg font-semibold text-slate-700 mb-4">O firmie</h3>
                                <p className="text-gray-600 leading-relaxed">
                                    {business.description}
                                </p>
                            </div>
                        )}

                        {/* Informacje kontaktowe */}
                        <div className="mt-8 pt-8 border-t border-gray-100">
                            <h3 className="text-lg font-semibold text-slate-700 mb-4">Kontakt</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                                    <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                                        <span className="text-orange-500">📞</span>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Telefon</p>
                                        <p className="font-semibold text-slate-700">{business.phone}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                                    <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                                        <span className="text-orange-500">📍</span>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Adres</p>
                                        <p className="font-semibold text-slate-700">{business.address}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Przyciski akcji - TYLKO Zadzwoń */}
                        <div className="mt-8 pt-8 border-t border-gray-100">
                            <button
                                onClick={handleContactBusiness}
                                className="bg-[#FE7F2D] hover:bg-[#E76F1F] text-white px-8 py-3 rounded-lg font-bold transition-colors flex items-center gap-2"
                            >
                                <span>📞</span>
                                Zadzwoń
                            </button>
                        </div>
                    </div>
                </div>

                {/* Sekcja ogłoszeń firmy */}
                <div>
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-bold text-slate-800">
                            Ogłoszenia firmy
                            <span className="ml-2 bg-orange-100 text-orange-600 text-sm font-semibold px-3 py-1 rounded-full">
                                {ads.length}
                            </span>
                        </h2>
                        {/* USUNIĘTO: Sortuj według */}
                    </div>

                    {ads.length === 0 ? (
                        <div className="bg-white rounded-xl shadow-sm p-12 text-center">
                            <div className="text-6xl mb-4">📭</div>
                            <h3 className="text-xl font-semibold text-slate-700 mb-2">Brak ogłoszeń</h3>
                            <p className="text-gray-500 max-w-md mx-auto">
                                Ta firma nie ma jeszcze żadnych aktywnych ogłoszeń. Sprawdź później!
                            </p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {ads.map((ad) => (
                                <AdCard
                                    key={ad.ad_id}
                                    ad={ad}
                                    onClick={() => handleAdClick(ad.ad_id)}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>

            <FloatingLogger />
        </div>
    );
};

// Komponent karty ogłoszenia
const AdCard = ({ ad, onClick }) => {
    const statusColor = ad.status
        ? 'bg-green-100 text-green-700 border-green-200'
        : 'bg-yellow-100 text-yellow-700 border-yellow-200';

    return (
        <div
            onClick={onClick}
            className="bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 cursor-pointer overflow-hidden border border-gray-100 hover:border-orange-200 group"
        >
            <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <div className={`text-xs font-bold px-3 py-1 rounded-full border ${statusColor} mb-2 inline-block`}>
                            {ad.status ? 'Aktywne' : 'Oczekujące'}
                        </div>
                        <h3 className="text-lg font-bold text-slate-800 group-hover:text-[#FE7F2D] transition-colors line-clamp-2">
                            {ad.ad_title}
                        </h3>
                    </div>
                    <div className="text-right">
                        <span className="text-sm text-gray-500 block">Cena</span>
                        <span className="text-xl font-black text-slate-900">{ad.price} PLN</span>
                    </div>
                </div>

                <div className="flex items-center text-gray-600 mb-4">
                    <span className="mr-2 text-orange-500">📍</span>
                    <span className="text-sm">{ad.address}</span>
                </div>

                <p className="text-gray-600 text-sm line-clamp-2 mb-4">
                    {ad.description || 'Brak opisu'}
                </p>

                <div className="flex justify-between text-xs text-gray-500 pt-4 border-t border-gray-100">
                    <div>
                        <span className="block text-gray-400">Opublikowano</span>
                        <span className="font-medium">{ad.post_date}</span>
                    </div>
                    <div className="text-right">
                        <span className="block text-gray-400">Ważne do</span>
                        <span className="font-medium">{ad.due_date}</span>
                    </div>
                </div>
            </div>

            <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
                <button className="w-full bg-white hover:bg-gray-50 text-slate-700 font-semibold py-2.5 rounded-lg transition-colors border border-gray-200 group-hover:border-[#FE7F2D] group-hover:text-[#FE7F2D]">
                    Zobacz szczegóły
                </button>
            </div>
        </div>
    );
};

export default BusinessProfilePage;