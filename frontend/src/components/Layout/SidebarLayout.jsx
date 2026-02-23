import React, { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';

// ... (SidebarLayout remains mostly the same, ensuring imports are correct)

const SidebarLayout = ({ title, menuItems, children }) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const location = useLocation();

    // Close sidebar on route change (mobile)
    useEffect(() => {
        setIsSidebarOpen(false);
    }, [location.pathname]);

    return (
        <div className="container mx-auto px-4 py-8">
            {/* Mobile Sidebar Toggle */}
            <div className="lg:hidden mb-6">
                <button
                    onClick={() => setIsSidebarOpen(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-900 text-white rounded-lg shadow-md hover:bg-blue-800 transition-colors w-full justify-between"
                >
                    <span className="font-semibold">Menu</span>
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                </button>
            </div>

            <div className="flex flex-col lg:flex-row gap-8 relative">

                {/* Mobile Backdrop */}
                {isSidebarOpen && (
                    <div
                        className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm transition-opacity"
                        onClick={() => setIsSidebarOpen(false)}
                    ></div>
                )}

                {/* Left Sidebar */}
                <aside
                    className={`
                        fixed inset-y-0 left-0 z-40 w-3/4 max-w-xs bg-white shadow-2xl transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:z-auto lg:w-1/4 lg:shadow-none lg:bg-transparent
                        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
                    `}
                >
                    <div className="h-full overflow-y-auto p-6 lg:p-0 lg:sticky lg:top-24 lg:max-h-[calc(100vh-8rem)]">
                        {/* Mobile Header */}
                        <div className="flex items-center justify-between mb-6 lg:hidden">
                            <h3 className="text-xl font-bold text-blue-900">Menu</h3>
                            <button
                                onClick={() => setIsSidebarOpen(false)}
                                className="p-2 text-gray-500 hover:text-red-600 transition-colors"
                            >
                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        {title && (
                            <h3 className="text-xl font-bold text-gray-900 mb-6 pl-2 hidden lg:block">
                                {title}
                            </h3>
                        )}

                        <nav className="flex flex-col space-y-3">
                            {menuItems.map((item, index) => (
                                <SidebarItem key={index} item={item} />
                            ))}
                        </nav>
                    </div>
                </aside>

                {/* Right Content Area */}
                <main className="w-full lg:w-3/4">
                    <div className="bg-white rounded-lg shadow-sm p-6 md:p-8 min-h-[500px] border border-gray-100">
                        {children}
                    </div>
                </main>

            </div>
        </div>
    );
};

const SidebarItem = ({ item }) => {
    const location = useLocation();
    const hasChildren = item.children && item.children.length > 0;
    const [isOpen, setIsOpen] = useState(item.alwaysOpen || false);

    // Auto-expand if a child is active
    useEffect(() => {
        if (hasChildren) {
            const isChildActive = (children) => {
                return children.some(child =>
                    child.path === location.pathname ||
                    (child.children && isChildActive(child.children))
                );
            };
            if (isChildActive(item.children)) {
                setIsOpen(true);
            }
        }
    }, [location.pathname, item.children, hasChildren, item.alwaysOpen]);

    const toggleOpen = (e) => {
        if (item.alwaysOpen) return;
        e.preventDefault();
        setIsOpen(!isOpen);
    };

    if (hasChildren) {
        return (
            <div className="space-y-2">
                <div
                    onClick={toggleOpen}
                    className={`flex items-center gap-3 text-sm font-bold text-gray-800 px-2 transition-colors ${item.alwaysOpen ? 'cursor-default' : 'cursor-pointer hover:text-blue-700'}`}
                >
                    {!item.alwaysOpen && <span className={`w-2 h-2 rounded-full bg-green-500 shrink-0`}></span>}

                    <span className={`flex-1 ${item.alwaysOpen ? 'text-lg text-blue-900 border-b border-gray-200 pb-1 mb-1 mt-2' : ''}`}>{item.label}</span>

                    {!item.alwaysOpen && (
                        <svg
                            className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-90' : ''}`}
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    )}
                </div>

                {(isOpen || item.alwaysOpen) && (
                    <div className={`${item.alwaysOpen ? 'ml-0' : 'ml-5 border-l border-gray-200 pl-3'} space-y-2 animate-fadeIn`}>
                        {item.children.map((child, index) => (
                            <SidebarItem key={index} item={child} />
                        ))}
                    </div>
                )}
            </div>
        );
    }

    return (
        <NavLink
            to={item.path}
            end
            className={({ isActive }) =>
                `flex items-center gap-3 px-2 py-1 text-sm font-semibold transition-colors duration-200 group ${isActive ? 'text-blue-900' : 'text-gray-800 hover:text-blue-700'
                }`
            }
        >
            {({ isActive }) => (
                <>
                    <span className={`w-2 h-2 rounded-full shrink-0 transition-colors ${isActive ? 'bg-green-500' : 'bg-green-500 group-hover:bg-green-600'}`}></span>
                    <span className="flex-1">{item.label}</span>
                    {/* Arrow removed for leaf items */}
                </>
            )}
        </NavLink>
    );
};

export default SidebarLayout;
