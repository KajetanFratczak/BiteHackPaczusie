import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import FloatingLogger from '../components/FloatingLogger';
import Navbar from '../components/Navbar';
import api from '../services/api';
import { adService } from '../services/adService';
import { companyService } from '../services/companyService';

const getAdsDeclension = (count) => {
    const lastDigit = count % 10;
    const lastTwoDigits = count % 100;

    if (count === 1) return 'ogłoszenie';
    if (lastDigit >= 2 && lastDigit <= 4 && (lastTwoDigits < 10 || lastTwoDigits > 20)) return 'ogłoszenia';
    return 'ogłoszeń';
};

const BusinessProfilePage = () => {
    const { bp_id } = useParams();
    const navigate = useNavigate();
    const [business, setBusiness] = useState(null);
    const [owner, setOwner] = useState(null);
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

                // Pobierz dane właściciela (użytkownika)
                if (businessResponse.user_id) {
                    try {
                        const ownerResponse = await api.get(`/users/${businessResponse.user_id}`);
                        setOwner(ownerResponse.data);
                    } catch (err) {
                        console.error('Błąd pobierania danych właściciela: ', err);
                    }
                }

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
        <div className="bg-gradient-to-b from-[#F5FBE6] to-gray-50 min-h-screen">
            <Navbar />
            <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
                <div className="flex flex-col items-center justify-center min-h-[60vh]">
                    <div className="relative">
                        <div className="absolute inset-0 animate-ping rounded-full h-16 w-16 bg-[#FE7F2D]/20"></div>
                        <div className="relative animate-spin rounded-full h-16 w-16 border-t-3 border-b-3 border-[#FE7F2D]"></div>
                    </div>
                    <p className="mt-6 text-gray-600 font-medium">Ładowanie danych firmy...</p>
                </div>
            </div>
            <FloatingLogger />
        </div>
    );

    if (error || !business) return (
        <div className="bg-gradient-to-b from-[#F5FBE6] to-gray-50 min-h-screen">
            <Navbar />
            <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
                <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
                    <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mb-6">
                        <span className="text-3xl">⚠️</span>
                    </div>
                    <h2 className="text-2xl font-bold text-red-700 mb-3">{error || 'Firma nie istnieje'}</h2>
                    <p className="text-gray-600 mb-8 max-w-md">Nie udało się załadować profilu firmy. Sprawdź czy adres jest poprawny.</p>
                    <button
                        onClick={() => navigate(-1)}
                        className="bg-[#FE7F2D] hover:bg-[#E76F1F] text-white px-8 py-3 rounded-xl font-bold transition-all duration-300 hover:shadow-lg transform hover:-translate-y-0.5"
                    >
                        ← Wróć do poprzedniej strony
                    </button>
                </div>
            </div>
            <FloatingLogger />
        </div>
    );

    return (
        <div className="bg-gradient-to-b from-[#F5FBE6] to-gray-50 min-h-screen pb-12">
            <Navbar />

            {/* Główny kontener */}
            <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 lg:py-8">
                {/* Nagłówek profilu firmy */}
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-8 border border-gray-100">
                    <div className="relative">
                        {/* Nagłówek z gradientem */}
                        <div className="h-32 bg-gradient-to-r from-orange-50 to-amber-50"></div>

                        {/* Logo i podstawowe info */}
                        <div className="relative px-6 lg:px-8 -mt-16">
                            <div className="flex flex-col lg:flex-row items-start lg:items-end justify-between gap-6">
                                <div className="flex items-center gap-6">
                                    <div className="w-32 h-32 bg-gradient-to-br from-orange-100 to-amber-100 rounded-2xl flex items-center justify-center shadow-lg border-4 border-white">
                                        <span className="text-4xl font-black text-[#FE7F2D]">
                                            {business.bp_name.charAt(0).toUpperCase()}
                                        </span>
                                    </div>
                                    <div className="pb-2">
                                        <div className="inline-flex items-center gap-2 mb-2">
                                            <span className="bg-[#FE7F2D]/10 text-[#FE7F2D] text-xs font-bold px-3 py-1.5 rounded-full">
                                                FIRMA
                                            </span>
                                            {owner && (
                                                <span className="bg-blue-50 text-blue-600 text-xs font-medium px-3 py-1.5 rounded-full flex items-center gap-1">
                                                    <span>👤</span>
                                                    Właściciel: {owner.first_name} {owner.last_name}
                                                </span>
                                            )}
                                        </div>
                                        <h1 className="text-3xl lg:text-4xl font-bold text-slate-900">
                                            {business.bp_name}
                                        </h1>
                                        <div className="flex items-center mt-3 text-gray-700">
                                            <span className="flex items-center gap-2 bg-gray-50 px-4 py-2 rounded-lg">
                                                <span className="text-orange-500 text-lg">📍</span>
                                                <span className="font-medium">{business.address}</span>
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Statystyki - nowy układ */}
                                <div className="flex gap-3">
                                    <div className="text-center bg-white p-5 rounded-xl border border-gray-200 shadow-sm min-w-[140px] hover:shadow-md transition-shadow">
                                        <div className="text-3xl font-black text-slate-900">{ads.length}</div>
                                        <div className="text-sm font-medium text-gray-500 mt-2">
                                            {getAdsDeclension(ads.length)}
                                        </div>
                                    </div>
                                    <div className="text-center bg-white p-5 rounded-xl border border-gray-200 shadow-sm min-w-[140px] hover:shadow-md transition-shadow">
                                        <div className="text-sm font-medium text-gray-500">Na platformie od</div>
                                        <div className="text-xl font-bold text-slate-900 mt-2">
                                            {new Date(business.created_at).toLocaleDateString('pl-PL', {
                                                day: 'numeric',
                                                month: 'long',
                                                year: 'numeric'
                                            })}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Główna zawartość */}
                        <div className="px-6 lg:px-8 py-8">
                            {/* Opis firmy */}
                            {business.description && (
                                <div className="mb-10">
                                    <h3 className="text-xl font-bold text-slate-800 mb-4 pb-2 border-b border-gray-200">📋 O firmie</h3>
                                    <div className="bg-gray-50/50 rounded-xl p-6">
                                        <p className="text-gray-700 leading-relaxed text-lg">
                                            {business.description}
                                        </p>
                                    </div>
                                </div>
                            )}

                            {/* Karty informacyjne */}
                            <div className="mb-10">
                                <h3 className="text-xl font-bold text-slate-800 mb-6 pb-2 border-b border-gray-200">📞 Kontakt i informacje</h3>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                                    {/* Właściciel */}
                                    {owner && (
                                        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-5 border border-blue-100 shadow-sm hover:shadow-md transition-shadow">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                                                    <span className="text-2xl text-blue-600">👤</span>
                                                </div>
                                                <div>
                                                    <p className="text-sm font-medium text-blue-700 mb-1">Właściciel</p>
                                                    <p className="text-lg font-bold text-slate-800">
                                                        {owner.first_name} {owner.last_name}
                                                    </p>
                                                    <p className="text-sm text-gray-600 mt-1">{owner.email}</p>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Telefon */}
                                    <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-5 border border-green-100 shadow-sm hover:shadow-md transition-shadow">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                                                <span className="text-2xl text-green-600">📞</span>
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-green-700 mb-1">Telefon kontaktowy</p>
                                                <a
                                                    href={`tel:${business.phone}`}
                                                    className="text-lg font-bold text-slate-800 hover:text-green-700 transition-colors"
                                                >
                                                    {business.phone}
                                                </a>
                                                <p className="text-sm text-gray-600 mt-1">Kliknij, aby zadzwonić</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Adres */}
                                    <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl p-5 border border-orange-100 shadow-sm hover:shadow-md transition-shadow">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                                                <span className="text-2xl text-orange-600">📍</span>
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-orange-700 mb-1">Lokalizacja firmy</p>
                                                <p className="text-lg font-bold text-slate-800">{business.address}</p>
                                                <p className="text-sm text-gray-600 mt-1">Siedziba główna</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Przycisk akcji */}
                            <div className="border-t border-gray-200 pt-8">
                                <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
                                    <div>
                                        <h4 className="text-lg font-bold text-slate-800">Potrzebujesz kontaktu?</h4>
                                        <p className="text-gray-600 mt-1">Skontaktuj się bezpośrednio z firmą</p>
                                    </div>
                                    <button
                                        onClick={handleContactBusiness}
                                        className="bg-gradient-to-r from-[#FE7F2D] to-orange-500 hover:from-[#E76F1F] hover:to-orange-600 text-white px-10 py-4 rounded-xl font-bold transition-all duration-300 hover:shadow-lg transform hover:-translate-y-0.5 flex items-center gap-3 text-lg"
                                    >
                                        <span className="text-xl">📞</span>
                                        Zadzwoń teraz
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sekcja ogłoszeń firmy */}
                <div className="mb-6">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
                        <div>
                            <h2 className="text-2xl lg:text-3xl font-bold text-slate-900">
                                Aktywne ogłoszenia
                            </h2>
                            <p className="text-gray-600 mt-2">
                                Przeglądaj wszystkie oferty tej firmy
                            </p>
                        </div>
                        <div className="bg-white px-5 py-3 rounded-xl border border-gray-200 shadow-sm">
                            <span className="text-lg font-bold text-[#FE7F2D]">{ads.length}</span>
                            <span className="text-gray-700 ml-2">{getAdsDeclension(ads.length)}</span>
                        </div>
                    </div>

                    {ads.length === 0 ? (
                        <div className="bg-white rounded-2xl shadow-lg p-12 text-center border border-gray-100">
                            <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full mb-6">
                                <span className="text-5xl">📭</span>
                            </div>
                            <h3 className="text-2xl font-bold text-slate-800 mb-3">Brak aktywnych ogłoszeń</h3>
                            <p className="text-gray-600 max-w-md mx-auto text-lg mb-8">
                                Ta firma nie opublikowała jeszcze żadnych ogłoszeń. Sprawdź ponownie później!
                            </p>
                            <button
                                onClick={() => navigate(-1)}
                                className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-8 py-3 rounded-xl font-medium transition-colors inline-flex items-center gap-2"
                            >
                                ← Wróć do przeglądania
                            </button>
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

// Poprawiony komponent karty ogłoszenia
const AdCard = ({ ad, onClick }) => {
    const statusColor = ad.status
        ? 'bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 border-green-200'
        : 'bg-gradient-to-r from-yellow-100 to-amber-100 text-yellow-800 border-yellow-200';

    return (
        <div
            onClick={onClick}
            className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer overflow-hidden border border-gray-100 hover:border-[#FE7F2D]/30 group transform hover:-translate-y-1"
        >
            {/* Status i nagłówek */}
            <div className="p-6">
                <div className="flex justify-between items-start mb-5">
                    <div className="flex-1">
                        <div className={`text-xs font-bold px-4 py-2 rounded-full border ${statusColor} mb-3 inline-flex items-center gap-2`}>
                            <span className={`w-2 h-2 rounded-full ${ad.status ? 'bg-green-500' : 'bg-yellow-500'}`}></span>
                            {ad.status ? 'Aktywne' : 'Oczekujące'}
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 group-hover:text-[#FE7F2D] transition-colors line-clamp-2 leading-tight">
                            {ad.ad_title}
                        </h3>
                    </div>
                </div>

                {/* Cena - wyróżniona */}
                <div className="mb-5 p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl">
                    <div className="text-center">
                        <div className="text-sm font-medium text-gray-500 mb-1">Cena</div>
                        <div className="text-2xl lg:text-3xl font-black text-slate-900">
                            {parseFloat(ad.price).toLocaleString('pl-PL', {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2
                            })} PLN
                        </div>
                    </div>
                </div>

                {/* Lokalizacja */}
                <div className="flex items-center gap-3 text-gray-700 mb-4 p-3 bg-gray-50/50 rounded-lg">
                    <span className="text-orange-500 text-xl">📍</span>
                    <span className="font-medium text-sm">{ad.address}</span>
                </div>

                {/* Krótki opis */}
                <div className="mb-5">
                    <p className="text-gray-600 text-sm line-clamp-3 leading-relaxed">
                        {ad.description || 'Brak szczegółowego opisu'}
                    </p>
                </div>

                {/* Daty */}
                <div className="grid grid-cols-2 gap-4 pt-5 border-t border-gray-100">
                    <div className="text-center">
                        <div className="text-xs font-medium text-gray-400 mb-1">Data publikacji</div>
                        <div className="text-sm font-bold text-slate-700">{ad.post_date}</div>
                    </div>
                    <div className="text-center">
                        <div className="text-xs font-medium text-gray-400 mb-1">Ważne do</div>
                        <div className="text-sm font-bold text-slate-700">{ad.due_date}</div>
                    </div>
                </div>
            </div>

            {/* Stopka z przyciskiem */}
            <div className="px-6 py-5 bg-gradient-to-r from-gray-50 to-gray-100 border-t border-gray-200">
                <button className="w-full bg-white hover:bg-[#FE7F2D] text-slate-800 hover:text-white font-bold py-3.5 rounded-xl transition-all duration-300 border border-gray-300 hover:border-[#FE7F2D] group-hover:shadow-md flex items-center justify-center gap-2">
                    <span>🔍</span>
                    Zobacz szczegóły ogłoszenia
                    <span className="group-hover:translate-x-1 transition-transform">→</span>
                </button>
            </div>
        </div>
    );
};

export default BusinessProfilePage;