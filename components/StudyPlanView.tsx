import React, { useState } from 'react';
import { generateAdaptiveStudyPlan } from '../services/geminiService';
import { Button } from './Button';

interface StudyPlanViewProps {
  isPremium: boolean;
  onUpgradeClick: () => void;
  onBack: () => void;
}

export const StudyPlanView: React.FC<StudyPlanViewProps> = ({ isPremium, onUpgradeClick, onBack }) => {
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
  const [plan, setPlan] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const subjects = ['Matemática', 'Linguagens', 'Ciências Humanas', 'Ciências da Natureza'];

  const handleGenerate = async (subject: string) => {
    setSelectedSubject(subject);
    setLoading(true);
    const mockWeakness = "O aluno tem errado muitas questões de probabilidade e geometria plana.";
    const result = await generateAdaptiveStudyPlan(subject, mockWeakness);
    setPlan(result);
    setLoading(false);
  };

  if (!isPremium) {
    return (
      <div className="p-6 h-screen flex flex-col bg-game-bg">
        <button onClick={onBack} className="text-slate-400 mb-4 font-bold flex items-center gap-2 uppercase text-xs">
            ← Back
        </button>
        
        <div className="flex-1 flex flex-col items-center justify-center text-center">
            <div className="w-20 h-20 bg-purple-900/30 text-purple-400 rounded-full border border-purple-500 flex items-center justify-center text-4xl mb-6 shadow-[0_0_30px_rgba(168,85,247,0.2)]">
                📅
            </div>
            <h2 className="text-2xl font-black text-white mb-2 uppercase">Locked Content</h2>
            <p className="text-slate-400 mb-8 max-w-xs text-sm">
                Adaptive campaign maps are available for premium players only.
            </p>
            <Button onClick={onUpgradeClick} fullWidth variant="primary">
                Unlock Map
            </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-game-bg p-4 pb-24 overflow-y-auto text-white">
        <div className="flex items-center justify-between mb-6">
            <button onClick={onBack} className="text-slate-400 p-2 rounded hover:bg-slate-800">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
            </button>
            <h2 className="text-lg font-bold text-white uppercase tracking-widest">Campaign Map</h2>
            <div className="w-10"></div>
        </div>

        {!plan && !loading && (
            <div className="animate-fade-in">
                <p className="text-slate-400 mb-4 font-mono text-sm">Select target sector for tactical analysis:</p>
                <div className="grid grid-cols-1 gap-3">
                    {subjects.map(sub => (
                        <button
                            key={sub}
                            onClick={() => handleGenerate(sub)}
                            className="p-4 bg-slate-800 border border-slate-700 rounded-xl text-left hover:border-purple-500 hover:shadow-[0_0_15px_rgba(168,85,247,0.3)] transition-all flex items-center justify-between group"
                        >
                            <span className="font-bold text-slate-200 group-hover:text-purple-400 uppercase">{sub}</span>
                            <span className="bg-slate-900 text-purple-500 p-2 rounded">
                                →
                            </span>
                        </button>
                    ))}
                </div>
            </div>
        )}

        {loading && (
            <div className="flex flex-col items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-purple-500 mb-4"></div>
                <p className="text-purple-400 font-bold uppercase">Generating Path...</p>
            </div>
        )}

        {plan && !loading && (
            <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700 animate-fade-in shadow-xl">
                <div className="flex items-center justify-between mb-4 pb-4 border-b border-slate-700">
                    <h3 className="font-bold text-purple-400 text-lg uppercase">{selectedSubject}</h3>
                    <button 
                        onClick={() => setPlan('')} 
                        className="text-xs text-slate-500 hover:text-white uppercase"
                    >
                        Reset
                    </button>
                </div>
                
                <div className="text-slate-300 text-sm leading-relaxed whitespace-pre-line font-mono">
                     {plan}
                </div>

                <div className="mt-8">
                     <Button fullWidth onClick={() => alert("Simulando início de sessão...")}>
                        Start Mission
                     </Button>
                </div>
            </div>
        )}
    </div>
  );
};