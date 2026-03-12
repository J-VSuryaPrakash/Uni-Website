import React from 'react';
import FacultyCard from '../common/FacultyCard';

const BACKEND_ORIGIN = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000/api/v1')
    .replace(/\/api\/v1\/?$/, '');

const resolveUrl = (url) => {
    if (!url) return null;
    if (url.startsWith('http://') || url.startsWith('https://')) return url;
    return BACKEND_ORIGIN + url;
};

const TextBlock = ({ content }) => (
    <div className="prose max-w-none text-gray-700 leading-relaxed">
        {content.heading && (
            <h3 className="text-xl font-bold text-gray-800 mb-3">{content.heading}</h3>
        )}
        {content.text && content.text.split('\n').map((paragraph, i) => (
            paragraph.trim() && <p key={i} className="mb-3">{paragraph}</p>
        ))}
    </div>
);

const ImageBlock = ({ content }) => (
    <figure className="my-4">
        <img
            src={resolveUrl(content.url || content.imageUrl)}
            alt={content.alt || content.caption || ''}
            className="w-full max-w-2xl rounded-lg shadow-sm border border-gray-100"
            loading="lazy"
        />
        {content.caption && (
            <figcaption className="mt-2 text-sm text-gray-500 text-center italic">
                {content.caption}
            </figcaption>
        )}
    </figure>
);

const ListBlock = ({ content }) => {
    const items = Array.isArray(content.items) ? content.items : [];
    const isOrdered = content.ordered === true;
    const Tag = isOrdered ? 'ol' : 'ul';

    return (
        <div className="my-4">
            {content.heading && (
                <h3 className="text-lg font-bold text-gray-800 mb-2">{content.heading}</h3>
            )}
            <Tag className={`${isOrdered ? 'list-decimal' : 'list-disc'} pl-6 space-y-1 text-gray-700`}>
                {items.map((item, i) => (
                    <li key={i}>{item}</li>
                ))}
            </Tag>
        </div>
    );
};

const HtmlBlock = ({ content }) => (
    <div
        className="prose max-w-none my-4"
        dangerouslySetInnerHTML={{ __html: content.html || content.text || '' }}
    />
);

const TableBlock = ({ content }) => {
    const headers = content.headers || [];
    const rows = content.rows || [];

    return (
        <div className="my-6">
            {content.heading && (
                <h3 className="text-lg font-bold text-gray-800 mb-3">{content.heading}</h3>
            )}
            <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
                <table className="w-full text-sm text-left">
                    {headers.length > 0 && (
                        <thead>
                            <tr className="bg-blue-900 text-white">
                                <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide border-r border-blue-800/40 last:border-r-0 whitespace-nowrap">Sl.no</th>
                                {headers.map((header, i) => (
                                    <th key={i} className="px-5 py-3 text-xs font-semibold uppercase tracking-wide border-r border-blue-800/40 last:border-r-0 whitespace-nowrap">{header}</th>
                                ))}
                            </tr>
                        </thead>
                    )}
                    <tbody className="divide-y divide-gray-100">
                        {rows.map((row, i) => (
                            <tr key={i} className={`hover:bg-blue-50/40 transition-colors ${i % 2 === 1 ? 'bg-gray-50/60' : 'bg-white'}`}>
                                <td className="px-5 py-3 text-gray-400 font-medium text-xs whitespace-nowrap">{i + 1}</td>
                                {(Array.isArray(row) ? row : Object.values(row)).map((cell, j) => (
                                    <td key={j} className="px-5 py-3 text-black text-sm">{cell}</td>
                                ))}
                            </tr>
                        ))}
                        {rows.length === 0 && (
                            <tr>
                                <td colSpan={headers.length + 1} className="px-5 py-8 text-center text-gray-400 text-sm">
                                    No data available.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

const PdfBlock = ({ content }) => {
    const pdfUrl = resolveUrl(content.url);

    return (
        <div className="my-4">
            {(content.heading || content.title) && (
                <h3 className="text-lg font-bold text-gray-800 mb-3">
                    {content.heading || content.title}
                </h3>
            )}
            <iframe
                src={pdfUrl}
                title={content.title || content.heading || 'PDF Document'}
                className="w-full h-[700px] rounded-lg border border-gray-200"
            />
            <div className="mt-3">
                <a
                    href={pdfUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    download
                    className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors font-medium text-sm"
                >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    {content.title ? `Download ${content.title}` : 'Download PDF'}
                </a>
            </div>
        </div>
    );
};

const MembersBlock = ({ content }) => {
    const members = Array.isArray(content.members) ? content.members : [];

    if (members.length === 0) return null;

    return (
        <div className="my-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            {members.map((member, i) => {
                const photoUrl = resolveUrl(member.photo);
                const hasContact = member.email || member.phone;

                return (
                    <div
                        key={i}
                        className="bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200 flex overflow-hidden"
                        style={{ borderRadius: '4px' }}
                    >
                        {/* Photo */}
                        <div className="shrink-0 w-36 bg-gray-50 border-r border-gray-200 self-stretch">
                            {photoUrl ? (
                                <img
                                    src={photoUrl}
                                    alt={member.name}
                                    className="w-full h-full object-cover object-top"
                                />
                            ) : (
                                <div className="w-full h-full min-h-44 bg-gray-100 flex items-center justify-center">
                                    <svg className="h-14 w-14 text-gray-300" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z" />
                                    </svg>
                                </div>
                            )}
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0 px-4 py-4 flex flex-col gap-1.5">
                            {/* Role badge */}
                            <span className="inline-block self-start text-xs font-semibold text-white bg-blue-700 px-2 py-0.5 rounded">
                                {member.role}
                            </span>

                            {/* Name */}
                            <h3 className="text-sm font-bold text-gray-900 leading-snug">
                                {member.name}
                            </h3>

                            {/* Designation */}
                            {member.designation && (
                                <p className="text-xs text-blue-800 font-medium leading-snug">
                                    {member.designation}
                                </p>
                            )}

                            {/* Department */}
                            {member.department && (
                                <p className="text-xs text-gray-600 leading-snug">
                                    {member.department}
                                </p>
                            )}

                            {/* Contact */}
                            {hasContact && (
                                <div className="flex flex-col gap-1 border-t border-gray-100 pt-1.5 mt-0.5">
                                    {member.email && (
                                        <a
                                            href={`mailto:${member.email}`}
                                            className="flex items-center gap-1.5 text-xs text-gray-600 hover:text-blue-700 transition-colors"
                                        >
                                            <svg className="h-3 w-3 shrink-0 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                            </svg>
                                            <span className="truncate">{member.email}</span>
                                        </a>
                                    )}
                                    {member.phone && (
                                        <a
                                            href={`tel:${member.phone}`}
                                            className="flex items-center gap-1.5 text-xs text-gray-600 hover:text-blue-700 transition-colors"
                                        >
                                            <svg className="h-3 w-3 shrink-0 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                            </svg>
                                            <span>{member.phone}</span>
                                        </a>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

const DirectorateBlock = ({ content }) => {
    const directorates = Array.isArray(content.directorates) ? content.directorates : [];

    if (directorates.length === 0) return null;

    return (
        <div className="my-4">
            {content.title && (
                <h3 className="text-lg font-bold text-gray-800 mb-3">{content.title}</h3>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {directorates.map((directorate) => (
                    <FacultyCard key={directorate.id} directorate={directorate} />
                ))}
            </div>
        </div>
    );
};

const BLOCK_RENDERERS = {
    text: TextBlock,
    image: ImageBlock,
    list: ListBlock,
    html: HtmlBlock,
    table: TableBlock,
    pdf: PdfBlock,
    members: MembersBlock,
    directorate: DirectorateBlock,
};

const ContentBlockRenderer = ({ block }) => {
    const Renderer = BLOCK_RENDERERS[block.blockType];

    if (!Renderer) {
        return null;
    }

    return <Renderer content={block.content} />;
};

export default ContentBlockRenderer;
