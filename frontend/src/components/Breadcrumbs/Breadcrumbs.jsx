import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { useMenuTree } from '../../hooks/useMenuTree';

const Breadcrumbs = () => {
    const location = useLocation();
    const { pathname } = location;
    const { data: menuTree } = useMenuTree();

    // Don't show on home page
    if (pathname === '/') return null;

    const pathnames = pathname.split('/').filter((x) => x);

    // Helper to find label for a path from dynamic menu tree
    const findLabel = (items, currentPath) => {
        if (!items) return null;
        for (const item of items) {
            if (item.path === currentPath) return item.label;
            if (item.children) {
                const found = findLabel(item.children, currentPath);
                if (found) return found;
            }
        }
        return null;
    };

    return (
        <div className="bg-gray-100 text-gray-600 py-3 px-4 shadow-inner border-b border-gray-200">
            <div className="max-w-7xl mx-auto flex items-center text-sm font-medium">
                <Link to="/" className="hover:text-blue-700 transition-colors flex items-center gap-1">
                    Home
                </Link>
                {pathnames.map((name, index) => {
                    const routeTo = `/${pathnames.slice(0, index + 1).join('/')}`;
                    const isLast = index === pathnames.length - 1;

                    // Try dynamic menu tree first, then fallback to capitalizing path segment
                    const label = findLabel(menuTree || [], routeTo) ||
                        decodeURIComponent(name).replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());

                    return (
                        <div key={name} className="flex items-center">
                            <span className="mx-2 text-gray-400">/</span>
                            {isLast ? (
                                <span className="text-blue-900 font-bold">{label}</span>
                            ) : (
                                <Link to={routeTo} className="hover:text-blue-700 transition-colors">
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
