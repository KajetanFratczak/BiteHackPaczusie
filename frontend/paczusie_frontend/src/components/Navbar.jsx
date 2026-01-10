import React from 'react';
import logo from '../assets/otobiznes_logotype_dark.svg';
import { Link, useNavigate } from 'react-router';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-[#233D4D] text-white p-4 shadow-lg sticky top-0 z-50">
      <div className="max-w-[1500px] mx-auto w-full flex justify-center items-center">
        <Link to="/">
          <img src={logo} alt="OtoBiznes Logo" className="h-10 md:h-12 hover:opacity-90 transition-opacity" />
        </Link>

        {/* Ikonka profilu po prawej */}
        <div className="absolute right-4 flex items-center gap-4">
          {user ? (
            <>
              <Link 
                to="/profile" 
                className="font-bold hover:text-[#FE7F2D] transition-colors"
              >
                Mój Profil
              </Link>
              <button
                onClick={handleLogout}
                className="bg-[#FE7F2D] px-4 py-2 rounded-lg font-bold hover:bg-orange-600 transition-colors"
              >
                Wyloguj się
              </button>
            </>
          ) : (
            <Link 
              to="/login"
              className="font-bold hover:text-[#FE7F2D] transition-colors"
            >
              Zaloguj się
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;