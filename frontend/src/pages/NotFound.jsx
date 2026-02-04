import { Link } from "react-router-dom";

const NotFound = () => {
    return (
        <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
            <h1 className="text-9xl font-extrabold text-gray-200">404</h1>
            <h2 className="text-3xl font-bold text-gray-900 mt-4">Page Not Found</h2>
            <p className="mt-4 text-gray-600 max-w-md mx-auto">
                The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
            </p>
            <Link
                to="/"
                className="mt-8 px-8 py-3 bg-black text-white font-semibold rounded-full hover:scale-105 transition-transform duration-200 shadow-lg"
            >
                Go Back Home
            </Link>
        </div>
    );
};

export default NotFound;
