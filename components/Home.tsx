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
    { id: 'Linguagens', label: 'Linguagens', icon: '📜', color: 'border-red-500 text-red-400 bg-red-900/20' },
    { id: 'Ciências Humanas', label: 'Humanas', icon: '🏛️', color: 'border-amber-500 text-amber-400 bg-amber-900/20' },
    { id: 'Ciências da Natureza', label: 'Natureza', icon: '🧪', color: 'border-emerald-500 text-emerald-400 bg-emerald-900/20' },
    { id: 'Matemática', label: 'Matemática', icon: '📐', color: 'border-blue-500 text-blue-400 bg-blue-900/20' },
  ];

  return (
    <div className="px-5 pt-8 pb-28">
      {/* HUD Header */}
      <div className="flex items-center gap-4 mb-8">
        <div className="relative">
             <div className="w-16 h-16 rounded-xl border-2 border-indigo-500 p-1 bg-slate-800">
                <img src={user.avatar} alt="Avatar" className="w-full h-full rounded-lg object-cover" />
             </div>
             <div className="absolute -bottom-2 -right-2 bg-indigo-600 text-xs font-bold px-2 py-0.5 rounded border border-slate-900">
                LVL {Math.floor(user.score / 1000) + 1}
             </div>
        </div>
        <div className="flex-1">
            <h1 className="text-xl font-bold text-white leading-none mb-1">{user.name.split(' ')[0]}</h1>
            <div className="w-full bg-slate-700 h-3 rounded-full overflow-hidden border border-slate-600">
                <div 
                    className="bg-gradient-to-r from-indigo-500 to-cyan-400 h-full" 
                    style={{ width: `${(user.score % 1000) / 10}%` }}
                ></div>
            </div>
            <div className="flex justify-between text-[10px] font-mono text-cyan-400 mt-1">
                <span>{user.score} XP</span>
                <span>NEXT LVL</span>
            </div>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 gap-3 mb-8">
        <div className="bg-slate-800/50 border border-slate-700 p-3 rounded-xl flex items-center justify-between">
            <div>
                <span className="block text-[10px] text-slate-400 uppercase font-bold">Streak</span>
                <span className="text-lg font-black text-orange-400">🔥 {user.streak}</span>
            </div>
        </div>
        <div className="bg-slate-800/50 border border-slate-700 p-3 rounded-xl flex items-center justify-between">
             <div>
                <span className="block text-[10px] text-slate-400 uppercase font-bold">Questões</span>
                <span className="text-lg font-black text-cyan-400">⚡ {user.questionsAnswered}</span>
            </div>
             {!user.isPremium && (
                <span className="text-[10px] bg-red-500/20 text-red-400 px-2 py-1 rounded border border-red-500/50">
                    {Math.max(0, 20 - user.questionsAnswered)} Left
                </span>
            )}
        </div>
      </div>

      {/* Main Action - BOSS RAID */}
      <h3 className="text-xs font-bold text-slate-500 mb-3 uppercase tracking-widest pl-1">Daily Quest</h3>
      <button 
        onClick={() => onStartSubject(null)}
        className="w-full p-1 rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 mb-8 shadow-lg shadow-purple-900/50 group active:scale-95 transition-all"
      >
        <div className="bg-slate-900 rounded-xl p-5 border border-white/10 relative overflow-hidden group-hover:bg-slate-900/90 transition-colors">
            {/* Animated Glint */}
            <div className="absolute top-0 left-[-100%] w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent transform skew-x-12 transition-all duration-1000 group-hover:left-[100%]"></div>
            
            <div className="flex items-center justify-between relative z-10">
                <div className="flex items-center gap-4">
                    <div className="text-4xl filter drop-shadow-[0_0_10px_rgba(168,85,247,0.5)]">⚔️</div>
                    <div className="text-left">
                        <span className="block text-white font-black text-lg uppercase italic tracking-wider">Simulado Geral</span>
                        <span className="block text-purple-300 text-xs font-mono">Recompensa: XP em dobro</span>
                    </div>
                </div>
                <div className="animate-pulse bg-white text-purple-900 font-bold text-xs px-2 py-1 rounded">START</div>
            </div>
        </div>
      </button>

      {/* Missions Grid */}
      <h3 className="text-xs font-bold text-slate-500 mb-3 uppercase tracking-widest pl-1">Training Modules</h3>
      <div className="grid grid-cols-2 gap-3 mb-6">
        {subjects.map((sub) => (
          <button 
            key={sub.id}
            onClick={() => onStartSubject(sub.id)}
            className={`p-4 rounded-xl border-b-4 bg-slate-800 hover:brightness-110 active:border-b-0 active:translate-y-1 transition-all flex flex-col items-center justify-center gap-2 ${sub.color.replace('text-', 'border-').split(' ')[0]} border-opacity-50`}
          >
             <span className="text-2xl filter drop-shadow-md">{sub.icon}</span>
             <span className={`text-xs font-bold uppercase text-center ${sub.color.split(' ')[1]}`}>{sub.label}</span>
          </button>
        ))}
      </div>

      {/* Special Items / Premium */}
      <h3 className="text-xs font-bold text-slate-500 mb-3 uppercase tracking-widest pl-1">Inventory & Upgrades</h3>
      <div className="grid grid-cols-1 gap-3">
        
        {/* Mentor Report */}
        <div onClick={onOpenReport} className="bg-slate-800 border border-slate-700 p-4 rounded-xl flex items-center justify-between cursor-pointer hover:bg-slate-750 active:scale-95 transition-all">
             <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-cyan-900/30 text-cyan-400 rounded-lg border border-cyan-500/30 flex items-center justify-center text-xl">
                    🤖
                </div>
                <div>
                    <h4 className="font-bold text-slate-200 text-sm">Relatório Mentor</h4>
                    <p className="text-slate-500 text-xs">Análise de combate</p>
                </div>
            </div>
            <div className="text-slate-600">➜</div>
        </div>

        <div className="grid grid-cols-2 gap-3">
            {/* Study Plan */}
            <button 
                onClick={onOpenStudyPlan}
                className="bg-slate-800 border border-slate-700 p-3 rounded-xl text-left relative overflow-hidden group hover:border-purple-500/50 transition-colors"
            >
                <div className="flex justify-between items-start mb-2">
                    <span className="text-2xl">🗺️</span>
                    {!user.isPremium && <span className="text-[9px] bg-slate-950 text-gold border border-gold rounded px-1">LOCKED</span>}
                </div>
                <h4 className="font-bold text-slate-200 text-sm leading-tight">Plano de Campanha</h4>
                <p className="text-[10px] text-slate-500 mt-1">Estudo adaptativo</p>
            </button>

            {/* Essay */}
            <button 
                onClick={onOpenEssay}
                className="bg-slate-800 border border-slate-700 p-3 rounded-xl text-left relative group hover:border-emerald-500/50 transition-colors"
            >
                <div className="flex justify-between items-start mb-2">
                    <span className="text-2xl">📜</span>
                    <span className="text-[9px] bg-emerald-900/50 text-emerald-400 border border-emerald-500/30 rounded px-1">{user.essayCredits} GEMS</span>
                </div>
                <h4 className="font-bold text-slate-200 text-sm leading-tight">Pergaminho</h4>
                <p className="text-[10px] text-slate-500 mt-1">Correção de Redação</p>
            </button>
        </div>

        {/* Global Challenge */}
        <div 
          onClick={onStartGlobal}
          className="mt-4 bg-gradient-to-r from-slate-800 to-slate-900 border border-slate-700 p-5 rounded-xl flex items-center justify-between cursor-pointer shadow-lg active:scale-95 transition-transform"
        >
             <div>
                 <div className="flex items-center gap-2 mb-1">
                    <span className="text-gold text-lg">👑</span>
                    <h4 className="font-black text-white text-lg italic uppercase">Ranked Match</h4>
                 </div>
                 <p className="text-slate-400 text-xs">Desafio Global. 5 Anos de Provas.</p>
             </div>
             <Button variant="gold" className="text-xs py-2 px-3">PLAY</Button>
        </div>

      </div>
    </div>
  );
};