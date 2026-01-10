import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { userService } from '../services/userService';

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
            const userData = await userService.getAll();
            setUsers(userData);
        } catch (error) {
            console.error('Błąd pobierania użytkowników: ', error);
        } finally {
            setLoading(false);
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
            </div>
        </div>
    );
};

export default AdminPage;