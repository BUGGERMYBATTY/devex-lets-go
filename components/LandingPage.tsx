
import React, { useState } from 'react';

interface LandingPageProps {
  onConnect: (address: string, provider: 'phantom' | 'solflare') => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onConnect }) => {
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const connectPhantom = async () => {
    setError(null);
    setIsConnecting(true);
    try {
      const { solana } = window;
      if (solana?.isPhantom) {
        const response = await solana.connect();
        onConnect(response.publicKey.toString(), 'phantom');
      } else {
        window.open('https://phantom.app/', '_blank');
        setError('Phantom wallet not found. Redirecting to download...');
      }
    } catch (err: any) {
      console.error(err);
      setError('User rejected the connection.');
    } finally {
      setIsConnecting(false);
    }
  };

  const connectSolflare = async () => {
    setError(null);
    setIsConnecting(true);
    try {
      const { solflare } = window;
      if (solflare?.isSolflare) {
        await solflare.connect();
        // Solflare API slightly differs, we access publicKey property after connect
        const publicKey = (window as any).solflare.publicKey?.toString();
        if (publicKey) {
             onConnect(publicKey, 'solflare');
        } else {
            setError('Failed to retrieve public key.');
        }
      } else {
        window.open('https://solflare.com/', '_blank');
        setError('Solflare wallet not found. Redirecting to download...');
      }
    } catch (err: any) {
      console.error(err);
      setError('User rejected the connection.');
    } finally {
      setIsConnecting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden font-sans text-white">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-purple-950 to-black -z-20"></div>
      <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20 -z-10"></div>
      <div className="absolute top-20 left-20 w-96 h-96 bg-purple-600/30 rounded-full blur-[120px] -z-10 animate-pulse"></div>
      <div className="absolute bottom-20 right-20 w-80 h-80 bg-blue-600/20 rounded-full blur-[100px] -z-10"></div>

      {/* Navigation */}
      <nav className="w-full p-6 flex justify-between items-center z-10">
        <div className="flex items-center gap-2">
           <span className="text-3xl">🚀</span>
           <h1 className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400">
              MemeUniverse
           </h1>
        </div>
        <div className="text-sm font-bold text-gray-400 uppercase tracking-widest hidden md:block">
            Build The Next Moonshot
        </div>
      </nav>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center text-center px-4 relative z-10">
        
        <div className="mb-8 animate-bounce-slow">
            <span className="inline-block py-1 px-3 rounded-full bg-white/10 border border-white/20 text-pink-300 text-xs font-bold uppercase tracking-wider mb-4 backdrop-blur-md">
                v2.0 Now Live
            </span>
        </div>

        <h1 className="text-5xl md:text-7xl font-black mb-6 leading-tight max-w-4xl">
           Create Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500">Meme Coin</span> Brand in Seconds.
        </h1>
        
        <p className="text-lg md:text-xl text-indigo-200 mb-12 max-w-2xl leading-relaxed">
            Generate unique AI characters, build a complete website, and launch your narrative. 
            Login with your wallet to start building on Solana.
        </p>

        {/* Wallet Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md">
            <button 
                onClick={connectPhantom}
                disabled={isConnecting}
                className="flex-1 flex items-center justify-center gap-3 bg-[#AB9FF2] hover:bg-[#9a8ce8] text-black font-bold py-4 px-6 rounded-xl shadow-[0_0_20px_rgba(171,159,242,0.4)] hover:shadow-[0_0_30px_rgba(171,159,242,0.6)] hover:-translate-y-1 transition-all duration-300"
            >
                 <img 
                    src="https://mintcdn.com/phantom-e50e2e68/fkWrmnMWhjoXSGZ9/resources/images/Phantom_SVG_Icon.svg?w=840&fit=max&auto=format&n=fkWrmnMWhjoXSGZ9&q=85&s=7311f84864aeebc085a674acff85ff99" 
                    alt="Phantom" 
                    className="w-8 h-8"
                 />
                 {isConnecting ? 'Connecting...' : 'Connect Phantom'}
            </button>

            <button 
                onClick={connectSolflare}
                disabled={isConnecting}
                className="flex-1 flex items-center justify-center gap-3 bg-[#FFD140] hover:bg-[#ffc400] text-black font-bold py-4 px-6 rounded-xl shadow-[0_0_20px_rgba(255,209,64,0.4)] hover:shadow-[0_0_30px_rgba(255,209,64,0.6)] hover:-translate-y-1 transition-all duration-300"
            >
                 <img 
                    src="https://www.solflare.com/wp-content/uploads/2024/11/App-Icon.svg" 
                    alt="Solflare" 
                    className="w-8 h-8 bg-white rounded-full p-0.5"
                 />
                 {isConnecting ? 'Connecting...' : 'Connect Solflare'}
            </button>
        </div>

        {error && (
            <div className="mt-6 text-red-300 bg-red-500/10 border border-red-500/20 px-4 py-2 rounded-lg text-sm">
                {error}
            </div>
        )}

        {/* Feature Grid */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl w-full">
            <FeatureCard 
                emoji="🎨" 
                title="AI Character Gen" 
                desc="Create unique, consistent mascots with a single prompt." 
            />
            <FeatureCard 
                emoji="🌐" 
                title="Site Builder" 
                desc="Deploy a full crypto website with tokenomics and roadmap." 
            />
            <FeatureCard 
                emoji="⚡" 
                title="Solana Ready" 
                desc="Optimized styles for the fastest ecosystem on earth." 
            />
        </div>

      </main>
      
      <style>{`
        @keyframes bounce-slow {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-10px); }
        }
        .animate-bounce-slow {
            animation: bounce-slow 3s infinite ease-in-out;
        }
      `}</style>
    </div>
  );
};

const FeatureCard: React.FC<{emoji: string, title: string, desc: string}> = ({ emoji, title, desc }) => (
    <div className="bg-white/5 backdrop-blur-md border border-white/10 p-6 rounded-2xl hover:bg-white/10 transition-colors text-left">
        <div className="text-4xl mb-4">{emoji}</div>
        <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
        <p className="text-indigo-200 text-sm">{desc}</p>
    </div>
);
