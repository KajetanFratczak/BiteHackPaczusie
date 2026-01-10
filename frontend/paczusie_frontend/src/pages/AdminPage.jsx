import React, { useState, useEffect } from 'react';
import { userService } from '../services/userService';

const AdminPage = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadUsers();
    }, []);

    // Ładowanie użytkowników
    const loadUsers = async () => {
        try {
            const data = await userService.getUsers();
            setUsers(data);
        } catch (error) {
            console.error('Błąd pobierania użytkowników: ', error);
        } finally {
            setLoading(false);
        }
    };

    // Usuwanie użytkownika
    const handleDelete = async (userId) => {
        if(!window.confirm('Czy na pewno chcesz usunąć tego użytkownika?')) return;
        try {
            await userService.deleteUser(userId);
            loadUsers();
        } catch (error) {
            console.error('Błąd usuwania użytkownika: ', error);
        }
    };

    // Modyfikowanie roli użytkownika
    const handleRoleChange = async (userId, newRole) => {
        try {
            await userService.updateUserRole(userId, newRole);
            loadUsers();
        } catch (error) {
            console.error('Błąd aktualizacji roli użytkownika: ', error);
        }  
    };

    // Ładowanie niezatwierdzonych ogłoszeń


    // Zatwierdzanie ogłoszenia


    if (loading) {
        return <div className="text-gray-500">Ładowanie użytkowników...</div>;
    }

    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">Panel Admina - Zarządzanie Użytkownikami</h2>
            <table className="min-w-full bg-white border border-gray-300">
                <thead>
                    <tr>
                        <th className="py-2 px-4 border-b">ID</th>
                        <th className="py-2 px-4 border-b">Email</th>
                        <th className="py-2 px-4 border-b">Rola</th>
                        <th className="py-2 px-4 border-b">Akcje</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map(user => (
                        <tr key={user.id}>
                            <td className="py-2 px-4 border-b">{user.id}</td>
                            <td className="py-2 px-4 border-b">{user.email}</td>
                            <td className="py-2 px-4 border-b">
                                <select
                                    value={user.role}
                                    onChange={(e) => handleRoleChange(user.id, e.target.value)}
                                    className="border border-gray-300 rounded px-2 py-1"
                                >
                                    <option value="user">Użytkownik</option>
                                    <option value="business_owner">Przedsiębiorca</option>
                                    <option value="admin">Admin</option>
                                </select>
                            </td>
                            <td className="py-2 px-4 border-b">
                                <button
                                    onClick={() => handleDelete(user.id)}
                                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                                >
                                    Usuń
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
       
    );
};

export default AdminPage;