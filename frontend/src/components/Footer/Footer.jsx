import { Link } from "react-router-dom";
import { useState, useEffect } from "react";

const Footer = () => {
    const [showScrollTop, setShowScrollTop] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setShowScrollTop(window.scrollY > 300);
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    return (
        <>
            <footer className="bg-black text-white pt-16 pb-8">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
                        {/* Contact Us */}
                        <div className="space-y-6">
                            <h3 className="text-xl font-bold">Contact Us</h3>
                            <div className="space-y-4 text-gray-400 text-sm">
                                <div className="flex gap-3">
                                    <svg className="w-5 h-5 flex-shrink-0 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                    <p>The Registrar,<br />Jawaharlal Nehru Technological University,<br />Kakinada, Andhra Pradesh 533003</p>
                                </div>
                                <div className="flex gap-3 items-center">
                                    <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                    </svg>
                                    <p>+91 884 230 0900</p>
                                </div>
                                <div className="flex gap-3 items-center">
                                    <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                    </svg>
                                    <p>+91 884 230 0901</p>
                                </div>
                            </div>
                            {/* Social Icons */}
                            {/* <div className="flex gap-3">
                                {['facebook', 'twitter', 'instagram', 'linkedin', 'youtube'].map((social) => (
                                    <a
                                        key={social}
                                        href="#"
                                        className="w-8 h-8 rounded bg-white flex items-center justify-center text-black hover:bg-gray-200 transition-colors"
                                    >
                                        <span className="sr-only">{social}</span>

                                        <div className="w-4 h-4 bg-black/20 rounded-sm"></div>
                                    </a>
                                ))}
                            </div> */}
                        </div>

                        {/* Support */}
                        <div className="space-y-6">
                            <h3 className="text-xl font-bold">Support</h3>
                            <ul className="space-y-3 text-gray-400 text-sm">
                                <li><Link to="/contact" className="hover:text-white transition-colors">Contact</Link></li>
                                <li><Link to="/support" className="hover:text-white transition-colors">Support</Link></li>
                                <li><Link to="/terms" className="hover:text-white transition-colors">Terms & Conditions</Link></li>
                                <li><Link to="/disclaimer" className="hover:text-white transition-colors">Disclaimer</Link></li>
                                <li><Link to="/policies" className="hover:text-white transition-colors">Policies</Link></li>
                            </ul>
                        </div>

                        {/* Other Important Links */}
                        <div className="space-y-6">
                            <h3 className="text-xl font-bold">Other Important Links</h3>
                            <ul className="space-y-3 text-gray-400 text-sm">
                                <li><a href="#" className="hover:text-white transition-colors">UGC</a></li>
                                <li><a href="#" className="hover:text-white transition-colors">AICTE</a></li>
                                <li><a href="#" className="hover:text-white transition-colors">APSCHE</a></li>
                                <li><a href="#" className="hover:text-white transition-colors">AP ECET</a></li>
                                <li><a href="#" className="hover:text-white transition-colors">AP PGECET</a></li>
                                <li><a href="#" className="hover:text-white transition-colors">AP EAPCET</a></li>
                            </ul>
                        </div>

                        {/* Other Portals */}
                        <div className="space-y-6">
                            <h3 className="text-xl font-bold">Other Portals</h3>
                            <ul className="space-y-3 text-gray-400 text-sm">
                                <li><a href="#" className="hover:text-white transition-colors">UGC SWAYAM - TVCS & RADIO JINGLES FOR SWAYAM INITIATIVE</a></li>
                                <li><a href="#" className="hover:text-white transition-colors">Jntuk eLearn</a></li>
                                <li><a href="#" className="hover:text-white transition-colors">Infosys Springboard</a></li>
                                <li><a href="#" className="hover:text-white transition-colors">Board for Community Development through Education (BCDE)</a></li>
                            </ul>
                        </div>
                    </div>

                    {/* Bottom Bar */}
                    <div className="border-t border-gray-800 pt-8 flex flex-col items-center text-center">
                        <div className="text-sm text-gray-400 space-y-1">
                            <p>All Copyright © 2024 <span className="font-bold text-white">Jawaharlal Nehru Technological University, Kakinada</span>. All Rights Reserved.</p>
                            <p className="text-xs">Designed and Developed By <span className="font-bold text-white">Students of JNTUK Department of CSE</span></p>
                        </div>
                    </div>
                </div>
            </footer>

            {/* Floating Scroll to Top Button */}
            <button
                onClick={scrollToTop}
                className={`fixed bottom-8 right-8 z-50 w-12 h-12 rounded-full bg-black/80 backdrop-blur-sm text-white flex items-center justify-center shadow-2xl hover:bg-black transition-all duration-300 transform border border-gray-700 ${showScrollTop ? 'translate-y-0 opacity-100' : 'translate-y-16 opacity-0'
                    }`}
                aria-label="Scroll to top"
            >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                </svg>
            </button>
        </>
    );
};

export default Footer;
