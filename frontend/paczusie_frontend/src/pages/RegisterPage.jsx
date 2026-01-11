import React from 'react';
import Navbar from '../components/Navbar';
import { useState } from 'react';
import { useNavigate , Link} from 'react-router';
import { useAuth } from '../context/AuthContext.jsx';


const RegisterPage = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [password2, setPassword2] = useState("");
    const [error, setError] = useState("");
    const [name, setName] = useState("");
    const [surname, setSurname] = useState("");
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();
    const { register } = useAuth();

    const validateEmail = (email) => {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    const validateForm = () => {
        if (!email || !password || !name || !surname) {
            setError("Wszystkie pola są wymagane.");
            return false;
        }
        if (!validateEmail(email)) {
            setError("Wprowadź poprawny adres e-mail.");
            return false;
        }
        if (password !== password2) {
            setError("Hasła się nie zgadzają.");
            return false;
        }
        if (password.length < 6) {
            setError("Hasło musi mieć co najmniej 6 znaków.");
            return false;
        }
        return true;
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        setError("");

        if (!validateForm()) return;

        setLoading(true);
        try{
            const result = await register(name, surname, email, password);
            if (result.success) {
                alert("Rejestracja zakończona sukcesem! Możesz się teraz zalogować.");
                navigate("/login");
            } else {
                setError(result.msg || "Błąd rejestracji.");
            }
        } catch (error) {
            setError("Wystąpił błąd podczas rejestracji. Spróbuj ponownie.");
            console.error("Registration error:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-[#F5FBE6] to-gray-50">
            <Navbar />

            <div className="flex justify-center items-center min-h-[calc(100vh-80px)] p-4">
                <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md border border-gray-200 overflow-hidden">
                    <div className="p-8">
                        <div className="text-center mb-8">
                            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-[#619B8A] to-teal-600 rounded-full mb-4">
                                <span className="text-2xl text-white">👤</span>
                            </div>
                            <h2 className="text-3xl font-bold text-slate-900 mb-2">
                                Rejestracja
                            </h2>
                            <p className="text-gray-600">
                                Dołącz do naszej społeczności
                            </p>
                        </div>

                        {error && (
                            <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg mb-6">
                                <div className="flex">
                                    <div className="flex-shrink-0">
                                        <span className="text-red-500">⚠️</span>
                                    </div>
                                    <div className="ml-3">
                                        <p className="text-sm text-red-700">{error}</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        <form onSubmit={handleRegister} className="space-y-6">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="relative">
                                    <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                                        👤
                                    </div>
                                    <input
                                        type="text"
                                        placeholder="Imię"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#619B8A] focus:outline-none focus:ring-2 focus:ring-[#619B8A]/30"
                                        required
                                    />
                                </div>
                                <div className="relative">
                                    <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                                        📝
                                    </div>
                                    <input
                                        type="text"
                                        placeholder="Nazwisko"
                                        value={surname}
                                        onChange={(e) => setSurname(e.target.value)}
                                        className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#619B8A] focus:outline-none focus:ring-2 focus:ring-[#619B8A]/30"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="relative">
                                <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                                    ✉️
                                </div>
                                <input
                                    type="email"
                                    placeholder="Adres Email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#619B8A] focus:outline-none focus:ring-2 focus:ring-[#619B8A]/30"
                                    required
                                />
                            </div>

                            <div className="relative">
                                <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                                    🔒
                                </div>
                                <input
                                    type="password"
                                    placeholder="Hasło"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#619B8A] focus:outline-none focus:ring-2 focus:ring-[#619B8A]/30"
                                    required
                                />
                            </div>

                            <div className="relative">
                                <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                                    🔑
                                </div>
                                <input
                                    type="password"
                                    placeholder="Powtórz hasło"
                                    value={password2}
                                    onChange={(e) => setPassword2(e.target.value)}
                                    className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#619B8A] focus:outline-none focus:ring-2 focus:ring-[#619B8A]/30"
                                    required
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className={`w-full py-4 px-4 rounded-xl font-bold transition-all duration-300 ${loading 
                                    ? 'bg-gray-400 cursor-not-allowed' 
                                    : 'bg-gradient-to-r from-[#619B8A] to-teal-600 hover:from-[#4E8275] hover:to-teal-700 hover:shadow-lg'
                                } text-white`}
                            >
                                {loading ? (
                                    <span className="flex items-center justify-center">
                                        <svg className="animate-spin h-5 w-5 mr-3 text-white" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                        </svg>
                                        Rejestracja...
                                    </span>
                                ) : (
                                    'Zarejestruj się'
                                )}
                            </button>
                        </form>

                        <div className="mt-8 pt-6 border-t border-gray-200">
                            <Link to="/login">
                                <button className="w-full py-3 px-4 rounded-xl text-[#619B8A] bg-transparent hover:bg-[#F8F9FA] font-bold transition-colors border border-[#619B8A] mb-4">
                                    Masz już konto? Zaloguj się
                                </button>
                            </Link>
                            <Link to="/">
                                <button className="w-full py-3 px-4 rounded-xl text-gray-600 bg-transparent hover:bg-gray-50 font-bold transition-colors">
                                    ← Powrót do strony głównej
                                </button>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default RegisterPage;