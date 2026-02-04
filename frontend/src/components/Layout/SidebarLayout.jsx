import React from 'react';
import { NavLink } from 'react-router-dom';

/**
 * SidebarLayout Component
 * 
 * @param {string} title - The title of the current page section.
 * @param {Array} menuItems - List of submenu items.
 * @param {React.ReactNode} children - The main content of the page.
 */
const SidebarLayout = ({ title, menuItems, children }) => {
    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex flex-col lg:flex-row gap-8">

                {/* Left Sidebar */}
                <aside className="w-full lg:w-1/4">
                    <div className="bg-white rounded-lg shadow-md p-6 sticky top-24 max-h-[calc(100vh-8rem)] overflow-y-auto">
                        <h3 className="text-xl font-bold text-gray-800 mb-6 border-b pb-2">
                            {title}
                        </h3>
                        <nav className="flex flex-col space-y-2">
                            {menuItems.map((item, index) => (
                                <SidebarItem key={index} item={item} />
                            ))}
                        </nav>
                    </div>
                </aside>

                {/* Right Content Area */}
                <main className="w-full lg:w-3/4">
                    <div className="bg-white rounded-lg shadow-md p-8 min-h-[500px]">
                        {children}
                    </div>
                </main>

            </div>
        </div>
    );
};

const SidebarItem = ({ item }) => {
    const hasChildren = item.children && item.children.length > 0;

    if (hasChildren) {
        return (
            <div className="space-y-1 mt-2 mb-2">
                <div className="px-4 py-1 text-xs font-bold text-gray-500 uppercase tracking-wider">
                    {item.label}
                </div>
                <div className="ml-2 border-l-2 border-gray-100 pl-2 space-y-1">
                    {item.children.map((child, index) => (
                        <SidebarItem key={index} item={child} />
                    ))}
                </div>
            </div>
        );
    }

    // If path is empty (like a header without children that shouldn't be clicked), disable or style differently?
    // Assuming all leaf nodes have paths.
    if (!item.path) {
        return (
            <div className="px-4 py-2 text-sm font-medium text-gray-500">
                {item.label}
            </div>
        );
    }

    return (
        <NavLink
            to={item.path}
            end={item.exact}
            className={({ isActive }) =>
                `block px-4 py-2 rounded-md transition-colors duration-200 text-sm font-medium ${isActive
                    ? "bg-blue-600 text-white shadow-sm"
                    : "text-gray-700 hover:bg-gray-100 hover:text-blue-600"
                }`
            }
        >
            {item.label}
        </NavLink>
    );
};

export default SidebarLayout;
