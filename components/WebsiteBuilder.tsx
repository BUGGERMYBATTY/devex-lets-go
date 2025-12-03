
import React from 'react';
import { Customizer } from './Customizer';
import { WebsitePreview } from './WebsitePreview';
import type { Layout, ColorScheme, GoogleFont, Section, CustomColors } from '../types';

interface WebsiteBuilderProps {
  layouts: Layout[];
  colorSchemes: ColorScheme[];
  fonts: GoogleFont[];
  selectedLayout: Layout;
  setSelectedLayout: (layout: Layout) => void;
  selectedColorScheme: ColorScheme;
  setSelectedColorScheme: (scheme: ColorScheme) => void;
  selectedFont: GoogleFont;
  setSelectedFont: (font: GoogleFont) => void;
  customColors: CustomColors;
  setCustomColors: (colors: CustomColors) => void;
  sections: Section[];
  setSections: (sections: Section[]) => void;
  generatedImages: string[];
  onImageClick: (src: string, index: number) => void;
  onUndo: () => void;
  onRedo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  onSaveProject: () => void;
}

export const WebsiteBuilder: React.FC<WebsiteBuilderProps> = (props) => {
  return (
    <div className="flex flex-col lg:flex-row gap-6 h-[calc(100vh-140px)]">
      <aside className="w-full lg:w-80 xl:w-96 flex-shrink-0 rounded-3xl overflow-hidden shadow-2xl">
        <Customizer
          layouts={props.layouts}
          colorSchemes={props.colorSchemes}
          fonts={props.fonts}
          selectedLayout={props.selectedLayout}
          setSelectedLayout={props.setSelectedLayout}
          selectedColorScheme={props.selectedColorScheme}
          setSelectedColorScheme={props.setSelectedColorScheme}
          selectedFont={props.selectedFont}
          setSelectedFont={props.setSelectedFont}
          customColors={props.customColors}
          setCustomColors={props.setCustomColors}
        />
      </aside>
      
      <main className="flex-1 bg-gray-900/50 backdrop-blur-sm rounded-3xl border border-white/10 overflow-hidden relative flex flex-col shadow-2xl">
        {/* Toolbar Overlay */}
        <div className="absolute top-4 right-4 z-40 flex gap-2">
            <button
                onClick={props.onSaveProject}
                className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white font-bold rounded-xl shadow-lg hover:-translate-y-0.5 transition-all flex items-center gap-2 border border-green-400/50"
            >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path><polyline points="17 21 17 13 7 13 7 21"></polyline><polyline points="7 3 7 8 15 8"></polyline></svg>
                Save
            </button>
            <div className="w-px bg-white/10 mx-2"></div>
            <div className="flex bg-black/40 backdrop-blur-md p-1 rounded-xl border border-white/10 shadow-lg">
                <button
                    onClick={props.onUndo}
                    disabled={!props.canUndo}
                    className="p-2.5 text-white rounded-lg hover:bg-white/10 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
                    title="Undo"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 14L4 9l5-5"/><path d="M4 9h10.5a5.5 5.5 0 0 1 5.5 5.5v0a5.5 5.5 0 0 1-5.5 5.5H11"/></svg>
                </button>
                <div className="w-px bg-white/10 my-1 mx-0.5"></div>
                <button
                    onClick={props.onRedo}
                    disabled={!props.canRedo}
                    className="p-2.5 text-white rounded-lg hover:bg-white/10 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
                    title="Redo"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 9l-5-5"/><path d="M20 9H9.5A5.5 5.5 0 0 0 4 14.5v0A5.5 5.5 0 0 0 9.5 20H13"/></svg>
                </button>
            </div>
        </div>
        
        <WebsitePreview
            layout={props.selectedLayout}
            colorScheme={props.selectedColorScheme}
            font={props.selectedFont}
            customColors={props.customColors}
            sections={props.sections}
            setSections={props.setSections}
            generatedImages={props.generatedImages}
            onImageClick={props.onImageClick}
        />
      </main>
    </div>
  );
};
