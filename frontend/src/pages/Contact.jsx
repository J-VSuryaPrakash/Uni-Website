import { useState } from "react";

const DUMMY_DATA = Array.from({ length: 50 }, (_, i) => ({
    id: i + 1,
    name: `User ${i + 1}`,
    email: `user${i + 1}@example.com`,
    role: i % 3 === 0 ? "Admin" : i % 3 === 1 ? "Editor" : "Viewer",
    status: i % 2 === 0 ? "Active" : "Inactive",
}));

const ITEMS_PER_PAGE = 10;

const Contact = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const totalPages = Math.ceil(DUMMY_DATA.length / ITEMS_PER_PAGE);

    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const currentData = DUMMY_DATA.slice(startIndex, startIndex + ITEMS_PER_PAGE);

    const handlePrev = () => {
        if (currentPage > 1) setCurrentPage((prev) => prev - 1);
    };

    const handleNext = () => {
        if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
    };

    return (
        <div className="min-h-screen pt-20 px-4 md:px-8 pb-10 bg-gray-50">
            <div className="max-w-6xl mx-auto">
                <h1 className="text-3xl font-bold text-gray-900 mb-6">Contact Directory</h1>

                {/* Table Container */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm text-gray-600">
                            <thead className="bg-gray-50 text-gray-900 font-semibold uppercase tracking-wider border-b border-gray-200">
                                <tr>
                                    <th className="px-6 py-4">ID</th>
                                    <th className="px-6 py-4">Name</th>
                                    <th className="px-6 py-4">Email</th>
                                    <th className="px-6 py-4">Role</th>
                                    <th className="px-6 py-4">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {currentData.map((item) => (
                                    <tr
                                        key={item.id}
                                        className="hover:bg-gray-50 transition-colors duration-150"
                                    >
                                        <td className="px-6 py-4 font-medium text-gray-900">#{item.id}</td>
                                        <td className="px-6 py-4">{item.name}</td>
                                        <td className="px-6 py-4">{item.email}</td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${item.role === 'Admin' ? 'bg-purple-100 text-purple-800' :
                                                    item.role === 'Editor' ? 'bg-blue-100 text-blue-800' :
                                                        'bg-gray-100 text-gray-800'
                                                }`}>
                                                {item.role}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ${item.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                                }`}>
                                                <span className={`w-1.5 h-1.5 rounded-full ${item.status === 'Active' ? 'bg-green-600' : 'bg-red-600'}`}></span>
                                                {item.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200 bg-gray-50">
                        <div className="text-sm text-gray-500">
                            Showing <span className="font-medium text-gray-900">{startIndex + 1}</span> to <span className="font-medium text-gray-900">{Math.min(startIndex + ITEMS_PER_PAGE, DUMMY_DATA.length)}</span> of <span className="font-medium text-gray-900">{DUMMY_DATA.length}</span> results
                        </div>

                        <div className="flex items-center gap-2">
                            <button
                                onClick={handlePrev}
                                disabled={currentPage === 1}
                                className="px-3 py-1.5 rounded-lg border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                Previous
                            </button>
                            <div className="hidden sm:flex items-center gap-1">
                                {Array.from({ length: totalPages }, (_, i) => (
                                    <button
                                        key={i + 1}
                                        onClick={() => setCurrentPage(i + 1)}
                                        className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors ${currentPage === i + 1
                                                ? "bg-black text-white"
                                                : "text-gray-600 hover:bg-gray-100"
                                            }`}
                                    >
                                        {i + 1}
                                    </button>
                                ))}
                            </div>
                            <button
                                onClick={handleNext}
                                disabled={currentPage === totalPages}
                                className="px-3 py-1.5 rounded-lg border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                Next
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Contact;
