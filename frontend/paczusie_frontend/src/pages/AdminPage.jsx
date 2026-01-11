import React, { useState, useEffect } from 'react';
import { userService } from '../services/userService';
import { adService } from '../services/adService';
import Navbar from '../components/Navbar';

const AdminPage = () => {
    const [users, setUsers] = useState([]);
    const [ads, setAds] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('users');
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [alert, setAlert] = useState({ type: '', message: '' });

    useEffect(() => {
        loadData();
    }, []);

    const showAlert = (type, message) => {
        setAlert({ type, message });
        setTimeout(() => setAlert({ type: '', message: '' }), 5000);
    };

    const loadData = async () => {
        setLoading(true);
        try {
            const [userData, adData] = await Promise.all([
                userService.getAll(),
                adService.getAll()
            ]);
            setUsers(userData);
            setAds(adData);
        } catch (error) {
            console.error('Błąd pobierania danych: ', error);
            showAlert('error', 'Nie udało się załadować danych');
        } finally {
            setLoading(false);
        }
    };

    const loadAds = async () => {
        try {
            const adData = await adService.getAll();
            setAds(adData);
        } catch (error) {
            console.error('Błąd pobierania ogłoszeń: ', error);
            showAlert('error', 'Nie udało się załadować ogłoszeń');
        }
    };

    const handleDeleteUser = async (userId) => {
        try {
            await userService.delete(userId);
            loadData();
            showAlert('success', 'Użytkownik został usunięty');
        } catch (error) {
            console.error('Błąd usuwania użytkownika: ', error);
            showAlert('error', 'Nie udało się usunąć użytkownika');
        }
    };

    const handleRoleChange = async (userId, newRole) => {
        try {
            const user = users.find(u => u.user_id === userId);
            if (user) {
                await userService.update(userId, { role: newRole });
                loadData();
                showAlert('success', `Rola użytkownika zmieniona na ${getRoleName(newRole)}`);
            }
        } catch (error) {
            console.error('Błąd aktualizacji roli użytkownika: ', error);
            showAlert('error', 'Nie udało się zmienić roli użytkownika');
        }
    };

    const handleApproveAd = async (adId) => {
        try {
            await adService.approveAd(adId);
            loadAds();
            showAlert('success', 'Ogłoszenie zostało zatwierdzone');
        } catch (error) {
            console.error('Błąd zatwierdzania ogłoszenia: ', error);
            showAlert('error', 'Nie udało się zatwierdzić ogłoszenia');
        }
    };

    const handleDeleteAd = async (adId) => {
        try {
            await adService.delete(adId);
            loadAds();
            showAlert('success', 'Ogłoszenie zostało usunięte');
        } catch (error) {
            console.error('Błąd usuwania ogłoszenia: ', error);
            showAlert('error', 'Nie udało się usunąć ogłoszenia');
        }
    };

    const getRoleName = (role) => {
        switch(role) {
            case 'user': return 'Użytkownik';
            case 'business_owner': return 'Przedsiębiorca';
            case 'admin': return 'Admin';
            default: return role;
        }
    };

    const getPendingAds = () => {
        return ads.filter(ad => !ad.status);
    };

    const getFilteredAds = () => {
        return ads.filter(ad => {
            const matchesSearch = searchTerm === '' ||
                ad.ad_title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                (ad.description && ad.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
                ad.address.toLowerCase().includes(searchTerm.toLowerCase());

            const matchesStatus = statusFilter === 'all' ||
                (statusFilter === 'pending' && !ad.status) ||
                (statusFilter === 'approved' && ad.status);

            return matchesSearch && matchesStatus;
        });
    };

    const getFilteredUsers = () => {
        return users.filter(user => {
            return searchTerm === '' ||
                user.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                user.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                user.role.toLowerCase().includes(searchTerm.toLowerCase());
        });
    };

    const formatPrice = (price) => {
        const numPrice = parseFloat(price);
        const safePrice = isNaN(numPrice) ? 0 : numPrice;

        return safePrice.toLocaleString('pl-PL', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });
    };

    if (loading) {
        return (
            <div className="bg-gradient-to-b from-[#FDF6E3] to-gray-50 min-h-screen">
                <Navbar />
                <div className="flex flex-col items-center justify-center min-h-[60vh]">
                    <div className="relative">
                        <div className="absolute inset-0 animate-ping rounded-full h-16 w-16 bg-[#FE7F2D]/20"></div>
                        <div className="relative animate-spin rounded-full h-16 w-16 border-t-3 border-b-3 border-[#FE7F2D]"></div>
                    </div>
                    <p className="mt-6 text-gray-600 font-medium text-lg">Ładowanie panelu admina...</p>
                </div>
            </div>
        );
    }

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

            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
                <div className="text-center mb-10">
                    <h1 className="text-4xl lg:text-5xl font-bold text-slate-900 mb-4">
                        Panel <span className="text-[#FE7F2D]">Administratora</span>
                    </h1>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                        Zarządzaj użytkownikami, ogłoszeniami i monitoruj aktywność platformy
                    </p>
                </div>

                {/* Karty statystyk */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-500 font-medium">Wszyscy Użytkownicy</p>
                                <p className="text-3xl font-bold text-slate-900">{users.length}</p>
                            </div>
                            <div className="bg-blue-100 p-3 rounded-xl">
                                <span className="text-2xl text-blue-600">👥</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-500 font-medium">Wszystkie Ogłoszenia</p>
                                <p className="text-3xl font-bold text-slate-900">{ads.length}</p>
                            </div>
                            <div className="bg-green-100 p-3 rounded-xl">
                                <span className="text-2xl text-green-600">📢</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-500 font-medium">Oczekujące Ogłoszenia</p>
                                <p className="text-3xl font-bold text-slate-900">{getPendingAds().length}</p>
                            </div>
                            <div className="bg-yellow-100 p-3 rounded-xl">
                                <span className="text-2xl text-yellow-600">⏳</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-500 font-medium">Administratorzy</p>
                                <p className="text-3xl font-bold text-slate-900">
                                    {users.filter(u => u.role === 'admin').length}
                                </p>
                            </div>
                            <div className="bg-purple-100 p-3 rounded-xl">
                                <span className="text-2xl text-purple-600">🛡️</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Tabs i wyszukiwanie */}
                <div className="bg-white rounded-2xl shadow-xl p-6 mb-8 border border-gray-200">
                    <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6">
                        <div className="flex flex-col sm:flex-row gap-2">
                            <button
                                onClick={() => setActiveTab('users')}
                                className={`px-6 py-3 rounded-xl font-bold transition-all duration-300 ${activeTab === 'users'
                                    ? 'bg-gradient-to-r from-[#619B8A] to-teal-600 text-white shadow-lg'
                                    : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                                }`}
                            >
                                <span className="mr-2">👥</span> Użytkownicy
                            </button>
                            <button
                                onClick={() => setActiveTab('ads')}
                                className={`px-6 py-3 rounded-xl font-bold transition-all duration-300 ${activeTab === 'ads'
                                    ? 'bg-gradient-to-r from-[#619B8A] to-teal-600 text-white shadow-lg'
                                    : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                                }`}
                            >
                                <span className="mr-2">📢</span> Ogłoszenia
                            </button>
                        </div>

                        <div className="relative w-full lg:w-auto lg:min-w-[300px]">
                            <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                                🔍
                            </div>
                            <input
                                type="text"
                                placeholder={`Szukaj ${activeTab === 'users' ? 'użytkowników...' : 'ogłoszeń...'}`}
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#FE7F2D] focus:outline-none focus:ring-2 focus:ring-[#FE7F2D]/30"
                            />
                        </div>
                    </div>

                    {/* Filtry dla ogłoszeń */}
                    {activeTab === 'ads' && (
                        <div className="mb-6">
                            <div className="flex flex-wrap gap-3">
                                <button
                                    onClick={() => setStatusFilter('all')}
                                    className={`px-4 py-2 rounded-lg font-medium ${statusFilter === 'all'
                                        ? 'bg-[#FE7F2D] text-white'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                                >
                                    Wszystkie ({ads.length})
                                </button>
                                <button
                                    onClick={() => setStatusFilter('pending')}
                                    className={`px-4 py-2 rounded-lg font-medium ${statusFilter === 'pending'
                                        ? 'bg-yellow-500 text-white'
                                        : 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
                                    }`}
                                >
                                    ⏳ Oczekujące ({getPendingAds().length})
                                </button>
                                <button
                                    onClick={() => setStatusFilter('approved')}
                                    className={`px-4 py-2 rounded-lg font-medium ${statusFilter === 'approved'
                                        ? 'bg-green-500 text-white'
                                        : 'bg-green-100 text-green-700 hover:bg-green-200'
                                    }`}
                                >
                                    ✅ Zatwierdzone ({ads.filter(ad => ad.status).length})
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {/* Zawartość taba użytkowników */}
                {activeTab === 'users' && (
                    <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
                        <div className="p-6 border-b border-gray-100">
                            <h2 className="text-2xl font-bold text-slate-900">
                                Zarządzanie Użytkownikami
                                <span className="ml-3 bg-blue-100 text-blue-700 text-sm font-bold px-3 py-1.5 rounded-full">
                                    {getFilteredUsers().length} użytkowników
                                </span>
                            </h2>
                        </div>

                        {getFilteredUsers().length > 0 ? (
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="py-4 px-6 text-left text-sm font-semibold text-gray-700">ID</th>
                                            <th className="py-4 px-6 text-left text-sm font-semibold text-gray-700">Imię</th>
                                            <th className="py-4 px-6 text-left text-sm font-semibold text-gray-700">Nazwisko</th>
                                            <th className="py-4 px-6 text-left text-sm font-semibold text-gray-700">Email</th>
                                            <th className="py-4 px-6 text-left text-sm font-semibold text-gray-700">Rola</th>
                                            <th className="py-4 px-6 text-left text-sm font-semibold text-gray-700">Akcje</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {getFilteredUsers().map(user => (
                                            <tr key={user.user_id} className="hover:bg-gray-50 transition-colors">
                                                <td className="py-4 px-6">
                                                    <span className="bg-gray-100 text-gray-700 text-xs font-bold px-3 py-1 rounded-full">
                                                        {user.user_id}
                                                    </span>
                                                </td>
                                                <td className="py-4 px-6 font-medium text-slate-800">{user.first_name}</td>
                                                <td className="py-4 px-6 font-medium text-slate-800">{user.last_name}</td>
                                                <td className="py-4 px-6">
                                                    <div className="flex items-center">
                                                        <span className="mr-2">✉️</span>
                                                        {user.email}
                                                    </div>
                                                </td>
                                                <td className="py-4 px-6">
                                                    <select
                                                        value={user.role}
                                                        onChange={(e) => handleRoleChange(user.user_id, e.target.value)}
                                                        className="border-2 border-gray-200 rounded-lg px-3 py-2 focus:border-[#FE7F2D] focus:outline-none focus:ring-2 focus:ring-[#FE7F2D]/30 bg-white"
                                                    >
                                                        <option value="user">👤 Użytkownik</option>
                                                        <option value="business_owner">🏢 Przedsiębiorca</option>
                                                        <option value="admin">🛡️ Admin</option>
                                                    </select>
                                                </td>
                                                <td className="py-4 px-6">
                                                    <button
                                                        onClick={() => handleDeleteUser(user.user_id)}
                                                        className="bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white px-4 py-2 rounded-lg font-bold transition-all duration-300 hover:shadow-lg text-sm"
                                                    >
                                                        Usuń
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <div className="p-12 text-center">
                                <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full mb-6">
                                    <span className="text-5xl">👥</span>
                                </div>
                                <h3 className="text-2xl font-bold text-slate-800 mb-3">Brak użytkowników</h3>
                                <p className="text-gray-600 max-w-md mx-auto text-lg">
                                    {searchTerm ? 'Nie znaleziono użytkowników pasujących do wyszukiwania.' : 'Brak użytkowników do wyświetlenia.'}
                                </p>
                                {searchTerm && (
                                    <button
                                        onClick={() => setSearchTerm('')}
                                        className="mt-4 bg-gradient-to-r from-[#FE7F2D] to-orange-500 hover:from-[#E76F1F] hover:to-orange-600 text-white px-6 py-3 rounded-xl font-bold transition-all duration-300 hover:shadow-lg"
                                    >
                                        Wyczyść wyszukiwanie
                                    </button>
                                )}
                            </div>
                        )}
                    </div>
                )}

                {/* Zawartość taba ogłoszeń */}
                {activeTab === 'ads' && (
                    <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
                        <div className="p-6 border-b border-gray-100">
                            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                                <h2 className="text-2xl font-bold text-slate-900">
                                    Zarządzanie Ogłoszeniami
                                    <span className="ml-3 bg-[#FE7F2D]/10 text-[#FE7F2D] text-sm font-bold px-3 py-1.5 rounded-full">
                                        {getFilteredAds().length} ogłoszeń
                                    </span>
                                </h2>
                                <div className="text-sm text-gray-600">
                                    ⏳ <span className="font-bold text-yellow-600">{getPendingAds().length}</span> oczekujących |
                                    ✅ <span className="font-bold text-green-600">{ads.filter(ad => ad.status).length}</span> zatwierdzonych
                                </div>
                            </div>
                        </div>

                        {getFilteredAds().length > 0 ? (
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="py-4 px-6 text-left text-sm font-semibold text-gray-700">ID</th>
                                            <th className="py-4 px-6 text-left text-sm font-semibold text-gray-700">Tytuł</th>
                                            <th className="py-4 px-6 text-left text-sm font-semibold text-gray-700">Opis</th>
                                            <th className="py-4 px-6 text-left text-sm font-semibold text-gray-700">Cena</th>
                                            <th className="py-4 px-6 text-left text-sm font-semibold text-gray-700">Adres</th>
                                            <th className="py-4 px-6 text-left text-sm font-semibold text-gray-700">Status</th>
                                            <th className="py-4 px-6 text-left text-sm font-semibold text-gray-700">Akcje</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {getFilteredAds().map(ad => (
                                            <tr key={ad.ad_id} className="hover:bg-gray-50 transition-colors">
                                                <td className="py-4 px-6">
                                                    <span className="bg-gray-100 text-gray-700 text-xs font-bold px-3 py-1 rounded-full">
                                                        {ad.ad_id}
                                                    </span>
                                                </td>
                                                <td className="py-4 px-6 font-medium text-slate-800 max-w-xs truncate">{ad.ad_title}</td>
                                                <td className="py-4 px-6 text-gray-600 max-w-md truncate">{ad.description}</td>


                                                <td className="py-4 px-6">
                                                    <span className="bg-slate-100 text-slate-900 font-bold px-3 py-1.5 rounded-lg">
                                                        {formatPrice(ad.price)} zł
                                                    </span>
                                                </td>
                                                <td className="py-4 px-6">
                                                    <div className="flex items-center">
                                                        <span className="mr-2">📍</span>
                                                        <span className="truncate max-w-xs">{ad.address}</span>
                                                    </div>
                                                </td>
                                                <td className="py-4 px-6">
                                                    <span className={`px-3 py-1.5 rounded-full text-xs font-bold ${ad.status 
                                                        ? 'bg-green-100 text-green-700 border border-green-200' 
                                                        : 'bg-yellow-100 text-yellow-700 border border-yellow-200'
                                                    }`}>
                                                        {ad.status ? '✅ Zatwierdzone' : '⏳ Oczekujące'}
                                                    </span>
                                                </td>
                                                <td className="py-4 px-6">
                                                    <div className="flex gap-2">
                                                        {!ad.status && (
                                                            <button
                                                                onClick={() => handleApproveAd(ad.ad_id)}
                                                                className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-4 py-2 rounded-lg font-bold transition-all duration-300 hover:shadow-lg text-sm"
                                                            >
                                                                Zatwierdź
                                                            </button>
                                                        )}
                                                        <button
                                                            onClick={() => handleDeleteAd(ad.ad_id)}
                                                            className="bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white px-4 py-2 rounded-lg font-bold transition-all duration-300 hover:shadow-lg text-sm"
                                                        >
                                                            Usuń
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <div className="p-12 text-center">
                                <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full mb-6">
                                    <span className="text-5xl">📢</span>
                                </div>
                                <h3 className="text-2xl font-bold text-slate-800 mb-3">Brak ogłoszeń</h3>
                                <p className="text-gray-600 max-w-md mx-auto text-lg">
                                    {searchTerm || statusFilter !== 'all'
                                        ? 'Nie znaleziono ogłoszeń pasujących do filtrów.'
                                        : 'Brak ogłoszeń do wyświetlenia.'}
                                </p>
                                {(searchTerm || statusFilter !== 'all') && (
                                    <button
                                        onClick={() => {setSearchTerm(''); setStatusFilter('all');}}
                                        className="mt-4 bg-gradient-to-r from-[#FE7F2D] to-orange-500 hover:from-[#E76F1F] hover:to-orange-600 text-white px-6 py-3 rounded-xl font-bold transition-all duration-300 hover:shadow-lg"
                                    >
                                        Wyczyść filtry
                                    </button>
                                )}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminPage;