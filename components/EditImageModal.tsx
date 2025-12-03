
import React, { useState, useRef, useEffect } from 'react';
import { Spinner } from './common/Spinner';

interface EditImageModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageSrc: string;
  onGenerate: (prompt: string, imageOverride?: string) => Promise<void>;
  onSave: (newImageSrc: string) => void;
  isLoading: boolean;
  error: string | null;
}

export const EditImageModal: React.FC<EditImageModalProps> = ({
  isOpen,
  onClose,
  imageSrc,
  onGenerate,
  onSave,
  isLoading,
  error,
}) => {
  const [prompt, setPrompt] = useState('');
  const [brightness, setBrightness] = useState(100);
  const [contrast, setContrast] = useState(100);
  const [saturation, setSaturation] = useState(100);
  const imgRef = useRef<HTMLImageElement>(null);

  // Reset state when modal opens or image changes
  useEffect(() => {
    if (isOpen) {
      setBrightness(100);
      setContrast(100);
      setSaturation(100);
      setPrompt('');
    }
  }, [isOpen, imageSrc]);

  if (!isOpen) return null;

  const getAdjustedImageBase64 = (): string | null => {
    if (!imgRef.current) return null;

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = imgRef.current;

    if (!ctx) return null;

    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;

    // Apply filters
    ctx.filter = `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%)`;
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

    return canvas.toDataURL('image/png');
  };

  const handleGenerateClick = () => {
    if (prompt.trim()) {
      const adjustedImage = getAdjustedImageBase64();
      onGenerate(prompt, adjustedImage || undefined);
    }
  };

  const handleSaveClick = () => {
    const adjustedImage = getAdjustedImageBase64();
    if (adjustedImage) {
        onSave(adjustedImage);
    }
  };

  const hasAdjustments = brightness !== 100 || contrast !== 100 || saturation !== 100;

  const handleReset = () => {
      setBrightness(100);
      setContrast(100);
      setSaturation(100);
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex justify-center items-center z-50 backdrop-blur-md" onClick={onClose}>
      <div
        className="bg-slate-900/90 rounded-3xl border border-white/10 p-6 md:p-8 w-11/12 max-w-4xl relative transform transition-all duration-300 scale-95 animate-scale-in overflow-y-auto max-h-[90vh] shadow-[0_0_50px_rgba(124,58,237,0.2)]"
        onClick={(e) => e.stopPropagation()}
      >
        <button onClick={onClose} className="absolute top-5 right-5 text-gray-400 hover:text-white z-10 bg-white/10 rounded-full p-1 hover:bg-white/20 transition-all">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        <h2 className="text-2xl font-extrabold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-500 flex items-center gap-2">
          <span className="text-2xl">✨</span> Edit Your Meme
        </h2>

        <div className="grid md:grid-cols-2 gap-8 items-start">
          <div className="space-y-4">
            <div className="relative bg-white/5 rounded-2xl overflow-hidden border border-white/10 flex items-center justify-center min-h-[300px] shadow-inner">
                <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-gray-700 via-gray-900 to-black"></div>
                <img 
                    ref={imgRef}
                    src={imageSrc} 
                    alt="Image to edit" 
                    className="max-w-full h-auto object-contain transition-all duration-200 relative z-10 drop-shadow-xl"
                    style={{ filter: `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%)` }}
                />
            </div>
          </div>
          
          <div className="space-y-6 flex flex-col h-full">
             {/* Adjustments Section */}
             <div className="bg-black/20 p-5 rounded-2xl border border-white/5 space-y-5">
                <div className="flex justify-between items-center">
                    <h3 className="text-xs font-bold text-indigo-300 uppercase tracking-wider">Visual Adjustments</h3>
                    {hasAdjustments && (
                        <button 
                            onClick={handleReset}
                            className="text-xs text-pink-400 hover:text-pink-300 font-medium"
                        >
                            Reset
                        </button>
                    )}
                </div>
                
                <div className="space-y-2">
                    <div className="flex justify-between text-xs font-medium text-gray-400">
                        <label htmlFor="brightness">Brightness</label>
                        <span>{brightness}%</span>
                    </div>
                    <input 
                        type="range" 
                        id="brightness"
                        min="0" max="200" 
                        value={brightness} 
                        onChange={(e) => setBrightness(Number(e.target.value))}
                        className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-pink-500"
                    />
                </div>

                <div className="space-y-2">
                    <div className="flex justify-between text-xs font-medium text-gray-400">
                        <label htmlFor="contrast">Contrast</label>
                        <span>{contrast}%</span>
                    </div>
                    <input 
                        type="range" 
                        id="contrast"
                        min="0" max="200" 
                        value={contrast} 
                        onChange={(e) => setContrast(Number(e.target.value))}
                        className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-pink-500"
                    />
                </div>

                <div className="space-y-2">
                    <div className="flex justify-between text-xs font-medium text-gray-400">
                        <label htmlFor="saturation">Saturation</label>
                        <span>{saturation}%</span>
                    </div>
                    <input 
                        type="range" 
                        id="saturation"
                        min="0" max="200" 
                        value={saturation} 
                        onChange={(e) => setSaturation(Number(e.target.value))}
                        className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-pink-500"
                    />
                </div>
                
                <button 
                    onClick={handleSaveClick}
                    disabled={isLoading || !hasAdjustments}
                    className="w-full py-2.5 px-4 mt-2 border border-white/10 text-gray-300 rounded-xl text-sm font-bold hover:bg-white/10 hover:text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg"
                >
                    Save Adjustments Only
                </button>
             </div>

             <div className="border-t border-white/10 my-1"></div>

             {/* AI Edit Section */}
            <div className="space-y-3">
              <label htmlFor="edit-prompt" className="block text-xs font-bold text-indigo-300 uppercase tracking-wider">AI Edit Prompt</label>
              <textarea
                id="edit-prompt"
                rows={3}
                className="block w-full bg-black/30 border border-white/10 rounded-xl shadow-inner focus:ring-2 focus:ring-pink-500 focus:border-transparent sm:text-sm placeholder-gray-600 text-white p-3 resize-none disabled:opacity-50"
                placeholder="e.g., Add a funny hat, change background to space..."
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                disabled={isLoading}
              />
            </div>
            
            {error && (
                <div className="text-red-300 text-sm bg-red-500/10 border border-red-500/20 p-3 rounded-xl font-medium">
                    {error}
                </div>
            )}
            
            <button
                onClick={handleGenerateClick}
                disabled={isLoading || !prompt.trim()}
                className="w-full flex justify-center items-center py-3.5 px-4 border border-transparent rounded-xl shadow-lg text-sm font-bold text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 disabled:bg-gray-700 disabled:from-gray-700 disabled:to-gray-700 disabled:cursor-not-allowed transition-all duration-300 h-12 hover:-translate-y-0.5 hover:shadow-purple-500/20"
            >
              {isLoading ? <Spinner className="h-5 w-5 text-white" /> : '✨ Generate New Image'}
            </button>
            {hasAdjustments && prompt.trim() && (
                <p className="text-[10px] text-center text-gray-500 mt-1">
                    * Visual adjustments are applied before AI processing
                </p>
            )}
          </div>
        </div>
      </div>
       <style>{`
        @keyframes scale-in {
          from { transform: scale(0.95); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        .animate-scale-in { animation: scale-in 0.2s ease-out forwards; }
      `}</style>
    </div>
  );
};
