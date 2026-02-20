import React from 'react';

export const SkeletonLine = ({ className = "" }) => (
    <div className={`animate-pulse bg-gray-200 rounded h-4 ${className}`} />
);

export const SkeletonBlock = ({ className = "" }) => (
    <div className={`animate-pulse bg-gray-200 rounded ${className}`} />
);

export const SkeletonText = ({ lines = 3, className = "" }) => (
    <div className={`space-y-3 ${className}`}>
        {Array.from({ length: lines }).map((_, i) => (
            <SkeletonLine key={i} className={i === lines - 1 ? "w-2/3" : "w-full"} />
        ))}
    </div>
);

export const PageSkeleton = () => (
    <div className="py-2 space-y-6">
        <SkeletonBlock className="h-8 w-1/2" />
        <SkeletonText lines={4} />
        <SkeletonBlock className="h-48 w-full" />
        <SkeletonText lines={3} />
    </div>
);

export const NavbarSkeleton = () => (
    <div className="flex gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
            <SkeletonBlock key={i} className="h-5 w-24" />
        ))}
    </div>
);

export const TableSkeleton = ({ rows = 5 }) => (
    <div className="space-y-3 p-4">
        {Array.from({ length: rows }).map((_, i) => (
            <div key={i} className="flex gap-4">
                <SkeletonBlock className="h-5 w-16" />
                <SkeletonBlock className="h-5 w-24" />
                <SkeletonBlock className="h-5 flex-1" />
                <SkeletonBlock className="h-5 w-32" />
            </div>
        ))}
    </div>
);
