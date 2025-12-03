
import React, { useState, useCallback, useEffect } from 'react';
import { GoogleGenAI, Modality } from '@google/genai';
import { MemeGenerator } from './components/MemeGenerator';
import { WebsiteBuilder } from './components/WebsiteBuilder';
import { LandingPage } from './components/LandingPage';
import { ProjectsDashboard } from './components/ProjectsDashboard';
import { Spinner } from './components/common/Spinner';
import { fileToBase64, removeBackground } from './utils/fileUtils';
import type { Layout, ColorScheme, GoogleFont, Section, AppStep, CustomColors, Project } from './types';
import { INITIAL_SECTIONS, LAYOUTS, COLOR_SCHEMES, GOOGLE_FONTS } from './constants';
import { EditImageModal } from './components/EditImageModal';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const App: React.FC = () => {
  // Auth State
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [walletProvider, setWalletProvider] = useState<'phantom' | 'solflare' | null>(null);

  // App flow state
  const [step, setStep] = useState<AppStep>('DASHBOARD');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [generationStatus, setGenerationStatus] = useState<string>('');

  // Projects State
  const [projects, setProjects] = useState<Project[]>([]);
  const [currentProjectId, setCurrentProjectId] = useState<string | null>(null);

  // Meme generation state
  const [prompt, setPrompt] = useState<string>('A lazy purple alligator character with a smirk, blue scales, yellow belly, waving hello');
  const [referenceImage, setReferenceImage] = useState<{ file: File; base64: string } | null>(null);
  const [generatedImages, setGeneratedImages] = useState<string[]>([]);
  const [selectedImageIndex, setSelectedImageIndex] = useState<number>(0);
  
  // Website builder state
  const [selectedLayout, setSelectedLayout] = useState<Layout>(LAYOUTS[0]);
  const [selectedColorScheme, setSelectedColorScheme] = useState<ColorScheme>(COLOR_SCHEMES[0]);
  const [selectedFont, setSelectedFont] = useState<GoogleFont>(GOOGLE_FONTS[0]);
  const [customColors, setCustomColors] = useState<CustomColors>({});
  
  // Sections History State (Undo/Redo)
  const [sectionHistory, setSectionHistory] = useState<Section[][]>([INITIAL_SECTIONS]);
  const [historyIndex, setHistoryIndex] = useState<number>(0);
  
  const sections = sectionHistory[historyIndex];

  // Load projects from LocalStorage on mount
  useEffect(() => {
      const savedProjects = localStorage.getItem('meme_projects');
      if (savedProjects) {
          try {
              setProjects(JSON.parse(savedProjects));
          } catch (e) {
              console.error("Failed to parse projects", e);
          }
      }
  }, []);

  // Save projects to LocalStorage whenever they change
  useEffect(() => {
      if (projects.length > 0) {
        localStorage.setItem('meme_projects', JSON.stringify(projects));
      }
  }, [projects]);

  // --- Project Management ---

  const handleCreateNewProject = () => {
      setCurrentProjectId(null);
      setGeneratedImages([]);
      setPrompt('A lazy purple alligator character with a smirk, blue scales, yellow belly, waving hello');
      setReferenceImage(null);
      setSectionHistory([INITIAL_SECTIONS]);
      setHistoryIndex(0);
      setCustomColors({});
      setSelectedLayout(LAYOUTS[0]);
      setSelectedColorScheme(COLOR_SCHEMES[0]);
      setSelectedFont(GOOGLE_FONTS[0]);
      setStep('GENERATE');
  };

  const handleOpenProject = (project: Project) => {
      setCurrentProjectId(project.id);
      setGeneratedImages(project.generatedImages);
      setPrompt(project.prompt);
      
      // Restore Builder State
      setSectionHistory([project.sections]);
      setHistoryIndex(0);
      setCustomColors(project.customColors);
      
      const layout = LAYOUTS.find(l => l.id === project.layoutId) || LAYOUTS[0];
      setSelectedLayout(layout);
      
      const scheme = COLOR_SCHEMES.find(s => s.name === project.colorSchemeId) || COLOR_SCHEMES[0];
      setSelectedColorScheme(scheme);
      
      const font = GOOGLE_FONTS.find(f => f.name === project.fontName) || GOOGLE_FONTS[0];
      setSelectedFont(font);

      setStep('BUILD');
  };

  const handleDeleteProject = (projectId: string) => {
      if (window.confirm("Are you sure you want to delete this project?")) {
          const updated = projects.filter(p => p.id !== projectId);
          setProjects(updated);
          localStorage.setItem('meme_projects', JSON.stringify(updated)); // Force update immediately
      }
  };

  const handleSaveProject = () => {
      const now = Date.now();
      let updatedProjects = [...projects];
      
      // Project Name logic: Use Hero Heading or Prompt
      const heroSection = sections.find(s => s.component === 'Hero');
      const projectName = heroSection?.content.heading || prompt.substring(0, 20) || "Untitled Project";

      if (currentProjectId) {
          // Update existing
          updatedProjects = updatedProjects.map(p => {
              if (p.id === currentProjectId) {
                  return {
                      ...p,
                      name: projectName,
                      updatedAt: now,
                      layoutId: selectedLayout.id,
                      colorSchemeId: selectedColorScheme.name,
                      fontName: selectedFont.name,
                      customColors,
                      sections,
                      generatedImages,
                      thumbnail: generatedImages[0] || p.thumbnail,
                      prompt
                  };
              }
              return p;
          });
      } else {
          // Create new
          const newId = crypto.randomUUID();
          const newProject: Project = {
              id: newId,
              name: projectName,
              thumbnail: generatedImages[0] || '',
              createdAt: now,
              updatedAt: now,
              layoutId: selectedLayout.id,
              colorSchemeId: selectedColorScheme.name,
              fontName: selectedFont.name,
              customColors,
              sections,
              generatedImages,
              prompt
          };
          updatedProjects.push(newProject);
          setCurrentProjectId(newId);
      }
      
      setProjects(updatedProjects);
      alert("Project Saved!");
  };


  const handleSetSections = (newSections: Section[]) => {
      const updatedHistory = sectionHistory.slice(0, historyIndex + 1);
      updatedHistory.push(newSections);
      setSectionHistory(updatedHistory);
      setHistoryIndex(updatedHistory.length - 1);
  };

  const handleUndo = () => {
      if (historyIndex > 0) {
          setHistoryIndex(historyIndex - 1);
      }
  };

  const handleRedo = () => {
      if (historyIndex < sectionHistory.length - 1) {
          setHistoryIndex(historyIndex + 1);
      }
  };

  // Image editing state
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [editingImage, setEditingImage] = useState<{ src: string; index: number } | null>(null);
  const [editError, setEditError] = useState<string | null>(null);

  // --- Wallet Integration: Eager Connect ---
  useEffect(() => {
    const eagerConnect = async () => {
        // Give a small delay for wallet injection
        await delay(100);

        if (window.solana?.isPhantom) {
            try {
                // Attempt to connect without prompt (only if trusted)
                const response = await window.solana.connect({ onlyIfTrusted: true });
                if (response.publicKey) {
                    setWalletAddress(response.publicKey.toString());
                    setWalletProvider('phantom');
                    setStep('DASHBOARD');
                }
            } catch (err) {
                // User has not connected before or rejected, silent fail
            }
        }
    };
    eagerConnect();
  }, []);

  // Auth Handlers
  const handleConnect = (address: string, provider: 'phantom' | 'solflare') => {
      setWalletAddress(address);
      setWalletProvider(provider);
      setStep('DASHBOARD');
  };

  const handleDisconnect = async () => {
      try {
          if (walletProvider === 'phantom' && window.solana) {
              await window.solana.disconnect();
          } else if (walletProvider === 'solflare' && window.solflare) {
              await window.solflare.disconnect();
          }
      } catch (e) {
          console.warn("Error disconnecting from wallet provider:", e);
      }

      setWalletAddress(null);
      setWalletProvider(null);
      setStep('DASHBOARD');
      setCurrentProjectId(null);
      setGeneratedImages([]);
      setProjects([]); // Clear in-memory projects on disconnect if you want to simulate "account" logout, but localStorage persists. Ideally, keys should be tied to wallet address.
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const base64 = await fileToBase64(file);
        setReferenceImage({ file, base64 });
      } catch (err) {
        setError('Failed to load image. Please try another one.');
      }
    }
  };

  // Refactored to accept raw base64 string and mimeType directly for easier chaining
  const generateImage = useCallback(async (currentPrompt: string, referenceBase64?: string, referenceMimeType: string = 'image/png') => {
    if (!process.env.API_KEY) {
      throw new Error("API key is not configured.");
    }
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    const imagePart = referenceBase64 ? {
        inlineData: {
            data: referenceBase64,
            mimeType: referenceMimeType,
        },
    } : null;

    // Enforce clean vector style to avoid "weird outlines" and ensure easy background removal
    // Added strict consistency instructions when a reference is provided
    const consistencyInstruction = referenceBase64 ? " strictly maintain this character's identity, exact colors, face, and body features, " : "";
    const styleSuffix = ", art style: highly expressive 2D vector mascot, single solo character, centered full body shot, clean smooth black vector outlines, no jagged edges, flat vibrant colors, comic book aesthetic, funny personality, sticker design, isolated on solid white background, high quality, no other characters, no background details";
    
    const finalPrompt = currentPrompt + consistencyInstruction + styleSuffix;

    const textPart = { text: finalPrompt };
    const parts = imagePart ? [imagePart, textPart] : [textPart];

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: { parts },
        config: {
            responseModalities: [Modality.IMAGE],
            safetySettings: [
                { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_ONLY_HIGH' },
                { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_ONLY_HIGH' },
                { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_ONLY_HIGH' },
                { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_ONLY_HIGH' },
            ],
        },
    });

    for (const part of response.candidates?.[0]?.content?.parts ?? []) {
        if (part.inlineData) {
            const rawBase64 = `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
            return await removeBackground(rawBase64);
        }
    }
    throw new Error("No image was generated by the API.");
  }, []);

  // Helper function for retry logic with stronger backoff for 429s
  const generateWithRetry = async (p: string, b64?: string, mime?: string, retries = 5): Promise<string> => {
      let lastError;
      for (let attempt = 0; attempt <= retries; attempt++) {
          try {
              return await generateImage(p, b64, mime);
          } catch (err: any) {
              lastError = err;
              const msg = err.message || '';
              const isRateLimit = msg.includes('429') || msg.includes('quota') || msg.includes('RESOURCE_EXHAUSTED');
              const isServerOverload = msg.includes('503') || msg.includes('500') || msg.includes('overloaded');
              
              if ((isRateLimit || isServerOverload) && attempt < retries) {
                  // Exponential backoff: 5s, 10s, 20s, 40s, 80s
                  const waitTime = 5000 * Math.pow(2, attempt); 
                  console.warn(`API Error (${isRateLimit ? 'Rate Limit' : 'Server'}). Retrying in ${waitTime}ms...`);
                  setGenerationStatus(`High traffic. Retrying in ${waitTime/1000}s...`);
                  await delay(waitTime);
                  continue;
              }
              throw err;
          }
      }
      throw lastError;
  };

  const handleGenerateInitial = async () => {
    if (!prompt) {
      setError('Please provide a prompt to generate an image.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setGeneratedImages([]);
    setSelectedImageIndex(0);
    setGenerationStatus('Initializing...');

    try {
      let anchorBase64 = referenceImage?.base64;
      let anchorMime = referenceImage?.file.type || 'image/png';

      setGenerationStatus('Generating character...');
      const anchorUrl = await generateWithRetry(prompt + ", solo character, standard pose, standing, full body", anchorBase64, anchorMime);
      
      setGeneratedImages([anchorUrl]);

    } catch (err) {
      console.error(err);
      const msg = err instanceof Error ? err.message : '';
      if (msg.includes('429') || msg.includes('quota')) {
          setError("Daily API Quota Exceeded. Please try again tomorrow or upgrade plan.");
      } else {
          setError(msg || 'An unknown error occurred during image generation.');
      }
    } finally {
      setIsLoading(false);
      setGenerationStatus('');
    }
  };

  const handleGenerateVariations = async () => {
      if (generatedImages.length === 0) return;

      setIsLoading(true);
      setError(null);
      setGenerationStatus('Preparing variations...');

      try {
          const anchorUrl = generatedImages[0];
          let anchorMime = 'image/png';
          let anchorBase64 = '';

          const matches = anchorUrl.match(/^data:(.+);base64,(.+)$/);
          if (matches) {
              anchorMime = matches[1];
              anchorBase64 = matches[2];
          }

          const variationPrompts = [
             prompt + ", dynamic action pose, jumping or running, energetic, excited, same character",
             prompt + ", very expressive face close up, zoom in, profile picture style, same character"
          ];

          for (let i = 0; i < variationPrompts.length; i++) {
              // Add delay to be kind to rate limits
              setGenerationStatus(`Cooling down API (5s)...`);
              await delay(5000);
              
              try {
                  setGenerationStatus(`Generating variation ${i + 1}/2...`);
                  const newImg = await generateWithRetry(variationPrompts[i], anchorBase64, anchorMime);
                  setGeneratedImages(prev => [...prev, newImg]);
              } catch (err: any) {
                  console.error(`Failed to generate variation ${i}`, err);
                  const msg = err.message || '';
                  if (msg.includes('429') || msg.includes('quota')) {
                       setGenerationStatus("Quota limit reached. Stopping variations.");
                       setError("Quota reached. Some variations could not be generated.");
                       break;
                  }
              }
          }

      } catch (err) {
          console.error(err);
          setError('Failed to generate variations.');
      } finally {
          setIsLoading(false);
          setGenerationStatus('');
      }
  };
  
  const handleProceedToBuilder = () => {
    if (generatedImages.length > 0) {
        // Clone the selected image into 4 independent slots for Hero, About, Buy, Tokenomics
        const selectedImage = generatedImages[selectedImageIndex];
        setGeneratedImages([selectedImage, selectedImage, selectedImage, selectedImage]);
        setStep('BUILD');
    }
  }

  const handleBackToGenerator = () => {
      setStep('GENERATE');
      setGeneratedImages([]);
      setReferenceImage(null);
      setSelectedImageIndex(0);
  }
  
  const handleBackToDashboard = () => {
      setStep('DASHBOARD');
  }

  const handleImageClickToEdit = (src: string, index: number) => {
    setEditingImage({ src, index });
    setIsEditModalOpen(true);
    setEditError(null);
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setEditingImage(null);
  };
  
  const handleEditImage = async (editPrompt: string, imageOverride?: string) => {
    if (!editingImage) return;

    setIsEditing(true);
    setEditError(null);

    try {
      if (!process.env.API_KEY) {
        throw new Error("API key is not configured.");
      }
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

      // Use imageOverride if provided (for brightness/contrast edits), otherwise use original
      const imageSrc = imageOverride || editingImage.src;
      const base64Data = imageSrc.split(',')[1];
      const mimeType = imageSrc.match(/data:(.*);base64,/)?.[1] || 'image/png';
      
      // Maintain style even during edits
      const styleSuffix = ", strictly maintain character identity and colors, maintain art style: 2D vector mascot, single solo character, clean smooth black vector outlines, flat colors, comic book aesthetic, no background characters, isolated on solid white background";

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: {
          parts: [
            {
              inlineData: {
                data: base64Data,
                mimeType: mimeType,
              },
            },
            {
              text: editPrompt + styleSuffix,
            },
          ],
        },
        config: {
          responseModalities: [Modality.IMAGE],
        },
      });

      for (const part of response.candidates?.[0]?.content?.parts ?? []) {
        if (part.inlineData) {
          const newImageSrc = `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
          // Process edited image to remove background again
          const processedImage = await removeBackground(newImageSrc);
          
          const newGeneratedImages = [...generatedImages];
          newGeneratedImages[editingImage.index] = processedImage;
          setGeneratedImages(newGeneratedImages);
          handleCloseEditModal();
          return;
        }
      }
      throw new Error("No image was generated by the API.");
    } catch (err) {
      console.error(err);
      const message = err instanceof Error ? err.message : 'An unknown error occurred during image editing.';
      setEditError(message);
    } finally {
      setIsEditing(false);
    }
  };

  const handleSaveEditedImage = (newImageSrc: string) => {
    if (!editingImage) return;
    const newGeneratedImages = [...generatedImages];
    newGeneratedImages[editingImage.index] = newImageSrc;
    setGeneratedImages(newGeneratedImages);
    handleCloseEditModal();
  };

  // RENDER LOGIC
  
  // If not connected, show Landing Page
  if (!walletAddress) {
      return <LandingPage onConnect={handleConnect} />;
  }

  // Main App
  return (
    <div className="min-h-screen font-sans bg-gradient-to-br from-slate-900 via-indigo-950 to-black text-gray-100 selection:bg-pink-500 selection:text-white">
      {/* Vibrant Header */}
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-white/10 bg-slate-900/60 backdrop-blur-xl shadow-lg shadow-purple-900/20">
        <div className="container mx-auto px-6 h-16 flex justify-between items-center">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => setStep('DASHBOARD')}>
             <span className="text-2xl">🚀</span>
             <h1 className="text-xl md:text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 drop-shadow-sm">
                MemeUniverse
             </h1>
          </div>
          
          <div className="flex items-center gap-4">
            {/* Wallet Address Badge */}
            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-black/30 rounded-full border border-white/10">
                <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
                <span className="text-xs font-mono text-indigo-200">
                    {walletAddress.slice(0, 4)}...{walletAddress.slice(-4)}
                </span>
            </div>
            
            {step === 'BUILD' ? (
                <button
                    onClick={handleBackToDashboard}
                    className="bg-gray-800/50 hover:bg-gray-700/80 text-white text-sm font-bold py-2 px-4 rounded-full border border-white/10 hover:border-purple-500/50 transition-all duration-300 flex items-center gap-2"
                >
                    <span>←</span> Dashboard
                </button>
            ) : step === 'GENERATE' ? (
                <button
                    onClick={handleBackToDashboard}
                    className="bg-gray-800/50 hover:bg-gray-700/80 text-white text-sm font-bold py-2 px-4 rounded-full border border-white/10 hover:border-purple-500/50 transition-all duration-300 flex items-center gap-2"
                >
                    <span>←</span> Dashboard
                </button>
            ) : (
                <button 
                    onClick={handleDisconnect}
                    className="text-xs font-bold text-gray-400 hover:text-red-400 transition-colors"
                >
                    Disconnect
                </button>
            )}
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 pt-24 pb-12 relative">
        {/* Background ambient glow */}
        <div className="fixed top-20 left-10 w-72 h-72 bg-purple-600/20 rounded-full blur-[100px] -z-10 pointer-events-none"></div>
        <div className="fixed bottom-10 right-10 w-96 h-96 bg-blue-600/20 rounded-full blur-[120px] -z-10 pointer-events-none"></div>

        {isLoading && (
            <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex flex-col justify-center items-center z-50">
                <Spinner className="h-16 w-16 text-pink-500" />
                <p className="text-xl mt-6 font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-pink-400 animate-pulse">
                    {generationStatus || 'Cooking up your meme universe...'}
                </p>
            </div>
        )}

        {error && (
          <div className="max-w-2xl mx-auto bg-red-500/10 border border-red-500/50 text-red-200 px-6 py-4 rounded-xl relative mb-8 backdrop-blur-md shadow-xl" role="alert">
            <strong className="font-bold flex items-center gap-2"><svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg> Limit Reached: </strong>
            <span className="block sm:inline mt-1">{error}</span>
            <button className="absolute top-4 right-4 text-red-300 hover:text-white" onClick={() => setError(null)}>
               <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>
        )}

        {step === 'DASHBOARD' && (
            <ProjectsDashboard 
                projects={projects}
                onCreateNew={handleCreateNewProject}
                onOpenProject={handleOpenProject}
                onDeleteProject={handleDeleteProject}
            />
        )}

        {step === 'GENERATE' && (
          <MemeGenerator
            prompt={prompt}
            setPrompt={setPrompt}
            referenceImage={referenceImage}
            handleImageChange={handleImageChange}
            handleGenerateClick={handleGenerateInitial}
            handleGenerateVariations={handleGenerateVariations}
            generatedImages={generatedImages}
            selectedImageIndex={selectedImageIndex}
            setSelectedImageIndex={setSelectedImageIndex}
            onProceed={handleProceedToBuilder}
            isGenerating={isLoading}
          />
        )}

        {step === 'BUILD' && (
          <WebsiteBuilder
            layouts={LAYOUTS}
            colorSchemes={COLOR_SCHEMES}
            fonts={GOOGLE_FONTS}
            selectedLayout={selectedLayout}
            setSelectedLayout={setSelectedLayout}
            selectedColorScheme={selectedColorScheme}
            setSelectedColorScheme={setSelectedColorScheme}
            selectedFont={selectedFont}
            setSelectedFont={setSelectedFont}
            customColors={customColors}
            setCustomColors={setCustomColors}
            sections={sections}
            setSections={handleSetSections}
            generatedImages={generatedImages}
            onImageClick={handleImageClickToEdit}
            onUndo={handleUndo}
            onRedo={handleRedo}
            canUndo={historyIndex > 0}
            canRedo={historyIndex < sectionHistory.length - 1}
            onSaveProject={handleSaveProject}
          />
        )}
      </main>
      {editingImage && (
        <EditImageModal
          isOpen={isEditModalOpen}
          onClose={handleCloseEditModal}
          imageSrc={editingImage.src}
          onGenerate={handleEditImage}
          onSave={handleSaveEditedImage}
          isLoading={isEditing}
          error={editError}
        />
      )}
    </div>
  );
};

export default App;
