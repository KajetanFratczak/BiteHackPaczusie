import React, {useState, useEffect} from "react";

const WelcomePopup = () => {
    const [showPopup, setShowPopup] = useState(false);

    useEffect(() => {
        const hasVisited = sessionStorage.getItem("hasVisited");
        if (!hasVisited) {
            setShowPopup(true);
            // Rezerwujemy ustawienie hasVisited na moment zamknięcia, 
            // żeby odświeżenie strony przed kliknięciem przycisku nie zabiło popupu
        }
    }, []);

    const handleEnter = () => {
        setShowPopup(false);
        sessionStorage.setItem("hasVisited", "true");
    };

    if (!showPopup) return null;

    return (
        // Z-50 i fixed inset-0 gwarantują, że popup będzie nad Navbarem
        <div className="fixed inset-0 flex items-center justify-center bg-white z-[9999]">
            
            {/* Dekoracyjne tło w stylu OTO BIZNES (opcjonalne, ale dodaje smaku) */}
            <div className="absolute top-0 left-0 w-full h-2 bg-[#FE7F2D]"></div>
            
            <div className="max-w-2xl px-6 flex flex-col items-center justify-center text-center">
                
                {/* Logo / Nazwa */}
                <div className="mb-10">
                    <h1 className="text-5xl font-black tracking-tighter text-slate-900 uppercase italic">
                        OTO <span className="text-[#FE7F2D]">BIZNES</span>
                    </h1>
                    <div className="h-1 w-24 bg-[#FE7F2D] mx-auto mt-2"></div>
                </div>

                <h2 className="text-3xl font-bold mb-6 text-slate-800">
                    Witamy w społeczności lokalnych przedsiębiorców!
                </h2>
                
                <p className="text-xl text-gray-600 mb-10 leading-relaxed max-w-lg">
                    Cieszymy się, że jesteś z nami. Znajdź najlepsze oferty w Twojej okolicy lub rozwijaj swój biznes dodając ogłoszenia całkowicie za darmo.
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

            <div className="absolute bottom-0 right-0 p-8 opacity-10 select-none pointer-events-none">
                 <h1 className="text-9xl font-black">OTO</h1>
            </div>
        </div>
    );
}

export default WelcomePopup;