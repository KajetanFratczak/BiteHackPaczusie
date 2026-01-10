import React from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../context/AuthContext';

const FloatingLogger = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  // jeśli użytkownik jest zalogowany, nie pokazuj loggera
  if (user) {
    return null;
  }

  return (
    <div className="fixed bottom-0 left-0 w-full bg-[#233D4D] text-[#F5FBE6] p-6 text-center shadow-md flex justify-center items-center gap-4 font-bold text-lg z-50">      <span>Chcesz dodać ogłoszenie? </span>
      <button className="py-2 px-5 bg-[#FE7F2D] text-[#F5FBE6] border-none rounded-[20px] cursor-pointer font-bold hover:bg-slate-800 transition-colors" 
              onClick={() => navigate("/login")}>
        Zaloguj się
      </button>
    </div>
  );
};

export default FloatingLogger;