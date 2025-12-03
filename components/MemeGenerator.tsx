
import React from 'react';
import { Spinner } from './common/Spinner';

interface MemeGeneratorProps {
  prompt: string;
  setPrompt: (prompt: string) => void;
  referenceImage: { file: File; base64: string } | null;
  handleImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleGenerateClick: () => void;
  handleGenerateVariations: () => void;
  generatedImages: string[];
  selectedImageIndex: number;
  setSelectedImageIndex: (index: number) => void;
  onProceed: () => void;
  isGenerating?: boolean;
}

const ImagePlaceholder: React.FC<{label?: string, isLoading?: boolean}> = ({ label = "Character variation", isLoading = false }) => (
    <div className="w-full h-48 bg-black/20 rounded-xl flex flex-col justify-center items-center text-gray-500 border-2 border-dashed border-white/10 transition-all hover:bg-black/30 hover:border-white/20 group relative overflow-hidden">
        {isLoading && (
             <div className="absolute inset-0 bg-black/40 flex items-center justify-center z-10 backdrop-blur-sm">
                 <Spinner className="w-8 h-8 text-pink-500" />
             </div>
        )}
        <div className="bg-white/5 p-3 rounded-full mb-2 group-hover:scale-110 transition-transform">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6 text-indigo-400"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>
        </div>
        <span className="text-xs font-bold uppercase tracking-wider text-gray-400">{label}</span>
    </div>
);

const PLACEHOLDER_LABELS = [
    "Standard Pose", 
    "Action Pose", 
    "Close Up"
];

export const MemeGenerator: React.FC<MemeGeneratorProps> = ({
  prompt,
  setPrompt,
  referenceImage,
  handleImageChange,
  handleGenerateClick,
  handleGenerateVariations,
  generatedImages,
  selectedImageIndex,
  setSelectedImageIndex,
  onProceed,
  isGenerating
}) => {
  return (
    <div className="max-w-7xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        {/* Input Section - Glass Card */}
        <div className="bg-white/5 backdrop-blur-xl p-8 rounded-3xl border border-white/10 shadow-2xl sticky top-24 overflow-hidden relative">
          <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-3xl -z-10"></div>
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-pink-500/10 rounded-full blur-3xl -z-10"></div>

          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
            <span className="bg-gradient-to-br from-pink-500 to-purple-600 w-8 h-8 rounded-lg flex items-center justify-center text-xs">1</span>
            Create Character
          </h2>

          <div className="space-y-6">
            <div>
              <label htmlFor="image-upload" className="block text-sm font-bold text-indigo-200 mb-3 uppercase tracking-wide text-xs">Upload Reference <span className="opacity-50 normal-case">(Optional)</span></label>
              <div className="mt-1 flex justify-center px-6 pt-6 pb-6 border-2 border-white/10 border-dashed rounded-2xl hover:border-indigo-500/50 hover:bg-indigo-500/5 transition-all duration-300">
                <div className="space-y-2 text-center">
                  {referenceImage ? (
                    <div className="relative group">
                      <img src={`data:${referenceImage.file.type};base64,${referenceImage.base64}`} alt="Reference" className="mx-auto h-32 w-auto rounded-xl shadow-lg object-cover border-2 border-white/20" />
                      <div className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl cursor-pointer" onClick={() => (document.getElementById('image-upload') as HTMLInputElement)?.click()}>
                          <span className="text-xs text-white font-bold uppercase tracking-wider bg-white/10 px-3 py-1 rounded-full backdrop-blur-md border border-white/20">Change</span>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center">
                        <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-4 rounded-full mb-2 shadow-inner">
                             <svg className="h-8 w-8 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                                <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </div>
                        <div className="flex text-sm text-gray-400">
                            <label htmlFor="image-upload" className="relative cursor-pointer font-bold text-indigo-400 hover:text-indigo-300 transition-colors">
                            <span>Upload a file</span>
                            <input id="image-upload" name="image-upload" type="file" className="sr-only" onChange={handleImageChange} accept="image/*" />
                            </label>
                            <p className="pl-1">or drag and drop</p>
                        </div>
                        <p className="text-xs text-gray-600 mt-1">PNG, JPG, GIF up to 10MB</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div>
              <label htmlFor="prompt" className="block text-sm font-bold text-indigo-200 mb-3 uppercase tracking-wide text-xs">Describe Character</label>
              <textarea
                id="prompt"
                rows={4}
                className="block w-full bg-black/30 border border-white/10 rounded-xl shadow-inner focus:ring-2 focus:ring-pink-500 focus:border-transparent sm:text-sm placeholder-gray-600 text-white transition-all p-4 resize-none"
                placeholder="e.g., A grumpy cat holding a coffee cup, side eye glance, funny personality..."
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
              />
            </div>

            <button
              onClick={handleGenerateClick}
              disabled={!prompt || isGenerating || generatedImages.length > 0}
              className="w-full flex justify-center py-4 px-4 border border-transparent rounded-xl shadow-lg text-base font-bold text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 hover:shadow-purple-500/25 hover:-translate-y-1 disabled:bg-gray-700 disabled:from-gray-700 disabled:to-gray-800 disabled:cursor-not-allowed disabled:hover:translate-y-0 transition-all duration-300 relative overflow-hidden group"
            >
              <span className="relative z-10 flex items-center gap-2">
                {isGenerating && generatedImages.length === 0 ? 'Generating...' : generatedImages.length > 0 ? 'Character Generated!' : 'Generate Character'} 
                {!isGenerating && generatedImages.length === 0 && <span className="text-lg group-hover:animate-bounce">✨</span>}
              </span>
            </button>
            
            {/* Variations Button - only appears after initial generation */}
            {generatedImages.length === 1 && !isGenerating && (
                 <button
                    onClick={handleGenerateVariations}
                    className="w-full flex justify-center py-3 px-4 border border-white/10 rounded-xl shadow-md text-sm font-bold text-indigo-200 bg-white/5 hover:bg-white/10 hover:text-white transition-all duration-300 group"
                 >
                     <span className="flex items-center gap-2">
                        Create 2 Variations (Optional) <span className="text-xs bg-white/10 px-2 py-0.5 rounded-full">Uses 2 Credits</span>
                     </span>
                 </button>
            )}
          </div>
        </div>

        {/* Output Section - Glass Card */}
        <div className="bg-white/5 backdrop-blur-xl p-8 rounded-3xl border border-white/10 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-48 h-48 bg-cyan-500/5 rounded-full blur-3xl -z-10"></div>
            
            <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
                 <span className="bg-gradient-to-br from-cyan-500 to-blue-600 w-8 h-8 rounded-lg flex items-center justify-center text-xs">2</span>
                 Select Character
            </h2>
            <p className="text-sm text-indigo-200/70 mb-6">Pick the best variation to launch your site with.</p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {PLACEHOLDER_LABELS.map((label, index) => {
                    const image = generatedImages[index];
                    // Show loader in the very next empty slot if we are actively generating
                    const showLoader = isGenerating && !image && (
                        (index === 0 && generatedImages.length === 0) || // Loading first image
                        (index > 0 && generatedImages.length > 0) // Loading subsequent images
                    );

                    if (image) {
                        return (
                            <div 
                                key={index} 
                                className={`relative cursor-pointer group perspective-1000 rounded-2xl transition-all duration-300 ${selectedImageIndex === index ? 'ring-4 ring-pink-500 shadow-[0_0_20px_rgba(236,72,153,0.5)] scale-[1.02] z-10' : 'hover:scale-105 z-0'}`}
                                onClick={() => setSelectedImageIndex(index)}
                            >
                                <div className="bg-white rounded-xl overflow-hidden shadow-lg border-4 border-white h-48">
                                    <img 
                                        src={image} 
                                        alt={`Generated variation ${index + 1}`} 
                                        className="w-full h-full object-contain animate-scale-in" 
                                    />
                                </div>
                                {selectedImageIndex === index && (
                                    <div className="absolute -top-3 -right-3 bg-pink-500 text-white rounded-full p-1.5 shadow-lg animate-bounce-small border-2 border-white">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                )}
                                <div className="absolute inset-0 rounded-xl ring-1 ring-inset ring-black/10 pointer-events-none"></div>
                            </div>
                        );
                    } else {
                        return <ImagePlaceholder key={index} label={label} isLoading={showLoader} />;
                    }
                })}
            </div>
             {generatedImages.length > 0 && !isGenerating && (
                <button
                onClick={onProceed}
                className="w-full mt-8 flex justify-center py-4 px-4 border border-transparent rounded-xl shadow-lg text-lg font-bold text-white bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 hover:shadow-emerald-500/30 hover:-translate-y-1 focus:outline-none transition-all duration-300 animate-pulse-slow"
                >
                Start Building Website →
                </button>
            )}
        </div>
      </div>
      <style>{`
        @keyframes bounce-small {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-5px); }
        }
        .animate-bounce-small {
            animation: bounce-small 2s infinite;
        }
         @keyframes pulse-slow {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.9; }
        }
        .animate-pulse-slow {
            animation: pulse-slow 3s infinite;
        }
        @keyframes scale-in {
          from { transform: scale(0.9); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        .animate-scale-in { animation: scale-in 0.3s ease-out forwards; }
      `}</style>
    </div>
  );
};
