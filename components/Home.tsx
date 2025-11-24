
import React from 'react';
import { Button } from './Button';
import { User } from '../types';

interface HomeProps {
  user: User;
  onStartGlobal: () => void;
  onStartMini: () => void;
  onStartSubject: (subject: string | null) => void;
  onOpenReport: () => void;
  onOpenStudyPlan: () => void;
  onOpenEssay: () => void;
}

export const Home: React.FC<HomeProps> = ({ 
  user, 
  onStartGlobal, 
  onStartMini, 
  onOpenReport, 
  onStartSubject,
  onOpenStudyPlan,
  onOpenEssay
}) => {
  
  const subjects = [
    { id: 'Linguagens', label: 'Linguagens e Códigos', icon: '📚', color: 'bg-red-50 text-red-600 border-red-100' },
    { id: 'Ciências Humanas', label: 'Ciências Humanas', icon: '🏛️', color: 'bg-amber-50 text-amber-600 border-amber-100' },
    { id: 'Ciências da Natureza', label: 'Ciências da Natureza', icon: '🧬', color: 'bg-green-50 text-green-600 border-green-100' },
    { id: 'Matemática', label: 'Matemática', icon: '📐', color: 'bg-blue-50 text-blue-600 border-blue-100' },
  ];

  return (
    <div className="px-5 pt-8 pb-24">
      {/* Header User */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900">Olá, {user.name.split(' ')[0]}! 👋</h1>
          <p className="text-gray-500 text-sm">Pronto para conquistar o ENEM?</p>
        </div>
        <div className="flex flex-col items-end">
             <div className="flex items-center gap-1 bg-accent-400/20 text-accent-500 px-3 py-1 rounded-full">
                <span className="text-lg">🔥</span>
                <span className="font-bold text-sm">{user.streak} dias</span>
             </div>
        </div>
      </div>

      {/* XP Card */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-800 rounded-3xl p-6 text-white shadow-xl shadow-primary-500/30 mb-8 relative overflow-hidden">
        <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/10 rounded-full blur-2xl"></div>
        <div className="relative z-10">
          <p className="text-primary-100 text-sm font-medium mb-1">Sua Pontuação Total</p>
          <h2 className="text-4xl font-black mb-4">{user.score.toLocaleString()} XP</h2>
          <div className="flex justify-between items-end">
             <div className="flex gap-2">
                <div className="bg-white/20 px-3 py-1.5 rounded-lg text-xs font-medium">
                    Questões: {user.questionsAnswered}
                </div>
                {!user.isPremium && (
                    <div className="bg-orange-500/80 px-3 py-1.5 rounded-lg text-xs font-bold text-white border border-orange-400">
                        {Math.max(0, 20 - user.questionsAnswered)} grátis restantes
                    </div>
                )}
             </div>
          </div>
        </div>
      </div>

      <h3 className="font-bold text-lg text-gray-800 mb-4">Acelere sua Aprovação</h3>
      
      {/* AI Report Card */}
      <div 
        onClick={onOpenReport}
        className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-4 mb-4 border border-blue-100 flex items-center justify-between cursor-pointer active:scale-95 transition-transform"
      >
        <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-xl shadow-sm">
                🤖
            </div>
            <div>
                <h4 className="font-bold text-blue-900 text-sm">Relatório IA Mentor</h4>
                <p className="text-blue-700 text-xs">Análise de erros e dicas</p>
            </div>
        </div>
        <div className="bg-white text-blue-600 p-2 rounded-full shadow-sm">
             <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
        </div>
      </div>

      {/* NEW: Premium Features Grid */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        {/* Study Plan */}
        <button 
            onClick={onOpenStudyPlan}
            className="p-3 bg-gradient-to-br from-purple-50 to-fuchsia-50 border border-purple-100 rounded-2xl flex flex-col gap-2 text-left active:scale-95 transition-transform relative overflow-hidden"
        >
            <div className="flex justify-between w-full items-start">
                 <span className="text-2xl">📅</span>
                 {!user.isPremium && <span className="text-xs bg-gray-900 text-white px-1.5 rounded">PRO</span>}
            </div>
            <div>
                <h4 className="font-bold text-purple-900 text-sm leading-tight">Plano de Estudo</h4>
                <p className="text-[10px] text-purple-700 mt-1">Adaptativo e focado nos erros</p>
            </div>
        </button>

        {/* Essay Correction */}
        <button 
            onClick={onOpenEssay}
            className="p-3 bg-gradient-to-br from-teal-50 to-emerald-50 border border-teal-100 rounded-2xl flex flex-col gap-2 text-left active:scale-95 transition-transform"
        >
            <div className="flex justify-between w-full items-start">
                 <span className="text-2xl">📝</span>
                 <div className="flex items-center bg-teal-200/50 px-1.5 rounded border border-teal-200">
                    <span className="text-[10px] font-bold text-teal-800">{user.essayCredits} cre.</span>
                 </div>
            </div>
             <div>
                <h4 className="font-bold text-teal-900 text-sm leading-tight">Corrigir Redação</h4>
                <p className="text-[10px] text-teal-700 mt-1">Correção IA por imagem</p>
            </div>
        </button>
      </div>

      <h3 className="font-bold text-lg text-gray-800 mb-4">Treinar por Área</h3>
      
      <div className="grid grid-cols-2 gap-3 mb-3">
        {subjects.map((sub) => (
          <button 
            key={sub.id}
            onClick={() => onStartSubject(sub.id)}
            className={`p-4 rounded-2xl border flex flex-col items-center justify-center gap-2 transition-all active:scale-95 hover:shadow-md ${sub.color}`}
          >
             <span className="text-3xl">{sub.icon}</span>
             <span className="text-xs font-bold text-center leading-tight">{sub.label}</span>
          </button>
        ))}
      </div>

      {/* Simulado Geral Button */}
      <button 
        onClick={() => onStartSubject(null)}
        className="w-full p-4 mb-8 rounded-2xl border border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100 flex items-center justify-center gap-3 transition-all active:scale-95 hover:shadow-md hover:bg-gray-50"
      >
        <span className="text-2xl">🎲</span>
        <div className="text-left">
            <span className="block text-gray-800 font-bold text-sm">Simulado Geral</span>
            <span className="block text-gray-500 text-xs">Mistura de todas as matérias</span>
        </div>
      </button>

      <h3 className="font-bold text-lg text-gray-800 mb-4">Desafios Especiais</h3>

      <div className="grid grid-cols-1 gap-5">
        {/* Global Challenge Card */}
        <div 
          onClick={onStartGlobal}
          className="bg-white rounded-2xl p-5 border-2 border-transparent hover:border-primary-100 shadow-sm hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-start justify-between mb-3">
             <div className="w-12 h-12 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                🌍
             </div>
             <span className="bg-purple-50 text-purple-700 text-[10px] font-bold px-2 py-1 rounded uppercase">5 últimas provas</span>
          </div>
          <h4 className="font-bold text-gray-900 text-lg mb-1">Desafio Global</h4>
          <p className="text-gray-500 text-sm mb-4">Simulado completo com questões reais dos últimos 5 anos. Competição nacional.</p>
          <Button fullWidth variant="primary" className="text-sm">Iniciar Agora</Button>
        </div>
      </div>
    </div>
  );
};
