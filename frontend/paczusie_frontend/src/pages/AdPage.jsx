import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import FloatingLogger from '../components/FloatingLogger';
import Navbar from '../components/Navbar';
import api from '../services/api';
import ReviewCard from '../components/ReviewCard';
import { 
    MessageSquare, 
    Star, 
    Plus, 
    Send, 
    X 
} from 'lucide-react';

const getReviewDeclension = (count) => {
    if (count === 1) return 'recenzja';
    if (count >= 2 && count <= 4) return 'recenzje';
    return 'recenzji';
};

const AdPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    // Stany danych
    const [ad, setAd] = useState(null);
    const [loading, setLoading] = useState(true);
    const [businessProfile, setBusinessProfile] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [averageRating, setAverageRating] = useState({ average: 0, count: 0 });

    // Stany UI
    const [activeImageIndex, setActiveImageIndex] = useState(0);
    const [showReviewForm, setShowReviewForm] = useState(false);
    const [newReview, setNewReview] = useState({ title: '', description: '', rating: 5 });
    const [reviewLoading, setReviewLoading] = useState(false);
    const [alert, setAlert] = useState({ type: '', message: '' });

    useEffect(() => {
        const fetchAd = async () => {
            try {
                const response = await api.get(`/ads/${id}`);
                setAd(response.data);
            } catch (error) {
                console.error('Błąd pobierania ogłoszenia:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchAd();
    }, [id]);

    useEffect(() => {
        if (ad?.bp_id) {
            const fetchBusinessProfile = async () => {
                try {
                    const response = await api.get(`/businesses/${ad.bp_id}`);
                    setBusinessProfile(response.data);
                } catch (error) {
                    console.error('Błąd profilu:', error);
                }
            };
            fetchBusinessProfile();
        }
    }, [ad]);

    useEffect(() => {
        if (!id) return;
        const fetchReviews = async () => {
            try {
                const response = await api.get(`/reviews/ad/${id}`);
                setReviews(response.data);
                if (response.data.length > 0) {
                    const avg = response.data.reduce((sum, r) => sum + r.rating, 0) / response.data.length;
                    setAverageRating({ average: avg, count: response.data.length });
                }
            } catch (error) {
                console.error('Błąd recenzji:', error);
            }
        };
        fetchReviews();
    }, [id]);

    const showAlert = (type, message) => {
        setAlert({ type, message });
        setTimeout(() => setAlert({ type: '', message: '' }), 5000);
    };

    const handleSubmitReview = async (e) => {
        e.preventDefault();
        if (!newReview.title.trim() || !newReview.description.trim()) {
            showAlert('error', 'Wypełnij wszystkie pola');
            return;
        }

        setReviewLoading(true);
        try {
            const reviewData = {
                title: newReview.title.trim(),
                description: newReview.description.trim(),
                ad_id: parseInt(id),
                rating: parseFloat(newReview.rating)
            };
            const response = await api.post('/reviews', reviewData);
            setReviews([response.data, ...reviews]);
            
            const newCount = averageRating.count + 1;
            const newAvg = (averageRating.average * averageRating.count + reviewData.rating) / newCount;
            setAverageRating({ average: newAvg, count: newCount });

            setNewReview({ title: '', description: '', rating: 5 });
            setShowReviewForm(false);
            showAlert('success', 'Recenzja dodana pomyślnie!');
        } catch (error) {
            showAlert('error', 'Błąd podczas dodawania recenzji.');
        } finally {
            setReviewLoading(false);
        }
    };

    if (loading) return (
        <div className="bg-[#FDF6E3] min-h-screen flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-[#FE7F2D]"></div>
        </div>
    );

    if (!ad) return <div className="text-center py-20 font-bold">Ogłoszenie nie istnieje</div>;

    return (
        <div className="bg-gradient-to-b from-[#FDF6E3] to-gray-50 min-h-screen pb-12">
            <Navbar />

            {alert.message && (
                <div className={`fixed top-24 right-4 z-50 p-4 rounded-xl shadow-2xl border ${
                    alert.type === 'success' ? 'bg-green-50 border-green-200 text-green-800' : 'bg-red-50 border-red-200 text-red-800'
                }`}>
                    {alert.message}
                </div>
            )}

            <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
                <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-200 mb-8">
                    
                    {/* Header */}
                    <div className="p-8 border-b border-gray-100 bg-slate-50/50">
                        <div className="flex flex-col lg:flex-row justify-between gap-6">
                            <div>
                                <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold mb-3 ${ad.status ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
                                    {ad.status ? '✅ AKTYWNE' : '⏳ OCZEKUJĄCE'}
                                </span>
                                <h1 className="text-3xl font-black text-slate-900 mb-2">{ad.ad_title}</h1>
                                <div className="flex items-center text-gray-500">
                                    <span className="mr-2">📍</span>
                                    <span className="text-lg">{ad.address}</span>
                                </div>
                            </div>
                            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 text-center min-w-[180px]">
                                <span className="text-xs text-gray-400 uppercase font-bold block mb-1">Cena usługi</span>
                                <span className="text-4xl font-black text-[#FE7F2D]">{ad.price || '0 zł'}</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col lg:flex-row">
                        {/* Lewa kolumna: Galeria */}
                        <div className="lg:w-1/2 p-8 border-r border-gray-100 bg-gray-50/30">
                            <div className="aspect-video bg-white rounded-2xl overflow-hidden shadow-inner border border-gray-200 mb-4">
                                {ad.images?.length > 0 ? (
                                    <img 
                                        src={ad.images[activeImageIndex]} 
                                        className="w-full h-full object-cover transition-opacity duration-300"
                                        alt="Podgląd główny" 
                                    />
                                ) : (
                                    <div className="flex items-center justify-center h-full text-gray-400 italic">Brak zdjęć</div>
                                )}
                            </div>

                            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                                {ad.images?.map((img, idx) => (
                                    <button 
                                        key={idx}
                                        onClick={() => setActiveImageIndex(idx)}
                                        className={`relative flex-shrink-0 w-24 h-24 rounded-xl overflow-hidden border-4 transition-all ${
                                            activeImageIndex === idx ? 'border-[#FE7F2D] scale-95' : 'border-transparent opacity-60 hover:opacity-100'
                                        }`}
                                    >
                                        <img src={img} className="w-full h-full object-cover" alt="" />
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Prawa kolumna */}
                        <div className="lg:w-1/2 p-8">
                            <div className="mb-8">
                                <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center">
                                    <MessageSquare className="mr-2 text-[#FE7F2D]" size={20} />
                                    O usłudze
                                </h3>
                                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                                    <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">
                                        {ad.description || "Brak szczegółowego opisu."}
                                    </p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                                <div className="p-4 bg-white rounded-xl border border-gray-100 shadow-sm">
                                    <span className="text-xs text-gray-400 font-bold block mb-1">DODANO</span>
                                    <div className="flex items-center text-slate-700">
                                        <span className="mr-2">📅</span> {ad.post_date}
                                    </div>
                                </div>
                                <div className="p-4 bg-white rounded-xl border border-gray-100 shadow-sm">
                                    <span className="text-xs text-gray-400 font-bold block mb-1">WAŻNE DO</span>
                                    <div className="flex items-center text-slate-700">
                                        <span className="mr-2">⏰</span> {ad.due_date}
                                    </div>
                                </div>
                            </div>

                            {businessProfile && (
                                <div className="bg-[#FE7F2D]/5 rounded-2xl p-6 border border-[#FE7F2D]/10">
                                    <div className="flex items-center mb-4">
                                        <div className="w-12 h-12 bg-[#FE7F2D] rounded-full flex items-center justify-center text-white mr-4 font-bold text-xl">
                                            🏢
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-slate-900">{businessProfile.bp_name}</h4>
                                            <p className="text-sm text-gray-500">{businessProfile.address}</p>
                                        </div>
                                    </div>
                                    <button 
                                        onClick={() => navigate(`/business/${ad.bp_id}`)}
                                        className="w-full bg-[#FE7F2D] hover:bg-[#e66f24] text-white font-bold py-3 rounded-xl transition-colors shadow-lg"
                                    >
                                        Zobacz Profil Firmy
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Recenzje */}
                <div className="mt-12">
                    <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                        <div>
                            <h2 className="text-3xl font-black text-slate-900">Opinie klientów</h2>
                            <div className="flex items-center mt-2">
                                <div className="flex text-amber-400 mr-3">
                                    {[...Array(5)].map((_, i) => (
                                        <Star key={i} size={20} fill={i < Math.round(averageRating.average) ? "currentColor" : "none"} />
                                    ))}
                                </div>
                                <span className="font-bold text-lg">{averageRating.average.toFixed(1)}</span>
                                <span className="text-gray-400 ml-2">({averageRating.count} {getReviewDeclension(averageRating.count)})</span>
                            </div>
                        </div>
                        <button 
                            onClick={() => setShowReviewForm(true)}
                            className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-6 py-3 rounded-xl font-bold transition-all"
                        >
                            <Plus size={20} /> Dodaj opinię
                        </button>
                    </div>

                    {showReviewForm && (
                        <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100 mb-8 animate-in fade-in slide-in-from-top-4">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-xl font-bold">Twoja opinia</h3>
                                <button onClick={() => setShowReviewForm(false)} className="text-gray-400 hover:text-gray-600"><X /></button>
                            </div>
                            <form onSubmit={handleSubmitReview} className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-4">
                                        <input 
                                            type="text" 
                                            placeholder="Tytuł opinii..."
                                            className="w-full p-4 bg-gray-50 rounded-xl border border-gray-100 focus:ring-2 focus:ring-[#FE7F2D] outline-none"
                                            value={newReview.title}
                                            onChange={(e) => setNewReview({...newReview, title: e.target.value})}
                                        />
                                        <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl border border-gray-100">
                                            <span className="font-bold text-sm text-gray-500">Ocena:</span>
                                            <div className="flex gap-1">
                                                {[1,2,3,4,5].map(num => (
                                                    <Star 
                                                        key={num} 
                                                        size={24} 
                                                        className="cursor-pointer transition-colors"
                                                        fill={num <= newReview.rating ? "#FBBF24" : "none"}
                                                        color={num <= newReview.rating ? "#FBBF24" : "#D1D5DB"}
                                                        onClick={() => setNewReview({...newReview, rating: num})}
                                                    />
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                    <textarea 
                                        placeholder="Opisz swoje wrażenia..."
                                        rows="5"
                                        className="w-full p-4 bg-gray-50 rounded-xl border border-gray-100 focus:ring-2 focus:ring-[#FE7F2D] outline-none"
                                        value={newReview.description}
                                        onChange={(e) => setNewReview({...newReview, description: e.target.value})}
                                    ></textarea>
                                </div>
                                <div className="flex justify-end">
                                    <button 
                                        disabled={reviewLoading}
                                        className="bg-[#FE7F2D] text-white px-8 py-3 rounded-xl font-bold flex items-center gap-2 hover:scale-105 transition-transform disabled:opacity-50"
                                    >
                                        {reviewLoading ? 'Wysyłanie...' : <><Send size={18} /> Opublikuj</>}
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {reviews.length > 0 ? (
                            reviews.map(review => <ReviewCard key={review.id} review={review} />)
                        ) : (
                            <div className="col-span-full py-12 text-center bg-white rounded-3xl border border-dashed border-gray-300">
                                <p className="text-gray-400">Brak opinii. Bądź pierwszy!</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <FloatingLogger />
        </div>
    );
};

export default AdPage;