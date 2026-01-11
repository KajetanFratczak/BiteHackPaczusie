import React, { useState } from 'react';
import { useNavigate, Link } from "react-router";
import { useAuth } from "../context/AuthContext.jsx";
import Navbar from '../components/Navbar';

const LoginPage = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const navigate = useNavigate();
    const { login } = useAuth();

    const validateEmail = (email) => {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    const validateForm = () => {
        if (!email || !password) {
           setError("Wszystkie pola są wymagane.");
           return false;
        }
        if (!validateEmail(email)) {
           setError("Wprowadź poprawny adres e-mail.");
           return false;
        }
        return true;
    };

    const handleLogin = async () => {
        setError("");
        if(!validateForm()) return;
        try{
            const result = await login(email, password);
            if (result.success) {
                navigate("/");
            } else {
                setError(result.msg || "Błąd logowania.");
           }
        } catch(err) {
            setError("Błąd połączenia z serwerem.");
        }
    }

    return (
        <div className='min-h-screen bg-gradient-to-b from-[#F5FBE6] to-gray-50'>
            <Navbar/>
            <div className="flex justify-center items-center p-4 pt-16">
                <div className="bg-white rounded-2xl shadow-2xl overflow-hidden w-full max-w-md border border-gray-200">
                    {/* Nagłówek formularza */}
                    <div className="bg-gradient-to-r from-[#233D4D] to-slate-800 p-8 text-center">
                        <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4">
                            <span className="text-2xl text-[#FE7F2D]">🔐</span>
                        </div>
                        <h2 className="text-2xl font-bold text-white">
                            Witaj z powrotem!
                        </h2>
                        <p className="text-gray-300 mt-2">Zaloguj się do swojego konta</p>
                    </div>

                    {/* Formularz */}
                    <div className="p-8">
                        {error && (
                            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-600">
                                <div className="flex items-center gap-2">
                                    <span>⚠️</span>
                                    <span>{error}</span>
                                </div>
                            </div>
                        )}

                        <div className="space-y-6">
                            <div>
                                <label className="block text-gray-700 text-sm font-bold mb-2">
                                    Adres Email
                                </label>
                                <div className="relative">
                                    <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                                        ✉️
                                    </div>
                                    <input
                                        type="email"
                                        placeholder="wprowadź@email.pl"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#FE7F2D] focus:outline-none focus:ring-2 focus:ring-[#FE7F2D]/30"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-gray-700 text-sm font-bold mb-2">
                                    Hasło
                                </label>
                                <div className="relative">
                                    <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                                        🔒
                                    </div>
                                    <input
                                        type="password"
                                        placeholder="Wprowadź hasło"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#FE7F2D] focus:outline-none focus:ring-2 focus:ring-[#FE7F2D]/30"
                                    />
                                </div>
                            </div>

                            <button
                                className="w-full bg-gradient-to-r from-[#FE7F2D] to-orange-500 hover:from-[#E76F1F] hover:to-orange-600 text-white py-3.5 rounded-xl font-bold transition-all duration-300 hover:shadow-lg transform hover:-translate-y-0.5"
                                onClick={handleLogin}
                            >
                                Zaloguj się
                            </button>
                        </div>

                        {/* Linki dodatkowe */}
                        <div className="mt-8 pt-6 border-t border-gray-200 text-center space-y-4">
                            <p className="text-gray-600">
                                Nie masz jeszcze konta?
                            </p>
                            <button
                                className="w-full bg-transparent border-2 border-[#619B8A] text-[#619B8A] hover:bg-[#619B8A] hover:text-white py-3 rounded-xl font-bold transition-colors"
                                onClick={() => navigate("/register")}
                            >
                                Załóż nowe konto
                            </button>

                            <Link to="/" className="block">
                                <button className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 rounded-xl font-medium transition-colors mt-2">
                                    ← Wróć do strony głównej
                                </button>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;