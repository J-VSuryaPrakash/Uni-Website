import React from 'react';
import { Link } from 'react-router-dom';
import { useLiveScrolling } from '../../hooks/useLiveScrolling';

const Ticker = () => {
    const { data: notifications } = useLiveScrolling();

    // Don't render ticker if no live notifications
    if (!notifications || notifications.length === 0) {
        return null;
    }

    return (
        <div className="bg-blue-900 text-white relative z-30 shadow-md" style={{ borderBottom: '5px solid #F59E0B' }}>
            <div className="max-w-7xl mx-auto flex items-center h-10 md:h-12">
                {/* Left Label */}
                <div className="bg-red-600 h-full flex items-center px-3 md:px-4 font-bold text-xs md:text-sm tracking-wider uppercase shrink-0 transition-all">
                    <span className="hidden md:inline">Live Scrolling</span>
                    <span className="md:hidden">Updates</span>
                </div>

                {/* Marquee Content */}
                <div className="flex-1 overflow-hidden relative mx-2 md:mx-4">
                    <div className="animate-marquee whitespace-nowrap text-xs md:text-sm font-medium flex items-center">
                        {notifications.map((notif, index) => (
                            <React.Fragment key={notif.id}>
                                <span className="mx-4">{notif.title}</span>
                                {index < notifications.length - 1 && (
                                    <span className="mx-4 text-yellow-300">&#9733;</span>
                                )}
                            </React.Fragment>
                        ))}
                    </div>
                </div>

                {/* Right Button */}
                <Link to="/notifications" className="bg-yellow-500 text-blue-900 h-full flex items-center px-3 md:px-4 font-bold text-[10px] md:text-xs uppercase shrink-0 hover:bg-yellow-400 transition-colors">
                    <span className="hidden md:inline">New Updates</span>
                    <span className="md:hidden">More</span>
                </Link>
            </div>
        </div>
    );
};

export default Ticker;
