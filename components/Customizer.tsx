
import React from 'react';
import type { Layout, ColorScheme, GoogleFont, CustomColors } from '../types';

interface CustomizerProps {
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
}

const CustomizerSection: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <div className="space-y-4 pt-2">
        <h3 className="text-xs font-bold uppercase tracking-widest text-indigo-300 border-b border-white/10 pb-2 mb-4">{title}</h3>
        {children}
    </div>
);

const ColorInput: React.FC<{ label: string; value: string | undefined; onChange: (val: string) => void; placeholder: string }> = ({ label, value, onChange, placeholder }) => (
    <div className="flex items-center justify-between p-3 bg-black/20 rounded-xl border border-white/5 hover:border-white/10 transition-colors group">
        <span className="text-sm font-medium text-gray-300 group-hover:text-white transition-colors">{label}</span>
        <div className="flex items-center gap-3">
            <div className="relative w-8 h-8 rounded-lg overflow-hidden ring-1 ring-white/20 group-hover:ring-white/40 transition-all">
                 <input 
                    type="color" 
                    value={value || '#ffffff'} 
                    onChange={(e) => onChange(e.target.value)}
                    className="absolute -top-2 -left-2 w-12 h-12 p-0 cursor-pointer border-none"
                />
            </div>
           
            {value ? (
                <button 
                    onClick={() => onChange('')} 
                    className="text-xs text-white/40 hover:text-red-400 transition-colors w-5 h-5 flex items-center justify-center rounded-full hover:bg-white/5"
                    title="Reset"
                >
                    ✕
                </button>
            ) : (
                 <div className="w-5"></div>
            )}
        </div>
    </div>
);

export const Customizer: React.FC<CustomizerProps> = ({
  layouts,
  colorSchemes,
  fonts,
  selectedLayout,
  setSelectedLayout,
  selectedColorScheme,
  setSelectedColorScheme,
  selectedFont,
  setSelectedFont,
  customColors,
  setCustomColors,
}) => {
  const updateColor = (key: keyof CustomColors, value: string) => {
      setCustomColors({ ...customColors, [key]: value ? value : undefined });
  };

  return (
    <div className="bg-slate-900/80 backdrop-blur-xl border-r border-white/10 h-full overflow-y-auto custom-scrollbar flex flex-col">
      <div className="p-6 border-b border-white/10 bg-white/5">
         <h2 className="text-xl font-extrabold text-white flex items-center gap-2">
            <span className="text-pink-500">🎨</span> Design Tools
         </h2>
      </div>

      <div className="p-6 space-y-10 flex-1">
        <CustomizerSection title="Theme Presets">
            <div className="grid grid-cols-2 gap-3">
                {colorSchemes.map((scheme) => (
                    <button
                        key={scheme.name}
                        onClick={() => setSelectedColorScheme(scheme)}
                        className={`p-3 rounded-xl border-2 transition-all duration-200 relative overflow-hidden ${selectedColorScheme.name === scheme.name ? 'border-pink-500 bg-white/10 shadow-[0_0_15px_rgba(236,72,153,0.3)]' : 'border-transparent bg-black/20 hover:bg-black/40 hover:border-white/10'}`}
                    >
                        <div className="flex justify-between items-center z-10 relative">
                            <span className={`text-xs font-bold ${selectedColorScheme.name === scheme.name ? 'text-white' : 'text-gray-400'}`}>{scheme.name}</span>
                            <div className="flex -space-x-1">
                                <div className={`w-3 h-3 rounded-full ${scheme.colors.bg} ring-1 ring-black/20`}></div>
                                <div className={`w-3 h-3 rounded-full ${scheme.colors.primary} ring-1 ring-black/20`}></div>
                            </div>
                        </div>
                    </button>
                ))}
            </div>
        </CustomizerSection>

        <CustomizerSection title="Typography">
            <div className="space-y-3">
                <div className="relative">
                    <select
                    value={selectedFont.name}
                    onChange={(e) => {
                        const newFont = fonts.find(f => f.name === e.target.value);
                        if(newFont) setSelectedFont(newFont);
                    }}
                    className="w-full bg-black/20 border border-white/10 rounded-xl shadow-sm focus:ring-2 focus:ring-pink-500 focus:border-transparent text-sm text-white py-3 px-4 appearance-none cursor-pointer hover:bg-black/30 transition-colors font-medium"
                    >
                    {fonts.map((font) => (
                        <option key={font.name} value={font.name} className="bg-slate-800 text-white py-2">
                        {font.name}
                        </option>
                    ))}
                    </select>
                    <div className="absolute right-3 top-3.5 pointer-events-none text-gray-400">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
                    </div>
                </div>
                <p className="text-[10px] text-indigo-300/70 px-1">
                    * Hover over text in preview to resize
                </p>
            </div>
        </CustomizerSection>

        <CustomizerSection title="Global Background">
            <div className="space-y-4">
                <div>
                    <label className="block text-xs font-bold text-gray-400 mb-2 uppercase">Pattern</label>
                    <div className="relative">
                        <select 
                            value={customColors.backgroundPattern || 'sunburst'} 
                            onChange={(e) => setCustomColors({...customColors, backgroundPattern: e.target.value as any})}
                            className="w-full bg-black/20 border border-white/10 rounded-xl shadow-sm text-sm text-white py-3 px-4 appearance-none cursor-pointer focus:ring-2 focus:ring-pink-500 focus:border-transparent hover:bg-black/30 transition-colors"
                        >
                            <option value="solid" className="bg-slate-800">Solid Color</option>
                            <option value="sunburst" className="bg-slate-800">Sunburst (Rays)</option>
                            <option value="bubbles" className="bg-slate-800">Bubbles (Spots)</option>
                            <option value="hypno" className="bg-slate-800">Hypno (Swirls)</option>
                            <option value="stripes" className="bg-slate-800">Stripes</option>
                            <option value="checker" className="bg-slate-800">Checkerboard</option>
                        </select>
                         <div className="absolute right-3 top-3.5 pointer-events-none text-gray-400">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
                        </div>
                    </div>
                </div>

                <ColorInput 
                    label="Primary Color" 
                    value={customColors.background} 
                    onChange={(val) => updateColor('background', val)}
                    placeholder="#f000ff"
                />

                {customColors.backgroundPattern !== 'solid' && (
                    <ColorInput 
                        label="Secondary Color" 
                        value={customColors.backgroundSecondary} 
                        onChange={(val) => updateColor('backgroundSecondary', val)}
                        placeholder="#ff66ff"
                    />
                )}
            </div>
        </CustomizerSection>

        <CustomizerSection title="Action Buttons">
            <div className="space-y-3">
                <ColorInput 
                    label="Button Background" 
                    value={customColors.actionButtonBg} 
                    onChange={(val) => updateColor('actionButtonBg', val)}
                    placeholder="#ffffff"
                />
                <ColorInput 
                    label="Button Text" 
                    value={customColors.actionButtonText} 
                    onChange={(val) => updateColor('actionButtonText', val)}
                    placeholder="#2563eb"
                />
            </div>
        </CustomizerSection>

        <CustomizerSection title="Info Cards">
            <div className="space-y-3">
                <ColorInput 
                    label="Card Background" 
                    value={customColors.cardBg} 
                    onChange={(val) => updateColor('cardBg', val)}
                    placeholder="#ffffff"
                />
                <ColorInput 
                    label="Card Text" 
                    value={customColors.cardText} 
                    onChange={(val) => updateColor('cardText', val)}
                    placeholder="#000000"
                />
                <ColorInput 
                    label="Card Border" 
                    value={customColors.cardBorder} 
                    onChange={(val) => updateColor('cardBorder', val)}
                    placeholder="#000000"
                />
                <ColorInput 
                    label="Copy Button Bg" 
                    value={customColors.cardButtonBg} 
                    onChange={(val) => updateColor('cardButtonBg', val)}
                    placeholder="#22d3ee"
                />
            </div>
        </CustomizerSection>
      </div>
      
      <div className="p-6 border-t border-white/10 bg-white/5">
        <button 
            onClick={() => setCustomColors({})}
            className="w-full py-3 px-4 text-sm font-bold text-gray-400 border border-white/10 rounded-xl hover:text-white hover:bg-white/10 transition-all hover:border-white/20"
        >
            Reset All Custom Colors
        </button>
      </div>
    </div>
  );
};
