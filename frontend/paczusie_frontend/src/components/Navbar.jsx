import React from 'react';
import logo from '../assets/otobiznes_logotype_dark.svg';

const Navbar = () => {
  return (
    <nav className="bg-[#233D4D] text-white p-4 shadow-lg sticky top-0 z-50">
      <div className="max-w-[1500px] mx-auto w-full flex justify-center items-center">
        <img src={logo} alt="OtoBiznes Logo" className="h-10 md:h-12 hover:opacity-90 transition-opacity" />
      </div>
    </nav>
  );
};

export default Navbar;