import React from 'react';

const BACKEND_ORIGIN = (import.meta.env.VITE_API_BASE_URL)
    .replace(/\/api\/v1\/?$/, '');

const resolveUrl = (url) => {
    if (!url) return null;
    if (url.startsWith('http://') || url.startsWith('https://')) return url;
    return BACKEND_ORIGIN + url;
};

const INSTITUTION_ADDRESS = 'University College of Engineering, Jawaharlal Nehru Technological University, Kakinada\u2011533003, Andhra Pradesh';

export default function FacultyCard({ directorate }) {
    const { name, photo, designations = [], department, profile } = directorate;
    const photoUrl = photo?.url ? resolveUrl(photo.url) : null;
    const qualifications = profile?.qualifications ?? [];
    const contact = profile?.contact ?? {};
    const hasContact = contact.email || contact.phone || contact.website;

    return (
        <div className="bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200 flex gap-0 overflow-hidden" style={{ borderRadius: '4px' }}>

            {/* ── Left: Photo column ─────────────────────────────── */}
            <div className="shrink-0 w-40 bg-gray-50 border-r border-gray-200 self-stretch">
                {photoUrl ? (
                    <img
                        src={photoUrl}
                        alt={name}
                        className="w-full h-full object-cover object-top"
                    />
                ) : (
                    <div className="w-full h-full min-h-48 bg-gray-100 flex items-center justify-center">
                        <svg className="h-16 w-16 text-gray-300" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z" />
                        </svg>
                    </div>
                )}
            </div>

            {/* ── Right: Info column ─────────────────────────────── */}
            <div className="flex-1 min-w-0 px-5 py-5 flex flex-col gap-2">

                {/* Name */}
                <h3 className="text-base font-bold text-gray-900 leading-snug tracking-tight">
                    {name}
                </h3>

                {/* Designations */}
                {designations.length > 0 && (
                    <p className="text-xs font-semibold text-blue-800 leading-snug">
                        {designations.map(d => d.designation.title).join(' | ')}
                    </p>
                )}

                {/* Qualifications */}
                {qualifications.length > 0 && (
                    <p className="text-xs text-gray-600 leading-relaxed">
                        {qualifications.join(', ')}
                    </p>
                )}

                {/* Department */}
                {department && (
                    <p className="text-xs text-gray-700 font-medium leading-snug">
                        {department.name}
                    </p>
                )}

                {/* Institution address — always shown */}
                <p className="text-xs text-gray-500 leading-relaxed border-t border-gray-100 pt-1.5 mt-0.5">
                    {INSTITUTION_ADDRESS}
                </p>

                {/* Contact details */}
                {hasContact && (
                    <div className="flex flex-col gap-1 border-t border-gray-100 pt-1.5 mt-0.5">
                        {contact.email && (
                            <a
                                href={`mailto:${contact.email}`}
                                className="flex items-center gap-1.5 text-xs text-gray-600 hover:text-blue-700 transition-colors group"
                            >
                                <svg className="h-3 w-3 shrink-0 text-gray-400 group-hover:text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                                <span className="truncate">{contact.email}</span>
                            </a>
                        )}
                        {contact.phone && (
                            <a
                                href={`tel:${contact.phone}`}
                                className="flex items-center gap-1.5 text-xs text-gray-600 hover:text-blue-700 transition-colors group"
                            >
                                <svg className="h-3 w-3 shrink-0 text-gray-400 group-hover:text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                </svg>
                                <span>{contact.phone}</span>
                            </a>
                        )}
                        {contact.website && (
                            <a
                                href={contact.website}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-1.5 text-xs text-gray-600 hover:text-blue-700 transition-colors group"
                            >
                                <svg className="h-3 w-3 shrink-0 text-gray-400 group-hover:text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                                </svg>
                                <span className="truncate">{contact.website.replace(/^https?:\/\//, '')}</span>
                            </a>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
