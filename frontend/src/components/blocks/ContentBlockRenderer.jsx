import React from 'react';

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
            src={content.url || content.imageUrl}
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
        <div className="my-4 overflow-x-auto">
            {content.heading && (
                <h3 className="text-lg font-bold text-gray-800 mb-2">{content.heading}</h3>
            )}
            <table className="w-full text-sm text-left border border-gray-200 rounded-lg overflow-hidden">
                {headers.length > 0 && (
                    <thead className="bg-gray-50 text-gray-600 font-semibold uppercase text-xs">
                        <tr>
                            {headers.map((header, i) => (
                                <th key={i} className="px-4 py-3 border-b border-gray-200">{header}</th>
                            ))}
                        </tr>
                    </thead>
                )}
                <tbody className="divide-y divide-gray-100">
                    {rows.map((row, i) => (
                        <tr key={i} className="hover:bg-gray-50">
                            {(Array.isArray(row) ? row : Object.values(row)).map((cell, j) => (
                                <td key={j} className="px-4 py-3 text-gray-700">{cell}</td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

const PdfBlock = ({ content }) => (
    <div className="my-4">
        {content.heading && (
            <h3 className="text-lg font-bold text-gray-800 mb-2">{content.heading}</h3>
        )}
        {content.embed ? (
            <iframe
                src={content.url}
                title={content.title || content.heading || 'PDF Document'}
                className="w-full h-[600px] rounded-lg border border-gray-200"
            />
        ) : (
            <a
                href={content.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors font-medium"
            >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                {content.title || 'Download PDF'}
            </a>
        )}
    </div>
);

const BLOCK_RENDERERS = {
    text: TextBlock,
    image: ImageBlock,
    list: ListBlock,
    html: HtmlBlock,
    table: TableBlock,
    pdf: PdfBlock,
};

const ContentBlockRenderer = ({ block }) => {
    const Renderer = BLOCK_RENDERERS[block.blockType];

    if (!Renderer) {
        return null;
    }

    return <Renderer content={block.content} />;
};

export default ContentBlockRenderer;
