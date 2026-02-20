import React from 'react';
import { useLocation } from 'react-router-dom';
import { usePage } from '../hooks/usePage';
import { useMenuTree } from '../hooks/useMenuTree';
import SidebarLayout from '../components/Layout/SidebarLayout';
import SectionRenderer from '../components/sections/SectionRenderer';
import { PageSkeleton } from '../components/common/Skeleton';
import ErrorFallback from '../components/common/ErrorFallback';

const DynamicPage = () => {
    const location = useLocation();
    // Remove leading slash to get the slug
    const slug = location.pathname.slice(1);

    const { data: page, isLoading, error, refetch } = usePage(slug);
    const { data: menuTree } = useMenuTree();

    // Find which menu section this page belongs to
    const currentMenu = findMenuForSlug(menuTree, slug);
    const sidebarItems = currentMenu?.children || [];
    const sectionTitle = currentMenu?.label || '';

    if (isLoading) {
        return (
            <SidebarLayout title={sectionTitle} menuItems={sidebarItems}>
                <PageSkeleton />
            </SidebarLayout>
        );
    }

    if (error) {
        return (
            <SidebarLayout title={sectionTitle} menuItems={sidebarItems}>
                <ErrorFallback error={error} onRetry={refetch} />
            </SidebarLayout>
        );
    }

    if (!page) {
        return (
            <SidebarLayout title={sectionTitle} menuItems={sidebarItems}>
                <ErrorFallback error={{ response: { status: 404 } }} />
            </SidebarLayout>
        );
    }

    const sections = page.sections || [];
    const hasContent = sections.some(s => s.contentBlocks && s.contentBlocks.length > 0);

    return (
        <SidebarLayout title={sectionTitle} menuItems={sidebarItems}>
            <div className="py-2">
                <h1 className="text-3xl font-bold text-gray-800 mb-6">{page.title}</h1>

                {hasContent ? (
                    sections.map((section) => (
                        <SectionRenderer key={section.id} section={section} />
                    ))
                ) : (
                    <div className="prose max-w-none text-gray-600">
                        <p className="text-lg">This is the {page.title} page.</p>
                        <p className="mt-4">Content will be populated here.</p>
                    </div>
                )}

                {/* Child pages listing */}
                {page.children && page.children.length > 0 && (
                    <div className="mt-8 pt-6 border-t border-gray-200">
                        <h3 className="text-lg font-bold text-gray-800 mb-3">Related Pages</h3>
                        <ul className="space-y-2">
                            {page.children.map((child) => (
                                <li key={child.slug}>
                                    <a
                                        href={`/${child.slug}`}
                                        className="text-blue-700 hover:text-blue-900 font-medium hover:underline"
                                    >
                                        {child.title}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
        </SidebarLayout>
    );
};

// Find which top-level menu a slug belongs to
function findMenuForSlug(menuTree, slug) {
    if (!menuTree || !slug) return null;

    for (const menu of menuTree) {
        if (findInChildren(menu.children, slug)) {
            return menu;
        }
    }

    return null;
}

function findInChildren(children, slug) {
    if (!children) return false;

    for (const child of children) {
        // Compare removing leading slash
        const childSlug = child.path?.replace(/^\//, '');
        if (childSlug === slug) return true;
        if (child.children && findInChildren(child.children, slug)) return true;
    }

    return false;
}

export default DynamicPage;
