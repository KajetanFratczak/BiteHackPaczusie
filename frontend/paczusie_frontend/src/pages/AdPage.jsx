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
    const [alert, setAlert] = useState({ type: '', message: '' });
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

    useEffect(() => {
        const fetchReviews = async () => {
            if (!id) return;

            try {
                const response = await api.get(`/reviews/ad/${id}`);
                setReviews(response.data);

                // Oblicz średnią ocen
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

    const showAlert = (type, message) => {
        setAlert({ type, message });
        setTimeout(() => setAlert({ type: '', message: '' }), 5000);
    };

    const handleSubmitReview = async (e) => {
        e.preventDefault();

        // Walidacja
        if (!newReview.title.trim()) {
            showAlert('error', 'Proszę podać tytuł recenzji');
            return;
        }
        if (!newReview.description.trim()) {
            showAlert('error', 'Proszę podać opis recenzji');
            return;
        }
        if (newReview.rating < 1 || newReview.rating > 5) {
            showAlert('error', 'Ocena musi być w zakresie od 1 do 5');
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

            // Dodaj nową recenzję do listy - recenzje są anonimowe
            setReviews([...reviews, response.data]);

            // Oblicz nową średnią
            const newAvg = (averageRating.average * averageRating.count + reviewData.rating) / (averageRating.count + 1);
            setAverageRating({
                average: newAvg,
                count: averageRating.count + 1
            });

            // Resetuj formularz
            setNewReview({ title: '', description: '', rating: 5 });
            setShowReviewForm(false);

            showAlert('success', 'Recenzja dodana pomyślnie! Dziękujemy za opinię.');
        } catch (error) {
            console.error('Błąd dodawania recenzji: ', error);
            showAlert('error', 'Wystąpił błąd podczas dodawania recenzji. Spróbuj ponownie.');
        } finally {
            setReviewLoading(false);
        }
    };

    if (loading) return (
        <div className="bg-gradient-to-b from-[#FDF6E3] to-gray-50 min-h-screen">
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
        <div className="bg-gradient-to-b from-[#FDF6E3] to-gray-50 min-h-screen">
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
        <div className="bg-gradient-to-b from-[#FDF6E3] to-gray-50 min-h-screen pb-12">
            <Navbar />

            {/* Alerty */}
            {alert.message && (
                <div className="fixed top-4 right-4 z-50 max-w-md">
                    <div className={`p-4 rounded-xl shadow-lg border ${
                        alert.type === 'success' 
                            ? 'bg-green-50 border-green-200' 
                            : 'bg-red-50 border-red-200'
                    }`}>
                        <div className="flex items-start gap-3">
                            <div className="flex-shrink-0 mt-0.5">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                                    alert.type === 'success'
                                        ? 'bg-green-100'
                                        : 'bg-red-100'
                                }`}>
                                    <span className={`text-lg ${
                                        alert.type === 'success' ? 'text-green-600' : 'text-red-600'
                                    }`}>
                                        {alert.type === 'success' ? '✓' : '!'}
                                    </span>
                                </div>
                            </div>
                            <div className="flex-1">
                                <h3 className={`font-semibold mb-1 ${
                                    alert.type === 'success' ? 'text-green-800' : 'text-red-800'
                                }`}>
                                    {alert.type === 'success' ? 'Sukces' : 'Błąd'}
                                </h3>
                                <p className={`text-sm ${
                                    alert.type === 'success' ? 'text-green-700' : 'text-red-700'
                                }`}>
                                    {alert.message}
                                </p>
                            </div>
                            <button
                                onClick={() => setAlert({ type: '', message: '' })}
                                className={`flex-shrink-0 ${
                                    alert.type === 'success' ? 'text-green-500 hover:text-green-700' : 'text-red-500 hover:text-red-700'
                                } transition-colors`}
                                aria-label="Zamknij alert"
                            >
                                <span className="text-xl">×</span>
                            </button>
                        </div>
                    </div>
                </div>
            )}

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
                                <span className="text-4xl font-black text-slate-900">{ad.price || '0 zł'}</span>
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
                                        <span className="text-2xl font-bold text-slate-900">
                                            {averageRating.average.toFixed(1)}
                                        </span>
                                    </div>
                                    <div className="text-gray-600">
                                        <span className="font-medium">{averageRating.count} {getReviewDeclension(averageRating.count)}</span>
                                    </div>
                                </div>
                            </div>
                            <button
                                onClick={() => setShowReviewForm(true)}
                                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-6 py-3 rounded-xl font-bold transition-all duration-300 hover:shadow-lg flex items-center"
                            >
                                <Plus size={20} className="mr-2" />
                                Dodaj recenzję
                            </button>
                        </div>
                    </div>

                    {/* Formularz dodawania recenzji */}
                    {showReviewForm && (
                        <div className="p-8 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-cyan-50">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-xl font-bold text-slate-900">Dodaj nową recenzję</h3>
                                <button
                                    onClick={() => setShowReviewForm(false)}
                                    className="p-2 text-gray-500 hover:text-gray-700"
                                >
                                    <X size={24} />
                                </button>
                            </div>

                            <form onSubmit={handleSubmitReview} className="space-y-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Tytuł recenzji *
                                    </label>
                                    <input
                                        type="text"
                                        value={newReview.title}
                                        onChange={(e) => setNewReview({...newReview, title: e.target.value})}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="Podaj tytuł recenzji"
                                        required
                                        maxLength={100}
                                    />
                                    <p className="text-xs text-gray-500 mt-1">
                                        Maksymalnie 100 znaków
                                    </p>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Ocena *
                                    </label>
                                    <div className="flex items-center gap-1">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <button
                                                key={star}
                                                type="button"
                                                onClick={() => setNewReview({...newReview, rating: star})}
                                                className="p-1 hover:scale-110 transition-transform"
                                            >
                                                <Star
                                                    size={32}
                                                    className={`${
                                                        star <= newReview.rating 
                                                            ? 'fill-amber-400 text-amber-400' 
                                                            : 'fill-gray-200 text-gray-200'
                                                    }`}
                                                />
                                            </button>
                                        ))}
                                        <span className="ml-4 text-lg font-bold text-slate-900">
                                            {newReview.rating.toFixed(1)} / 5.0
                                        </span>
                                    </div>
                                    <p className="text-xs text-gray-500 mt-1">
                                        Kliknij gwiazdkę, aby wybrać ocenę
                                    </p>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Opis recenzji *
                                    </label>
                                    <textarea
                                        value={newReview.description}
                                        onChange={(e) => setNewReview({...newReview, description: e.target.value})}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-h-[120px]"
                                        placeholder="Opisz swoje doświadczenia..."
                                        required
                                        maxLength={1000}
                                    />
                                    <p className="text-xs text-gray-500 mt-1">
                                        Maksymalnie 1000 znaków
                                    </p>
                                </div>

                                <div className="flex justify-end gap-4">
                                    <button
                                        type="button"
                                        onClick={() => setShowReviewForm(false)}
                                        className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors"
                                    >
                                        Anuluj
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={reviewLoading}
                                        className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white px-6 py-3 rounded-xl font-bold transition-all duration-300 hover:shadow-lg flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {reviewLoading ? (
                                            <>
                                                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                                                Dodawanie...
                                            </>
                                        ) : (
                                            <>
                                                <Send size={18} className="mr-2" />
                                                Dodaj recenzję
                                            </>
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}

                    {/* Lista recenzji */}
                    <div className="p-8">
                        {reviews.length === 0 ? (
                            <div className="text-center py-12">
                                <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full mb-6">
                                    <MessageSquare size={32} className="text-gray-400" />
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 mb-3">Brak recenzji</h3>
                                <p className="text-gray-600 mb-8">
                                    Ten produkt nie ma jeszcze żadnych recenzji. Bądź pierwszy!
                                </p>
                                <button
                                    onClick={() => setShowReviewForm(true)}
                                    className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-6 py-3 rounded-xl font-bold transition-all duration-300 hover:shadow-lg"
                                >
                                    Dodaj pierwszą recenzję
                                </button>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {reviews.map((review) => (
                                    <ReviewCard
                                        key={review.review_id}
                                        review={review}
                                    />
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