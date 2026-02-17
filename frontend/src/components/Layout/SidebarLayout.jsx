import React, { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';

// ... (SidebarLayout remains mostly the same, ensuring imports are correct)

const SidebarLayout = ({ title, menuItems, children }) => {
    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex flex-col lg:flex-row gap-8">

                {/* Left Sidebar */}
                <aside className="w-full lg:w-1/4">
                    <div className="sticky top-24 max-h-[calc(100vh-8rem)] overflow-y-auto pl-2">
                        <h3 className="text-xl font-bold text-gray-900 mb-6 pl-2">
                            {title}
                        </h3>
                        <nav className="flex flex-col space-y-3">
                            {menuItems.map((item, index) => (
                                <SidebarItem key={index} item={item} />
                            ))}
                        </nav>
                    </div>
                </aside>

                {/* Right Content Area */}
                <main className="w-full lg:w-3/4">
                    <div className="bg-white rounded-lg shadow-sm p-8 min-h-[500px] border border-gray-100">
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
    const [isOpen, setIsOpen] = useState(false);

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
    }, [location.pathname, item.children, hasChildren]);

    const toggleOpen = (e) => {
        e.preventDefault();
        setIsOpen(!isOpen);
    };

    if (hasChildren) {
        return (
            <div className="space-y-2">
                <div
                    onClick={toggleOpen}
                    className="flex items-center gap-3 text-sm font-bold text-gray-800 px-2 cursor-pointer hover:text-blue-700 transition-colors"
                >
                    <span className={`w-2 h-2 rounded-full bg-green-500 shrink-0`}></span>
                    <span className="flex-1">{item.label}</span>
                    <svg
                        className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-90' : ''}`}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                </div>

                {isOpen && (
                    <div className="ml-5 border-l border-gray-200 pl-3 space-y-2 animate-fadeIn">
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
