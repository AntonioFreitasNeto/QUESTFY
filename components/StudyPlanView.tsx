
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
    // Mocking "weakness context" - normally this comes from DB
    const mockWeakness = "O aluno tem errado muitas questões de probabilidade e geometria plana.";
    
    const result = await generateAdaptiveStudyPlan(subject, mockWeakness);
    setPlan(result);
    setLoading(false);
  };

  if (!isPremium) {
    return (
      <div className="p-6 h-screen flex flex-col bg-gray-50">
        <button onClick={onBack} className="text-gray-500 mb-4 font-bold flex items-center gap-2">
            ← Voltar
        </button>
        
        <div className="flex-1 flex flex-col items-center justify-center text-center">
            <div className="w-20 h-20 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center text-4xl mb-6 shadow-lg">
                📅
            </div>
            <h2 className="text-2xl font-black text-gray-900 mb-2">Plano Adaptativo</h2>
            <p className="text-gray-600 mb-8 max-w-xs">
                A IA analisa seus erros e cria um cronograma semanal focado exatamente no que você precisa estudar para passar.
            </p>
            <div className="w-full bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-6 opacity-75 blur-[1px]">
                <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3"></div>
            </div>
            <Button onClick={onUpgradeClick} fullWidth variant="primary" className="shadow-xl bg-gradient-to-r from-purple-600 to-purple-800 border-none">
                Desbloquear Plano de Estudos
            </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 pb-24 overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
            <button onClick={onBack} className="text-gray-500 p-2 rounded-full hover:bg-gray-100">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
            </button>
            <h2 className="text-lg font-bold text-gray-800">Plano de Estudos IA</h2>
            <div className="w-10"></div>
        </div>

        {!plan && !loading && (
            <div className="animate-fade-in">
                <p className="text-gray-600 mb-4 font-medium">Escolha uma área para gerar seu plano semanal focado em suas dificuldades:</p>
                <div className="grid grid-cols-1 gap-3">
                    {subjects.map(sub => (
                        <button
                            key={sub}
                            onClick={() => handleGenerate(sub)}
                            className="p-4 bg-white border border-gray-200 rounded-xl text-left hover:border-purple-500 hover:shadow-md transition-all flex items-center justify-between group"
                        >
                            <span className="font-bold text-gray-700 group-hover:text-purple-700">{sub}</span>
                            <span className="bg-purple-50 text-purple-600 p-2 rounded-full">
                                →
                            </span>
                        </button>
                    ))}
                </div>
            </div>
        )}

        {loading && (
            <div className="flex flex-col items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mb-4"></div>
                <p className="text-purple-800 font-bold">Analisando seus erros...</p>
                <p className="text-sm text-gray-500">Criando cronograma personalizado para {selectedSubject}</p>
            </div>
        )}

        {plan && !loading && (
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 animate-fade-in">
                <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-100">
                    <h3 className="font-bold text-purple-800 text-lg">{selectedSubject}</h3>
                    <button 
                        onClick={() => setPlan('')} 
                        className="text-xs text-gray-400 underline"
                    >
                        Novo Plano
                    </button>
                </div>
                
                <div className="prose prose-sm max-w-none prose-purple">
                    <div className="whitespace-pre-line text-gray-700 leading-relaxed">
                        {plan}
                    </div>
                </div>

                <div className="mt-8">
                     <Button fullWidth onClick={() => alert("Simulando início de sessão de estudos...")}>
                        Iniciar Dia 1
                     </Button>
                </div>
            </div>
        )}
    </div>
  );
};
