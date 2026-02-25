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
} from 'lucide-react';
import aicte from '../assets/aicte.svg'
import apsche from '../assets/apsche.svg'
import mhrd from '../assets/mhrd.svg'
import naac from '../assets/NAAC.svg'
import nirf from '../assets/NIRF.svg'
import ugc from '../assets/UGC.svg'
import Samadhaan from '../assets/Samadhaan.svg'
import { Link } from 'react-router-dom';
import vc from '../assets/vc.jpg'
import { useNotifications } from '../hooks/useNotifications';
import { useEvents } from '../hooks/useEvents';
import { TableSkeleton } from '../components/common/Skeleton';

const NOTIFICATION_TABS = [
    { label: 'All', key: 'all' },
    { label: 'Notifications and Circulars', key: 'notifications' },
    { label: 'Sports', key: 'sports' },
    { label: 'Workshops & Conferences', key: 'workshops' },
    { label: 'Examination Section', key: 'examination' },
    { label: 'Tenders', key: 'tenders' },
];

const Home = () => {
    const [activeTab, setActiveTab] = useState('notifications');

    // Fetch notifications by active tab (category)
    const { data: notifications, isLoading: notifLoading } = useNotifications(activeTab);

    // Fetch events for happenings
    const { data: events } = useEvents();
    const happenings = events || [];

    const [currentHappening, setCurrentHappening] = useState(0);

    const nextHappening = () => {
        if (happenings.length === 0) return;
        setCurrentHappening((prev) => (prev === happenings.length - 1 ? 0 : prev + 1));
    };

    const prevHappening = () => {
        if (happenings.length === 0) return;
        setCurrentHappening((prev) => (prev === 0 ? happenings.length - 1 : prev - 1));
    };

    // Get event image URL from media relations
    const getEventImage = (event) => {
        if (event.media && event.media.length > 0 && event.media[0].media) {
            return event.media[0].media.url;
        }
        return 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=1000&auto=format&fit=crop';
    };

    const formatDate = (dateStr) => {
        if (!dateStr) return '';
        const date = new Date(dateStr);
        return date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
    };

    const portals = [
        { label: "JNTUK Placement Cell", icon: <Briefcase className="w-8 h-8 text-purple-600" />, color: "bg-purple-50" },
        { label: "JNTUK DAFLM", icon: <BookOpen className="w-8 h-8 text-yellow-600" />, color: "bg-yellow-50" },
        { label: "JNTUK NSS", icon: <Users className="w-8 h-8 text-blue-600" />, color: "bg-blue-50" },
        { label: "JNTUK ARC", icon: <Activity className="w-8 h-8 text-red-600" />, color: "bg-red-50" },
        { label: "JNTUK DCA & IR", icon: <Globe className="w-8 h-8 text-indigo-600" />, color: "bg-indigo-50" },
        { label: "AICTE", icon: <Award className="w-8 h-8 text-orange-600" />, color: "bg-orange-50" },
    ];

    // Safe current happening index
    const safeIndex = happenings.length > 0 ? currentHappening % happenings.length : 0;

    return (
        <div className="min-h-screen bg-gray-50 font-sans">

            {/* HERO SECTION */}
            <section className="relative h-[85vh] w-full overflow-hidden">
                <div
                    className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-1000 hover:scale-105"
                    style={{ backgroundImage: 'url("https://www.jntuk.edu.in/assets/img/jntukmainhomebg.png")' }}
                >
                    <div className="absolute inset-0 bg-gradient-to-r from-white/90 via-white/40 to-transparent"></div>
                </div>

                <div className="relative z-10 max-w-7xl mx-auto px-6 h-full flex items-center">
                    <div className="max-w-2xl animate-fade-in-up">
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
                            <Link to="/about-jntuk" className="inline-flex items-center text-blue-700 font-semibold hover:text-blue-900 transition-colors text-sm group">
                                Read More History <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

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
                        <div className="lg:col-span-12 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">

                            {/* TAB HEADERS */}
                            <div className="flex border-b border-gray-100 overflow-x-auto">
                                {NOTIFICATION_TABS.map((tab) => (
                                    <button
                                        key={tab.key}
                                        onClick={() => setActiveTab(tab.key)}
                                        className={`px-6 py-4 text-sm font-semibold whitespace-nowrap transition-colors border-b-2 ${activeTab === tab.key
                                            ? 'border-blue-600 text-blue-600 bg-blue-50/50'
                                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                                            }`}
                                    >
                                        {tab.label}
                                    </button>
                                ))}
                            </div>

                            {/* TABLE CONTENT */}
                            <div className="overflow-x-auto">
                                {notifLoading ? (
                                    <TableSkeleton rows={5} />
                                ) : notifications && notifications.length > 0 ? (
                                    <table className="w-full text-sm text-left">
                                        <thead className="bg-gray-50 text-gray-600 font-semibold uppercase text-xs">
                                            <tr>
                                                <th className="px-6 py-4 rounded-tl-lg">S.No</th>
                                                <th className="px-6 py-4">Date</th>
                                                <th className="px-6 py-4 w-1/2">Notification</th>
                                                {activeTab === 'all' && <th className="px-6 py-4">Category</th>}
                                                <th className="px-6 py-4 rounded-tr-lg">Department</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-100">
                                            {notifications.map((item, index) => (
                                                <tr key={item.id} className="hover:bg-blue-50/30 transition-colors group">
                                                    <td className="px-6 py-4 text-gray-500 font-medium">{index + 1}.</td>
                                                    <td className="px-6 py-4 text-blue-600 font-medium">
                                                        {formatDate(item.createdAt)}
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <Link
                                                            to={`/notifications#notif-${item.id}`}
                                                            className="text-gray-800 font-medium group-hover:text-blue-700 transition-colors hover:underline"
                                                        >
                                                            {item.title}
                                                        </Link>
                                                        {index < 2 && <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-red-100 text-red-800 animate-pulse">NEW</span>}
                                                    </td>
                                                    {activeTab === 'all' && (
                                                        <td className="px-6 py-4 text-gray-500 text-xs whitespace-nowrap">
                                                            {item.category
                                                                ? NOTIFICATION_TABS.find((t) => t.key === item.category)?.label ?? item.category
                                                                : <span className="text-gray-300">—</span>}
                                                        </td>
                                                    )}
                                                    <td className="px-6 py-4 text-gray-500">
                                                        {item.department?.name || '-'}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                ) : (
                                    <div className="p-8 text-center text-gray-400">
                                        No notifications found for this category.
                                    </div>
                                )}
                            </div>
                            <div className="p-4 bg-gray-50 flex justify-center md:hidden">
                                <Link to="/notifications" className="text-sm font-semibold text-blue-600">View All Notifications</Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* HAPPENINGS SECTION */}
            {happenings.length > 0 && (
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

                                <Link to="/happenings" className="inline-block px-8 py-3 bg-white text-blue-900 font-bold rounded-lg hover:bg-yellow-400 transition-colors shadow-lg">
                                    View All Happenings
                                </Link>
                            </div>

                            {/* CAROUSEL */}
                            <div className="relative">
                                <div className="aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl border-4 border-white/20 relative group">
                                    <img
                                        src={getEventImage(happenings[safeIndex])}
                                        alt={happenings[safeIndex].title}
                                        className="w-full h-full object-cover transform transition-transform duration-700 group-hover:scale-110"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-8">
                                        <div className="flex items-center gap-3 mb-3">
                                            <span className="bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-full">LATEST EVENT</span>
                                            {happenings[safeIndex].eventDate && (
                                                <span className="text-white/80 text-sm font-medium flex items-center gap-1">
                                                    <Calendar className="w-4 h-4" />
                                                    {formatDate(happenings[safeIndex].eventDate)}
                                                </span>
                                            )}
                                        </div>
                                        <h3 className="text-2xl font-bold text-white mb-2">{happenings[safeIndex].title}</h3>
                                        <p className="text-gray-300 line-clamp-2">{happenings[safeIndex].description}</p>
                                    </div>
                                </div>

                                {/* Navigation Buttons */}
                                <div className="absolute -bottom-6 right-8 flex gap-2">
                                    <button
                                        onClick={prevHappening}
                                        className="w-12 h-12 bg-white rounded-full text-blue-900 flex items-center justify-center shadow-lg hover:bg-yellow-400 transition-colors z-20 cursor-pointer"
                                        aria-label="Previous Slide"
                                    >
                                        &larr;
                                    </button>
                                    <button
                                        onClick={nextHappening}
                                        className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-blue-500 transition-colors z-20 cursor-pointer"
                                        aria-label="Next Slide"
                                    >
                                        &rarr;
                                    </button>
                                </div>
                            </div>

                        </div>
                    </div>
                </section>
            )}

            {/* JNTUK SITES GRID */}
            <section className="py-12 bg-gradient-to-b from-white to-blue-50/30">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-10">
                        <span className="text-blue-600 font-bold tracking-wider uppercase text-sm bg-blue-50 px-4 py-1.5 rounded-full inline-block mb-2">Quick Access</span>
                        <h2 className="text-3xl font-bold text-gray-900 tracking-tight">Explore JNTUK Portals</h2>
                        <div className="w-16 h-1 bg-gradient-to-r from-blue-600 to-yellow-400 mx-auto mt-4 rounded-full opacity-80"></div>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                        {portals.map((portal) => (
                            <a
                                key={portal.label}
                                href="#"
                                className="group relative bg-white p-5 rounded-[1.5rem] shadow-[0_4px_20px_rgb(0,0,0,0.03)] hover:shadow-[0_10px_25px_rgb(0,0,0,0.06)] transition-all duration-500 flex flex-col items-center justify-center text-center gap-3 border border-gray-50 hover:border-blue-100 hover:-translate-y-1 overflow-hidden"
                            >
                                <div className={`absolute -top-8 -right-8 w-24 h-24 rounded-full ${portal.color} opacity-20 blur-xl group-hover:scale-150 transition-transform duration-700`}></div>
                                <div className={`relative w-16 h-16 rounded-full ${portal.color} flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-sm ring-2 ring-white`}>
                                    {portal.icon}
                                </div>
                                <h3 className="font-bold text-sm text-gray-700 group-hover:text-blue-700 transition-colors w-full px-1 relative z-10 leading-tight">
                                    {portal.label}
                                </h3>
                                <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-blue-400 to-yellow-400 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
                            </a>
                        ))}
                    </div>
                </div>
            </section>

            {/* ACCREDITATIONS SECTION */}
            <section className="py-12 bg-white border-t border-gray-100">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-10">
                        <span className="text-blue-600 font-bold tracking-wider uppercase text-sm bg-blue-50 px-4 py-1.5 rounded-full inline-block mb-3">Recognitions</span>
                        <h2 className="text-3xl font-bold text-gray-900 tracking-tight">University Accreditations</h2>
                        <div className="w-16 h-1 bg-gradient-to-r from-blue-600 to-yellow-400 mx-auto mt-4 rounded-full opacity-80"></div>
                    </div>

                    <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-80 hover:grayscale-0 transition-all duration-500">
                        <img src={aicte} alt="AICTE" className="h-14 md:h-16 object-contain hover:scale-110 transition-transform duration-300 filter drop-shadow-sm" title="All India Council for Technical Education" />
                        <img src={ugc} alt="UGC" className="h-14 md:h-16 object-contain hover:scale-110 transition-transform duration-300 filter drop-shadow-sm" title="University Grants Commission" />
                        <img src={nirf} alt="NIRF" className="h-12 md:h-14 object-contain hover:scale-110 transition-transform duration-300 filter drop-shadow-sm" title="National Institutional Ranking Framework" />
                        <img src={naac} alt="NAAC" className="h-14 md:h-16 object-contain hover:scale-110 transition-transform duration-300 filter drop-shadow-sm" title="National Assessment and Accreditation Council" />
                        <img src={apsche} alt="APSCHE" className="h-14 md:h-16 object-contain hover:scale-110 transition-transform duration-300 filter drop-shadow-sm" title="Andhra Pradesh State Council of Higher Education" />
                        <img src={mhrd} alt="MHRD" className="h-14 md:h-16 object-contain hover:scale-110 transition-transform duration-300 filter drop-shadow-sm" title="Ministry of Education (MHRD)" />
                        <img src={Samadhaan} alt="SAMADHAAN" className="h-14 md:h-16 object-contain hover:scale-110 transition-transform duration-300 filter drop-shadow-sm" title="UGC e-Samadhaan" />
                    </div>
                </div>
            </section>
        </div>
    );
};
export default Home;
