import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { MENU_ITEMS } from '../Navbar/MenuItem';

const Breadcrumbs = () => {
    const location = useLocation();
    const { pathname } = location;

    // Don't show on home page
    if (pathname === '/') return null;

    const pathnames = pathname.split('/').filter((x) => x);

    // Helper to find label for a path
    const findLabel = (items, currentPath) => {
        for (const item of items) {
            if (item.path === currentPath) return item.label;
            if (item.children) {
                const found = findLabel(item.children, currentPath);
                if (found) return found;
            }
        }
        return null; // Fallback handled later
    };

    return (
        <div className="bg-blue-900 text-white py-3 px-4 shadow-md">
            <div className="max-w-7xl mx-auto flex items-center text-sm font-medium">
                <Link to="/" className="hover:text-yellow-400 transition-colors flex items-center gap-1">
                    Home
                </Link>
                {pathnames.map((name, index) => {
                    const routeTo = `/${pathnames.slice(0, index + 1).join('/')}`;
                    const isLast = index === pathnames.length - 1;

                    // Try to find a human-readable label from menu items, fallback to capitalizing path segment
                    const label = findLabel(MENU_ITEMS, routeTo) ||
                        decodeURIComponent(name).replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());

                    return (
                        <div key={name} className="flex items-center">
                            <span className="mx-2 text-gray-400">/</span>
                            {isLast ? (
                                <span className="text-white font-semibold">{label}</span>
                            ) : (
                                <Link to={routeTo} className="hover:text-yellow-400 transition-colors">
                                    {label}
                                </Link>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default Breadcrumbs;
