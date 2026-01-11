import React, { useEffect, useState } from 'react';
import {useNavigate, useParams} from 'react-router';
import FloatingLogger from '../components/FloatingLogger';
import Navbar from '../components/Navbar';
import api from '../services/api';

const AdPage = () => {
    const { id } = useParams();
    const [ad, setAd] = useState(null);
    const [loading, setLoading] = useState(true);
    const [businessProfile, setBusinessProfile] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchAd = async () => {
            try {
                const response = await api.get(`/ads/${id}`);
                setAd(response.data);
            } catch (error) {
                console.error('Błąd pobierania ogłoszenia: ', error);
            } finally {
                setLoading(false);
            }
        };
        fetchAd();
    }, [id]);

    useEffect(() => {
        const bpId = ad?.bp_id;

        if (bpId !== undefined && bpId !== null) {
            const fetchBusinessProfile = async () => {
                try {
                    console.log("Pobieram profil dla ID:", bpId);
                    const response = await api.get(`/businesses/${bpId}`);
                    setBusinessProfile(response.data);
                } catch (error) {
                    console.error('Błąd pobierania profilu biznesu: ', error);
                }
            };
            fetchBusinessProfile();
        }
    }, [ad]);

    if (loading) return (
        <div className="bg-gradient-to-b from-[#F5FBE6] to-gray-50 min-h-screen">
            <Navbar />
            <div className="flex flex-col items-center justify-center min-h-[60vh]">
                <div className="relative">
                    <div className="absolute inset-0 animate-ping rounded-full h-16 w-16 bg-[#FE7F2D]/20"></div>
                    <div className="relative animate-spin rounded-full h-16 w-16 border-t-3 border-b-3 border-[#FE7F2D]"></div>
                </div>
                <p className="mt-6 text-gray-600 font-medium text-lg">Ładowanie ogłoszenia...</p>
            </div>
        </div>
    );

    if (!ad) return (
        <div className="bg-gradient-to-b from-[#F5FBE6] to-gray-50 min-h-screen">
            <Navbar />
            <div className="max-w-4xl mx-auto px-4 sm:px-6 py-20 text-center">
                <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full mb-6">
                    <span className="text-5xl">❌</span>
                </div>
                <h1 className="text-3xl font-bold text-slate-900 mb-4">Ogłoszenie nie istnieje</h1>
                <p className="text-gray-600 text-lg mb-8">
                    Ogłoszenie, które próbujesz wyświetlić, zostało usunięte lub nie istnieje.
                </p>
                <button
                    onClick={() => navigate('/')}
                    className="bg-gradient-to-r from-[#FE7F2D] to-orange-500 hover:from-[#E76F1F] hover:to-orange-600 text-white px-8 py-3 rounded-xl font-bold transition-all duration-300 hover:shadow-lg"
                >
                    Wróć do strony głównej
                </button>
            </div>
        </div>
    );

    return (
        <div className="bg-gradient-to-b from-[#F5FBE6] to-gray-50 min-h-screen pb-12">
            <Navbar />

            <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
                <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-200">
                    {/* Nagłówek */}
                    <div className="p-8 border-b border-gray-100 bg-gradient-to-r from-slate-50 to-gray-50">
                        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
                            <div className="flex-1">
                                <div className="flex items-center mb-3">
                                    <span className={`text-xs font-bold px-3 py-1.5 rounded-full mr-3 ${ad.status ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                        {ad.status ? '✅ AKTYWNE' : '⏳ OCZEKUJĄCE'}
                                    </span>
                                    <span className="text-sm text-gray-500">ID: {ad.ad_id}</span>
                                </div>
                                <h1 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-3">
                                    {ad.ad_title}
                                </h1>
                                <div className="flex items-center text-gray-600">
                                    <span className="mr-2 text-[#FE7F2D]">📍</span>
                                    <span className="text-lg">{ad.address}</span>
                                </div>
                            </div>
                            <div className="bg-gradient-to-br from-orange-50 to-amber-50 p-6 rounded-xl border border-orange-100 min-w-[200px] text-center">
                                <span className="text-xs text-gray-500 uppercase font-semibold tracking-wider block mb-2">CENA</span>
                                <span className="text-4xl font-black text-slate-900">{ad.price}</span>
                                <span className="text-gray-500">zł</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col lg:flex-row">
                        {/* Lewa kolumna - Zdjęcia i informacje */}
                        <div className="lg:w-2/5 p-8 bg-gray-50/50 border-r border-gray-100">
                            {/* Galeria obrazków */}
                            <div className="mb-8">
                                <div className="aspect-square w-full bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl overflow-hidden mb-4 shadow-lg border border-gray-300">
                                    {ad.images && ad.images.length > 0 ? (
                                        <img
                                            src={ad.images[0]}
                                            alt={ad.ad_title}
                                            className="object-cover w-full h-full"
                                        />
                                    ) : (
                                        <div className="flex items-center justify-center w-full h-full">
                                            <span className="text-5xl text-gray-400">🖼️</span>
                                        </div>
                                    )}
                                </div>
                                {ad.images && ad.images.length > 1 && (
                                    <div className="grid grid-cols-4 gap-2">
                                        {ad.images.slice(1).map((img, index) => (
                                            <div key={index} className="aspect-square bg-gray-200 rounded-lg overflow-hidden">
                                                <img
                                                    src={img}
                                                    alt={`${ad.ad_title} ${index + 2}`}
                                                    className="object-cover w-full h-full"
                                                />
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Szczegóły ogłoszenia */}
                            <div className="bg-white rounded-2xl p-6 border border-gray-200">
                                <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center">
                                    <span className="mr-2">📋</span> Szczegóły ogłoszenia
                                </h3>
                                <div className="space-y-4">
                                    <InfoRow
                                        label="Nazwa Firmy"
                                        value={businessProfile ? businessProfile.bp_name : "Ładowanie..."}
                                        icon="🏢"
                                        loading={!businessProfile}
                                    />
                                    <InfoRow label="Data publikacji" value={ad.post_date} icon="📅" />
                                    <InfoRow label="Termin wygaśnięcia" value={ad.due_date} icon="⏰" />
                                    <InfoRow
                                        label="Status"
                                        value={ad.status ? "Aktywne" : "Oczekuje na zatwierdzenie"}
                                        icon={ad.status ? "✅" : "⏳"}
                                        isStatus
                                        statusValue={ad.status}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Prawa kolumna - Opis i akcje */}
                        <div className="lg:w-3/5 p-8">
                            <div className="mb-8">
                                <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center">
                                    <span className="mr-2">📄</span> Opis ogłoszenia
                                </h3>
                                <div className="prose prose-lg max-w-none">
                                    <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
                                        <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                                            {ad.description || "Brak opisu"}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Sekcja firmy */}
                            {businessProfile && (
                                <div className="mb-8">
                                    <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center">
                                        <span className="mr-2">🏢</span> Informacje o firmie
                                    </h3>
                                    <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl p-6 border border-blue-100">
                                        <h4 className="text-xl font-bold text-slate-900 mb-2">{businessProfile.bp_name}</h4>
                                        {businessProfile.description && (
                                            <p className="text-gray-600 mb-4">{businessProfile.description}</p>
                                        )}
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {businessProfile.address && (
                                                <div className="flex items-center text-gray-500">
                                                    <span className="mr-2">📍</span>
                                                    <span>{businessProfile.address}</span>
                                                </div>
                                            )}
                                            {businessProfile.phone && (
                                                <div className="flex items-center text-gray-500">
                                                    <span className="mr-2">📞</span>
                                                    <span>{businessProfile.phone}</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Akcje */}
                            <div className="mt-8 pt-8 border-t border-gray-200">
                                <div className="flex flex-col sm:flex-row gap-4">
                                    {businessProfile && (
                                        <button
                                            onClick={() => navigate(`/business/${ad.bp_id}`)}
                                            className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white px-8 py-3 rounded-xl font-bold transition-all duration-300 hover:shadow-lg flex items-center justify-center"
                                        >
                                            <span className="mr-2">🏢</span> Zobacz pełny profil firmy
                                        </button>
                                    )}
                                    <button
                                        onClick={() => navigate('/')}
                                        className="bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white px-8 py-3 rounded-xl font-bold transition-all duration-300 hover:shadow-lg flex items-center justify-center"
                                    >
                                        <span className="mr-2">←</span> Wróć do ogłoszeń
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <FloatingLogger />
        </div>
    );
};

const InfoRow = ({ label, value, icon, isStatus, statusValue, loading }) => (
    <div className="flex justify-between items-center py-3 border-b border-gray-100 last:border-0">
        <div className="flex items-center">
            {icon && <span className="mr-3 text-gray-400">{icon}</span>}
            <span className="text-sm text-gray-600">{label}:</span>
        </div>
        {loading ? (
            <div className="animate-pulse bg-gray-200 h-4 w-24 rounded"></div>
        ) : isStatus ? (
            <span className={`text-xs font-bold px-3 py-1.5 rounded-full ${statusValue ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                {value}
            </span>
        ) : (
            <span className="text-sm font-semibold text-slate-900">{value}</span>
        )}
    </div>
);

export default AdPage;