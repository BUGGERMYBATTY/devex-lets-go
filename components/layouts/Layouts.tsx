
import React, { useState } from 'react';
import type { Section, ColorScheme, CustomColors } from '../../types';

interface LayoutProps {
  sections: Section[];
  generatedImages: string[];
  colorScheme: ColorScheme;
  customColors: CustomColors;
  sectionWrapper: (index: number, children: React.ReactNode) => React.ReactNode;
  onImageClick: (src: string, index: number) => void;
  onSectionUpdate: (id: string, content: Partial<Section['content']>) => void;
}

interface EditableElementProps {
  tag: React.ElementType;
  value?: string;
  onSave: (val: string) => void;
  className?: string;
  style?: React.CSSProperties;
  fontSize?: string;
  onFontSizeChange?: (newSize: string) => void;
}

const FontSizeControls: React.FC<{ currentSize: string, onChange: (s: string) => void }> = ({ currentSize, onChange }) => {
    const parseSize = (s: string) => {
        if (s.endsWith('rem')) return parseFloat(s);
        if (s.endsWith('px')) return parseFloat(s) / 16; // Approx
        // Default fallback logic if no unit or unknown
        return 2; // 2rem default
    };

    const handleIncrease = (e: React.MouseEvent) => {
        e.stopPropagation();
        const val = parseSize(currentSize);
        onChange(`${(val + 0.25).toFixed(2)}rem`);
    };

    const handleDecrease = (e: React.MouseEvent) => {
        e.stopPropagation();
        const val = parseSize(currentSize);
        if (val > 0.5) onChange(`${(val - 0.25).toFixed(2)}rem`);
    };

    return (
        <div className="absolute -top-8 left-0 bg-gray-800 text-white rounded-md shadow-lg flex items-center gap-1 px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity z-50 border border-gray-600 pointer-events-auto">
            <button onClick={handleDecrease} className="hover:text-indigo-400 px-1 font-bold text-lg leading-none">-</button>
            <span className="text-xs font-mono">Aa</span>
            <button onClick={handleIncrease} className="hover:text-indigo-400 px-1 font-bold text-lg leading-none">+</button>
        </div>
    );
};

const EditableElement: React.FC<EditableElementProps> = ({
  tag: Tag,
  value,
  onSave,
  className,
  style,
  fontSize,
  onFontSizeChange
}) => {
  const handleBlur = (e: React.FocusEvent<HTMLElement>) => {
    const newValue = e.currentTarget.textContent;
    if (newValue !== null && newValue !== value) {
      onSave(newValue);
    }
  };

  // Merge custom font size into style if provided
  const combinedStyle = {
      ...style,
      ...(fontSize ? { fontSize } : {})
  };

  return (
    <div className="relative group inline-block max-w-full">
        {onFontSizeChange && (
            <FontSizeControls 
                currentSize={fontSize || 'inherit'} // If no custom size yet, logic needs a base. Logic inside control handles defaults mostly, but layout sets initial custom.
                onChange={onFontSizeChange} 
            />
        )}
        <Tag
        contentEditable
        suppressContentEditableWarning
        onBlur={handleBlur}
        className={`outline-none border-b-2 border-transparent focus:border-white/50 rounded px-1 -mx-1 transition-all cursor-text ${className || ''}`}
        style={combinedStyle}
        >
        {value}
        </Tag>
    </div>
  );
};

const ImageEditorOverlay: React.FC = () => (
    <div className="absolute inset-0 bg-black/50 flex justify-center items-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
    </div>
);

const CopyButton: React.FC<{ text: string; customColors?: CustomColors }> = ({ text, customColors }) => {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const buttonStyle = {
      backgroundColor: customColors?.cardButtonBg || undefined, // Fallback to tailwind class if undefined
      borderColor: customColors?.cardBorder || undefined
  };

  return (
    <button 
      onClick={handleCopy} 
      className={`ml-3 p-2 rounded-lg border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-y-0.5 hover:shadow-none transition-all relative group ${!customColors?.cardButtonBg ? 'bg-cyan-400 hover:bg-cyan-300' : ''}`}
      style={buttonStyle}
      title="Copy to clipboard"
    >
      {copied ? (
        <svg className="w-5 h-5 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7"></path>
        </svg>
      ) : (
        <svg className="w-5 h-5 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
        </svg>
      )}
      {copied && (
        <span className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-black text-white text-sm font-bold py-1 px-2 rounded-md opacity-0 animate-fade-in-out whitespace-nowrap pointer-events-none border-2 border-white">
            Copied!
        </span>
      )}
      <style>{`
        @keyframes fade-in-out {
            0% { opacity: 0; transform: translate(-50%, 5px); }
            20% { opacity: 1; transform: translate(-50%, 0); }
            80% { opacity: 1; transform: translate(-50%, 0); }
            100% { opacity: 0; transform: translate(-50%, -5px); }
        }
        .animate-fade-in-out {
            animation: fade-in-out 1.5s ease-in-out forwards;
        }
      `}</style>
    </button>
  );
};

// Helper for the comic text style
const ComicText: React.FC<{ children: React.ReactNode, className?: string }> = ({ children, className }) => (
    <span className={`drop-shadow-[0_4px_0_rgba(0,0,0,0.2)] ${className}`} style={{ textShadow: '2px 2px 0 #000' }}>
        {children}
    </span>
);

// Layout 1: Meme Star (Soligator Replicate)
export const Layout1: React.FC<LayoutProps> = ({ sections, generatedImages, colorScheme, customColors, sectionWrapper, onImageClick, onSectionUpdate }) => {
  
  // --- Background Pattern Logic ---
  const primaryColor = customColors.background || '#f000ff';
  // Default secondary color if not provided: a lighter version or complement. For simplicity, let's default to a standard pink variant if primary is default, else white.
  const secondaryColor = customColors.backgroundSecondary || '#ff66ff'; 
  
  const patternType = customColors.backgroundPattern || 'sunburst';
  
  let backgroundStyle: React.CSSProperties = {};

  if (patternType === 'solid') {
       backgroundStyle = { backgroundColor: primaryColor };
  } else if (patternType === 'sunburst') {
       backgroundStyle = {
           backgroundColor: primaryColor,
           backgroundImage: `repeating-conic-gradient(
               from 0deg,
               ${primaryColor} 0deg 15deg,
               ${secondaryColor} 15deg 30deg
           )`
       };
  } else if (patternType === 'bubbles') {
      backgroundStyle = {
          backgroundColor: primaryColor,
          backgroundImage: `
              radial-gradient(circle at 50% 50%, ${secondaryColor} 10%, transparent 10.5%), 
              radial-gradient(circle at 100% 0%, ${secondaryColor} 15%, transparent 15.5%), 
              radial-gradient(circle at 0% 100%, ${secondaryColor} 5%, transparent 5.5%),
              radial-gradient(circle at 20% 20%, ${secondaryColor} 2%, transparent 2.5%)
          `,
          backgroundSize: '100px 100px'
      };
  } else if (patternType === 'hypno') {
      backgroundStyle = {
          backgroundColor: primaryColor,
          backgroundImage: `repeating-radial-gradient(
            circle at 50% 50%, 
            ${primaryColor}, 
            ${primaryColor} 20px, 
            ${secondaryColor} 20px, 
            ${secondaryColor} 40px
          )`
      };
  } else if (patternType === 'stripes') {
      backgroundStyle = {
          backgroundColor: primaryColor,
          backgroundImage: `repeating-linear-gradient(
            45deg,
            ${primaryColor},
            ${primaryColor} 20px, 
            ${secondaryColor} 20px, 
            ${secondaryColor} 40px
          )`
      };
  } else if (patternType === 'checker') {
      backgroundStyle = {
          backgroundColor: primaryColor,
          backgroundImage: `conic-gradient(
            ${primaryColor} 90deg, 
            ${secondaryColor} 90deg 180deg, 
            ${primaryColor} 180deg 270deg, 
            ${secondaryColor} 270deg
          )`,
          backgroundSize: '60px 60px'
      };
  }
  
  // Fallback to colorScheme if no custom background is set at all (though state defaults to {} so it might need checking)
  // If user hasn't touched custom colors, we rely on colorScheme. But for pattern rendering, we use the defaults defined above based on inputs.
  // If customColors is empty, we want the default pink sunburst.
  // Our logic above uses default consts '#f000ff' if primaryColor is undefined, which matches the default scheme.
  // However, we should respect the selected ColorScheme preset if customColors are NOT set.
  
  if (!customColors.background && !customColors.backgroundSecondary && !customColors.backgroundPattern) {
      // Use preset logic
      // We can infer a secondary color from the preset for the default sunburst
       backgroundStyle = {
           backgroundColor: colorScheme.colors.bg.includes('#') ? colorScheme.colors.bg : '#f000ff', // simplified
           // We'll stick to the hardcoded sunburst for the preset default to match original behavior perfectly
           backgroundImage: `repeating-conic-gradient(
            from 0deg,
            ${colorScheme.colors.bg.includes('f000ff') ? '#f000ff' : '#f000ff'} 0deg 15deg,
            #ff66ff 15deg 30deg
          )`
       };
       // If the preset isn't the pink one (e.g. Solar), we might just want the solid bg class from tailwind.
       if (!colorScheme.colors.bg.includes('f000ff')) {
           backgroundStyle = {}; // Let the className handle it
       }
  }

  const actionButtonStyle = {
      backgroundColor: customColors.actionButtonBg,
      color: customColors.actionButtonText
  };

  const cardStyle = {
      backgroundColor: customColors.cardBg,
      color: customColors.cardText,
      borderColor: customColors.cardBorder
  };

  const heroImage = generatedImages[0] || 'https://via.placeholder.com/500';
  const aboutImage = generatedImages[1] || generatedImages[0] || 'https://via.placeholder.com/500';
  const buyImage = generatedImages[2] || generatedImages[0] || 'https://via.placeholder.com/500';
  const tokenomicsImage = generatedImages[3] || generatedImages[0] || 'https://via.placeholder.com/500';
  const contractAddress = "A9fcjKEw9r4e9b7ATbM6Bk3LbX5jGeZt3WxrmfMRnzDw";

  const updateFontSize = (sectionId: string, type: 'heading' | 'paragraph', newSize: string) => {
      const section = sections.find(s => s.id === sectionId);
      if (section) {
          onSectionUpdate(sectionId, {
              customFontSizes: {
                  ...section.content.customFontSizes,
                  [type]: newSize
              }
          });
      }
  };

  return (
    <div className="min-h-full relative overflow-x-hidden text-white" style={backgroundStyle}>
      {/* Fallback BG div for presets that don't use the inline style */}
      {Object.keys(backgroundStyle).length === 0 && <div className={`absolute inset-0 ${colorScheme.colors.bg} -z-10`} />}
      
      {/* Navigation - Dynamic and Editable */}
      <div className="container mx-auto px-4 py-6 flex justify-between items-center relative z-20">
        <div className="w-12 h-12 md:w-16 md:h-16">
             <img src={heroImage} className="w-full h-full object-cover rounded-full border-2 border-white" alt="Logo" />
        </div>
        <nav className="hidden md:flex gap-6 text-xl md:text-2xl font-bold items-center">
            {sections
              .filter(s => s.content.navTitle)
              .map((section) => (
                <div
                    key={section.id}
                    onClick={() => {
                        const el = document.getElementById(section.id);
                        if (el) el.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="cursor-pointer hover:scale-110 transition-transform drop-shadow-md"
                >
                    <EditableElement
                        tag="span"
                        value={section.content.navTitle}
                        onSave={(val) => onSectionUpdate(section.id, { navTitle: val })}
                    />
                </div>
            ))}
            <button 
                onClick={() => {
                    const el = document.getElementById('gallery'); // 'gallery' is the id for Buy section in INITIAL_SECTIONS
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className={`px-6 py-2 rounded-full border-2 border-blue-500 transform hover:-translate-y-1 transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] text-lg ${!customColors.actionButtonBg ? 'bg-white text-blue-500 hover:bg-blue-50' : ''}`}
                style={actionButtonStyle}
            >
                buy now
            </button>
        </nav>
      </div>

      {sections.map((section, index) => sectionWrapper(index, (() => {
        switch (section.component) {
          case 'Hero':
            return (
              <div className="container mx-auto px-4 py-12 md:py-20">
                <div className="flex flex-col md:flex-row items-center justify-between">
                    <div className="w-full md:w-1/2 text-center md:text-left z-10 mb-12 md:mb-0">
                         <EditableElement 
                            tag="h1"
                            value={section.content.heading}
                            onSave={(val) => onSectionUpdate(section.id, { heading: val })}
                            className="text-6xl md:text-9xl font-extrabold mb-4 leading-tight block drop-shadow-[4px_4px_0_#000]"
                            style={{ WebkitTextStroke: '2px black' }}
                            fontSize={section.content.customFontSizes?.heading}
                            onFontSizeChange={(s) => updateFontSize(section.id, 'heading', s)}
                         />
                         <div className="bg-transparent p-0 mb-8">
                             <EditableElement 
                                tag="p"
                                value={section.content.paragraph}
                                onSave={(val) => onSectionUpdate(section.id, { paragraph: val })}
                                className="text-2xl md:text-3xl font-bold max-w-lg mx-auto md:mx-0 drop-shadow-[2px_2px_0_#000]"
                                fontSize={section.content.customFontSizes?.paragraph}
                                onFontSizeChange={(s) => updateFontSize(section.id, 'paragraph', s)}
                             />
                         </div>
                         <div className="flex flex-col md:flex-row gap-4 justify-center md:justify-start items-center">
                             <button 
                                className={`text-xl font-bold px-8 py-3 rounded-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-y-1 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all border-2 border-black ${!customColors.actionButtonBg ? 'bg-white text-blue-600' : ''}`}
                                style={actionButtonStyle}
                             >
                                buy $MEME
                             </button>
                         </div>
                         {/* CA Box Updated to match comic style */}
                         <div 
                            className={`mt-10 inline-flex items-center px-4 py-3 md:px-6 md:py-4 rounded-2xl border-4 shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] transform hover:-translate-y-1 hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transition-all ${!customColors.cardBg ? 'bg-white text-black border-black' : ''}`}
                            style={cardStyle}
                        >
                             <span className="text-xl md:text-2xl font-black mr-3">CA:</span>
                             <span className="text-sm md:text-lg font-bold truncate max-w-[180px] md:max-w-sm tracking-wider">{contractAddress}</span>
                             <CopyButton text={contractAddress} customColors={customColors} />
                         </div>
                    </div>
                    <div className="w-full md:w-1/2 flex justify-center md:justify-end relative">
                         <div className="relative group cursor-pointer transform hover:scale-105 transition-transform duration-300" onClick={() => onImageClick(heroImage, 0)}>
                            <img src={heroImage} alt="Hero" className="w-full max-w-md md:max-w-lg" style={{ filter: 'drop-shadow(5px 5px 0px #000)' }} />
                            <ImageEditorOverlay />
                         </div>
                    </div>
                </div>
              </div>
            );
          
          case 'About':
            return (
              <div className="container mx-auto px-4 py-24">
                 <div className="flex flex-col-reverse md:flex-row items-center gap-12">
                    <div className="w-full md:w-1/3 flex justify-center">
                         <div className="relative group cursor-pointer transform -rotate-6 hover:rotate-0 transition-transform duration-300" onClick={() => onImageClick(aboutImage, 1)}>
                            <img src={aboutImage} alt="About" className="w-64 md:w-80" style={{ filter: 'drop-shadow(5px 5px 0px #000)' }} />
                            <ImageEditorOverlay />
                         </div>
                    </div>
                    <div className="w-full md:w-2/3 text-center md:text-right">
                        <EditableElement 
                            tag="h2"
                            value={section.content.heading}
                            onSave={(val) => onSectionUpdate(section.id, { heading: val })}
                            className="text-6xl md:text-8xl font-bold mb-6 inline-block text-white drop-shadow-[4px_4px_0_#000]"
                            style={{ WebkitTextStroke: '2px black' }}
                            fontSize={section.content.customFontSizes?.heading}
                            onFontSizeChange={(s) => updateFontSize(section.id, 'heading', s)}
                        />
                        <div className="bg-transparent">
                            <EditableElement 
                                tag="p"
                                value={section.content.paragraph}
                                onSave={(val) => onSectionUpdate(section.id, { paragraph: val })}
                                className="text-2xl md:text-4xl font-medium leading-relaxed drop-shadow-[2px_2px_0_#000]"
                                fontSize={section.content.customFontSizes?.paragraph}
                                onFontSizeChange={(s) => updateFontSize(section.id, 'paragraph', s)}
                            />
                        </div>
                    </div>
                 </div>
              </div>
            );

          // Using 'Gallery' type as the 'Buy' section for this specific layout
          case 'Gallery':
            return (
              <div className="container mx-auto px-4 py-24">
                <div className="flex flex-col md:flex-row items-center gap-12">
                     <div className="w-full md:w-2/3 text-center">
                        <EditableElement 
                            tag="h2"
                            value={section.content.heading}
                            onSave={(val) => onSectionUpdate(section.id, { heading: val })}
                            className="text-6xl md:text-8xl font-bold mb-8 inline-block text-white drop-shadow-[4px_4px_0_#000]"
                            style={{ WebkitTextStroke: '2px black' }}
                            fontSize={section.content.customFontSizes?.heading}
                            onFontSizeChange={(s) => updateFontSize(section.id, 'heading', s)}
                        />
                        <EditableElement 
                            tag="p"
                            value={section.content.paragraph}
                            onSave={(val) => onSectionUpdate(section.id, { paragraph: val })}
                            className="text-2xl md:text-3xl mb-8 block drop-shadow-[2px_2px_0_#000]"
                            fontSize={section.content.customFontSizes?.paragraph}
                            onFontSizeChange={(s) => updateFontSize(section.id, 'paragraph', s)}
                        />
                        <button 
                            className={`text-xl font-bold px-8 py-4 rounded-xl border-4 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-y-1 hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transition-all flex items-center mx-auto gap-2 ${!customColors.actionButtonBg ? 'bg-white text-black border-black' : ''}`}
                            style={actionButtonStyle}
                        >
                             <span className="text-2xl">🦅</span> dexscreener.com
                        </button>
                     </div>
                     <div className="w-full md:w-1/3 flex justify-center">
                        <div className="relative group cursor-pointer transform rotate-6 hover:rotate-0 transition-transform duration-300" onClick={() => onImageClick(buyImage, 2)}>
                            <img src={buyImage} alt="Buy" className="w-64 md:w-80" style={{ filter: 'drop-shadow(5px 5px 0px #000)' }} />
                            <ImageEditorOverlay />
                         </div>
                     </div>
                </div>
              </div>
            );

          case 'Tokenomics':
             return (
                 <div className="container mx-auto px-4 py-24 text-center">
                     <EditableElement 
                        tag="h2"
                        value={section.content.heading}
                        onSave={(val) => onSectionUpdate(section.id, { heading: val })}
                        className="text-6xl md:text-8xl font-bold mb-16 inline-block text-white drop-shadow-[4px_4px_0_#000]"
                        style={{ WebkitTextStroke: '2px black' }}
                        fontSize={section.content.customFontSizes?.heading}
                        onFontSizeChange={(s) => updateFontSize(section.id, 'heading', s)}
                     />
                     
                     <div className="relative max-w-6xl mx-auto mb-12 flex flex-col md:flex-row items-center justify-center gap-8 md:gap-4">
                        {/* Left Items (Index 0, 2, 4...) */}
                        <div className="flex flex-col gap-8 w-full md:w-1/4 justify-center items-center z-20 order-2 md:order-1">
                             {(section.content.items || []).map((item, i) => {
                                 if (i % 2 !== 0) return null;
                                 return (
                                    <div 
                                        key={i} 
                                        className={`border-4 p-4 rounded-xl font-bold text-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transform -rotate-2 hover:scale-105 transition-all ${!customColors.cardBg ? 'bg-white text-black border-black' : ''}`}
                                        style={cardStyle}
                                    >
                                        <EditableElement
                                            tag="span"
                                            value={item}
                                            onSave={(val) => {
                                                const newItems = [...(section.content.items || [])];
                                                newItems[i] = val;
                                                onSectionUpdate(section.id, { items: newItems });
                                            }}
                                            className="block min-w-[120px] focus:border-blue-500/50 focus:bg-blue-50 text-center"
                                        />
                                    </div>
                                 );
                             })}
                        </div>

                        {/* Image Centered - Using distinct index 3 */}
                         <div className="w-full md:w-1/3 z-10 order-1 md:order-2">
                            <div className="relative group cursor-pointer inline-block" onClick={() => onImageClick(tokenomicsImage, 3)}>
                                <img src={tokenomicsImage} alt="Tokenomics" className="w-full max-w-xs md:max-w-md mx-auto transform hover:scale-105 transition-transform" style={{ filter: 'drop-shadow(5px 5px 0px #000)' }} />
                                <ImageEditorOverlay />
                            </div>
                         </div>
                         
                         {/* Right Items (Index 1, 3, 5...) */}
                         <div className="flex flex-col gap-8 w-full md:w-1/4 justify-center items-center z-20 order-3">
                             {(section.content.items || []).map((item, i) => {
                                 if (i % 2 === 0) return null;
                                 return (
                                    <div 
                                        key={i} 
                                        className={`border-4 p-4 rounded-xl font-bold text-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transform rotate-2 hover:scale-105 transition-all ${!customColors.cardBg ? 'bg-white text-black border-black' : ''}`}
                                        style={cardStyle}
                                    >
                                        <EditableElement
                                            tag="span"
                                            value={item}
                                            onSave={(val) => {
                                                const newItems = [...(section.content.items || [])];
                                                newItems[i] = val;
                                                onSectionUpdate(section.id, { items: newItems });
                                            }}
                                            className="block min-w-[120px] focus:border-blue-500/50 focus:bg-blue-50 text-center"
                                        />
                                    </div>
                                 );
                             })}
                         </div>
                     </div>
                 </div>
             );
          
          case 'Socials':
            return (
                <div className="container mx-auto px-4 py-24 text-center bg-black/10 rounded-t-[4rem] backdrop-blur-sm mt-12">
                    <EditableElement 
                        tag="h2"
                        value={section.content.heading}
                        onSave={(val) => onSectionUpdate(section.id, { heading: val })}
                        className="text-4xl md:text-6xl font-bold mb-12 inline-block text-white drop-shadow-[4px_4px_0_#000]"
                        style={{ WebkitTextStroke: '2px black' }}
                        fontSize={section.content.customFontSizes?.heading}
                        onFontSizeChange={(s) => updateFontSize(section.id, 'heading', s)}
                    />

                    <div className="flex justify-center gap-6 mb-12">
                        {section.content.socialLinks?.twitter && (
                            <a href={section.content.socialLinks.twitter} target="_blank" rel="noreferrer" className="group">
                                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-black font-bold text-3xl border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] group-hover:translate-y-1 group-hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all">
                                    𝕏
                                </div>
                            </a>
                        )}
                         {section.content.socialLinks?.telegram && (
                            <a href={section.content.socialLinks.telegram} target="_blank" rel="noreferrer" className="group">
                                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-blue-500 font-bold text-3xl border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] group-hover:translate-y-1 group-hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all">
                                    ✈️
                                </div>
                            </a>
                        )}
                        {section.content.socialLinks?.discord && (
                            <a href={section.content.socialLinks.discord} target="_blank" rel="noreferrer" className="group">
                                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-indigo-600 font-bold text-3xl border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] group-hover:translate-y-1 group-hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all">
                                    👾
                                </div>
                            </a>
                        )}
                    </div>

                    {/* Link Editors - Visible for building */}
                    <div className="max-w-lg mx-auto bg-white/20 p-6 rounded-2xl border-2 border-white/30 backdrop-blur-md mb-16">
                        <h4 className="text-lg font-bold mb-4 text-white drop-shadow-[1px_1px_0_#000]">Edit Social Links</h4>
                        <div className="space-y-4">
                             <div className="flex items-center gap-3">
                                <span className="text-2xl w-8">𝕏</span>
                                <input
                                    type="text"
                                    value={section.content.socialLinks?.twitter || ''}
                                    onChange={(e) => onSectionUpdate(section.id, { socialLinks: { ...section.content.socialLinks, twitter: e.target.value, telegram: section.content.socialLinks?.telegram || '', discord: section.content.socialLinks?.discord || '' } })}
                                    className="bg-black/40 border-2 border-white/30 rounded-lg px-3 py-2 w-full text-white placeholder-white/50 focus:outline-none focus:border-white"
                                    placeholder="Twitter URL (leave empty to hide)"
                                />
                             </div>
                             <div className="flex items-center gap-3">
                                <span className="text-2xl w-8">✈️</span>
                                <input
                                    type="text"
                                    value={section.content.socialLinks?.telegram || ''}
                                    onChange={(e) => onSectionUpdate(section.id, { socialLinks: { ...section.content.socialLinks, telegram: e.target.value, twitter: section.content.socialLinks?.twitter || '', discord: section.content.socialLinks?.discord || '' } })}
                                    className="bg-black/40 border-2 border-white/30 rounded-lg px-3 py-2 w-full text-white placeholder-white/50 focus:outline-none focus:border-white"
                                    placeholder="Telegram URL (leave empty to hide)"
                                />
                             </div>
                             <div className="flex items-center gap-3">
                                <span className="text-2xl w-8">👾</span>
                                <input
                                    type="text"
                                    value={section.content.socialLinks?.discord || ''}
                                    onChange={(e) => onSectionUpdate(section.id, { socialLinks: { ...section.content.socialLinks, discord: e.target.value, twitter: section.content.socialLinks?.twitter || '', telegram: section.content.socialLinks?.telegram || '' } })}
                                    className="bg-black/40 border-2 border-white/30 rounded-lg px-3 py-2 w-full text-white placeholder-white/50 focus:outline-none focus:border-white"
                                    placeholder="Discord URL (leave empty to hide)"
                                />
                             </div>
                        </div>
                    </div>

                    {/* Footer Elements */}
                    <div className="flex flex-col items-center">
                        <div className="w-20 h-20 mx-auto mb-4">
                             <img src={heroImage} className="w-full h-full object-cover rounded-full border-4 border-white shadow-lg" alt="Footer Logo" />
                        </div>
                        <p className="text-2xl font-bold drop-shadow-[2px_2px_0_#000]">2025</p>
                    </div>
                </div>
            );

          default:
            return <div className="py-12"><SectionContent section={section} /></div>;
        }
      })())}
    </div>
  );
};

const SectionContent: React.FC<{ section: Section }> = ({ section }) => (
    <div className="w-full max-w-4xl mx-auto px-6 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">{section.content.heading}</h2>
        {section.content.paragraph && <p className="md:text-lg">{section.content.paragraph}</p>}
    </div>
);

export const Layout2: React.FC<LayoutProps> = () => null;
export const Layout3: React.FC<LayoutProps> = () => null;
export const Layout4: React.FC<LayoutProps> = () => null;
export const Layout5: React.FC<LayoutProps> = () => null;
