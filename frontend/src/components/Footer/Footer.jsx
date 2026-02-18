import { Link } from "react-router-dom";
import {
    MapPin,
    Phone,
    Mail,
    Facebook,
    Twitter,
    Instagram,
    Linkedin,
    Youtube,
    ArrowUp
} from "lucide-react";
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
        <footer className="bg-slate-900 text-slate-300 font-sans relative overflow-hidden">
            {/* Decorative Background Elements */}
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-600 via-yellow-500 to-blue-600"></div>
            <div className="absolute -top-[20%] -right-[10%] w-[500px] h-[500px] bg-blue-900/10 rounded-full blur-3xl"></div>
            <div className="absolute top-[30%] -left-[10%] w-[400px] h-[400px] bg-blue-600/5 rounded-full blur-3xl"></div>

            <div className="max-w-7xl mx-auto px-6 py-16 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">

                    {/* Column 1: Identity & About (Span 4) */}
                    <div className="lg:col-span-4 space-y-6">
                        <div>
                            <h2 className="text-2xl font-bold text-white tracking-wide">JNTUK</h2>
                            <p className="text-blue-400 text-sm font-medium tracking-widest uppercase">Kakinada</p>
                        </div>
                        <p className="text-sm leading-relaxed text-slate-400 text-justify">
                            Jawaharlal Nehru Technological University Kakinada is a public university, located in Kakinada, Andhra Pradesh, India, and one of India's leading educational universities focusing on engineering.
                        </p>

                        <div className="flex gap-3 pt-2">
                            {[
                                { Icon: Facebook, color: "hover:bg-blue-600" },
                                { Icon: Twitter, color: "hover:bg-sky-500" },
                                { Icon: Instagram, color: "hover:bg-pink-600" },
                                { Icon: Linkedin, color: "hover:bg-blue-700" },
                                { Icon: Youtube, color: "hover:bg-red-600" }
                            ].map(({ Icon, color }, index) => (
                                <a
                                    key={index}
                                    href="#"
                                    className={`w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center text-slate-400 transition-all duration-300 hover:text-white hover:-translate-y-1 ${color}`}
                                >
                                    <Icon size={18} />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Column 2: Quick Links (Span 2) */}
                    <div className="lg:col-span-2 space-y-6">
                        <h3 className="text-white font-bold text-lg relative inline-block">
                            Quick Links
                            <span className="absolute -bottom-2 left-0 w-1/2 h-1 bg-yellow-500 rounded-full"></span>
                        </h3>
                        <ul className="space-y-3 text-sm">
                            {['Admissions', 'Examinations', 'Results', 'Alumni', 'Placement Cell', 'RTI Act'].map((item) => (
                                <li key={item}>
                                    <a href="#" className="hover:text-yellow-400 transition-colors flex items-center gap-2 group">
                                        <span className="w-1.5 h-1.5 bg-slate-600 rounded-full group-hover:bg-yellow-500 transition-colors"></span>
                                        {item}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Column 3: Contact Info (Span 3) */}
                    <div className="lg:col-span-3 space-y-6">
                        <h3 className="text-white font-bold text-lg relative inline-block">
                            Contact Us
                            <span className="absolute -bottom-2 left-0 w-1/2 h-1 bg-yellow-500 rounded-full"></span>
                        </h3>
                        <div className="space-y-4 text-sm">
                            <div className="flex items-start gap-4 group">
                                <div className="p-2 bg-blue-900/30 rounded-lg text-blue-400 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                                    <MapPin size={18} />
                                </div>
                                <div>
                                    <p className="font-semibold text-white mb-1">The Registrar</p>
                                    <p className="text-slate-400">JNTUK, Pithapuram Road,</p>
                                    <p className="text-slate-400">Kakinada, Andhra Pradesh 533003</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-4 group">
                                <div className="p-2 bg-blue-900/30 rounded-lg text-blue-400 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                                    <Phone size={18} />
                                </div>
                                <div>
                                    <p className="font-semibold text-white mb-1">Phone</p>
                                    <p className="text-slate-400">+91 884 230 0900</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-4 group">
                                <div className="p-2 bg-blue-900/30 rounded-lg text-blue-400 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                                    <Mail size={18} />
                                </div>
                                <div>
                                    <p className="font-semibold text-white mb-1">Email</p>
                                    <p className="text-slate-400">registrar@jntuk.edu.in</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Column 4: Map (Span 3) */}
                    <div className="lg:col-span-3 space-y-6">
                        <h3 className="text-white font-bold text-lg relative inline-block">
                            Location
                            <span className="absolute -bottom-2 left-0 w-1/2 h-1 bg-yellow-500 rounded-full"></span>
                        </h3>
                        <div className="h-48 w-full rounded-xl overflow-hidden border-2 border-slate-700 shadow-lg grayscale hover:grayscale-0 transition-all duration-500">
                            <iframe
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3815.939634710186!2d82.2396!3d16.9749!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a382847c0c16b9b%3A0xe781907cb3a34246!2sJawaharlal%20Nehru%20Technological%20University%20Kakinada!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
                                width="100%"
                                height="100%"
                                style={{ border: 0 }}
                                allowFullScreen=""
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                            ></iframe>
                        </div>
                    </div>

                </div>

                {/* Bottom Bar */}
                <div className="border-t border-slate-800 mt-16 pt-8 flex flex-col md:flex-row justify-center items-center gap-4 text-xs text-slate-500">
                    <p>© 2024 <span className="text-white font-semibold">JNTUK</span>. All Rights Reserved.</p>
                </div>
            </div>

            {/* Scroll to Top */}
            <button
                onClick={scrollToTop}
                className={`fixed bottom-8 right-8 z-50 w-12 h-12 rounded-full bg-yellow-500 text-blue-900 flex items-center justify-center shadow-lg hover:bg-yellow-400 hover:-translate-y-1 transition-all duration-300 ${showScrollTop ? 'translate-y-0 opacity-100' : 'translate-y-16 opacity-0'
                    }`}
                aria-label="Scroll to top"
            >
                <ArrowUp size={24} strokeWidth={2.5} />
            </button>
        </footer>
    );
};

export default Footer;
