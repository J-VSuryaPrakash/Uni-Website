import React from 'react';
import { Link } from 'react-router-dom';

const ErrorFallback = ({ error, onRetry }) => {
    const is404 = error?.response?.status === 404 || error?.status === 404;

    if (is404) {
        return (
            <div className="min-h-[50vh] flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-8xl font-bold text-gray-200 mb-4">404</h1>
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">Page Not Found</h2>
                    <p className="text-gray-500 mb-6">The page you're looking for doesn't exist or hasn't been published yet.</p>
                    <Link
                        to="/"
                        className="inline-block px-6 py-3 bg-blue-900 text-white rounded-lg font-semibold hover:bg-blue-800 transition-colors"
                    >
                        Go Back Home
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-[50vh] flex items-center justify-center">
            <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Something went wrong</h2>
                <p className="text-gray-500 mb-6">We couldn't load this page. Please try again.</p>
                {onRetry && (
                    <button
                        onClick={onRetry}
                        className="inline-block px-6 py-3 bg-blue-900 text-white rounded-lg font-semibold hover:bg-blue-800 transition-colors"
                    >
                        Try Again
                    </button>
                )}
            </div>
        </div>
    );
};

export default ErrorFallback;
