import React, { useState, useEffect } from 'react';
import { generatePerformanceReport } from '../services/geminiService';
import { Button } from './Button';
import ReactMarkdown from 'react-markdown'; // Assuming we process text, but we'll stick to simple text for now if lib not avail. Using simple rendering.

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
      // Mock stats for the AI to analyze (in a real app this comes from DB)
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
      <div className="p-6 relative h-[calc(100vh-80px)] overflow-hidden">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Relatório de Desempenho IA</h2>
        <p className="text-gray-500 mb-6">Nossa IA analisa onde você errou e cria um plano de estudo personalizado.</p>

        {/* Blurred Content Placeholder */}
        <div className="filter blur-sm opacity-50 space-y-4 select-none">
            <div className="h-40 bg-gray-200 rounded-xl w-full"></div>
            <div className="h-8 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-full"></div>
            <div className="h-4 bg-gray-200 rounded w-full"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
        </div>

        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center p-6 bg-gradient-to-b from-transparent to-white/90">
             <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-3xl mb-4">
                🤖
             </div>
             <h3 className="font-bold text-xl text-gray-900 mb-2">Funcionalidade Premium</h3>
             <p className="text-center text-gray-600 mb-6 text-sm">
                Descubra seus pontos fracos e receba direcionamento de estudo exclusivo com nossa IA.
             </p>
             <Button onClick={onUpgradeClick} fullWidth variant="primary" className="shadow-xl">
                Desbloquear Relatório
             </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 pb-24 overflow-y-auto h-screen bg-gray-50">
      <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
        <span className="text-blue-600">✦</span> Mentoria IA
      </h2>

      {loading ? (
        <div className="flex flex-col items-center justify-center h-64 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mb-4"></div>
            <p className="text-gray-500 font-medium animate-pulse">Analisando suas respostas...</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 prose prose-sm max-w-none">
           <div className="whitespace-pre-line text-gray-700 leading-relaxed">
             {report}
           </div>
           
           <div className="mt-8 pt-6 border-t border-gray-100">
             <p className="text-xs text-gray-400 text-center">
                Gerado por Gemini AI com base no seu histórico recente.
             </p>
           </div>
        </div>
      )}
    </div>
  );
};