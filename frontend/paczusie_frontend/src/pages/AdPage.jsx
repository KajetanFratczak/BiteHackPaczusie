import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import FloatingLogger from '../components/FloatingLogger';
import Navbar from '../components/Navbar';
import api from '../services/api';
import ReviewCard from '../components/ReviewCard';
import { MessageSquare, Star, Plus, Send, X } from 'lucide-react';

const getReviewDeclension = (count) => {
    if (count === 1) return 'recenzja';
    if (count >= 2 && count <= 4) return 'recenzje';
    return 'recenzji';
};

const AdPage = () => {
    const { id } = useParams();
    const [ad, setAd] = useState(null);
    const [loading, setLoading] = useState(true);
    const [businessProfile, setBusinessProfile] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [averageRating, setAverageRating] = useState({ average: 0, count: 0 });
    const [showReviewForm, setShowReviewForm] = useState(false);
    const [newReview, setNewReview] = useState({ title: '', description: '', rating: 5 });
    const [reviewLoading, setReviewLoading] = useState(false);
    const [user, setUser] = useState(null);
    
    // NOWY STAN: indeks aktualnie wyświetlanego zdjęcia
    const [activeImageIndex, setActiveImageIndex] = useState(0);
    
    const navigate = useNavigate();

    useEffect(() => {
        const fetchAd = async () => {
            try {
                const response = await api.get(`/ads/${id}`);
                setAd(response.data);
                // Resetujemy indeks przy ładowaniu nowego ogłoszenia
                setActiveImageIndex(0);
            } catch (error) {
                console.error('Błąd pobierania ogłoszenia: ', error);
            } finally {
                setLoading(false);
            }
        };
        fetchAd();
    }, [id]);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await api.get('/me');
                setUser(response.data);
            } catch (error) {
                console.error('Błąd pobierania danych użytkownika:', error);
            }
        };
        fetchUser();
    }, []);

    useEffect(() => {
        const bpId = ad?.bp_id;
        if (bpId !== undefined && bpId !== null) {
            const fetchBusinessProfile = async () => {
                try {
                    const response = await api.get(`/businesses/${bpId}`);
                    setBusinessProfile(response.data);
                } catch (error) {
                    console.error('Błąd pobierania profilu biznesu: ', error);
                }
            };
            fetchBusinessProfile();
        }
    }, [ad]);

    useEffect(() => {
        const fetchReviews = async () => {
            if (!id) return;
            try {
                const response = await api.get(`/reviews/ad/${id}`);
                setReviews(response.data);
                if (response.data.length > 0) {
                    const avg = response.data.reduce((sum, review) => sum + review.rating, 0) / response.data.length;
                    setAverageRating({ average: avg, count: response.data.length });
                }
            } catch (error) {
                console.error('Błąd pobierania recenzji: ', error);
            }
        };
        fetchReviews();
    }, [id]);

    const handleSubmitReview = async (e) => {
        e.preventDefault();
        if (!user) {
            alert('Musisz być zalogowany, aby dodać recenzję');
            return;
        }
        setReviewLoading(true);
        try {
            const reviewData = {
                ...newReview,
                ad_id: parseInt(id),
                rating: parseFloat(newReview.rating)
            };
            const response = await api.post('/reviews', reviewData);
            setReviews([...reviews, response.data]);
            const newAvg = (averageRating.average * averageRating.count + reviewData.rating) / (averageRating.count + 1);
            setAverageRating({ average: newAvg, count: averageRating.count + 1 });
            setNewReview({ title: '', description: '', rating: 5 });
            setShowReviewForm(false);
            alert('Recenzja dodana pomyślnie!');
        } catch (error) {
            console.error('Błąd dodawania recenzji: ', error);
            alert('Wystąpił błąd podczas dodawania recenzji');
        } finally {
            setReviewLoading(false);
        }
    };

    const handleDeleteReview = async (reviewId) => {
        if (!window.confirm('Czy na pewno chcesz usunąć tę recenzję?')) return;
        try {
            await api.delete(`/reviews/${reviewId}`);
            setReviews(reviews.filter(review => review.review_id !== reviewId));
            const deletedReview = reviews.find(r => r.review_id === reviewId);
            if (deletedReview && averageRating.count > 1) {
                const newTotal = averageRating.average * averageRating.count - deletedReview.rating;
                const newCount = averageRating.count - 1;
                setAverageRating({ average: newTotal / newCount, count: newCount });
            } else {
                setAverageRating({ average: 0, count: 0 });
            }
            alert('Recenzja usunięta pomyślnie');
        } catch (error) {
            console.error('Błąd usuwania recenzji: ', error);
            alert('Wystąpił błąd podczas usuwania recenzji');
        }
    };

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
                <p className="text-gray-600 text-lg mb-8">Ogłoszenie, które próbujesz wyświetlić, zostało usunięte lub nie istnieje.</p>
                <button onClick={() => navigate('/')} className="bg-gradient-to-r from-[#FE7F2D] to-orange-500 hover:from-[#E76F1F] hover:to-orange-600 text-white px-8 py-3 rounded-xl font-bold transition-all duration-300 hover:shadow-lg">
                    Wróć do strony głównej
                </button>
            </div>
        </div>
    );

    return (
        <div className="bg-gradient-to-b from-[#FDF6E3] to-gray-50 min-h-screen pb-12">
            <Navbar />

            <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
                <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-200 mb-8">
                    {/* Nagłówek */}
                    <div className="p-8 border-b border-gray-100 bg-gradient-to-r from-slate-50 to-gray-50">
                        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
                            <div className="flex-1">
                                <div className="flex items-center mb-3">
                                    <span className={`text-xs font-bold px-3 py-1.5 rounded-full mr-3 ${ad.status ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                        {ad.status ? '✅ AKTYWNE' : '⏳ OCZEKUJĄCE'}
                                    </span>
                                </div>
                                <h1 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-3">{ad.ad_title}</h1>
                                <div className="flex items-center text-gray-600">
                                    <span className="mr-2 text-[#FE7F2D]">📍</span>
                                    <span className="text-lg">{ad.address}</span>
                                </div>
                            </div>
                            <div className="bg-gradient-to-br from-orange-50 to-amber-50 p-6 rounded-xl border border-orange-100 min-w-[200px] text-center">
                                <span className="text-xs text-gray-500 uppercase font-semibold tracking-wider block mb-2">CENA</span>
                                <span className="text-4xl font-black text-slate-900">{ad.price || '0 zł'}</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col lg:flex-row">
                        {/* Lewa kolumna - GALERIA ZDJĘĆ */}
                        <div className="lg:w-2/5 p-8 bg-gray-50/50 border-r border-gray-100">
                            <div className="mb-8">
                                {/* Główne zdjęcie */}
                                <div className="aspect-square w-full bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl overflow-hidden mb-4 shadow-lg border border-gray-300">
                                    {ad.images && ad.images.length > 0 ? (
                                        <img
                                            src={ad.images[activeImageIndex]}
                                            alt={ad.ad_title}
                                            className="object-cover w-full h-full transition-opacity duration-300"
                                        />
                                    ) : (
                                        <div className="flex items-center justify-center w-full h-full">
                                            <span className="text-5xl text-gray-400">🖼️</span>
                                        </div>
                                    )}
                                </div>
                                
                                {/* Miniaturki (wyświetlane jeśli jest > 0 zdjęć) */}
                                {ad.images && ad.images.length > 1 && (
                                    <div className="grid grid-cols-4 gap-2">
                                        {ad.images.map((img, index) => (
                                            <div 
                                                key={index} 
                                                onClick={() => setActiveImageIndex(index)}
                                                className={`aspect-square rounded-lg overflow-hidden cursor-pointer transition-all border-2 ${
                                                    activeImageIndex === index 
                                                    ? 'border-[#FE7F2D] scale-95' 
                                                    : 'border-transparent hover:border-gray-300'
                                                }`}
                                            >
                                                <img
                                                    src={img}
                                                    alt={`${ad.ad_title} thumbnail ${index + 1}`}
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
                                    <InfoRow label="Nazwa Firmy" value={businessProfile ? businessProfile.bp_name : "Ładowanie..."} icon="🏢" loading={!businessProfile} />
                                    <InfoRow label="Data publikacji" value={ad.post_date} icon="📅" />
                                    <InfoRow label="Termin wygaśnięcia" value={ad.due_date} icon="⏰" />
                                    <InfoRow label="Status" value={ad.status ? "Aktywne" : "Oczekuje"} icon={ad.status ? "✅" : "⏳"} isStatus statusValue={ad.status} />
                                </div>
                            </div>
                        </div>

                        {/* Prawa kolumna - Opis i akcje */}
                        <div className="lg:w-3/5 p-8">
                            <div className="mb-8">
                                <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center">
                                    <span className="mr-2">📄</span> Opis ogłoszenia
                                </h3>
                                <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
                                    <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{ad.description || "Brak opisu"}</p>
                                </div>
                            </div>

                            {businessProfile && (
                                <div className="mb-8">
                                    <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center">
                                        <span className="mr-2">🏢</span> Informacje o firmie
                                    </h3>
                                    <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl p-6 border border-blue-100">
                                        <h4 className="text-xl font-bold text-slate-900 mb-2">{businessProfile.bp_name}</h4>
                                        {businessProfile.description && <p className="text-gray-600 mb-4">{businessProfile.description}</p>}
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {businessProfile.address && <div className="flex items-center text-gray-500"><span className="mr-2">📍</span>{businessProfile.address}</div>}
                                            {businessProfile.phone && <div className="flex items-center text-gray-500"><span className="mr-2">📞</span>{businessProfile.phone}</div>}
                                        </div>
                                    </div>
                                </div>
                            )}

                            <div className="mt-8 pt-8 border-t border-gray-200">
                                <div className="flex flex-col sm:flex-row gap-4">
                                    {businessProfile && (
                                        <button onClick={() => navigate(`/business/${ad.bp_id}`)} className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white px-8 py-3 rounded-xl font-bold transition-all duration-300 hover:shadow-lg flex items-center justify-center">
                                            <span className="mr-2">🏢</span> Profil firmy
                                        </button>
                                    )}
                                    <button onClick={() => navigate('/')} className="bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white px-8 py-3 rounded-xl font-bold transition-all duration-300 hover:shadow-lg flex items-center justify-center">
                                        <span className="mr-2">←</span> Wróć
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sekcja Recenzji */}
                <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-200">
                    <div className="p-8 border-b border-gray-100 bg-gradient-to-r from-purple-50 to-pink-50">
                        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
                            <div>
                                <h2 className="text-2xl font-bold text-slate-900 mb-2 flex items-center">
                                    <MessageSquare className="mr-3 text-purple-600" size={28} />
                                    Recenzje klientów
                                </h2>
                                <div className="flex items-center gap-4">
                                    <div className="flex items-center">
                                        <Star className="fill-amber-400 text-amber-400 mr-1" size={20} />
                                        <span className="text-2xl font-bold text-slate-900">{averageRating.average.toFixed(1)}</span>
                                    </div>
                                    <div className="text-gray-600 font-medium">{averageRating.count} {getReviewDeclension(averageRating.count)}</div>
                                </div>
                            </div>
                            {user && (
                                <button onClick={() => setShowReviewForm(true)} className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-6 py-3 rounded-xl font-bold transition-all duration-300 hover:shadow-lg flex items-center">
                                    <Plus size={20} className="mr-2" /> Dodaj recenzję
                                </button>
                            )}
                        </div>
                    </div>

                    {showReviewForm && (
                        <div className="p-8 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-cyan-50">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-xl font-bold text-slate-900">Dodaj nową recenzję</h3>
                                <button onClick={() => setShowReviewForm(false)} className="p-2 text-gray-500 hover:text-gray-700"><X size={24} /></button>
                            </div>
                            <form onSubmit={handleSubmitReview} className="space-y-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Tytuł *</label>
                                    <input type="text" value={newReview.title} onChange={(e) => setNewReview({...newReview, title: e.target.value})} className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500" placeholder="Tytuł recenzji" required />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Ocena *</label>
                                    <div className="flex items-center gap-1">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <button key={star} type="button" onClick={() => setNewReview({...newReview, rating: star})} className="p-1">
                                                <Star size={32} className={`${star <= newReview.rating ? 'fill-amber-400 text-amber-400' : 'fill-gray-200 text-gray-200'} hover:scale-110 transition-transform`} />
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Opis *</label>
                                    <textarea value={newReview.description} onChange={(e) => setNewReview({...newReview, description: e.target.value})} className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 min-h-[120px]" placeholder="Twoja opinia..." required />
                                </div>
                                <div className="flex justify-end gap-4">
                                    <button type="button" onClick={() => setShowReviewForm(false)} className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl">Anuluj</button>
                                    <button type="submit" disabled={reviewLoading} className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-6 py-3 rounded-xl font-bold disabled:opacity-50">
                                        {reviewLoading ? 'Dodawanie...' : 'Wyślij'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}

                    <div className="p-8">
                        {reviews.length === 0 ? (
                            <div className="text-center py-12">
                                <MessageSquare size={32} className="text-gray-400 mx-auto mb-4" />
                                <h3 className="text-xl font-bold text-slate-900 mb-2">Brak recenzji</h3>
                                {!user && <button onClick={() => navigate('/login')} className="text-purple-600 font-bold">Zaloguj się, by dodać pierwszą!</button>}
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {reviews.map((review) => (
                                    <ReviewCard key={review.review_id} review={review} currentUserId={user?.user_id} onDelete={handleDeleteReview} />
                                ))}
                            </div>
                        )}
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