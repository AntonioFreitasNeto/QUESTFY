import React, { useState, useRef } from 'react';
import { correctEssay } from '../services/geminiService';
import { Button } from './Button';

interface EssayCorrectionViewProps {
  credits: number;
  onBuyCredits: () => void;
  onBack: () => void;
  onConsumeCredit: () => void;
}

export const EssayCorrectionView: React.FC<EssayCorrectionViewProps> = ({ credits, onBuyCredits, onBack, onConsumeCredit }) => {
  const [image, setImage] = useState<string | null>(null);
  const [theme, setTheme] = useState('');
  const [result, setResult] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCorrection = async () => {
    if (credits <= 0) {
        onBuyCredits();
        return;
    }
    if (!image || !theme) {
        alert("Missing required items.");
        return;
    }

    setLoading(true);
    onConsumeCredit();
    
    const feedback = await correctEssay(image, theme);
    setResult(feedback);
    setLoading(false);
  };

  if (result) {
      return (
        <div className="min-h-screen bg-game-bg p-4 pb-24 overflow-y-auto text-white">
             <div className="flex items-center mb-6">
                <button onClick={() => setResult('')} className="mr-4 text-slate-400 hover:text-white">
                    ← Back
                </button>
                <h2 className="font-black text-xl uppercase italic">Evaluation Result</h2>
             </div>
             <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700 font-mono text-sm text-slate-300 whitespace-pre-line">
                {result}
             </div>
             <Button fullWidth className="mt-6" onClick={() => {
                 setResult('');
                 setImage(null);
                 setTheme('');
             }}>
                 New Scan
             </Button>
        </div>
      )
  }

  return (
    <div className="min-h-screen bg-game-bg p-4 pb-24 flex flex-col text-white">
        <div className="flex items-center justify-between mb-6">
            <button onClick={onBack} className="text-slate-400 p-2 rounded hover:bg-slate-800">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
            </button>
            <div className="flex items-center gap-2 bg-slate-900 px-3 py-1 rounded border border-emerald-500/50">
                <span className="text-lg">💎</span>
                <span className="font-bold text-emerald-400 text-sm">{credits} GEMS</span>
                <button onClick={onBuyCredits} className="bg-emerald-600 text-white w-5 h-5 rounded flex items-center justify-center text-xs font-bold ml-1 hover:bg-emerald-500">+</button>
            </div>
        </div>

        <div className="bg-slate-800/80 p-6 rounded-3xl border border-slate-700 flex-1 flex flex-col">
            <h1 className="text-2xl font-black text-white mb-1 uppercase italic">Scroll Scanner</h1>
            <p className="text-slate-400 text-xs mb-6 font-mono">Upload handwritten document for AI analysis.</p>

            {loading ? (
                <div className="flex-1 flex flex-col items-center justify-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-emerald-500 mb-6"></div>
                    <p className="font-bold text-emerald-400 text-lg uppercase animate-pulse">Scanning...</p>
                </div>
            ) : (
                <div className="space-y-6">
                    <div>
                        <label className="block text-xs font-bold text-slate-400 uppercase mb-2">1. Topic Title</label>
                        <input 
                            type="text" 
                            className="w-full bg-slate-900 border border-slate-600 rounded-xl p-4 focus:border-emerald-500 outline-none text-white transition-colors"
                            placeholder="Input topic..."
                            value={theme}
                            onChange={(e) => setTheme(e.target.value)}
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-slate-400 uppercase mb-2">2. Upload Image</label>
                        <div 
                            onClick={() => fileInputRef.current?.click()}
                            className={`border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center cursor-pointer transition-colors ${image ? 'border-emerald-500 bg-emerald-900/20' : 'border-slate-600 hover:bg-slate-700/50'}`}
                        >
                            {image ? (
                                <div className="relative w-full h-48">
                                    <img src={image} alt="Preview" className="w-full h-full object-contain rounded-lg" />
                                    <div className="absolute inset-0 flex items-center justify-center bg-black/50 text-white font-bold opacity-0 hover:opacity-100 transition-opacity rounded-lg uppercase">Change</div>
                                </div>
                            ) : (
                                <>
                                    <span className="text-4xl mb-2 grayscale opacity-70">📸</span>
                                    <span className="text-sm font-bold text-slate-400 uppercase">Tap to Capture</span>
                                </>
                            )}
                            <input 
                                ref={fileInputRef} 
                                type="file" 
                                accept="image/*" 
                                className="hidden" 
                                onChange={handleFileChange} 
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>

        {!loading && (
            <div className="mt-4">
                <Button 
                    fullWidth 
                    onClick={handleCorrection}
                    variant={credits > 0 ? 'primary' : 'secondary'}
                    className={credits > 0 ? 'bg-emerald-600 border-emerald-900' : ''}
                >
                    {credits > 0 ? 'Start Analysis (-1 GEM)' : 'Refill Gems'}
                </Button>
            </div>
        )}
    </div>
  );
};