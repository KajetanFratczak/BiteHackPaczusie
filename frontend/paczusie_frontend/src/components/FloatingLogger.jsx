import React from 'react';

const FloatingLogger = () => {
  return (
    <div className="fixed bottom-0 left-0 w-full bg-[#61dafb] text-[#282c34] p-6 text-center shadow-md flex justify-center items-center gap-4 font-bold">
      <span>Chcesz dodać ogłoszenie? </span>
      <button className="py-2 px-5 bg-[#282c34] text-white border-none rounded-[20px] cursor-pointer font-bold hover:bg-slate-800 transition-colors" onClick={() => alert("Tu będzie przekierowanie do logowania")}>
        Zaloguj się
      </button>
    </div>
  );
};

export default FloatingLogger;