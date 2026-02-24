import React, { useState } from 'react';
import { Bell, ChevronLeft, FileText, Paperclip, Search, X } from 'lucide-react';
import { useNotifications } from '../hooks/useNotifications';

// ─── Backend origin (strips /api/v1 from the API base URL) ────────────────────
// Stored URLs are relative paths like /uploads/notifications/file.pdf
// We need the backend origin to resolve them to full URLs.
const BACKEND_ORIGIN = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000/api/v1')
    .replace(/\/api\/v1\/?$/, '');

/** Turns a relative /uploads/... path into a full backend URL. */
const resolveUrl = (url) => {
    if (!url) return null;
    if (url.startsWith('http://') || url.startsWith('https://')) return url;
    return BACKEND_ORIGIN + url;
};

/** Force-downloads a file as a blob (works cross-origin). Falls back to new tab. */
const downloadFile = async (rawUrl, filename) => {
    const url = resolveUrl(rawUrl);
    if (!url) return;
    try {
        const res = await fetch(url);
        if (!res.ok) throw new Error('fetch failed');
        const blob = await res.blob();
        const objectUrl = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = objectUrl;
        a.download = filename || 'download';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(objectUrl);
    } catch {
        window.open(url, '_blank');
    }
};

// ─── Constants ────────────────────────────────────────────────────────────────

const TABS = [
    { label: 'All Notifications', key: 'all' },
    { label: 'Notifications & Circulars', key: 'notifications' },
    { label: 'Sports', key: 'sports' },
    { label: 'Workshops & Conferences', key: 'workshops' },
    { label: 'Examination Section', key: 'examination' },
    { label: 'Tenders', key: 'tenders' },
    { label: 'General', key: 'general' },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

const formatDate = (iso) => {
    if (!iso) return '—';
    return new Date(iso).toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
    });
};

const isNew = (createdAt) => {
    if (!createdAt) return false;
    const diff = Date.now() - new Date(createdAt).getTime();
    return diff < 7 * 24 * 60 * 60 * 1000;
};

const priorityBadge = (priority) => {
    if (priority === 0) return { label: 'High', cls: 'bg-red-100 text-red-700' };
    if (priority <= 5) return { label: 'Medium', cls: 'bg-amber-100 text-amber-700' };
    return null;
};

// ─── File Type Config ──────────────────────────────────────────────────────────

const TYPE_ICONS = {
    pdf:      <FileText className="w-4 h-4 shrink-0 text-red-500" />,
    image:    <FileText className="w-4 h-4 shrink-0 text-blue-500" />,
    document: <FileText className="w-4 h-4 shrink-0 text-indigo-500" />,
    video:    <FileText className="w-4 h-4 shrink-0 text-purple-500" />,
    audio:    <FileText className="w-4 h-4 shrink-0 text-pink-500" />,
};

// Types that can be previewed in the viewer modal
const PREVIEWABLE = ['pdf', 'image', 'video', 'audio'];

// ─── Skeleton ─────────────────────────────────────────────────────────────────

const RowSkeleton = () => (
    <tr className="animate-pulse border-b border-gray-100">
        <td className="px-5 py-4"><div className="h-3 w-6 bg-gray-200 rounded" /></td>
        <td className="px-5 py-4"><div className="h-3 w-20 bg-gray-200 rounded" /></td>
        <td className="px-5 py-4">
            <div className="h-3 w-3/4 bg-gray-200 rounded mb-1" />
            <div className="h-2 w-1/2 bg-gray-100 rounded" />
        </td>
        <td className="px-5 py-4"><div className="h-3 w-20 bg-gray-200 rounded" /></td>
        <td className="px-5 py-4"><div className="h-3 w-12 bg-gray-200 rounded" /></td>
    </tr>
);

// ─── Main Component ────────────────────────────────────────────────────────────

const NotificationsPage = () => {
    const [activeTab, setActiveTab] = useState('all');
    const [search, setSearch] = useState('');
    // null | { title: string, attachments: Attachment[] }
    const [attachmentModal, setAttachmentModal] = useState(null);
    // null | single attachment object
    const [viewerAttachment, setViewerAttachment] = useState(null);

    const { data: notifications, isLoading, isError } = useNotifications(activeTab);

    const filtered = React.useMemo(() => {
        if (!notifications) return [];
        if (!search.trim()) return notifications;
        const q = search.toLowerCase();
        return notifications.filter(
            (n) =>
                n.title.toLowerCase().includes(q) ||
                (n.department?.name ?? '').toLowerCase().includes(q),
        );
    }, [notifications, search]);

    const openAttachments = (item) => {
        setViewerAttachment(null);
        setAttachmentModal({ title: item.title, attachments: item.attachments });
    };

    const closeAll = () => {
        setViewerAttachment(null);
        setAttachmentModal(null);
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Page Hero */}
            <div className="bg-blue-900 text-white py-10">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="flex items-center gap-3 mb-2">
                        <Bell className="w-6 h-6 text-yellow-400" />
                        <span className="text-blue-300 text-sm font-semibold uppercase tracking-widest">
                            University Updates
                        </span>
                    </div>
                    <h1 className="text-3xl md:text-4xl font-bold">Notification Center</h1>
                    <p className="text-blue-200 mt-2 text-sm">
                        Stay informed with the latest circulars, tenders, and academic notifications.
                    </p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 py-10 space-y-6">
                {/* Search bar */}
                <div className="relative max-w-md">
                    <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search notifications..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-9 pr-8 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition"
                    />
                    {search && (
                        <button
                            onClick={() => setSearch('')}
                            className="absolute right-2.5 top-2.5 text-gray-400 hover:text-gray-600"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    )}
                </div>

                {/* Main card */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    {/* Tab headers */}
                    <div className="flex border-b border-gray-100 overflow-x-auto">
                        {TABS.map((tab) => (
                            <button
                                key={tab.key}
                                onClick={() => {
                                    setActiveTab(tab.key);
                                    setSearch('');
                                }}
                                className={`px-5 py-4 text-sm font-semibold whitespace-nowrap transition-colors border-b-2 flex-shrink-0 ${
                                    activeTab === tab.key
                                        ? 'border-blue-600 text-blue-700 bg-blue-50/50'
                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                                }`}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    {/* Content */}
                    <div className="overflow-x-auto">
                        {isLoading ? (
                            <table className="w-full text-sm text-left">
                                <thead className="bg-gray-50 text-gray-500 text-xs font-semibold uppercase">
                                    <tr>
                                        <th className="px-5 py-3">S.No</th>
                                        <th className="px-5 py-3">Date</th>
                                        <th className="px-5 py-3">Notification</th>
                                        {activeTab === 'all' && <th className="px-5 py-3">Category</th>}
                                        <th className="px-5 py-3">Department</th>
                                        <th className="px-5 py-3">Attachment</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {Array.from({ length: 6 }).map((_, i) => (
                                        <RowSkeleton key={i} />
                                    ))}
                                </tbody>
                            </table>
                        ) : isError ? (
                            <div className="flex flex-col items-center justify-center py-16 text-gray-400">
                                <Bell className="w-10 h-10 mb-3 opacity-30" />
                                <p className="font-medium text-gray-500">
                                    Could not load notifications.
                                </p>
                                <p className="text-sm mt-1">Please try again later.</p>
                            </div>
                        ) : filtered.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-16 text-gray-400">
                                <Bell className="w-10 h-10 mb-3 opacity-30" />
                                <p className="font-medium text-gray-500">
                                    {search
                                        ? 'No notifications match your search.'
                                        : 'No notifications in this category yet.'}
                                </p>
                            </div>
                        ) : (
                            <table className="w-full text-sm text-left">
                                <thead className="bg-gray-50 text-gray-500 text-xs font-semibold uppercase">
                                    <tr>
                                        <th className="px-5 py-3 rounded-tl-lg">S.No</th>
                                        <th className="px-5 py-3">Date</th>
                                        <th className="px-5 py-3 w-1/2">Notification</th>
                                        {activeTab === 'all' && <th className="px-5 py-3">Category</th>}
                                        <th className="px-5 py-3">Department</th>
                                        <th className="px-5 py-3 rounded-tr-lg">Attachment</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {filtered.map((item, index) => {
                                        const badge = priorityBadge(item.priority);
                                        const fresh = isNew(item.createdAt);
                                        const hasAttachments = item.attachments?.length > 0;

                                        return (
                                            <tr
                                                key={item.id}
                                                className="hover:bg-blue-50/30 transition-colors group"
                                            >
                                                {/* S.No */}
                                                <td className="px-5 py-4 text-gray-400 font-medium text-xs">
                                                    {index + 1}.
                                                </td>

                                                {/* Date */}
                                                <td className="px-5 py-4 text-blue-700 font-semibold whitespace-nowrap text-xs">
                                                    {formatDate(item.createdAt)}
                                                </td>

                                                {/* Title */}
                                                <td className="px-5 py-4">
                                                    <div className="flex items-start gap-2">
                                                        <span className="text-gray-800 font-medium group-hover:text-blue-700 transition-colors leading-snug">
                                                            {item.title}
                                                        </span>
                                                        <div className="flex items-center gap-1 shrink-0 mt-0.5">
                                                            {fresh && (
                                                                <span className="inline-flex px-1.5 py-0.5 rounded text-[9px] font-bold bg-red-100 text-red-700 animate-pulse uppercase">
                                                                    New
                                                                </span>
                                                            )}
                                                            {badge && (
                                                                <span
                                                                    className={`inline-flex px-1.5 py-0.5 rounded text-[9px] font-bold uppercase ${badge.cls}`}
                                                                >
                                                                    {badge.label}
                                                                </span>
                                                            )}
                                                            {item.isScrolling && (
                                                                <span className="inline-flex px-1.5 py-0.5 rounded text-[9px] font-bold bg-blue-100 text-blue-700 uppercase">
                                                                    Live
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                    {(item.startsAt || item.endsAt) && (
                                                        <p className="text-xs text-gray-400 mt-1">
                                                            Valid:{' '}
                                                            {formatDate(item.startsAt)} →{' '}
                                                            {formatDate(item.endsAt)}
                                                        </p>
                                                    )}
                                                </td>

                                                {/* Category (All tab only) */}
                                                {activeTab === 'all' && (
                                                    <td className="px-5 py-4 text-gray-500 text-xs whitespace-nowrap">
                                                        {item.category
                                                            ? TABS.find((t) => t.key === item.category)?.label ?? item.category
                                                            : <span className="text-gray-300">—</span>}
                                                    </td>
                                                )}

                                                {/* Department */}
                                                <td className="px-5 py-4 text-gray-500 text-xs whitespace-nowrap">
                                                    {item.department?.name || '—'}
                                                </td>

                                                {/* Attachments */}
                                                <td className="px-5 py-4">
                                                    {hasAttachments ? (
                                                        <button
                                                            onClick={() => openAttachments(item)}
                                                            className="inline-flex items-center gap-1.5 text-blue-600 hover:text-blue-800 transition-colors group/att"
                                                            title={`${item.attachments.length} attachment${item.attachments.length !== 1 ? 's' : ''}`}
                                                        >
                                                            <Paperclip className="w-4 h-4" />
                                                            <span className="text-xs font-bold bg-blue-100 text-blue-700 group-hover/att:bg-blue-200 px-1.5 py-0.5 rounded-full transition-colors">
                                                                {item.attachments.length}
                                                            </span>
                                                        </button>
                                                    ) : (
                                                        <span className="text-gray-300 text-xs">—</span>
                                                    )}
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        )}
                    </div>

                    {/* Footer count */}
                    {!isLoading && !isError && filtered.length > 0 && (
                        <div className="px-5 py-3 bg-gray-50 border-t border-gray-100 text-xs text-gray-400">
                            Showing {filtered.length} notification{filtered.length !== 1 ? 's' : ''}
                            {search && ` matching "${search}"`}
                        </div>
                    )}
                </div>
            </div>

            {/* Attachment List Modal */}
            {attachmentModal && !viewerAttachment && (
                <AttachmentListModal
                    data={attachmentModal}
                    onView={(att) => setViewerAttachment(att)}
                    onClose={closeAll}
                />
            )}

            {/* File Viewer Modal */}
            {viewerAttachment && (
                <FileViewerModal
                    attachment={viewerAttachment}
                    onBack={() => setViewerAttachment(null)}
                    onClose={closeAll}
                />
            )}
        </div>
    );
};

// ─── Attachment List Modal ─────────────────────────────────────────────────────

const AttachmentListModal = ({ data, onView, onClose }) => (
    <div
        className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
        onClick={onClose}
    >
        <div
            className="bg-white rounded-2xl shadow-xl w-full max-w-md"
            onClick={(e) => e.stopPropagation()}
        >
            {/* Header */}
            <div className="flex items-start justify-between p-5 border-b border-gray-100">
                <div className="min-w-0 pr-4">
                    <p className="text-xs text-blue-600 font-semibold uppercase tracking-widest mb-1">
                        {data.attachments.length} Attachment{data.attachments.length !== 1 ? 's' : ''}
                    </p>
                    <h2 className="text-sm font-semibold text-gray-800 leading-snug">{data.title}</h2>
                </div>
                <button
                    onClick={onClose}
                    className="text-gray-400 hover:text-gray-600 transition-colors shrink-0 mt-0.5"
                >
                    <X className="w-5 h-5" />
                </button>
            </div>

            {/* Attachment list */}
            <ul className="p-4 space-y-2 max-h-80 overflow-y-auto">
                {data.attachments.map((att) => {
                    const type = att.media?.type;
                    const icon = TYPE_ICONS[type] ?? <FileText className="w-4 h-4 shrink-0 text-gray-400" />;
                    const canPreview = PREVIEWABLE.includes(type);

                    return (
                        <li
                            key={att.id}
                            className="flex items-center gap-3 p-3 rounded-xl border border-gray-100 hover:bg-gray-50 transition-colors"
                        >
                            <div className="p-2 bg-gray-100 rounded-lg shrink-0">{icon}</div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-gray-800 truncate">{att.title}</p>
                                <p className="text-xs text-gray-400 uppercase mt-0.5">{type || 'File'}</p>
                            </div>
                            <div className="flex items-center gap-1 shrink-0">
                                {canPreview && (
                                    <button
                                        onClick={() => onView(att)}
                                        className="text-xs font-semibold text-blue-600 hover:text-blue-800 transition-colors px-2.5 py-1.5 rounded-lg hover:bg-blue-50"
                                    >
                                        View
                                    </button>
                                )}
                                <button
                                    onClick={() => downloadFile(att.media?.url, att.title)}
                                    className="text-xs font-semibold text-gray-500 hover:text-gray-700 transition-colors px-2.5 py-1.5 rounded-lg hover:bg-gray-100"
                                >
                                    Download
                                </button>
                            </div>
                        </li>
                    );
                })}
            </ul>
        </div>
    </div>
);

// ─── File Viewer Modal ─────────────────────────────────────────────────────────

const FileViewerModal = ({ attachment, onBack, onClose }) => {
    const type = attachment.media?.type;
    const rawUrl = attachment.media?.url;
    const url = resolveUrl(rawUrl);

    return (
        <div className="fixed inset-0 z-50 bg-black/90 flex flex-col">
            {/* Header bar */}
            <div className="flex items-center gap-3 px-5 py-3 bg-white/10 backdrop-blur-sm shrink-0">
                <button
                    onClick={onBack}
                    className="text-white/70 hover:text-white transition-colors flex items-center gap-1 text-sm"
                >
                    <ChevronLeft className="w-4 h-4" />
                    <span>Back</span>
                </button>
                <span className="flex-1 text-white text-sm font-medium truncate">{attachment.title}</span>
                <button
                    onClick={() => downloadFile(rawUrl, attachment.title)}
                    className="text-white/70 hover:text-white text-xs font-medium px-3 py-1.5 rounded-lg border border-white/20 hover:border-white/50 transition-colors"
                >
                    Download
                </button>
                <button
                    onClick={onClose}
                    className="text-white/70 hover:text-white transition-colors ml-1"
                >
                    <X className="w-5 h-5" />
                </button>
            </div>

            {/* Viewer area */}
            <div className="flex-1 overflow-auto p-4 flex items-center justify-center">
                {type === 'pdf' && (
                    <iframe
                        src={url}
                        className="w-full h-full min-h-[75vh] rounded-lg bg-white"
                        title={attachment.title}
                    />
                )}
                {type === 'image' && (
                    <img
                        src={url}
                        alt={attachment.title}
                        className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
                    />
                )}
                {type === 'video' && (
                    <video
                        src={url}
                        controls
                        className="max-w-full max-h-full rounded-lg shadow-2xl"
                    />
                )}
                {type === 'audio' && (
                    <div className="text-center">
                        <FileText className="w-16 h-16 text-white/30 mx-auto mb-6" />
                        <p className="text-white/60 text-sm mb-4">{attachment.title}</p>
                        <audio src={url} controls className="mx-auto" />
                    </div>
                )}
                {(!type || type === 'document') && (
                    <div className="text-center">
                        <FileText className="w-16 h-16 text-white/30 mx-auto mb-6" />
                        <p className="text-white/60 text-sm mb-2">
                            Preview not available for this file type.
                        </p>
                        <button
                            onClick={() => downloadFile(rawUrl, attachment.title)}
                            className="inline-flex items-center gap-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 px-5 py-2.5 rounded-lg transition-colors mt-2"
                        >
                            Download File
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default NotificationsPage;
