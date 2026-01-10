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

                const formattedAd = {
                    id: response.data.ad_id,
                    title: response.data.ad_title,
                    description: response.data.description,
                };

                setAd(formattedAd);
            } catch (error) {
                console.error('Błąd pobierania ogłoszenia: ', error);
            } finally {
                setLoading(false);
            }
        };

        fetchAd();
    }, [id]);

    return (
        <div>
            <Navbar />
            {loading ? (
                <p className="text-center mt-10">Ładowanie ogłoszenia...</p>
                ) : (
                <div className="max-w-4xl mx-auto p-12 bg-white rounded-lg shadow-md mt-10 min-h-[60vh]">
                    
                    <h3 className="font-bold text-lg text-center mb-8">
                    {ad.title}
                    </h3>

                    <div className="border-t border-b py-6 mb-6">
                        <span className="text-gray-600 text-sm">Kategorie ogłoszenia</span>
                    </div>

                    <div className="flex gap-8 items-start">
                    
                    {/* IMG */}
                    <div className="h-[25vw] w-[20vw] min-w-[250px] bg-[#ddd] flex items-center justify-center text-[#888] font-bold">
                        IMG
                    </div>

                    {/* OPIS */}
                    <div className="text-gray-700 text-base whitespace-pre-wrap min-w-[32rem]">
                        <h3 className="font-bold text-xl mb-4 text-center">Opis ogłoszenia:</h3>
                        {ad.description}
                    </div>

                    </div>
                </div>
                )}
            <FloatingLogger />
        </div>
    );
};

export default AdPage;