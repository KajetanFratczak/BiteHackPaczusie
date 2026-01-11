import React, { useState, useEffect } from 'react';
import { userService } from '../services/userService';
import { adService } from '../services/adService'; // Nowy service
import Navbar from '../components/Navbar';

const AdminPage = () => {
    const [users, setUsers] = useState([]);
    const [ads, setAds] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('users');

    useEffect(() => {
        loadData();
    }, []);

    // Ładowanie danych
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
        } finally {
            setLoading(false);
        }
    };

    // Ładowanie ogłoszeń
    const loadAds = async () => {
        try {
            const adData = await adService.getAll();
            setAds(adData);
        } catch (error) {
            console.error('Błąd pobierania ogłoszeń: ', error);
        }
    };

    // Usuwanie użytkownika
    const handleDeleteUser = async (userId) => {
        if(!window.confirm('Czy na pewno chcesz usunąć tego użytkownika?')) return;
        try {
            await userService.delete(userId);
            loadData();
        } catch (error) {
            console.error('Błąd usuwania użytkownika: ', error);
        }
    };

    // Modyfikowanie roli użytkownika
    const handleRoleChange = async (userId, newRole) => {
        try {
            const user = users.find(u => u.user_id === userId);
            if (user) {
                await userService.update(userId, { role: newRole });
                loadData();
            }
        } catch (error) {
            console.error('Błąd aktualizacji roli użytkownika: ', error);
        }
    };

    // Zatwierdzanie ogłoszenia
    const handleApproveAd = async (adId) => {
    if(!window.confirm('Czy na pewno chcesz zatwierdzić to ogłoszenie?')) return;
    try {
        await adService.approveAd(adId);
        loadAds(); // Odśwież listę
    } catch (error) {
        console.error('Błąd zatwierdzania ogłoszenia: ', error);
    }
};

    // Usuwanie ogłoszenia
    const handleDeleteAd = async (adId) => {
        if(!window.confirm('Czy na pewno chcesz usunąć to ogłoszenie?')) return;
        try {
            await adService.delete(adId);
            loadAds();
        } catch (error) {
            console.error('Błąd usuwania ogłoszenia: ', error);
        }
    };

    // Filtrowanie niezatwierdzonych ogłoszeń
    const getPendingAds = () => {
        return ads.filter(ad => !ad.status);
    };

    if (loading) {
        return <div className="text-gray-500 text-center mt-10">Ładowanie...</div>;
    }

    return (
        <div>
            <Navbar />
            <div className="p-6 bg-[#F5FBE6] min-h-screen">
                <h2 className="text-2xl font-bold mb-4 text-[#233D4D]">Panel Admina</h2>

                <div className="mb-4 flex gap-2">
                    <button
                        onClick={() => setActiveTab('users')}
                        className={`px-4 py-2 rounded ${activeTab === 'users' ? 'bg-[#619B8A] text-white' : 'bg-gray-200'}`}
                    >
                        Zarządzanie Użytkownikami
                    </button>
                    <button
                        onClick={() => setActiveTab('ads')}
                        className={`px-4 py-2 rounded ${activeTab === 'ads' ? 'bg-[#619B8A] text-white' : 'bg-gray-200'}`}
                    >
                        Zarządzanie Ogłoszeniami
                    </button>
                </div>

                {activeTab === 'users' && (
                    <div className="bg-white rounded shadow overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-200">
                                <tr>
                                    <th className="py-3 px-4 text-left">ID</th>
                                    <th className="py-3 px-4 text-left">Imię</th>
                                    <th className="py-3 px-4 text-left">Nazwisko</th>
                                    <th className="py-3 px-4 text-left">Email</th>
                                    <th className="py-3 px-4 text-left">Rola</th>
                                    <th className="py-3 px-4 text-left">Akcje</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map(user => (
                                    <tr key={user.user_id} className="border-b hover:bg-gray-50">
                                        <td className="py-3 px-4">{user.user_id}</td>
                                        <td className="py-3 px-4">{user.first_name}</td>
                                        <td className="py-3 px-4">{user.last_name}</td>
                                        <td className="py-3 px-4">{user.email}</td>
                                        <td className="py-3 px-4">
                                            <select
                                                value={user.role}
                                                onChange={(e) => handleRoleChange(user.user_id, e.target.value)}
                                                className="border border-gray-300 rounded px-2 py-1"
                                            >
                                                <option value="user">Użytkownik</option>
                                                <option value="business_owner">Przedsiębiorca</option>
                                                <option value="admin">Admin</option>
                                            </select>
                                        </td>
                                        <td className="py-3 px-4">
                                            <button
                                                onClick={() => handleDeleteUser(user.user_id)}
                                                className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 text-sm"
                                            >
                                                Usuń
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {activeTab === 'ads' && (
                    <div className="bg-white rounded shadow overflow-x-auto">
                        <div className="p-4 border-b">
                            <h3 className="text-lg font-semibold text-[#233D4D]">
                                Ogłoszenia oczekujące na zatwierdzenie: {getPendingAds().length}
                            </h3>
                        </div>
                        <table className="w-full">
                            <thead className="bg-gray-200">
                                <tr>
                                    <th className="py-3 px-4 text-left">ID</th>
                                    <th className="py-3 px-4 text-left">Tytuł</th>
                                    <th className="py-3 px-4 text-left">Opis</th>
                                    <th className="py-3 px-4 text-left">Cena</th>
                                    <th className="py-3 px-4 text-left">Adres</th>
                                    <th className="py-3 px-4 text-left">Data wystawienia</th>
                                    <th className="py-3 px-4 text-left">Status</th>
                                    <th className="py-3 px-4 text-left">Akcje</th>
                                </tr>
                            </thead>
                            <tbody>
                                {ads.map(ad => (
                                    <tr key={ad.ad_id} className="border-b hover:bg-gray-50">
                                        <td className="py-3 px-4">{ad.ad_id}</td>
                                        <td className="py-3 px-4 font-medium">{ad.ad_title}</td>
                                        <td className="py-3 px-4 max-w-xs truncate">{ad.description}</td>
                                        <td className="py-3 px-4">{parseFloat(ad.price).toFixed(2)} zł</td>
                                        <td className="py-3 px-4">{ad.address}</td>
                                        <td className="py-3 px-4">{new Date(ad.post_date).toLocaleDateString()}</td>
                                        <td className="py-3 px-4">
                                            <span className={`px-2 py-1 rounded text-sm ${ad.status ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                                {ad.status ? 'Zatwierdzone' : 'Oczekujące'}
                                            </span>
                                        </td>
                                        <td className="py-3 px-4">
                                            <div className="flex gap-2">
                                                {!ad.status && (
                                                    <button
                                                        onClick={() => handleApproveAd(ad.ad_id)}
                                                        className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 text-sm"
                                                    >
                                                        Zatwierdź
                                                    </button>
                                                )}
                                                <button
                                                    onClick={() => handleDeleteAd(ad.ad_id)}
                                                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 text-sm"
                                                >
                                                    Usuń
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {ads.length === 0 && (
                            <div className="text-center py-8 text-gray-500">
                                Brak ogłoszeń do wyświetlenia
                            </div>
                        )}
                    </div>
                )}
            </div>
       </div>
    );
};

export default AdminPage;