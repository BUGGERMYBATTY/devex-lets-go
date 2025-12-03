
import React, { useEffect } from 'react';
import { LayoutRenderer } from './layouts/LayoutRenderer';
import type { Layout, ColorScheme, GoogleFont, Section, CustomColors } from '../types';

interface WebsitePreviewProps {
  layout: Layout;
  colorScheme: ColorScheme;
  font: GoogleFont;
  customColors: CustomColors;
  sections: Section[];
  setSections: (sections: Section[]) => void;
  generatedImages: string[];
  onImageClick: (src: string, index: number) => void;
}

const useGoogleFonts = (font: GoogleFont) => {
    useEffect(() => {
        const styleId = 'google-font-stylesheet';
        let styleTag = document.getElementById(styleId);

        if (!styleTag) {
            styleTag = document.createElement('style');
            styleTag.id = styleId;
            document.head.appendChild(styleTag);
        }

        styleTag.innerHTML = font.import;

        return () => {
            // Optional: remove style tag on component unmount if needed
        };
    }, [font]);
};

interface SectionControlsProps {
    onMoveUp: () => void;
    onMoveDown: () => void;
    isFirst: boolean;
    isLast: boolean;
}

const SectionControls: React.FC<SectionControlsProps> = ({ onMoveUp, onMoveDown, isFirst, isLast }) => (
    <div className="absolute top-4 left-4 z-50 flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        <button 
            onClick={(e) => { e.stopPropagation(); onMoveUp(); }} 
            disabled={isFirst}
            className={`p-2 bg-gray-900/80 text-white rounded-lg shadow-lg border border-gray-700 transition-all ${isFirst ? 'opacity-0 cursor-default' : 'hover:bg-indigo-600 hover:scale-110 cursor-pointer'}`}
            title="Move Section Up"
        >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="18 15 12 9 6 15"></polyline></svg>
        </button>
        <button 
            onClick={(e) => { e.stopPropagation(); onMoveDown(); }} 
            disabled={isLast}
            className={`p-2 bg-gray-900/80 text-white rounded-lg shadow-lg border border-gray-700 transition-all ${isLast ? 'opacity-0 cursor-default' : 'hover:bg-indigo-600 hover:scale-110 cursor-pointer'}`}
            title="Move Section Down"
        >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
        </button>
    </div>
);

export const WebsitePreview: React.FC<WebsitePreviewProps> = ({
  layout,
  colorScheme,
  font,
  customColors,
  sections,
  setSections,
  generatedImages,
  onImageClick
}) => {
    useGoogleFonts(font);

    const handleSectionUpdate = (id: string, newContent: Partial<Section['content']>) => {
        const updatedSections = sections.map(section => 
            section.id === id 
                ? { ...section, content: { ...section.content, ...newContent } }
                : section
        );
        setSections(updatedSections);
    };

    const moveSection = (index: number, direction: 'up' | 'down') => {
        const newSections = [...sections];
        if (direction === 'up' && index > 0) {
            [newSections[index], newSections[index - 1]] = [newSections[index - 1], newSections[index]];
        } else if (direction === 'down' && index < newSections.length - 1) {
            [newSections[index], newSections[index + 1]] = [newSections[index + 1], newSections[index]];
        }
        setSections(newSections);
    };

    // If background override is present, we apply it here to the wrapper too, though LayoutRenderer might handle it better
    // We'll let the layout component handle the background primarily.
    const previewClasses = `${colorScheme.colors.bg} ${colorScheme.colors.textPrimary} transition-colors duration-500 min-h-full`;

    return (
        <div className="h-full w-full overflow-y-auto custom-scrollbar" style={{ fontFamily: font.family }}>
            <div className={previewClasses} style={customColors.background ? { background: customColors.background } : {}}>
                 <LayoutRenderer
                    layoutId={layout.id}
                    sections={sections}
                    generatedImages={generatedImages}
                    colorScheme={colorScheme}
                    font={font}
                    customColors={customColors}
                    onImageClick={onImageClick}
                    onSectionUpdate={handleSectionUpdate}
                    sectionWrapper={(index, children) => {
                        return (
                            <div 
                                id={sections[index].id}
                                key={sections[index].id}
                                className="relative group transition-all duration-200 hover:z-10"
                            >
                                <SectionControls 
                                    onMoveUp={() => moveSection(index, 'up')}
                                    onMoveDown={() => moveSection(index, 'down')}
                                    isFirst={index === 0}
                                    isLast={index === sections.length - 1}
                                />
                                {children}
                            </div>
                        );
                    }}
                />
            </div>
            <style>{`
              .custom-scrollbar::-webkit-scrollbar {
                width: 8px;
              }
              .custom-scrollbar::-webkit-scrollbar-track {
                background: rgba(0, 0, 0, 0.1);
              }
              .custom-scrollbar::-webkit-scrollbar-thumb {
                background: rgba(255, 255, 255, 0.2);
                border-radius: 4px;
              }
              .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                background: rgba(255, 255, 255, 0.3);
              }
            `}</style>
        </div>
    );
};
