import React from 'react';
import { Button } from './Button';

interface EssayCreditModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBuy: (amount: number) => void;
}

export const EssayCreditModal: React.FC<EssayCreditModalProps> = ({ isOpen, onClose, onBuy }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose}></div>
      <div className="bg-slate-900 w-full max-w-sm rounded-3xl p-6 relative z-10 border-2 border-emerald-500/50 shadow-[0_0_50px_rgba(16,185,129,0.2)]">
        
        <div className="text-center mb-6">
            <div className="w-16 h-16 bg-emerald-900/40 text-emerald-400 rounded-full flex items-center justify-center text-3xl mx-auto mb-4 border border-emerald-500/50">
                💎
            </div>
            <h2 className="text-2xl font-black text-white mb-2 uppercase italic">Acquire Gems</h2>
            <p className="text-slate-400 text-sm font-mono">
                Used for High-Level AI Analysis.
            </p>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
            <button 
                onClick={() => onBuy(1)}
                className="p-4 rounded-xl border-2 border-slate-700 hover:border-emerald-500 bg-slate-800 transition-all text-center group"
            >
                <span className="block text-2xl font-black text-emerald-400">1</span>
                <span className="text-xs text-slate-400 uppercase font-bold">GEM</span>
                <div className="mt-2 bg-slate-700 rounded py-1 text-sm font-bold text-white group-hover:bg-emerald-600 transition-colors">
                    $ 4,90
                </div>
            </button>
            
            <button 
                onClick={() => onBuy(5)}
                className="p-4 rounded-xl border-2 border-emerald-500 bg-slate-800 relative overflow-hidden transition-all text-center shadow-[0_0_20px_rgba(16,185,129,0.2)] transform hover:-translate-y-1"
            >
                <div className="absolute top-0 right-0 bg-red-500 text-white text-[9px] font-bold px-2 py-0.5 rounded-bl">
                    BEST LOOT
                </div>
                <span className="block text-2xl font-black text-emerald-400">5</span>
                <span className="text-xs text-slate-400 uppercase font-bold">GEMS</span>
                <div className="mt-2 bg-emerald-600 rounded py-1 text-sm font-bold text-white">
                    $ 19,90
                </div>
            </button>
        </div>

        <Button fullWidth onClick={onClose} variant="secondary">
            Cancel
        </Button>
      </div>
    </div>
  );
};