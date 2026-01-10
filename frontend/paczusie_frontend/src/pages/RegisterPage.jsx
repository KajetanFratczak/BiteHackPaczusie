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

    const navigate = useNavigate();
    const { register } = useAuth();
    
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
        if (password != password2) {
            setError("Hasła się nie zgadzają.");
            return false;
        }
        return true;
    };

    const handleRegister = async () => {
        setError("");
        if(!validateForm()) return;
        try{
            const result = await register(name, surname, email, password);
            if (result.success) {
                navigate("/login");
                alert("Rejestracja zakończona sukcesem! Możesz się teraz zalogować.");
            } else {
                setError(result.msg || "Błąd rejestracji.");
            }
        } catch (error) {
            setError("Wystąpił błąd podczas rejestracji.");
        }
    };

    return (
        <div className='max-h-screen'>
            <Navbar/>
            <div className="bg-[#F5FBE6] min-h-screen flex justify-center items-center p-4">
                <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
                    <h2 className="text-2xl mb-6 font-bold text-[#2C3E50]">
                        Rejestracja
                    </h2>
                    {error && (<div className="bg-red-500 text-white p-3 rounded mb-4">{error}</div>)}
                    <input 
                        type="text" 
                        placeholder="Imię"
                        fullWidth
                        label="Imię"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full mb-4 p-2 rounded bg-[#F8F9FA] border border-[#DFE4EA] text-[#2C3E50] focus:border-[#619B8A] focus:outline-none"
                    />
                    <input 
                        type="text" 
                        placeholder="Nazwisko"
                        fullWidth
                        label="Nazwisko"
                        value={surname}
                        onChange={(e) => setSurname(e.target.value)}
                        className="w-full mb-4 p-2 rounded bg-[#F8F9FA] border border-[#DFE4EA] text-[#2C3E50] focus:border-[#619B8A] focus:outline-none"
                    />
                    <input
                        type="email"
                        placeholder="Adres Email"
                        fullWidth
                        label="Adres Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full mb-4 p-2 rounded bg-[#F8F9FA] border border-[#DFE4EA] text-[#2C3E50] focus:border-[#619B8A] focus:outline-none"
                    />
                    <input
                        type="password"
                        placeholder="Hasło"                                                                  
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full mb-4 p-2 rounded bg-[#F8F9FA] border border-[#DFE4EA] text-[#2C3E50] focus:border-[#619B8A] focus:outline-none"
                    />
                    <input
                        type="password"
                        placeholder="Powtórz hasło"                                                                  
                        value={password2}
                        onChange={(e) => setPassword2(e.target.value)}
                        className="w-full mb-4 p-2 rounded bg-[#F8F9FA] border border-[#DFE4EA] text-[#2C3E50] focus:border-[#619B8A] focus:outline-none"
                    />
                    <button className="w-full py-3 px-4 rounded-lg bg-[#619B8A] hover:bg-[#4E8275] text-white font-bold transition-colors mb-3" onClick={handleRegister}>
                        Zarejestruj się
                    </button>
                    <Link to="/">
                        <button className="w-full py-3 px-4 rounded-lg text-[#619B8A] bg-transparent hover:bg-[#F8F9FA] font-bold transition-colors">
                            Powrót do strony głównej
                        </button>
                    </Link>
                </div>
            </div>
        </div>
    );
}
export default RegisterPage;