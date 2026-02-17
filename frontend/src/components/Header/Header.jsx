import React from 'react';
import logo from '../../assets/logo.png';

const Header = () => {
    return (
        <div className="hidden md:block bg-white py-4 shadow-sm border-b-4 border-amber-500">
            <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-center gap-6">
                {/* Logo */}
                <div className="flex-shrink-0">
                    <img src={logo} alt="JNTUK Logo" className="h-28 w-auto" />
                </div>

                {/* Text Content */}
                <div className="">
                    <h1 className="text-2xl md:text-3xl font-bold text-orange-500 mb-1 tracking-wide">
                        Jawaharlal Nehru Technological University, Kakinada.
                    </h1>
                    <h2 className="text-xl md:text-2xl font-bold text-green-600 mb-1" style={{ fontFamily: 'Noto Sans Telugu, sans-serif' }}>
                        జవహర్‌లాల్ నెహ్రూ సాంకేతిక విశ్వవిద్యాలయం, కాకినాడ.
                    </h2>
                    <h3 className="text-lg md:text-xl font-bold text-red-900 tracking-wide">
                        Effective People Effective Culture
                    </h3>
                </div>
            </div>
        </div>
    );
};

export default Header;
