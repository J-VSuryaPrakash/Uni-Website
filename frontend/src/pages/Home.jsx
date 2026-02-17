import React, { useState } from 'react';
import {
    Bell,
    Calendar,
    ChevronRight,
    BookOpen,
    Award,
    Users,
    Globe,
    Briefcase,
    Activity,
    FileText,
    MapPin,
    Phone,
    Mail
} from 'lucide-react';
import { Link } from 'react-router-dom';
import vc from '../assets/vc.jpg'
const Home = () => {
    const [activeTab, setActiveTab] = useState('notifications');

    // Dummy data for notifications
    const notifications = [
        { id: 1, date: '22-12-2025', desc: 'Ph.D. Registration Status - Cancellation Notice', dept: 'Director - Academics' },
        { id: 2, date: '16-12-2025', desc: 'The Andhra Pradesh Public Employment Order, 2025', dept: 'Registrar' },
        { id: 3, date: '08-12-2025', desc: 'R23 Regulations and Circular', dept: 'Registrar' },
        { id: 4, date: '04-12-2025', desc: 'JNTUK - Affiliated Colleges - Furnishing of info', dept: 'Registrar' },
        { id: 5, date: '03-12-2025', desc: 'JNTUK - D Academics - Notification - RRMs', dept: 'Director - Academics' },
    ];

    const happenings = [
        {
            id: 1,
            title: "79th Independence Day",
            desc: "Celebrations at JNTUK Kakinada - 2025",
            image: "https://images.unsplash.com/photo-1532375810709-75b1da00537c?q=80&w=1000&auto=format&fit=crop" // Placeholder
        },
        {
            id: 2,
            title: "79th Independence Day",
            desc: "Celebrations at JNTUK Kakinada - 2025",
            image: "https://images.unsplash.com/photo-1532375810709-75b1da00537c?q=80&w=1000&auto=format&fit=crop" // Placeholder
        },
        {
            id: 3,
            title: "79th Independence Day",
            desc: "Celebra at JNTUK Kakinada - 2025",
            image: "https://images.unsplash.com/photo-1532375810709-75b1da00537c?q=80&w=1000&auto=format&fit=crop" // Placeholder
        },
        // Add more slides later
    ];

    const portals = [
        { label: "JNTUK Placement Cell", icon: <Briefcase className="w-8 h-8 text-purple-600" />, color: "bg-purple-50" },
        { label: "JNTUK DAFLM", icon: <BookOpen className="w-8 h-8 text-yellow-600" />, color: "bg-yellow-50" },
        { label: "JNTUK NSS", icon: <Users className="w-8 h-8 text-blue-600" />, color: "bg-blue-50" },
        { label: "JNTUK ARC", icon: <Activity className="w-8 h-8 text-red-600" />, color: "bg-red-50" },
        { label: "JNTUK DCA & IR", icon: <Globe className="w-8 h-8 text-indigo-600" />, color: "bg-indigo-50" },
        { label: "AICTE", icon: <Award className="w-8 h-8 text-orange-600" />, color: "bg-orange-50" },
    ];

    return (
        <div className="min-h-screen bg-gray-50 font-sans">

            {/* HERO SECTION */}
            <section className="relative h-[85vh] w-full overflow-hidden">
                {/* Background Image Placeholder - Replace with actual JNTUK building image */}
                <div
                    className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-1000 hover:scale-105"
                    style={{ backgroundImage: 'url("https://www.jntuk.edu.in/assets/img/jntukmainhomebg.png")' }}
                >
                    <div className="absolute inset-0 bg-gradient-to-r from-white/90 via-white/40 to-transparent"></div>
                </div>

                <div className="relative z-10 max-w-7xl mx-auto px-6 h-full flex items-center">
                    <div className="max-w-2xl animate-fade-in-up">
                        {/* <h2 className="text-2xl md:text-3xl text-gray-600 font-medium tracking-wide mb-2">Welcome to</h2>
                        <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6 drop-shadow-sm">
                            JNTUK <span className="text-blue-900">Kakinada</span>
                        </h1> */}
                        {/* <p className="text-lg md:text-xl text-gray-700 leading-relaxed font-light border-l-4 border-yellow-500 pl-4">
                            The gateway to excellence and innovation in <span className="font-semibold text-blue-800">engineering</span>, where tradition meets modernity.
                        </p> */}

                        {/* Buttons Removed as per request */}
                    </div>
                </div>
            </section>
            {/* About JNTUK Section */}
            <section className="py-8 bg-white relative">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                        {/* Image Column */}
                        <div className="relative group max-w-md mx-auto lg:mx-0">
                            <div className="absolute -inset-2 bg-gradient-to-r from-blue-600 to-blue-900 rounded-xl opacity-20 group-hover:opacity-30 blur-lg transition duration-500"></div>
                            <div className="relative rounded-2xl overflow-hidden shadow-xl border-2 border-white">
                                <img
                                    src={vc}
                                    alt="JNTUK Vice Chancellor"
                                    className="w-full h-80 object-cover transform transition-transform duration-700 hover:scale-105"
                                    onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=1000&auto=format&fit=crop'; }}
                                />
                                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                                    <p className="text-white font-bold text-base">Prof. C S R K Prasad</p>
                                    <p className="text-blue-100 text-xs">Hon'ble Vice-Chancellor, JNTUK</p>
                                </div>
                            </div>
                        </div>

                        {/* Text Column */}
                        <div className="space-y-3">
                            <h2 className="text-2xl font-bold text-blue-900 border-l-4 border-yellow-500 pl-3">
                                About JNTUK
                            </h2>
                            <div className="space-y-2 text-gray-700 text-sm leading-relaxed text-justify">
                                <p>
                                    Jawaharlal Nehru Technological University Kakinada (JNTUK) is established in the year 2008 vide ACT NO. 30 OF 2008 by the State of ANDHRA PRADESH. The University grew out of the College of Engineering Vizagapatnam founded by the Government of the composite Madras State in the year 1946. Spread over a sprawling campus of 100 acres in the port city of Kakinada, the college became a constituent of JNTU, Hyderabad in 1972. Subject to the trifurcation of the JNTU Hyderabad, it was notified as JNTUK Kakinada by the act of legislature in 2008.
                                </p>
                                <p>
                                    The jurisdiction of JNTU Kakinada extends over the districts of East Godavari, Kakinada, Konaseema, West Godavari, Eluru, NTR, Krishna, Guntur, Palnadu, Bapatla and Prakasam. The University has 159 affiliated colleges under the jurisdiction of these 11 districts. The University serves approximately 2.3 lakh students across more than 50 bachelor programs, over 120 master programs, and various Ph.D. programs. It offers Engineering and Pharmacy courses in both Under Graduate and Post Graduate Programs, as well as Management programs.
                                </p>
                                <p>
                                    The University and colleges are governed by the rules and guidelines provided by the Higher Education Department of AP and AP State Council for Higher Education from time to time. JNTUK has produced highly professional and competitive engineers by infusing greater quality and content into the curriculum and educating students with appropriate skills suitable for a rapidly challenging industrial scenario.
                                </p>
                            </div>
                            <Link to="/about" className="inline-flex items-center text-blue-700 font-semibold hover:text-blue-900 transition-colors text-sm group">
                                Read More History <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
            {/* TICKER / MARQUEE */}
            <div className="bg-blue-900 text-white relative z-20 shadow-lg">
                <div className="max-w-7xl mx-auto flex items-center h-12">
                    <div className="bg-red-600 h-full flex items-center px-4 font-bold text-sm tracking-wider uppercase shrink-0">
                        Live Scrolling
                    </div>
                    <div className="flex-1 overflow-hidden relative mx-4">
                        <div className="animate-marquee whitespace-nowrap text-sm font-medium">
                            <span className="mx-4">02-02-2026 Notification for Recruitment of Microbiologist (Contract) – Food Testing Laboratory, JNTUK</span>
                            <span className="mx-4 text-yellow-300">★</span>
                            <span className="mx-4">31-01-2026 R24 MBA & MCA Revised Question Paper Patterns</span>
                            <span className="mx-4 text-yellow-300">★</span>
                            <span className="mx-4">XII Convocation Notification - JNTUK Kakinada</span>
                        </div>
                    </div>
                    <div className="bg-yellow-500 text-blue-900 h-full flex items-center px-4 font-bold text-xs uppercase shrink-0">
                        New Updates
                    </div>
                </div>
            </div>

            {/* NOTIFICATION CENTER */}
            <section className="py-16 px-4 bg-white">
                <div className="max-w-7xl mx-auto">
                    <div className="flex flex-col md:flex-row justify-between items-end mb-8 border-b border-gray-100 pb-4">
                        <div>
                            <h2 className="text-3xl font-bold text-blue-900 uppercase tracking-tight">Notification Center</h2>
                            <p className="text-gray-500 mt-2">Latest updates, circulars, and academic news.</p>
                        </div>
                        <Link to="/notifications" className="hidden md:flex items-center gap-2 px-5 py-2 bg-blue-50 text-blue-700 rounded-lg text-sm font-semibold hover:bg-blue-100 transition-colors">
                            View Archive <ChevronRight className="w-4 h-4" />
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                        {/* TABS & TABLE (Left Side) */}
                        <div className="lg:col-span-12 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">

                            {/* TAB HEADERS */}
                            <div className="flex border-b border-gray-100 overflow-x-auto">
                                {['Notifications and Circulars', 'Sports', 'Workshops & Conferences', 'Examination Section', 'Tenders'].map((tab) => (
                                    <button
                                        key={tab}
                                        onClick={() => setActiveTab(tab.toLowerCase())}
                                        className={`px-6 py-4 text-sm font-semibold whitespace-nowrap transition-colors border-b-2 ${activeTab === tab.toLowerCase() || (activeTab === 'notifications' && tab.startsWith('Noti'))
                                            ? 'border-blue-600 text-blue-600 bg-blue-50/50'
                                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                                            }`}
                                    >
                                        {tab}
                                    </button>
                                ))}
                            </div>

                            {/* TABLE CONTENT */}
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm text-left">
                                    <thead className="bg-gray-50 text-gray-600 font-semibold uppercase text-xs">
                                        <tr>
                                            <th className="px-6 py-4 rounded-tl-lg">S.No</th>
                                            <th className="px-6 py-4">Date</th>
                                            <th className="px-6 py-4 w-1/2">Notification</th>
                                            <th className="px-6 py-4 rounded-tr-lg">Department</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {notifications.map((item) => (
                                            <tr key={item.id} className="hover:bg-blue-50/30 transition-colors group">
                                                <td className="px-6 py-4 text-gray-500 font-medium">{item.id}.</td>
                                                <td className="px-6 py-4 text-blue-600 font-medium">{item.date}</td>
                                                <td className="px-6 py-4 text-gray-800 font-medium group-hover:text-blue-700 transition-colors cursor-pointer">
                                                    {item.desc}
                                                    {item.id <= 2 && <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-red-100 text-red-800 animate-pulse">NEW</span>}
                                                </td>
                                                <td className="px-6 py-4 text-gray-500">{item.dept}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            <div className="p-4 bg-gray-50 flex justify-center md:hidden">
                                <Link to="/about/notifications" className="text-sm font-semibold text-blue-600">View All Notifications</Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* HAPPENINGS SECTION */}
            <section className="py-20 bg-blue-900 text-white overflow-hidden relative">
                <div className="absolute top-0 right-0 w-1/2 h-full bg-blue-800/50 skew-x-12 transform translate-x-20"></div>

                <div className="max-w-7xl mx-auto px-6 relative z-10">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

                        <div className="space-y-8">
                            <div>
                                <h3 className="text-blue-300 font-bold tracking-wider uppercase text-sm mb-2">Campus Life</h3>
                                <h2 className="text-4xl md:text-5xl font-bold leading-tight">JNTUK <br /> Happenings.</h2>
                            </div>

                            <div className="prose prose-lg prose-invert text-blue-100/80">
                                <p>
                                    Dive into the vibrant world of JNTUK. Experience real-time updates on events, achievements, and campus life, offering a comprehensive glimpse into the dynamic spirit of our community.
                                </p>
                            </div>

                            <div className="flex items-center gap-4 bg-white/10 backdrop-blur-sm p-4 rounded-2xl border border-white/10 max-w-md">
                                <div className="w-12 h-12 rounded-full bg-green-500 flex items-center justify-center shrink-0">
                                    <Award className="text-white w-6 h-6" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-white">A place where you can achieve</h4>
                                    <p className="text-blue-200 text-xs">Education encompasses both teaching and learning of knowledge.</p>
                                </div>
                            </div>

                            <button className="px-8 py-3 bg-white text-blue-900 font-bold rounded-lg hover:bg-yellow-400 transition-colors shadow-lg">
                                View All Happenings
                            </button>
                        </div>

                        {/* CAROUSEL PLACEHOLDER */}
                        <div className="relative">
                            <div className="aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl border-4 border-white/20 relative group">
                                <img
                                    src={happenings[0].image}
                                    alt="Happenings"
                                    className="w-full h-full object-cover transform transition-transform duration-700 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-8">
                                    <span className="bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-full w-fit mb-3">LATEST EVENT</span>
                                    <h3 className="text-2xl font-bold text-white mb-2">{happenings[0].title}</h3>
                                    <p className="text-gray-300">{happenings[0].desc}</p>
                                </div>
                            </div>

                            {/* Navigation Buttons (Visual only for now) */}
                            <div className="absolute -bottom-6 right-8 flex gap-2">
                                <button className="w-12 h-12 bg-white rounded-full text-blue-900 flex items-center justify-center shadow-lg hover:bg-yellow-400 transition-colors">←</button>
                                <button className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-blue-500 transition-colors">→</button>
                            </div>
                        </div>

                    </div>
                </div>
            </section>

            {/* JNTUK SITES GRID */}
            <section className="py-20 bg-gray-50">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-gray-900 uppercase tracking-tight">JNTUK Sites</h2>
                        <div className="w-20 h-1 bg-blue-600 mx-auto mt-4 rounded-full"></div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
                        {portals.map((portal) => (
                            <a
                                key={portal.label}
                                href="#"
                                className="group bg-white p-6 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col items-center justify-center text-center gap-4 hover:-translate-y-2"
                            >
                                <div className={`w-16 h-16 rounded-2xl ${portal.color} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                                    {portal.icon}
                                </div>
                                <h3 className="font-bold text-sm text-gray-700 group-hover:text-blue-700 transition-colors break-words w-full">
                                    {portal.label}
                                </h3>
                            </a>
                        ))}
                    </div>
                </div>
            </section>

            {/* MAP / ADDRESS FOOTER PREVIEW (Before actual footer) */}
            <section className="bg-white py-12 border-t border-gray-100">
                <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-12">
                    <div>
                        <h3 className="text-xl font-bold text-gray-800 mb-6">Communication Address</h3>
                        <div className="space-y-4 text-gray-600">
                            <div className="flex items-start gap-4">
                                <Users className="w-5 h-5 text-blue-600 shrink-0 mt-1" />
                                <div>
                                    <p className="font-semibold text-gray-900">The Registrar</p>
                                    <p>Jawaharlal Nehru Technological University</p>
                                    <p>Kakinada, Andhra Pradesh 533003</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <Phone className="w-5 h-5 text-blue-600 shrink-0" />
                                <p>+91 884 230 0900</p>
                            </div>
                            <div className="flex items-center gap-4">
                                <Mail className="w-5 h-5 text-blue-600 shrink-0" />
                                <p>registrar@jntuk.edu.in</p>
                            </div>
                        </div>
                    </div>

                    <div className="h-64 rounded-2xl overflow-hidden bg-gray-200 shadow-inner">
                        {/* Embed Google Map Placeholder */}
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
            </section>

        </div>
    );
};

export default Home;
