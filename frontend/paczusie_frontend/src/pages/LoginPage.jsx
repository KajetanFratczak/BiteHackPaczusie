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
        <div className='max-h-screen'>
            <Navbar/>
            <div className="bg-[#1e1e1e] min-h-screen flex justify-center items-center p-4 mt-[-64px]">
                <div className="bg-[#2a2a2a] p-8 rounded shadow-md w-full max-w-md text-white">
                    <h2 className="text-2xl mb-6 font-bold">
                        Logowanie
                    </h2>
                    {error && (<div className="bg-red-600 text-white p-2 rounded mb-4">{error}</div>)}
                    <input
                        type="email"
                        placeholder="Adres Email"
                        fullWidth
                        label="Adres Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full mb-4 p-2 rounded bg-[#3a3a3a] border border-[#555] text-white"
                    />
                    <input
                        type="password"
                        placeholder="Hasło"                                                                  
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full mb-4 p-2 rounded bg-[#3a3a3a] border border-[#555] text-white"
                    />
                    <button className="w-full py-2 px-4 rounded bg-[#646cff] hover:bg-[#535bf2] text-white font-bold" onClick={handleLogin}>
                        Zaloguj się
                    </button>
                    <h3 className="text-center mt-4 mb-2">Nie masz konta?</h3>
                    <button className="w-full py-2 px-4 rounded bg-[#646cff] hover:bg-[#535bf2] text-white font-bold" 
                            onClick={() => navigate("/register")}>
                        Zarejestruj się
                    </button>
                    <Link to="/">
                        <button className="w-full py-2 px-4 rounded text-[#aaa] bg-transparent hover:text-white font-bold">
                            Powrót do strony głównej
                        </button>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;