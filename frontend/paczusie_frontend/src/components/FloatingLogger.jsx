import React from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../context/AuthContext';

const FloatingLogger = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  if (user) {
    return null;
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-r from-[#233D4D] to-slate-800 text-white p-4 shadow-lg flex flex-col sm:flex-row justify-center items-center gap-4 font-bold z-50 animate-slide-up">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-gradient-to-r from-[#FE7F2D] to-orange-500 rounded-full flex items-center justify-center">
          <span className="text-lg">🚀</span>
        </div>
        <div>
          <p className="text-lg font-bold">Rozwiń swój biznes z OtoBiznes!</p>
          <p className="text-sm font-normal text-gray-300">Dołącz do tysięcy przedsiębiorców już dziś</p>
        </div>
      </div>

      <div className="flex gap-3">
        <button
          className="bg-gradient-to-r from-[#FE7F2D] to-orange-500 hover:from-[#E76F1F] hover:to-orange-600 text-white px-6 py-3 rounded-xl font-bold transition-all duration-300 hover:shadow-lg transform hover:-translate-y-0.5"
          onClick={() => navigate("/register")}
        >
          Załóż konto
        </button>
        <button
          className="bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-xl font-bold transition-all duration-300 backdrop-blur-sm border border-white/20"
          onClick={() => navigate("/login")}
        >
          Zaloguj się
        </button>
      </div>
    </div>
  );
};

export default FloatingLogger;