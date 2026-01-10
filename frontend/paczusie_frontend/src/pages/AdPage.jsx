import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import FloatingLogger from '../components/FloatingLogger';
import Navbar from '../components/Navbar';
import api from '../services/api';

const AdPage = () => {
    const { id } = useParams();
    const [ad, setAd] = useState(null);
    const [loading, setLoading] = useState(true);

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

    if (loading) return <div className="text-center mt-10">Ładowanie ogłoszenia...</div>;
    if (!ad) return <div className="text-center mt-10">Ogłoszenie nie istnieje.</div>;

    return (
        <div className="bg-[#F5FBE6] min-h-[110vh] pb-12">
            <Navbar />
            
            <div className="max-w-5xl mx-auto mt-8 bg-white shadow-sm border border-gray-200 rounded-lg overflow-hidden">
                
                <div className="p-6 border-b border-gray-100 flex flex-col md:flex-row justify-between items-start gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-800 uppercase tracking-tight">
                            {ad.ad_title}
                        </h1>
                        <p className="text-gray-500 flex items-center mt-1">
                            <span className="mr-2 text-orange-500">📍</span> {ad.address}
                        </p>
                    </div>
                    <div className="bg-slate-50 p-4 rounded-lg border border-slate-100 min-w-[180px] text-center">
                        <span className="text-xs text-gray-400 uppercase font-semibold block mb-1">Cena</span>
                        <span className="text-2xl font-black text-slate-900">{ad.price} PLN</span>
                    </div>
                </div>

                <div className="flex flex-col lg:flex-row">
                
                    <div className="lg:w-1/3 p-6 bg-gray-50/50 border-r border-gray-100">

                        <div className="aspect-square w-full bg-gray-200 rounded-md flex items-center justify-center text-gray-400 font-bold mb-6 shadow-inner border border-gray-300">
                            IMG
                        </div>

                        <div className="space-y-4">
                            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest border-b pb-2">Informacje</h4>
                            
                            <InfoRow label="Data publikacji" value={ad.post_date} />
                            <InfoRow label="Termin wygaśnięcia" value={ad.due_date} />
                            <InfoRow 
                                label="Status" 
                                value={ad.status ? "Aktywne" : "Niezatwierdzone"} 
                                isStatus 
                                statusValue={ad.status}
                            />
                        </div>
                    </div>

                    <div className="lg:w-2/3 p-8">
                        <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">Opis ogłoszenia</h3>
                        <div className="text-gray-700 leading-relaxed text-lg whitespace-pre-wrap min-h-[10vh]]">
                            {ad.description}
                        </div>

                        <div className="mt-12 pt-6 border-t border-gray-100 flex justify-between items-center">
                            <button className="bg-[#FE7F2D] hover:bg-[#E76F1F] text-white px-8 py-3 rounded font-bold transition-colors">
                                Kontakt z firmą
                            </button>

                        </div>
                    </div>

                </div>
            </div>
            <FloatingLogger />
        </div>
    );
};

// Komponent pomocniczy do wierszy danych
const InfoRow = ({ label, value, isStatus, statusValue }) => (
    <div className="flex justify-between items-center py-1">
        <span className="text-sm text-gray-500">{label}:</span>
        {isStatus ? (
            <span className={`text-xs font-bold px-2 py-1 rounded ${statusValue ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                {value}
            </span>
        ) : (
            <span className="text-sm font-semibold text-slate-700">{value}</span>
        )}
    </div>
);

export default AdPage;