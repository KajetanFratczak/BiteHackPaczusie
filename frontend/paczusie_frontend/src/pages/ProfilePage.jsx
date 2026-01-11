import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';
import { companyService } from '../services/companyService';
import { adService } from '../services/adService';
import { categoryService } from '../services/categoryService';

const getAdsDeclension = (count) => {
    const lastDigit = count % 10;
    const lastTwoDigits = count % 100;

    if (count === 1) return 'ogłoszenie';
    if (lastDigit >= 2 && lastDigit <= 4 && (lastTwoDigits < 10 || lastTwoDigits > 20)) return 'ogłoszenia';
    return 'ogłoszeń';
};

const getFirmDeclension = (count) => {
    if(count === 1) return 'firma';
    if(count >= 2 && count <= 4) return 'firmy';
    return 'firm'
}

const ProfilePage = () => {
    const { user } = useAuth();
    const [businesses, setBusinesses] = useState([]);
    const [ads, setAds] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('profile');
    const [showBusinessForm, setShowBusinessForm] = useState(false);
    const [showAdForm, setShowAdForm] = useState(false);
    const [imageUrls, setImageUrls] = useState(['']);
    const [error, setError] = useState('');

    const [businessData, setBusinessData] = useState({
        bp_name: '',
        description: '',
        address: '',
        phone: ''
    });

    const [adData, setAdData] = useState({
        ad_title: '',
        description: '',
        bp_id: '',
        category_id: '',
        price: '',
        address: '',
        post_date: new Date().toISOString().split('T')[0],
        due_date: '',
        images: []
    });

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setLoading(true);
        setError('');
        try {
            const [businessesData, categoriesData, adsData] = await Promise.all([
                companyService.getByUserId(user?.id),
                categoryService.getAll(),
                adService.getByUserId(user?.id)
            ]);
            setBusinesses(businessesData || []);
            setCategories(categoriesData || []);
            setAds(adsData || []);
        } catch (error) {
            console.error('Błąd pobierania danych: ', error);
            setError('Nie udało się załadować danych. Spróbuj ponownie.');
        } finally {
            setLoading(false);
        }
    };

    const handleAddBusiness = async (e) => {
        e.preventDefault();
        setError('');
        try {
            if (!user?.id) {
                throw new Error('Użytkownik nie jest zalogowany');
            }

            await companyService.create({
                ...businessData,
                user_id: user.id
            });
            setBusinessData({ bp_name: '', description: '', address: '', phone: '' });
            setShowBusinessForm(false);
            loadData();
            alert('Firma została dodana pomyślnie!');
        } catch (error) {
            console.error('Błąd dodawania firmy: ', error);
            setError('Nie udało się dodać firmy. Spróbuj ponownie.');
        }
    };

    const addImageField = () => {
        setImageUrls([...imageUrls, '']);
    };

    const removeImageField = (index) => {
        const newImageUrls = imageUrls.filter((_, i) => i !== index);
        setImageUrls(newImageUrls);
    };

    const updateImageUrl = (index, value) => {
        const newImageUrls = [...imageUrls];
        newImageUrls[index] = value;
        setImageUrls(newImageUrls);
    };

    const handleAddAd = async (e) => {
        e.preventDefault();
        setError('');

        try {
            if (!adData.ad_title || !adData.bp_id || !adData.category_id ||
                !adData.price || !adData.address || !adData.due_date) {
                setError('Wypełnij wszystkie wymagane pola oznaczone *');
                return;
            }

            const filteredImages = imageUrls.filter(url => url.trim() !== '');

            const adToCreate = {
                ad_title: adData.ad_title,
                bp_id: adData.bp_id,
                description: adData.description,
                category_id: adData.category_id,
                price: parseFloat(adData.price),
                address: adData.address,
                post_date: adData.post_date,
                due_date: adData.due_date,
                images: filteredImages
            };

            await adService.create(adToCreate);

            setAdData({
                ad_title: '',
                description: '',
                bp_id: '',
                category_id: '',
                price: '',
                address: '',
                post_date: new Date().toISOString().split('T')[0],
                due_date: '',
                images: []
            });

            setImageUrls(['']);
            setShowAdForm(false);
            loadData();
            alert('Ogłoszenie zostało dodane! Oczekuje na zatwierdzenie przez administratora.');
        } catch (error) {
            console.error('Błąd dodawania ogłoszenia: ', error);
            setError('Wystąpił błąd podczas dodawania ogłoszenia');
        }
    };

    const handleDeleteBusiness = async (businessId) => {
        if (window.confirm('Czy na pewno chcesz usunąć tę firmę?')) {
            try {
                await companyService.delete(businessId);
                loadData();
                alert('Firma została usunięta');
            } catch (error) {
                console.error('Błąd usuwania firmy: ', error);
                setError('Nie udało się usunąć firmy');
            }
        }
    };

    const handleDeleteAd = async (adId) => {
        if (window.confirm('Czy na pewno chcesz usunąć to ogłoszenie?')) {
            try {
                await adService.delete(adId);
                loadData();
                alert('Ogłoszenie zostało usunięte');
            } catch (error) {
                console.error('Błąd usuwania ogłoszenia: ', error);
                setError('Nie udało się usunąć ogłoszenia');
            }
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-[#F5FBE6] to-gray-50">
                <div className="relative">
                    <div className="absolute inset-0 animate-ping rounded-full h-16 w-16 bg-[#FE7F2D]/20"></div>
                    <div className="relative animate-spin rounded-full h-16 w-16 border-t-3 border-b-3 border-[#FE7F2D]"></div>
                </div>
                <p className="mt-6 text-gray-600 font-medium">Ładowanie profilu...</p>
            </div>
        );
    }

    return (
        <div className="bg-gradient-to-b from-[#F5FBE6] to-gray-50 min-h-screen pb-12">
            <Navbar />

            <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
                <div className="text-center mb-10">
                    <h1 className="text-4xl lg:text-5xl font-bold text-slate-900 mb-4">
                        Mój <span className="text-[#FE7F2D]">Profil</span>
                    </h1>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                        Zarządzaj swoimi danymi, firmami i ogłoszeniami
                    </p>
                </div>

                {error && (
                    <div className="max-w-4xl mx-auto mb-6">
                        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg">
                            <div className="flex">
                                <div className="flex-shrink-0">
                                    <span className="text-red-500">⚠️</span>
                                </div>
                                <div className="ml-3">
                                    <p className="text-sm text-red-700">{error}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Tabs */}
                <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl p-2 mb-8 border border-gray-200">
                    <div className="flex flex-col sm:flex-row gap-2">
                        <button
                            onClick={() => setActiveTab('profile')}
                            className={`px-6 py-3 rounded-xl font-bold transition-all duration-300 ${activeTab === 'profile'
                                ? 'bg-gradient-to-r from-[#619B8A] to-teal-600 text-white shadow-lg'
                                : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                            }`}
                        >
                            <span className="mr-2">👤</span> Profil
                        </button>
                        <button
                            onClick={() => setActiveTab('businesses')}
                            className={`px-6 py-3 rounded-xl font-bold transition-all duration-300 ${activeTab === 'businesses'
                                ? 'bg-gradient-to-r from-[#619B8A] to-teal-600 text-white shadow-lg'
                                : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                            }`}
                        >
                            <span className="mr-2">🏢</span> Moje Firmy
                        </button>
                        <button
                            onClick={() => setActiveTab('ads')}
                            className={`px-6 py-3 rounded-xl font-bold transition-all duration-300 ${activeTab === 'ads'
                                ? 'bg-gradient-to-r from-[#619B8A] to-teal-600 text-white shadow-lg'
                                : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                            }`}
                        >
                            <span className="mr-2">📢</span> Moje Ogłoszenia
                        </button>
                    </div>
                </div>

                {/* Profile Tab */}
                {activeTab === 'profile' && (
                    <div className="max-w-4xl mx-auto">
                        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-200">
                            <h2 className="text-2xl lg:text-3xl font-bold text-slate-900 mb-6 pb-4 border-b border-gray-100">
                                Informacje o Profilu
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <InfoField label="Imię" value={user?.firstName || "Brak danych"} icon="👤" />
                                <InfoField label="Nazwisko" value={user?.lastName || "Brak danych"} icon="📝" />
                                <InfoField label="Email" value={user?.login || "Brak danych"} icon="✉️" />
                                <InfoField
                                    label="Rola"
                                    value={user?.role === 'business_owner' ? 'Przedsiębiorca' : user?.role || "Użytkownik"}
                                    icon="🎭"
                                />
                            </div>
                        </div>
                    </div>
                )}

                {/* Businesses Tab */}
                {activeTab === 'businesses' && (
                    <div className="max-w-4xl mx-auto">
                        <div className="flex justify-between items-center mb-8">
                            <h2 className="text-2xl lg:text-3xl font-bold text-slate-900">
                                Moje Firmy
                                <span className="ml-3 bg-[#619B8A]/10 text-[#619B8A] text-sm font-bold px-3 py-1.5 rounded-full">
                                    {businesses.length} {getFirmDeclension(businesses.length)}
                                </span>
                            </h2>
                            <button
                                onClick={() => setShowBusinessForm(!showBusinessForm)}
                                className="bg-gradient-to-r from-[#619B8A] to-teal-600 hover:from-[#4E8275] hover:to-teal-700 text-white px-6 py-3 rounded-xl font-bold transition-all duration-300 hover:shadow-lg flex items-center"
                            >
                                <span className="mr-2">+</span> Dodaj Firmę
                            </button>
                        </div>

                        {showBusinessForm && (
                            <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 border border-gray-200">
                                <h3 className="text-2xl font-bold text-slate-900 mb-6">Dodaj Nową Firmę</h3>
                                <form onSubmit={handleAddBusiness} className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <InputField
                                            type="text"
                                            placeholder="Nazwa Firmy *"
                                            value={businessData.bp_name}
                                            onChange={(e) => setBusinessData({...businessData, bp_name: e.target.value})}
                                            icon="🏢"
                                            required
                                        />
                                        <InputField
                                            type="tel"
                                            placeholder="Telefon *"
                                            value={businessData.phone}
                                            onChange={(e) => setBusinessData({...businessData, phone: e.target.value})}
                                            icon="📞"
                                            required
                                        />
                                    </div>
                                    <InputField
                                        type="text"
                                        placeholder="Adres *"
                                        value={businessData.address}
                                        onChange={(e) => setBusinessData({...businessData, address: e.target.value})}
                                        icon="📍"
                                        required
                                    />
                                    <div>
                                        <label className="block text-gray-700 text-sm font-bold mb-2">
                                            <span className="mr-2">📝</span> Opis (opcjonalnie)
                                        </label>
                                        <textarea
                                            placeholder="Opis firmy..."
                                            value={businessData.description}
                                            onChange={(e) => setBusinessData({...businessData, description: e.target.value})}
                                            className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-[#619B8A] focus:outline-none focus:ring-2 focus:ring-[#619B8A]/30 text-lg min-h-[120px]"
                                        />
                                    </div>
                                    <div className="flex gap-4">
                                        <button
                                            type="submit"
                                            className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-8 py-3 rounded-xl font-bold transition-all duration-300 hover:shadow-lg flex-1"
                                        >
                                            Dodaj Firmę
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setShowBusinessForm(false)}
                                            className="bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white px-8 py-3 rounded-xl font-bold transition-all duration-300 hover:shadow-lg flex-1"
                                        >
                                            Anuluj
                                        </button>
                                    </div>
                                </form>
                            </div>
                        )}

                        {businesses.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {businesses.map(business => (
                                    <div key={business.bp_id} className="flex flex-col h-full bg-white rounded-2xl shadow-lg p-6 border border-gray-200 hover:shadow-xl transition-shadow duration-300">
                                        <div className="flex justify-between items-start mb-4">
                                            <h3 className="text-xl font-bold text-slate-900">{business.bp_name}</h3>
                                        </div>
                                        <p className="text-gray-600 mb-4">{business.description || "Brak opisu"}</p>
                                        <div className="space-y-2 mb-6">
                                            <div className="flex items-center text-gray-500">
                                                <span className="mr-2">📍</span>
                                                <span className="text-sm">{business.address}</span>
                                            </div>
                                            <div className="flex items-center text-gray-500">
                                                <span className="mr-2">📞</span>
                                                <span className="text-sm">{business.phone}</span>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => handleDeleteBusiness(business.bp_id)}
                                            className="mt-auto w-full bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white py-3 rounded-xl font-bold transition-all duration-300 hover:shadow-lg"
                                        >
                                            Usuń Firmę
                                        </button>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="bg-white rounded-2xl shadow-lg p-12 text-center border border-gray-100">
                                <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full mb-6">
                                    <span className="text-5xl">🏢</span>
                                </div>
                                <h3 className="text-2xl font-bold text-slate-800 mb-3">Brak dodanych firm</h3>
                                <p className="text-gray-600 max-w-md mx-auto text-lg mb-8">
                                    Dodaj pierwszą firmę, aby móc publikować ogłoszenia
                                </p>
                                <button
                                    onClick={() => setShowBusinessForm(true)}
                                    className="bg-gradient-to-r from-[#619B8A] to-teal-600 hover:from-[#4E8275] hover:to-teal-700 text-white px-8 py-3 rounded-xl font-bold transition-all duration-300 hover:shadow-lg"
                                >
                                    + Dodaj Pierwszą Firmę
                                </button>
                            </div>
                        )}
                    </div>
                )}

                {/* Ads Tab */}
                {activeTab === 'ads' && (
                    <div className="max-w-4xl mx-auto">
                        <div className="flex justify-between items-center mb-8">
                            <h2 className="text-2xl lg:text-3xl font-bold text-slate-900">
                                Moje Ogłoszenia
                                <span className="ml-3 bg-[#FE7F2D]/10 text-[#FE7F2D] text-sm font-bold px-3 py-1.5 rounded-full">
                                    {ads.length} {getAdsDeclension(ads.length)}
                                </span>
                            </h2>
                            <button
                                onClick={() => setShowAdForm(!showAdForm)}
                                className="bg-gradient-to-r from-[#FE7F2D] to-orange-500 hover:from-[#E76F1F] hover:to-orange-600 text-white px-6 py-3 rounded-xl font-bold transition-all duration-300 hover:shadow-lg flex items-center"
                            >
                                <span className="mr-2">+</span> Dodaj Ogłoszenie
                            </button>
                        </div>

                        {showAdForm && (
                            <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 border border-gray-200">
                                <h3 className="text-2xl font-bold text-slate-900 mb-6">Dodaj Nowe Ogłoszenie</h3>
                                <form onSubmit={handleAddAd} className="space-y-6">
                                    <InputField
                                        type="text"
                                        placeholder="Tytuł Ogłoszenia *"
                                        value={adData.ad_title}
                                        onChange={(e) => setAdData({...adData, ad_title: e.target.value})}
                                        icon="📝"
                                        required
                                    />

                                    <div>
                                        <label className="block text-gray-700 text-sm font-bold mb-2">
                                            <span className="mr-2">📄</span> Opis Ogłoszenia (opcjonalnie)
                                        </label>
                                        <textarea
                                            placeholder="Opisz swoje ogłoszenie..."
                                            value={adData.description}
                                            onChange={(e) => setAdData({...adData, description: e.target.value})}
                                            className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-[#FE7F2D] focus:outline-none focus:ring-2 focus:ring-[#FE7F2D]/30 text-lg min-h-[120px]"
                                        />
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-gray-700 text-sm font-bold mb-2">
                                                <span className="mr-2">🏢</span> Wybierz Firmę *
                                            </label>
                                            <select
                                                value={adData.bp_id}
                                                onChange={(e) => setAdData({...adData, bp_id: e.target.value})}
                                                className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-[#FE7F2D] focus:outline-none focus:ring-2 focus:ring-[#FE7F2D]/30 text-lg appearance-none bg-white"
                                                required
                                            >
                                                <option value="">-- Wybierz Firmę --</option>
                                                {businesses.map(b => (
                                                    <option key={b.bp_id} value={b.bp_id}>{b.bp_name}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-gray-700 text-sm font-bold mb-2">
                                                <span className="mr-2">📂</span> Wybierz Kategorię *
                                            </label>
                                            <select
                                                value={adData.category_id}
                                                onChange={(e) => setAdData({...adData, category_id: e.target.value})}
                                                className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-[#FE7F2D] focus:outline-none focus:ring-2 focus:ring-[#FE7F2D]/30 text-lg appearance-none bg-white"
                                                required
                                            >
                                                <option value="">-- Wybierz Kategorię --</option>
                                                {categories.map(c => (
                                                    <option key={c.category_id} value={c.category_id}>{c.category_name}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <InputField
                                            type="number"
                                            placeholder="Cena (zł) *"
                                            value={adData.price}
                                            onChange={(e) => setAdData({...adData, price: e.target.value})}
                                            icon="💰"
                                            min="0"
                                            required
                                        />
                                        <InputField
                                            type="text"
                                            placeholder="Adres *"
                                            value={adData.address}
                                            onChange={(e) => setAdData({...adData, address: e.target.value})}
                                            icon="📍"
                                            required
                                        />
                                    </div>

                                    {/* Sekcja obrazków */}
                                    <div className="bg-gray-50 rounded-2xl p-6">
                                        <label className="block text-gray-700 text-lg font-bold mb-4">
                                            <span className="mr-2">🖼️</span> URL obrazków (opcjonalnie)
                                        </label>
                                        {imageUrls.map((url, index) => (
                                            <div key={index} className="flex gap-3 mb-4">
                                                <div className="relative flex-1">
                                                    <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                                                        {index + 1}
                                                    </div>
                                                    <input
                                                        type="url"
                                                        placeholder={`https://example.com/obrazek${index + 1}.jpg`}
                                                        value={url}
                                                        onChange={(e) => updateImageUrl(index, e.target.value)}
                                                        className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#FE7F2D] focus:outline-none focus:ring-2 focus:ring-[#FE7F2D]/30"
                                                    />
                                                </div>
                                                {imageUrls.length > 1 && (
                                                    <button
                                                        type="button"
                                                        onClick={() => removeImageField(index)}
                                                        className="bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white px-4 py-3 rounded-xl font-bold transition-all duration-300 hover:shadow-lg"
                                                    >
                                                        Usuń
                                                    </button>
                                                )}
                                            </div>
                                        ))}
                                        <button
                                            type="button"
                                            onClick={addImageField}
                                            className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white px-6 py-3 rounded-xl font-bold transition-all duration-300 hover:shadow-lg"
                                        >
                                            + Dodaj kolejny obrazek
                                        </button>
                                        <p className="text-xs text-gray-500 mt-3">
                                            Wklej URL obrazka (np. https://example.com/obrazek.jpg)
                                        </p>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-gray-700 text-sm font-bold mb-2">
                                                <span className="mr-2">📅</span> Data wystawienia
                                            </label>
                                            <input
                                                type="date"
                                                value={adData.post_date}
                                                onChange={(e) => setAdData({...adData, post_date: e.target.value})}
                                                className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-[#FE7F2D] focus:outline-none focus:ring-2 focus:ring-[#FE7F2D]/30 text-lg"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-gray-700 text-sm font-bold mb-2">
                                                <span className="mr-2">⏰</span> Termin ważności *
                                            </label>
                                            <input
                                                type="date"
                                                value={adData.due_date}
                                                onChange={(e) => setAdData({...adData, due_date: e.target.value})}
                                                className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-[#FE7F2D] focus:outline-none focus:ring-2 focus:ring-[#FE7F2D]/30 text-lg"
                                                required
                                                min={adData.post_date}
                                            />
                                        </div>
                                    </div>

                                    <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded-lg">
                                        <div className="flex">
                                            <div className="flex-shrink-0">
                                                <span className="text-yellow-500">ℹ️</span>
                                            </div>
                                            <div className="ml-3">
                                                <p className="text-sm text-yellow-700">
                                                    * Pola wymagane. Ogłoszenie będzie widoczne po zatwierdzeniu przez administratora.
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex gap-4">
                                        <button
                                            type="submit"
                                            className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-8 py-3 rounded-xl font-bold transition-all duration-300 hover:shadow-lg flex-1"
                                        >
                                            Dodaj Ogłoszenie
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setShowAdForm(false)}
                                            className="bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white px-8 py-3 rounded-xl font-bold transition-all duration-300 hover:shadow-lg flex-1"
                                        >
                                            Anuluj
                                        </button>
                                    </div>
                                </form>
                            </div>
                        )}

                        {ads.length > 0 ? (
                            <div className="grid grid-cols-1 gap-6">
                                {ads.map(ad => (
                                    <div key={ad.ad_id} className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200 hover:shadow-xl transition-shadow duration-300">
                                        <div className="flex justify-between items-start mb-4">
                                            <div>
                                                <h3 className="text-xl font-bold text-slate-900">{ad.ad_title}</h3>
                                                <div className="flex items-center mt-2">
                                                    <span className={`text-xs font-bold px-3 py-1 rounded-full ${ad.status ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                                        {ad.status ? '✅ Aktywne' : '⏳ Oczekuje na zatwierdzenie'}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 text-center min-w-[140px]">
                                                <span className="text-xs text-gray-400 uppercase font-semibold block mb-1">Cena</span>
                                                <span className="text-2xl font-black text-slate-900">{ad.price || '0 zł'}</span>
                                            </div>
                                        </div>
                                        <p className="text-gray-600 mb-6 line-clamp-2">{ad.description || "Brak opisu"}</p>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                                            <div className="flex items-center text-gray-500">
                                                <span className="mr-2">📍</span>
                                                <span className="text-sm">{ad.address}</span>
                                            </div>
                                            <div className="flex items-center text-gray-500">
                                                <span className="mr-2">📅</span>
                                                <span className="text-sm">Termin: {ad.due_date}</span>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => handleDeleteAd(ad.ad_id)}
                                            className="w-full bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white py-3 rounded-xl font-bold transition-all duration-300 hover:shadow-lg"
                                        >
                                            Usuń Ogłoszenie
                                        </button>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="bg-white rounded-2xl shadow-lg p-12 text-center border border-gray-100">
                                <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full mb-6">
                                    <span className="text-5xl">📢</span>
                                </div>
                                <h3 className="text-2xl font-bold text-slate-800 mb-3">Brak dodanych ogłoszeń</h3>
                                <p className="text-gray-600 max-w-md mx-auto text-lg mb-8">
                                    Dodaj pierwsze ogłoszenie, aby dotrzeć do klientów
                                </p>
                                <button
                                    onClick={() => setShowAdForm(true)}
                                    className="bg-gradient-to-r from-[#FE7F2D] to-orange-500 hover:from-[#E76F1F] hover:to-orange-600 text-white px-8 py-3 rounded-xl font-bold transition-all duration-300 hover:shadow-lg"
                                >
                                    + Dodaj Pierwsze Ogłoszenie
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

// Komponenty pomocnicze
const InfoField = ({ label, value, icon }) => (
    <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
        <div className="flex items-center mb-2">
            <span className="mr-3 text-2xl">{icon}</span>
            <span className="text-sm font-bold text-gray-500 uppercase tracking-wider">{label}</span>
        </div>
        <p className="text-lg font-semibold text-slate-800">{value}</p>
    </div>
);

const InputField = ({ type, placeholder, value, onChange, icon, required, min }) => (
    <div>
        <label className="block text-gray-700 text-sm font-bold mb-2">
            <span className="mr-2">{icon}</span> {placeholder.replace(' *', '')}
            {required && <span className="text-red-500 ml-1">*</span>}
        </label>
        <div className="relative">
            {icon && (
                <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                    {icon}
                </div>
            )}
            <input
                type={type}
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                className={`w-full p-4 border-2 border-gray-200 rounded-xl focus:border-[#FE7F2D] focus:outline-none focus:ring-2 focus:ring-[#FE7F2D]/30 text-lg ${icon ? 'pl-12' : ''}`}
                required={required}
                min={min}
            />
        </div>
    </div>
);

export default ProfilePage;