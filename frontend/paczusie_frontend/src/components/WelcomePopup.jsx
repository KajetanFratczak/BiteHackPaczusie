import React, {useState, useEffect} from "react";
import logo from '../assets/otobiznes_logotype_light.svg';

const WelcomePopup = () => {
    const [showPopup, setShowPopup] = useState(false);

    useEffect(() => {
        const hasVisited = sessionStorage.getItem("hasVisited");
        if (!hasVisited) {
            setShowPopup(true);
        }
    }, []);

    const handleEnter = () => {
        setShowPopup(false);
        sessionStorage.setItem("hasVisited", "true");
    };

    if (!showPopup) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-white z-[9999]">

            <div className="absolute top-0 left-0 w-full h-2 bg-[#FE7F2D]"></div>
            
            <div className="max-w-2xl px-6 flex flex-col items-center justify-center text-center">
                
                
                <div className="mb-10">
                    <img src={logo} alt="OtoBiznes Logo" className="h-10" />
                </div>

                <h2 className="text-3xl font-bold mb-6 text-slate-800">
                    Witamy w społeczności lokalnych przedsiębiorców!
                </h2>
                
                <p className="text-xl text-gray-600 mb-10 leading-relaxed max-w-lg">
                    Znajdź najlepsze oferty w Twojej okolicy lub rozwijaj swój biznes dodając ogłoszenia całkowicie za darmo!
                </p>

                <button
                    className="bg-[#FE7F2D] text-white px-12 py-5 rounded-full text-xl font-bold hover:bg-orange-600 transition-all hover:scale-105 shadow-xl shadow-orange-200"
                    onClick={handleEnter}
                >
                    Wejdź do serwisu
                </button>

                <p className="mt-8 text-sm text-gray-400 uppercase tracking-widest font-semibold">
                    Twój biznes • Twoja okolica • Twoje zasady
                </p>
            </div>
        </div>
    );
}

export default WelcomePopup;