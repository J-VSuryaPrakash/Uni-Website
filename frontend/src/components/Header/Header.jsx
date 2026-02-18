import React from 'react';
import logo from '../../assets/logo.png';
import naac from '../../assets/naac.png';
const Header = () => {
    return (
        <div className="hidden md:block bg-white py-4 shadow-sm relative z-[60]">
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
                {/* NAAC Logo with Tooltip */}
                <div className="flex-shrink-0 group relative cursor-help">
                    <img src={naac} alt="NAAC A+ Grade" className="h-28 w-auto transition-transform duration-300 group-hover:scale-105" />

                    {/* Tooltip */}
                    <div className="absolute top-full right-0 mt-4 w-[400px] p-6 bg-white text-gray-800 text-sm leading-relaxed shadow-2xl rounded-xl border border-gray-100 z-[100] invisible opacity-0 group-hover:visible group-hover:opacity-100 transition-all duration-300 transform origin-top-right scale-95 group-hover:scale-100">
                        {/* Arrow */}
                        <div className="absolute -top-2 right-10 w-4 h-4 bg-white transform rotate-45 border-t border-l border-gray-100"></div>

                        <p className="text-justify">
                            <span className="font-bold text-blue-900">Jawaharlal Nehru Technological University, Kakinada</span> has achieved a remarkable milestone by securing an <span className="font-bold text-red-600">'A+'</span> grade from <span className="font-bold text-blue-900">NAAC (National Assessment and Accreditation Council)</span> at the national level.
                            <br /><br />
                            This prestigious accreditation underscores JNTUK's commitment to academic excellence, research, and overall institutional quality. The <span className="font-bold text-red-600">'A+'</span> grade is a testament to the university's unwavering dedication to providing high-quality education and fostering a conducive environment for innovation and learning.
                            <br /><br />
                            This achievement not only reflects JNTUK's standing as a premier institution but also reinforces its role in shaping future leaders and contributing significantly to the advancement of education on a national scale.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Header;
