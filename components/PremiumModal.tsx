import React from 'react';
import { Button } from './Button';

interface PremiumModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpgrade: () => void;
  reason?: 'LIMIT_REACHED' | 'REPORT_LOCKED';
}

export const PremiumModal: React.FC<PremiumModalProps> = ({ isOpen, onClose, onUpgrade, reason }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/90 backdrop-blur-sm" onClick={onClose}></div>
      <div className="bg-slate-900 w-full max-w-sm rounded-3xl p-6 relative z-10 border-2 border-gold shadow-[0_0_50px_rgba(251,191,36,0.3)]">
        
        <div className="text-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-yellow-500 to-yellow-700 rounded-full flex items-center justify-center text-3xl shadow-lg mx-auto mb-4 text-white border-4 border-slate-900">
                👑
            </div>
            <h2 className="text-2xl font-black text-white mb-2 uppercase italic">Season Pass</h2>
            
            {reason === 'LIMIT_REACHED' && (
                <p className="text-red-400 font-bold bg-red-900/20 border border-red-500/50 py-2 rounded mb-2 text-xs uppercase">
                    Stamina Depleted (Daily Limit Reached)
                </p>
            )}
             {reason === 'REPORT_LOCKED' && (
                <p className="text-cyan-400 font-bold bg-cyan-900/20 border border-cyan-500/50 py-2 rounded mb-2 text-xs uppercase">
                    Unlock Premium Intel
                </p>
            )}

            <p className="text-slate-400 text-sm font-mono">
                Upgrade to Elite Status.
            </p>
        </div>

        <div className="space-y-3 mb-8">
            <div className="flex items-center gap-3">
                <span className="text-gold text-xl">✓</span>
                <span className="text-slate-300 text-sm">Infinite Stamina (Questions)</span>
            </div>
            <div className="flex items-center gap-3">
                <span className="text-gold text-xl">✓</span>
                <span className="text-slate-300 text-sm">AI Mentor Access</span>
            </div>
            <div className="flex items-center gap-3">
                <span className="text-gold text-xl">✓</span>
                <span className="text-slate-300 text-sm">Elite Leaderboard</span>
            </div>
        </div>

        <div className="bg-slate-800 p-4 rounded-xl text-center mb-6 border border-slate-700">
            <span className="block text-slate-500 text-xs line-through">$ 29,90</span>
            <span className="block text-gold font-black text-3xl shadow-gold">$ 19,90</span>
            <span className="text-slate-400 text-xs font-bold uppercase">/ Month</span>
        </div>

        <div className="space-y-3">
            <Button fullWidth onClick={onUpgrade} variant="gold">
                Unlock Elite Pass
            </Button>
            <Button fullWidth onClick={onClose} variant="secondary">
                Later
            </Button>
        </div>
      </div>
    </div>
  );
};