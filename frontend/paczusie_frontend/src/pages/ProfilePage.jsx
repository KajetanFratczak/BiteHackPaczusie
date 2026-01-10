import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';
import { companyService } from '../services/companyService';
import { adService } from '../services/adService';
import { categoryService } from '../services/categoryService';

const ProfilePage = () => {
    const { user } = useAuth();
    const [businesses, setBusinesses] = useState([]);
    const [ads, setAds] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('profile');
    const [showBusinessForm, setShowBusinessForm] = useState(false);
    const [showAdForm, setShowAdForm] = useState(false);

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
        status: true
    });

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setLoading(true);
        try {
            const [businessesData, categoriesData] = await Promise.all([
                companyService.getAll(),
                categoryService.getAll()
            ]);
            setBusinesses(businessesData);
            setCategories(categoriesData);
        } catch (error) {
            console.error('Błąd pobierania danych: ', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddBusiness = async (e) => {
        e.preventDefault();
        try {
            await companyService.create({
                ...businessData,
                user_id: user.id
            });
            setBusinessData({ bp_name: '', description: '', address: '', phone: '' });
            setShowBusinessForm(false);
            loadData();
        } catch (error) {
            console.error('Błąd dodawania firmy: ', error);
        }
    };

    const handleAddAd = async (e) => {
        e.preventDefault();
        try {
            await adService.create(adData);
            setAdData({
                ad_title: '',
                description: '',
                bp_id: '',
                category_id: '',
                price: '',
                address: '',
                post_date: new Date().toISOString().split('T')[0],
                due_date: '',
                status: true
            });
            setShowAdForm(false);
            loadData();
        } catch (error) {
            console.error('Błąd dodawania ogłoszenia: ', error);
        }
    };

    const handleDeleteBusiness = async (businessId) => {
        if (window.confirm('Czy na pewno chcesz usunąć tę firmę?')) {
            try {
                await companyService.delete(businessId);
                loadData();
            } catch (error) {
                console.error('Błąd usuwania firmy: ', error);
            }
        }
    };

    const handleDeleteAd = async (adId) => {
        if (window.confirm('Czy na pewno chcesz usunąć to ogłoszenie?')) {
            try {
                await adService.delete(adId);
                loadData();
            } catch (error) {
                console.error('Błąd usuwania ogłoszenia: ', error);
            }
        }
    };

    if (loading) {
        return <div className="text-center mt-10">Ładowanie...</div>;
    }

    return (
        <div>
            <Navbar />
            <div className="bg-[#F5FBE6] min-h-screen p-6">
                <div className="max-w-4xl mx-auto">
                    <h1 className="text-3xl font-bold text-[#233D4D] mb-6">Mój Profil</h1>

                    {/* Tabs */}
                    <div className="flex gap-2 mb-6">
                        <button
                            onClick={() => setActiveTab('profile')}
                            className={`px-4 py-2 rounded font-bold transition ${
                                activeTab === 'profile'
                                    ? 'bg-[#619B8A] text-white'
                                    : 'bg-white text-[#233D4D] border border-[#619B8A]'
                            }`}
                        >
                            Profil
                        </button>
                        <button
                            onClick={() => setActiveTab('businesses')}
                            className={`px-4 py-2 rounded font-bold transition ${
                                activeTab === 'businesses'
                                    ? 'bg-[#619B8A] text-white'
                                    : 'bg-white text-[#233D4D] border border-[#619B8A]'
                            }`}
                        >
                            Moje Firmy
                        </button>
                        <button
                            onClick={() => setActiveTab('ads')}
                            className={`px-4 py-2 rounded font-bold transition ${
                                activeTab === 'ads'
                                    ? 'bg-[#619B8A] text-white'
                                    : 'bg-white text-[#233D4D] border border-[#619B8A]'
                            }`}
                        >
                            Moje Ogłoszenia
                        </button>
                    </div>

                    {/* Profile Tab */}
                    {activeTab === 'profile' && (
                        <div className="bg-white rounded shadow p-6">
                            <h2 className="text-2xl font-bold mb-4 text-[#233D4D]">Informacje o Profilu</h2>
                            <div className="space-y-4">
                                <div>
                                    <label className="font-bold text-gray-700">Imię:</label>
                                    <p className="text-gray-600">{user?.firstName}</p>
                                </div>
                                <div>
                                    <label className="font-bold text-gray-700">Nazwisko:</label>
                                    <p className="text-gray-600">{user?.lastName}</p>
                                </div>
                                <div>
                                    <label className="font-bold text-gray-700">Email:</label>
                                    <p className="text-gray-600">{user?.login}</p>
                                </div>
                                <div>
                                    <label className="font-bold text-gray-700">Rola:</label>
                                    <p className="text-gray-600">{user?.role === 'business_owner' ? 'Przedsiębiorca' : user?.role}</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Businesses Tab */}
                    {activeTab === 'businesses' && (
                        <div>
                            <button
                                onClick={() => setShowBusinessForm(!showBusinessForm)}
                                className="mb-4 px-4 py-2 bg-[#619B8A] text-white rounded hover:bg-[#4E8275] font-bold"
                            >
                                + Dodaj Firmę
                            </button>

                            {showBusinessForm && (
                                <div className="bg-white rounded shadow p-6 mb-6">
                                    <h3 className="text-xl font-bold mb-4 text-[#233D4D]">Dodaj Nową Firmę</h3>
                                    <form onSubmit={handleAddBusiness} className="space-y-4">
                                        <input
                                            type="text"
                                            placeholder="Nazwa Firmy"
                                            value={businessData.bp_name}
                                            onChange={(e) => setBusinessData({...businessData, bp_name: e.target.value})}
                                            className="w-full p-2 border border-gray-300 rounded"
                                            required
                                        />
                                        <textarea
                                            placeholder="Opis"
                                            value={businessData.description}
                                            onChange={(e) => setBusinessData({...businessData, description: e.target.value})}
                                            className="w-full p-2 border border-gray-300 rounded"
                                        />
                                        <input
                                            type="text"
                                            placeholder="Adres"
                                            value={businessData.address}
                                            onChange={(e) => setBusinessData({...businessData, address: e.target.value})}
                                            className="w-full p-2 border border-gray-300 rounded"
                                            required
                                        />
                                        <input
                                            type="tel"
                                            placeholder="Telefon"
                                            value={businessData.phone}
                                            onChange={(e) => setBusinessData({...businessData, phone: e.target.value})}
                                            className="w-full p-2 border border-gray-300 rounded"
                                            required
                                        />
                                        <div className="flex gap-2">
                                            <button
                                                type="submit"
                                                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                                            >
                                                Dodaj
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => setShowBusinessForm(false)}
                                                className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                                            >
                                                Anuluj
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            )}

                            <div className="grid gap-4">
                                {businesses.length > 0 ? (
                                    businesses.map(business => (
                                        <div key={business.pb_id} className="bg-white rounded shadow p-6">
                                            <h3 className="text-xl font-bold text-[#233D4D]">{business.bp_name}</h3>
                                            <p className="text-gray-600">{business.description}</p>
                                            <p className="text-gray-500 text-sm mt-2">📍 {business.address}</p>
                                            <p className="text-gray-500 text-sm">📞 {business.phone}</p>
                                            <button
                                                onClick={() => handleDeleteBusiness(business.pb_id)}
                                                className="mt-4 px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-sm"
                                            >
                                                Usuń
                                            </button>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-gray-500">Nie masz jeszcze żadnych firm. Dodaj pierwszą!</p>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Ads Tab */}
                    {activeTab === 'ads' && (
                        <div>
                            <button
                                onClick={() => setShowAdForm(!showAdForm)}
                                className="mb-4 px-4 py-2 bg-[#619B8A] text-white rounded hover:bg-[#4E8275] font-bold"
                            >
                                + Dodaj Ogłoszenie
                            </button>

                            {showAdForm && (
                                <div className="bg-white rounded shadow p-6 mb-6">
                                    <h3 className="text-xl font-bold mb-4 text-[#233D4D]">Dodaj Nowe Ogłoszenie</h3>
                                    <form onSubmit={handleAddAd} className="space-y-4">
                                        <input
                                            type="text"
                                            placeholder="Tytuł Ogłoszenia"
                                            value={adData.ad_title}
                                            onChange={(e) => setAdData({...adData, ad_title: e.target.value})}
                                            className="w-full p-2 border border-gray-300 rounded"
                                            required
                                        />
                                        <textarea
                                            placeholder="Opis Ogłoszenia"
                                            value={adData.description}
                                            onChange={(e) => setAdData({...adData, description: e.target.value})}
                                            className="w-full p-2 border border-gray-300 rounded"
                                        />
                                        <select
                                            value={adData.bp_id}
                                            onChange={(e) => setAdData({...adData, bp_id: parseInt(e.target.value)})}
                                            className="w-full p-2 border border-gray-300 rounded"
                                            required
                                        >
                                            <option value="">Wybierz Firmę</option>
                                            {businesses.map(b => (
                                                <option key={b.pb_id} value={b.pb_id}>{b.bp_name}</option>
                                            ))}
                                        </select>
                                        <select
                                            value={adData.category_id}
                                            onChange={(e) => setAdData({...adData, category_id: parseInt(e.target.value)})}
                                            className="w-full p-2 border border-gray-300 rounded"
                                            required
                                        >
                                            <option value="">Wybierz Kategorię</option>
                                            {categories.map(c => (
                                                <option key={c.category_id} value={c.category_id}>{c.category_name}</option>
                                            ))}
                                        </select>
                                        <input
                                            type="number"
                                            placeholder="Cena (zł)"
                                            value={adData.price}
                                            onChange={(e) => setAdData({...adData, price: parseInt(e.target.value)})}
                                            className="w-full p-2 border border-gray-300 rounded"
                                            required
                                        />
                                        <input
                                            type="text"
                                            placeholder="Adres"
                                            value={adData.address}
                                            onChange={(e) => setAdData({...adData, address: e.target.value})}
                                            className="w-full p-2 border border-gray-300 rounded"
                                            required
                                        />
                                        <input
                                            type="date"
                                            value={adData.due_date}
                                            onChange={(e) => setAdData({...adData, due_date: e.target.value})}
                                            className="w-full p-2 border border-gray-300 rounded"
                                            required
                                        />
                                        <div className="flex gap-2">
                                            <button
                                                type="submit"
                                                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                                            >
                                                Dodaj
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => setShowAdForm(false)}
                                                className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                                            >
                                                Anuluj
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            )}

                            <div className="grid gap-4">
                                {ads.length > 0 ? (
                                    ads.map(ad => (
                                        <div key={ad.ad_id} className="bg-white rounded shadow p-6">
                                            <h3 className="text-xl font-bold text-[#233D4D]">{ad.ad_title}</h3>
                                            <p className="text-gray-600">{ad.description}</p>
                                            <p className="text-gray-500 text-sm mt-2">📍 {ad.address}</p>
                                            <p className="text-gray-500 text-sm">💰 Cena: {ad.price} zł</p>
                                            <p className="text-gray-500 text-sm mt-2">Termin: {ad.due_date}</p>
                                            <button
                                                onClick={() => handleDeleteAd(ad.ad_id)}
                                                className="mt-4 px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-sm"
                                            >
                                                Usuń
                                            </button>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-gray-500">Nie masz jeszcze żadnych ogłoszeń. Dodaj pierwsze!</p>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
export default ProfilePage;