import React, { useState, useEffect } from 'react';
import { generatePerformanceReport } from '../services/geminiService';
import { Button } from './Button';

interface ReportViewProps {
  isPremium: boolean;
  onUpgradeClick: () => void;
}

export const ReportView: React.FC<ReportViewProps> = ({ isPremium, onUpgradeClick }) => {
  const [report, setReport] = useState<string>('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isPremium && !report) {
      setLoading(true);
      const mockStats = [
        { subject: 'Matemática', correct: 2, total: 10 },
        { subject: 'Linguagens', correct: 8, total: 10 },
        { subject: 'Ciências da Natureza', correct: 3, total: 8 }
      ];
      
      generatePerformanceReport(mockStats).then((text) => {
        setReport(text);
        setLoading(false);
      });
    }
  }, [isPremium]);

  if (!isPremium) {
    return (
      <div className="p-6 relative h-[calc(100vh-80px)] overflow-hidden bg-game-bg">
        <h2 className="text-2xl font-black text-white mb-2 uppercase italic">Mentor Protocol</h2>
        <p className="text-slate-400 mb-6 text-sm">Analyze combat data to improve performance.</p>

        {/* Blurred Content Placeholder */}
        <div className="filter blur-md opacity-20 space-y-4 select-none">
            <div className="h-40 bg-slate-700 rounded-xl w-full"></div>
            <div className="h-8 bg-slate-700 rounded w-3/4"></div>
            <div className="h-4 bg-slate-700 rounded w-full"></div>
            <div className="h-4 bg-slate-700 rounded w-full"></div>
        </div>

        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center p-6 bg-gradient-to-b from-transparent to-slate-900">
             <div className="w-16 h-16 bg-slate-800 text-cyan-400 rounded-xl border border-cyan-500 flex items-center justify-center text-3xl mb-4 shadow-[0_0_20px_rgba(6,182,212,0.3)]">
                🔒
             </div>
             <h3 className="font-bold text-xl text-white mb-2 uppercase">Premium Feature</h3>
             <p className="text-center text-slate-400 mb-6 text-sm">
                Unlock advanced combat analytics.
             </p>
             <Button onClick={onUpgradeClick} fullWidth variant="gold" className="shadow-xl">
                Unlock Now
             </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 pb-24 overflow-y-auto h-screen bg-game-bg text-white">
      <h2 className="text-2xl font-black text-white mb-4 flex items-center gap-2 uppercase italic">
        <span className="text-cyan-400">✦</span> Combat Log
      </h2>

      {loading ? (
        <div className="flex flex-col items-center justify-center h-64 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-cyan-500 mb-4"></div>
            <p className="text-cyan-400 font-mono text-sm animate-pulse">Analyzing Data Stream...</p>
        </div>
      ) : (
        <div className="bg-slate-800/80 rounded-2xl p-6 border border-slate-700 font-mono text-sm">
           <div className="whitespace-pre-line text-slate-300 leading-relaxed">
             {report}
           </div>
           
           <div className="mt-8 pt-6 border-t border-slate-700">
             <p className="text-xs text-slate-500 text-center uppercase tracking-widest">
                AI Mentor System v2.5
             </p>
           </div>
        </div>
      )}
    </div>
  );
};