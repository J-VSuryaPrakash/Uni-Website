import React from 'react';
import ContentBlockRenderer from '../blocks/ContentBlockRenderer';

const SectionRenderer = ({ section }) => {
    const blocks = section.contentBlocks || [];

    if (blocks.length === 0 && !section.title) {
        return null;
    }

    return (
        <div className="mb-8">
            {section.title && (
                <h2 className="text-2xl font-bold text-gray-800 mb-4 border-l-4 border-blue-900 pl-3">
                    {section.title}
                </h2>
            )}
            <div className="space-y-4">
                {blocks.map((block) => (
                    <ContentBlockRenderer key={block.id} block={block} />
                ))}
            </div>
        </div>
    );
};

export default SectionRenderer;
