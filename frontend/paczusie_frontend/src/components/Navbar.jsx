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

  const profileRedirectPath = user?.role === 'admin' ? '/admin/users' : '/profile';

  return (
    <nav className="bg-gradient-to-r from-[#233D4D] to-slate-800 text-white p-4 shadow-xl sticky top-0 z-50">
      <div className="max-w-7xl mx-auto w-full flex justify-between items-center">
        <Link to="/" className="flex items-center gap-3 group">
          <img src={logo} alt="OtoBiznes Logo" className="h-10 md:h-12 group-hover:opacity-90 transition-opacity" />
        </Link>

        {/* Nawigacja dla zalogowanych użytkowników */}
        {user ? (
          <div className="flex items-center gap-6">
            <div className="relative group">
              <button className="flex items-center gap-3 bg-white/10 hover:bg-white/20 px-4 py-2.5 rounded-xl transition-all duration-300 backdrop-blur-sm">
                <div className="w-8 h-8 bg-gradient-to-r from-[#FE7F2D] to-orange-500 rounded-full flex items-center justify-center font-bold">
                  {user?.firstName?.charAt(0)?.toUpperCase() || 'U'}
                </div>
                <span className="font-medium hidden md:inline-block">
                  {user?.firstName || 'Profil'}
                </span>
                <span className="text-gray-300">▼</span>
              </button>

              <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-2xl border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 z-50">
                <Link
                  to={profileRedirectPath}
                  className="block px-4 py-3 text-gray-800 hover:bg-gray-50 rounded-t-xl font-medium"
                >
                  👤 Mój Profil
                </Link>
                <div className="border-t border-gray-100">
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-3 text-red-600 hover:bg-red-50 rounded-b-xl font-medium"
                  >
                    🚪 Wyloguj się
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-4">
            <Link
              to="/login"
              className="font-medium hover:text-[#FE7F2D] transition-colors"
            >
              Zaloguj się
            </Link>
            <button
              onClick={() => navigate("/register")}
              className="bg-gradient-to-r from-[#FE7F2D] to-orange-500 hover:from-[#E76F1F] hover:to-orange-600 text-white px-6 py-2.5 rounded-xl font-bold transition-all duration-300 hover:shadow-lg"
            >
              Załóż konto
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;